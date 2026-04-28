require("dotenv").config();
const migrate = require("../server/scripts/migrate");
const app = require("../server/app");

let migrated = false;
let migratePromise = null;

function ensureMigrated() {
  if (migrated) return Promise.resolve();
  if (!migratePromise) {
    migratePromise = migrate()
      .then(() => {
        migrated = true;
      })
      .catch((err) => {
        console.error("Migration failed:", err);
        migratePromise = null;
        throw err;
      });
  }
  return migratePromise;
}

module.exports = async (req, res) => {
  await ensureMigrated();
  return app(req, res);
};
