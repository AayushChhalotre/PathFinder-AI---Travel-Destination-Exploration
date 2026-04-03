import { Destination, Scenario, VibeImage, Occasion, TransportOption } from './types';

export const SCENARIOS: Scenario[] = [
  { id: '1', label: 'I need to feel small', vibe: 'serene', iconName: 'Mountain' },
  { id: '2', label: 'Unplugged and off-grid', vibe: 'unplugged', iconName: 'Tent' },
  { id: '3', label: 'A sensory overload', vibe: 'vibrant', iconName: 'Zap' },
  { id: '4', label: 'Lost in history', vibe: 'cultural', iconName: 'Landmark' },
  { id: '5', label: 'Pure architectural bliss', vibe: 'minimalist', iconName: 'Building' },
  { id: '6', label: 'The edge of the world', vibe: 'rugged', iconName: 'Wind' },
  { id: '7', label: 'Whispers of the unknown', vibe: 'mysterious', iconName: 'Moon' },
  { id: '8', label: 'The gold standard of escape', vibe: 'luxurious', iconName: 'Crown' },
  { id: '9', label: 'Where the night never ends', vibe: 'nocturnal', iconName: 'Coffee' },
  { id: '10', label: 'A memory I haven\'t had yet', vibe: 'nostalgic', iconName: 'History' },
  { id: '11', label: 'The world of tomorrow', vibe: 'futuristic', iconName: 'Cpu' },
  { id: '12', label: 'Free-spirited and untethered', vibe: 'bohemian', iconName: 'Palette' },
  { id: '13', label: 'Living in a frame', vibe: 'cinematic', iconName: 'Film' },
  { id: '14', label: 'Between dreams and reality', vibe: 'ethereal', iconName: 'Cloud' },
];

export const OCCASIONS: Occasion[] = [
  { id: 'o1', label: 'Honeymoon', durationDays: 10, groupSize: 2, budgetMultiplier: 2.5, iconName: 'Heart' },
  { id: 'o2', label: 'Solo Soul-Searching', durationDays: 14, groupSize: 1, budgetMultiplier: 1.0, iconName: 'User' },
  { id: 'o3', label: 'Family Reunion', durationDays: 7, groupSize: 6, budgetMultiplier: 1.8, iconName: 'Users' },
  { id: 'o4', label: 'Workation', durationDays: 21, groupSize: 1, budgetMultiplier: 1.2, iconName: 'Laptop' },
  { id: 'o5', label: 'Adrenaline Rush', durationDays: 5, groupSize: 3, budgetMultiplier: 1.5, iconName: 'Zap' },
  { id: 'o6', label: 'Anniversary', durationDays: 4, groupSize: 2, budgetMultiplier: 2.0, iconName: 'Gift' },
  { id: 'o7', label: 'Bachelor/Bachelorette', durationDays: 4, groupSize: 8, budgetMultiplier: 1.6, iconName: 'GlassWater' },
  { id: 'o8', label: 'Retirement Trip', durationDays: 30, groupSize: 2, budgetMultiplier: 1.4, iconName: 'Sunrise' },
  { id: 'o9', label: 'Photography Expedition', durationDays: 12, groupSize: 4, budgetMultiplier: 1.3, iconName: 'Camera' },
  { id: 'o10', label: 'Gastronomy Tour', durationDays: 6, groupSize: 2, budgetMultiplier: 1.9, iconName: 'Utensils' },
];

