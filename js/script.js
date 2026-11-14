/* =========================================================
   VERDANT Plants, Flowers & Gardening Studio: script.js
   1. CONFIG + data (edit shop details, products and offers here)
   2. Helpers, toasts, dialogs, storage
   3. Navigation, scroll effects, reveal
   4. Products: render, search, filters, sort, modal
   5. Cart, wishlist, checkout (demo)
   6. Collections, guide, finder, offers
   7. Forms, slider
   No dependencies.
   ========================================================= */

/* ---------- 1. CONFIG + data ---------- */
const CONFIG = {
  name: 'VERDANT',
  announce: 'Make Your Space Greener – Explore Our New Plant Collection.',
  offer: 'Free local delivery on orders above ₹999 (sample offer).',
  phone: '+91 98765 43210',                 // as displayed
  phoneTel: '+919876543210',                // used for tap-to-call
  whatsapp: '919876543210',                 // country code + number, digits only (sample number: replace)
  email: 'hello@verdant.example',           // sample address: replace
  address: '14 Garden Lane, Indiranagar, Bengaluru, Karnataka 560038',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Indiranagar, Bengaluru, Karnataka 560038'),
  instagram: 'https://www.instagram.com/',  // replace with the shop's Instagram profile URL
  delivery: {
    freeAbove: 999,                         // delivery is free at or above this subtotal (INR)
    charge: 60,                             // otherwise this delivery charge (INR)
    area: 'Local delivery within the shop’s service area in Bengaluru. Ask us about your PIN code.',
    time: 'Typically same day or next day for local orders. Confirmed by the shop after you order.'
  },
  // Sample coupon codes that the cart can apply. type: percent or flat. min: minimum subtotal.
  coupons: {
    WELCOME10: { type: 'percent', value: 10, min: 0, label: 'Welcome offer, 10% off' },
    COMBO15: { type: 'percent', value: 15, min: 1500, label: 'Plant combo, 15% off (orders from ₹1,500)' },
    GREEN100: { type: 'flat', value: 100, min: 799, label: 'Starter kit, ₹100 off (orders from ₹799)' }
  }
};

const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'];

const CAT_LABEL = { indoor: 'Indoor Plants', outdoor: 'Outdoor Plants', flowering: 'Flowering Plants', succulents: 'Succulents & Cactus', flowers: 'Flowers', pots: 'Pots & Planters', accessories: 'Gardening Accessories' };
const FILTERS = [['all', 'All Products'], ['indoor', 'Indoor Plants'], ['outdoor', 'Outdoor Plants'], ['flowering', 'Flowering Plants'], ['succulents', 'Succulents'], ['flowers', 'Flowers'], ['pots', 'Pots'], ['accessories', 'Gardening Accessories']];
const TAG_LABEL = { air: 'Air Purifying Plants', tools: 'Gardening Tools', seeds: 'Seeds & Fertilizers', care: 'Plant Care Accessories', fertilizer: 'Organic Fertilizers', soil: 'Potting Soil', water: 'Watering Equipment' };

/* Shop-by-category cards. f is the filter applied when the card is chosen. */
const CATEGORIES = [
  { name: 'Indoor Plants', desc: 'Leafy companions for homes and offices.', img: 'monstera-pot', f: { cat: 'indoor' } },
  { name: 'Outdoor Plants', desc: 'Hardy plants for gardens and terraces.', img: 'hibiscus', f: { cat: 'outdoor' } },
  { name: 'Flowering Plants', desc: 'Colour for balconies and borders.', img: 'marigold', f: { cat: 'flowering' } },
  { name: 'Succulents & Cactus', desc: 'Low-fuss plants for sunny spots.', img: 'echeveria', f: { cat: 'succulents' } },
  { name: 'Air Purifying Plants', desc: 'Popular choices for fresher rooms.', img: 'peace-lily', f: { tag: 'air' } },
  { name: 'Flower Bouquets', desc: 'Hand-tied flowers for every occasion.', img: 'mixed-bouquet', f: { cat: 'flowers' } },
  { name: 'Decorative Pots', desc: 'Ceramic, terracotta and hanging planters.', img: 'terracotta-stack', f: { cat: 'pots' } },
  { name: 'Gardening Tools', desc: 'Gloves, trowels and pruners.', img: 'soil-shovel', f: { tag: 'tools' } },
  { name: 'Seeds & Fertilizers', desc: 'Start from seed and feed naturally.', img: 'sprouts', f: { tag: 'seeds' } },
  { name: 'Plant Care Accessories', desc: 'Watering cans, soil and plant food.', img: 'watering-can', f: { tag: 'care' } }
];

/* ---- Products (sample catalogue: replace with the real inventory) ----
   price / mrp in INR. light: low | indirect | direct. care: 1 very little, 2 moderate, 3 daily.
   places: bedroom | living | balcony | office | garden. n: newness order (higher = newer). pop: popularity score. */
const CARE_LABEL = { 1: 'Very low maintenance', 2: 'Moderate', 3: 'Needs daily care' };
const LIGHT_LABEL = { low: 'Low light', indirect: 'Bright indirect light', direct: 'Direct sunlight' };
const plant = (id, name, cat, price, mrp, img, o) => Object.assign({ id, name, cat, price, mrp, img, type: 'plant', avail: 'In stock', tags: [], pop: 50, n: id }, o);
const flower = (id, name, price, mrp, img, o) => Object.assign({ id, name, cat: 'flowers', price, mrp, img, type: 'flower', avail: 'Made to order', tags: [], pop: 50, n: id }, o);
const item = (id, name, cat, price, mrp, img, o) => Object.assign({ id, name, cat, price, mrp, img, type: 'item', avail: 'In stock', tags: [], pop: 40, n: id }, o);

