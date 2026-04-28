const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { authenticateToken, requireRole } = require("../middleware/auth");

// GET /api/tenants
router.get("/", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { search, status, payment_status } = req.query;
    let sql = `SELECT u.id, u.name, u.email, u.phone, u.avatar, u.status, u.created_at,
                      t.id as tenant_id, t.lease_start, t.lease_end, t.payment_status, t.rent,
                      un.unit_number, p.name as property_name, p.id as property_id
               FROM users u
               JOIN tenants t ON t.user_id = u.id
               LEFT JOIN units un ON un.id = t.unit_id
               LEFT JOIN properties p ON p.id = un.property_id
               WHERE u.role = 'tenant'`;
    const params = [];
    let idx = 1;

    if (search) {
      sql += ` AND (u.name ILIKE $${idx} OR u.email ILIKE $${idx} OR un.unit_number ILIKE $${idx} OR p.name ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }
    if (status && status !== "All") {
      sql += ` AND u.status = $${idx}`;
      params.push(status);
      idx++;
    }
    if (payment_status && payment_status !== "All") {
      sql += ` AND t.payment_status = $${idx}`;
      params.push(payment_status);
      idx++;
    }

    sql += " ORDER BY u.created_at DESC";
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/tenants/me
router.get("/me", authenticateToken, requireRole("tenant"), async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar, u.wallet_balance,
              t.id as tenant_id, t.lease_start, t.lease_end, t.payment_status, t.rent,
              t.questionnaire_completed,
              un.unit_number, un.type as unit_type, un.floor, un.size_sqft,
              p.name as property_name, p.location, p.image as property_image
       FROM users u
       JOIN tenants t ON t.user_id = u.id
       LEFT JOIN units un ON un.id = t.unit_id
       LEFT JOIN properties p ON p.id = un.property_id
       WHERE u.id = $1`,
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Tenant profile not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/tenants/:id
router.get("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar, u.status,
              t.id as tenant_id, t.lease_start, t.lease_end, t.payment_status, t.rent,
              un.unit_number, p.name as property_name
       FROM users u
       JOIN tenants t ON t.user_id = u.id
       LEFT JOIN units un ON un.id = t.unit_id
       LEFT JOIN properties p ON p.id = un.property_id
       WHERE u.id = $1 AND u.role = 'tenant'`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Tenant not found" });

    const tickets = await query(
      "SELECT * FROM maintenance_tickets WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5",
      [req.params.id]
    );
    const transactions = await query(
      "SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5",
      [req.params.id]
    );

    res.json({ ...result.rows[0], tickets: tickets.rows, transactions: transactions.rows });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/tenants — create tenant
router.post("/", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const bcrypt = require("bcryptjs");
    const { name, email, phone, unit_id, rent, lease_start, lease_end, password = "ClientFlow@2024" } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

    const existing = await query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existing.rows.length > 0) return res.status(409).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 12);
    const userResult = await query(
      `INSERT INTO users (name, email, password_hash, role, phone, status, created_at)
       VALUES ($1, $2, $3, 'tenant', $4, 'Active', NOW()) RETURNING id`,
      [name, email.toLowerCase(), passwordHash, phone || null]
    );
    const userId = userResult.rows[0].id;

    const tenantResult = await query(
      `INSERT INTO tenants (user_id, unit_id, rent, lease_start, lease_end, payment_status, questionnaire_completed)
       VALUES ($1, $2, $3, $4, $5, 'Pending', false) RETURNING *`,
      [userId, unit_id || null, rent || 0, lease_start || null, lease_end || null]
    );

    if (unit_id) {
      await query("UPDATE units SET status = 'Occupied' WHERE id = $1", [unit_id]);
    }

    res.status(201).json({ user_id: userId, ...tenantResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/tenants/:id
router.put("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { name, phone, status, rent, lease_end, payment_status } = req.body;
    await query(
      "UPDATE users SET name=$1, phone=$2, status=$3, updated_at=NOW() WHERE id=$4 AND role='tenant'",
      [name, phone, status, req.params.id]
    );
    const result = await query(
      "UPDATE tenants SET rent=$1, lease_end=$2, payment_status=$3, updated_at=NOW() WHERE user_id=$4 RETURNING *",
      [rent, lease_end, payment_status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/tenants/me/questionnaire
router.post("/me/questionnaire", authenticateToken, requireRole("tenant"), async (req, res) => {
  try {
    const { responses } = req.body;
    await query(
      `INSERT INTO tenant_questionnaires (user_id, responses, submitted_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id) DO UPDATE SET responses = $2, submitted_at = NOW()`,
      [req.user.id, JSON.stringify(responses || {})]
    );
    await query(
      "UPDATE tenants SET questionnaire_completed = true WHERE user_id = $1",
      [req.user.id]
    );
    res.json({ message: "Questionnaire submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/tenants/me/pay-rent
router.post("/me/pay-rent", authenticateToken, requireRole("tenant"), async (req, res) => {
  try {
    const tenantRes = await query("SELECT * FROM tenants WHERE user_id = $1", [req.user.id]);
    if (tenantRes.rows.length === 0) return res.status(404).json({ error: "Tenant profile not found" });
    const tenant = tenantRes.rows[0];

    const result = await query(
      `INSERT INTO transactions (user_id, description, amount, type, status, created_at)
       VALUES ($1, 'Monthly Rent Payment', $2, 'expense', 'completed', NOW()) RETURNING *`,
      [req.user.id, tenant.rent]
    );

    await query(
      "UPDATE tenants SET payment_status = 'Paid', last_payment_date = NOW() WHERE user_id = $1",
      [req.user.id]
    );

    res.status(201).json({ message: "Rent paid successfully", transaction: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
