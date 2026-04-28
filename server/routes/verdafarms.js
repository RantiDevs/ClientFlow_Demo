const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { authenticateToken, requireRole } = require("../middleware/auth");

// GET /api/verdafarms/dashboard
router.get("/dashboard", authenticateToken, requireRole("verdafarms"), async (req, res) => {
  try {
    const plots = await query("SELECT * FROM farm_plots WHERE user_id = $1", [req.user.id]);
    const totalInvestment = plots.rows.reduce((sum, p) => sum + parseFloat(p.investment_amount || 0), 0);
    const activePlots = plots.rows.filter(p => ["Growing", "Planted", "Harvesting"].includes(p.status)).length;
    const avgRoi = plots.rows.length > 0 ? plots.rows.reduce((sum, p) => sum + parseFloat(p.roi_projection || 0), 0) / plots.rows.length : 0;
    const harvestingPlots = plots.rows.filter(p => p.status === "Harvesting").length;

    const yieldData = await query(
      "SELECT * FROM farm_yield_data WHERE user_id = $1 ORDER BY month_order",
      [req.user.id]
    );
    const reports = await query(
      "SELECT * FROM farm_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3",
      [req.user.id]
    );

    res.json({
      total_investment: totalInvestment,
      active_plots: activePlots,
      avg_roi: parseFloat(avgRoi.toFixed(1)),
      harvesting_plots: harvestingPlots,
      plots: plots.rows,
      yield_data: yieldData.rows,
      recent_reports: reports.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/verdafarms/plots
router.get("/plots", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM farm_plots WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/verdafarms/plots/:id
router.get("/plots/:id", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM farm_plots WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Plot not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/verdafarms/plots
router.post("/plots", authenticateToken, async (req, res) => {
  try {
    const {
      plot_name, size_sqm, crop, planting_date, expected_harvest_date,
      roi_projection, farm_manager, farm_manager_avatar, image, investment_amount
    } = req.body;

    if (!plot_name || !crop) return res.status(400).json({ error: "Plot name and crop are required" });

    const result = await query(
      `INSERT INTO farm_plots
         (user_id, plot_name, size_sqm, crop, planting_date, expected_harvest_date,
          roi_projection, farm_manager, farm_manager_avatar, image, status, investment_amount, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Preparing',$11,NOW()) RETURNING *`,
      [req.user.id, plot_name, size_sqm || 0, crop, planting_date || null,
       expected_harvest_date || null, roi_projection || 0, farm_manager || null,
       farm_manager_avatar || null, image || null, investment_amount || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/verdafarms/plots/:id
router.put("/plots/:id", authenticateToken, async (req, res) => {
  try {
    const { plot_name, size_sqm, crop, status, expected_harvest_date, roi_projection } = req.body;
    const result = await query(
      `UPDATE farm_plots SET plot_name=$1, size_sqm=$2, crop=$3, status=$4,
       expected_harvest_date=$5, roi_projection=$6, updated_at=NOW()
       WHERE id=$7 AND user_id=$8 RETURNING *`,
      [plot_name, size_sqm, crop, status, expected_harvest_date, roi_projection, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Plot not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/verdafarms/reports
router.get("/reports", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM farm_reports WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/verdafarms/reports
router.post("/reports", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { user_id, month, summary, yield_kg, revenue, expenses, notes } = req.body;
    const result = await query(
      `INSERT INTO farm_reports (user_id, month, summary, yield_kg, revenue, expenses, notes, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING *`,
      [user_id || req.user.id, month, summary || null, yield_kg || 0, revenue || 0, expenses || 0, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/verdafarms/documents
router.get("/documents", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM farm_documents WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/verdafarms/documents
router.post("/documents", authenticateToken, async (req, res) => {
  try {
    const { name, doc_type, category, file_size, status } = req.body;
    const result = await query(
      `INSERT INTO farm_documents (user_id, name, doc_type, category, file_size, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING *`,
      [req.user.id, name, doc_type || "download", category || "General", file_size || "—", status || "Available"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/verdafarms/crops
router.get("/crops", authenticateToken, async (req, res) => {
  try {
    const result = await query("SELECT * FROM crop_portfolio ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/verdafarms/yield-data
router.get("/yield-data", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM farm_yield_data WHERE user_id = $1 ORDER BY month_order",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/verdafarms/feedback
router.post("/feedback", authenticateToken, requireRole("verdafarms"), async (req, res) => {
  try {
    const { subject, message, rating } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const result = await query(
      `INSERT INTO farm_feedback (user_id, subject, message, rating, created_at)
       VALUES ($1,$2,$3,$4,NOW()) RETURNING *`,
      [req.user.id, subject || null, message, rating || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/verdafarms/feedback
router.get("/feedback", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const result = await query(
      `SELECT f.*, u.name as user_name FROM farm_feedback f
       LEFT JOIN users u ON u.id = f.user_id
       ORDER BY f.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
