const BASE = 'https://mk-brand-api.onrender.com';

async function testInvalidLogin() {
  try {
    const res = await fetch(`${BASE}/api/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'invalid@mk1974.com',
        password: 'wrongpassword'
      })
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
  } catch (e) {
    console.error(e);
  }
}

testInvalidLogin();
