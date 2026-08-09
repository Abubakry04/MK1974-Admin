const BASE = 'https://mk-brand-api.onrender.com';

// 25 Distinct Categories
const CATEGORIES_25 = [
  'Hoodies & Sweatshirts',
  'Graphic Tees & Tops',
  'Luxury Outerwear',
  'Denim & Jeans',
  'Cargo & Trousers',
  'Tracksuits & Sets',
  'Footwear & Sneakers',
  'Leather Jackets & Coats',
  'Puffers & Vests',
  'Knitwear & Sweaters',
  'Shorts & Athletic Tops',
  'Headwear & Beanies',
  'Bags & Crossbody',
  'Eyewear & Sunglasses',
  'Belts & Leather Accessories',
  'Jewelry & Chains',
  'Tailored Blazers & Suits',
  'Loungewear & Robes',
  'Oversized Shirts & Flannels',
  'Tactical & Techwear',
  'Activewear & Training',
  'Suede & Leather Footwear',
  'Scarves & Gloves',
  'Socks & Undergarments',
  'Limited Edition & Archival'
];

// Rich palette of colors
const COLORS_LIST = [
  { name: 'Pitch Black', hexCode: '#050505' },
  { name: 'Vintage Cream', hexCode: '#F3EFE6' },
  { name: 'Charcoal Grey', hexCode: '#2B2C2C' },
  { name: 'Deep Olive', hexCode: '#2E3B2C' },
  { name: 'Electric Cobalt', hexCode: '#1D4ED8' },
  { name: 'Burgundy Maroon', hexCode: '#52151E' },
  { name: 'Raw Mocha', hexCode: '#4A3728' },
  { name: 'Pure White', hexCode: '#FFFFFF' },
  { name: 'Sunset Amber', hexCode: '#D97706' },
  { name: 'Forest Green', hexCode: '#15803D' },
  { name: 'Midnight Navy', hexCode: '#1E3A8A' },
  { name: 'Dusty Rose', hexCode: '#9D174D' }
];

const SIZES_LIST = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Unsplash high quality fashion image collection
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
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
  'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80',
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
  'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80'
];

