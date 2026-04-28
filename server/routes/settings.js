const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { query } = require("../db");
const { authenticateToken } = require("../middleware/auth");

// GET /api/settings
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "SELECT id, name, email, phone, avatar, role, created_at, last_login FROM users WHERE id = $1",
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const notifResult = await query(
      "SELECT * FROM notification_settings WHERE user_id = $1",
      [req.user.id]
    );

    const notifSettings = notifResult.rows[0] || {
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
      maintenance_updates: true,
      payment_alerts: true,
      monthly_reports: true,
    };

    res.json({ user: result.rows[0], notifications: notifSettings });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/settings/profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const result = await query(
      "UPDATE users SET name=$1, phone=$2, avatar=$3, updated_at=NOW() WHERE id=$4 RETURNING id, name, email, phone, avatar",
      [name, phone || null, avatar || null, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/settings/password
router.put("/password", authenticateToken, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const result = await query("SELECT password_hash FROM users WHERE id = $1", [req.user.id]);
    const user = result.rows[0];
    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Current password is incorrect" });

    const newHash = await bcrypt.hash(new_password, 12);
    await query("UPDATE users SET password_hash=$1, updated_at=NOW() WHERE id=$2", [newHash, req.user.id]);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/settings/notifications
router.put("/notifications", authenticateToken, async (req, res) => {
  try {
    const {
      email_notifications, sms_notifications, push_notifications,
      maintenance_updates, payment_alerts, monthly_reports
    } = req.body;

    await query(
      `INSERT INTO notification_settings
         (user_id, email_notifications, sms_notifications, push_notifications, maintenance_updates, payment_alerts, monthly_reports)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (user_id) DO UPDATE SET
         email_notifications=$2, sms_notifications=$3, push_notifications=$4,
         maintenance_updates=$5, payment_alerts=$6, monthly_reports=$7, updated_at=NOW()`,
      [req.user.id, email_notifications, sms_notifications, push_notifications,
       maintenance_updates, payment_alerts, monthly_reports]
    );
    res.json({ message: "Notification settings updated" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
