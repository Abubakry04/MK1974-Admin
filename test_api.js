const BASE = 'https://mk-brand-api.onrender.com';

async function testAll() {
  const endpoints = [
    '/api/Product',
    '/api/Category',
    '/api/Color',
    '/api/Size',
    '/api/User',
    '/api/Order'
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BASE}${ep}`);
      console.log(`${ep} -> HTTP ${res.status}`);
      const text = await res.text();
      console.log(`  Length: ${text.length}, Preview: ${text.slice(0, 100)}`);
    } catch (e) {
      console.error(`${ep} -> Error:`, e.message);
    }
  }
}

testAll();
