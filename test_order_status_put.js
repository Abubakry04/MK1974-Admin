const BASE = 'https://mk-brand-api.onrender.com';

async function testOrderStatusUpdate() {
  let token = '';
  try {
    const loginRes = await fetch(`${BASE}/api/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testadmin999@test.com', password: 'Password123!' })
    });
    const loginData = await loginRes.json();
    token = loginData.token;
    console.log("Logged in OK.");
  } catch (e) {
    console.error("Login failed:", e.message);
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const payloadsToTest = [
    { label: 'JSON String "Paid"', body: JSON.stringify("Paid") },
    { label: 'JSON String "Processing"', body: JSON.stringify("Processing") },
    { label: 'JSON String "Shipped"', body: JSON.stringify("Shipped") },
    { label: 'JSON String "Delivered"', body: JSON.stringify("Delivered") },
    { label: 'JSON String "Cancelled"', body: JSON.stringify("Cancelled") },
    { label: 'JSON Number 2 (Paid)', body: JSON.stringify(2) },
    { label: 'JSON Number 4 (Processing)', body: JSON.stringify(4) },
    { label: 'Object { status: "Paid" }', body: JSON.stringify({ status: "Paid" }) },
    { label: 'Object { orderStatus: "Paid" }', body: JSON.stringify({ orderStatus: "Paid" }) },
    { label: 'Plain text Paid', body: "Paid" },
  ];

  for (const item of payloadsToTest) {
    console.log(`\nTesting: ${item.label}`);
    try {
      const res = await fetch(`${BASE}/api/Order/1/status`, {
        method: 'PUT',
        headers,
        body: item.body
      });
      const text = await res.text();
      console.log(`  Status: ${res.status} | Response: ${text}`);
    } catch (e) {
      console.error(`  Error: ${e.message}`);
    }
  }
}

testOrderStatusUpdate();
