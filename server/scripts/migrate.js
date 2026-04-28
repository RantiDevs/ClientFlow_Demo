if (!process.env.DATABASE_URL) {
  require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
}
const { query } = require("../db");

async function migrate() {
  console.log("Running database migrations...");

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'tenant' CHECK (role IN ('investor','tenant','admin','verdafarms')),
      phone VARCHAR(50),
      avatar TEXT,
      wallet_balance NUMERIC(12,2) DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active','Inactive','Suspended')),
      email_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP,
      last_login TIMESTAMP
    )
  `);
  console.log("✓ users table");

  await query(`
    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100) NOT NULL,
      location VARCHAR(255) NOT NULL,
      status VARCHAR(100) DEFAULT 'Active',
      image TEXT,
      progress INTEGER DEFAULT 0,
      occupancy INTEGER DEFAULT 0,
      total_units INTEGER DEFAULT 0,
      roi NUMERIC(6,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )
  `);
  console.log("✓ properties table");

  await query(`
    CREATE TABLE IF NOT EXISTS property_milestones (
      id SERIAL PRIMARY KEY,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      completed BOOLEAN DEFAULT false,
      sort_order INTEGER DEFAULT 0
    )
  `);
  console.log("✓ property_milestones table");

  await query(`
    CREATE TABLE IF NOT EXISTS units (
      id SERIAL PRIMARY KEY,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      unit_number VARCHAR(50) NOT NULL,
      type VARCHAR(100) DEFAULT 'Standard',
      rent NUMERIC(10,2) DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Available' CHECK (status IN ('Available','Occupied','Maintenance')),
      floor INTEGER DEFAULT 1,
      size_sqft NUMERIC(8,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )
  `);
  console.log("✓ units table");

  await query(`
    CREATE TABLE IF NOT EXISTS tenants (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      unit_id INTEGER REFERENCES units(id) ON DELETE SET NULL,
      rent NUMERIC(10,2) DEFAULT 0,
      lease_start DATE,
      lease_end DATE,
      payment_status VARCHAR(50) DEFAULT 'Pending' CHECK (payment_status IN ('Paid','Pending','Overdue')),
      last_payment_date TIMESTAMP,
      questionnaire_completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )
  `);
  console.log("✓ tenants table");

  await query(`
    CREATE TABLE IF NOT EXISTS tenant_questionnaires (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      responses JSONB DEFAULT '{}',
      submitted_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("✓ tenant_questionnaires table");

  await query(`
    CREATE TABLE IF NOT EXISTS investor_properties (
      id SERIAL PRIMARY KEY,
      investor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      investment_amount NUMERIC(12,2) DEFAULT 0,
      invested_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(investor_id, property_id)
    )
  `);
  console.log("✓ investor_properties table");

  await query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
      description TEXT NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      type VARCHAR(50) NOT NULL CHECK (type IN ('income','expense','transfer','rent','refund')),
      status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('completed','pending','failed')),
      reference_id VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )
  `);
  console.log("✓ transactions table");

  await query(`
    CREATE TABLE IF NOT EXISTS maintenance_tickets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
      unit_id INTEGER REFERENCES units(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      priority VARCHAR(50) DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High','Critical')),
      status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending','In Progress','Resolved','Cancelled')),
      category VARCHAR(100) DEFAULT 'General',
      assigned_to VARCHAR(255),
      resolution_notes TEXT,
      resolved_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )
  `);
  console.log("✓ maintenance_tickets table");

  await query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      subject VARCHAR(255),
      content TEXT NOT NULL,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("✓ messages table");

  await query(`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      file_path TEXT,
      file_size VARCHAR(50) DEFAULT '—',
      doc_type VARCHAR(50) DEFAULT 'PDF',
      category VARCHAR(100) DEFAULT 'General',
      status VARCHAR(50) DEFAULT 'Available' CHECK (status IN ('Available','Pending','Signed')),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("✓ documents table");

  await query(`
    CREATE TABLE IF NOT EXISTS farm_plots (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      plot_name VARCHAR(255) NOT NULL,
      size_sqm NUMERIC(10,2) DEFAULT 0,
      crop VARCHAR(100) NOT NULL,
      planting_date DATE,
      expected_harvest_date DATE,
      roi_projection NUMERIC(6,2) DEFAULT 0,
      farm_manager VARCHAR(255),
      farm_manager_avatar TEXT,
      image TEXT,
      status VARCHAR(50) DEFAULT 'Preparing' CHECK (status IN ('Preparing','Planted','Growing','Harvesting','Sold')),
      investment_amount NUMERIC(12,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )
  `);
  console.log("✓ farm_plots table");

  await query(`
    CREATE TABLE IF NOT EXISTS farm_reports (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      month VARCHAR(50) NOT NULL,
      summary TEXT,
      yield_kg NUMERIC(10,2) DEFAULT 0,
      revenue NUMERIC(12,2) DEFAULT 0,
      expenses NUMERIC(12,2) DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("✓ farm_reports table");

  await query(`
    CREATE TABLE IF NOT EXISTS farm_documents (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      doc_type VARCHAR(50) DEFAULT 'download' CHECK (doc_type IN ('download','upload')),
      category VARCHAR(100) DEFAULT 'General',
      file_size VARCHAR(50) DEFAULT '—',
      status VARCHAR(50) DEFAULT 'Available' CHECK (status IN ('Available','Pending','Signed')),
      file_path TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("✓ farm_documents table");

  await query(`
    CREATE TABLE IF NOT EXISTS crop_portfolio (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      cycle_duration VARCHAR(100),
      avg_roi VARCHAR(50),
      risk_level VARCHAR(50) DEFAULT 'Low',
      image TEXT
    )
  `);
  console.log("✓ crop_portfolio table");

  await query(`
    CREATE TABLE IF NOT EXISTS farm_yield_data (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      month VARCHAR(50) NOT NULL,
      month_order INTEGER DEFAULT 0,
      projected NUMERIC(10,2) DEFAULT 0,
      actual NUMERIC(10,2) DEFAULT 0
    )
  `);
  console.log("✓ farm_yield_data table");

  await query(`
    CREATE TABLE IF NOT EXISTS farm_feedback (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      subject VARCHAR(255),
      message TEXT NOT NULL,
      rating INTEGER CHECK (rating BETWEEN 1 AND 5),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("✓ farm_feedback table");

  await query(`
    CREATE TABLE IF NOT EXISTS notification_settings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      email_notifications BOOLEAN DEFAULT true,
      sms_notifications BOOLEAN DEFAULT false,
      push_notifications BOOLEAN DEFAULT true,
      maintenance_updates BOOLEAN DEFAULT true,
      payment_alerts BOOLEAN DEFAULT true,
      monthly_reports BOOLEAN DEFAULT true,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("✓ notification_settings table");

  await query(`
    CREATE TABLE IF NOT EXISTS email_verifications (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      code VARCHAR(10) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("✓ email_verifications table");

  await query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      code VARCHAR(10) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("✓ password_resets table");

  console.log("\n✅ All migrations complete!");
}

module.exports = migrate;

if (require.main === module) {
  migrate().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
}
