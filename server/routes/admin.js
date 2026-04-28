const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { authenticateToken, requireRole } = require("../middleware/auth");

// GET /api/admin/stats — high-level dashboard stats
router.get("/stats", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const [
      investorCount,
      tenantCount,
      propertyCount,
      totalTransactions,
      openTickets,
      totalRevenue,
      occupancyAvg,
    ] = await Promise.all([
      query("SELECT COUNT(*) as count, COUNT(CASE WHEN status='Active' THEN 1 END) as active FROM users WHERE role='investor'"),
      query("SELECT COUNT(*) as count FROM users WHERE role='tenant'"),
      query("SELECT COUNT(*) as count, COUNT(CASE WHEN status='Active' THEN 1 END) as active FROM properties"),
      query("SELECT COUNT(*) as count, COALESCE(SUM(CASE WHEN type='income' AND amount>0 THEN amount ELSE 0 END),0) as total_income FROM transactions"),
      query("SELECT COUNT(*) as count FROM maintenance_tickets WHERE status != 'Resolved'"),
      query("SELECT COALESCE(SUM(CASE WHEN type='income' AND amount>0 THEN amount ELSE 0 END),0) as revenue FROM transactions WHERE created_at >= DATE_TRUNC('month', NOW())"),
      query("SELECT COALESCE(AVG(occupancy),0) as avg FROM properties WHERE status='Active'"),
    ]);

    res.json({
      investors: {
        total: parseInt(investorCount.rows[0].count),
        active: parseInt(investorCount.rows[0].active || 0),
      },
      tenants: {
        total: parseInt(tenantCount.rows[0].count),
      },
      properties: {
        total: parseInt(propertyCount.rows[0].count),
        active: parseInt(propertyCount.rows[0].active || 0),
      },
      transactions: {
        total: parseInt(totalTransactions.rows[0].count),
        total_income: parseFloat(totalTransactions.rows[0].total_income),
      },
      maintenance: {
        open_tickets: parseInt(openTickets.rows[0].count),
      },
      revenue_this_month: parseFloat(totalRevenue.rows[0].revenue),
      avg_occupancy: parseFloat(parseFloat(occupancyAvg.rows[0].avg).toFixed(1)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/users
router.get("/users", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { role, search, status } = req.query;
    let sql = "SELECT id, name, email, role, phone, status, created_at, last_login, wallet_balance FROM users WHERE 1=1";
    const params = [];
    let idx = 1;

    if (role && role !== "All") {
      sql += ` AND role = $${idx}`;
      params.push(role);
      idx++;
    }
    if (search) {
      sql += ` AND (name ILIKE $${idx} OR email ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }
    if (status && status !== "All") {
      sql += ` AND status = $${idx}`;
      params.push(status);
      idx++;
    }

    sql += " ORDER BY created_at DESC";
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/admin/users/:id/status
router.put("/users/:id/status", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Active", "Inactive", "Suspended"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const result = await query(
      "UPDATE users SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING id, name, email, status",
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/activity — recent activity feed
router.get("/activity", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const transactions = await query(
      `SELECT t.id, t.description, t.amount, t.type, t.status, t.created_at,
              u.name as user_name, 'transaction' as activity_type
       FROM transactions t
       LEFT JOIN users u ON u.id = t.user_id
       ORDER BY t.created_at DESC LIMIT 20`
    );

    const tickets = await query(
      `SELECT m.id, m.title as description, m.priority, m.status, m.created_at,
              u.name as user_name, 'maintenance' as activity_type
       FROM maintenance_tickets m
       LEFT JOIN users u ON u.id = m.user_id
       ORDER BY m.created_at DESC LIMIT 10`
    );

    const combined = [
      ...transactions.rows,
      ...tickets.rows,
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 20);

    res.json(combined);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