// Naming templates per category for generating 200 distinct products
const PRODUCT_TEMPLATES = {
  'Hoodies & Sweatshirts': [
    { name: 'MK Archival Heavyweight Zip Hoodie', price: 52000, desc: '500GSM ultra-dense organic cotton fleece with custom silver YKK double zipper and dropped shoulders.' },
    { name: 'MK Minimalist Boxy Crewneck', price: 42000, desc: 'Loopback terry sweatshirt with ribbed collar and high-density micro logo embroidery on cuff.' },
    { name: 'MK Vintage Sun-Faded Hooded Sweatshirt', price: 46000, desc: 'Custom pigment-dyed vintage wash hoodie with hand-distressed sleeve cuffs and hem.' },
    { name: 'MK Monogram Jacquard Knit Hoodie', price: 58000, desc: 'Luxury jacquard woven hoodie featuring full-body repeating MK 1974 monogram motif.' },
    { name: 'MK Thermal Lined Oversized Pullover', price: 49000, desc: 'Waffle-knit thermal lining with heavy cotton shell for maximum winter insulation.' },
    { name: 'MK Raw-Hem Crop Street Hoodie', price: 44000, desc: 'Raw edge waist finish with extended drawstrings and silver aglets for modern silhouette.' },
    { name: 'MK Fleece Half-Zip Mock Neck', price: 47500, desc: 'Polar fleece top with nylon chest pocket contrast and branded rubber zipper pull.' },
    { name: 'MK Distressed Acid-Wash Hoodie', price: 51000, desc: 'Acid wash treated heavyweight fleece with subtle bleach splatter detailing.' }
  ],
  'Graphic Tees & Tops': [
    { name: 'MK 1974 World Tour Heavyweight Tee', price: 24000, desc: '260GSM combed cotton tee with multi-color vintage tour graphic on back.' },
    { name: 'MK Signature Script Logo T-Shirt', price: 21000, desc: 'Clean, understated chest script embroidery on ultra-soft pima cotton tee.' },
    { name: 'MK Cyberpunk Graphic Oversized Tee', price: 26000, desc: 'Futuristic high-density puff print across chest and shoulders.' },
    { name: 'MK Archival Photographic Print Shirt', price: 25000, desc: 'Monochrome editorial photo print centered on heavyweight boxy cut tee.' },
    { name: 'MK Acid-Washed Renaissance Tee', price: 23500, desc: 'Oil wash treatment with classical fine-art inspired back illustration.' },
    { name: 'MK Distressed Mesh Layered Tee', price: 27000, desc: 'Double-layer design featuring outer distressed cotton and inner breathable athletic mesh.' },
    { name: 'MK Minimalist Pocket Tee', price: 22000, desc: 'Heavy weight boxy tee with single chest utility pocket and woven flag tag.' },
    { name: 'MK Vintage College Crest Tee', price: 24500, desc: 'Varsity inspired collegiate crest print with crackle ink finish.' }
  ],
  'Luxury Outerwear': [
    { name: 'MK Down-Filled Weatherproof Parka', price: 110000, desc: '700-fill goose down insulation with waterproof nylon shell and detachable faux fur hood trim.' },
    { name: 'MK Technical Trench Coat', price: 95000, desc: 'Double-breasted storm flap coat crafted from water-repellent Japanese gabardine.' },
    { name: 'MK Shearling Collar Utility Jacket', price: 105000, desc: 'Heavy canvas outer with genuine plush shearling collar lining and brass hardware.' },
    { name: 'MK Oversized Corduroy Trucker Jacket', price: 68000, desc: '8-wale thick corduroy jacket with blanket lining and custom MK shank buttons.' },
    { name: 'MK Waterproof Shell Windbreaker', price: 62000, desc: 'Taped seam triple-layer shell with reflective back panel for night visibility.' },
    { name: 'MK Padded Canvas Field Coat', price: 78000, desc: 'Waxed canvas construction with multiple cargo pockets and internal drawcord.' },
    { name: 'MK Quilted Liner Flight Jacket', price: 72000, desc: 'Lightweight thermal quilted liner with rib knit collar and contrast nylon piping.' },
    { name: 'MK Wool Blend Overcoat', price: 115000, desc: 'Heavy Melton wool tailored long coat with hidden button placket.' }
  ],
  'Denim & Jeans': [
    { name: 'MK 14oz Japanese Selvedge Straight Jeans', price: 46000, desc: 'Unwashed raw selvedge denim that breaks in uniquely over time. Red selvedge ID seam.' },
    { name: 'MK Stacked Flare Distressed Denim', price: 49000, desc: 'Slim fit through thigh expanding to subtle flare at leg opening with distressed knee slashes.' },
    { name: 'MK Paint Splatter Carpenter Jeans', price: 48000, desc: 'Hand-painted splatters across vintage stone wash denim with hammer loop details.' },
    { name: 'MK Baggy Skate Fit Denim Trousers', price: 44000, desc: 'Ultra-wide leg opening with deep front pleats and custom leather waistband patch.' },
    { name: 'MK Washed Black Knee-Patch Denim', price: 47000, desc: 'Faded charcoal wash denim with double-knee panel reinforcement.' },
    { name: 'MK Embroidered Monogram Slim Jeans', price: 52000, desc: 'Subtle tonal monogram embroidery across rear pockets and coin pocket.' },
    { name: 'MK Acid Wash Tapered Denim', price: 43000, desc: '80s inspired high contrast acid wash with modern tapered ankle fit.' },
    { name: 'MK Raw-Edge Hemmed Wide Jeans', price: 45000, desc: 'Cropped wide leg jeans with frayed raw hem and exposed button fly.' }
  ],
  'Cargo & Trousers': [
    { name: 'MK Tactical Modular Cargo Pants', price: 42000, desc: 'Detachable 3D utility cargo pockets with magnetic fidlock buckles and nylon straps.' },
    { name: 'MK Relaxed Pleated Chino Trousers', price: 38000, desc: 'Heavy cotton twill with twin front pleats and tailored taper down to cuff.' },
    { name: 'MK Parachute Tech Pants', price: 39500, desc: 'Ultra-lightweight ripstop nylon pants with elastic drawstring knee and hem cinch.' },
    { name: 'MK Wide-Leg Wool Blend Trousers', price: 54000, desc: 'Drapey tropical wool trousers designed for high-fashion streetwear pairing.' },
    { name: 'MK Drawstring Utility Sweat Cargo', price: 36000, desc: 'Fleece cargo pants combining sweatpant comfort with 4 utility pockets.' },
    { name: 'MK Camo Pattern Heavy Cargo Pants', price: 44000, desc: 'Custom duck camo printed canvas cargo with reinforced seat and knee panels.' },
    { name: 'MK Double-Knee Canvas Work Pants', price: 41000, desc: 'Rugged cotton duck canvas built for durability with rivet accents.' },
    { name: 'MK Slim Tapered Stretch Chinos', price: 35000, desc: 'Cotton-elastane blend offering tailored fit with full mobility.' }
  ],
  'Tracksuits & Sets': [
    { name: 'MK Signature Piping Velour Trackset', price: 68000, desc: 'Complete set featuring full-zip jacket and matching pants with contrast piping.' },
    { name: 'MK Monogram Jacquard Tracksuit', price: 78000, desc: 'Heavyweight jacquard knit track top and bottom set with gold-tone zippers.' },
    { name: 'MK Nylon Panel Tech Trackset', price: 64000, desc: 'Colorblocked water-resistant nylon track outfit with breathable mesh lining.' },
    { name: 'MK Fleece Lounge Trackset', price: 56000, desc: 'Heavy cotton fleece matching hoodie and jogger pants combo.' },
    { name: 'MK Retro Striped Athletic Suit', price: 62000, desc: '70s inspired knit athletic suit with tri-color arm and leg taping.' },
    { name: 'MK Reflective Logo Tech Set', price: 70000, desc: 'Night-reflective branding on chest, sleeves, and leg lateral seams.' },
    { name: 'MK Cropped Zip Tracksuit', price: 59000, desc: 'Modern cropped jacket profile paired with high-waisted tapered joggers.' },
    { name: 'MK Oversized Heavyweight Tracksuit', price: 66000, desc: 'Boxy slouchy silhouette tracksuit designed for comfort and streetwear styling.' }
  ],
  'Footwear & Sneakers': [
    { name: 'MK 1974 High-Top Leather Court Sneaker', price: 88000, desc: 'Handcrafted Italian leather high-tops with ankle padding and vintage rubber sole.' },
    { name: 'MK Runner Tech Chunky Sneaker', price: 82000, desc: 'Multi-material upper with mesh, suede, and leather overlays on a sculpted sole.' },
    { name: 'MK Minimalist Low Slip-On Trainer', price: 72000, desc: 'Clean unlined calfskin leather slip-on with elastic side gore and padded footbed.' },
    { name: 'MK Retro Canvas Skateboard Shoe', price: 58000, desc: 'Reinforced canvas and suede skate shoe with vulcanized rubber waffle tread.' },
    { name: 'MK Trekking Trail Sneaker', price: 92000, desc: 'Vibram lugged outsole, speed lacing system, and water-repellent upper.' },
    { name: 'MK Monogram Jacquard Low Sneaker', price: 79000, desc: 'Woven monogram canvas upper trimmed with smooth calfskin leather.' },
    { name: 'MK Distressed Vintage Runner', price: 85000, desc: 'Hand-distressed smudged midsole and vintage wash leather runner.' },
    { name: 'MK Leather Mule Slip-On Sneaker', price: 68000, desc: 'Backless luxury sneaker mule crafted from full-grain leather.' }
  ],
  'Leather Jackets & Coats': [
    { name: 'MK Biker Asymmetric Leather Jacket', price: 145000, desc: 'Heavyweight lambskin leather biker jacket with silver hardware and belt.' },
    { name: 'MK Vintage Distressed Leather Bomber', price: 135000, desc: 'Hand-rubbed antique leather finish with rib knit waistband and cuffs.' },
    { name: 'MK Leather Car Coat', price: 160000, desc: 'Mid-length smooth cowhide coat with button front and plush viscose lining.' },
    { name: 'MK Suede Trucker Jacket', price: 120000, desc: 'Soft calf suede trucker jacket with flap chest pockets and snap buttons.' },
    { name: 'MK Leather Puffer Jacket', price: 175000, desc: 'Insulated down puffer jacket wrapped in ultra-soft Nappa leather shell.' },
    { name: 'MK Shearling Trim Leather Aviator', price: 185000, desc: 'Heavy aviator coat featuring thick shearling collar and cuff turn-backs.' },
    { name: 'MK Cropped Leather Racer Jacket', price: 128000, desc: 'Minimalist cafe racer leather jacket with mandarin snap collar.' },
    { name: 'MK Leather Trench Overcoat', price: 195000, desc: 'Full-length luxury leather trench coat with waist tie belt.' }
  ],
  'Puffers & Vests': [
    { name: 'MK Oversized Matte Down Puffer', price: 88000, desc: 'Matte finish waterproof nylon shell packed with 750-fill thermal insulation.' },
    { name: 'MK Tactical Utility Down Vest', price: 54000, desc: 'Sleeveless padded vest with 6 zip-front utility pockets and D-ring loops.' },
    { name: 'MK High-Gloss Metallic Puffer', price: 92000, desc: 'High-shine wet-look puffer jacket with tall stand collar.' },
    { name: 'MK Reversible Fleece Down Vest', price: 58000, desc: 'Reversible design with smooth nylon on one side and plush fleece on the other.' },
    { name: 'MK Corduroy Puffer Jacket', price: 82000, desc: 'Heavy corduroy outer quilted with lightweight down alternative fill.' },
    { name: 'MK Cropped Women-Fit Puffer', price: 76000, desc: 'High-waisted cropped puffer profile with elastic cinch hem.' },
    { name: 'MK Hooded Longline Down Coat', price: 98000, desc: 'Knee-length longline puffer with 2-way front zipper.' },
    { name: 'MK Lightweight Packable Puffer Vest', price: 46000, desc: 'Ultra-lightweight vest that compresses into its own internal pocket bag.' }
  ],
  'Knitwear & Sweaters': [
    { name: 'MK Chunky Cable Knit Sweater', price: 52000, desc: 'Heavy 100% wool chunky cable knit pullover with ribbed collar and cuffs.' },
    { name: 'MK Distressed Intarsia Knit Jumper', price: 56000, desc: 'Intarsia woven graphic jumper with frayed raw hems and dropped threads.' },
    { name: 'MK Mohair Blend Striped Cardigan', price: 64000, desc: 'Fluffy mohair blend button-up cardigan with custom horn buttons.' },
    { name: 'MK Heavyweight Ribbed Turtleneck', price: 48000, desc: 'Extra fine merino wool turtleneck sweater for luxury layering.' },
    { name: 'MK Oversized V-Neck Knit Sweater', price: 49000, desc: 'Deep V-neck cut designed for layering over collared shirts or tees.' },
    { name: 'MK Jacquard Logo Crew Knit', price: 54000, desc: 'Full monogram jacquard knit sweater in contrasting tonal yarn.' },
    { name: 'MK Quarter-Zip Pullover Sweater', price: 51000, desc: 'Ribbed knit quarter-zip with brushed fleece inner back.' },
    { name: 'MK Brushed Alpaca Wool Blend Sweater', price: 68000, desc: 'Ultra-soft alpaca blend knit sweater with relaxed slouchy fit.' }
  ],
  'Shorts & Athletic Tops': [
    { name: 'MK Heavyweight Fleece Shorts', price: 28000, desc: '400GSM fleece sweat shorts with deep zipper pockets and raw edge hem.' },
    { name: 'MK Mesh Athletic Basketball Shorts', price: 26000, desc: 'Double-layer breathable mesh shorts with varsity striped waist tape.' },
    { name: 'MK Cargo Utility Shorts', price: 32000, desc: 'Cotton twill cargo shorts with snap-closure side flap pockets.' },
    { name: 'MK Performance Athletic Tank Top', price: 18000, desc: 'Moisture-wicking technical fabric tank with reflective back tab.' },
    { name: 'MK Vintage Nylon Swim Shorts', price: 29000, desc: 'Quick-dry nylon trunk shorts with mesh liner and key loop.' },
    { name: 'MK Distressed Denim Shorts', price: 34000, desc: 'Cut-off denim shorts with frayed leg openings and stone wash finish.' },
    { name: 'MK Compression Workout Top', price: 22000, desc: 'Four-way stretch ergonomic athletic top designed for training.' },
    { name: 'MK Pleated Summer Shorts', price: 31000, desc: 'Tailored casual shorts with front pleats and side adjuster tabs.' }
  ],
  'Headwear & Beanies': [
    { name: 'MK Chunky Ribbed Merino Beanie', price: 14000, desc: '100% Merino wool knit beanie with wide turn-up cuff and woven logo tag.' },
    { name: 'MK 5-Panel Nylon Camp Cap', price: 16500, desc: 'Water-resistant nylon 5-panel cap with adjustable web strap closure.' },
    { name: 'MK Embroidered Unstructured Dad Hat', price: 15000, desc: 'Washed cotton twill cap with curved visor and antique brass buckle.' },
    { name: 'MK Heavy Canvas Bucket Hat', price: 18000, desc: 'Structured wide-brim bucket hat with tonal stitch detailing.' },
    { name: 'MK Trucker Mesh Snapback Cap', price: 15500, desc: 'High-crown trucker hat with foam front panel and breathable mesh back.' },
    { name: 'MK Knit Balaclava Ski Mask', price: 19000, desc: 'Full-coverage rib knit balaclava mask for extreme weather.' },
    { name: 'MK Leather Strap Wool Snapback', price: 17500, desc: 'Wool blend flat-brim cap with genuine leather strapback.' },
    { name: 'MK Slouchy Oversized Beanie', price: 13500, desc: 'Relaxed fit long beanie knit from soft acrylic yarn.' }
  ],
  'Bags & Crossbody': [
    { name: 'MK Tactical Ballistic Crossbody Bag', price: 32000, desc: '1680D ballistic nylon body with waterproof zippers and metal cobra buckle.' },
    { name: 'MK Leather Tote Bag', price: 68000, desc: 'Full-grain calfskin leather open tote with interior laptop sleeve.' },
    { name: 'MK Canvas Travel Duffel Bag', price: 58000, desc: 'Heavy 20oz canvas holdall with leather handles and detachable strap.' },
    { name: 'MK Monogram Sling Body Pack', price: 36000, desc: 'Compact chest sling bag with jacquard monogram fabric and USB port grommet.' },
    { name: 'MK Minimalist Leather Backpack', price: 75000, desc: 'Sleek luxury leather backpack with padded 15-inch laptop compartment.' },
    { name: 'MK Utility Belt Bag Waistpack', price: 28000, desc: 'Multi-zip belt bag worn across waist or chest with quick-release clip.' },
    { name: 'MK Ripstop Drawstring Sackpack', price: 22000, desc: 'Lightweight weather-resistant gym sackpack with thick rope cords.' },
    { name: 'MK Leather Messenger Bag', price: 62000, desc: 'Structured flap-front messenger bag with magnetic closures.' }
  ],
  'Eyewear & Sunglasses': [
    { name: 'MK Archival Chunky Acetate Sunglasses', price: 38000, desc: 'Handcrafted thick 8mm Japanese acetate frames with 100% UV400 dark lenses.' },
    { name: 'MK Titanium Frame Aviator Sunglasses', price: 45000, desc: 'Ultra-lightweight titanium wireframe aviators with gradient tinted lenses.' },
    { name: 'MK Cyberpunk Shield Sunglasses', price: 42000, desc: 'Single-piece wrap shield lens with futuristic angular frame design.' },
    { name: 'MK Retro Oval Acetate Frames', price: 35000, desc: '90s vintage narrow oval silhouette with 7-barrel hinges.' },
    { name: 'MK Square Frame Tortoiseshell Glasses', price: 36500, desc: 'Classic tortoiseshell pattern acetate frame with anti-blue light clear lenses.' },
    { name: 'MK Cat-Eye Luxury Sunglasses', price: 39000, desc: 'Sculpted upswept frame profile with gold metal corner pins.' },
    { name: 'MK Frameless Tinted Lens Glasses', price: 34000, desc: 'Rimless construction with drill-mounted tinted polycarbonate lenses.' },
    { name: 'MK Matte Black Flat-Top Sunglasses', price: 37000, desc: 'Bold flat-top brow line with matte black finish.' }
  ],
  'Belts & Leather Accessories': [
    { name: 'MK Monogram Buckle Leather Belt', price: 28000, desc: 'Full-grain Italian leather strap with custom silver MK logo buckle.' },
    { name: 'MK Western Studded Leather Belt', price: 32000, desc: 'Antique silver hardware studs across distressed leather waist strap.' },
    { name: 'MK Minimalist Dress Leather Belt', price: 24000, desc: '30mm sleek calfskin dress belt with polished pin buckle.' },
    { name: 'MK Tactical Webbing Utility Belt', price: 18000, desc: 'Heavy nylon webbing with quick-release metal slide buckle.' },
    { name: 'MK Leather Bifold Zip Wallet', price: 26000, desc: 'Smooth leather wallet with 8 card slots and zip coin pocket.' },
    { name: 'MK Monogram Leather Cardholder', price: 19000, desc: 'Compact 5-slot cardholder with gold-foil logo branding.' },
    { name: 'MK Leather Keychain Lanyard', price: 15000, desc: 'Pebble leather neck lanyard with heavy carabiner clip.' },
    { name: 'MK Braided Leather Waist Belt', price: 25000, desc: 'Hand-woven braided leather strap allowing adjustable sizing anywhere.' }
  ],
  'Jewelry & Chains': [
    { name: 'MK Heavy Cuban Link Chain Necklace', price: 42000, desc: 'Solid 12mm stainless steel Cuban link chain with custom box clasp.' },
    { name: 'MK Monogram Pendant Necklace', price: 34000, desc: 'High-polish silver plated pendant with embossed 1974 insignia.' },
    { name: 'MK Pearl & Steel Hybrid Necklace', price: 38000, desc: 'Contemporary half freshwater pearl, half stainless steel link chain.' },
    { name: 'MK Signet Ring with Black Onyx', price: 28000, desc: 'Heavy signet ring inset with genuine natural black onyx stone.' },
    { name: 'MK Cuban Link Bracelet', price: 32000, desc: '8mm matching wrist bracelet with secure double safety latch.' },
    { name: 'MK Hoop Earring Set with Charm', price: 22000, desc: 'Pair of hypoallergenic stainless steel hoops with detachable dagger charms.' },
    { name: 'MK Stacking Band Ring Set', price: 26000, desc: 'Set of 3 textured metal band rings designed for multi-finger wear.' },
    { name: 'MK Rope Chain Layering Necklace', price: 30000, desc: 'Classic 4mm diamond-cut rope chain necklace.' }
  ],
  'Tailored Blazers & Suits': [
    { name: 'MK Oversized Double-Breasted Blazer', price: 88000, desc: 'Relaxed fashion blazer with structured shoulders and peak lapels.' },
    { name: 'MK Tailored Pleated Suit Trousers', price: 54000, desc: 'Matching suit trousers featuring crisp center crease and relaxed taper.' },
    { name: 'MK Single-Breasted Wool Blazer', price: 82000, desc: 'Classic 2-button blazer cut from virgin wool cloth.' },
    { name: 'MK Cropped Tailored Suit Jacket', price: 76000, desc: 'Modern cropped tailoring silhouette pairing with high-waisted bottoms.' },
    { name: 'MK Tuxedo Lapel Evening Blazer', price: 95000, desc: 'Satin shawl collar tux jacket for high-end evening events.' },
    { name: 'MK Houndstooth Checked Blazer', price: 85000, desc: 'Traditional houndstooth pattern wool blend tailoring.' },
    { name: 'MK Unstructured Casual Linen Blazer', price: 68000, desc: 'Unlined lightweight linen-cotton blazer for warm weather styling.' },
    { name: 'MK Slim Fit Stretch Suit Pants', price: 48000, desc: 'Form-fitting tailored trousers with subtle stretch comfort.' }
  ],
  'Loungewear & Robes': [
    { name: 'MK Plush Fleece Hotel Robe', price: 48000, desc: 'Heavyweight floor-length shawl collar bath robe with embroidered crest.' },
    { name: 'MK Silk Satin Pajama Set', price: 62000, desc: 'Pure silk touch button-front shirt and elastic pant set.' },
    { name: 'MK Waffle Knit Lounge Set', price: 42000, desc: 'Breathable thermal waffle top and jogger pants for home lounging.' },
    { name: 'MK Cashmere Blend Lounge Hoodie', price: 75000, desc: 'Ultra-luxurious cashmere-wool knit lounge hoodie.' },
    { name: 'MK Oversized Blanket Hoodie', price: 38000, desc: 'Extra large sherpa lined wearable blanket pullover.' },
    { name: 'MK Soft Modal Sleep Pants', price: 28000, desc: 'Super soft stretch modal drawstring pajama pants.' },
    { name: 'MK Monogram Jacquard Robe', price: 68000, desc: 'Jacquard woven monogram house coat with satin piping.' },
    { name: 'MK Ribbed Knit Lounge Shorts', price: 24000, desc: 'Cozy elastic waist knit shorts for bedroom & home wear.' }
  ],
  'Oversized Shirts & Flannels': [
    { name: 'MK Heavyweight Plaid Flannel Shirt', price: 38000, desc: '300GSM brushed cotton plaid shirt with double button flap pockets.' },
    { name: 'MK Oversized Cuban Collar Silk Shirt', price: 44000, desc: 'Relaxed resort shirt in silky drape fabric with custom digital pattern.' },
    { name: 'MK Utility Denim Overshirt', price: 48000, desc: '10oz washed denim overshirt worn buttoned or open as a light jacket.' },
    { name: 'MK Corduroy Button-Down Shirt', price: 42000, desc: 'Fine-wale corduroy shirt with curved hem and tonal buttons.' },
    { name: 'MK Poplin Boxy Short Sleeve Shirt', price: 35000, desc: 'Crisp cotton poplin short sleeve shirt with dropped shoulder cut.' },
    { name: 'MK Distressed Hem Plaid Shirt', price: 39000, desc: 'Vintage wash flannel featuring raw frayed bottom hemline.' },
    { name: 'MK Striped Oxford Cotton Shirt', price: 36000, desc: 'Classic vertical striped oxford shirt with button-down collar.' },
    { name: 'MK Printed Bowling Camp Shirt', price: 40000, desc: 'Retro bowling shirt with piping trim on collar and chest pocket.' }
  ],
  'Tactical & Techwear': [
    { name: 'MK Waterproof Modular Shell Jacket', price: 92000, desc: '3-layer hardshell jacket with magnetic hood attachment and underarm vents.' },
    { name: 'MK Cyberpunk Sling Vest Harness', price: 48000, desc: 'Chest harness rig with MOLLE webbing and waterproof phone pouch.' },
    { name: 'MK Fidlock Buckle Cargo Tech Pants', price: 58000, desc: 'Stretch technical ripstop pants with German Fidlock quick-release hardware.' },
    { name: 'MK Reflective Tactical Windbreaker', price: 64000, desc: 'Fully reflective technical shell for extreme urban night visibility.' },
    { name: 'MK Waterproof Gaiter Sneaker Boots', price: 98000, desc: 'High-top gaiter boot featuring waterproof zip shroud and lugged rubber tread.' },
    { name: 'MK Modular Utility Belt Bag', price: 34000, desc: 'Detachable pouches that slide onto reinforced tactical webbing belt.' },
    { name: 'MK Tech Fleece Hooded Mask Jacket', price: 72000, desc: 'Integrated mesh face shroud inside high collar hood.' },
    { name: 'MK Ripstop Waterproof Parka', price: 105000, desc: 'Heavy duty tactical storm parka with multiple sealed storage pockets.' }
  ],
  'Activewear & Training': [
    { name: 'MK Tech Pro Seamless Gym Tee', price: 24000, desc: 'Body-mapped seamless ventilation zones for intense workouts.' },
    { name: 'MK 2-in-1 Running Shorts with Liner', price: 29000, desc: 'Outer lightweight short with inner compression short pocket.' },
    { name: 'MK Compression Long-Sleeve Shirt', price: 28000, desc: 'Muscle-support ergonomic compression shirt with flatlock seams.' },
    { name: 'MK Performance Zip Track Jacket', price: 46000, desc: 'Four-way stretch warmup track jacket with thumbhole cuffs.' },
    { name: 'MK Breathable Training Leggings', price: 32000, desc: 'High-waisted compression tights with side phone drop-in pockets.' },
    { name: 'MK Windproof Training Anorak', price: 52000, desc: 'Half-zip lightweight windproof pullover with front kangaroo pouch.' },
    { name: 'MK High-Impact Sports Top', price: 26000, desc: 'Supportive athletic bra top with removable padding.' },
    { name: 'MK Sweat-Wicking Joggers', price: 38000, desc: 'Lightweight stretch woven training pants with zip ankles.' }
  ],
  'Suede & Leather Footwear': [
    { name: 'MK Suede Chelsea Boot', price: 95000, desc: 'Italian calf suede Chelsea boots with double elastic side gore and crepe sole.' },
    { name: 'MK Leather Combat Boot', price: 110000, desc: 'Heavy lace-up 8-eye combat boot with thick lugged commando outsole.' },
    { name: 'MK Suede Penny Loafer', price: 85000, desc: 'Hand-stitched suede loafers with leather stacked heel and memory foam insole.' },
    { name: 'MK Leather Monk Strap Shoe', price: 98000, desc: 'Single buckle monk strap dress shoe in polished calfskin.' },
    { name: 'MK Suede Wallabee Chukka Boot', price: 78000, desc: 'Moccasin construction Chukka boot on plush natural rubber crepe sole.' },
    { name: 'MK Leather Western Ankle Boot', price: 105000, desc: 'Pointed toe leather boot with cuban heel and harness detail.' },
    { name: 'MK Suede Slip-On Mule', price: 72000, desc: 'Casual suede clog mule with adjustable brass buckle strap.' },
    { name: 'MK Polished Leather Derby Shoes', price: 89000, desc: 'Classic plain toe derby shoe with welted leather sole.' }
  ],
  'Scarves & Gloves': [
    { name: 'MK Cashmere Monogram Scarf', price: 35000, desc: '100% Cashmere fringe scarf with jacquard monogram knit.' },
    { name: 'MK Touchscreen Leather Gloves', price: 28000, desc: 'Soft lambskin leather gloves lined with warm cashmere and conductive fingertips.' },
    { name: 'MK Chunky Wool Knit Scarf', price: 26000, desc: 'Extra long rib knit winter scarf with thick fringe tassel ends.' },
    { name: 'MK Fleece Tactical Neck Gaiter', price: 16000, desc: 'Windproof fleece neck warmer tube with adjustable drawcord cinch.' },
    { name: 'MK Fingerless Knit Gloves', price: 18000, desc: 'Ribbed wool fingerless gloves for dexterity while staying warm.' },
    { name: 'MK Silk Printed Square Scarf', price: 29000, desc: 'Pure silk twill square neck scarf with hand-rolled edges.' },
    { name: 'MK Padded Waterproof Snow Gloves', price: 32000, desc: 'Insulated snow mittens with waterproof membrane and wrist leash.' },
    { name: 'MK Down-Filled Quilted Scarf', price: 24000, desc: 'Lightweight puffer scarf with pass-through slot closure.' }
  ],
  'Socks & Undergarments': [
    { name: 'MK Heavyweight Ribbed Crew Socks 3-Pack', price: 15000, desc: 'Pack of 3 dense cushion cotton athletic crew socks with arch support.' },
    { name: 'MK Monogram Jacquard Socks', price: 9500, desc: 'Luxury dress socks with full-body repeating monogram pattern.' },
    { name: 'MK Stretch Microfiber Trunks 3-Pack', price: 24000, desc: 'Silky smooth moisture-wicking trunk boxers with soft waistband.' },
    { name: 'MK Premium Pima Cotton Briefs 3-Pack', price: 22000, desc: 'Breathable 100% pima cotton classic briefs.' },
    { name: 'MK Ankle Athletic Socks 5-Pack', price: 16000, desc: 'Low-cut athletic socks with heel tab to prevent slipping.' },
    { name: 'MK Wool Blend Winter Hike Socks', price: 12000, desc: 'Thick thermal wool hiking socks for extreme cold comfort.' },
    { name: 'MK Seamless Boxer Briefs 2-Pack', price: 19000, desc: 'No-fly seamless athletic boxer briefs that prevent chafing.' },
    { name: 'MK Compression Calf Sleeves', price: 14000, desc: 'Graduated compression calf sleeves for post-workout recovery.' }
  ],
  'Limited Edition & Archival': [
    { name: 'MK 1974 Serialized Collector Leather Jacket', price: 250000, desc: 'Hand-numbered edition of 50 worldwide. Premium horsehide leather with silver plaque.' },
    { name: 'MK Archival Hand-Painted Custom Denim', price: 180000, desc: 'Individually hand-painted vintage denim piece by MK studio artisans.' },
    { name: 'MK Gold Embroidered Velvet Kimono', price: 165000, desc: 'Heavy velvet kimono jacket featuring metallic gold dragon embroidery.' },
    { name: 'MK Swarovski Crystal Box Logo Hoodie', price: 140000, desc: 'Heavyweight hoodie embellished with over 1,500 genuine Swarovski crystals.' },
    { name: 'MK Archival Sample Prototype Trench Coat', price: 210000, desc: 'Runway sample piece with raw sample tags and deconstructed tailoring.' },
    { name: 'MK 24K Gold Plated Chain & Pendant', price: 190000, desc: 'Heavy 24-karat gold dipped brass chain with custom engraved heavy ingot.' },
    { name: 'MK Hand-Woven Distressed Knit Sweater', price: 155000, desc: 'Artisanal hand-knitted sweater with one-of-a-kind distressed unraveling.' },
    { name: 'MK Leather & Fur Runway Flight Coat', price: 280000, desc: 'Centerpiece runway flight coat featuring full shearling body and leather trim.' }
  ]
};

