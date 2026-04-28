require("dotenv").config();
const migrate = require("./scripts/migrate");
const app = require("./app");

const PORT = process.env.BACKEND_PORT || 3001;

async function start() {
  try {
    await migrate();
  } catch (err) {
    console.error("Startup migration failed:", err);
    process.exit(1);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ClientFlow API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

start();