const PRODUCTS = [
  plant(1, 'Money Plant', 'indoor', 199, 249, 'pothos-jar', { badge: 'Bestseller', pop: 98, light: ['low', 'indirect'], care: 1, places: ['bedroom', 'living', 'office'], water: 'Every 5 to 7 days', height: '20 to 30 cm', env: 'Indoor', tags: ['air'], desc: 'A forgiving trailing vine that grows happily in a jar of water or a pot of soil. A classic first plant.' }),
  plant(2, 'Snake Plant', 'indoor', 349, 449, 'snake-plant', { badge: 'Bestseller', pop: 96, light: ['low', 'indirect', 'direct'], care: 1, places: ['bedroom', 'living', 'office', 'balcony'], water: 'Every 2 to 3 weeks', height: '40 to 60 cm', env: 'Indoor', tags: ['air'], desc: 'Upright, sculptural leaves and very little fuss. It tolerates low light and the occasional missed watering.' }),
  plant(3, 'Monstera Deliciosa', 'indoor', 899, null, 'monstera-pot', { badge: 'Popular Choice', pop: 94, light: ['indirect'], care: 2, places: ['living', 'office'], water: 'Every 7 to 10 days', height: '50 to 70 cm', env: 'Indoor', desc: 'Large, split leaves that make a statement in any bright room. Give it a moss pole as it grows.' }),
  plant(4, 'Peace Lily', 'indoor', 449, null, 'peace-lily', { badge: 'Bestseller', pop: 92, light: ['low', 'indirect'], care: 2, places: ['bedroom', 'living', 'office'], water: 'Once a week', height: '35 to 50 cm', env: 'Indoor', tags: ['air'], desc: 'Glossy dark leaves with graceful white blooms. It droops when thirsty, which makes watering easy to time.' }),
  plant(5, 'Areca Palm', 'indoor', 599, 699, 'jungle', { pop: 80, light: ['indirect', 'direct'], care: 2, places: ['living', 'balcony', 'office'], water: 'Twice a week', height: '60 to 90 cm', env: 'Indoor & balcony', tags: ['air'], desc: 'Feathery, arching fronds that bring a tropical feel to bright corners and balconies.' }),
  plant(6, 'Rubber Plant', 'indoor', 499, null, 'rubber-plant', { pop: 76, light: ['indirect', 'direct'], care: 2, places: ['living', 'office'], water: 'Every 7 to 10 days', height: '40 to 60 cm', env: 'Indoor', tags: ['air'], desc: 'Thick, glossy leaves on an upright stem. Wipe the leaves now and then to keep them shiny.' }),
  plant(7, 'ZZ Plant', 'indoor', 699, null, 'zz-plant', { badge: 'New Arrival', pop: 70, n: 120, light: ['low', 'indirect'], care: 1, places: ['bedroom', 'office', 'living'], water: 'Every 2 to 3 weeks', height: '35 to 50 cm', env: 'Indoor', desc: 'Shiny, upright stems that thrive on neglect. One of the easiest plants for offices and shaded rooms.' }),
  plant(8, 'Spider Plant', 'indoor', 249, null, 'spider-plant', { pop: 74, light: ['indirect', 'low'], care: 1, places: ['bedroom', 'living', 'office', 'balcony'], water: 'Once a week', height: '25 to 35 cm', env: 'Indoor', tags: ['air'], desc: 'Arching striped leaves that cascade from a hanging pot. It produces baby plants you can share.' }),

  plant(9, 'Hibiscus', 'outdoor', 299, null, 'hibiscus', { pop: 78, light: ['direct'], care: 2, places: ['garden', 'balcony'], water: 'Every 2 days in summer', height: '45 to 60 cm', env: 'Outdoor', desc: 'Big, bright blooms that flower through much of the year in a sunny spot. Loved for pooja and gardens alike.' }),
  plant(10, 'Bougainvillea', 'outdoor', 349, 399, 'bougainvillea', { pop: 82, light: ['direct'], care: 1, places: ['garden', 'balcony'], water: 'Twice a week', height: '50 to 70 cm', env: 'Outdoor', desc: 'A sun-loving climber covered in papery colour. It thrives in heat and needs little water once settled.' }),
  plant(11, 'Jasmine', 'outdoor', 279, null, 'jasmine', { pop: 72, light: ['direct', 'indirect'], care: 2, places: ['garden', 'balcony'], water: 'Every 2 to 3 days', height: '40 to 60 cm', env: 'Outdoor', desc: 'Sweetly scented white flowers on a bushy, climbing plant. Lovely near a seating area.' }),
  plant(12, 'Rose Plant', 'outdoor', 249, null, 'red-rose', { pop: 84, light: ['direct'], care: 3, places: ['garden', 'balcony'], water: 'Every 2 days', height: '40 to 55 cm', env: 'Outdoor', desc: 'A classic garden rose. It needs a few hours of sun, regular feeding and light pruning to bloom well.' }),
  plant(13, 'Mogra', 'outdoor', 299, null, 'mogra', { pop: 66, light: ['direct', 'indirect'], care: 2, places: ['garden', 'balcony'], water: 'Every 2 to 3 days', height: '35 to 50 cm', env: 'Outdoor', desc: 'Intensely fragrant white blooms, a favourite for garlands and evening air.' }),
  plant(14, 'Ixora', 'outdoor', 229, null, 'ixora', { pop: 60, light: ['direct'], care: 2, places: ['garden', 'balcony'], water: 'Every 2 to 3 days', height: '30 to 45 cm', env: 'Outdoor', desc: 'Clusters of bright flowers that bloom almost all year in warm, sunny conditions.' }),
  plant(15, 'Croton', 'outdoor', 349, null, 'croton', { pop: 62, light: ['direct', 'indirect'], care: 2, places: ['garden', 'balcony', 'living'], water: 'Every 3 to 4 days', height: '40 to 60 cm', env: 'Outdoor & bright indoor', desc: 'Bold, colourful foliage that adds year-round colour to sunny corners.' }),

  plant(16, 'Marigold', 'flowering', 99, null, 'marigold', { pop: 86, light: ['direct'], care: 1, places: ['garden', 'balcony'], water: 'Every 2 days', height: '20 to 30 cm', env: 'Outdoor', season: 'Best from autumn to winter', desc: 'Cheerful orange and yellow flowers that are easy to grow and loved for festivals.' }),
  plant(17, 'Petunia', 'flowering', 149, null, 'petunia', { pop: 68, light: ['direct'], care: 2, places: ['balcony', 'garden'], water: 'Every 2 days', height: '20 to 30 cm', env: 'Outdoor', season: 'Cool season', desc: 'Trumpet-shaped flowers in many colours, ideal for hanging baskets and railings.' }),
  plant(18, 'Geranium', 'flowering', 199, null, 'geranium', { pop: 64, light: ['direct', 'indirect'], care: 2, places: ['balcony', 'garden'], water: 'Every 3 days', height: '25 to 35 cm', env: 'Outdoor', season: 'Cool season', desc: 'Rounded clusters of bright blooms on a compact plant. Great for pots on a sunny balcony.' }),
  plant(19, 'Chrysanthemum', 'flowering', 249, null, 'chrysanthemum', { badge: 'New Arrival', pop: 63, n: 121, light: ['direct'], care: 2, places: ['balcony', 'garden'], water: 'Every 2 to 3 days', height: '30 to 40 cm', env: 'Outdoor', season: 'Autumn and winter', desc: 'Full, layered blooms in rich colours. A seasonal favourite for pots and gifting.' }),
  plant(20, 'Dahlia', 'flowering', 329, null, 'dahlia', { pop: 61, light: ['direct'], care: 2, places: ['garden', 'balcony'], water: 'Every 2 to 3 days', height: '40 to 60 cm', env: 'Outdoor', season: 'Cool season', desc: 'Large, geometric flowers in saturated colour. A showpiece for sunny beds and big pots.' }),
  plant(21, 'Anthurium', 'flowering', 799, 899, 'calla', { pop: 74, light: ['indirect'], care: 2, places: ['living', 'office', 'bedroom'], water: 'Once a week', height: '30 to 45 cm', env: 'Indoor', season: 'Blooms on and off through the year', desc: 'Glossy, heart-shaped flowers that last for weeks. Prefers bright, indirect light and humidity.' }),

  plant(22, 'Aloe Vera', 'succulents', 149, null, 'aloe', { pop: 88, light: ['direct', 'indirect'], care: 1, places: ['balcony', 'living', 'bedroom', 'office'], water: 'Every 2 weeks', height: '20 to 30 cm', env: 'Indoor & balcony', desc: 'Thick, fleshy leaves with a calm, architectural look. Let the soil dry fully between waterings.' }),
  plant(23, 'Jade Plant', 'succulents', 249, null, 'jade-plant', { badge: 'Bestseller', pop: 90, light: ['direct', 'indirect'], care: 1, places: ['living', 'office', 'balcony', 'bedroom'], water: 'Every 10 to 14 days', height: '20 to 30 cm', env: 'Indoor & balcony', desc: 'A tree-like succulent with plump, glossy leaves. Long-lived and very easy to look after.' }),
  plant(24, 'Echeveria', 'succulents', 199, null, 'echeveria', { pop: 72, light: ['direct'], care: 1, places: ['balcony', 'office', 'living'], water: 'Every 10 days', height: '8 to 12 cm', env: 'Indoor & balcony', desc: 'A neat rosette of blue-green leaves. A lovely choice for small pots and sunny windowsills.' }),
  plant(25, 'Haworthia', 'succulents', 229, null, 'haworthia', { pop: 70, light: ['indirect', 'low'], care: 1, places: ['office', 'bedroom', 'living'], water: 'Every 2 weeks', height: '10 to 15 cm', env: 'Indoor', desc: 'A small, striped succulent that copes well with indoor light. Perfect for desks and shelves.' }),
  plant(26, 'Cactus (Assorted)', 'succulents', 179, null, 'cactus-pot', { pop: 75, light: ['direct'], care: 1, places: ['balcony', 'office', 'living'], water: 'Every 2 to 3 weeks', height: '10 to 20 cm', env: 'Indoor & balcony', desc: 'Compact cacti in assorted shapes, supplied in a small pot. They love sun and little water.' }),
  plant(27, 'Flowering Cactus', 'succulents', 299, null, 'cactus-flower', { badge: 'New Arrival', pop: 66, n: 122, light: ['direct'], care: 1, places: ['balcony', 'office', 'living'], water: 'Every 2 weeks', height: '12 to 18 cm', env: 'Indoor & balcony', desc: 'A rounded cactus topped with a bright flower. A cheerful, low-care gift.' }),

  flower(28, 'Fresh Rose Bouquet', 899, null, 'roses', { pop: 90, flowerType: 'Roses', arrangement: 'Hand-tied bouquet, wrapped in paper', sizes: ['12 stems', '24 stems', '36 stems'], season: 'Available through the year', desc: 'A classic bouquet of fresh roses, hand-tied and wrapped by our florists.' }),
  flower(29, 'Mixed Flower Bouquet', 1199, 1399, 'mixed-bouquet', { badge: 'Popular Choice', pop: 88, flowerType: 'Seasonal mix', arrangement: 'Hand-tied bouquet with greens', sizes: ['Small', 'Medium', 'Large'], season: 'Mix changes with the season', desc: 'A generous mix of seasonal blooms and foliage, tied into a relaxed, garden-style bouquet.' }),
  flower(30, 'Seasonal Flowers', 699, null, 'sunflowers', { pop: 70, flowerType: 'Sunflowers and seasonal stems', arrangement: 'Loose bunch, wrapped', sizes: ['Small bunch', 'Large bunch'], season: 'Depends on the season', desc: 'Whatever is freshest and loveliest this week, gathered into a cheerful bunch.' }),
  flower(31, 'Floral Arrangement', 1799, null, 'gerbera-bouquet', { badge: 'New Arrival', pop: 68, n: 123, flowerType: 'Gerberas, roses and fillers', arrangement: 'Arranged in a vase or box', sizes: ['Medium', 'Large'], season: 'Available through the year', desc: 'A colourful arrangement for birthdays and celebrations, designed to be displayed right away.' }),
  flower(32, 'Gift Bouquet', 1499, null, 'tulip-bouquet', { pop: 72, flowerType: 'Tulips and seasonal flowers', arrangement: 'Wrapped with a gift card', sizes: ['Medium', 'Large'], season: 'Tulips are seasonal, with substitutes offered', desc: 'A soft, elegant bouquet wrapped with a handwritten card. A lovely way to say thank you.' }),

  item(33, 'Speckled Ceramic Planter', 'pots', 549, null, 'peace-lily-pot', { badge: 'Popular Choice', pop: 85, material: 'Glazed ceramic', size: '15 cm wide, with drainage hole', details: 'Plant shown for styling only', desc: 'A hand-finished speckled planter with a drainage hole. Pairs well with peace lilies, jades and herbs.' }),
  item(34, 'Terracotta Pots (Set of 3)', 'pots', 349, 399, 'terracotta-stack', { pop: 80, material: 'Natural terracotta', size: '3 sizes: 10, 13 and 16 cm', details: 'Drainage holes included', desc: 'Classic clay pots that let soil breathe. A simple set for cuttings, succulents and herbs.' }),
  item(35, 'Tall Terracotta Planter', 'pots', 449, null, 'terracotta-tall', { pop: 60, material: 'Natural terracotta', size: '30 cm tall', details: 'Decorative relief pattern', desc: 'A tall, tapered planter with a classic pattern. Ideal for upright plants like snake plants.' }),
  item(36, 'Hanging Planter', 'pots', 499, null, 'pothos-hanging', { pop: 70, material: 'Metal frame with cord, pot included', size: '14 cm pot', details: 'Plant shown for styling only', desc: 'A hanging planter that frees up shelf space and lets trailing plants cascade.' }),
  item(37, 'Wooden Plant Stand', 'pots', 899, 999, 'monstera-pot', { pop: 58, material: 'Solid wood', size: '25 cm tall', details: 'Plant shown for styling only', desc: 'A simple wooden stand that lifts plants into the light and adds height to a corner.' }),
  item(38, 'Hanging Flower Basket', 'pots', 599, null, 'hanging-basket', { pop: 52, material: 'Coir-lined metal basket', size: '30 cm wide', details: 'Plants shown for styling only', desc: 'A coir-lined basket for balcony railings and sunny walls. Plant it with petunias or geraniums.' }),

  item(39, 'Metal Watering Can', 'accessories', 549, null, 'watering-can', { pop: 66, tags: ['care', 'water'], material: 'Galvanised metal', size: '2 litre capacity', details: 'Long spout for easy pouring', desc: 'A durable watering can with a long spout that reaches into crowded pots without splashing.' }),
  item(40, 'Rustic Watering Can', 'accessories', 699, null, 'watering-can-wood', { pop: 50, tags: ['care', 'water'], material: 'Metal with rose sprinkler', size: '1.5 litre capacity', details: 'Rose head for gentle watering', desc: 'A small can with a sprinkler rose for seedlings and delicate plants.' }),
  item(41, 'Gardening Gloves', 'accessories', 199, null, 'gloves', { pop: 55, tags: ['tools'], material: 'Cotton with grip coating', size: 'One size, fits most', details: 'Washable', desc: 'Comfortable gloves that protect your hands while you pot, prune and weed.' }),
  item(42, 'Garden Trowel & Pruner Set', 'accessories', 349, 399, 'soil-shovel', { pop: 62, tags: ['tools'], material: 'Stainless steel blades', size: 'Trowel and hand pruner', details: 'Comfort grip handles', desc: 'The two tools every gardener reaches for: a sturdy trowel and a sharp hand pruner.' }),
  item(43, 'Organic Plant Fertilizer', 'accessories', 249, null, 'fertilizer', { pop: 64, tags: ['seeds', 'care', 'fertilizer'], material: 'Organic granules', size: '1 kg pack', details: 'Use as directed on the pack', desc: 'A gentle organic feed that supports healthy leaves and flowers. Mix into the topsoil of pots and beds.' }),
  item(44, 'Potting Mix (5 kg)', 'accessories', 299, null, 'seedlings', { pop: 68, tags: ['care', 'soil'], material: 'Coco peat, compost and perlite blend', size: '5 kg bag', details: 'Light and well-draining', desc: 'A light, well-draining mix for most indoor and outdoor pots. Retains moisture without waterlogging.' }),
  item(45, 'Flower Seeds Pack', 'accessories', 99, null, 'sprouts', { pop: 58, tags: ['seeds'], material: 'Assorted seasonal flower seeds', size: 'Pack of mixed seeds', details: 'Sowing instructions inside', desc: 'A mixed pack of easy flower seeds. A fun first project for balconies and window boxes.' }),
  item(46, 'Vegetable Seeds Combo', 'accessories', 149, null, 'seedlings', { badge: 'New Arrival', pop: 54, n: 124, tags: ['seeds'], material: 'Assorted vegetable and herb seeds', size: 'Pack of 4 varieties', details: 'Sowing instructions inside', desc: 'Four easy varieties to start a small kitchen garden on a sunny balcony.' })
];

