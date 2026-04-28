const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { authenticateToken, requireRole } = require("../middleware/auth");

// GET /api/properties
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { search, status, type } = req.query;
    let sql = "SELECT * FROM properties WHERE 1=1";
    const params = [];
    let idx = 1;

    if (search) {
      sql += ` AND (name ILIKE $${idx} OR location ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }
    if (status && status !== "All") {
      sql += ` AND status = $${idx}`;
      params.push(status);
      idx++;
    }
    if (type && type !== "All") {
      sql += ` AND type = $${idx}`;
      params.push(type);
      idx++;
    }

    sql += " ORDER BY created_at DESC";
    const result = await query(sql, params);

    const properties = await Promise.all(
      result.rows.map(async (prop) => {
        const milestonesRes = await query(
          "SELECT * FROM property_milestones WHERE property_id = $1 ORDER BY sort_order",
          [prop.id]
        );
        return { ...prop, milestones: milestonesRes.rows };
      })
    );

    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/properties/:id
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const result = await query("SELECT * FROM properties WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Property not found" });

    const property = result.rows[0];
    const milestones = await query(
      "SELECT * FROM property_milestones WHERE property_id = $1 ORDER BY sort_order",
      [property.id]
    );
    const units = await query(
      "SELECT * FROM units WHERE property_id = $1 ORDER BY unit_number",
      [property.id]
    );

    res.json({ ...property, milestones: milestones.rows, units: units.rows });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/properties
router.post("/", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { name, type, location, status, image, progress, occupancy, total_units, roi, milestones } = req.body;
    if (!name || !type || !location) {
      return res.status(400).json({ error: "Name, type, and location are required" });
    }

    const result = await query(
      `INSERT INTO properties (name, type, location, status, image, progress, occupancy, total_units, roi, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *`,
      [name, type, location, status || "Active", image || null, progress || 0, occupancy || 0, total_units || 0, roi || 0]
    );
    const property = result.rows[0];

    if (milestones && Array.isArray(milestones)) {
      for (let i = 0; i < milestones.length; i++) {
        await query(
          "INSERT INTO property_milestones (property_id, name, completed, sort_order) VALUES ($1, $2, $3, $4)",
          [property.id, milestones[i].name, milestones[i].completed || false, i]
        );
      }
    }

    res.status(201).json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/properties/:id
router.put("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { name, type, location, status, image, progress, occupancy, total_units, roi } = req.body;
    const result = await query(
      `UPDATE properties SET name=$1, type=$2, location=$3, status=$4, image=$5,
       progress=$6, occupancy=$7, total_units=$8, roi=$9, updated_at=NOW()
       WHERE id=$10 RETURNING *`,
      [name, type, location, status, image, progress, occupancy, total_units, roi, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Property not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/properties/:id
router.delete("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const result = await query("DELETE FROM properties WHERE id=$1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Property not found" });
    res.json({ message: "Property deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/properties/:id/units
router.get("/:id/units", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "SELECT u.*, ten.name as tenant_name, ten.email as tenant_email FROM units u LEFT JOIN tenants t ON t.unit_id = u.id LEFT JOIN users ten ON ten.id = t.user_id WHERE u.property_id = $1 ORDER BY u.unit_number",
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/properties/:id/units
router.post("/:id/units", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { unit_number, type, rent, status, floor, size_sqft } = req.body;
    if (!unit_number) return res.status(400).json({ error: "Unit number is required" });

    const result = await query(
      `INSERT INTO units (property_id, unit_number, type, rent, status, floor, size_sqft, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
      [req.params.id, unit_number, type || "Standard", rent || 0, status || "Available", floor || 1, size_sqft || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/properties/:propertyId/units/:unitId
router.put("/:propertyId/units/:unitId", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { unit_number, type, rent, status, floor, size_sqft } = req.body;
    const result = await query(
      `UPDATE units SET unit_number=$1, type=$2, rent=$3, status=$4, floor=$5, size_sqft=$6, updated_at=NOW()
       WHERE id=$7 AND property_id=$8 RETURNING *`,
      [unit_number, type, rent, status, floor, size_sqft, req.params.unitId, req.params.propertyId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Unit not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/properties/:propertyId/units/:unitId
router.delete("/:propertyId/units/:unitId", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const result = await query(
      "DELETE FROM units WHERE id=$1 AND property_id=$2 RETURNING id",
      [req.params.unitId, req.params.propertyId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Unit not found" });
    res.json({ message: "Unit deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
