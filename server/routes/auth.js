const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { query } = require("../db");
const { generateToken, authenticateToken } = require("../middleware/auth");

const MAX_ATTEMPTS = 7;
const WARN_AFTER = 2;
const LOCKOUT_MS = 15 * 60 * 1000;

const failedAttempts = new Map();

// Only expose the verification/reset code in API responses when SMTP is missing
// AND we are NOT in production. This prevents a misconfigured production
// deployment from leaking codes to anyone who can hit the endpoint.
const IS_PROD = process.env.NODE_ENV === "production";
const exposeDevCode = (code, devMode) => (devMode && !IS_PROD ? code : undefined);

function getAttemptInfo(email) {
  const info = failedAttempts.get(email) || { count: 0, lockedUntil: null };
  if (info.lockedUntil && Date.now() > info.lockedUntil) {
    failedAttempts.delete(email);
    return { count: 0, lockedUntil: null };
  }
  return info;
}

function recordFailure(email) {
  const info = getAttemptInfo(email);
  info.count += 1;
  if (info.count >= MAX_ATTEMPTS) {
    info.lockedUntil = Date.now() + LOCKOUT_MS;
  }
  failedAttempts.set(email, info);
  return info;
}

function clearAttempts(email) {
  failedAttempts.delete(email);
}

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

async function sendVerificationEmail(email, name, code) {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[DEV MODE] Verification code for ${email}: ${code}`);
    return { devMode: true, code };
  }

  const fromName = process.env.SMTP_FROM_NAME || "ClientFlow";
  const fromEmail = process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject: "Verify your ClientFlow account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8f9fb; border-radius: 16px;">
        <div style="background: #1e293b; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="color: #DDA04E; font-size: 28px; font-weight: bold;">H</span>
          <span style="color: white; font-size: 18px; font-weight: bold; margin-left: 8px;">ClientFlow</span>
        </div>
        <h2 style="color: #1e293b; margin: 0 0 8px 0;">Verify your email address</h2>
        <p style="color: #64748b; margin: 0 0 24px 0;">Hi ${name}, use the code below to complete your registration:</p>
        <div style="background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #1e293b;">${code}</span>
        </div>
        <p style="color: #94a3b8; font-size: 13px; margin: 0;">This code expires in 15 minutes. If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  return { devMode: false };
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const info = getAttemptInfo(normalizedEmail);

    if (info.lockedUntil) {
      const minutesLeft = Math.ceil((info.lockedUntil - Date.now()) / 60000);
      return res.status(429).json({
        error: `Account temporarily locked due to too many failed attempts. Please try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.`,
        locked: true,
      });
    }

    const result = await query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);

    if (result.rows.length === 0) {
      const updated = recordFailure(normalizedEmail);
      if (updated.lockedUntil) {
        return res.status(429).json({
          error: "Account temporarily locked due to too many failed attempts. Please try again in 15 minutes.",
          locked: true,
        });
      }
      const remaining = MAX_ATTEMPTS - updated.count;
      const warn = updated.count > WARN_AFTER && remaining > 0;
      return res.status(401).json({
        error: warn
          ? `Incorrect email or password. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining before your account is temporarily locked.`
          : "Incorrect email or password.",
        attemptsRemaining: remaining,
      });
    }

    const user = result.rows[0];

    if (user.status && user.status !== "Active") {
      return res.status(403).json({
        error: "Your account has been suspended. Please contact support.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      const updated = recordFailure(normalizedEmail);
      const remaining = MAX_ATTEMPTS - updated.count;

      if (updated.lockedUntil) {
        return res.status(429).json({
          error: "Account temporarily locked due to too many failed attempts. Please try again in 15 minutes.",
          locked: true,
        });
      }

      const warn = updated.count > WARN_AFTER && remaining > 0;
      return res.status(401).json({
        error: warn
          ? `Incorrect email or password. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining before your account is temporarily locked.`
          : "Incorrect email or password.",
        attemptsRemaining: remaining,
      });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        error: "Please verify your email address before signing in. Check your inbox for the verification code.",
        unverified: true,
        email: normalizedEmail,
      });
    }

    clearAttempts(normalizedEmail);
    await query("UPDATE users SET last_login = NOW() WHERE id = $1", [user.id]);

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "An error occurred while signing in. Please try again." });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "tenant", phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Full name is required." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email address is required." });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    const allowedRoles = ["investor", "tenant"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        error: "Invalid account type. Admin and Verda Farms accounts must be provisioned by an existing administrator.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await query("SELECT id, email_verified FROM users WHERE email = $1", [normalizedEmail]);
    if (existing.rows.length > 0) {
      if (!existing.rows[0].email_verified) {
        return res.status(409).json({
          error: "An account with this email already exists but is not verified. Please check your inbox for the code.",
          unverified: true,
          email: normalizedEmail,
        });
      }
      return res.status(409).json({ error: "An account with this email address already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await query(
      `INSERT INTO users (name, email, password_hash, role, phone, status, email_verified, created_at)
       VALUES ($1, $2, $3, $4, $5, 'Active', false, NOW())`,
      [name.trim(), normalizedEmail, passwordHash, role, phone || null]
    );

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await query(
      `INSERT INTO email_verifications (email, code, expires_at) VALUES ($1, $2, $3)`,
      [normalizedEmail, code, expiresAt]
    );

    const emailResult = await sendVerificationEmail(normalizedEmail, name.trim(), code);

    res.status(201).json({
      message: "Account created. Please check your email for a 6-digit verification code.",
      email: normalizedEmail,
      devCode: exposeDevCode(code, emailResult.devMode),
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "An error occurred while creating your account. Please try again." });
  }
});

// POST /api/auth/verify-email
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email and verification code are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const result = await query(
      `SELECT * FROM email_verifications
       WHERE email = $1 AND code = $2 AND used = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [normalizedEmail, code.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "The code is incorrect or has expired. Please request a new one.",
      });
    }

    await query(`UPDATE email_verifications SET used = true WHERE id = $1`, [result.rows[0].id]);
    await query(`UPDATE users SET email_verified = true WHERE email = $1`, [normalizedEmail]);

    const userResult = await query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);
    const user = userResult.rows[0];

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ error: "An error occurred during verification. Please try again." });
  }
});