const BEST_IDS = [1, 2, 3, 4, 23, 33];

const FLOWER_COLLECTIONS = [
  { name: 'Rose Bouquets', from: 899, img: 'roses', desc: 'Fresh roses, hand-tied. Timeless for any occasion.' },
  { name: 'Birthday Flowers', from: 1199, img: 'gerbera-bouquet', desc: 'Bright, joyful blooms to make a birthday feel special.' },
  { name: 'Anniversary Flowers', from: 1499, img: 'red-rose', desc: 'Deep red roses and soft greens for a romantic gesture.' },
  { name: 'Wedding Flowers', from: 2999, img: 'peony', desc: 'Bouquets and arrangements, planned with you in advance.' },
  { name: 'Seasonal Flowers', from: 699, img: 'sunflowers', desc: 'The week’s freshest stems in a cheerful bunch.' },
  { name: 'Gift Arrangements', from: 1499, img: 'mixed-bouquet', desc: 'Wrapped or boxed with a card, ready to give.' }
];

const ESSENTIALS = [
  { name: 'Organic Fertilizers', icon: 'sprout', f: { tag: 'fertilizer' } },
  { name: 'Potting Soil', icon: 'leaf', f: { tag: 'soil' } },
  { name: 'Seeds', icon: 'sprout', f: { tag: 'seeds' } },
  { name: 'Gardening Tools', icon: 'tools', f: { tag: 'tools' } },
  { name: 'Plant Nutrition', icon: 'droplet', f: { tag: 'care' } },
  { name: 'Watering Equipment', icon: 'droplet', f: { tag: 'water' } },
  { name: 'Decorative Planters', icon: 'pot', f: { cat: 'pots' } }
];

const ARTICLES = [
  { id: 'indoor-care', title: 'How to Care for Indoor Plants', min: 5, img: 'monstera-pot', desc: 'The simple routine that keeps most houseplants happy.', body: [
    ['Start with light', 'Place plants where they get the light they like. Most leafy houseplants prefer bright, indirect light, a spot near a window but out of harsh afternoon sun. If leaves stretch towards the window or look pale, they want more light.'],
    ['Water by touch', 'Check the soil with a finger before watering. If the top 2 to 3 cm are dry, water thoroughly until it drains from the bottom, then empty the saucer. Watering little and often is a common cause of problems.'],
    ['Keep it simple', 'Wipe dusty leaves, remove yellow ones and feed lightly during the growing season. Repot only when roots fill the pot.'] ] },
  { id: 'indian-homes', title: 'Best Plants for Indian Homes', min: 4, img: 'plant-shelf', desc: 'Hardy plants that cope with our heat, light and busy lives.', body: [
    ['Dependable indoor choices', 'Snake plant, money plant, ZZ plant and spider plant tolerate a range of light and forgive missed waterings, which makes them ideal for busy households.'],
    ['For bright balconies', 'Areca palm, jade, aloe vera and bougainvillea enjoy bright light and warmth. In very strong afternoon sun, give delicate plants a little shade.'],
    ['Think about your space', 'Choose plants that match your light first, then pick the shapes and colours you love. The plant finder on this page can help you decide.'] ] },
  { id: 'watering', title: 'How Often Should You Water Plants?', min: 4, img: 'watering-can', desc: 'There is no fixed schedule, but there is a simple method.', body: [
    ['It depends', 'How often a plant needs water depends on the plant, the pot, the season and the light. A fixed schedule such as every Sunday only works as a loose reminder.'],
    ['The finger test', 'Push a finger into the soil. If it is dry a few centimetres down, water. If it is still damp, wait. Succulents prefer to dry out completely between waterings.'],
    ['Use drainage', 'Pots should have drainage holes. Water slowly until it drains out, and never let a plant sit in a full saucer for long.'] ] },
  { id: 'low-light', title: 'Best Plants for Low-Light Rooms', min: 4, img: 'zz-plant', desc: 'Greenery for shaded rooms, bedrooms and offices.', body: [
    ['Plants that cope', 'ZZ plant, snake plant, peace lily and money plant manage in low light, though they grow slowly. Haworthia is a good small option for desks.'],
    ['Set expectations', 'Low-light does not mean no light. Keep plants within a few metres of a window or under a bright, plant-friendly lamp.'],
    ['Water less', 'Plants in shade use less water. Check the soil carefully before watering to avoid soggy roots.'] ] },
  { id: 'balcony', title: 'Balcony Gardening for Beginners', min: 6, img: 'balcony', desc: 'Turn a small balcony into a green corner.', body: [
    ['Check the sun', 'Note how many hours of direct sun your balcony gets. Six or more suits flowering plants like marigolds and hibiscus. Less suits foliage plants.'],
    ['Start small', 'Begin with a few hardy plants in good pots with drainage. Marigold, aloe vera, jasmine and succulents are forgiving first choices.'],
    ['Plan for wind and heat', 'Heavier pots stay put in wind. In peak summer, group pots together and water in the early morning or evening.'] ] },
  { id: 'choose-pot', title: 'How to Choose the Right Pot', min: 4, img: 'terracotta-tall', desc: 'Size, material and drainage made simple.', body: [
    ['Size', 'Choose a pot only a few centimetres wider than the root ball. A pot that is too large holds extra wet soil and can cause root rot.'],
    ['Material', 'Terracotta breathes and suits plants that like drier soil, such as succulents. Ceramic and plastic hold moisture longer and suit thirstier plants.'],
    ['Drainage', 'Always choose a pot with a drainage hole. If you love a decorative pot without one, use it as a cover and keep the plant in a plain inner pot.'] ] },
  { id: 'mistakes', title: 'Common Plant Care Mistakes', min: 5, img: 'dark-leaves', desc: 'Small habits that cause the biggest problems.', body: [
    ['Overwatering', 'The most common mistake. Yellowing, soft leaves and a damp smell usually mean too much water. Let the soil dry a little before the next drink.'],
    ['Wrong light', 'Sun-loving plants in a dark corner become leggy, while shade plants scorch in harsh sun. Match the plant to the spot.'],
    ['Too much too soon', 'Do not repot, move and feed a plant all at once. Make one change at a time and give the plant a few weeks to respond.'] ] },
  { id: 'seasonal', title: 'Seasonal Plant Care in India', min: 6, img: 'rose-path', desc: 'Adjust watering and feeding through summer, monsoon and winter.', body: [
    ['Summer', 'Water more often, ideally early morning or evening, and protect delicate plants from harsh afternoon sun.'],
    ['Monsoon', 'Humidity is high, so water less and make sure pots drain well. Watch for fungus and pests, and keep leaves dry where you can.'],
    ['Winter', 'Growth slows down. Water less, pause heavy feeding, and move plants away from cold drafts. Winter is also a great time for flowering annuals.'] ] }
];

