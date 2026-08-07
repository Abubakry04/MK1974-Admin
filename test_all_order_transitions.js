const BASE = 'https://mk-brand-api.onrender.com';

async function testAllOrderTransitions() {
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

  // 1. Get all orders
  const ordersRes = await fetch(`${BASE}/api/Order`, { headers });
  const ordersData = await ordersRes.json();
  const list = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);
  console.log(`\nFetched ${list.length} orders from backend:`);
  for (const o of list.slice(0, 5)) {
    console.log(`- OrderId: ${o.orderId}, Status: "${o.status}", Total: ₦${o.totalAmount}`);
  }

  if (list.length > 0) {
    const testOrder = list[0];
    console.log(`\nTesting status update on OrderId ${testOrder.orderId} (current status: "${testOrder.status}"):`);

    const testStatuses = ["PendingPayment", "PaymentSubmitted", "Paid", "PaymentRejected", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

    for (const statusVal of testStatuses) {
      console.log(`\nTrying status: "${statusVal}"`);
      const res = await fetch(`${BASE}/api/Order/${testOrder.orderId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(statusVal)
      });
      const text = await res.text();
      console.log(`Response HTTP ${res.status}: ${text}`);
    }
  }
}

testAllOrderTransitions();
