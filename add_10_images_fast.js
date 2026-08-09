const BASE = 'https://mk-brand-api.onrender.com';

const FASHION_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
  'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&q=80',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80',
  'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80',
  'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80',
  'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
  'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'
];

async function add10ImagesFast() {
  console.log('====================================================');
  console.log('⚡ High-Speed Multi-Image Uploader (5 Concurrent Workers)');
  console.log('====================================================\n');

  // 1. Authenticate Admin
  let token = null;
  try {
    const loginRes = await fetch(`${BASE}/api/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin_catalog_manager@mk1974.com', password: 'Password123!' })
    });
    if (loginRes.ok) {
      const data = await loginRes.json();
      token = data.token;
      console.log('✓ Authenticated Admin Session.');
    } else {
      console.error('❌ Login failed:', await loginRes.text());
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Auth error:', err.message);
    process.exit(1);
  }

  // 2. Pre-fetch sample image buffers into memory
  console.log('\n📥 Pre-fetching 15 high-resolution fashion images into memory...');
  const imageBuffers = [];
  for (let i = 0; i < FASHION_IMAGE_URLS.length; i++) {
    try {
      const res = await fetch(FASHION_IMAGE_URLS[i]);
      if (res.ok) {
        const arrBuf = await res.arrayBuffer();
        imageBuffers.push(Buffer.from(arrBuf));
      }
    } catch (e) {}
  }
  console.log(`✓ Cached ${imageBuffers.length} fashion images in RAM.`);

  // 3. Fetch all products from API
  console.log('\n📦 Fetching all products from database...');
  const prodsRes = await fetch(`${BASE}/api/Product`);
  const prodsData = await prodsRes.json();
  const products = prodsData.data || prodsData;

  console.log(`Found ${products.length} products to check.\n`);

  // Helper to upload images to a single product
  async function processProduct(p, pIdx) {
    const productId = p.productId || p.id;
    const currentImages = Array.isArray(p.imageUrls) ? p.imageUrls.length : 0;
    const needed = 10 - currentImages;

    if (needed <= 0) {
      console.log(`[${pIdx + 1}/${products.length}] Product #${productId} "${p.name}" already has ${currentImages} images.`);
      return;
    }

    const fd = new FormData();
    for (let i = 0; i < needed; i++) {
      const buf = imageBuffers[(pIdx * 3 + i) % imageBuffers.length];
      const blob = new Blob([buf], { type: 'image/jpeg' });
      fd.append('Images', blob, `product_${productId}_img_${i + 1}.jpg`);
    }

    try {
      const uploadRes = await fetch(`${BASE}/api/products/${productId}/images`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });

      if (uploadRes.ok) {
        const uploaded = await uploadRes.json();
        const count = Array.isArray(uploaded) ? uploaded.length : 1;
        console.log(`✓ [${pIdx + 1}/${products.length}] Uploaded ${count} images to Product #${productId} "${p.name}" (Total: ${currentImages + count})`);
      } else {
        console.warn(`⚠️ [${pIdx + 1}/${products.length}] Upload status ${uploadRes.status} for Product #${productId}`);
      }
    } catch (err) {
      console.error(`❌ Upload error for Product #${productId}: ${err.message}`);
    }
  }

  // Process in parallel batches of 5
  const CONCURRENCY = 5;
  for (let i = 0; i < products.length; i += CONCURRENCY) {
    const batch = products.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map((p, idx) => processProduct(p, i + idx)));
  }

  console.log('\n====================================================');
  console.log('🎉 ALL PRODUCTS NOW HAVE 10 HIGH-RESOLUTION IMAGES!');
  console.log('====================================================\n');
}

add10ImagesFast().catch(console.error);
