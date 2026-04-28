const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { authenticateToken, requireRole } = require("../middleware/auth");

// GET /api/maintenance
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { status, priority, search, limit = 50, offset = 0 } = req.query;
    let sql = `SELECT m.*, u.name as tenant_name, u.email as tenant_email,
                      p.name as property_name
               FROM maintenance_tickets m
               LEFT JOIN users u ON u.id = m.user_id
               LEFT JOIN properties p ON p.id = m.property_id
               WHERE 1=1`;
    const params = [];
    let idx = 1;

    if (req.user.role === "tenant") {
      sql += ` AND m.user_id = $${idx}`;
      params.push(req.user.id);
      idx++;
    }

    if (status && status !== "All") {
      sql += ` AND m.status = $${idx}`;
      params.push(status);
      idx++;
    }
    if (priority && priority !== "All") {
      sql += ` AND m.priority = $${idx}`;
      params.push(priority);
      idx++;
    }
    if (search) {
      sql += ` AND (m.title ILIKE $${idx} OR m.description ILIKE $${idx} OR p.name ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }

    sql += ` ORDER BY m.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
    params.push(Number(limit), Number(offset));

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/maintenance/:id
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT m.*, u.name as tenant_name, u.email as tenant_email, p.name as property_name
       FROM maintenance_tickets m
       LEFT JOIN users u ON u.id = m.user_id
       LEFT JOIN properties p ON p.id = m.property_id
       WHERE m.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Ticket not found" });

    const ticket = result.rows[0];
    // Only admins or the ticket owner may view it.
    if (req.user.role !== "admin" && ticket.user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not have access to this ticket." });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/maintenance
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, property_id, unit_id, category } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const result = await query(
      `INSERT INTO maintenance_tickets (user_id, title, description, priority, property_id, unit_id, category, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending', NOW()) RETURNING *`,
      [req.user.id, title, description, priority || "Medium", property_id || null, unit_id || null, category || "General"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/maintenance/:id
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, status, assigned_to, resolution_notes } = req.body;

    const ownerCheck = await query("SELECT user_id FROM maintenance_tickets WHERE id = $1", [req.params.id]);
    if (ownerCheck.rows.length === 0) return res.status(404).json({ error: "Ticket not found" });
    // Only admins or the ticket owner may update it.
    if (req.user.role !== "admin" && ownerCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not have access to this ticket." });
    }

    const updates = [];
    const params = [];
    let idx = 1;

    if (title !== undefined) { updates.push(`title = $${idx}`); params.push(title); idx++; }
    if (description !== undefined) { updates.push(`description = $${idx}`); params.push(description); idx++; }
    if (priority !== undefined) { updates.push(`priority = $${idx}`); params.push(priority); idx++; }
    if (status !== undefined) {
      updates.push(`status = $${idx}`); params.push(status); idx++;
      if (status === "Resolved") {
        updates.push(`resolved_at = NOW()`);
      }
    }
    if (assigned_to !== undefined) { updates.push(`assigned_to = $${idx}`); params.push(assigned_to); idx++; }
    if (resolution_notes !== undefined) { updates.push(`resolution_notes = $${idx}`); params.push(resolution_notes); idx++; }

    updates.push(`updated_at = NOW()`);
    params.push(req.params.id);

    const result = await query(
      `UPDATE maintenance_tickets SET ${updates.join(", ")} WHERE id = $${idx} RETURNING *`,
      params
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Ticket not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/maintenance/:id
router.delete("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const result = await query("DELETE FROM maintenance_tickets WHERE id=$1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Ticket not found" });
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
