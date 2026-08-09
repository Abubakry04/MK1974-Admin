const BASE = 'https://mk-brand-api.onrender.com';

// High-resolution fashion image URLs from Unsplash for each product category
const IMAGE_URLS = {
  hoodie: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
  tee: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
  bomber: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&q=80',
  varsity: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
  cargo: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
  jeans: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
  tracksuit: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
  sneakers: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80',
  beanie: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80',
  sweatpants: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80',
  windbreaker: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80',
  bag: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
};

// Data definitions
const CATEGORIES_TO_CREATE = [
  'Hoodies & Sweatshirts',
  'Graphic Tees & Tops',
  'Luxury Outerwear',
  'Denim & Trousers',
  'Tracksuits & Sets',
  'Accessories',
  'Footwear & Sneakers'
];

const COLORS_TO_CREATE = [
  { name: 'Pitch Black', hexCode: '#050505' },
  { name: 'Vintage Cream', hexCode: '#F3EFE6' },
  { name: 'Charcoal Grey', hexCode: '#2B2C2C' },
  { name: 'Deep Olive', hexCode: '#2E3B2C' },
  { name: 'Electric Cobalt', hexCode: '#1D4ED8' },
  { name: 'Burgundy Maroon', hexCode: '#52151E' },
  { name: 'Raw Mocha', hexCode: '#4A3728' },
  { name: 'Pure White', hexCode: '#FFFFFF' }
];

const SIZES_TO_CREATE = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const PRODUCTS_TO_CREATE = [
  {
    name: 'MK1974 Signature Oversized Heavyweight Hoodie',
    description: 'Premium 480GSM French terry cotton hoodie featuring dropped shoulder seams, double-layered lined hood, raw cuff trim, and signature tonal MK embroidery.',
    price: 48500,
    stockQuantity: 80,
    categoryName: 'Hoodies & Sweatshirts',
    colorNames: ['Pitch Black', 'Vintage Cream', 'Charcoal Grey'],
    sizeNames: ['S', 'M', 'L', 'XL'],
    imgKey: 'hoodie'
  },
  {
    name: 'MK Heavyweight Graphic Boxy Tee',
    description: 'Crafted from 280GSM combed ring-spun cotton. Relaxed streetwear fit with high-density screenprinted 1974 graphic across the upper chest.',
    price: 22000,
    stockQuantity: 120,
    categoryName: 'Graphic Tees & Tops',
    colorNames: ['Vintage Cream', 'Pitch Black', 'Pure White'],
    sizeNames: ['XS', 'S', 'M', 'L', 'XL'],
    imgKey: 'tee'
  },
  {
    name: 'MK Tactical Padded Bomber Jacket',
    description: 'Heavy-duty weatherproof nylon outer with orange quilted thermal lining. Features utility sleeve pockets, matte black YKK hardware, and ribbed storm cuffs.',
    price: 85000,
    stockQuantity: 45,
    categoryName: 'Luxury Outerwear',
    colorNames: ['Deep Olive', 'Pitch Black'],
    sizeNames: ['S', 'M', 'L', 'XL'],
    imgKey: 'bomber'
  },
  {
    name: 'MK Monogram Leather Varsity Jacket',
    description: 'Wool blend body with genuine pebble-grain lambskin leather sleeves. Hand-embroidered Chenille chest patch and custom snap closures.',
    price: 125000,
    stockQuantity: 30,
    categoryName: 'Luxury Outerwear',
    colorNames: ['Pitch Black', 'Burgundy Maroon'],
    sizeNames: ['M', 'L', 'XL'],
    imgKey: 'varsity'
  },
  {
    name: 'MK Relaxed Fit Distressed Cargo Trousers',
    description: 'Heavyweight cotton twill construction with 6 spacious utility pockets, adjustable drawstrings at the hems, and subtle distressed wash finishing.',
    price: 38000,
    stockQuantity: 90,
    categoryName: 'Denim & Trousers',
    colorNames: ['Deep Olive', 'Raw Mocha', 'Pitch Black'],
    sizeNames: ['S', 'M', 'L', 'XL'],
    imgKey: 'cargo'
  },
  {
    name: 'MK Heritage Vintage Wash Carpenter Jeans',
    description: '14oz Japanese selvedge denim in an authentic stone-wash finish. Hammer loop detail, reinforced knee paneling, and custom brass rivets.',
    price: 42000,
    stockQuantity: 75,
    categoryName: 'Denim & Trousers',
    colorNames: ['Charcoal Grey', 'Pitch Black'],
    sizeNames: ['S', 'M', 'L', 'XL'],
    imgKey: 'jeans'
  },
  {
    name: 'MK Essential Velvet Tech Tracksuit',
    description: 'Plush 320GSM cotton-velour track set including full-zip mock neck top and slim tapered track pants with piping details down the sides.',
    price: 65000,
    stockQuantity: 60,
    categoryName: 'Tracksuits & Sets',
    colorNames: ['Burgundy Maroon', 'Pitch Black', 'Electric Cobalt'],
    sizeNames: ['S', 'M', 'L', 'XL', 'XXL'],
    imgKey: 'tracksuit'
  },
  {
    name: 'MK Minimalist Leather Low-Top Sneakers',
    description: 'Italian full-grain calfskin leather low-tops with custom rubber cupsole, waxed cotton laces, and gold-foil stamped 1974 lateral branding.',
    price: 75000,
    stockQuantity: 50,
    categoryName: 'Footwear & Sneakers',
    colorNames: ['Pure White', 'Pitch Black', 'Vintage Cream'],
    sizeNames: ['S', 'M', 'L', 'XL'],
    imgKey: 'sneakers'
  },
  {
    name: 'MK Embroidered Ribbed Beanie',
    description: '100% Merino wool chunky knit beanie with wide turn-up cuff and high-definition MK crown crest patch.',
    price: 12500,
    stockQuantity: 150,
    categoryName: 'Accessories',
    colorNames: ['Pitch Black', 'Charcoal Grey', 'Burgundy Maroon'],
    sizeNames: ['M', 'L'],
    imgKey: 'beanie'
  },
  {
    name: 'MK Heavyweight Fleece Sweatpants',
    description: 'Ultra-soft fleece interior with elastic waist, deep zipper pockets, and cinched ankle cuffs. Built for maximum comfort without sacrificing structure.',
    price: 32000,
    stockQuantity: 100,
    categoryName: 'Hoodies & Sweatshirts',
    colorNames: ['Vintage Cream', 'Charcoal Grey', 'Pitch Black'],
    sizeNames: ['S', 'M', 'L', 'XL'],
    imgKey: 'sweatpants'
  },
  {
    name: 'MK Technical Waterproof Windbreaker',
    description: 'Lightweight 3-layer laminated shell with taped seams, waterproof zippers, adjustable visor hood, and reflective safety accents.',
    price: 58000,
    stockQuantity: 55,
    categoryName: 'Luxury Outerwear',
    colorNames: ['Electric Cobalt', 'Pitch Black'],
    sizeNames: ['M', 'L', 'XL'],
    imgKey: 'windbreaker'
  },
  {
    name: 'MK Signature Canvas Crossbody Bag',
    description: 'Durable 16oz ballistic canvas body with waterproof nylon lining, heavy-duty buckle, and detachable webbed shoulder strap with padded cushion.',
    price: 28000,
    stockQuantity: 70,
    categoryName: 'Accessories',
    colorNames: ['Pitch Black', 'Raw Mocha'],
    sizeNames: ['M'],
    imgKey: 'bag'
  }
];

