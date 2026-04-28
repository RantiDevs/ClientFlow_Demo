require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const propertyRoutes = require("./routes/properties");
const transactionRoutes = require("./routes/transactions");
const maintenanceRoutes = require("./routes/maintenance");
const messageRoutes = require("./routes/messages");
const documentRoutes = require("./routes/documents");
const investorRoutes = require("./routes/investors");
const tenantRoutes = require("./routes/tenants");
const verdafarmsRoutes = require("./routes/verdafarms");
const adminRoutes = require("./routes/admin");
const settingsRoutes = require("./routes/settings");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Note: uploaded files are NOT served as public static assets.
// All document access goes through the authenticated download route at
// GET /api/documents/:id/download which enforces ownership/role checks.

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), version: "1.0.0" });
});

app.get("/api/healthz", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/investors", investorRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/verdafarms", verdafarmsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (err.name === "MulterError") {
    return res.status(400).json({ error: "File upload error: " + err.message });
  }
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