const OFFERS = [
  { badge: 'Sample offer', big: '10% OFF', title: 'Welcome Offer', desc: 'A welcome treat on your first order of plants, pots or flowers.', valid: 'Sample code for demonstration', code: 'WELCOME10', cta: 'Shop Now', go: 'shop', feat: true },
  { badge: 'Sample offer', big: '15% OFF', title: 'Plant Combo Collection', desc: 'Pick a few plants together and save on the combo. For orders from ₹1,500.', valid: 'Sample code for demonstration', code: 'COMBO15', cta: 'Shop Plants', go: 'bestsellers' },
  { badge: 'Sample offer', big: '₹100 OFF', title: 'Indoor Plant Starter Kit', desc: 'A plant, a pot and some potting mix to begin. For orders from ₹799.', valid: 'Sample code for demonstration', code: 'GREEN100', cta: 'Shop Now', go: 'finder' },
  { badge: 'Sample offer', big: 'Bundle', title: 'Gardening Essentials Bundle', desc: 'Tools, soil and fertilizer picked to work well together. No code needed.', valid: 'Sample offer, see the shop for details', code: '', cta: 'See Essentials', go: 'gardening' },
  { badge: 'Sample offer', big: 'Seasonal', title: 'Seasonal Flower Collection', desc: 'Fresh seasonal bouquets, prepared to order. No code needed.', valid: 'Sample offer, see the shop for details', code: '', cta: 'View Flowers', go: 'flowers' }
];

const INSTA = ['plant-shelf', 'succulents', 'tulip-bouquet', 'roses', 'cactus-flower', 'balcony', 'pothos-hanging', 'rose-path'];

const LEGAL = {
  privacy: { title: 'Privacy Policy', body: [
    ['Demo website', 'This is a demonstration website. It does not send your details to the shop. Forms only check what you type. Your cart and wishlist are saved in your own browser (localStorage) so they are still there when you come back.'],
    ['If you go live', 'A real shop should replace this text with its own policy covering what it collects (for example names, phone numbers and delivery addresses for orders), why, how long it keeps the data and how customers can ask for it to be removed.'],
    ['Third parties', 'WhatsApp, Google Maps, Instagram and Google Fonts are separate services with their own privacy policies.'] ] },
  terms: { title: 'Terms & Conditions', body: [
    ['Demo website', 'This site is a design demonstration. The shop, products, prices, availability, offers and testimonials shown are sample content and are not a real offer of goods.'],
    ['Orders and payments', 'The checkout does not take payment, reserve stock or save orders. A real shop confirms availability, price, delivery and payment when it receives an order.'],
    ['Images', 'Photography is stock imagery from Unsplash and public-domain sources used for illustration.'] ] }
};

