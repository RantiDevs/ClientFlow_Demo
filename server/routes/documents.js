const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { query } = require("../db");
const { authenticateToken, requireRole } = require("../middleware/auth");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/zip",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported"), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

// GET /api/documents
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { category, type } = req.query;
    let sql = `SELECT * FROM documents WHERE user_id = $1`;
    const params = [req.user.id];
    let idx = 2;

    if (category && category !== "All") {
      sql += ` AND category = $${idx}`;
      params.push(category);
      idx++;
    }
    if (type && type !== "All") {
      sql += ` AND doc_type = $${idx}`;
      params.push(type);
      idx++;
    }

    if (req.user.role === "admin") {
      sql = `SELECT d.*, u.name as user_name FROM documents d LEFT JOIN users u ON u.id = d.user_id WHERE 1=1`;
      const adminParams = [];
      let aIdx = 1;
      if (category && category !== "All") {
        sql += ` AND d.category = $${aIdx}`;
        adminParams.push(category);
        aIdx++;
      }
      sql += " ORDER BY d.created_at DESC";
      const result = await query(sql, adminParams);
      return res.json(result.rows);
    }

    sql += " ORDER BY created_at DESC";
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/documents/upload
router.post("/upload", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { category, name } = req.body;
    const fileExt = path.extname(req.file.originalname).toUpperCase().replace(".", "");
    const fileSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;

    const result = await query(
      `INSERT INTO documents (user_id, name, file_path, file_size, doc_type, category, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'Available', NOW()) RETURNING *`,
      [
        req.user.id,
        name || req.file.originalname,
        req.file.filename,
        fileSize,
        fileExt,
        category || "General",
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/documents/:id/download
router.get("/:id/download", authenticateToken, async (req, res) => {
  try {
    const result = await query("SELECT * FROM documents WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Document not found" });

    const doc = result.rows[0];
    if (doc.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const filePath = path.join(uploadDir, doc.file_path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on disk" });
    }

    res.download(filePath, doc.name);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/documents — create document record (admin)
router.post("/", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { user_id, name, doc_type, category, file_size, status } = req.body;
    if (!name) return res.status(400).json({ error: "Document name required" });

    const result = await query(
      `INSERT INTO documents (user_id, name, doc_type, category, file_size, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [user_id || req.user.id, name, doc_type || "PDF", category || "General", file_size || "—", status || "Available"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/documents/:id
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM documents WHERE id = $1 AND (user_id = $2 OR $3 = 'admin')",
      [req.params.id, req.user.id, req.user.role]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Document not found" });

    const doc = result.rows[0];
    if (doc.file_path) {
      const filePath = path.join(uploadDir, doc.file_path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await query("DELETE FROM documents WHERE id = $1", [req.params.id]);
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