// POST /api/auth/resend-verification
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email address is required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userResult = await query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "No account found with this email address." });
    }

    const user = userResult.rows[0];
    if (user.email_verified) {
      return res.status(400).json({ error: "This email address is already verified. Please sign in." });
    }

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await query(
      `INSERT INTO email_verifications (email, code, expires_at) VALUES ($1, $2, $3)`,
      [normalizedEmail, code, expiresAt]
    );

    const emailResult = await sendVerificationEmail(normalizedEmail, user.name, code);

    res.json({
      message: "A new verification code has been sent to your email.",
      devCode: exposeDevCode(code, emailResult.devMode),
    });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email address is required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userResult = await query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);

    if (userResult.rows.length === 0) {
      return res.json({
        message: "If an account with this email exists, a reset code has been sent.",
      });
    }

    const user = userResult.rows[0];

    await query("UPDATE password_resets SET used = true WHERE email = $1 AND used = false", [normalizedEmail]);

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await query(
      `INSERT INTO password_resets (email, code, expires_at) VALUES ($1, $2, $3)`,
      [normalizedEmail, code, expiresAt]
    );

    const transporter = createTransporter();
    if (!transporter) {
      if (IS_PROD) {
        console.error(
          "[auth] SMTP is not configured — password reset email cannot be sent in production."
        );
        return res.status(503).json({
          error:
            "Password reset is temporarily unavailable. Please contact support.",
        });
      }
      console.log(`[DEV MODE] Password reset code for ${normalizedEmail}: ${code}`);
      return res.json({
        message: "If an account with this email exists, a reset code has been sent.",
        devCode: code,
        name: user.name,
      });
    }

    const fromName = process.env.SMTP_FROM_NAME || "ClientFlow";
    const fromEmail = process.env.SMTP_USER;

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: normalizedEmail,
      subject: "Reset your ClientFlow password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8f9fb; border-radius: 16px;">
          <div style="background: #1e293b; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="color: #DDA04E; font-size: 28px; font-weight: bold;">H</span>
            <span style="color: white; font-size: 18px; font-weight: bold; margin-left: 8px;">ClientFlow</span>
          </div>
          <h2 style="color: #1e293b; margin: 0 0 8px 0;">Reset your password</h2>
          <p style="color: #64748b; margin: 0 0 24px 0;">Hi ${user.name}, use the code below to reset your password:</p>
          <div style="background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #1e293b;">${code}</span>
          </div>
          <p style="color: #94a3b8; font-size: 13px; margin: 0;">This code expires in 15 minutes. If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });

    res.json({
      message: "If an account with this email exists, a reset code has been sent.",
      name: user.name,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "Email, code, and new password are required." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters long." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const result = await query(
      `SELECT * FROM password_resets
       WHERE email = $1 AND code = $2 AND used = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [normalizedEmail, code.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "The code is incorrect or has expired. Please request a new one.",
      });
    }

    await query("UPDATE password_resets SET used = true WHERE id = $1", [result.rows[0].id]);

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await query("UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2", [passwordHash, normalizedEmail]);

    res.json({ message: "Password reset successfully. You can now sign in with your new password." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

// POST /api/auth/verify-reset-code — just validates the code without resetting
router.post("/verify-reset-code", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const result = await query(
      `SELECT id FROM password_resets
       WHERE email = $1 AND code = $2 AND used = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [normalizedEmail, code.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "The code is incorrect or has expired." });
    }

    res.json({ valid: true });
  } catch (err) {
    console.error("Verify reset code error:", err);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

// GET /api/auth/me
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "SELECT id, name, email, role, avatar, phone, created_at, last_login FROM users WHERE id = $1",
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
