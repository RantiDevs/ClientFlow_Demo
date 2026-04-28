const jwt = require("jsonwebtoken");
const crypto = require("crypto");

let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET environment variable is required in production. Set it as a Replit Secret before starting the API server."
    );
  }
  // Development only: generate a fresh ephemeral secret on each restart.
  // Tokens issued before a restart will not validate after — no hardcoded fallback.
  JWT_SECRET = crypto.randomBytes(48).toString("base64url");
  console.warn(
    "[auth] JWT_SECRET not set. Generated an ephemeral development secret. " +
      "Configure JWT_SECRET as a Replit Secret to persist sessions across restarts."
  );
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = { authenticateToken, requireRole, generateToken };