export const VIBE_IMAGES: VibeImage[] = [
  // Serene
  { id: 'v1', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', vibes: ['serene'], locationTag: 'Yosemite Valley, USA' },
  { id: 'v2', url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'minimalist'], locationTag: 'Swiss Alps' },
  { id: 'v3', url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'unplugged'], locationTag: 'Bali, Indonesia' },
  { id: 'v4', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'luxurious'], locationTag: 'Lake Como' },
  
  // Rugged
  { id: 'v5', url: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=800&q=80', vibes: ['rugged'], locationTag: 'Torres del Paine, Patagonia' },
  { id: 'v6', url: 'https://images.unsplash.com/photo-1551632432-c735e7a030be?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'mysterious'], locationTag: 'Scottish Highlands' },
  { id: 'v7', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'unplugged'], locationTag: 'Dolomites' },
  { id: 'v8', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'vibrant'], locationTag: 'Arizona, USA' },
  
  // Mysterious
  { id: 'v9', url: 'https://images.unsplash.com/photo-1505506005810-ac73ef1171d0?auto=format&fit=crop&w=800&q=80', vibes: ['mysterious'], locationTag: 'Skógafoss, Iceland' },
  { id: 'v10', url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80', vibes: ['mysterious', 'cultural'], locationTag: 'Venice, Italy' },
  { id: 'v11', url: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?auto=format&fit=crop&w=800&q=80', vibes: ['mysterious', 'nocturnal'], locationTag: 'Tokyo, Japan' },
  { id: 'v12', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80', vibes: ['mysterious', 'unplugged'], locationTag: 'Mount Everest' },
  
  // Minimalist
  { id: 'v13', url: 'https://images.unsplash.com/photo-1518005020251-58296b8a879c?auto=format&fit=crop&w=800&q=80', vibes: ['minimalist'], locationTag: 'Guggenheim Museum, Bilbao' },
  { id: 'v14', url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80', vibes: ['minimalist', 'serene'], locationTag: 'Kyoto, Japan' },
  { id: 'v15', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', vibes: ['minimalist', 'luxurious'], locationTag: 'New York City' },
  { id: 'v16', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', vibes: ['minimalist', 'vibrant'], locationTag: 'Los Angeles' },
  
  // Unplugged
  { id: 'v17', url: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&w=800&q=80', vibes: ['unplugged'], locationTag: 'Mt. Hood Forest, Oregon' },
  { id: 'v18', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80', vibes: ['unplugged', 'serene'], locationTag: 'Bixby Bridge, Big Sur' },
  { id: 'v19', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', vibes: ['unplugged', 'serene'], locationTag: 'Banff, Canada' },
  { id: 'v20', url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80', vibes: ['unplugged', 'mysterious'], locationTag: 'Norway' },
  
  // Vibrant
  { id: 'v21', url: 'https://images.unsplash.com/photo-1539635278303-d4002c07dee3?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'cultural'], locationTag: 'Old Havana, Cuba' },
  { id: 'v22', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'nocturnal'], locationTag: 'Las Vegas' },
  { id: 'v23', url: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'cultural'], locationTag: 'Bangkok, Thailand' },
  { id: 'v24', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'cultural'], locationTag: 'Barcelona, Spain' },
  
  // Luxurious
  { id: 'v25', url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80', vibes: ['luxurious'], locationTag: 'Baa Atoll, Maldives' },
  { id: 'v26', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', vibes: ['luxurious', 'minimalist'], locationTag: 'Dubai' },
  { id: 'v27', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', vibes: ['luxurious', 'serene'], locationTag: 'French Riviera' },
  { id: 'v28', url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', vibes: ['luxurious', 'vibrant'], locationTag: 'Singapore' },
  
  // Cultural
  { id: 'v29', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'vibrant'], locationTag: 'London, UK' },
  { id: 'v30', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'mysterious'], locationTag: 'Cairo, Egypt' },
  { id: 'v31', url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'vibrant'], locationTag: 'Paris, France' },
  { id: 'v32', url: 'https://images.unsplash.com/photo-1523059623039-a240d06ec5a5?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'serene'], locationTag: 'Kyoto, Japan' },
  
  // Nocturnal
  { id: 'v33', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80', vibes: ['nocturnal', 'vibrant'], locationTag: 'Brandenburg Gate, Berlin' },
  { id: 'v34', url: 'https://images.unsplash.com/photo-1514525253344-99a42999a22f?auto=format&fit=crop&w=800&q=80', vibes: ['nocturnal', 'mysterious'], locationTag: 'Dongdaemun Plaza, Seoul' },
  { id: 'v35', url: 'https://images.unsplash.com/photo-1501339819358-ee5f8b17f255?auto=format&fit=crop&w=800&q=80', vibes: ['nocturnal', 'cultural'], locationTag: 'Colosseum, Rome' },
  { id: 'v36', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80', vibes: ['nocturnal', 'luxurious'], locationTag: 'Casino de Monte-Carlo' },
  
  // Candid / Amateurish / Authentic Mix
  { id: 'v37', url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80', vibes: ['unplugged', 'serene'], locationTag: 'Bali, Indonesia' },
  { id: 'v38', url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80', vibes: ['minimalist', 'serene'], locationTag: 'Kyoto, Japan' },
  { id: 'v39', url: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'cultural'], locationTag: 'Bangkok, Thailand' },
  { id: 'v40', url: 'https://images.unsplash.com/photo-1551632432-c735e7a030be?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'unplugged'], locationTag: 'Scottish Highlands' },
  { id: 'v41', url: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'serene'], locationTag: 'Cannon Beach, Oregon' },
  { id: 'v42', url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'luxurious'], locationTag: 'Maldives' },
  { id: 'v43', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'vibrant'], locationTag: 'Waikiki Beach, Hawaii' },
  { id: 'v44', url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'vibrant'], locationTag: 'Positano, Italy' },
  { id: 'v45', url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'mysterious'], locationTag: 'Venice, Italy' },
  { id: 'v46', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'luxurious'], locationTag: 'Paris, France' },
  { id: 'v47', url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'mysterious'], locationTag: 'Iceland' },
  { id: 'v48', url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80', vibes: ['mysterious', 'unplugged'], locationTag: 'Norway' },
  { id: 'v49', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'rugged'], locationTag: 'Banff, Canada' },
  { id: 'v50', url: 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?auto=format&fit=crop&w=800&q=80', vibes: ['minimalist', 'unplugged'], locationTag: 'Kyoto, Japan' },
  { id: 'v51', url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'vibrant'], locationTag: 'Arizona, USA' },
  { id: 'v52', url: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'minimalist'], locationTag: 'San Francisco, USA' },
  { id: 'v53', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'unplugged'], locationTag: 'Big Sur Coastline' },
  { id: 'v54', url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'nocturnal'], locationTag: 'Times Square, NYC' },
  { id: 'v55', url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'unplugged'], locationTag: 'Tower Bridge, London' },
  { id: 'v56', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'mysterious'], locationTag: 'Patagonia' },
  
  // New Authentic & Candid Visual Anchors
  { id: 'v57', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'vibrant'], locationTag: 'London, UK', status: 'popular' },
  { id: 'v58', url: 'https://images.unsplash.com/photo-1539635278303-d4002c07dee3?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'cultural'], locationTag: 'Havana, Cuba', status: 'trending' },
  { id: 'v59', url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80', vibes: ['unplugged', 'serene'], locationTag: 'Bali, Indonesia', status: 'popular' },
  { id: 'v60', url: 'https://images.unsplash.com/photo-1551632432-c735e7a030be?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'unplugged'], locationTag: 'Scottish Highlands', status: 'niche' },
  { id: 'v61', url: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'cultural'], locationTag: 'Bangkok, Thailand', status: 'popular' },
  { id: 'v62', url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80', vibes: ['minimalist', 'serene'], locationTag: 'Kyoto, Japan', status: 'niche' },
  { id: 'v63', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'vibrant'], locationTag: 'Arizona, USA', status: 'trending' },
  { id: 'v64', url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80', vibes: ['mysterious', 'cultural'], locationTag: 'Venice, Italy', status: 'popular' },
  { id: 'v65', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80', vibes: ['unplugged', 'serene'], locationTag: 'Pacific Coast Hwy', status: 'new' },
  { id: 'v66', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'cultural'], locationTag: 'Barcelona, Spain', status: 'popular' },
  { id: 'v67', url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'unplugged'], locationTag: 'London, UK', status: 'budget' },
  { id: 'v68', url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'nocturnal'], locationTag: 'New York City', status: 'trending' },
  { id: 'v69', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'rugged'], locationTag: 'Banff, Canada', status: 'popular' },
  { id: 'v70', url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'vibrant'], locationTag: 'Arizona, USA', status: 'new' },
  { id: 'v71', url: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'cultural'], locationTag: 'Bangkok, Thailand', status: 'popular' },
  { id: 'v72', url: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80', vibes: ['nocturnal', 'cinematic'], locationTag: 'London, UK', status: 'trending' },
  { id: 'v73', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', vibes: ['minimalist', 'serene'], locationTag: 'Paris, France', status: 'niche' },
  { id: 'v74', url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'cultural'], locationTag: 'Marrakesh, Morocco', status: 'popular' },
  { id: 'v75', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'ethereal'], locationTag: 'Swiss Alps', status: 'trending' },
  { id: 'v76', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80', vibes: ['nostalgic', 'mysterious', 'cultural'], locationTag: 'Trinity College Library, Dublin', status: 'niche' },
  { id: 'v77', url: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80', vibes: ['unplugged', 'cinematic', 'serene'], locationTag: 'Glacier Express, Switzerland', status: 'popular' },
  { id: 'v78', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80', vibes: ['nocturnal', 'vibrant', 'cinematic'], locationTag: 'Shinjuku Rooftop, Tokyo', status: 'trending' },
  { id: 'v79', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'unplugged', 'mysterious'], locationTag: 'Monument Valley, USA', status: 'new' },
  { id: 'v80', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', vibes: ['minimalist', 'cultural', 'serene'], locationTag: 'Gion District, Kyoto', status: 'niche' },
  { id: 'v81', url: 'https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['vibrant', 'cultural'], locationTag: 'Hanoi, Vietnam', status: 'popular' },
  { id: 'v82', url: 'https://images.pexels.com/photos/2739666/pexels-photo-2739666.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['cultural', 'mysterious'], locationTag: 'Marrakesh, Morocco', status: 'trending' },
  { id: 'v83', url: 'https://images.pexels.com/photos/3560168/pexels-photo-3560168.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['rugged', 'serene'], locationTag: 'Nazare, Portugal', status: 'new' },
  { id: 'v84', url: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['serene', 'cinematic'], locationTag: 'Oia, Santorini', status: 'popular' },
  { id: 'v85', url: 'https://images.pexels.com/photos/2340520/pexels-photo-2340520.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['nocturnal', 'vibrant'], locationTag: 'Taipei, Taiwan', status: 'trending' },
  { id: 'v86', url: 'https://images.pexels.com/photos/2359422/pexels-photo-2359422.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['cultural', 'mysterious'], locationTag: 'Machu Picchu, Peru', status: 'popular' },
  { id: 'v87', url: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['serene', 'unplugged'], locationTag: 'Ubud, Bali', status: 'popular' },
  { id: 'v88', url: 'https://images.pexels.com/photos/2090645/pexels-photo-2090645.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['vibrant', 'minimalist'], locationTag: 'Burano, Italy', status: 'niche' },
  { id: 'v89', url: 'https://images.pexels.com/photos/1974508/pexels-photo-1974508.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['serene', 'mysterious'], locationTag: 'Rovaniemi, Finland', status: 'trending' },
  { id: 'v90', url: 'https://images.pexels.com/photos/247376/pexels-photo-247376.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['rugged', 'unplugged'], locationTag: 'Maasai Mara, Kenya', status: 'popular' },
  { id: 'v91', url: 'https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['vibrant', 'cultural'], locationTag: 'New Orleans, USA', status: 'trending' },
  { id: 'v92', url: 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['minimalist', 'serene'], locationTag: 'Ryoan-ji, Kyoto', status: 'niche' },
  { id: 'v93', url: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['mysterious', 'ethereal'], locationTag: 'Kirkjufell, Iceland', status: 'popular' },
  { id: 'v94', url: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['cinematic', 'ethereal'], locationTag: 'Cappadocia, Turkey', status: 'trending' },
  { id: 'v95', url: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['vibrant', 'cultural'], locationTag: 'Damnoen Saduak, Thailand', status: 'popular' },
  { id: 'v96', url: 'https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg?auto=compress&cs=tinysrgb&w=800', vibes: ['nostalgic', 'cultural'], locationTag: 'Alfama, Lisbon', status: 'niche' },
  { id: 'v97', url: 'https://cdn.pixabay.com/photo/2017/08/07/16/39/tea-2605531_1280.jpg', vibes: ['cultural', 'serene'], locationTag: 'Uji, Japan', status: 'popular' },
  { id: 'v98', url: 'https://cdn.pixabay.com/photo/2016/11/29/09/16/architecture-1868667_1280.jpg', vibes: ['vibrant', 'cultural'], locationTag: 'Berlin, Germany', status: 'trending' },
  { id: 'v99', url: 'https://cdn.pixabay.com/photo/2016/11/18/17/46/venice-1836068_1280.jpg', vibes: ['cultural', 'cinematic'], locationTag: 'Venice, Italy', status: 'popular' },
  { id: 'v100', url: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/aurora-borealis-2591937_1280.jpg', vibes: ['mysterious', 'ethereal'], locationTag: 'Tromso, Norway', status: 'trending' },
  
  // India Focus - Visual Anchors
  { id: 'v101', url: 'https://images.unsplash.com/photo-1581793745862-99fde7f4462c?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'serene'], locationTag: 'Leh, Ladakh', status: 'popular' },
  { id: 'v102', url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'unplugged'], locationTag: 'Munnar, Kerala', status: 'trending' },
  { id: 'v103', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'vibrant'], locationTag: 'Varanasi, India', status: 'popular' },
  { id: 'v104', url: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'luxurious'], locationTag: 'Taj Mahal, Agra', status: 'popular' },
  { id: 'v105', url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'luxurious'], locationTag: 'Udaipur, Rajasthan', status: 'trending' },
  { id: 'v106', url: 'https://images.unsplash.com/photo-1540202404-a2f29016bb5d?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'unplugged'], locationTag: 'Alleppey, Kerala', status: 'popular' },
  { id: 'v107', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'cultural'], locationTag: 'Jaipur, Rajasthan', status: 'popular' },
  { id: 'v108', url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'unplugged'], locationTag: 'Spiti Valley, India', status: 'trending' },
  { id: 'v109', url: 'https://images.unsplash.com/photo-1590523278191-995cbcda646b?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'unplugged'], locationTag: 'Gokarna, India', status: 'new' },
  { id: 'v110', url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'vibrant'], locationTag: 'Red Fort, Delhi', status: 'popular' },
  { id: 'v111', url: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'cultural'], locationTag: 'Golden Temple, Amritsar', status: 'popular' },
  { id: 'v112', url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'serene'], locationTag: 'Gulmarg, Kashmir', status: 'trending' },
  { id: 'v113', url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'unplugged'], locationTag: 'Tea Gardens, Darjeeling', status: 'popular' },
  { id: 'v114', url: 'https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'rugged'], locationTag: 'Hampi, India', status: 'popular' },
  { id: 'v115', url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'unplugged'], locationTag: 'Pangong Lake, Ladakh', status: 'trending' },
  { id: 'v116', url: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'mysterious'], locationTag: 'Khajuraho, India', status: 'niche' },
  { id: 'v117', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', vibes: ['vibrant', 'unplugged'], locationTag: 'Palolem Beach, Goa', status: 'popular' },
  { id: 'v118', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'vibrant'], locationTag: 'Pushkar, Rajasthan', status: 'new' },
  { id: 'v119', url: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80', vibes: ['rugged', 'serene'], locationTag: 'Andaman Islands', status: 'trending' },
  { id: 'v120', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', vibes: ['cultural', 'mysterious'], locationTag: 'Kathmandu, Nepal', status: 'popular' },
  { id: 'v121', url: 'https://images.unsplash.com/photo-1523059623039-a240d06ec5a5?auto=format&fit=crop&w=800&q=80', vibes: ['serene', 'cultural'], locationTag: 'Paro, Bhutan', status: 'trending' },
];

export const TRANSPORT_OPTIONS: TransportOption[] = [
  { id: 'air', label: 'Air Travel', iconName: 'Plane', subOptions: ['Economy', 'Premium Economy', 'Business', 'First Class'] },
  { id: 'train', label: 'Railways', iconName: 'TrainFront', subOptions: ['General', 'Sleeper', '3rd AC', '2nd AC', '1st AC'] },
  { id: 'road', label: 'Roadways', iconName: 'Car', subOptions: ['Self-Drive', 'With Driver', 'Luxury Rental', 'Bus'] },
  { id: 'space', label: 'Space', iconName: 'Rocket', subOptions: ['Sub-orbital', 'Orbital', 'Lunar'] },
];

export const DESTINATIONS: Destination[] = [
  {
    id: 'd1',
    name: 'Spiti Valley',
    location: 'Himachal Pradesh, India',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7f4462c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1581793745862-99fde7f4462c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1594226801341-41397bb83824?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626690110325-4b08996e9827?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605146768851-eda79da39897?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['rugged', 'unplugged', 'serene'],
    priceBand: 'budget',
    priceINR: 15000,
    travelHours: 12,
    description: 'High-altitude desert valley in the Himalayas.',
    rationale: 'Because you seek the rugged edge of the world and need to unplug completely.',
    bestDuration: '7-10 Days',
    lat: 32.2461,
    lng: 78.0349,
    travelerInsights: [
      { type: 'do', content: 'Visit the Key Monastery and stay in a local homestay for an authentic experience.' },
      { type: 'dont', content: 'Don\'t rush your ascent; acclimatize properly in Shimla or Manali first.' },
      { type: 'tip', content: 'Carry enough cash as ATMs are rare and often out of service in the valley.' }
    ],
    socialMediaPosts: [
      { id: 's-spiti-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/spitivalley/', thumbnail: 'https://images.unsplash.com/photo-1581793745862-99fde7f4462c?auto=format&fit=crop&w=400&q=80', author: '@himalayan_soul', caption: 'Lost in the mountains of Spiti. 🏔️✨' },
      { id: 's-spiti-2', platform: 'youtube', url: 'https://www.youtube.com/results?search_query=spiti+valley+travel+guide', thumbnail: 'https://images.unsplash.com/photo-1594226801341-41397bb83824?auto=format&fit=crop&w=400&q=80', author: 'MountainVlogs', caption: 'Spiti Valley: The Ultimate Road Trip Guide' }
    ],
    popularActivities: [
      { title: 'Key Monastery Visit', description: 'Explore the largest monastery in Spiti, perched on a hill.', time: '09:00', iconName: 'Landmark' },
      { title: 'Chandratal Lake Trek', description: 'A high-altitude trek to the crescent-shaped Moon Lake.', time: '06:00', iconName: 'Mountain' },
      { title: 'Stargazing in Kaza', description: 'Experience the crystal clear night sky of the high Himalayas.', time: '21:00', iconName: 'Moon' },
      { title: 'Pin Valley Wildlife', description: 'Spot rare Himalayan wildlife like the snow leopard.', time: '07:00', iconName: 'Tent' }
    ]
  },
  {
    id: 'd2',
    name: 'Kyoto',
    location: 'Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'cultural', 'minimalist'],
    priceBand: 'luxury',
    priceINR: 150000,
    travelHours: 14,
    description: 'Ancient temples, traditional tea houses and sublime gardens.',
    rationale: 'Because your choices reflect a deep appreciation for serene cultural heritage and minimalist beauty.',
    bestDuration: '4-5 Days',
    lat: 35.0116,
    lng: 135.7681,
    travelerInsights: [
      { type: 'do', content: 'Visit the Fushimi Inari Shrine early in the morning to avoid the crowds.' },
      { type: 'dont', content: 'Don\'t talk loudly on public transport; it\'s considered disrespectful.' },
      { type: 'tip', content: 'Rent a kimono for a day to fully immerse yourself in the traditional atmosphere.' }
    ],
    socialMediaPosts: [
      { id: 's-kyoto-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/kyoto/', thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80', author: '@japan_travels', caption: 'Kyoto in the spring is a dream. 🌸✨' },
      { id: 's-kyoto-2', platform: 'youtube', url: 'https://www.youtube.com/results?search_query=kyoto+travel+guide', thumbnail: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=400&q=80', author: 'TravelWithMe', caption: '10 Things to Do in Kyoto, Japan' }
    ],
    popularActivities: [
      { title: 'Tea Ceremony', description: 'Participate in a traditional Japanese tea ceremony in Gion.', time: '14:00', iconName: 'Coffee' },
      { title: 'Arashiyama Bamboo Grove', description: 'Walk through the towering bamboo stalks of Arashiyama.', time: '08:00', iconName: 'Wind' },
      { title: 'Kinkaku-ji (Golden Pavilion)', description: 'Visit the stunning Zen temple covered in gold leaf.', time: '10:00', iconName: 'Landmark' },
      { title: 'Philosopher\'s Path Walk', description: 'A scenic stone path along a canal, perfect for reflection.', time: '16:00', iconName: 'History' }
    ]
  },
  {
    id: 'd3',
    name: 'Reykjavik',
    location: 'Iceland',
    image: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520769945061-0a448c463865?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['mysterious', 'rugged', 'serene'],
    priceBand: 'luxury',
    priceINR: 200000,
    travelHours: 18,
    description: 'Volcanic landscapes, geysers and the aurora borealis.',
    rationale: 'Because you are drawn to mysterious, otherworldly landscapes and rugged nature.',
    bestDuration: '5-7 Days',
    lat: 64.1466,
    lng: -21.9426,
    travelerInsights: [
      { type: 'do', content: 'Relax in the Blue Lagoon geothermal spa.' },
      { type: 'dont', content: 'Don\'t underestimate the Icelandic weather; always check the forecast.' },
      { type: 'tip', content: 'Rent a 4x4 vehicle if you plan to explore the F-roads in the highlands.' }
    ],
    socialMediaPosts: [
      { id: 's-rey-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/reykjavik/', thumbnail: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=400&q=80', author: '@iceland_explorer', caption: 'Chasing the Northern Lights in Reykjavik. 🌌✨' },
      { id: 's-rey-2', platform: 'youtube', url: 'https://www.youtube.com/results?search_query=reykjavik+travel+guide', thumbnail: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=400&q=80', author: 'TravelVlogs', caption: 'Iceland Road Trip: Reykjavik to the South Coast' }
    ],
    popularActivities: [
      { title: 'Blue Lagoon Soak', description: 'Relax in the geothermal waters of the world-famous spa.', time: '11:00', iconName: 'Waves' },
      { title: 'Northern Lights Hunt', description: 'Guided tour to find the best spots for aurora viewing.', time: '22:00', iconName: 'Sparkles' },
      { title: 'Golden Circle Tour', description: 'Visit Thingvellir, Geysir, and Gullfoss waterfall.', time: '08:00', iconName: 'Map' },
      { title: 'Whale Watching', description: 'Boat trip from the Old Harbour to spot marine life.', time: '13:00', iconName: 'Wind' }
    ]
  },
  {
    id: 'd4',
    name: 'Varanasi',
    location: 'Uttar Pradesh, India',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582972236019-ea4af5ffe587?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['cultural', 'vibrant', 'mysterious'],
    priceBand: 'budget',
    priceINR: 8000,
    travelHours: 4,
    description: 'Spiritual heart of India on the banks of the Ganges.',
    rationale: 'Because you crave a sensory overload and deep cultural immersion.',
    bestDuration: '2-3 Days',
    lat: 25.3176,
    lng: 82.9739,
    travelerInsights: [
      { type: 'do', content: 'Attend the evening Ganga Aarti at Dashashwamedh Ghat.' },
      { type: 'dont', content: 'Don\'t accept help from unauthorized guides near the ghats.' },
      { type: 'tip', content: 'Take a sunrise boat ride on the Ganges for a peaceful perspective.' }
    ],
    socialMediaPosts: [
      { id: 's-varanasi-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/varanasi/', thumbnail: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=400&q=80', author: '@spiritual_india', caption: 'The spiritual energy of Varanasi is unmatched. 🙏✨' },
      { id: 's-varanasi-2', platform: 'youtube', url: 'https://www.youtube.com/results?search_query=varanasi+travel+guide', thumbnail: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80', author: 'IndiaUncut', caption: 'Varanasi: The Oldest Living City in the World' }
    ],
    popularActivities: [
      { title: 'Ganga Aarti', description: 'Witness the mesmerizing evening prayer ceremony at the ghats.', time: '18:30', iconName: 'Flame' },
      { title: 'Sunrise Boat Ride', description: 'Peaceful boat trip on the Ganges as the city wakes up.', time: '05:30', iconName: 'Sunrise' },
      { title: 'Sarnath Visit', description: 'Explore the ancient Buddhist site where Buddha first taught.', time: '10:00', iconName: 'Landmark' },
      { title: 'Street Food Crawl', description: 'Taste the famous chaats and lassis of Varanasi lanes.', time: '16:00', iconName: 'Utensils' }
    ]
  },
  {
    id: 'd5',
    name: 'Aman-i-Khas',
    location: 'Ranthambore, India',
    image: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581012771300-224937651c42?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['luxurious', 'serene', 'unplugged'],
    priceBand: 'luxury',
    priceINR: 80000,
    travelHours: 6,
    description: 'Luxury wilderness camp on the edge of a tiger reserve.',
    rationale: 'Because you want to feel small in nature without sacrificing luxurious serenity.',
    bestDuration: '3-4 Days',
    lat: 25.8481,
    lng: 76.3534,
    travelerInsights: [
      { type: 'do', content: 'Go on a morning safari to spot the majestic Bengal tiger.' },
      { type: 'dont', content: 'Don\'t forget to pack neutral-colored clothing for the safari.' },
      { type: 'tip', content: 'Enjoy a private dinner under the stars in the camp\'s garden.' }
    ],
    socialMediaPosts: [
      { id: 's-aman-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/amanikhas/', thumbnail: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&w=400&q=80', author: '@luxury_safari', caption: 'Waking up in the wild at Aman-i-Khas. 🐅✨' }
    ],
    popularActivities: [
      { title: 'Tiger Safari', description: 'Guided safari in Ranthambore National Park.', time: '06:00', iconName: 'Zap' },
      { title: 'Ranthambore Fort Hike', description: 'Trek up to the ancient fort for panoramic views.', time: '15:00', iconName: 'Mountain' },
      { title: 'Bush Dinner', description: 'Private dining experience in the wilderness.', time: '19:30', iconName: 'Utensils' },
      { title: 'Bird Watching', description: 'Explore the diverse avian life around the camp.', time: '07:30', iconName: 'Camera' }
    ]
  },
  {
    id: 'd6',
    name: 'Berlin',
    location: 'Germany',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559564484-e484c204058a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546726747-cd9125185672?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['vibrant', 'minimalist', 'cultural'],
    priceBand: 'moderate',
    priceINR: 120000,
    travelHours: 10,
    description: 'A city of history, art, and cutting-edge nightlife.',
    rationale: 'Because you enjoy vibrant urban energy mixed with minimalist aesthetics.',
    bestDuration: '4-5 Days',
    lat: 52.5200,
    lng: 13.4050,
    travelerInsights: [
      { type: 'do', content: 'Visit the East Side Gallery to see the remains of the Berlin Wall.' },
      { type: 'dont', content: 'Don\'t forget to carry cash; many smaller shops and cafes don\'t accept cards.' },
      { type: 'tip', content: 'Rent a bike to explore the city\'s many parks and neighborhoods.' }
    ],
    socialMediaPosts: [
      { id: 's-berlin-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/visitberlin/', thumbnail: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=400&q=80', author: '@berlin_vibes', caption: 'Berlin nights and city lights. 🏙️✨' }
    ],
    popularActivities: [
      { title: 'Brandenburg Gate', description: 'Visit the iconic symbol of Berlin and German reunification.', time: '10:00', iconName: 'Landmark' },
      { title: 'East Side Gallery', description: 'Walk along the longest remaining section of the Berlin Wall.', time: '14:00', iconName: 'Palette' },
      { title: 'Museum Island', description: 'Explore five world-renowned museums on a single island.', time: '11:00', iconName: 'Building' },
      { title: 'Nightlife in Kreuzberg', description: 'Experience Berlin\'s legendary club and bar scene.', time: '22:00', iconName: 'Music' }
    ]
  },
  {
    id: 'd7',
    name: 'Hampi',
    location: 'Karnataka, India',
    image: 'https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-23a9d7fc6bbd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['cultural', 'rugged', 'mysterious'],
    priceBand: 'budget',
    priceINR: 10000,
    travelHours: 8,
    description: 'Boulder-strewn landscape with ancient ruins.',
    rationale: 'Because you seek mysterious history in a rugged, off-grid setting.',
    bestDuration: '3-4 Days',
    lat: 15.3350,
    lng: 76.4600,
    travelerInsights: [
      { type: 'do', content: 'Explore the Virupaksha Temple and the Vittala Temple complex.' },
      { type: 'dont', content: 'Don\'t miss the sunset from Matanga Hill.' },
      { type: 'tip', content: 'Rent a moped or a bicycle to get around the vast ruins.' }
    ],
    socialMediaPosts: [
      { id: 's-hampi-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/hampi/', thumbnail: 'https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?auto=format&fit=crop&w=400&q=80', author: '@hampi_explorer', caption: 'Walking through history in Hampi. 🏛️✨' }
    ],
    popularActivities: [
      { title: 'Coracle Ride', description: 'Traditional round boat ride on the Tungabhadra River.', time: '16:00', iconName: 'Waves' },
      { title: 'Matanga Hill Sunset', description: 'Short hike for the best panoramic view of the ruins.', time: '17:30', iconName: 'Mountain' },
      { title: 'Virupaksha Temple', description: 'Visit the oldest functioning temple in Hampi.', time: '09:00', iconName: 'Landmark' },
      { title: 'Bicycle Exploration', description: 'Rent a bike to explore the vast boulder-strewn landscape.', time: '10:00', iconName: 'Bike' }
    ]
  },
  {
    id: 'd8',
    name: 'Naoshima',
    location: 'Japan',
    image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518005020251-58296b8a879c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['minimalist', 'serene', 'cultural'],
    priceBand: 'luxury',
    priceINR: 180000,
    travelHours: 16,
    description: 'Art island in the Seto Inland Sea.',
    rationale: 'Because you value minimalist art and serene island vibes.',
    bestDuration: '2-3 Days',
    lat: 34.4597,
    lng: 133.9958,
    travelerInsights: [
      { type: 'do', content: 'Visit the Chichu Art Museum and the Benesse House.' },
      { type: 'dont', content: 'Don\'t miss the Yellow Pumpkin by Yayoi Kusama.' },
      { type: 'tip', content: 'Rent an electric bike to explore the island\'s art installations.' }
    ],
    socialMediaPosts: [
      { id: 's-nao-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/naoshima/', thumbnail: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=400&q=80', author: '@art_island', caption: 'Minimalist bliss on Naoshima. 🎨✨' }
    ],
    popularActivities: [
      { title: 'Chichu Art Museum', description: 'Underground museum featuring Monet and James Turrell.', time: '11:00', iconName: 'Building' },
      { title: 'Yellow Pumpkin Visit', description: 'Iconic outdoor sculpture by Yayoi Kusama.', time: '09:00', iconName: 'Palette' },
      { title: 'Art House Project', description: 'Traditional houses converted into art installations.', time: '14:00', iconName: 'Home' },
      { title: 'Benesse House', description: 'A unique museum and hotel complex on the coast.', time: '16:00', iconName: 'Landmark' }
    ]
  },
  {
    id: 'd9',
    name: 'Chefchaouen',
    location: 'Morocco',
    image: 'https://images.unsplash.com/photo-1548048026-5a1a941d93d3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1548048026-5a1a941d93d3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1553603227-2358aabe821e?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['vibrant', 'mysterious', 'cultural'],
    priceBand: 'moderate',
    priceINR: 90000,
    travelHours: 14,
    description: 'The blue city in the Rif Mountains.',
    rationale: 'Because you are attracted to vibrant colors and mysterious alleyways.',
    bestDuration: '2-3 Days',
    lat: 35.1688,
    lng: -5.2636,
    travelerInsights: [
      { type: 'do', content: 'Wander through the blue-painted streets of the Medina.' },
      { type: 'dont', content: 'Don\'t miss the view of the city from the Spanish Mosque.' },
      { type: 'tip', content: 'Try the local goat cheese and fresh orange juice.' }
    ],
    socialMediaPosts: [
      { id: 's-chef-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/chefchaouen/', thumbnail: 'https://images.unsplash.com/photo-1548048026-5a1a941d93d3?auto=format&fit=crop&w=400&q=80', author: '@blue_city_dreams', caption: 'Lost in the blue of Chefchaouen. 💙✨' }
    ],
    popularActivities: [
      { title: 'Medina Wandering', description: 'Get lost in the vibrant blue-painted streets.', time: '10:00', iconName: 'Map' },
      { title: 'Spanish Mosque Hike', description: 'Sunset walk for a panoramic view of the blue city.', time: '17:30', iconName: 'Mountain' },
      { title: 'Ras El Maa Waterfall', description: 'Relax by the refreshing mountain springs.', time: '14:00', iconName: 'Waves' },
      { title: 'Kasbah Museum', description: 'Explore the historic fortress in the heart of the city.', time: '11:00', iconName: 'Landmark' }
    ]
  },
  {
    id: 'd10',
    name: 'Zermatt',
    location: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1502209627619-a8dc05d5f226?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1502209627619-a8dc05d5f226?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549400851-2cce4399f6e8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['luxurious', 'rugged', 'serene'],
    priceBand: 'luxury',
    priceINR: 250000,
    travelHours: 12,
    description: 'Car-free mountain village at the foot of the Matterhorn.',
    rationale: 'Because you want a luxurious escape in the heart of rugged mountains.',
    bestDuration: '4-6 Days',
    lat: 46.0207,
    lng: 7.7491,
    travelerInsights: [
      { type: 'do', content: 'Take the Gornergrat Railway for the best views of the Matterhorn.' },
      { type: 'dont', content: 'Don\'t forget to pack warm layers, even in the summer.' },
      { type: 'tip', content: 'Try the local cheese fondue and raclette.' }
    ],
    socialMediaPosts: [
      { id: 's-zer-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/zermatt/', thumbnail: 'https://images.unsplash.com/photo-1502209627619-a8dc05d5f226?auto=format&fit=crop&w=400&q=80', author: '@mountain_luxury', caption: 'Matterhorn views from Zermatt. 🏔️✨' }
    ],
    popularActivities: [
      { title: 'Gornergrat Railway', description: 'Scenic train ride for the best Matterhorn views.', time: '09:00', iconName: 'TrainFront' },
      { title: 'Matterhorn Glacier Paradise', description: 'Visit the highest cable car station in Europe.', time: '11:00', iconName: 'Mountain' },
      { title: 'Hinterdorf Walk', description: 'Explore the old village with traditional wooden barns.', time: '16:00', iconName: 'History' },
      { title: 'Fondue Dinner', description: 'Traditional Swiss dining experience in a cozy chalet.', time: '19:00', iconName: 'Utensils' }
    ]
  },
  {
    id: 'd11',
    name: 'Santorini',
    location: 'Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469041474792-345207ded9ac?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['luxurious', 'minimalist', 'serene'],
    priceBand: 'luxury',
    priceINR: 220000,
    travelHours: 14,
    description: 'Iconic white-washed buildings overlooking the Aegean Sea.',
    rationale: 'Because you appreciate minimalist architecture and high-end serenity.',
    bestDuration: '3-5 Days',
    lat: 36.3932,
    lng: 25.4615,
    travelerInsights: [
      { type: 'do', content: 'Watch the sunset from Oia, but arrive early to secure a spot.' },
      { type: 'dont', content: 'Don\'t use the donkeys for transport; the steps are walkable or use the cable car.' },
      { type: 'tip', content: 'Visit the Akrotiri archaeological site to see a prehistoric city preserved in volcanic ash.' }
    ],
    socialMediaPosts: [
      { id: 's-san-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/santorini/', thumbnail: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80', author: '@greek_islands', caption: 'Santorini sunsets are unmatched. 🌅✨' }
    ],
    popularActivities: [
      { title: 'Oia Sunset Watch', description: 'The most iconic sunset spot in the world.', time: '18:30', iconName: 'Sunrise' },
      { title: 'Fira to Oia Hike', description: 'Scenic caldera-edge walk with breathtaking views.', time: '08:00', iconName: 'Mountain' },
      { title: 'Wine Tasting', description: 'Visit local volcanic vineyards for unique wine tasting.', time: '16:00', iconName: 'GlassWater' },
      { title: 'Amoudi Bay Lunch', description: 'Fresh seafood by the crystal clear Aegean waters.', time: '13:00', iconName: 'Utensils' }
    ]
  },
  {
    id: 'd12',
    name: 'Petra',
    location: 'Jordan',
    image: 'https://images.unsplash.com/photo-1579606030136-a849c9971631?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1579606030136-a849c9971631?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523059623039-a240d06ec5a5?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['cultural', 'mysterious', 'rugged'],
    priceBand: 'moderate',
    priceINR: 130000,
    travelHours: 10,
    description: 'Ancient city carved into red sandstone cliffs.',
    rationale: 'Because you are drawn to mysterious history and rugged desert landscapes.',
    bestDuration: '2-3 Days',
    lat: 30.3285,
    lng: 35.4444,
    travelerInsights: [
      { type: 'do', content: 'Walk through the Siq to reach the Treasury (Al-Khazneh).' },
      { type: 'dont', content: 'Don\'t miss Petra by Night for a magical candlelit experience.' },
      { type: 'tip', content: 'Climb up to the Monastery (Ad Deir) for a less crowded but equally impressive site.' }
    ],
    socialMediaPosts: [
      { id: 's-pet-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/petra/', thumbnail: 'https://images.unsplash.com/photo-1579606030136-a849c9971631?auto=format&fit=crop&w=400&q=80', author: '@jordan_travel', caption: 'The Treasury of Petra is a wonder to behold. 🏛️✨' }
    ],
    popularActivities: [
      { title: 'The Siq Walk', description: 'Dramatic walk through the narrow canyon to the Treasury.', time: '08:00', iconName: 'Mountain' },
      { title: 'Petra by Night', description: 'Experience the Treasury lit by thousands of candles.', time: '20:30', iconName: 'Flame' },
      { title: 'Monastery Hike', description: 'Climb 800 steps for the impressive Ad Deir monument.', time: '15:00', iconName: 'Mountain' },
      { title: 'High Place of Sacrifice', description: 'Ancient ritual site with panoramic desert views.', time: '10:00', iconName: 'Landmark' }
    ]
  },
  {
    id: 'd13',
    name: 'Tulum',
    location: 'Mexico',
    image: 'https://images.unsplash.com/photo-1504730655501-24c39ac53f0e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1504730655501-24c39ac53f0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520483601560-389dff434f1c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['vibrant', 'unplugged', 'luxurious'],
    priceBand: 'moderate',
    priceINR: 110000,
    travelHours: 20,
    description: 'Eco-chic beach destination with Mayan ruins.',
    rationale: 'Because you want a vibrant yet unplugged escape with a touch of luxury.',
    bestDuration: '4-6 Days',
    lat: 20.2114,
    lng: -87.4654,
    travelerInsights: [
      { type: 'do', content: 'Swim in a cenote (natural sinkhole) for a unique freshwater experience.' },
      { type: 'dont', content: 'Don\'t forget to use biodegradable sunscreen to protect the coral reefs and cenotes.' },
      { type: 'tip', content: 'Rent a bike to travel between the beach road and the town center.' }
    ],
    socialMediaPosts: [
      { id: 's-tul-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/tulum/', thumbnail: 'https://images.unsplash.com/photo-1504730655501-24c39ac53f0e?auto=format&fit=crop&w=400&q=80', author: '@tulum_vibes', caption: 'Beach days and Mayan ruins. 🌴✨' }
    ],
    popularActivities: [
      { title: 'Tulum Ruins', description: 'Explore the ancient Mayan city overlooking the Caribbean.', time: '08:00', iconName: 'Landmark' },
      { title: 'Cenote Swimming', description: 'Dive into the crystal clear waters of Gran Cenote.', time: '11:00', iconName: 'Waves' },
      { title: 'Beach Club Relaxing', description: 'Enjoy the eco-chic vibes of Tulum\'s beach road.', time: '14:00', iconName: 'Wind' },
      { title: 'Sian Ka\'an Biosphere', description: 'Guided boat tour through the protected nature reserve.', time: '09:00', iconName: 'Map' }
    ]
  },
  {
    id: 'd14',
    name: 'Lofoten Islands',
    location: 'Norway',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520769945061-0a448c463865?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['rugged', 'serene', 'unplugged'],
    priceBand: 'luxury',
    priceINR: 190000,
    travelHours: 16,
    description: 'Dramatic peaks, sheltered bays and untouched beaches.',
    rationale: 'Because you seek the rugged beauty of the Arctic and serene isolation.',
    bestDuration: '5-7 Days',
    lat: 68.1667,
    lng: 13.7500,
    travelerInsights: [
      { type: 'do', content: 'Stay in a traditional rorbu (fisherman\'s cabin) in Reine or Hamnøy.' },
      { type: 'dont', content: 'Don\'t miss the chance to see the Midnight Sun in summer or Northern Lights in winter.' },
      { type: 'tip', content: 'Hike up to Reinebringen for a breathtaking panoramic view of the islands.' }
    ],
    socialMediaPosts: [
      { id: 's-lof-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/lofoten/', thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80', author: '@norway_nature', caption: 'Lofoten Islands: Where the mountains meet the sea. 🏔️🌊' }
    ],
    popularActivities: [
      { title: 'Reinebringen Hike', description: 'Challenging hike for the most famous view in Lofoten.', time: '09:00', iconName: 'Mountain' },
      { title: 'Kayaking in Reine', description: 'Paddle through the calm waters of the dramatic fjord.', time: '14:00', iconName: 'Waves' },
      { title: 'Nusfjord Village', description: 'Visit one of Norway\'s oldest and best-preserved fishing villages.', time: '11:00', iconName: 'History' },
      { title: 'Midnight Sun Beach', description: 'Experience the 24-hour daylight on Uttakleiv Beach.', time: '23:30', iconName: 'Sunrise' }
    ]
  },
  {
    id: 'd15',
    name: 'Udaipur',
    location: 'Rajasthan, India',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582972236019-ea4af5ffe587?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['luxurious', 'cultural', 'serene'],
    priceBand: 'moderate',
    priceINR: 25000,
    travelHours: 2,
    description: 'The City of Lakes, known for its royal palaces.',
    rationale: 'Because you desire a luxurious and culturally rich experience by the water.',
    bestDuration: '3-4 Days',
    lat: 24.5854,
    lng: 73.7125,
    travelerInsights: [
      { type: 'do', content: 'Take a boat ride on Lake Pichola at sunset.' },
      { type: 'dont', content: 'Don\'t miss the City Palace, a complex of palaces and museums.' },
      { type: 'tip', content: 'Visit the Bagore Ki Haveli for a traditional Rajasthani dance performance.' }
    ],
    socialMediaPosts: [
      { id: 's-uda-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/udaipur/', thumbnail: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80', author: '@udaipur_diaries', caption: 'The City of Lakes is pure magic. ✨🏰' }
    ],
    popularActivities: [
      { title: 'City Palace Tour', description: 'Explore the grand complex of palaces and museums.', time: '10:00', iconName: 'Landmark' },
      { title: 'Lake Pichola Boat Ride', description: 'Scenic boat trip with views of the Lake Palace.', time: '17:00', iconName: 'Waves' },
      { title: 'Saheliyon-ki-Bari', description: 'Relax in the beautiful "Garden of the Maidens".', time: '11:30', iconName: 'Flower' },
      { title: 'Dharohar Folk Dance', description: 'Evening cultural performance at Bagore Ki Haveli.', time: '19:00', iconName: 'Music' }
    ]
  },
  {
    id: 'd16',
    name: 'Sapa',
    location: 'Vietnam',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544971587-b842c27f8e14?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['rugged', 'cultural', 'serene'],
    priceBand: 'budget',
    priceINR: 45000,
    travelHours: 10,
    description: 'Mist-covered mountains and terraced rice fields.',
    rationale: 'Because you seek rugged landscapes and deep cultural connection in a serene setting.',
    bestDuration: '3-5 Days',
    lat: 22.3364,
    lng: 103.8438,
    travelerInsights: [
      { type: 'do', content: 'Go on a trek through the rice terraces and visit local ethnic minority villages.' },
      { type: 'dont', content: 'Don\'t forget to pack a rain jacket, as the weather can be unpredictable.' },
      { type: 'tip', content: 'Stay in a homestay in Ta Van or Lao Chai for a more authentic experience.' }
    ],
    socialMediaPosts: [
      { id: 's-sapa-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/sapa/', thumbnail: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=400&q=80', author: '@vietnam_travel', caption: 'The terraced fields of Sapa are a sight to behold. 🌾✨' }
    ],
    popularActivities: [
      { title: 'Fansipan Peak', description: 'Take the cable car to the "Roof of Indochina".', time: '09:00', iconName: 'Mountain' },
      { title: 'Cat Cat Village Trek', description: 'Walk through the traditional H\'mong village.', time: '14:00', iconName: 'History' },
      { title: 'Sapa Love Market', description: 'Experience the unique cultural gathering of hill tribes.', time: '19:00', iconName: 'Users' },
      { title: 'Muong Hoa Valley', description: 'Hike through the stunning terraced rice fields.', time: '08:00', iconName: 'Map' }
    ]
  },
  {
    id: 'd17',
    name: 'Meteora',
    location: 'Greece',
    image: 'https://images.unsplash.com/photo-1552423814-24830a23b03a?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1552423814-24830a23b03a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552423814-24830a23b03a?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['mysterious', 'cultural', 'rugged'],
    priceBand: 'moderate',
    priceINR: 140000,
    travelHours: 14,
    description: 'Ancient monasteries perched atop towering sandstone pillars.',
    rationale: 'Because you are drawn to mysterious history and rugged, gravity-defying architecture.',
    bestDuration: '2-3 Days',
    lat: 39.7217,
    lng: 21.6306,
    travelerInsights: [
      { type: 'do', content: 'Visit as many of the six active monasteries as possible.' },
      { type: 'dont', content: 'Don\'t forget to dress modestly when visiting the monasteries (shoulders and knees covered).' },
      { type: 'tip', content: 'Watch the sunset from the Psaropetra lookout for a stunning view of the monasteries.' }
    ],
    socialMediaPosts: [
      { id: 's-met-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/meteora/', thumbnail: 'https://images.unsplash.com/photo-1552423814-24830a23b03a?auto=format&fit=crop&w=400&q=80', author: '@greece_uncovered', caption: 'Meteora: Monasteries in the sky. ⛪✨' }
    ],
    popularActivities: [
      { title: 'Monastery Hopping', description: 'Visit the six active monasteries perched on rock pillars.', time: '09:00', iconName: 'Landmark' },
      { title: 'Sunset at Psaropetra', description: 'The best panoramic viewpoint for the entire complex.', time: '18:30', iconName: 'Sunrise' },
      { title: 'Hiking the Pillars', description: 'Explore the ancient paths between the towering rocks.', time: '08:00', iconName: 'Mountain' },
      { title: 'Kalabaka Town Walk', description: 'Explore the gateway town at the foot of the rocks.', time: '16:00', iconName: 'Building' }
    ]
  },
  {
    id: 'd18',
    name: 'Gokarna',
    location: 'Karnataka, India',
    image: 'https://images.unsplash.com/photo-1590523278191-995cbcda646b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1590523278191-995cbcda646b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590523741491-517a2a52b53f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616422285623-13ff0167c958?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590523278191-995cbcda646b?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['unplugged', 'serene', 'rugged'],
    priceBand: 'budget',
    priceINR: 12000,
    travelHours: 8,
    description: 'Pristine beaches and a laid-back spiritual atmosphere.',
    rationale: 'Because you need to unplug and find serenity on rugged, untouched shores.',
    bestDuration: '3-4 Days',
    lat: 14.5479,
    lng: 74.3188,
    travelerInsights: [
      { type: 'do', content: 'Hike between the main beaches: Kudle, Om, Half Moon, and Paradise.' },
      { type: 'dont', content: 'Don\'t expect a party scene like Goa; Gokarna is much more laid-back.' },
      { type: 'tip', content: 'Stay in a beach shack on Om Beach for a true unplugged experience.' }
    ],
    socialMediaPosts: [
      { id: 's-gok-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/gokarna/', thumbnail: 'https://images.unsplash.com/photo-1590523278191-995cbcda646b?auto=format&fit=crop&w=400&q=80', author: '@beach_bum', caption: 'Om Beach vibes in Gokarna. 🌊✨' }
    ],
    popularActivities: [
      { title: 'Beach Trek', description: 'Hike from Kudle to Om, Half Moon, and Paradise beaches.', time: '08:00', iconName: 'Mountain' },
      { title: 'Mahabaleshwar Temple', description: 'Visit the ancient spiritual heart of Gokarna.', time: '10:00', iconName: 'Landmark' },
      { title: 'Surfing at Kudle', description: 'Try your hand at surfing on the gentle waves.', time: '15:00', iconName: 'Waves' },
      { title: 'Sunset Drum Circle', description: 'Join the musical gathering on the beach as the sun sets.', time: '18:00', iconName: 'Music' }
    ]
  },
  {
    id: 'd19',
    name: 'Seoul',
    location: 'South Korea',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514525253344-99a42999a22f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526481280693-3bfa7561693f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546874177-9e664107314e?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['vibrant', 'nocturnal', 'minimalist'],
    priceBand: 'moderate',
    priceINR: 85000,
    travelHours: 8,
    description: 'A high-tech metropolis where tradition meets futuristic design.',
    rationale: 'Because you thrive in vibrant urban energy and appreciate minimalist nocturnal aesthetics.',
    bestDuration: '4-6 Days',
    lat: 37.5665,
    lng: 126.9780,
    travelerInsights: [
      { type: 'do', content: 'Explore the Gyeongbokgung Palace and watch the changing of the guard.' },
      { type: 'dont', content: 'Don\'t forget to try the street food at Gwangjang Market.' },
      { type: 'tip', content: 'Use the efficient subway system to get around; it\'s easy to navigate.' }
    ],
    socialMediaPosts: [
      { id: 's-seo-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/seoul/', thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=400&q=80', author: '@seoul_explorer', caption: 'Seoul: Where the past meets the future. 🏙️✨' }
    ],
    popularActivities: [
      { title: 'Gyeongbokgung Palace', description: 'Watch the changing of the guard at the main royal palace.', time: '10:00', iconName: 'Landmark' },
      { title: 'Bukchon Hanok Village', description: 'Wander through traditional Korean houses in the city.', time: '14:00', iconName: 'History' },
      { title: 'N Seoul Tower', description: 'Panoramic city views from the top of Namsan Mountain.', time: '18:00', iconName: 'Mountain' },
      { title: 'Myeongdong Shopping', description: 'Experience the vibrant street food and shopping district.', time: '19:30', iconName: 'ShoppingBag' }
    ]
  },
  {
    id: 'd20',
    name: 'Atacama Desert',
    location: 'Chile',
    image: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505506005810-ac73ef1171d0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['mysterious', 'rugged', 'unplugged'],
    priceBand: 'luxury',
    priceINR: 280000,
    travelHours: 24,
    description: 'The driest place on Earth, offering the world\'s clearest night skies.',
    rationale: 'Because you seek the mysterious depths of the cosmos in a rugged, off-grid desert.',
    bestDuration: '4-5 Days',
    lat: -23.8634,
    lng: -69.1328,
    travelerInsights: [
      { type: 'do', content: 'Go stargazing; the Atacama has some of the clearest skies in the world.' },
      { type: 'dont', content: 'Don\'t forget to stay hydrated; the desert air is extremely dry.' },
      { type: 'tip', content: 'Visit the Valle de la Luna (Moon Valley) at sunset for an otherworldly experience.' }
    ],
    socialMediaPosts: [
      { id: 's-ata-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/atacama/', thumbnail: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=400&q=80', author: '@desert_stargazer', caption: 'Under the stars in the Atacama Desert. 🌌✨' }
    ],
    popularActivities: [
      { title: 'Moon Valley Sunset', description: 'Witness the lunar-like landscape change colors at dusk.', time: '17:30', iconName: 'Sunrise' },
      { title: 'Stargazing Tour', description: 'Guided astronomical observation in the world\'s clearest skies.', time: '21:00', iconName: 'Moon' },
      { title: 'El Tatio Geysers', description: 'Visit the high-altitude geyser field at sunrise.', time: '05:00', iconName: 'Waves' },
      { title: 'Laguna Cejar Float', description: 'Swim in highly saline waters where you naturally float.', time: '14:00', iconName: 'Waves' }
    ]
  },
  {
    id: 'd21',
    name: 'Munnar',
    location: 'Kerala, India',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'unplugged', 'minimalist'],
    priceBand: 'budget',
    priceINR: 18000,
    travelHours: 4,
    description: 'Rolling tea plantations and mist-covered hills.',
    rationale: 'Because you crave serene, green landscapes to unplug from the desk.',
    bestDuration: '3-4 Days',
    lat: 10.0889,
    lng: 77.0595,
    travelerInsights: [
      { type: 'do', content: 'Visit a tea factory to learn about the tea-making process.' },
      { type: 'dont', content: 'Don\'t miss the Eravikulam National Park to see the Nilgiri Tahr.' },
      { type: 'tip', content: 'Stay in a resort overlooking the tea gardens for a peaceful stay.' }
    ],
    socialMediaPosts: [
      { id: 's-mun-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/munnar/', thumbnail: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=400&q=80', author: '@kerala_greenery', caption: 'Endless tea gardens in Munnar. 🍃✨' }
    ],
    popularActivities: [
      { title: 'Tea Museum Visit', description: 'Learn about the history and production of tea in the region.', time: '10:00', iconName: 'History' },
      { title: 'Eravikulam National Park', description: 'Spot the endangered Nilgiri Tahr in its natural habitat.', time: '08:30', iconName: 'Mountain' },
      { title: 'Mattupetty Dam', description: 'Enjoy a boat ride and views of the surrounding hills.', time: '14:00', iconName: 'Waves' },
      { title: 'Top Station Viewpoint', description: 'Highest point in Munnar for panoramic views of the Western Ghats.', time: '06:00', iconName: 'Sunrise' }
    ]
  },
  {
    id: 'd22',
    name: 'Tbilisi',
    location: 'Georgia',
    image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['cultural', 'vibrant', 'mysterious'],
    priceBand: 'moderate',
    priceINR: 75000,
    travelHours: 9,
    description: 'A mix of medieval, neoclassical, and Soviet architecture.',
    rationale: 'Because you enjoy vibrant culture and mysterious, layered history.',
    bestDuration: '3-5 Days',
    lat: 41.7151,
    lng: 44.8271,
    travelerInsights: [
      { type: 'do', content: 'Take a cable car up to the Narikala Fortress for a view of the city.' },
      { type: 'dont', content: 'Don\'t miss the sulfur baths in the Abanotubani district.' },
      { type: 'tip', content: 'Try the local Khachapuri (cheese bread) and Khinkali (dumplings).' }
    ],
    socialMediaPosts: [
      { id: 's-tbi-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/tbilisi/', thumbnail: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=400&q=80', author: '@georgia_travel', caption: 'Tbilisi: A city of history and charm. 🏰✨' }
    ],
    popularActivities: [
      { title: 'Old Tbilisi Walk', description: 'Explore the narrow streets and colorful balconies of the old town.', time: '10:00', iconName: 'History' },
      { title: 'Narikala Fortress', description: 'Take the cable car up for panoramic city views.', time: '17:00', iconName: 'Landmark' },
      { title: 'Sulfur Baths', description: 'Relax in the historic domed bathhouses of Abanotubani.', time: '19:00', iconName: 'Waves' },
      { title: 'Dry Bridge Market', description: 'Browse for antiques and unique souvenirs at the flea market.', time: '11:00', iconName: 'ShoppingBag' }
    ]
  },
  {
    id: 'd23',
    name: 'Ladakh',
    location: 'Jammu & Kashmir, India',
    image: 'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1594226801341-41397bb83824?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['rugged', 'mysterious', 'unplugged'],
    priceBand: 'moderate',
    priceINR: 35000,
    travelHours: 6,
    description: 'The Land of High Passes, with stark mountains and crystal lakes.',
    rationale: 'Because you seek the rugged, mysterious beauty of the high Himalayas.',
    bestDuration: '7-10 Days',
    lat: 34.1526,
    lng: 77.5771,
    travelerInsights: [
      { type: 'do', content: 'Visit the Pangong Lake and the Nubra Valley.' },
      { type: 'dont', content: 'Don\'t rush; allow at least two days in Leh to acclimatize to the high altitude.' },
      { type: 'tip', content: 'Carry warm clothing, as temperatures can drop significantly at night.' }
    ],
    socialMediaPosts: [
      { id: 's-lad-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/ladakh/', thumbnail: 'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=400&q=80', author: '@himalayan_adventures', caption: 'The stark beauty of Ladakh. 🏔️✨' }
    ],
    popularActivities: [
      { title: 'Pangong Lake Visit', description: 'Drive to the stunning high-altitude lake that changes colors.', time: '08:00', iconName: 'Waves' },
      { title: 'Nubra Valley Safari', description: 'Ride double-humped camels in the high-altitude desert.', time: '15:00', iconName: 'Tent' },
      { title: 'Leh Palace Exploration', description: 'Visit the historic royal palace overlooking the town.', time: '10:30', iconName: 'Landmark' },
      { title: 'Hemis Monastery', description: 'Discover the largest and wealthiest monastery in Ladakh.', time: '13:00', iconName: 'History' }
    ]
  },
  {
    id: 'd24',
    name: 'Singapore',
    location: 'Singapore',
    image: 'https://images.unsplash.com/photo-1525625239514-75b4b927edee?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1525625239514-75b4b927edee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['vibrant', 'minimalist', 'luxurious'],
    priceBand: 'moderate',
    priceINR: 60000,
    travelHours: 5,
    description: 'A global financial hub with futuristic gardens and diverse food.',
    rationale: 'Because you appreciate vibrant urban efficiency and minimalist luxury.',
    bestDuration: '3-4 Days',
    lat: 1.3521,
    lng: 103.8198,
    travelerInsights: [
      { type: 'do', content: 'Visit the Gardens by the Bay and watch the Supertree Grove light show.' },
      { type: 'dont', content: 'Don\'t chew gum in public; it\'s strictly prohibited and can lead to fines.' },
      { type: 'tip', content: 'Eat at a local hawker center for a wide variety of affordable and delicious food.' }
    ],
    socialMediaPosts: [
      { id: 's-sin-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/singapore/', thumbnail: 'https://images.unsplash.com/photo-1525625239514-75b4b927edee?auto=format&fit=crop&w=400&q=80', author: '@singapore_vibes', caption: 'Futuristic gardens in Singapore. 🌳✨' }
    ],
    popularActivities: [
      { title: 'Gardens by the Bay', description: 'Explore the Cloud Forest and Flower Dome conservatories.', time: '10:00', iconName: 'Flower' },
      { title: 'Marina Bay Sands Skypark', description: 'Panoramic city views from the iconic rooftop deck.', time: '18:00', iconName: 'Building' },
      { title: 'Sentosa Island Fun', description: 'Enjoy theme parks, beaches, and attractions on the island.', time: '11:00', iconName: 'Waves' },
      { title: 'Hawker Center Feast', description: 'Taste diverse local dishes at Maxwell or Newton Food Centre.', time: '13:00', iconName: 'Utensils' }
    ]
  },
  {
    id: 'd25',
    name: 'Siwa Oasis',
    location: 'Egypt',
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1621506821199-296a7dfdb8c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1614589255823-3802996964c0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1614589255823-3802996964c0?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['mysterious', 'unplugged', 'cultural'],
    priceBand: 'moderate',
    priceINR: 95000,
    travelHours: 16,
    description: 'An urban oasis in the heart of the Great Sand Sea.',
    rationale: 'Because you are drawn to mysterious, off-grid cultural treasures.',
    bestDuration: '3-5 Days',
    lat: 29.2032,
    lng: 25.5195,
    travelerInsights: [
      { type: 'do', content: 'Swim in Cleopatra\'s Bath, a natural spring-fed pool.' },
      { type: 'dont', content: 'Don\'t miss the sunset from Fatnas Island.' },
      { type: 'tip', content: 'Visit the Temple of the Oracle, where Alexander the Great is said to have consulted the oracle.' }
    ],
    socialMediaPosts: [
      { id: 's-siw-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/siwaoasis/', thumbnail: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=400&q=80', author: '@egypt_unplugged', caption: 'The magic of Siwa Oasis. 🌴✨' }
    ],
    popularActivities: [
      { title: 'Cleopatra\'s Bath', description: 'Swim in the natural spring where the queen herself is said to have bathed.', time: '11:00', iconName: 'Waves' },
      { title: 'Temple of the Oracle', description: 'Visit the ancient site where Alexander the Great consulted the oracle.', time: '09:00', iconName: 'Landmark' },
      { title: 'Great Sand Sea Safari', description: 'Thrilling 4x4 dune bashing in the surrounding desert.', time: '15:00', iconName: 'Wind' },
      { title: 'Shali Fortress', description: 'Explore the mud-brick ruins of the 13th-century fortress.', time: '17:00', iconName: 'History' }
    ]
  },
  {
    id: 'd26',
    name: 'Alleppey',
    location: 'Kerala, India',
    image: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590603740183-980e7f6920eb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589982840456-a2281881b27b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'unplugged', 'cultural'],
    priceBand: 'moderate',
    priceINR: 22000,
    travelHours: 5,
    description: 'The Venice of the East, famous for its backwater houseboats.',
    rationale: 'Because you seek serene, slow-paced travel through lush tropical waterways.',
    bestDuration: '3-4 Days',
    lat: 9.4981,
    lng: 76.3388,
    travelerInsights: [
      { type: 'do', content: 'Book a private houseboat for an overnight stay in the backwaters.' },
      { type: 'dont', content: 'Avoid visiting during peak monsoon (June-August) if you want to explore the waters.' },
      { type: 'tip', content: 'Try the local Karimeen Pollichathu (pearl spot fish) for an authentic taste.' }
    ],
    socialMediaPosts: [
      { id: 's1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/alleppey/', thumbnail: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=400&q=80', author: '@keraladiaries', caption: 'Waking up to this view in Alleppey! 🛶✨' },
      { id: 's2', platform: 'youtube', url: 'https://www.youtube.com/results?search_query=alleppey+houseboat+experience', thumbnail: 'https://images.unsplash.com/photo-1590603740183-980e7f6920eb?auto=format&fit=crop&w=400&q=80', author: 'TravelWithMe', caption: 'Alleppey Houseboat Experience - Full Guide!' },
      { id: 's3', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/alleppeybackwaters/', thumbnail: 'https://images.unsplash.com/photo-1589982840456-a2281881b27b?auto=format&fit=crop&w=400&q=80', author: '@backwater_vibes', caption: 'Slow living in the backwaters. #Alleppey' },
      { id: 's4', platform: 'youtube', url: 'https://www.youtube.com/results?search_query=alleppey+hidden+gems', thumbnail: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80', author: 'IndiaUncut', caption: 'Hidden Gems of Kerala: Alleppey Edition' }
    ],
    popularActivities: [
      { title: 'Houseboat Cruise', description: 'Overnight stay in a traditional Kettuvallam through the backwaters.', time: '12:00', iconName: 'Waves' },
      { title: 'Shikara Boat Ride', description: 'Explore narrow canals and local village life on a smaller boat.', time: '16:00', iconName: 'Waves' },
      { title: 'Alleppey Beach Sunset', description: 'Relax on the sandy shores and visit the 150-year-old pier.', time: '17:30', iconName: 'Sunrise' },
      { title: 'Toddy Shop Visit', description: 'Taste local coconut palm wine and spicy Kerala delicacies.', time: '13:00', iconName: 'Utensils' }
    ]
  },
  {
    id: 'd27',
    name: 'Jaisalmer',
    location: 'Rajasthan, India',
    image: 'https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1615457938971-4a665949567c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1622215044456-829d28c2b74c?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['cultural', 'rugged', 'mysterious'],
    priceBand: 'moderate',
    priceINR: 28000,
    travelHours: 12,
    description: 'The Golden City, standing in the heart of the Thar Desert.',
    rationale: 'Because you are drawn to ancient desert forts and vibrant Rajasthani culture.',
    bestDuration: '4-5 Days',
    lat: 26.9157,
    lng: 70.9160,
    travelerInsights: [
      { type: 'do', content: 'Take a camel safari and camp under the stars in the Sam Sand Dunes.' },
      { type: 'dont', content: 'Don\'t miss the sunset from Vyas Chhatri for a panoramic view of the fort.' },
      { type: 'tip', content: 'The fort is a living fort; explore the narrow lanes where people still reside.' }
    ],
    socialMediaPosts: [
      { id: 'sj-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/jaisalmer/', thumbnail: 'https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?auto=format&fit=crop&w=400&q=80', author: '@desert_explorer', caption: 'Golden hour at the Golden City. 🏜️✨' },
      { id: 'sj-2', platform: 'pinterest', url: 'https://www.pinterest.com/search/pins/?q=jaisalmer%20fort', thumbnail: 'https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&w=400&q=80', author: 'TravelPins', caption: 'Jaisalmer Fort Architecture Details' },
      { id: 'sj-3', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/jaisalmerfort/', thumbnail: 'https://images.unsplash.com/photo-1615457938971-4a665949567c?auto=format&fit=crop&w=400&q=80', author: '@rajasthan_royals', caption: 'Camel safaris and desert dreams. #Jaisalmer' },
      { id: 'sj-4', platform: 'youtube', url: 'https://www.youtube.com/results?search_query=jaisalmer+desert+camping', thumbnail: 'https://images.unsplash.com/photo-1622215044456-829d28c2b74c?auto=format&fit=crop&w=400&q=80', author: 'DesertVlogs', caption: 'Camping in the Thar Desert: A Night to Remember' }
    ],
    popularActivities: [
      { title: 'Jaisalmer Fort Walk', description: 'Explore the living fort with its narrow lanes and Jain temples.', time: '09:00', iconName: 'Landmark' },
      { title: 'Sam Sand Dunes Safari', description: 'Camel ride and cultural evening in the desert dunes.', time: '16:00', iconName: 'Wind' },
      { title: 'Patwon Ki Haveli', description: 'Visit the most grand and intricately carved haveli in the city.', time: '11:00', iconName: 'History' },
      { title: 'Gadisar Lake Boat', description: 'Peaceful boat ride on the historic man-made reservoir.', time: '17:30', iconName: 'Waves' }
    ]
  },
  {
    id: 'd28',
    name: 'Rishikesh',
    location: 'Uttarakhand, India',
    image: 'https://images.unsplash.com/photo-1598977123418-45454503889a?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1598977123418-45454503889a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1614589255823-3802996964c0?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'rugged', 'cultural'],
    priceBand: 'budget',
    priceINR: 12000,
    travelHours: 6,
    description: 'The Yoga Capital of the World, nestled in the Himalayan foothills.',
    rationale: 'Because you seek spiritual serenity combined with rugged mountain adventure.',
    bestDuration: '5-7 Days',
    lat: 30.0869,
    lng: 78.2676,
    travelerInsights: [
      { type: 'do', content: 'Attend the evening Ganga Aarti at Triveni Ghat.' },
      { type: 'dont', content: 'Avoid visiting during the Kanwar Yatra (July-August) if you prefer peace.' },
      { type: 'tip', content: 'Try white-water rafting in the Ganges for an adrenaline rush.' }
    ],
    socialMediaPosts: [
      { id: 'sr-1', platform: 'youtube', url: 'https://www.youtube.com/results?search_query=rishikesh+yoga+retreat', thumbnail: 'https://images.unsplash.com/photo-1598977123418-45454503889a?auto=format&fit=crop&w=400&q=80', author: 'YogaVlogs', caption: 'My 7-day Yoga Retreat in Rishikesh' },
      { id: 'sr-2', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/rishikesh/', thumbnail: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80', author: '@adventure_india', caption: 'Rafting through the rapids! 🌊' }
    ],
    popularActivities: [
      { title: 'Ganga Aarti', description: 'Attend the spiritual evening ceremony at Parmarth Niketan.', time: '18:30', iconName: 'Flame' },
      { title: 'White Water Rafting', description: 'Thrilling adventure on the rapids of the Ganges.', time: '09:00', iconName: 'Waves' },
      { title: 'Beatles Ashram', description: 'Visit the ruins where the Beatles stayed and meditated.', time: '15:00', iconName: 'History' },
      { title: 'Laxman Jhula Walk', description: 'Cross the iconic suspension bridge for great river views.', time: '11:00', iconName: 'Wind' }
    ]
  },
  {
    id: 'd29',
    name: 'Shillong',
    location: 'Meghalaya, India',
    image: 'https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-23a9d7fc6bbd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'cultural', 'rugged'],
    priceBand: 'moderate',
    priceINR: 30000,
    travelHours: 8,
    description: 'The Scotland of the East, known for its rolling hills and waterfalls.',
    rationale: 'Because you crave serene, mist-covered landscapes and unique tribal culture.',
    bestDuration: '6-8 Days',
    lat: 25.5788,
    lng: 91.8933,
    travelerInsights: [
      { type: 'do', content: 'Visit the Living Root Bridges in nearby Cherrapunji.' },
      { type: 'dont', content: 'Don\'t forget to carry a sturdy umbrella; it can rain anytime.' },
      { type: 'tip', content: 'Explore the local cafes in Police Bazar for great music and food.' }
    ],
    socialMediaPosts: [
      { id: 'ss-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/shillong/', thumbnail: 'https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?auto=format&fit=crop&w=400&q=80', author: '@meghalaya_travel', caption: 'The hills of Shillong are calling. 🏔️✨' }
    ],
    popularActivities: [
      { title: 'Elephant Falls', description: 'Visit the three-tiered waterfall in the lush green hills.', time: '10:00', iconName: 'Waves' },
      { title: 'Shillong Peak', description: 'Highest point for a panoramic view of the city and plains.', time: '09:00', iconName: 'Mountain' },
      { title: 'Laitlum Canyons', description: 'Breathtaking views of the deep gorges and valleys.', time: '14:00', iconName: 'Mountain' },
      { title: 'Police Bazar Walk', description: 'Explore the vibrant local market and food stalls.', time: '17:00', iconName: 'ShoppingBag' }
    ]
  },
  {
    id: 'd30',
    name: 'Pondicherry',
    location: 'Puducherry, India',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'cultural', 'minimalist'],
    priceBand: 'moderate',
    priceINR: 20000,
    travelHours: 3,
    description: 'A French colonial settlement with a unique spiritual vibe.',
    rationale: 'Because you appreciate serene coastal walks and minimalist French architecture.',
    bestDuration: '3-5 Days',
    lat: 11.9416,
    lng: 79.8083,
    travelerInsights: [
      { type: 'do', content: 'Spend a day at Auroville and the Matrimandir.' },
      { type: 'dont', content: 'Avoid the main beaches for swimming; head to Paradise Beach instead.' },
      { type: 'tip', content: 'Rent a bicycle or scooter to explore the French Quarter at your own pace.' }
    ],
    socialMediaPosts: [
      { id: 'sp-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/pondicherry/', thumbnail: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80', author: '@frenchvibes', caption: 'Bonjour from Pondicherry! 🥐🇫🇷' },
      { id: 'sp-2', platform: 'pinterest', url: 'https://www.pinterest.com/search/pins/?q=pondicherry%20travel', thumbnail: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80', author: 'Auroville_Inspo', caption: 'The peace of Matrimandir.' }
    ],
    popularActivities: [
      { title: 'French Quarter Walk', description: 'Explore the yellow-walled colonial buildings and cafes.', time: '09:00', iconName: 'History' },
      { title: 'Auroville Visit', description: 'Experience the international township and Matrimandir.', time: '11:00', iconName: 'Landmark' },
      { title: 'Promenade Beach', description: 'Evening stroll along the scenic rocky coastline.', time: '18:00', iconName: 'Waves' },
      { title: 'Paradise Beach Boat', description: 'Take a ferry to the secluded and pristine sandy beach.', time: '14:00', iconName: 'Waves' }
    ]
  },
  {
    id: 'd31',
    name: 'Coorg',
    location: 'Karnataka, India',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'unplugged', 'rugged'],
    priceBand: 'moderate',
    priceINR: 25000,
    travelHours: 6,
    description: 'The Coffee County of India, known for its lush greenery.',
    rationale: 'Because you seek a serene escape into coffee plantations and misty hills.',
    bestDuration: '3-4 Days',
    lat: 12.3375,
    lng: 75.8069,
    travelerInsights: [
      { type: 'do', content: 'Stay in a plantation homestay for the best experience.' },
      { type: 'dont', content: 'Don\'t miss the sunset at Raja\'s Seat.' },
      { type: 'tip', content: 'Visit the Namdroling Monastery (Golden Temple) in Bylakuppe.' }
    ],
    socialMediaPosts: [
      { id: 'sc-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/coorg/', thumbnail: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=400&q=80', author: '@coorg_diaries', caption: 'Misty mornings in Coorg. ☕✨' }
    ],
    popularActivities: [
      { title: 'Coffee Plantation Tour', description: 'Learn about coffee cultivation and enjoy fresh brews.', time: '10:00', iconName: 'Coffee' },
      { title: 'Abbey Falls', description: 'Visit the stunning waterfall nestled in a spice plantation.', time: '11:30', iconName: 'Waves' },
      { title: 'Dubare Elephant Camp', description: 'Interact with and bathe elephants in the river.', time: '09:00', iconName: 'Waves' },
      { title: 'Raja\'s Seat Sunset', description: 'Panoramic views of the valley and rolling hills.', time: '17:30', iconName: 'Sunrise' }
    ]
  },
  {
    id: 'd32',
    name: 'Gulmarg',
    location: 'Jammu & Kashmir, India',
    image: 'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1594226801341-41397bb83824?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'rugged', 'luxurious'],
    priceBand: 'luxury',
    priceINR: 60000,
    travelHours: 8,
    description: 'A premier ski destination with breathtaking alpine views.',
    rationale: 'Because you desire a serene, snow-covered luxury escape in the mountains.',
    bestDuration: '4-6 Days',
    lat: 34.0484,
    lng: 74.3805,
    travelerInsights: [
      { type: 'do', content: 'Take the Gondola ride to Apharwat Peak for stunning views.' },
      { type: 'dont', content: 'Avoid visiting in late spring if you want to see snow.' },
      { type: 'tip', content: 'Hire a local guide for skiing to find the best slopes.' }
    ],
    socialMediaPosts: [
      { id: 'sg-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/gulmarg/', thumbnail: 'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=400&q=80', author: '@snow_seeker', caption: 'Skiing in the heart of Kashmir! ❄️⛷️' }
    ],
    popularActivities: [
      { title: 'Gulmarg Gondola Ride', description: 'One of the highest cable cars in the world for alpine views.', time: '10:00', iconName: 'Mountain' },
      { title: 'Skiing & Snowboarding', description: 'Experience world-class slopes in the winter months.', time: '11:00', iconName: 'Wind' },
      { title: 'Alpathar Lake Trek', description: 'High-altitude lake trek with stunning mountain scenery.', time: '09:00', iconName: 'Mountain' },
      { title: 'St. Mary\'s Church', description: 'Visit the historic Victorian-style church in the meadows.', time: '15:00', iconName: 'History' }
    ]
  },
  {
    id: 'd33',
    name: 'Bangalore',
    location: 'Karnataka, India',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['vibrant', 'minimalist', 'nocturnal'],
    priceBand: 'moderate',
    priceINR: 15000,
    travelHours: 2,
    description: 'The Silicon Valley of India, known for its parks and pub culture.',
    rationale: 'Because you thrive in vibrant, modern urban environments with great nightlife.',
    bestDuration: '3-4 Days',
    lat: 12.9716,
    lng: 77.5946,
    travelerInsights: [
      { type: 'do', content: 'Explore the pub culture in Indiranagar or Koramangala.' },
      { type: 'dont', content: 'Don\'t underestimate the traffic; plan your travel accordingly.' },
      { type: 'tip', content: 'Visit Cubbon Park early in the morning for a peaceful walk.' }
    ],
    socialMediaPosts: [
      { id: 'sb-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/bangalore/', thumbnail: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=400&q=80', author: '@city_of_gardens', caption: 'Bangalore: The garden city. 🌳✨' }
    ],
    popularActivities: [
      { title: 'Lalbagh Botanical Garden', description: 'Explore the historic glass house and diverse plant species.', time: '08:00', iconName: 'Flower' },
      { title: 'Bangalore Palace', description: 'Visit the Tudor-style palace with its grand architecture.', time: '10:30', iconName: 'Landmark' },
      { title: 'Indiranagar Pub Crawl', description: 'Experience the vibrant craft beer scene and nightlife.', time: '19:00', iconName: 'GlassWater' },
      { title: 'Cubbon Park Walk', description: 'A peaceful escape in the heart of the bustling city.', time: '07:00', iconName: 'Wind' }
    ]
  },
  {
    id: 'd34',
    name: 'Mumbai',
    location: 'Maharashtra, India',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570160897040-30430ef2015a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['vibrant', 'nocturnal', 'cultural'],
    priceBand: 'moderate',
    priceINR: 20000,
    travelHours: 2,
    description: 'The City of Dreams, a bustling metropolis on the coast.',
    rationale: 'Because you crave vibrant energy and a city that never sleeps.',
    bestDuration: '4-6 Days',
    lat: 19.0760,
    lng: 72.8777,
    travelerInsights: [
      { type: 'do', content: 'Take a local train during non-peak hours for the experience.' },
      { type: 'dont', content: 'Don\'t miss the street food at Chowpatty Beach.' },
      { type: 'tip', content: 'Walk along Marine Drive at night for a beautiful view of the skyline.' }
    ],
    socialMediaPosts: [
      { id: 'sm-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/mumbai/', thumbnail: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&q=80', author: '@mumbai_diaries', caption: 'The city that never sleeps. 🏙️✨' },
      { id: 'sm-2', platform: 'youtube', url: 'https://www.youtube.com/results?search_query=mumbai+street+food', thumbnail: 'https://images.unsplash.com/photo-1570160897040-30430ef2015a?auto=format&fit=crop&w=400&q=80', author: 'CityLights', caption: 'Mumbai Street Food Tour: Best Vada Pav!' },
      { id: 'sm-3', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/gatewayofindia/', thumbnail: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=400&q=80', author: '@gateway_explorer', caption: 'The iconic Gateway of India. #Mumbai' },
      { id: 'sm-4', platform: 'youtube', url: 'https://www.youtube.com/results?search_query=mumbai+skyline', thumbnail: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=400&q=80', author: 'MumbaiVlogs', caption: 'Mumbai Skyline: A Night Perspective' }
    ],
    popularActivities: [
      { title: 'Gateway of India', description: 'Visit the iconic archway and take a ferry to Elephanta Caves.', time: '09:00', iconName: 'Landmark' },
      { title: 'Marine Drive Stroll', description: 'Walk along the "Queen\'s Necklace" for stunning ocean views.', time: '18:00', iconName: 'Waves' },
      { title: 'Colaba Causeway Shopping', description: 'Explore the vibrant street market for antiques and fashion.', time: '11:00', iconName: 'ShoppingBag' },
      { title: 'Street Food Tour', description: 'Taste Vada Pav, Pav Bhaji, and Bhel Puri at Juhu Beach.', time: '17:00', iconName: 'Utensils' }
    ]
  },
  {
    id: 'd35',
    name: 'Paro',
    location: 'Bhutan',
    image: 'https://images.unsplash.com/photo-1578516123433-503d6c29bebc?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1578516123433-503d6c29bebc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520769945061-0a448c463865?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'cultural', 'mysterious'],
    priceBand: 'luxury',
    priceINR: 120000,
    travelHours: 4,
    description: 'A valley town known for its sacred sites and stunning landscapes.',
    rationale: 'Because you seek serene spiritual connection in a mysterious mountain kingdom.',
    bestDuration: '5-7 Days',
    lat: 27.4287,
    lng: 89.4184,
    travelerInsights: [
      { type: 'do', content: 'Hike up to the Tiger\'s Nest Monastery (Paro Taktsang).' },
      { type: 'dont', content: 'Don\'t forget to respect the local customs and dress modestly in temples.' },
      { type: 'tip', content: 'Try the local Ema Datshi (chili and cheese) if you like spicy food.' }
    ],
    socialMediaPosts: [
      { id: 'sb-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/paro/', thumbnail: 'https://images.unsplash.com/photo-1578516123433-503d6c29bebc?auto=format&fit=crop&w=400&q=80', author: '@bhutan_travels', caption: 'The climb was worth it. Tiger\'s Nest is magical. 🇧🇹✨' }
    ],
    popularActivities: [
      { title: 'Tiger\'s Nest Hike', description: 'Climb to the iconic monastery perched on a cliffside.', time: '08:00', iconName: 'Mountain' },
      { title: 'Paro Dzong Visit', description: 'Explore the impressive fortress and administrative center.', time: '11:00', iconName: 'Landmark' },
      { title: 'National Museum', description: 'Discover Bhutanese history and culture in a former watchtower.', time: '14:00', iconName: 'History' },
      { title: 'Kyichu Lhakhang', description: 'Visit one of the oldest and most sacred temples in Bhutan.', time: '16:00', iconName: 'Landmark' }
    ]
  },
  {
    id: 'd36',
    name: 'Sigiriya',
    location: 'Sri Lanka',
    image: 'https://images.unsplash.com/photo-1588598116712-2902f78c1e6c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1588598116712-2902f78c1e6c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['cultural', 'mysterious', 'rugged'],
    priceBand: 'moderate',
    priceINR: 55000,
    travelHours: 4,
    description: 'An ancient rock fortress with stunning frescoes and gardens.',
    rationale: 'Because you are drawn to mysterious history and rugged, natural beauty.',
    bestDuration: '3-4 Days',
    lat: 7.9570,
    lng: 80.7603,
    travelerInsights: [
      { type: 'do', content: 'Climb the Lion Rock early in the morning to avoid the heat.' },
      { type: 'dont', content: 'Don\'t miss the view of Sigiriya from the nearby Pidurangala Rock.' },
      { type: 'tip', content: 'Carry plenty of water and wear comfortable shoes for the climb.' }
    ],
    socialMediaPosts: [
      { id: 'ssi-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/sigiriya/', thumbnail: 'https://images.unsplash.com/photo-1588598116712-2902f78c1e6c?auto=format&fit=crop&w=400&q=80', author: '@srilanka_adventures', caption: 'Sigiriya Rock Fortress is a wonder. 🇱🇰✨' }
    ],
    popularActivities: [
      { title: 'Lion Rock Climb', description: 'Ascend the ancient rock fortress for stunning views and frescoes.', time: '07:00', iconName: 'Mountain' },
      { title: 'Pidurangala Rock Hike', description: 'Best spot for a panoramic view of Sigiriya Rock at sunrise.', time: '05:30', iconName: 'Mountain' },
      { title: 'Sigiriya Museum', description: 'Learn about the history and archaeology of the site.', time: '11:00', iconName: 'History' },
      { title: 'Village Safari', description: 'Experience traditional Sri Lankan rural life and food.', time: '15:00', iconName: 'Utensils' }
    ]
  },
  {
    id: 'd37',
    name: 'Jodhpur',
    location: 'Rajasthan, India',
    image: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570160897040-30430ef2015a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['cultural', 'vibrant', 'nostalgic'],
    priceBand: 'moderate',
    priceINR: 22000,
    travelHours: 10,
    description: 'The Blue City, famous for its Mehrangarh Fort and blue-painted houses.',
    rationale: 'Because you love vibrant colors and deep-rooted historical nostalgia.',
    bestDuration: '3-4 Days',
    lat: 26.2389,
    lng: 73.0243,
    travelerInsights: [
      { type: 'do', content: 'Explore the blue streets of the old city for amazing photography.' },
      { type: 'dont', content: 'Don\'t miss the zip-lining (Flying Fox) over Mehrangarh Fort.' },
      { type: 'tip', content: 'Try the Makhaniya Lassi at Mishrilal Hotel near the Clock Tower.' }
    ],
    socialMediaPosts: [
      { id: 'sj1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/jodhpur/', thumbnail: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=400&q=80', author: '@bluecityvibes', caption: 'Lost in the blue lanes of Jodhpur. 💙' }
    ],
    popularActivities: [
      { title: 'Mehrangarh Fort', description: 'Explore one of the largest and most magnificent forts in India.', time: '09:30', iconName: 'Landmark' },
      { title: 'Blue City Walking Tour', description: 'Wander through the Brahmin-blue houses of the old city.', time: '16:00', iconName: 'History' },
      { title: 'Jaswant Thada', description: 'Visit the graceful marble cenotaph built in memory of the Maharaja.', time: '11:00', iconName: 'Landmark' },
      { title: 'Flying Fox Zipline', description: 'Thrilling aerial view of the fort and the blue city.', time: '15:00', iconName: 'Wind' }
    ]
  },
  {
    id: 'd38',
    name: 'Amritsar',
    location: 'Punjab, India',
    image: 'https://images.unsplash.com/photo-1588096344356-9b606330065e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1588096344356-9b606330065e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598977123418-45454503889a?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['cultural', 'vibrant', 'serene'],
    priceBand: 'budget',
    priceINR: 10000,
    travelHours: 8,
    description: 'Home to the Golden Temple, the holiest shrine of Sikhism.',
    rationale: 'Because you seek spiritual serenity and vibrant community culture.',
    bestDuration: '2-3 Days',
    lat: 31.6200,
    lng: 74.8765,
    travelerInsights: [
      { type: 'do', content: 'Experience the Langar (community kitchen) at the Golden Temple.' },
      { type: 'dont', content: 'Don\'t miss the Wagah Border ceremony in the evening.' },
      { type: 'tip', content: 'Try the Amritsari Kulcha at a local dhaba.' }
    ],
    socialMediaPosts: [
      { id: 'sa-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/amritsar/', thumbnail: 'https://images.unsplash.com/photo-1588096344356-9b606330065e?auto=format&fit=crop&w=400&q=80', author: '@golden_temple_vibes', caption: 'Peace found at the Golden Temple. 🙏✨' }
    ],
    popularActivities: [
      { title: 'Golden Temple Visit', description: 'Spiritual experience at the holiest shrine of Sikhism.', time: '05:00', iconName: 'Landmark' },
      { title: 'Wagah Border Ceremony', description: 'Witness the patriotic beating retreat ceremony at the border.', time: '16:30', iconName: 'History' },
      { title: 'Jallianwala Bagh', description: 'Pay respects at the historic site of the 1919 massacre.', time: '11:00', iconName: 'History' },
      { title: 'Amritsari Food Trail', description: 'Taste authentic Kulchas, Lassi, and Dal at local dhabas.', time: '13:00', iconName: 'Utensils' }
    ]
  },
  {
    id: 'd39',
    name: 'Darjeeling',
    location: 'West Bengal, India',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-23a9d7fc6bbd?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'nostalgic', 'rugged'],
    priceBand: 'moderate',
    priceINR: 25000,
    travelHours: 12,
    description: 'The Queen of Hills, famous for its tea gardens and views of Kanchenjunga.',
    rationale: 'Because you crave nostalgic charm and serene mountain vistas.',
    bestDuration: '4-5 Days',
    lat: 27.0360,
    lng: 88.2627,
    travelerInsights: [
      { type: 'do', content: 'Take a ride on the Darjeeling Himalayan Railway (Toy Train).' },
      { type: 'dont', content: 'Don\'t miss the sunrise at Tiger Hill.' },
      { type: 'tip', content: 'Visit Glenary\'s for breakfast and a view of the mountains.' }
    ],
    socialMediaPosts: [
      { id: 'sd-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/darjeeling/', thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80', author: '@mountain_escape', caption: 'Tea gardens and toy trains. 🚂🍃' }
    ],
    popularActivities: [
      { title: 'Tiger Hill Sunrise', description: 'Watch the sun rise over Kanchenjunga and Mt. Everest.', time: '04:00', iconName: 'Sunrise' },
      { title: 'Darjeeling Toy Train', description: 'Ride the historic UNESCO World Heritage steam engine.', time: '10:00', iconName: 'History' },
      { title: 'Happy Valley Tea Estate', description: 'Tour the tea gardens and learn about tea processing.', time: '14:00', iconName: 'Flower' },
      { title: 'Ghoom Monastery', description: 'Visit one of the oldest Tibetan Buddhist monasteries in the region.', time: '11:30', iconName: 'Landmark' }
    ]
  },
  {
    id: 'd40',
    name: 'Manali',
    location: 'Himachal Pradesh, India',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598977123418-45454503889a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1594226801341-41397bb83824?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['rugged', 'vibrant', 'serene'],
    priceBand: 'budget',
    priceINR: 15000,
    travelHours: 14,
    description: 'A high-altitude Himalayan resort town for adventure and relaxation.',
    rationale: 'Because you want a mix of rugged adventure and vibrant mountain life.',
    bestDuration: '5-7 Days',
    lat: 32.2432,
    lng: 77.1892,
    travelerInsights: [
      { type: 'do', content: 'Go paragliding in Solang Valley.' },
      { type: 'dont', content: 'Avoid the main town if you want peace; stay in Old Manali instead.' },
      { type: 'tip', content: 'Visit the Hadimba Devi Temple, an ancient wooden structure in the forest.' }
    ],
    socialMediaPosts: [
      { id: 'sm-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/manali/', thumbnail: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80', author: '@manali_travels', caption: 'Snowy peaks of Manali. 🏔️✨' }
    ],
    popularActivities: [
      { title: 'Solang Valley Adventure', description: 'Paragliding, zorbing, and skiing in the scenic valley.', time: '10:00', iconName: 'Wind' },
      { title: 'Rohtang Pass Trip', description: 'High-altitude pass with year-round snow and mountain views.', time: '08:00', iconName: 'Mountain' },
      { title: 'Hadimba Devi Temple', description: 'Visit the ancient wooden temple dedicated to the goddess.', time: '15:00', iconName: 'History' },
      { title: 'Old Manali Cafe Crawl', description: 'Explore the vibrant cafes and local markets of Old Manali.', time: '18:00', iconName: 'Utensils' }
    ]
  },
  {
    id: 'd41',
    name: 'Ooty',
    location: 'Tamil Nadu, India',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'nostalgic', 'minimalist'],
    priceBand: 'moderate',
    priceINR: 20000,
    travelHours: 6,
    description: 'The Blue Mountains, known for its tea gardens and colonial charm.',
    rationale: 'Because you seek serene landscapes and nostalgic colonial vibes.',
    bestDuration: '3-4 Days',
    lat: 11.4102,
    lng: 76.6991,
    travelerInsights: [
      { type: 'do', content: 'Ride the Nilgiri Mountain Railway.' },
      { type: 'dont', content: 'Don\'t miss the botanical gardens, but go early to avoid crowds.' },
      { type: 'tip', content: 'Try the local Ooty chocolates and tea.' }
    ],
    socialMediaPosts: [
      { id: 'so-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/ooty/', thumbnail: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=400&q=80', author: '@ooty_vibes', caption: 'The beauty of Ooty. 🏔️✨' }
    ],
    popularActivities: [
      { title: 'Nilgiri Mountain Railway', description: 'Scenic toy train ride through the blue mountains.', time: '09:00', iconName: 'History' },
      { title: 'Ooty Lake Boating', description: 'Enjoy a peaceful boat ride on the scenic man-made lake.', time: '11:00', iconName: 'Waves' },
      { title: 'Botanical Gardens', description: 'Explore the diverse flora and the 20-million-year-old fossil tree.', time: '14:00', iconName: 'Flower' },
      { title: 'Doddabetta Peak', description: 'Highest point in the Nilgiris for panoramic views.', time: '16:00', iconName: 'Mountain' }
    ]
  },
  {
    id: 'd42',
    name: 'Hyderabad',
    location: 'Telangana, India',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['vibrant', 'cultural', 'nocturnal'],
    priceBand: 'moderate',
    priceINR: 18000,
    travelHours: 2,
    description: 'The City of Pearls, where history meets modern technology.',
    rationale: 'Because you enjoy vibrant urban life and rich cultural history.',
    bestDuration: '3-5 Days',
    lat: 17.3850,
    lng: 78.4867,
    travelerInsights: [
      { type: 'do', content: 'Visit the Charminar and the nearby Laad Bazar.' },
      { type: 'dont', content: 'Don\'t leave without trying the authentic Hyderabadi Biryani.' },
      { type: 'tip', content: 'Explore the Golconda Fort in the evening for the light and sound show.' }
    ],
    socialMediaPosts: [
      { id: 'sh-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/hyderabad/', thumbnail: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=400&q=80', author: '@city_of_pearls', caption: 'The grandeur of Charminar. 🏛️✨' }
    ],
    popularActivities: [
      { title: 'Charminar & Laad Bazar', description: 'Visit the iconic monument and shop for traditional bangles.', time: '10:00', iconName: 'Landmark' },
      { title: 'Golconda Fort', description: 'Explore the historic fortress and watch the light show.', time: '16:00', iconName: 'History' },
      { title: 'Salar Jung Museum', description: 'One of the largest art collections in the world.', time: '11:30', iconName: 'History' },
      { title: 'Biryani Feast', description: 'Taste the world-famous Hyderabadi Dum Biryani.', time: '13:30', iconName: 'Utensils' }
    ]
  },
  {
    id: 'd43',
    name: 'Kochi',
    location: 'Kerala, India',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['cultural', 'serene', 'nostalgic'],
    priceBand: 'moderate',
    priceINR: 22000,
    travelHours: 4,
    description: 'A historic port city with a mix of Portuguese, Dutch, and British influences.',
    rationale: 'Because you appreciate layered cultural history and serene coastal charm.',
    bestDuration: '3-4 Days',
    lat: 9.9312,
    lng: 76.2673,
    travelerInsights: [
      { type: 'do', content: 'Watch a Kathakali performance in Fort Kochi.' },
      { type: 'dont', content: 'Don\'t miss the Chinese Fishing Nets at sunset.' },
      { type: 'tip', content: 'Explore the Jewish Synagogue and Jew Town for unique antiques.' }
    ],
    socialMediaPosts: [
      { id: 'sk-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/kochi/', thumbnail: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80', author: '@fort_kochi_vibes', caption: 'Fort Kochi charm. ⚓✨' }
    ],
    popularActivities: [
      { title: 'Fort Kochi Walk', description: 'Explore the colonial architecture, Chinese fishing nets, and art galleries.', time: '09:00', iconName: 'History' },
      { title: 'Kathakali Performance', description: 'Witness the traditional classical dance-drama of Kerala.', time: '18:00', iconName: 'History' },
      { title: 'Jew Town & Synagogue', description: 'Visit the historic Jewish quarter and the 16th-century synagogue.', time: '11:00', iconName: 'Landmark' },
      { title: 'Backwater Sunset Cruise', description: 'Relaxing boat ride through the harbor and nearby islands.', time: '17:30', iconName: 'Waves' }
    ]
  },
  {
    id: 'd44',
    name: 'Agra',
    location: 'Uttar Pradesh, India',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657451dd7?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657451dd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598332867705-189679198642?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['cultural', 'nostalgic', 'luxurious'],
    priceBand: 'moderate',
    priceINR: 12000,
    travelHours: 3,
    description: 'Home to the Taj Mahal, one of the Seven Wonders of the World.',
    rationale: 'Because you value iconic cultural history and timeless beauty.',
    bestDuration: '1-2 Days',
    lat: 27.1767,
    lng: 78.0081,
    travelerInsights: [
      { type: 'do', content: 'Visit the Taj Mahal at sunrise for the best light and fewer crowds.' },
      { type: 'dont', content: 'Don\'t miss the Agra Fort, a massive red sandstone structure.' },
      { type: 'tip', content: 'Try the local Agra Petha (sweet) for a traditional treat.' }
    ],
    socialMediaPosts: [
      { id: 'st-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/tajmahal/', thumbnail: 'https://images.unsplash.com/photo-1564507592333-c60657451dd7?auto=format&fit=crop&w=400&q=80', author: '@taj_mahal_official', caption: 'A monument to love. 🏛️❤️' }
    ],
    popularActivities: [
      { title: 'Taj Mahal Sunrise', description: 'Experience the world\'s most famous monument in the soft morning light.', time: '06:00', iconName: 'Landmark' },
      { title: 'Agra Fort', description: 'Explore the massive 16th-century Mughal fortress.', time: '10:00', iconName: 'History' },
      { title: 'Mehtab Bagh', description: 'Enjoy a view of the Taj Mahal from across the Yamuna river.', time: '17:00', iconName: 'Flower' },
      { title: 'Petha Tasting', description: 'Try the famous local sweet made from ash gourd.', time: '13:00', iconName: 'Utensils' }
    ]
  },
  {
    id: 'd45',
    name: 'Kaziranga',
    location: 'Assam, India',
    image: 'https://images.unsplash.com/photo-1581012771300-224937651c42?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1581012771300-224937651c42?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['rugged', 'unplugged', 'serene'],
    priceBand: 'moderate',
    priceINR: 35000,
    travelHours: 10,
    description: 'A UNESCO World Heritage site famous for its one-horned rhinoceroses.',
    rationale: 'Because you seek rugged wilderness and serene nature connection.',
    bestDuration: '3-4 Days',
    lat: 26.5775,
    lng: 93.1711,
    travelerInsights: [
      { type: 'do', content: 'Take an early morning elephant safari for the best wildlife sightings.' },
      { type: 'dont', content: 'Avoid visiting during the monsoon (June-September) when the park is closed.' },
      { type: 'tip', content: 'Stay in a jungle lodge for an immersive experience.' }
    ],
    socialMediaPosts: [
      { id: 'skz-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/kaziranga/', thumbnail: 'https://images.unsplash.com/photo-1581012771300-224937651c42?auto=format&fit=crop&w=400&q=80', author: '@wildlife_india', caption: 'Spotting the one-horned rhino. 🦏✨' }
    ],
    popularActivities: [
      { title: 'Elephant Safari', description: 'Early morning ride for the best chance to see rhinos up close.', time: '05:30', iconName: 'Wind' },
      { title: 'Jeep Safari', description: 'Explore the different ranges of the park for diverse wildlife.', time: '14:30', iconName: 'Wind' },
      { title: 'Orchid Park Visit', description: 'Discover the vast collection of orchids and local cultural shows.', time: '11:00', iconName: 'Flower' },
      { title: 'Tea Garden Walk', description: 'Stroll through the lush tea estates surrounding the park.', time: '16:30', iconName: 'Flower' }
    ]
  },
  {
    id: 'd46',
    name: 'Andaman Islands',
    location: 'Andaman & Nicobar, India',
    image: 'https://images.unsplash.com/photo-1589982840456-a2281881b27b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1589982840456-a2281881b27b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590603740183-980e7f6920eb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'unplugged', 'luxurious'],
    priceBand: 'luxury',
    priceINR: 85000,
    travelHours: 5,
    description: 'Pristine white-sand beaches and crystal-clear waters.',
    rationale: 'Because you desire a serene, unplugged luxury escape by the ocean.',
    bestDuration: '6-8 Days',
    lat: 11.6234,
    lng: 92.7265,
    travelerInsights: [
      { type: 'do', content: 'Go scuba diving or snorkeling at Havelock Island.' },
      { type: 'dont', content: 'Don\'t miss the light and sound show at the Cellular Jail in Port Blair.' },
      { type: 'tip', content: 'Visit Radhanagar Beach, often cited as one of the best in Asia.' }
    ],
    socialMediaPosts: [
      { id: 'san-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/andaman/', thumbnail: 'https://images.unsplash.com/photo-1589982840456-a2281881b27b?auto=format&fit=crop&w=400&q=80', author: '@island_vibes', caption: 'Crystal clear waters of Havelock. 🏝️🌊' }
    ],
    popularActivities: [
      { title: 'Scuba Diving', description: 'Explore the vibrant coral reefs and marine life of Havelock.', time: '08:00', iconName: 'Waves' },
      { title: 'Radhanagar Beach', description: 'Relax on one of the world\'s most beautiful white-sand beaches.', time: '15:00', iconName: 'Waves' },
      { title: 'Cellular Jail Tour', description: 'Visit the historic colonial prison and watch the light show.', time: '10:00', iconName: 'History' },
      { title: 'Ross Island Visit', description: 'Explore the ruins of the former British administrative center.', time: '13:00', iconName: 'History' }
    ]
  },
  {
    id: 'd47',
    name: 'Kathmandu',
    location: 'Nepal',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598977123418-45454503889a?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['cultural', 'vibrant', 'mysterious'],
    priceBand: 'budget',
    priceINR: 15000,
    travelHours: 2,
    description: 'The capital of Nepal, a city of ancient temples and bustling markets.',
    rationale: 'Because you seek vibrant cultural immersion and mysterious ancient history.',
    bestDuration: '4-6 Days',
    lat: 27.7172,
    lng: 85.3240,
    travelerInsights: [
      { type: 'do', content: 'Visit the Swayambhunath Stupa (Monkey Temple) for a panoramic view of the city.' },
      { type: 'dont', content: 'Don\'t miss the Durbar Squares in Kathmandu, Patan, and Bhaktapur.' },
      { type: 'tip', content: 'Try the local Momos and Newari cuisine.' }
    ],
    socialMediaPosts: [
      { id: 'skm-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/kathmandu/', thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80', author: '@nepal_travel', caption: 'The heart of Kathmandu. 🇳🇵✨' }
    ],
    popularActivities: [
      { title: 'Swayambhunath Stupa', description: 'Visit the "Monkey Temple" for panoramic city views.', time: '08:00', iconName: 'Landmark' },
      { title: 'Pashupatinath Temple', description: 'Observe the sacred Hindu rituals on the banks of the Bagmati.', time: '10:00', iconName: 'Landmark' },
      { title: 'Boudhanath Stupa', description: 'Walk around one of the largest spherical stupas in the world.', time: '15:00', iconName: 'Landmark' },
      { title: 'Thamel Market Walk', description: 'Explore the bustling streets for trekking gear and local crafts.', time: '17:00', iconName: 'ShoppingBag' }
    ]
  },
  {
    id: 'd48',
    name: 'Pokhara',
    location: 'Nepal',
    image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520769945061-0a448c463865?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'rugged', 'unplugged'],
    priceBand: 'budget',
    priceINR: 18000,
    travelHours: 4,
    description: 'A gateway to the Annapurna Circuit, known for its tranquil lakes and mountain views.',
    rationale: 'Because you crave serene lakeside relaxation and rugged mountain adventure.',
    bestDuration: '3-5 Days',
    lat: 28.2096,
    lng: 83.9856,
    travelerInsights: [
      { type: 'do', content: 'Go paragliding from Sarangkot for an aerial view of the Himalayas.' },
      { type: 'dont', content: 'Don\'t miss the sunrise at Sarangkot.' },
      { type: 'tip', content: 'Take a boat ride on Phewa Lake and visit the Tal Barahi Temple.' }
    ],
    socialMediaPosts: [
      { id: 'spk-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/pokhara/', thumbnail: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=400&q=80', author: '@pokhara_vibes', caption: 'Tranquil lakes and mountain views. 🏔️✨' }
    ],
    popularActivities: [
      { title: 'Phewa Lake Boating', description: 'Peaceful boat ride with views of the Annapurna range.', time: '10:00', iconName: 'Waves' },
      { title: 'Sarangkot Sunrise', description: 'Breathtaking sunrise view over the Himalayas.', time: '05:00', iconName: 'Sunrise' },
      { title: 'World Peace Pagoda', description: 'Hike up to the stupa for a stunning view of the lake and city.', time: '14:00', iconName: 'Landmark' },
      { title: 'Paragliding Adventure', description: 'Soar over the valley with the mountains as your backdrop.', time: '09:00', iconName: 'Wind' }
    ]
  },
  {
    id: 'd49',
    name: 'Thimphu',
    location: 'Bhutan',
    image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520769945061-0a448c463865?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['cultural', 'serene', 'minimalist'],
    priceBand: 'luxury',
    priceINR: 130000,
    travelHours: 5,
    description: 'The capital of Bhutan, a unique blend of modern development and ancient tradition.',
    rationale: 'Because you appreciate serene cultural heritage and minimalist traditional beauty.',
    bestDuration: '3-4 Days',
    lat: 27.4728,
    lng: 89.6393,
    travelerInsights: [
      { type: 'do', content: 'Visit the Buddha Dordenma (Great Buddha Dordenma) for a view of the valley.' },
      { type: 'dont', content: 'Don\'t miss the Tashichho Dzong, a massive fortress and monastery.' },
      { type: 'tip', content: 'Explore the local crafts at the National Institute for Zorig Chusum.' }
    ],
    socialMediaPosts: [
      { id: 'sth-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/thimphu/', thumbnail: 'https://images.unsplash.com/photo-1578516123433-503d6c29bebc?auto=format&fit=crop&w=400&q=80', author: '@bhutan_explorer', caption: 'The serene capital of Bhutan. 🇧🇹✨' }
    ],
    popularActivities: [
      { title: 'Buddha Dordenma', description: 'Visit the gigantic golden Buddha statue overlooking the valley.', time: '10:00', iconName: 'Landmark' },
      { title: 'Memorial Chorten', description: 'Join the locals in circumambulating the sacred stupa.', time: '08:30', iconName: 'Landmark' },
      { title: 'Tashichho Dzong', description: 'Explore the impressive fortress and administrative center.', time: '16:30', iconName: 'History' },
      { title: 'Motithang Takin Preserve', description: 'See the unique national animal of Bhutan.', time: '14:00', iconName: 'Wind' }
    ]
  },
  {
    id: 'd50',
    name: 'Colombo',
    location: 'Sri Lanka',
    image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['vibrant', 'cultural', 'nocturnal'],
    priceBand: 'moderate',
    priceINR: 45000,
    travelHours: 4,
    description: 'A bustling port city with a mix of modern skyscrapers and colonial-era buildings.',
    rationale: 'Because you enjoy vibrant urban energy and layered cultural history.',
    bestDuration: '2-3 Days',
    lat: 6.9271,
    lng: 79.8612,
    travelerInsights: [
      { type: 'do', content: 'Explore the Pettah Market for a sensory overload.' },
      { type: 'dont', content: 'Don\'t miss the sunset at Galle Face Green.' },
      { type: 'tip', content: 'Visit the Gangaramaya Temple, one of the most important temples in Colombo.' }
    ],
    socialMediaPosts: [
      { id: 'scol-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/colombo/', thumbnail: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=400&q=80', author: '@srilanka_travel', caption: 'Colombo city vibes. 🇱🇰✨' }
    ],
    popularActivities: [
      { title: 'Galle Face Green', description: 'Enjoy the ocean breeze and street food at sunset.', time: '17:30', iconName: 'Waves' },
      { title: 'Gangaramaya Temple', description: 'Visit the eclectic Buddhist temple with its vast collection of artifacts.', time: '10:00', iconName: 'Landmark' },
      { title: 'Pettah Floating Market', description: 'Explore the unique market built on a canal.', time: '15:00', iconName: 'ShoppingBag' },
      { title: 'National Museum', description: 'Discover the rich history and heritage of Sri Lanka.', time: '11:00', iconName: 'History' }
    ]
  },
  {
    id: 'd51',
    name: 'Pune',
    location: 'Maharashtra, India',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['vibrant', 'cultural', 'nocturnal'],
    priceBand: 'moderate',
    priceINR: 12000,
    travelHours: 3,
    description: 'The cultural capital of Maharashtra, known for its educational institutions and history.',
    rationale: 'Because you enjoy vibrant urban life mixed with rich cultural heritage.',
    bestDuration: '2-4 Days',
    lat: 18.5204,
    lng: 73.8567,
    travelerInsights: [
      { type: 'do', content: 'Visit the Shaniwar Wada, a historic fortification.' },
      { type: 'dont', content: 'Don\'t miss the Osho International Meditation Resort for a unique experience.' },
      { type: 'tip', content: 'Try the local Misal Pav and Vada Pav for an authentic taste.' }
    ],
    socialMediaPosts: [
      { id: 'spun-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/pune/', thumbnail: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=400&q=80', author: '@pune_diaries', caption: 'The cultural capital of Maharashtra. 🏰✨' }
    ],
    popularActivities: [
      { title: 'Shaniwar Wada', description: 'Explore the historic seat of the Peshwas.', time: '10:00', iconName: 'Landmark' },
      { title: 'Aga Khan Palace', description: 'Visit the grand palace with its beautiful gardens and history.', time: '11:30', iconName: 'History' },
      { title: 'Osho International Resort', description: 'Experience meditation and tranquility in the lush campus.', time: '09:00', iconName: 'Wind' },
      { title: 'Sinhagad Fort Trek', description: 'Hike up to the historic fortress for panoramic views.', time: '06:00', iconName: 'Mountain' }
    ]
  },
  {
    id: 'd52',
    name: 'Gurgaon',
    location: 'Haryana, India',
    image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['vibrant', 'nocturnal', 'luxurious'],
    priceBand: 'moderate',
    priceINR: 15000,
    travelHours: 1,
    description: 'A leading financial and industrial hub with modern skyscrapers and luxury malls.',
    rationale: 'Because you thrive in vibrant, high-tech urban environments with luxury amenities.',
    bestDuration: '2-3 Days',
    lat: 28.4595,
    lng: 77.0266,
    travelerInsights: [
      { type: 'do', content: 'Explore the Cyber Hub for a wide range of dining and entertainment options.' },
      { type: 'dont', content: 'Don\'t miss the Kingdom of Dreams for a cultural extravaganza.' },
      { type: 'tip', content: 'Visit the Sultanpur National Park for a peaceful bird-watching experience.' }
    ],
    socialMediaPosts: [
      { id: 'sgur-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/gurgaon/', thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=400&q=80', author: '@millennium_city', caption: 'The skyline of Gurgaon. 🏙️✨' }
    ],
    popularActivities: [
      { title: 'Cyber Hub Dining', description: 'Experience a wide range of international cuisines and bars.', time: '19:00', iconName: 'Utensils' },
      { title: 'Kingdom of Dreams', description: 'Watch a grand Bollywood-style musical or cultural show.', time: '17:00', iconName: 'History' },
      { title: 'Leisure Valley Park', description: 'A green escape in the middle of the high-rise city.', time: '08:00', iconName: 'Wind' },
      { title: 'Ambience Mall Shopping', description: 'Explore one of the largest luxury malls in India.', time: '11:00', iconName: 'ShoppingBag' }
    ]
  },
  {
    id: 'd53',
    name: 'Chandigarh',
    location: 'Punjab & Haryana, India',
    image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['minimalist', 'serene', 'vibrant'],
    priceBand: 'moderate',
    priceINR: 12000,
    travelHours: 1,
    description: 'A planned city known for its modern architecture and urban design.',
    rationale: 'Because you appreciate minimalist urban design and serene city life.',
    bestDuration: '2-3 Days',
    lat: 30.7333,
    lng: 76.7794,
    travelerInsights: [
      { type: 'do', content: 'Visit the Rock Garden, a unique sculpture garden made from recycled materials.' },
      { type: 'dont', content: 'Don\'t miss the sunset at Sukhna Lake.' },
      { type: 'tip', content: 'Explore the Capitol Complex, a UNESCO World Heritage site designed by Le Corbusier.' }
    ],
    socialMediaPosts: [
      { id: 'scha-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/chandigarh/', thumbnail: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=400&q=80', author: '@chandigarh_vibes', caption: 'The beauty of Chandigarh. 🏙️✨' }
    ],
    popularActivities: [
      { title: 'Rock Garden', description: 'Explore the unique sculpture garden made from recycled materials.', time: '10:00', iconName: 'History' },
      { title: 'Sukhna Lake Boating', description: 'Enjoy a peaceful boat ride at the foot of the Shivalik hills.', time: '17:00', iconName: 'Waves' },
      { title: 'Rose Garden', description: 'Visit Asia\'s largest botanical garden dedicated to roses.', time: '09:00', iconName: 'Flower' },
      { title: 'Capitol Complex', description: 'Discover the UNESCO-listed architecture of Le Corbusier.', time: '11:30', iconName: 'Landmark' }
    ]
  },
  {
    id: 'd54',
    name: 'Mussoorie',
    location: 'Uttarakhand, India',
    image: 'https://images.unsplash.com/photo-1598977123418-45454503889a?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1598977123418-45454503889a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1614589255823-3802996964c0?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'nostalgic', 'rugged'],
    priceBand: 'moderate',
    priceINR: 18000,
    travelHours: 6,
    description: 'The Queen of the Hills, a popular hill station with colonial charm.',
    rationale: 'Because you crave serene mountain vistas and nostalgic colonial charm.',
    bestDuration: '3-4 Days',
    lat: 30.4598,
    lng: 78.0644,
    travelerInsights: [
      { type: 'do', content: 'Take a walk on the Mall Road for shopping and local snacks.' },
      { type: 'dont', content: 'Don\'t miss the Kempty Falls, but go early to avoid the crowds.' },
      { type: 'tip', content: 'Visit Landour for a more peaceful and nostalgic experience.' }
    ],
    socialMediaPosts: [
      { id: 'smus-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/mussoorie/', thumbnail: 'https://images.unsplash.com/photo-1598977123418-45454503889a?auto=format&fit=crop&w=400&q=80', author: '@queen_of_hills', caption: 'Mussoorie: A nostalgic hill station. 🏔️✨' }
    ],
    popularActivities: [
      { title: 'Kempty Falls', description: 'Enjoy the refreshing waterfall in the scenic valley.', time: '10:00', iconName: 'Waves' },
      { title: 'Gun Hill Viewpoint', description: 'Take a cable car ride for a panoramic view of the Himalayas.', time: '16:00', iconName: 'Mountain' },
      { title: 'Mall Road Walk', description: 'Explore the vibrant shops and local eateries.', time: '18:00', iconName: 'ShoppingBag' },
      { title: 'Landour Exploration', description: 'Visit the quiet and nostalgic sister town of Mussoorie.', time: '11:00', iconName: 'History' }
    ]
  },
  {
    id: 'd55',
    name: 'Nainital',
    location: 'Uttarakhand, India',
    image: 'https://images.unsplash.com/photo-1598977123418-45454503889a?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1598977123418-45454503889a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1614589255823-3802996964c0?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'nostalgic', 'rugged'],
    priceBand: 'moderate',
    priceINR: 18000,
    travelHours: 7,
    description: 'A popular hill station set around a pear-shaped lake.',
    rationale: 'Because you seek serene lakeside relaxation and nostalgic mountain charm.',
    bestDuration: '3-4 Days',
    lat: 29.3919,
    lng: 79.4542,
    travelerInsights: [
      { type: 'do', content: 'Take a boat ride on Naini Lake.' },
      { type: 'dont', content: 'Don\'t miss the view from Tiffin Top (Dorothy\'s Seat).' },
      { type: 'tip', content: 'Explore the local markets for handmade candles and woolens.' }
    ],
    socialMediaPosts: [
      { id: 'snai-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/nainital/', thumbnail: 'https://images.unsplash.com/photo-1598977123418-45454503889a?auto=format&fit=crop&w=400&q=80', author: '@nainital_diaries', caption: 'Lakeside serenity in Nainital. 🌊✨' }
    ],
    popularActivities: [
      { title: 'Naini Lake Boating', description: 'Peaceful boat ride on the pear-shaped lake.', time: '10:00', iconName: 'Waves' },
      { title: 'Tiffin Top View', description: 'Hike up for a breathtaking view of the Himalayas.', time: '08:00', iconName: 'Mountain' },
      { title: 'Naina Devi Temple', description: 'Visit the sacred temple on the shores of the lake.', time: '11:30', iconName: 'Landmark' },
      { title: 'Snow View Point', description: 'Take a ropeway ride for a stunning view of the snow-capped peaks.', time: '15:00', iconName: 'Mountain' }
    ]
  },
  {
    id: 'd56',
    name: 'Kodaikanal',
    location: 'Tamil Nadu, India',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&w=1200&q=80'
    ],
    vibes: ['serene', 'unplugged', 'rugged'],
    priceBand: 'moderate',
    priceINR: 22000,
    travelHours: 8,
    description: 'The Princess of Hill Stations, known for its mist-covered hills and lakes.',
    rationale: 'Because you crave serene, mist-covered landscapes to unplug and relax.',
    bestDuration: '3-5 Days',
    lat: 10.2381,
    lng: 77.4892,
    travelerInsights: [
      { type: 'do', content: 'Take a walk around the Kodaikanal Lake.' },
      { type: 'dont', content: 'Don\'t miss the view from Coaker\'s Walk.' },
      { type: 'tip', content: 'Visit the Bryant Park for a beautiful display of flowers.' }
    ],
    socialMediaPosts: [
      { id: 'skod-1', platform: 'instagram', url: 'https://www.instagram.com/explore/tags/kodaikanal/', thumbnail: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=400&q=80', author: '@princess_of_hills', caption: 'Mist-covered hills of Kodaikanal. 🏔️✨' }
    ],
    popularActivities: [
      { title: 'Kodai Lake Boating', description: 'Enjoy a peaceful boat ride on the star-shaped lake.', time: '10:00', iconName: 'Waves' },
      { title: 'Coaker\'s Walk', description: 'Scenic pedestrian path with breathtaking valley views.', time: '08:30', iconName: 'Wind' },
      { title: 'Silver Cascade Falls', description: 'Visit the beautiful waterfall on the way to the town.', time: '14:00', iconName: 'Waves' },
      { title: 'Bryant Park', description: 'Explore the botanical garden with its diverse flora.', time: '11:00', iconName: 'Flower' }
    ]
  }
];

export const VIBE_COLORS: Record<string, string> = {
  serene: 'from-blue-900/40 to-teal-900/40',
  vibrant: 'from-orange-900/40 to-pink-900/40',
  mysterious: 'from-purple-900/40 to-indigo-950/40',
  rugged: 'from-stone-900/40 to-orange-950/40',
  minimalist: 'from-slate-900/40 to-zinc-800/40',
  luxurious: 'from-amber-900/40 to-yellow-950/40',
  unplugged: 'from-emerald-900/40 to-green-950/40',
  cultural: 'from-red-900/40 to-brown-900/40',
  nocturnal: 'from-indigo-950 to-slate-950',
  nostalgic: 'from-sepia-900/40 to-orange-900/40',
  futuristic: 'from-cyan-900/40 to-blue-900/40',
  bohemian: 'from-amber-900/40 to-rose-900/40',
  cinematic: 'from-zinc-900/40 to-slate-900/40',
  ethereal: 'from-sky-900/40 to-indigo-900/40',
  default: 'from-zinc-950 to-black'
};
