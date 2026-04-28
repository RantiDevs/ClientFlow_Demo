const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { authenticateToken, requireRole } = require("../middleware/auth");

// GET /api/investors
router.get("/", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { search, status } = req.query;
    let sql = `SELECT u.id, u.name, u.email, u.phone, u.avatar, u.wallet_balance,
                      u.created_at, u.last_login, u.status,
                      COUNT(DISTINCT ip.property_id) as properties_count,
                      COALESCE(SUM(ip.investment_amount), 0) as total_investment
               FROM users u
               LEFT JOIN investor_properties ip ON ip.investor_id = u.id
               WHERE u.role = 'investor'`;
    const params = [];
    let idx = 1;

    if (search) {
      sql += ` AND (u.name ILIKE $${idx} OR u.email ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }
    if (status && status !== "All") {
      sql += ` AND u.status = $${idx}`;
      params.push(status);
      idx++;
    }

    sql += " GROUP BY u.id ORDER BY u.created_at DESC";
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/investors/me — current investor profile
router.get("/me", authenticateToken, requireRole("investor"), async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar, u.wallet_balance, u.created_at,
              COUNT(DISTINCT ip.property_id) as properties_count,
              COALESCE(SUM(ip.investment_amount), 0) as total_investment,
              COALESCE(AVG(p.roi), 0) as avg_roi
       FROM users u
       LEFT JOIN investor_properties ip ON ip.investor_id = u.id
       LEFT JOIN properties p ON p.id = ip.property_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Investor not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/investors/:id
router.get("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar, u.wallet_balance, u.status,
              u.created_at, u.last_login,
              COUNT(DISTINCT ip.property_id) as properties_count,
              COALESCE(SUM(ip.investment_amount), 0) as total_investment
       FROM users u
       LEFT JOIN investor_properties ip ON ip.investor_id = u.id
       WHERE u.id = $1 AND u.role = 'investor'
       GROUP BY u.id`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Investor not found" });

    const properties = await query(
      `SELECT p.*, ip.investment_amount, ip.invested_at
       FROM properties p
       JOIN investor_properties ip ON ip.property_id = p.id
       WHERE ip.investor_id = $1`,
      [req.params.id]
    );

    const transactions = await query(
      "SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10",
      [req.params.id]
    );

    res.json({
      ...result.rows[0],
      properties: properties.rows,
      recent_transactions: transactions.rows,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/investors — create investor account
router.post("/", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const bcrypt = require("bcryptjs");
    const { name, email, phone, password = "ClientFlow@2024", wallet_balance = 0 } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

    const existing = await query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existing.rows.length > 0) return res.status(409).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role, phone, wallet_balance, status, created_at)
       VALUES ($1, $2, $3, 'investor', $4, $5, 'Active', NOW()) RETURNING id, name, email, phone, wallet_balance, status`,
      [name, email.toLowerCase(), passwordHash, phone || null, wallet_balance]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/investors/:id
router.put("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { name, email, phone, status, wallet_balance } = req.body;
    const result = await query(
      `UPDATE users SET name=$1, email=$2, phone=$3, status=$4, wallet_balance=$5, updated_at=NOW()
       WHERE id=$6 AND role='investor' RETURNING id, name, email, phone, status, wallet_balance`,
      [name, email, phone, status, wallet_balance, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Investor not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/investors/:id/assign-property
router.post("/:id/assign-property", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { property_id, investment_amount } = req.body;
    if (!property_id) return res.status(400).json({ error: "Property ID required" });

    const existing = await query(
      "SELECT id FROM investor_properties WHERE investor_id = $1 AND property_id = $2",
      [req.params.id, property_id]
    );
    if (existing.rows.length > 0) return res.status(409).json({ error: "Already assigned" });

    await query(
      "INSERT INTO investor_properties (investor_id, property_id, investment_amount, invested_at) VALUES ($1, $2, $3, NOW())",
      [req.params.id, property_id, investment_amount || 0]
    );
    res.status(201).json({ message: "Property assigned successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/investors/me/portfolio
router.get("/me/portfolio", authenticateToken, requireRole("investor"), async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*, ip.investment_amount, ip.invested_at
       FROM properties p
       JOIN investor_properties ip ON ip.property_id = p.id
       WHERE ip.investor_id = $1
       ORDER BY ip.invested_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
