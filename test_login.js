const BASE = 'https://mk-brand-api.onrender.com';

async function testCorsAndLogin() {
  console.log("1. Testing OPTIONS preflight request...");
  try {
    const preflight = await fetch(`${BASE}/api/Auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type',
        'Origin': 'http://localhost:5174'
      }
    });
    console.log("Preflight Status:", preflight.status);
    console.log("Preflight Headers:", Object.fromEntries(preflight.headers.entries()));
  } catch (e) {
    console.error("Preflight Error:", e.message);
  }

  console.log("\n2. Testing POST request with Origin header...");
  try {
    const res = await fetch(`${BASE}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5174'
      },
      body: JSON.stringify({
        email: 'testadmin999@test.com',
        password: 'Password123!'
      })
    });
    console.log("POST Status:", res.status);
    console.log("POST Headers:", Object.fromEntries(res.headers.entries()));
    const data = await res.json();
    console.log("POST Data:", data);
  } catch (e) {
    console.error("POST Error:", e.message);
  }
}

testCorsAndLogin();
