const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { authenticateToken } = require("../middleware/auth");

// GET /api/messages
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
       FROM messages m
       LEFT JOIN users u ON u.id = m.sender_id
       WHERE m.recipient_id = $1 OR m.sender_id = $1
       ORDER BY m.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/messages/conversations
router.get("/conversations", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT DISTINCT ON (LEAST(m.sender_id, m.recipient_id), GREATEST(m.sender_id, m.recipient_id))
              m.*,
              s.name as sender_name, s.avatar as sender_avatar, s.role as sender_role,
              r.name as recipient_name, r.avatar as recipient_avatar,
              (SELECT COUNT(*) FROM messages WHERE recipient_id = $1 AND is_read = false AND sender_id != $1) as unread_count
       FROM messages m
       LEFT JOIN users s ON s.id = m.sender_id
       LEFT JOIN users r ON r.id = m.recipient_id
       WHERE m.sender_id = $1 OR m.recipient_id = $1
       ORDER BY LEAST(m.sender_id, m.recipient_id), GREATEST(m.sender_id, m.recipient_id), m.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/messages/thread/:userId
router.get("/thread/:userId", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
       FROM messages m
       LEFT JOIN users u ON u.id = m.sender_id
       WHERE (m.sender_id = $1 AND m.recipient_id = $2)
          OR (m.sender_id = $2 AND m.recipient_id = $1)
       ORDER BY m.created_at ASC`,
      [req.user.id, req.params.userId]
    );

    await query(
      "UPDATE messages SET is_read = true WHERE recipient_id = $1 AND sender_id = $2 AND is_read = false",
      [req.user.id, req.params.userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/messages
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { recipient_id, content, subject } = req.body;
    if (!recipient_id || !content) {
      return res.status(400).json({ error: "Recipient and content are required" });
    }

    const recipientCheck = await query("SELECT id FROM users WHERE id = $1", [recipient_id]);
    if (recipientCheck.rows.length === 0) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    const result = await query(
      `INSERT INTO messages (sender_id, recipient_id, content, subject, is_read, created_at)
       VALUES ($1, $2, $3, $4, false, NOW()) RETURNING *`,
      [req.user.id, recipient_id, content, subject || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/messages/:id/read
router.put("/:id/read", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "UPDATE messages SET is_read = true WHERE id = $1 AND recipient_id = $2 RETURNING *",
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Message not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/messages/read-all
router.put("/read-all", authenticateToken, async (req, res) => {
  try {
    await query(
      "UPDATE messages SET is_read = true WHERE recipient_id = $1 AND is_read = false",
      [req.user.id]
    );
    res.json({ message: "All messages marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/messages/:id
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "DELETE FROM messages WHERE id = $1 AND (sender_id = $2 OR recipient_id = $2) RETURNING id",
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Message not found" });
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