async function seed200Products() {
  console.log('====================================================');
  console.log('🚀 Starting Seeding of 25 Categories & 200 Products');
  console.log('====================================================\n');

  // 1. Auth Admin Token
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
      console.log('✓ Authenticated Admin Session.');
    } else {
      const regRes = await fetch(`${BASE}/api/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminCredentials)
      });
      if (regRes.ok) {
        const data = await regRes.json();
        token = data.token;
        console.log('✓ Registered and Authenticated Admin Session.');
      } else {
        console.error('❌ Registration failed:', await regRes.text());
        process.exit(1);
      }
    }
  } catch (err) {
    console.error('❌ Auth exception:', err.message);
    process.exit(1);
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  function extractArray(res) {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.results)) return res.results;
    if (Array.isArray(res.$values)) return res.$values;
    return [];
  }

  // 2. Process Categories (Ensure all 25 categories exist)
  console.log('\n📁 [1/4] Syncing 25 Store Categories...');
  const existingCatsRes = await fetch(`${BASE}/api/Category`);
  const existingCats = extractArray(await existingCatsRes.json());
  const categoryMap = {}; // name.toLowerCase() -> id

  existingCats.forEach(c => {
    categoryMap[c.name.trim().toLowerCase()] = c.categoryId || c.id;
  });

  for (const catName of CATEGORIES_25) {
    const key = catName.trim().toLowerCase();
    if (!categoryMap[key]) {
      const res = await fetch(`${BASE}/api/Category`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ name: catName })
      });
      if (res.ok) {
        const cat = await res.json();
        const catId = cat.categoryId || cat.id;
        categoryMap[key] = catId;
        console.log(`  + Category Created: "${catName}" (ID: ${catId})`);
      }
    } else {
      console.log(`  - Category Exists: "${catName}" (ID: ${categoryMap[key]})`);
    }
  }

  // 3. Process Colors
  console.log('\n🎨 [2/4] Syncing Color Palette...');
  const existingColsRes = await fetch(`${BASE}/api/Color`);
  const existingCols = extractArray(await existingColsRes.json());
  const colorMap = {}; // name.toLowerCase() -> id

  existingCols.forEach(c => {
    colorMap[c.name.trim().toLowerCase()] = c.colorId || c.id;
  });

  for (const colObj of COLORS_LIST) {
    const key = colObj.name.trim().toLowerCase();
    if (!colorMap[key]) {
      const res = await fetch(`${BASE}/api/Color`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ name: colObj.name, hexCode: colObj.hexCode })
      });
      if (res.ok) {
        const col = await res.json();
        const colId = col.colorId || col.id;
        colorMap[key] = colId;
      }
    }
  }
  const colorIds = Object.values(colorMap);

  // 4. Process Sizes
  console.log('\n📏 [3/4] Syncing Size Grid...');
  const existingSzsRes = await fetch(`${BASE}/api/Size`);
  const existingSzs = extractArray(await existingSzsRes.json());
  const sizeMap = {}; // name.toUpperCase() -> id

  existingSzs.forEach(s => {
    sizeMap[s.name.trim().toUpperCase()] = s.sizeId || s.id;
  });

  for (const szName of SIZES_LIST) {
    const key = szName.trim().toUpperCase();
    if (!sizeMap[key]) {
      const res = await fetch(`${BASE}/api/Size`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ name: szName })
      });
      if (res.ok) {
        const sz = await res.json();
        const szId = sz.sizeId || sz.id;
        sizeMap[key] = szId;
      }
    }
  }
  const sizeIds = Object.values(sizeMap);

  // 5. Generate & Create 200 Products Across 25 Categories
  console.log('\n📦 [4/4] Creating 200 High-Quality Products...');
  
  // Fetch existing products to avoid exact duplicates
  const existingProdsRes = await fetch(`${BASE}/api/Product`);
  const existingProds = extractArray(await existingProdsRes.json());
  const existingProdNames = new Set(existingProds.map(p => p.name?.trim().toLowerCase()));

  // Build list of 200 items by repeating templates with unique variations if needed
  const targetProductsList = [];
  let productIndex = 1;

  for (const catName of CATEGORIES_25) {
    const templates = PRODUCT_TEMPLATES[catName] || [];
    // Repeat templates 8 times per category -> 25 categories * 8 items = 200 total products!
    for (let batch = 1; batch <= 8; batch++) {
      const tmplIndex = (batch - 1) % templates.length;
      const baseTmpl = templates[tmplIndex] || {
        name: `MK ${catName} Edition ${batch}`,
        price: 35000 + batch * 2500,
        desc: `Signature ${catName} product item with luxury streetwear styling.`
      };

      // Add batch distinction if batch > 1
      const fullName = batch === 1 ? baseTmpl.name : `${baseTmpl.name} (Vol. ${batch})`;
      
      targetProductsList.push({
        index: productIndex++,
        name: fullName,
        categoryName: catName,
        price: baseTmpl.price + (batch - 1) * 1500,
        description: baseTmpl.desc,
        stockQuantity: 40 + (batch * 10),
        imgUrl: FASHION_IMAGE_URLS[(productIndex) % FASHION_IMAGE_URLS.length]
      });
    }
  }

  console.log(`\nPrepared dataset of ${targetProductsList.length} products to create.`);

  // Create products in sequence
  let createdCount = 0;
  for (const p of targetProductsList) {
    if (existingProdNames.has(p.name.trim().toLowerCase())) {
      console.log(`[${p.index}/200] Skipped existing: "${p.name}"`);
      continue;
    }

    const catId = categoryMap[p.categoryName.trim().toLowerCase()];
    if (!catId) {
      console.error(`❌ Category ID missing for "${p.categoryName}"`);
      continue;
    }

    // Pick 2 random colors and 3 random sizes for variants
    const sampleColors = colorIds.slice(0, 2);
    const sampleSizes = sizeIds.slice(0, 3);
    const variants = [];

    sampleColors.forEach(cId => {
      sampleSizes.forEach(sId => {
        variants.push({
          colorId: cId,
          sizeId: sId,
          price: p.price,
          discountPrice: 0,
          stockQuantity: Math.floor(p.stockQuantity / (sampleColors.length * sampleSizes.length)) || 10
        });
      });
    });

    const payload = {
      name: p.name,
      description: p.description,
      price: p.price,
      stockQuantity: p.stockQuantity,
      categoryId: [catId],
      variants
    };

    try {
      const res = await fetch(`${BASE}/api/Product`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const createdData = await res.json();
        const prodObj = createdData.data || createdData;
        const prodId = prodObj.productId || prodObj.id;
        createdCount++;
        console.log(`[${p.index}/200] Created Product #${prodId}: "${p.name}" (₦${p.price.toLocaleString()})`);

        // Upload image to Cloudinary asynchronously to speed up seeding
        if (p.imgUrl && prodId) {
          fetch(p.imgUrl)
            .then(imgRes => imgRes.arrayBuffer())
            .then(buf => {
              const blob = new Blob([buf], { type: 'image/jpeg' });
              const fd = new FormData();
              fd.append('Images', blob, `product_${prodId}.jpg`);
              return fetch(`${BASE}/api/products/${prodId}/images`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: fd
              });
            })
            .then(upRes => {
              if (upRes.ok) console.log(`   └─ Image uploaded to Cloudinary for Product #${prodId}`);
            })
            .catch(() => {});
        }
      } else {
        console.error(`❌ [${p.index}/200] Failed to create "${p.name}":`, await res.text());
      }
    } catch (err) {
      console.error(`❌ Exception creating "${p.name}":`, err.message);
    }
  }

  console.log('\n====================================================');
  console.log(`🎉 COMPLETED! Created ${createdCount} new products across 25 categories!`);
  console.log('====================================================\n');
}

seed200Products().catch(console.error);
