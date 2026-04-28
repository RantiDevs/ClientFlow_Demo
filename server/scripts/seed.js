require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const bcrypt = require("bcryptjs");
const { query } = require("../db");

async function seed() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("ClientFlow@2024", 12);

  const adminResult = await query(
    `INSERT INTO users (name, email, password_hash, role, phone, wallet_balance, status)
     VALUES ($1,$2,$3,'admin',$4,0,'Active')
     ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name, updated_at=NOW()
     RETURNING id`,
    ["System Admin", "admin@clientflow.com", passwordHash, "+1 (555) 000-0001"]
  );
  const adminId = adminResult.rows[0].id;
  console.log("✓ Admin user");

  const investorResult = await query(
    `INSERT INTO users (name, email, password_hash, role, phone, wallet_balance, status)
     VALUES ($1,$2,$3,'investor',$4,689372,'Active')
     ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name, wallet_balance=689372, updated_at=NOW()
     RETURNING id`,
    ["Alex Johnson", "investor@clientflow.com", passwordHash, "+1 (555) 100-2000"]
  );
  const investorId = investorResult.rows[0].id;
  console.log("✓ Investor user");

  const tenantResult = await query(
    `INSERT INTO users (name, email, password_hash, role, phone, wallet_balance, status)
     VALUES ($1,$2,$3,'tenant',$4,3500,'Active')
     ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name, updated_at=NOW()
     RETURNING id`,
    ["Sarah Williams", "tenant@clientflow.com", passwordHash, "+1 (555) 123-4567"]
  );
  const tenantId = tenantResult.rows[0].id;
  console.log("✓ Tenant user");

  const verdaResult = await query(
    `INSERT INTO users (name, email, password_hash, role, phone, wallet_balance, status)
     VALUES ($1,$2,$3,'verdafarms',$4,120000,'Active')
     ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name, updated_at=NOW()
     RETURNING id`,
    ["Emmanuel Okafor", "verdafarms@clientflow.com", passwordHash, "+234 801 234 5678"]
  );
  const verdaId = verdaResult.rows[0].id;
  console.log("✓ Verda Farms user");

  const extraInvestors = [
    ["Robert Fox", "robert.fox@example.com", "+1 (555) 101-2020", 450000],
    ["Eleanor Pena", "eleanor.p@example.com", "+1 (555) 202-3030", 120000],
    ["James Rodriguez", "james.r@example.com", "+1 (555) 303-4040", 280000],
    ["Aisha Patel", "aisha.p@example.com", "+1 (555) 404-5050", 95000],
  ];
  const extraInvestorIds = [];
  for (const [name, email, phone, balance] of extraInvestors) {
    const r = await query(
      `INSERT INTO users (name, email, password_hash, role, phone, wallet_balance, status)
       VALUES ($1,$2,$3,'investor',$4,$5,'Active')
       ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name, updated_at=NOW()
       RETURNING id`,
      [name, email, passwordHash, phone, balance]
    );
    extraInvestorIds.push(r.rows[0].id);
  }
  console.log("✓ Extra investor users");

  const extraTenants = [
    ["Michael Chen", "m.chen@example.com", "+1 (555) 234-5678"],
    ["Fatima Al-Hassan", "fatima.h@example.com", "+1 (555) 345-6789"],
    ["Priya Sharma", "priya.s@example.com", "+1 (555) 456-7890"],
  ];
  const extraTenantIds = [];
  for (const [name, email, phone] of extraTenants) {
    const r = await query(
      `INSERT INTO users (name, email, password_hash, role, phone, status)
       VALUES ($1,$2,$3,'tenant',$4,'Active')
       ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name, updated_at=NOW()
       RETURNING id`,
      [name, email, passwordHash, phone]
    );
    extraTenantIds.push(r.rows[0].id);
  }
  console.log("✓ Extra tenant users");

  const p1 = await query(
    `INSERT INTO properties (name, type, location, status, image, progress, occupancy, total_units, roi)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT DO NOTHING RETURNING id`,
    ["The Pavilion Hostel","Hostel","University District, Zone A","Active",
     "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
     100,92,50,12.5]
  );

  const p2 = await query(
    `INSERT INTO properties (name, type, location, status, image, progress, occupancy, total_units, roi)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT DO NOTHING RETURNING id`,
    ["Green Valley Estate","Land","North Hills","Completed",
     "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
     100,0,20,18.2]
  );

  const p3 = await query(
    `INSERT INTO properties (name, type, location, status, image, progress, occupancy, total_units, roi)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT DO NOTHING RETURNING id`,
    ["Sunrise Apartments","Construction","Downtown Edge","Under Management",
     "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
     65,0,12,0]
  );

  let p1Id, p2Id, p3Id;
  if (p1.rows.length > 0) {
    p1Id = p1.rows[0].id;
    p2Id = p2.rows[0].id;
    p3Id = p3.rows[0].id;

    for (const [name, completed, order] of [
      ["Foundation", true, 0], ["Structure", true, 1], ["Roofing", true, 2],
      ["Plumbing/Elec", false, 3], ["Finishing", false, 4]
    ]) {
      await query(
        "INSERT INTO property_milestones (property_id, name, completed, sort_order) VALUES ($1,$2,$3,$4)",
        [p3Id, name, completed, order]
      );
    }

    for (let i = 1; i <= 8; i++) {
      await query(
        `INSERT INTO units (property_id, unit_number, type, rent, status, floor, size_sqft)
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING`,
        [p1Id, `${Math.floor((i-1)/4) + 1}0${i}`, "Standard", 850, i <= 6 ? "Occupied" : "Available", Math.floor((i-1)/4)+1, 350]
      );
    }

    await query(
      "INSERT INTO investor_properties (investor_id, property_id, investment_amount) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING",
      [investorId, p1Id, 250000]
    );
    await query(
      "INSERT INTO investor_properties (investor_id, property_id, investment_amount) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING",
      [investorId, p2Id, 180000]
    );
    for (const [eid, pid, amt] of [[extraInvestorIds[0], p1Id, 200000],[extraInvestorIds[0], p2Id, 150000],[extraInvestorIds[1], p3Id, 120000]]) {
      await query(
        "INSERT INTO investor_properties (investor_id, property_id, investment_amount) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING",
        [eid, pid, amt]
      );
    }
    console.log("✓ Properties, milestones, units, investor assignments");
  } else {
    const existingProps = await query("SELECT id FROM properties ORDER BY id LIMIT 3");
    p1Id = existingProps.rows[0]?.id;
    p2Id = existingProps.rows[1]?.id;
    p3Id = existingProps.rows[2]?.id;
    console.log("✓ Properties already exist");
  }

  const unitRow = await query("SELECT id FROM units WHERE property_id = $1 LIMIT 1", [p1Id]);
  const unitId = unitRow.rows[0]?.id;

  await query(
    `INSERT INTO tenants (user_id, unit_id, rent, lease_start, lease_end, payment_status, questionnaire_completed)
     VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (user_id) DO UPDATE SET updated_at=NOW()`,
    [tenantId, unitId || null, 850, "2024-01-15", "2025-01-14", "Paid", true]
  );
  for (const tid of extraTenantIds) {
    await query(
      `INSERT INTO tenants (user_id, rent, lease_start, lease_end, payment_status, questionnaire_completed)
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (user_id) DO UPDATE SET updated_at=NOW()`,
      [tid, 850, "2024-03-01", "2025-02-28", "Pending", false]
    );
  }
  console.log("✓ Tenant profiles");

  const transactionData = [
    [investorId, "Monthly Rent - Unit 304", 850, "income", "completed", p1Id],
    [investorId, "Plumbing Repair - Pavilion", -120, "expense", "completed", p1Id],
    [investorId, "Management Fee (10%)", -450, "expense", "completed", p1Id],
    [investorId, "Monthly Rent - Unit 102", 850, "income", "completed", p1Id],
    [investorId, "ROI Distribution Q1", 25500, "income", "completed", null],
    [investorId, "Security Deposit Return", -40200, "expense", "completed", null],
    [tenantId, "Monthly Rent Payment", -850, "expense", "completed", null],
    [tenantId, "Security Deposit", -1700, "expense", "completed", null],
  ];
  for (const [uid, desc, amt, type, status, propId] of transactionData) {
    await query(
      `INSERT INTO transactions (user_id, description, amount, type, status, property_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6, NOW() - INTERVAL '${Math.floor(Math.random()*30)} days')
       ON CONFLICT DO NOTHING`,
      [uid, desc, amt, type, status, propId]
    );
  }
  console.log("✓ Transactions");

  const ticketData = [
    [tenantId, "AC Not Cooling", "The air conditioning in my unit stopped cooling effectively.", "High", "In Progress", p1Id, unitId],
    [tenantId, "Leaking Faucet", "Bathroom faucet has been dripping constantly.", "Low", "Pending", p1Id, unitId],
    [tenantId, "Internet Outage", "Common area Wi-Fi is completely down.", "Medium", "Resolved", p1Id, null],
  ];
  for (const [uid, title, desc, priority, status, propId, uId] of ticketData) {
    await query(
      `INSERT INTO maintenance_tickets (user_id, title, description, priority, status, property_id, unit_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7, NOW() - INTERVAL '${Math.floor(Math.random()*14)} days')
       ON CONFLICT DO NOTHING`,
      [uid, title, desc, priority, status, propId, uId]
    );
  }
  console.log("✓ Maintenance tickets");

  const adminUser = await query("SELECT id FROM users WHERE role='admin' LIMIT 1");
  const adminUserId = adminUser.rows[0]?.id;
  if (adminUserId) {
    await query(
      `INSERT INTO messages (sender_id, recipient_id, content, subject, is_read, created_at)
       VALUES ($1,$2,$3,$4,$5, NOW() - INTERVAL '2 hours')
       ON CONFLICT DO NOTHING`,
      [adminUserId, tenantId, "Your maintenance request has been scheduled for tomorrow at 10 AM.", "Maintenance Update", false]
    );
    await query(
      `INSERT INTO messages (sender_id, recipient_id, content, subject, is_read, created_at)
       VALUES ($1,$2,$3,$4,$5, NOW() - INTERVAL '1 day')
       ON CONFLICT DO NOTHING`,
      [adminUserId, tenantId, "Rent payment received. Thank you!", "Payment Confirmed", true]
    );
    await query(
      `INSERT INTO messages (sender_id, recipient_id, content, subject, is_read, created_at)
       VALUES ($1,$2,$3,$4,$5, NOW() - INTERVAL '3 days')
       ON CONFLICT DO NOTHING`,
      [adminUserId, investorId, "Your Q1 ROI report is now available in the documents section.", "ROI Report Ready", false]
    );
  }
  console.log("✓ Messages");

  await query(
    `INSERT INTO documents (user_id, name, doc_type, category, file_size, status, created_at)
     VALUES ($1,'Lease Agreement.pdf','PDF','Agreement','2.4 MB','Signed','2024-01-01')
     ON CONFLICT DO NOTHING`,
    [tenantId]
  );
  await query(
    `INSERT INTO documents (user_id, name, doc_type, category, file_size, status, created_at)
     VALUES ($1,'Monthly Statement - May.xlsx','Excel','Report','1.1 MB','Available','2024-06-01')
     ON CONFLICT DO NOTHING`,
    [tenantId]
  );
  await query(
    `INSERT INTO documents (user_id, name, doc_type, category, file_size, status, created_at)
     VALUES ($1,'Portfolio Summary Q1 2024.pdf','PDF','Report','3.2 MB','Available','2024-04-01')
     ON CONFLICT DO NOTHING`,
    [investorId]
  );
  console.log("✓ Documents");

  const fp1 = await query(
    `INSERT INTO farm_plots (user_id, plot_name, size_sqm, crop, planting_date, expected_harvest_date, roi_projection, farm_manager, farm_manager_avatar, status, investment_amount, image)
     VALUES ($1,'Plot A — Northfield',2500,'Cashew','2025-03-15','2026-09-15',22.5,'Adebayo Ogunleye','https://i.pravatar.cc/150?u=adebayo','Growing',75000,'https://images.unsplash.com/photo-1697567464321-3c152e4ba831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')
     ON CONFLICT DO NOTHING RETURNING id`,
    [verdaId]
  );
  await query(
    `INSERT INTO farm_plots (user_id, plot_name, size_sqm, crop, planting_date, expected_harvest_date, roi_projection, farm_manager, farm_manager_avatar, status, investment_amount, image)
     VALUES ($1,'Plot B — Riverside',1800,'Cassava','2025-06-01','2026-02-15',18.0,'Ngozi Eze','https://i.pravatar.cc/150?u=ngozi','Planted',45000,'https://images.unsplash.com/photo-1758614312118-4f7cd900ab26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')
     ON CONFLICT DO NOTHING`,
    [verdaId]
  );
  await query(
    `INSERT INTO farm_plots (user_id, plot_name, size_sqm, crop, planting_date, expected_harvest_date, roi_projection, farm_manager, farm_manager_avatar, status, investment_amount, image)
     VALUES ($1,'Plot C — Hilltop',3200,'Managed Portfolio','2025-01-10','2025-12-01',25.3,'Adebayo Ogunleye','https://i.pravatar.cc/150?u=adebayo','Harvesting',95000,'https://images.unsplash.com/photo-1686008674009-876c599f1fe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')
     ON CONFLICT DO NOTHING`,
    [verdaId]
  );
  await query(
    `INSERT INTO farm_plots (user_id, plot_name, size_sqm, crop, planting_date, expected_harvest_date, roi_projection, farm_manager, farm_manager_avatar, status, investment_amount, image)
     VALUES ($1,'Plot D — Eastern Valley',1500,'Cashew','2025-11-01','2027-05-15',20.0,'Ngozi Eze','https://i.pravatar.cc/150?u=ngozi','Preparing',50000,'https://images.unsplash.com/photo-1697567464321-3c152e4ba831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')
     ON CONFLICT DO NOTHING`,
    [verdaId]
  );
  console.log("✓ Farm plots");

  const reportData = [
    [verdaId, "February 2026", "Excellent cashew harvest progress. Plot C reached 96% of projected yield.", 1720, 42500, 8200, "Weather conditions favourable."],
    [verdaId, "January 2026", "Strong growth in all active plots. Cassava at Plot B on track.", 1150, 28750, 6400, null],
    [verdaId, "December 2025", "Year-end review. Overall portfolio performing above projection.", 750, 18750, 5100, null],
  ];
  for (const [uid, month, summary, yield_kg, revenue, expenses, notes] of reportData) {
    await query(
      `INSERT INTO farm_reports (user_id, month, summary, yield_kg, revenue, expenses, notes, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7, NOW()) ON CONFLICT DO NOTHING`,
      [uid, month, summary, yield_kg, revenue, expenses, notes]
    );
  }
  console.log("✓ Farm reports");

  const yieldData = [
    [verdaId, "Sep", 1, 0, 0],
    [verdaId, "Oct", 2, 200, 180],
    [verdaId, "Nov", 3, 450, 420],
    [verdaId, "Dec", 4, 800, 750],
    [verdaId, "Jan", 5, 1200, 1150],
    [verdaId, "Feb", 6, 1800, 1720],
  ];
  for (const [uid, month, order, projected, actual] of yieldData) {
    await query(
      `INSERT INTO farm_yield_data (user_id, month, month_order, projected, actual) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING`,
      [uid, month, order, projected, actual]
    );
  }
  console.log("✓ Farm yield data");

  const farmDocs = [
    [verdaId, "Investment Contract", "download", "Agreement", "1.8 MB", "Signed"],
    [verdaId, "Land Allocation Certificate", "download", "Certificate", "2.1 MB", "Available"],
    [verdaId, "Farm Management Agreement", "download", "Agreement", "1.5 MB", "Signed"],
    [verdaId, "Q4 2025 Harvest Report", "download", "Report", "3.2 MB", "Available"],
    [verdaId, "Sales Receipt — Batch #12", "download", "Receipt", "0.8 MB", "Available"],
    [verdaId, "Government ID", "upload", "KYC", "—", "Signed"],
    [verdaId, "Signed Agreement Copy", "upload", "Agreement", "—", "Pending"],
  ];
  for (const [uid, name, type, category, size, status] of farmDocs) {
    await query(
      `INSERT INTO farm_documents (user_id, name, doc_type, category, file_size, status) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`,
      [uid, name, type, category, size, status]
    );
  }
  console.log("✓ Farm documents");

  const crops = [
    ["Cashew","High-value tree crop with 18-month cycle. Excellent long-term ROI with global demand.","18 months","20-25%","Low","https://images.unsplash.com/photo-1697567464321-3c152e4ba831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"],
    ["Cassava","Staple food crop with 8-12 month cycle. Strong local and industrial demand.","8-12 months","15-20%","Low","https://images.unsplash.com/photo-1758614312118-4f7cd900ab26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"],
    ["Managed Portfolio","Let Verda Farms experts decide the optimal crop mix based on soil, market conditions, and climate.","Variable","22-28%","Medium","https://images.unsplash.com/photo-1686008674009-876c599f1fe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"],
  ];
  for (const [name, desc, cycle, roi, risk, img] of crops) {
    await query(
      `INSERT INTO crop_portfolio (name, description, cycle_duration, avg_roi, risk_level, image)
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (name) DO UPDATE SET description=EXCLUDED.description`,
      [name, desc, cycle, roi, risk, img]
    );
  }
  console.log("✓ Crop portfolio");

  const financialMonths = [
    ["Jan", 12500, 3200], ["Feb", 13200, 2800], ["Mar", 12800, 4100],
    ["Apr", 14000, 3000], ["May", 14500, 3500], ["Jun", 14200, 2900],
  ];
  for (const [month, income, expense] of financialMonths) {
    await query(
      `INSERT INTO transactions (user_id, description, amount, type, status, created_at)
       VALUES ($1, $2 || ' Income', $3, 'income', 'completed', ('2024-' || LPAD(CASE $4
         WHEN 'Jan' THEN '1' WHEN 'Feb' THEN '2' WHEN 'Mar' THEN '3'
         WHEN 'Apr' THEN '4' WHEN 'May' THEN '5' WHEN 'Jun' THEN '6' END, 2, '0') || '-15')::date)
       ON CONFLICT DO NOTHING`,
      [investorId, month, income, month]
    );
  }
  console.log("✓ Financial data");

  console.log("\n✅ Seed complete!");
  console.log("\n📋 Demo Accounts (password: ClientFlow@2024):");
  console.log("  Admin:      admin@clientflow.com");
  console.log("  Investor:   investor@clientflow.com");
  console.log("  Tenant:     tenant@clientflow.com");
  console.log("  VerdaFarms: verdafarms@clientflow.com");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