(() => {
  'use strict';

  /* ---------- 2. Helpers, toasts, dialogs, storage ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (el, ev, fn, o) => el && el.addEventListener(ev, fn, o);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smooth = reduceMotion ? 'auto' : 'smooth';
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const IMG = k => 'assets/images/' + k + '.jpg';
  const byId = id => PRODUCTS.find(p => p.id === id);
  const ic = (name, cls) => `<svg class="ic${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  const toastBox = $('#toasts');
  function toast(message, type = 'info', ms = 3600) {
    const t = document.createElement('div');
    t.className = 'toast toast--' + type;
    t.textContent = message;
    toastBox.appendChild(t);
    setTimeout(() => { t.classList.add('is-out'); setTimeout(() => t.remove(), 320); }, ms);
  }

  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  const openDialog = d => { if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', ''); document.body.classList.add('is-locked'); };
  const closeDialog = d => { if (d.open) d.close(); };
  $$('dialog').forEach(d => {
    on(d, 'close', () => { if (!$$('dialog[open]').length) document.body.classList.remove('is-locked'); });
    on(d, 'click', e => { if (e.target === d) closeDialog(d); });
    $$('[data-close]', d).forEach(b => on(b, 'click', () => closeDialog(d)));
  });

  // Fill shop details from CONFIG
  $$('[data-cfg="announce"]').forEach(el => { el.textContent = CONFIG.announce; });
  $$('[data-cfg="offer"]').forEach(el => { el.textContent = CONFIG.offer; });
  $$('[data-cfg="address"]').forEach(el => { el.textContent = CONFIG.address; });
  $$('[data-cfg="deliv-area"]').forEach(el => { el.textContent = CONFIG.delivery.area; });
  $$('[data-cfg="deliv-time"]').forEach(el => { el.textContent = CONFIG.delivery.time; });
  $$('[data-cfg-tel]').forEach(el => { el.textContent = CONFIG.phone; el.href = 'tel:' + CONFIG.phoneTel; });
  $$('[data-cfg-mail]').forEach(el => { el.textContent = CONFIG.email; el.href = 'mailto:' + CONFIG.email; });
  const waUrl = text => 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text);
  $$('[data-cfg-wa], [data-cfg-wa-btn]').forEach(a => { a.href = waUrl('Hello ' + CONFIG.name + ', I have a question.'); });
  $$('[data-ig]').forEach(a => { a.href = CONFIG.instagram; });
  $('#directions').href = CONFIG.mapsUrl;
  $('#year').textContent = new Date().getFullYear();

  /* ---------- 3. Navigation, scroll effects, reveal ---------- */
  const announce = $('#announce');
  try { if (sessionStorage.getItem('verdant-ann') === '1') announce.hidden = true; } catch (e) { /* ignore */ }
  on($('#announceClose'), 'click', () => { announce.hidden = true; try { sessionStorage.setItem('verdant-ann', '1'); } catch (e) { /* ignore */ } });

  const nav = $('#nav'), burger = $('#burger'), menu = $('#navMenu'), scrim = $('#scrim'), progress = $('#progress span'), toTop = $('#toTop');
  const isMobileNav = () => window.innerWidth <= 991;
  const setMenu = open => {
    menu.classList.toggle('is-open', open);
    scrim.hidden = !(open && isMobileNav());
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('is-locked', open && isMobileNav());
  };
  on(burger, 'click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(a => on(a, 'click', () => setMenu(false)));
  on(scrim, 'click', () => setMenu(false));
  on(document, 'keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); burger.focus(); } });
  on(document, 'click', e => { if (menu.classList.contains('is-open') && !menu.contains(e.target) && !burger.contains(e.target)) setMenu(false); });
  on(window, 'resize', () => { if (!isMobileNav()) setMenu(false); });

  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-solid', y > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    toTop.hidden = y < 700;
    ticking = false;
  };
  on(window, 'scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  on(toTop, 'click', () => window.scrollTo({ top: 0, behavior: smooth }));

  const navLinks = $$('[data-nav]');
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        navLinks.forEach(a => { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        const a = navLinks.find(l => l.getAttribute('href') === '#' + en.target.id);
        if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => spy.observe(s));
  }

  const revealEls = $$('.reveal');
  $$('.deliv-grid, .article-grid, .offers').forEach(g => $$('.reveal', g).forEach((el, i) => el.style.setProperty('--d', Math.min(i, 5) * 80 + 'ms')));
  const startReveal = () => {
    if ('IntersectionObserver' in window && !reduceMotion) {
      const io = new IntersectionObserver((entries, obs) => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); } }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      $$('.reveal:not(.is-in)').forEach(el => io.observe(el));
    } else { $$('.reveal').forEach(el => el.classList.add('is-in')); }
  };

  /* ---------- 4. Products: render, search, filters, sort, modal ---------- */
  const badges = p => {
    const out = [];
    if (p.mrp && p.mrp > p.price) out.push(`<span class="bdg bdg--sale">${Math.round((1 - p.price / p.mrp) * 100)}% off</span>`);
    if (p.badge) out.push(`<span class="bdg${p.badge === 'New Arrival' ? ' bdg--new' : ''}">${esc(p.badge)}</span>`);
    return out.length ? `<div class="badges">${out.join('')}</div>` : '';
  };
  const priceHtml = p => `<p class="price"><span>${inr(p.price)}</span>${p.mrp && p.mrp > p.price ? `<s>${inr(p.mrp)}</s>` : ''}</p>`;
  const availHtml = p => `<p class="avail${p.avail === 'Made to order' ? ' avail--order' : ''}">${esc(p.avail)}</p>`;

  function cardHtml(p, i = 0) {
    return `<li class="pcard" data-id="${p.id}" style="--d:${(i % 8) * 45}ms">
      <div class="pcard__media">
        <button type="button" class="pcard__media-btn" data-view="${p.id}" aria-label="Quick view: ${esc(p.name)}" style="position:absolute;inset:0;border:0;padding:0;background:none;cursor:pointer;z-index:1"></button>
        <img src="${IMG(p.img)}" alt="${esc(p.name)}" width="800" height="900" loading="lazy">
        ${badges(p)}
        <button type="button" class="wish" data-wish="${p.id}" aria-pressed="false" aria-label="Add ${esc(p.name)} to wishlist">${ic('heart')}</button>
        <button type="button" class="quick" data-view="${p.id}">${ic('eye')}Quick View</button>
      </div>
      <div class="pcard__body">
        <p class="pcard__cat">${esc(CAT_LABEL[p.cat])}</p>
        <h3><button type="button" class="pcard__name" data-view="${p.id}">${esc(p.name)}</button></h3>
        ${priceHtml(p)}
        ${availHtml(p)}
        <button type="button" class="btn btn--dark" data-add="${p.id}">${ic('bag')}Add to Cart</button>
      </div>
    </li>`;
  }

  // Shop state
  const S = { cat: 'all', tag: null, q: '', sort: 'popular', limit: 12 };
  const PAGE = 12;
  const grid = $('#productGrid');
  const searchInput = $('#searchInput'), clearBtn = $('#searchClear'), suggest = $('#suggest');
  const shopFilters = $('#shopFilters');

  shopFilters.innerHTML = FILTERS.map(([k, label]) => `<button type="button" class="chip${k === 'all' ? ' is-active' : ''}" data-filter="${k}" aria-pressed="${k === 'all'}">${esc(label)}</button>`).join('');

  const hay = p => (p.name + ' ' + CAT_LABEL[p.cat] + ' ' + p.tags.map(t => TAG_LABEL[t] || t).join(' ') + ' ' + (p.type === 'plant' ? 'plant ' : '') + (p.flowerType || '') + ' ' + (p.desc || '') + ' ' + (p.env || '')).toLowerCase();
  const matches = (p, q) => { const h = hay(p); return q.toLowerCase().split(/\s+/).filter(Boolean).every(t => h.includes(t)); };

  function filtered() {
    let list = PRODUCTS.filter(p => (S.cat === 'all' || p.cat === S.cat) && (!S.tag || p.tags.includes(S.tag)) && (!S.q || matches(p, S.q)));
    const cmp = { popular: (a, b) => b.pop - a.pop, new: (a, b) => b.n - a.n, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, az: (a, b) => a.name.localeCompare(b.name) }[S.sort];
    return list.sort(cmp);
  }

  function renderShop(resetLimit) {
    if (resetLimit) S.limit = PAGE;
    const all = filtered(), shown = all.slice(0, S.limit);
    grid.innerHTML = shown.map((p, i) => cardHtml(p, i)).join('');
    $('#shopCount').textContent = all.length ? 'Showing ' + shown.length + ' of ' + all.length + ' product' + (all.length === 1 ? '' : 's') : '';
    $('#noResults').hidden = all.length > 0;
    $('#loadMore').parentElement.hidden = shown.length >= all.length;
    $$('.chip', shopFilters).forEach(c => { const a = !S.tag && c.dataset.filter === S.cat; c.classList.toggle('is-active', a); c.setAttribute('aria-pressed', String(a)); });
    const pill = $('#activeTag');
    pill.hidden = !S.tag;
    if (S.tag) pill.innerHTML = 'Showing: ' + esc(TAG_LABEL[S.tag]) + ' ' + ic('x');
    clearBtn.hidden = !S.q;
    syncWish();
  }

  function setFilter(f, scroll) {
    S.cat = f.cat || 'all'; S.tag = f.tag || null;
    renderShop(true);
    if (scroll) $('#shop').scrollIntoView({ behavior: smooth });
  }
  on(shopFilters, 'click', e => { const c = e.target.closest('.chip'); if (c) setFilter({ cat: c.dataset.filter }); });
  on($('#activeTag'), 'click', () => setFilter({ cat: S.cat }));
  on($('#sortSelect'), 'change', e => { S.sort = e.target.value; renderShop(true); });
  on($('#loadMore'), 'click', () => {
    const before = S.limit; S.limit += PAGE; renderShop();
    const first = $$('.pcard', grid)[before]; if (first) $('.pcard__name', first).focus({ preventScroll: true });
  });
  on($('#resetShop'), 'click', () => { S.q = ''; searchInput.value = ''; setFilter({ cat: 'all' }); });

  // Search with live suggestions
  let sugIdx = -1, sugItems = [];
  function showSuggestions() {
    const q = searchInput.value.trim();
    if (!q) { hideSuggest(); return; }
    sugItems = PRODUCTS.filter(p => matches(p, q)).sort((a, b) => b.pop - a.pop).slice(0, 6);
    if (!sugItems.length) { suggest.innerHTML = '<li role="option" aria-selected="false" aria-disabled="true">No matches yet</li>'; }
    else suggest.innerHTML = sugItems.map((p, i) => `<li role="option" id="sg${i}" aria-selected="false" data-sg="${i}">${esc(p.name)}<small>${esc(CAT_LABEL[p.cat])}</small></li>`).join('');
    suggest.hidden = false; searchInput.setAttribute('aria-expanded', 'true'); sugIdx = -1;
  }
  function hideSuggest() { suggest.hidden = true; searchInput.setAttribute('aria-expanded', 'false'); searchInput.removeAttribute('aria-activedescendant'); sugIdx = -1; }
  function moveSug(d) {
    if (!sugItems.length || suggest.hidden) return;
    sugIdx = (sugIdx + d + sugItems.length) % sugItems.length;
    $$('[data-sg]', suggest).forEach((li, i) => li.setAttribute('aria-selected', String(i === sugIdx)));
    searchInput.setAttribute('aria-activedescendant', 'sg' + sugIdx);
  }
  function pickSuggestion(i) { const p = sugItems[i]; if (!p) return; searchInput.value = p.name; S.q = p.name; hideSuggest(); renderShop(true); }
  on(searchInput, 'input', () => { S.q = searchInput.value.trim(); showSuggestions(); renderShop(true); });
  on(searchInput, 'keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSug(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveSug(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (sugIdx >= 0) pickSuggestion(sugIdx); else { hideSuggest(); } }
    else if (e.key === 'Escape') { hideSuggest(); }
  });
  on(suggest, 'mousedown', e => { const li = e.target.closest('[data-sg]'); if (li) { e.preventDefault(); pickSuggestion(+li.dataset.sg); } });
  on(document, 'click', e => { if (!e.target.closest('.search')) hideSuggest(); });
  on(clearBtn, 'click', () => { searchInput.value = ''; S.q = ''; hideSuggest(); renderShop(true); searchInput.focus(); });
  on($('#searchBtn'), 'click', () => { $('#shop').scrollIntoView({ behavior: smooth }); setTimeout(() => searchInput.focus({ preventScroll: true }), reduceMotion ? 0 : 600); });
  $$('[data-filter-link]').forEach(b => on(b, 'click', e => { e.preventDefault(); setFilter({ cat: b.dataset.filterLink }, true); }));
  on($('[data-new-arrivals]'), 'click', e => { e.preventDefault(); S.sort = 'new'; $('#sortSelect').value = 'new'; setFilter({ cat: 'all' }, true); });

  // Product modal
  const pModal = $('#productModal');
  let modalQty = 1, modalProduct = null;
  function specRows(p) {
    const rows = [];
    if (p.type === 'plant') {
      rows.push(['Sunlight', p.light.map(l => LIGHT_LABEL[l]).join(' or ')], ['Watering', p.water], ['Plant height', p.height], ['Maintenance', CARE_LABEL[p.care]], ['Best for', p.env]);
      if (p.season) rows.push(['Flowering season', p.season]);
    } else if (p.type === 'flower') {
      rows.push(['Flower type', p.flowerType], ['Arrangement', p.arrangement], ['Available sizes', p.sizes.join(', ')], ['Seasonal availability', p.season]);
    } else {
      rows.push(['Material', p.material], ['Size', p.size], ['Details', p.details]);
    }
    return rows;
  }
  function openProduct(id) {
    const p = byId(id); if (!p) return;
    modalProduct = p; modalQty = 1;
    $('#pmBody').innerHTML = `
      <div class="pm__img"><img src="${IMG(p.img)}" alt="${esc(p.name)}" width="800" height="900">${badges(p)}</div>
      <div class="pm__body">
        <p class="pcard__cat">${esc(CAT_LABEL[p.cat])}</p>
        <h2 id="pmTitle">${esc(p.name)}</h2>
        ${priceHtml(p)}
        ${availHtml(p)}
        <p class="pm__desc">${esc(p.desc)}</p>
        <dl class="specs">${specRows(p).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <div class="pm__buy">
          <div class="qty" role="group" aria-label="Quantity"><button type="button" id="pmMinus" aria-label="Decrease quantity">${ic('minus')}</button><span id="pmQty" aria-live="polite">1</span><button type="button" id="pmPlus" aria-label="Increase quantity">${ic('plus')}</button></div>
          <button type="button" class="btn btn--dark" id="pmAdd">${ic('bag')}Add to Cart</button>
        </div>
        <button type="button" class="pm__wish" data-wish="${p.id}" aria-pressed="false">${ic('heart')}<span>Add to Wishlist</span></button>
      </div>`;
    syncWish();
    openDialog(pModal);
  }
  const qtyUpdate = () => { $('#pmQty').textContent = modalQty; $('#pmMinus').disabled = modalQty <= 1; $('#pmPlus').disabled = modalQty >= 20; };
  on(pModal, 'click', e => {
    if (e.target.closest('#pmMinus')) { modalQty = Math.max(1, modalQty - 1); qtyUpdate(); }
    else if (e.target.closest('#pmPlus')) { modalQty = Math.min(20, modalQty + 1); qtyUpdate(); }
    else if (e.target.closest('#pmAdd')) { addToCart(modalProduct.id, modalQty); }
  });
  const pmObserver = new MutationObserver(() => { if ($('#pmQty')) qtyUpdate(); });
  pmObserver.observe($('#pmBody'), { childList: true });

  /* ---------- 5. Cart, wishlist, checkout (demo) ---------- */
  const CART_KEY = 'verdant-cart-v1', WISH_KEY = 'verdant-wish-v1';
  const saved = store.get(CART_KEY, { items: [], coupon: '' });
  let cart = (saved.items || []).filter(i => byId(i.id) && i.qty > 0).map(i => ({ id: i.id, qty: Math.min(20, i.qty) }));
  let couponCode = CONFIG.coupons[saved.coupon] ? saved.coupon : '';
  let wish = (store.get(WISH_KEY, []) || []).filter(id => byId(id));
  const saveCart = () => store.set(CART_KEY, { items: cart, coupon: couponCode });
  const saveWish = () => store.set(WISH_KEY, wish);

  function totals() {
    const sub = cart.reduce((s, l) => s + byId(l.id).price * l.qty, 0);
    let disc = 0;
    const c = CONFIG.coupons[couponCode];
    if (c && sub >= c.min && sub > 0) disc = c.type === 'percent' ? Math.round(sub * c.value / 100) : Math.min(c.value, sub);
    const after = sub - disc;
    const ship = cart.length === 0 ? 0 : (after >= CONFIG.delivery.freeAbove ? 0 : CONFIG.delivery.charge);
    return { sub, disc, ship, total: after + ship, count: cart.reduce((s, l) => s + l.qty, 0), couponOk: !!(c && sub >= c.min && sub > 0) };
  }
  const bump = el => { el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump'); };
  function updateCounts() {
    const t = totals();
    const cc = $('#cartCount'), wc = $('#wishCount');
    cc.hidden = t.count === 0; cc.textContent = t.count;
    wc.hidden = wish.length === 0; wc.textContent = wish.length;
    $('#cartBtn').setAttribute('aria-label', 'Open cart, ' + t.count + ' item' + (t.count === 1 ? '' : 's'));
    $('#wishBtn').setAttribute('aria-label', 'Open wishlist, ' + wish.length + ' item' + (wish.length === 1 ? '' : 's'));
  }
  function syncWish() {
    $$('[data-wish]').forEach(b => {
      const on_ = wish.includes(+b.dataset.wish), p = byId(+b.dataset.wish);
      b.setAttribute('aria-pressed', String(on_));
      if (b.classList.contains('wish')) b.setAttribute('aria-label', (on_ ? 'Remove ' : 'Add ') + p.name + (on_ ? ' from wishlist' : ' to wishlist'));
      else { const s = $('span', b); if (s) s.textContent = on_ ? 'In your Wishlist (remove)' : 'Add to Wishlist'; }
    });
  }

  function addToCart(id, qty = 1) {
    const p = byId(id); if (!p) return;
    const line = cart.find(l => l.id === id);
    if (line) line.qty = Math.min(20, line.qty + qty); else cart.push({ id, qty: Math.min(20, qty) });
    saveCart(); updateCounts(); bump($('#cartCount')); renderCart();
    toast(p.name + ' added to your cart.', 'ok');
  }
  function setQty(id, qty) {
    const line = cart.find(l => l.id === id); if (!line) return;
    if (qty <= 0) cart = cart.filter(l => l.id !== id); else line.qty = Math.min(20, qty);
    saveCart(); updateCounts(); renderCart();
  }
  function toggleWish(id) {
    const p = byId(id), i = wish.indexOf(id);
    if (i >= 0) { wish.splice(i, 1); toast(p.name + ' removed from your wishlist.'); } else { wish.push(id); toast(p.name + ' added to your wishlist.', 'ok'); bump($('#wishCount')); }
    saveWish(); updateCounts(); syncWish(); renderWish();
  }

  const cartDrawer = $('#cartDrawer'), wishDrawer = $('#wishDrawer');
  function renderCart() {
    const body = $('#cartBody'), foot = $('#cartFoot');
    if (!cart.length) {
      body.innerHTML = `<div class="empty-d">${ic('bag')}<h3>Your cart is empty</h3><p>Add a plant or a bouquet and it will appear here.</p></div>`;
      foot.innerHTML = `<button type="button" class="btn btn--dark btn--block" data-continue>Continue Shopping</button>`;
      return;
    }
    body.innerHTML = cart.map(l => {
      const p = byId(l.id);
      return `<div class="line" data-line="${p.id}">
        <img src="${IMG(p.img)}" alt="${esc(p.name)}" width="800" height="900">
        <div><h3>${esc(p.name)}</h3><p class="line__price">${inr(p.price)} each</p>
          <div class="qty" role="group" aria-label="Quantity of ${esc(p.name)}"><button type="button" data-dec="${p.id}" aria-label="Decrease quantity of ${esc(p.name)}">${ic('minus')}</button><span>${l.qty}</span><button type="button" data-inc="${p.id}" aria-label="Increase quantity of ${esc(p.name)}">${ic('plus')}</button></div></div>
        <div><p class="line__sub">${inr(p.price * l.qty)}</p><button type="button" class="line__rm" data-rm="${p.id}" aria-label="Remove ${esc(p.name)} from cart">${ic('trash')}</button></div>
      </div>`;
    }).join('');
    const t = totals();
    const c = CONFIG.coupons[couponCode];
    foot.innerHTML = `
      <form class="coupon-in" id="couponForm" novalidate><label class="sr" for="couponInput">Coupon code</label><input id="couponInput" type="text" placeholder="Coupon code" value="${esc(couponCode)}" autocomplete="off"><button type="submit" class="btn btn--line-dark btn--sm">Apply</button></form>
      <div class="sum">
        <div><span>Subtotal</span><span>${inr(t.sub)}</span></div>
        ${couponCode ? `<div class="disc"><span>${t.couponOk ? esc(couponCode) + ' applied' : esc(couponCode) + ' not applicable'}</span><span>${t.couponOk ? '−' + inr(t.disc) : (c ? 'min. ' + inr(c.min) : '')}</span></div>` : ''}
        <div><span>Delivery</span><span>${t.ship === 0 ? 'Free' : inr(t.ship)}</span></div>
        <div><small>Free delivery from ${inr(CONFIG.delivery.freeAbove)} (sample policy)</small></div>
        <div class="total"><span>Total</span><span>${inr(t.total)}</span></div>
      </div>
      <div class="drawer__actions"><button type="button" class="btn btn--accent btn--block" id="goCheckout">Checkout</button><button type="button" class="btn btn--line-dark btn--block" data-continue>Continue Shopping</button><button type="button" class="link-btn" id="clearCart">Clear Cart</button></div>`;
  }
  function renderWish() {
    const body = $('#wishBody'), foot = $('#wishFoot');
    if (!wish.length) {
      body.innerHTML = `<div class="empty-d">${ic('heart')}<h3>Your wishlist is empty</h3><p>Tap the heart on any product to save it here.</p></div>`;
      foot.innerHTML = '<button type="button" class="btn btn--dark btn--block" data-continue>Continue Shopping</button>'; return;
    }
    body.innerHTML = wish.map(id => {
      const p = byId(id);
      return `<div class="line" data-line="${p.id}">
        <img src="${IMG(p.img)}" alt="${esc(p.name)}" width="800" height="900">
        <div><h3>${esc(p.name)}</h3><p class="line__price">${inr(p.price)}</p><button type="button" class="btn btn--dark btn--sm" data-move="${p.id}">${ic('bag')}Move to Cart</button></div>
        <div><button type="button" class="line__rm" data-wish-rm="${p.id}" aria-label="Remove ${esc(p.name)} from wishlist">${ic('trash')}</button></div>
      </div>`;
    }).join('');
    foot.innerHTML = '<button type="button" class="btn btn--line-dark btn--block" data-continue>Continue Shopping</button>';
  }

  const openCart = () => { renderCart(); closeDialog(wishDrawer); openDialog(cartDrawer); };
  const openWish = () => { renderWish(); closeDialog(cartDrawer); openDialog(wishDrawer); };
  on($('#cartBtn'), 'click', openCart); on($('#footCart'), 'click', openCart);
  on($('#wishBtn'), 'click', openWish); on($('#footWish'), 'click', openWish);

  // Delegated clicks for products, cart and wishlist
  on(document, 'click', e => {
    const t = e.target;
    const v = t.closest('[data-view]'); if (v) { openProduct(+v.dataset.view); return; }
    const a = t.closest('[data-add]'); if (a) { addToCart(+a.dataset.add, 1); return; }
    const w = t.closest('[data-wish]'); if (w) { toggleWish(+w.dataset.wish); return; }
    const inc = t.closest('[data-inc]'); if (inc) { const l = cart.find(x => x.id === +inc.dataset.inc); if (l) setQty(l.id, l.qty + 1); return; }
    const dec = t.closest('[data-dec]'); if (dec) { const l = cart.find(x => x.id === +dec.dataset.dec); if (l) setQty(l.id, l.qty - 1); return; }
    const rm = t.closest('[data-rm]'); if (rm) { setQty(+rm.dataset.rm, 0); toast('Item removed from your cart.'); return; }
    const mv = t.closest('[data-move]'); if (mv) { const id = +mv.dataset.move; wish = wish.filter(x => x !== id); saveWish(); addToCart(id, 1); updateCounts(); syncWish(); renderWish(); return; }
    const wr = t.closest('[data-wish-rm]'); if (wr) { toggleWish(+wr.dataset.wishRm); return; }
    if (t.closest('[data-continue]')) { closeDialog(cartDrawer); closeDialog(wishDrawer); $('#shop').scrollIntoView({ behavior: smooth }); return; }
    if (t.closest('#clearCart')) { cart = []; couponCode = ''; saveCart(); updateCounts(); renderCart(); toast('Cart cleared.'); return; }
    if (t.closest('#goCheckout')) { openCheckout(); return; }
  });
  on(document, 'submit', e => {
    if (e.target.id !== 'couponForm') return;
    e.preventDefault();
    const code = $('#couponInput').value.trim().toUpperCase();
    if (!code) { couponCode = ''; saveCart(); renderCart(); return; }
    const c = CONFIG.coupons[code];
    if (!c) { toast('That code is not valid. Try WELCOME10.', 'err'); return; }
    couponCode = code; saveCart(); renderCart();
    const t = totals();
    toast(t.couponOk ? c.label + ' applied (sample code).' : c.label + ': add more items to reach the minimum.', t.couponOk ? 'ok' : 'info', 4200);
  });

  // Checkout
  const coModal = $('#checkoutModal'), coForm = $('#coForm'), coEl = $('.co', coModal);
  const oState = $('#o-state');
  STATES.forEach(s => { const o = document.createElement('option'); o.textContent = s; oState.appendChild(o); });
  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const isPhone = v => /^(?:\+?91)?[6-9]\d{9}$/.test(v.replace(/[\s\-()]/g, ''));
  const isPin = v => /^[1-9][0-9]{5}$/.test(v);
  const setErr = (field, msg) => { field.classList.add('is-invalid'); const i = $('input, select, textarea', field); i.setAttribute('aria-invalid', 'true'); $('.err', field).textContent = msg; };
  const clrErr = field => { if (!field) return; field.classList.remove('is-invalid'); const i = $('input, select, textarea', field); if (i) i.removeAttribute('aria-invalid'); const e = $('.err', field); if (e) e.textContent = ''; };
  const validate = rules => { let first = null; rules.forEach(([input, check]) => { const f = input.closest('.field'); const m = check(input.value.trim()); if (m) { setErr(f, m); if (!first) first = input; } else clrErr(f); }); return first; };
  const liveClear = form => $$('input, select, textarea', form).forEach(i => { on(i, 'input', () => clrErr(i.closest('.field'))); on(i, 'change', () => clrErr(i.closest('.field'))); });
  const setLoading = (btn, v) => { btn.disabled = v; btn.classList.toggle('is-loading', v); btn.setAttribute('aria-busy', String(v)); };
  liveClear(coForm);
  const nameRule = v => v.length < 2 ? 'Please enter your full name.' : (/\d/.test(v) ? 'Names cannot contain numbers.' : '');
  const phoneRule = v => !v ? 'Please enter your mobile number.' : (!isPhone(v) ? 'Enter a valid 10-digit Indian mobile number.' : '');
  const emailRule = v => !v ? 'Please enter your email address.' : (!isEmail(v) ? 'Enter a valid email, like name@example.com.' : '');
  const req = label => v => v.length < 2 ? 'Please enter ' + label + '.' : '';
  const CO = {
    name: [$('#o-name'), nameRule], phone: [$('#o-phone'), phoneRule], email: [$('#o-email'), emailRule],
    addr: [$('#o-addr'), req('your house or street address')], area: [$('#o-area'), req('your area')], city: [$('#o-city'), req('your city')],
    state: [oState, v => v ? '' : 'Please choose your state.'],
    pin: [$('#o-pin'), v => !v ? 'Please enter your PIN code.' : (!isPin(v) ? 'Enter a valid 6-digit PIN code.' : '')]
  };

  function renderSummary() {
    const t = totals();
    $('#coSum').innerHTML = `<h3>Order summary</h3>` +
      cart.map(l => { const p = byId(l.id); return `<div class="co__item"><span>${esc(p.name)} × ${l.qty}</span><span>${inr(p.price * l.qty)}</span></div>`; }).join('') +
      `<div class="sum" style="margin-top:1rem"><div><span>Subtotal</span><span>${inr(t.sub)}</span></div>` +
      (t.couponOk ? `<div class="disc"><span>${esc(couponCode)}</span><span>−${inr(t.disc)}</span></div>` : '') +
      `<div><span>Delivery</span><span>${t.ship === 0 ? 'Free' : inr(t.ship)}</span></div><div class="total"><span>Total</span><span>${inr(t.total)}</span></div></div>`;
  }
  function openCheckout() {
    if (!cart.length) { toast('Your cart is empty.', 'err'); return; }
    closeDialog(cartDrawer);
    coEl.dataset.step = 'form'; $('#coMain').hidden = false; $('#coSum').hidden = false; $('#coReview').hidden = true; $('#coConfirm').hidden = true;
    renderSummary();
    openDialog(coModal);
  }
  function orderMessage() {
    const t = totals(), v = id => $('#' + id).value.trim();
    const lines = ['Hello ' + CONFIG.name + ', I would like to place an order.', '',
      'Name: ' + v('o-name'), 'Mobile: ' + v('o-phone'), 'Email: ' + v('o-email'),
      'Address: ' + [v('o-addr'), v('o-area'), v('o-city'), v('o-state'), v('o-pin')].join(', '), '', 'Order:'];
    cart.forEach((l, i) => { const p = byId(l.id); lines.push((i + 1) + '. ' + p.name + ' x' + l.qty + ' - ' + inr(p.price * l.qty)); });
    lines.push('', 'Subtotal: ' + inr(t.sub));
    if (t.couponOk) lines.push('Discount (' + couponCode + '): -' + inr(t.disc));
    lines.push('Delivery: ' + (t.ship === 0 ? 'Free' : inr(t.ship)), 'Total: ' + inr(t.total));
    if (v('o-note')) lines.push('', 'Instructions: ' + v('o-note'));
    lines.push('', '(Placed from the VERDANT demo checkout. Please confirm availability, delivery and payment.)');
    return lines.join('\n');
  }
  let orderText = '';
  on(coForm, 'submit', e => {
    e.preventDefault();
    const bad = validate(Object.values(CO));
    if (bad) { bad.focus(); toast('Please fix the highlighted fields.', 'err'); return; }
    orderText = orderMessage();
    $('#coPre').textContent = orderText;
    coEl.dataset.step = 'review'; $('#coMain').hidden = true; $('#coSum').hidden = true; $('#coReview').hidden = false; $('#coConfirm').hidden = true;
    $('#coReview').focus();
    coModal.scrollTop = 0;
  });
  on($('#coBack'), 'click', () => { coEl.dataset.step = 'form'; $('#coMain').hidden = false; $('#coSum').hidden = false; $('#coReview').hidden = true; });
  on($('#coWa'), 'click', () => {
    const w = window.open(waUrl(orderText), '_blank', 'noopener');
    if (!w) { toast('Your browser blocked the WhatsApp window. Please allow pop-ups.', 'err', 5000); return; }
    toast('Opening WhatsApp. Press send there to message your order.', 'ok', 5000);
    $('#coConfirm').hidden = false;
  });
  on($('#coClear'), 'click', () => {
    cart = []; couponCode = ''; saveCart(); updateCounts(); renderCart(); coForm.reset(); closeDialog(coModal);
    toast('Cart cleared. Thank you! The shop will confirm your order on WhatsApp.', 'ok', 5000);
  });
  on($('#coKeep'), 'click', () => { $('#coConfirm').hidden = true; toast('Your cart has been kept.'); });

  /* ---------- 6. Collections, guide, finder, offers ---------- */
  // Categories
  $('#catGrid').innerHTML = CATEGORIES.map((c, i) => `<li class="reveal" style="--d:${(i % 5) * 60}ms"><button type="button" class="cat" data-cat-i="${i}"><img src="${IMG(c.img)}" alt="" width="800" height="900" loading="lazy"><span class="cat__body"><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p><span class="cat__go">Explore Collection${ic('arrow')}</span></span></button></li>`).join('');
  on($('#catGrid'), 'click', e => { const b = e.target.closest('[data-cat-i]'); if (b) setFilter(CATEGORIES[+b.dataset.catI].f, true); });

  // Bestsellers + gardening grids
  $('#bestGrid').innerHTML = BEST_IDS.map((id, i) => cardHtml(byId(id), i)).join('');
  $('#gardenGrid').innerHTML = PRODUCTS.filter(p => p.cat === 'accessories').slice(0, 8).map((p, i) => cardHtml(p, i)).join('');
  $('#essentials').innerHTML = ESSENTIALS.map((e, i) => `<li><button type="button" class="ess" style="width:100%" data-ess="${i}">${ic(e.icon)}${esc(e.name)}</button></li>`).join('');
  on($('#essentials'), 'click', e => { const b = e.target.closest('[data-ess]'); if (b) setFilter(ESSENTIALS[+b.dataset.ess].f, true); });

  // Flower collection
  $('#flowerGrid').innerHTML = FLOWER_COLLECTIONS.map((f, i) => `<li class="fl reveal" style="--d:${(i % 3) * 80}ms"><div class="fl__img"><img src="${IMG(f.img)}" alt="${esc(f.name)}" width="800" height="900" loading="lazy"></div><div class="fl__body"><h3>${esc(f.name)}</h3><p>${esc(f.desc)}</p><p class="fl__price"><small>Starting from</small>${inr(f.from)}</p><div class="fl__actions"><button type="button" class="btn btn--accent btn--sm" data-fl-wa="${i}">${ic('chat')}Order on WhatsApp</button><button type="button" class="btn btn--line btn--sm" data-fl-go>Explore Collection</button></div></div></li>`).join('');
  on($('#flowerGrid'), 'click', e => {
    const w = e.target.closest('[data-fl-wa]');
    if (w) { const f = FLOWER_COLLECTIONS[+w.dataset.flWa]; const win = window.open(waUrl('Hello ' + CONFIG.name + ', I would like to order flowers: ' + f.name + ' (starting from ' + inr(f.from) + '). Please share options and availability.'), '_blank', 'noopener'); toast(win ? 'Opening WhatsApp for your flower order.' : 'Your browser blocked the WhatsApp window. Please allow pop-ups.', win ? 'ok' : 'err'); return; }
    if (e.target.closest('[data-fl-go]')) setFilter({ cat: 'flowers' }, true);
  });

  // Articles
  $('#articleGrid').innerHTML = ARTICLES.map((a, i) => `<li class="art reveal" style="--d:${(i % 4) * 70}ms"><div class="art__img"><img src="${IMG(a.img)}" alt="" width="800" height="900" loading="lazy"></div><div class="art__body"><p class="art__meta">${a.min} min read</p><h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p><button type="button" class="link" data-article="${i}">Read More${ic('arrow')}</button></div></li>`).join('');
  $('#footGuides').innerHTML = ARTICLES.slice(0, 5).map((a, i) => `<li><button type="button" class="flink" data-article="${i}">${esc(a.title)}</button></li>`).join('');
  const arModal = $('#articleModal');
  on(document, 'click', e => {
    const b = e.target.closest('[data-article]'); if (!b) return;
    const a = ARTICLES[+b.dataset.article];
    $('#arBody').innerHTML = `<img class="ar__cover" src="${IMG(a.img)}" alt="" width="800" height="900"><p class="ar__meta">${a.min} min read &middot; Plant care guide</p><h2 id="arTitle">${esc(a.title)}</h2><p class="lead">${esc(a.desc)}</p>` + a.body.map(([h, p]) => `<h3>${esc(h)}</h3><p>${esc(p)}</p>`).join('') + `<p><button type="button" class="btn btn--dark" data-art-shop>Shop Plants${ic('arrow')}</button></p>`;
    openDialog(arModal);
  });
  on(arModal, 'click', e => { if (e.target.closest('[data-art-shop]')) { closeDialog(arModal); setFilter({ cat: 'all' }, true); } });

  // Offers
  $('#offerGrid').innerHTML = OFFERS.map((o, i) => `<li class="offer reveal${o.feat ? ' offer--feat' : ''}" style="--d:${(i % 3) * 80}ms"><span class="offer__badge">${esc(o.badge)}</span><p class="offer__big">${esc(o.big)}</p><h3>${esc(o.title)}</h3><p>${esc(o.desc)}</p><p class="offer__valid">${esc(o.valid)}</p>${o.code ? `<div class="coupon"><code>${esc(o.code)}</code><button type="button" class="coupon__btn" data-copy="${esc(o.code)}" aria-label="Copy code ${esc(o.code)}">${ic('copy')}<span>Copy</span></button></div>` : ''}<button type="button" class="btn ${o.feat ? 'btn--accent' : 'btn--dark'} btn--block" data-offer-go="${esc(o.go)}">${esc(o.cta)}</button></li>`).join('');
  on($('#offerGrid'), 'click', e => { const g = e.target.closest('[data-offer-go]'); if (g) { const t = document.getElementById(g.dataset.offerGo); if (t) t.scrollIntoView({ behavior: smooth }); } });
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (err) { /* fall through */ }
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    ta.remove(); return ok;
  }
  on($('#offerGrid'), 'click', async e => {
    const btn = e.target.closest('[data-copy]'); if (!btn) return;
    const code = btn.dataset.copy, ok = await copyText(code), label = $('span', btn);
    if (ok) { label.textContent = 'Copied'; toast('Code ' + code + ' copied. Apply it in your cart (sample code).', 'ok', 4500); setTimeout(() => { label.textContent = 'Copy'; }, 2000); }
    else toast('Could not copy automatically. The code is ' + code + '.', 'err', 5000);
  });

  // Plant care finder
  const finderForm = $('#finderForm'), finderRes = $('#finderResults');
  const FINDER_TYPES = ['indoor', 'outdoor', 'flowering', 'succulents'];
  const placeName = { bedroom: 'a bedroom', living: 'a living room', balcony: 'a balcony', office: 'an office', garden: 'a garden' };
  function recHtml(p, i) {
    return `<li class="rec" style="--d:${i * 70}ms"><img src="${IMG(p.img)}" alt="${esc(p.name)}" width="800" height="900" loading="lazy"><div><h4>${esc(p.name)}</h4><p class="rec__meta"><span><strong>${inr(p.price)}</strong></span><span>${esc(CARE_LABEL[p.care])}</span><span>${esc(p.light.map(l => LIGHT_LABEL[l]).join(', '))}</span></p><div class="rec__actions"><button type="button" class="btn btn--dark btn--sm" data-view="${p.id}">Shop Now</button><button type="button" class="btn btn--line-dark btn--sm" data-add="${p.id}">${ic('bag')}Add to Cart</button></div></div></li>`;
  }
  on(finderForm, 'submit', e => {
    e.preventDefault();
    const v = n => { const r = $(`input[name="${n}"]:checked`, finderForm); return r ? r.value : ''; };
    const place = v('place'), light = v('light'), care = +v('care'), budget = v('budget');
    if (!place || !light || !care || !budget) { $('#finderErr').textContent = 'Please answer all four questions.'; return; }
    $('#finderErr').textContent = '';
    const [lo, hi] = budget.split('-').map(Number);
    const scored = PRODUCTS.filter(p => FINDER_TYPES.includes(p.cat)).map(p => {
      const m = { place: p.places.includes(place), light: p.light.includes(light), care: p.care <= care, budget: p.price >= lo && p.price <= hi };
      return { p, m, score: (m.place ? 3 : 0) + (m.light ? 3 : 0) + (m.care ? 2 : 0) + (m.budget ? 2 : 0) };
    });
    const perfect = scored.filter(s => s.score === 10).sort((a, b) => b.p.pop - a.p.pop);
    let list = perfect, note = '';
    if (!perfect.length) { list = scored.filter(s => s.score >= 8).sort((a, b) => b.score - a.score || b.p.pop - a.p.pop); note = 'No plant matches every answer, so here are the closest matches.'; }
    list = list.slice(0, 6);
    if (!list.length) {
      finderRes.innerHTML = `<div class="finder__empty">${ic('search')}<h3>No close matches</h3><p>Try a different light level or budget, or browse the full collection.</p><a class="btn btn--dark btn--sm" href="#shop">Browse the Shop</a></div>`;
    } else {
      finderRes.innerHTML = `<h3>${perfect.length ? 'Your matches' : 'Closest matches'}</h3><p class="finder__note">${note || 'Plants for ' + placeName[place] + ' with ' + LIGHT_LABEL[light].toLowerCase() + '.'}</p><ul class="rec-list">${list.map((s, i) => recHtml(s.p, i)).join('')}</ul>`;
    }
    finderRes.focus({ preventScroll: true });
    if (window.innerWidth <= 991) finderRes.scrollIntoView({ behavior: smooth, block: 'nearest' });
  });
  on($('#finderReset'), 'click', () => {
    finderForm.reset(); $('#finderErr').textContent = '';
    finderRes.innerHTML = `<div class="finder__empty">${ic('sprout')}<p>Your matching plants will appear here.</p></div>`;
  });

  /* ---------- 7. Forms, slider ---------- */
  const cForm = $('#contactForm'), cBtn = $('#contactSubmit');
  liveClear(cForm);
  on(cForm, 'submit', e => {
    e.preventDefault();
    const bad = validate([[$('#c-name'), req('your name')], [$('#c-phone'), phoneRule], [$('#c-email'), emailRule], [$('#c-subject'), req('a subject')], [$('#c-msg'), v => v.length < 10 ? 'Please write a short message (at least 10 characters).' : '']]);
    if (bad) { bad.focus(); toast('Please fix the highlighted fields.', 'err'); return; }
    setLoading(cBtn, true);
    setTimeout(() => { setLoading(cBtn, false); cForm.reset(); toast('Demo only: your message was not sent. Use WhatsApp or phone to reach the shop.', 'info', 5200); }, 1100);
  });
  [['newsForm', 'n-email'], ['footNewsForm', 'fn-email']].forEach(([fid, iid]) => {
    const form = $('#' + fid), input = $('#' + iid), err = $('#' + iid + '-e');
    on(input, 'input', () => { err.textContent = ''; input.removeAttribute('aria-invalid'); });
    on(form, 'submit', e => {
      e.preventDefault();
      const val = input.value.trim(), msg = !val ? 'Please enter your email address.' : (!isEmail(val) ? 'Enter a valid email address.' : '');
      if (msg) { err.textContent = msg; input.setAttribute('aria-invalid', 'true'); input.focus(); toast(msg, 'err'); return; }
      form.reset(); toast('Demo only: you were not subscribed and nothing was stored.', 'info', 4800);
    });
  });

  // Instagram grid
  $('#instaGrid').innerHTML = INSTA.map(k => `<li><a data-ig href="${CONFIG.instagram}" target="_blank" rel="noopener noreferrer"><img src="${IMG(k)}" alt="Plant and flower inspiration photo" width="800" height="900" loading="lazy"><span>${ic('instagram')}<span class="sr">View on Instagram (opens in a new tab)</span></span></a></li>`).join('');

  // Legal
  const legalModal = $('#legalModal');
  $$('[data-legal]').forEach(b => on(b, 'click', () => {
    const d = LEGAL[b.dataset.legal];
    $('#legalTitle').textContent = d.title;
    const box = $('#legalBody'); box.innerHTML = '';
    d.body.forEach(([h, p]) => { const h3 = document.createElement('h3'); h3.textContent = h; const para = document.createElement('p'); para.textContent = p; box.append(h3, para); });
    openDialog(legalModal);
  }));

  // Testimonial slider
  const track = $('#sliderTrack'), viewport = $('#sliderViewport'), slides = $$('.slide', track), dotsWrap = $('#dots'), slider = $('#slider');
  let idx = 0, timer = null, paused = false, dragX = null, dragDX = 0;
  slides.forEach((_, i) => { const d = document.createElement('button'); d.type = 'button'; d.className = 'dot'; d.setAttribute('aria-label', 'Show review ' + (i + 1)); on(d, 'click', () => { go(i); restart(); }); dotsWrap.appendChild(d); });
  const dots = $$('.dot', dotsWrap);
  function go(i) {
    idx = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-100 * idx) + '%)';
    slides.forEach((s, n) => s.setAttribute('aria-hidden', String(n !== idx)));
    dots.forEach((d, n) => { d.classList.toggle('is-active', n === idx); d.setAttribute('aria-current', String(n === idx)); });
  }
  const start = () => { if (reduceMotion || timer) return; timer = setInterval(() => { if (!paused && dragX === null) go(idx + 1); }, 6500); viewport.setAttribute('aria-live', 'off'); };
  const stop = () => { clearInterval(timer); timer = null; viewport.setAttribute('aria-live', 'polite'); };
  const restart = () => { stop(); if (!paused) start(); };
  on($('#prevSlide'), 'click', () => { go(idx - 1); restart(); });
  on($('#nextSlide'), 'click', () => { go(idx + 1); restart(); });
  on(slider, 'mouseenter', () => { paused = true; }); on(slider, 'mouseleave', () => { paused = false; });
  on(slider, 'focusin', () => { paused = true; }); on(slider, 'focusout', () => { paused = false; });
  on(slider, 'keydown', e => { if (e.key === 'ArrowLeft') { go(idx - 1); restart(); } if (e.key === 'ArrowRight') { go(idx + 1); restart(); } });
  on(document, 'visibilitychange', () => { document.hidden ? stop() : start(); });
  on(viewport, 'pointerdown', e => { if (e.pointerType === 'mouse' && e.button !== 0) return; dragX = e.clientX; dragDX = 0; track.classList.add('is-dragging'); });
  on(viewport, 'pointermove', e => { if (dragX === null) return; dragDX = e.clientX - dragX; track.style.transform = 'translateX(calc(' + (-100 * idx) + '% + ' + dragDX + 'px))'; });
  const endDrag = () => { if (dragX === null) return; track.classList.remove('is-dragging'); const m = dragDX; dragX = null; dragDX = 0; if (m < -50) go(idx + 1); else if (m > 50) go(idx - 1); else go(idx); restart(); };
  on(viewport, 'pointerup', endDrag); on(viewport, 'pointercancel', endDrag); on(viewport, 'pointerleave', () => { if (dragX !== null) endDrag(); });
  go(0); start();

  /* ---------- Init ---------- */
  renderShop(true);
  renderCart(); renderWish(); updateCounts(); syncWish();
  startReveal();
})();
