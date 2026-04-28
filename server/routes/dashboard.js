const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { authenticateToken, requireRole } = require("../middleware/auth");

// GET /api/dashboard/overview
router.get("/overview", authenticateToken, requireRole("investor", "admin"), async (req, res) => {
  try {
    const userId = req.user.id;

    // --- Wallet balance (current) ---
    const userRes = await query(
      "SELECT wallet_balance FROM users WHERE id = $1",
      [userId]
    );
    const totalBalance = parseFloat(userRes.rows[0]?.wallet_balance || 0);

    // --- This month date boundaries ---
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

    // --- This month transactions ---
    const thisMonthTxRes = await query(
      `SELECT type, SUM(amount) as total
       FROM transactions
       WHERE user_id = $1
         AND created_at >= $2
         AND created_at < $3
       GROUP BY type`,
      [userId, thisMonthStart, now]
    );

    // --- Last month transactions ---
    const lastMonthTxRes = await query(
      `SELECT type, SUM(amount) as total
       FROM transactions
       WHERE user_id = $1
         AND created_at >= $2
         AND created_at < $3
       GROUP BY type`,
      [userId, lastMonthStart, lastMonthEnd]
    );

    const sumByType = (rows) => {
      const map = {};
      for (const row of rows) {
        map[row.type] = parseFloat(row.total || 0);
      }
      return map;
    };

    const thisMonth = sumByType(thisMonthTxRes.rows);
    const lastMonth = sumByType(lastMonthTxRes.rows);

    const totalEarnings = Math.max(0, thisMonth["income"] || 0) + Math.max(0, thisMonth["rent"] || 0);
    const lastEarnings = Math.max(0, lastMonth["income"] || 0) + Math.max(0, lastMonth["rent"] || 0);
    const earningsChangePercent = lastEarnings === 0
      ? (totalEarnings > 0 ? 100 : 0)
      : parseFloat((((totalEarnings - lastEarnings) / lastEarnings) * 100).toFixed(2));

    const totalSpending = Math.abs(thisMonth["expense"] || 0) + Math.abs(thisMonth["transfer"] || 0);
    const lastSpending = Math.abs(lastMonth["expense"] || 0) + Math.abs(lastMonth["transfer"] || 0);
    const spendingChangePercent = lastSpending === 0
      ? (totalSpending > 0 ? 100 : 0)
      : parseFloat((((totalSpending - lastSpending) / lastSpending) * 100).toFixed(2));

    // --- Balance change vs last month ---
    // Approximate last month's ending balance by reversing this month's net
    const thisMonthNet = totalEarnings - totalSpending;
    const lastMonthBalance = totalBalance - thisMonthNet;
    const balanceChangePercent = lastMonthBalance === 0
      ? (totalBalance > 0 ? 100 : 0)
      : parseFloat((((totalBalance - lastMonthBalance) / Math.abs(lastMonthBalance)) * 100).toFixed(2));

    // --- Properties linked to this investor ---
    const thisMonthPropsRes = await query(
      `SELECT COUNT(*) as count
       FROM investor_properties
       WHERE investor_id = $1`,
      [userId]
    );
    const lastMonthPropsRes = await query(
      `SELECT COUNT(*) as count
       FROM investor_properties
       WHERE investor_id = $1
         AND invested_at < $2`,
      [userId, lastMonthEnd]
    );
    const propertiesCount = parseInt(thisMonthPropsRes.rows[0]?.count || 0);
    const lastPropertiesCount = parseInt(lastMonthPropsRes.rows[0]?.count || 0);
    const propertiesChangePercent = lastPropertiesCount === 0
      ? (propertiesCount > 0 ? 100 : 0)
      : parseFloat((((propertiesCount - lastPropertiesCount) / lastPropertiesCount) * 100).toFixed(2));

    // --- Documents count ---
    const docsRes = await query(
      "SELECT COUNT(*) as count FROM documents WHERE user_id = $1",
      [userId]
    );
    const documentsCount = parseInt(docsRes.rows[0]?.count || 0);

    // --- Wallets (USD as main, EUR and GBP derived) ---
    const FX = { EUR: 0.92, GBP: 0.79 };
    const wallets = [
      { currency: "USD", symbol: "$", balance: parseFloat(totalBalance.toFixed(2)) },
      { currency: "EUR", symbol: "€", balance: parseFloat((totalBalance * FX.EUR).toFixed(2)) },
      { currency: "GBP", symbol: "£", balance: parseFloat((totalBalance * FX.GBP).toFixed(2)) },
    ];

    // --- Statistics for donut chart (this month totals) ---
    const rentalIncome = Math.max(0, thisMonth["rent"] || 0);
    const investments = Math.max(0, thisMonth["income"] || 0);
    const statisticsTotal = rentalIncome + investments;
    const rentalPercent = statisticsTotal === 0
      ? 0
      : parseFloat(((rentalIncome / statisticsTotal) * 100).toFixed(1));
    const investmentsPercent = statisticsTotal === 0
      ? 0
      : parseFloat(((investments / statisticsTotal) * 100).toFixed(1));

    const statistics = {
      total: parseFloat(statisticsTotal.toFixed(2)),
      rentalIncome: parseFloat(rentalIncome.toFixed(2)),
      rentalPercent,
      investments: parseFloat(investments.toFixed(2)),
      investmentsPercent,
    };

    // --- Quick transfer contacts (most recent unique transfer recipients from other users) ---
    const contactsRes = await query(
      `SELECT DISTINCT u.id, u.name, u.avatar as avatarUrl
       FROM users u
       WHERE u.id != $1
         AND u.role IN ('investor', 'admin')
       ORDER BY u.id
       LIMIT 5`,
      [userId]
    );
    const quickTransferContacts = contactsRes.rows.map((r) => ({
      id: r.id,
      name: r.name,
      avatarUrl: r.avatarurl || null,
    }));

    res.json({
      totalBalance: parseFloat(totalBalance.toFixed(2)),
      balanceChangePercent,
      totalEarnings: parseFloat(totalEarnings.toFixed(2)),
      earningsChangePercent,
      totalSpending: parseFloat(totalSpending.toFixed(2)),
      spendingChangePercent,
      propertiesCount,
      propertiesChangePercent,
      documentsCount,
      wallets,
      statistics,
      quickTransferContacts,
    });
  } catch (err) {
    console.error("Dashboard overview error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/dashboard/stats?period=week|month|year
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const period = req.query.period || "week";

    let sql;
    let params = [userId];

    if (period === "week") {
      // Last 7 days, grouped by day
      sql = `
        SELECT
          TO_CHAR(created_at, 'Dy') as label,
          TO_CHAR(created_at, 'YYYY-MM-DD') as date_key,
          SUM(CASE WHEN type IN ('rent') AND amount > 0 THEN amount ELSE 0 END) as rentalIncome,
          SUM(CASE WHEN type IN ('income') AND amount > 0 THEN amount ELSE 0 END) as investments
        FROM transactions
        WHERE user_id = $1
          AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY label, date_key
        ORDER BY date_key ASC
      `;
    } else if (period === "month") {
      // Last 4 weeks, grouped by ISO week
      sql = `
        SELECT
          'Week ' || TO_CHAR(created_at, 'W') as label,
          TO_CHAR(created_at, 'YYYY-IW') as date_key,
          SUM(CASE WHEN type IN ('rent') AND amount > 0 THEN amount ELSE 0 END) as rentalIncome,
          SUM(CASE WHEN type IN ('income') AND amount > 0 THEN amount ELSE 0 END) as investments
        FROM transactions
        WHERE user_id = $1
          AND created_at >= NOW() - INTERVAL '4 weeks'
        GROUP BY label, date_key
        ORDER BY date_key ASC
      `;
    } else {
      // year: last 12 months, grouped by month
      sql = `
        SELECT
          TO_CHAR(created_at, 'Mon') as label,
          TO_CHAR(created_at, 'YYYY-MM') as date_key,
          SUM(CASE WHEN type IN ('rent') AND amount > 0 THEN amount ELSE 0 END) as rentalIncome,
          SUM(CASE WHEN type IN ('income') AND amount > 0 THEN amount ELSE 0 END) as investments
        FROM transactions
        WHERE user_id = $1
          AND created_at >= NOW() - INTERVAL '12 months'
        GROUP BY label, date_key
        ORDER BY date_key ASC
      `;
    }

    const result = await query(sql, params);

    const data = result.rows.map((row) => ({
      label: row.label,
      rentalIncome: parseFloat(row.rentalincome || 0),
      investments: parseFloat(row.investments || 0),
    }));

    res.json({ period, data });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
