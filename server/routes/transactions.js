const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { authenticateToken, requireRole } = require("../middleware/auth");

// GET /api/transactions
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { type, status, limit = 50, offset = 0, user_id } = req.query;
    let sql = `SELECT t.*, u.name as user_name, p.name as property_name
               FROM transactions t
               LEFT JOIN users u ON u.id = t.user_id
               LEFT JOIN properties p ON p.id = t.property_id
               WHERE 1=1`;
    const params = [];
    let idx = 1;

    if (req.user.role === "investor") {
      sql += ` AND t.user_id = $${idx}`;
      params.push(req.user.id);
      idx++;
    } else if (req.user.role === "tenant") {
      sql += ` AND t.user_id = $${idx}`;
      params.push(req.user.id);
      idx++;
    } else if (user_id && req.user.role === "admin") {
      sql += ` AND t.user_id = $${idx}`;
      params.push(user_id);
      idx++;
    }

    if (type && type !== "All") {
      sql += ` AND t.type = $${idx}`;
      params.push(type);
      idx++;
    }
    if (status && status !== "All") {
      sql += ` AND t.status = $${idx}`;
      params.push(status);
      idx++;
    }

    // Build the count query using the SAME filter clause as the list query so
    // non-admin users cannot infer global transaction volume from the total.
    let countSql = `SELECT COUNT(*) FROM transactions t WHERE 1=1`;
    const countParams = [];
    let cIdx = 1;
    if (req.user.role === "investor" || req.user.role === "tenant") {
      countSql += ` AND t.user_id = $${cIdx}`;
      countParams.push(req.user.id);
      cIdx++;
    } else if (user_id && req.user.role === "admin") {
      countSql += ` AND t.user_id = $${cIdx}`;
      countParams.push(user_id);
      cIdx++;
    }
    if (type && type !== "All") {
      countSql += ` AND t.type = $${cIdx}`;
      countParams.push(type);
      cIdx++;
    }
    if (status && status !== "All") {
      countSql += ` AND t.status = $${cIdx}`;
      countParams.push(status);
      cIdx++;
    }

    sql += ` ORDER BY t.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
    params.push(Number(limit), Number(offset));

    const result = await query(sql, params);
    const countResult = await query(countSql, countParams);
    res.json({ transactions: result.rows, total: parseInt(countResult.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/transactions/financials — monthly income/expense chart data
// Admins see global aggregates; all other roles see only their own transactions.
router.get("/financials", authenticateToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const sql = `SELECT
         TO_CHAR(created_at, 'Mon') as month,
         EXTRACT(MONTH FROM created_at) as month_num,
         EXTRACT(YEAR FROM created_at) as year,
         SUM(CASE WHEN type = 'income' AND amount > 0 THEN amount ELSE 0 END) as income,
         SUM(CASE WHEN type = 'expense' OR amount < 0 THEN ABS(amount) ELSE 0 END) as expense
       FROM transactions
       WHERE created_at >= NOW() - INTERVAL '6 months'${isAdmin ? "" : " AND user_id = $1"}
       GROUP BY month, month_num, year
       ORDER BY year, month_num`;
    const result = await query(sql, isAdmin ? [] : [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/transactions/:id
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT t.*, u.name as user_name, p.name as property_name
       FROM transactions t
       LEFT JOIN users u ON u.id = t.user_id
       LEFT JOIN properties p ON p.id = t.property_id
       WHERE t.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Transaction not found" });

    const trx = result.rows[0];
    if (req.user.role !== "admin" && trx.user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not have access to this transaction." });
    }

    res.json(trx);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/transactions
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { description, amount, type, property_id, status, reference_id } = req.body;
    if (!description || amount === undefined || !type) {
      return res.status(400).json({ error: "Description, amount, and type are required" });
    }

    const result = await query(
      `INSERT INTO transactions (user_id, description, amount, type, property_id, status, reference_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
      [req.user.id, description, amount, type, property_id || null, status || "completed", reference_id || null]
    );

    if (type === "income" && amount > 0) {
      await query("UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id = $2", [amount, req.user.id]);
    } else if (type === "expense" || amount < 0) {
      await query("UPDATE users SET wallet_balance = wallet_balance - $1 WHERE id = $2", [Math.abs(amount), req.user.id]);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/transactions/transfer
router.post("/transfer", authenticateToken, async (req, res) => {
  try {
    const { amount, recipient_name, note } = req.body;
    if (!amount || !recipient_name) {
      return res.status(400).json({ error: "Amount and recipient are required" });
    }
    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }

    const balanceRes = await query("SELECT wallet_balance FROM users WHERE id = $1", [req.user.id]);
    const balance = parseFloat(balanceRes.rows[0]?.wallet_balance || 0);
    if (balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const result = await query(
      `INSERT INTO transactions (user_id, description, amount, type, status, created_at)
       VALUES ($1, $2, $3, 'transfer', 'completed', NOW()) RETURNING *`,
      [req.user.id, `Transfer to ${recipient_name}${note ? " — " + note : ""}`, -Math.abs(amount)]
    );

    await query("UPDATE users SET wallet_balance = wallet_balance - $1 WHERE id = $2", [Math.abs(amount), req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/transactions/:id
router.put("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { description, amount, type, status } = req.body;
    const result = await query(
      `UPDATE transactions SET description=$1, amount=$2, type=$3, status=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [description, amount, type, status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Transaction not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
