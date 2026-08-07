const BASE = 'https://mk-brand-api.onrender.com';

async function testDashboardEndpoints() {
  let token = '';
  console.log("Attempting login...");
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const loginRes = await fetch(`${BASE}/api/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'testadmin999@test.com', password: 'Password123!' })
      });
      const loginData = await loginRes.json();
      token = loginData.token;
      console.log("Logged in OK. Token received.");
      break;
    } catch (e) {
      console.log(`Login attempt ${attempt} failed: ${e.message}. Retrying...`);
      await new Promise(r => setTimeout(r, 4000));
    }
  }

  if (!token) {
    console.error("Could not obtain auth token.");
    return;
  }

  const headers = { 'Authorization': `Bearer ${token}` };

  console.log("\n1. Testing GET /api/admin/Dashboard/summary:");
  try {
    const res = await fetch(`${BASE}/api/admin/Dashboard/summary`, { headers });
    console.log("Summary Status:", res.status);
    const data = await res.json();
    console.log("Summary Data:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Summary error:", e.message);
  }

  console.log("\n2. Testing GET /api/admin/Dashboard/overview:");
  try {
    const res = await fetch(`${BASE}/api/admin/Dashboard/overview`, { headers });
    console.log("Overview Status:", res.status);
    const data = await res.json();
    console.log("Overview Data:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Overview error:", e.message);
  }

  console.log("\n3. Testing GET /api/admin/Dashboard/transactions:");
  try {
    const res = await fetch(`${BASE}/api/admin/Dashboard/transactions`, { headers });
    console.log("Transactions Status:", res.status);
    const data = await res.json();
    console.log("Transactions Data:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Transactions error:", e.message);
  }
}

testDashboardEndpoints();