async function runSeeder() {
  console.log('=== Starting MK1974 Swagger Data Population ===\n');

  // 1. Obtain Admin Token
  let token = null;
  const adminCredentials = {
    email: 'admin_catalog_manager@mk1974.com',
    password: 'Password123!',
    firstName: 'MK1974',
    lastName: 'Admin',
    role: 'Admin'
  };

  try {
    const loginRes = await fetch(`${BASE}/api/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminCredentials.email, password: adminCredentials.password })
    });
    if (loginRes.ok) {
      const data = await loginRes.json();
      token = data.token;
      console.log('✓ Logged in as existing Catalog Admin.');
    } else {
      const regRes = await fetch(`${BASE}/api/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminCredentials)
      });
      if (regRes.ok) {
        const data = await regRes.json();
        token = data.token;
        console.log('✓ Registered new Catalog Admin with Admin role.');
      } else {
        console.error('❌ Failed to register Admin:', await regRes.text());
        process.exit(1);
      }
    }
  } catch (err) {
    console.error('❌ Auth error:', err.message);
    process.exit(1);
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Helper function to extract array from API response
  function extractArray(res) {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.results)) return res.results;
    if (Array.isArray(res.$values)) return res.$values;
    return [];
  }

  // 2. Fetch or Create Categories
  console.log('\n--- Processing Categories ---');
  const existingCatsRes = await fetch(`${BASE}/api/Category`);
  const existingCats = extractArray(await existingCatsRes.json());
  const categoryMap = {}; // name.toLowerCase() -> id

  existingCats.forEach(c => {
    categoryMap[c.name.trim().toLowerCase()] = c.categoryId || c.id;
  });

  for (const catName of CATEGORIES_TO_CREATE) {
    const key = catName.trim().toLowerCase();
    if (categoryMap[key]) {
      console.log(`- Category already exists: "${catName}" (ID: ${categoryMap[key]})`);
    } else {
      const res = await fetch(`${BASE}/api/Category`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ name: catName })
      });
      if (res.ok) {
        const cat = await res.json();
        const catId = cat.categoryId || cat.id;
        categoryMap[key] = catId;
        console.log(`+ Created Category: "${catName}" (ID: ${catId})`);
      } else {
        console.error(`❌ Failed to create category "${catName}":`, await res.text());
      }
    }
  }

  // 3. Fetch or Create Colors
  console.log('\n--- Processing Colors ---');
  const existingColsRes = await fetch(`${BASE}/api/Color`);
  const existingCols = extractArray(await existingColsRes.json());
  const colorMap = {}; // name.toLowerCase() -> id

  existingCols.forEach(c => {
    colorMap[c.name.trim().toLowerCase()] = c.colorId || c.id;
  });

  for (const colObj of COLORS_TO_CREATE) {
    const key = colObj.name.trim().toLowerCase();
    if (colorMap[key]) {
      console.log(`- Color already exists: "${colObj.name}" (ID: ${colorMap[key]})`);
    } else {
      const res = await fetch(`${BASE}/api/Color`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ name: colObj.name, hexCode: colObj.hexCode })
      });
      if (res.ok) {
        const col = await res.json();
        const colId = col.colorId || col.id;
        colorMap[key] = colId;
        console.log(`+ Created Color: "${colObj.name}" (ID: ${colId})`);
      } else {
        console.error(`❌ Failed to create color "${colObj.name}":`, await res.text());
      }
    }
  }

  // 4. Fetch or Create Sizes
  console.log('\n--- Processing Sizes ---');
  const existingSzsRes = await fetch(`${BASE}/api/Size`);
  const existingSzs = extractArray(await existingSzsRes.json());
  const sizeMap = {}; // name.toUpperCase() -> id

  existingSzs.forEach(s => {
    sizeMap[s.name.trim().toUpperCase()] = s.sizeId || s.id;
  });

  for (const szName of SIZES_TO_CREATE) {
    const key = szName.trim().toUpperCase();
    if (sizeMap[key]) {
      console.log(`- Size already exists: "${szName}" (ID: ${sizeMap[key]})`);
    } else {
      const res = await fetch(`${BASE}/api/Size`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ name: szName })
      });
      if (res.ok) {
        const sz = await res.json();
        const szId = sz.sizeId || sz.id;
        sizeMap[key] = szId;
        console.log(`+ Created Size: "${szName}" (ID: ${szId})`);
      } else {
        console.error(`❌ Failed to create size "${szName}":`, await res.text());
      }
    }
  }

  // 5. Fetch existing products to check for duplicates
  console.log('\n--- Processing Products & Variants ---');
  const existingProdsRes = await fetch(`${BASE}/api/Product`);
  const existingProds = extractArray(await existingProdsRes.json());
  const existingProdNames = new Set(existingProds.map(p => p.name?.trim().toLowerCase()));

  for (const prodData of PRODUCTS_TO_CREATE) {
    if (existingProdNames.has(prodData.name.trim().toLowerCase())) {
      console.log(`- Product already exists: "${prodData.name}"`);
      continue;
    }

    const catId = categoryMap[prodData.categoryName.trim().toLowerCase()];
    if (!catId) {
      console.error(`❌ Missing category ID for "${prodData.categoryName}"`);
      continue;
    }

    // Build variants array
    const variants = [];
    for (const cName of prodData.colorNames) {
      const cId = colorMap[cName.trim().toLowerCase()];
      for (const sName of prodData.sizeNames) {
        const sId = sizeMap[sName.trim().toUpperCase()];
        if (cId && sId) {
          variants.push({
            colorId: cId,
            sizeId: sId,
            price: prodData.price,
            discountPrice: 0,
            stockQuantity: Math.floor(prodData.stockQuantity / (prodData.colorNames.length * prodData.sizeNames.length)) || 10
          });
        }
      }
    }

    const payload = {
      name: prodData.name,
      description: prodData.description,
      price: prodData.price,
      stockQuantity: prodData.stockQuantity,
      categoryId: [catId],
      variants
    };

    const res = await fetch(`${BASE}/api/Product`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const createdRes = await res.json();
      const newProd = createdRes.data || createdRes;
      const prodId = newProd.productId || newProd.id;
      console.log(`\n+ Created Product #${prodId}: "${prodData.name}" (Price: ₦${prodData.price.toLocaleString()}, Variants: ${variants.length})`);

      // Upload Cloudinary Image if image key exists
      if (prodData.imgKey && IMAGE_URLS[prodData.imgKey]) {
        try {
          const imgUrl = IMAGE_URLS[prodData.imgKey];
          const imgResponse = await fetch(imgUrl);
          if (imgResponse.ok) {
            const arrBuf = await imgResponse.arrayBuffer();
            const blob = new Blob([arrBuf], { type: 'image/jpeg' });
            const fd = new FormData();
            fd.append('Images', blob, `${prodData.imgKey}.jpg`);

            const uploadRes = await fetch(`${BASE}/api/products/${prodId}/images`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
              body: fd
            });
            if (uploadRes.ok) {
              const imgData = await uploadRes.json();
              console.log(`  └─ Image uploaded to Cloudinary: ${imgData[0]?.imageUrl || 'Success'}`);
            } else {
              console.warn(`  └─ Image upload failed with status ${uploadRes.status}`);
            }
          }
        } catch (imgErr) {
          console.warn(`  └─ Image upload error: ${imgErr.message}`);
        }
      }
    } else {
      console.error(`❌ Failed to create product "${prodData.name}":`, await res.text());
    }
  }

  console.log('\n================================================');
  console.log('✓ Seeding complete! All products and categories added via Swagger API.');
  console.log('================================================\n');
}

runSeeder().catch(console.error);
