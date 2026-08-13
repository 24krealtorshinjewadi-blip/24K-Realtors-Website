// Auto-clear stale mock database from localStorage if it contains old demo data, stale Megapolis listings or lacks v2026_megapolis_single_v5
try {
  const mockAgentsStr = localStorage.getItem('mock_agents');
  const mockPropsStr = localStorage.getItem('mock_properties');
  if (
    (mockAgentsStr && mockAgentsStr.includes('Amit Verma')) || 
    (mockPropsStr && (!mockPropsStr.includes('v2026_megapolis_single_v5') || mockPropsStr.includes('Megapolis Splendour') || mockPropsStr.includes('s3.ap-south-1.amazonaws.com/properties/megapolis-sunway/')))
  ) {
    console.info('[Cache Bust] Resetting stale localStorage keys to load fresh database updates...');
    localStorage.removeItem('mock_agents');
    localStorage.removeItem('mock_leads');
    localStorage.removeItem('mock_tasks');
    localStorage.removeItem('mock_properties');
    localStorage.removeItem('mock_societies');
  }
} catch (e) {
  console.error('[Cache Bust] Failed to inspect/clear localStorage', e);
}

const RAILWAY_API = 'https://twentyfourk-backend-production.up.railway.app/api/v1';

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const isProduction = !hostname.includes('localhost') && 
                       !hostname.includes('127.0.0.1') &&
                       !hostname.startsWith('192.168.') &&
                       !hostname.startsWith('10.') &&
                       !hostname.startsWith('172.');

  // Auto-clear stale LAN/localhost saved API URLs when on production
  const customUrl = localStorage.getItem('API_BASE_URL');
  if (customUrl && isProduction) {
    const isStale = customUrl.includes('192.168.') || 
                    customUrl.includes('localhost') || 
                    customUrl.includes('127.0.0.1') ||
                    customUrl.includes('10.0.') ||
                    customUrl.includes('172.');
    if (isStale) {
      console.info('[API] Clearing stale LAN API URL from localStorage. Using Railway production API.');
      localStorage.removeItem('API_BASE_URL');
    } else {
      return customUrl; // Valid custom production URL override
    }
  } else if (customUrl && !isProduction) {
    return customUrl; // Respect custom URL in local dev
  }

  // Local dev: use localhost Spring Boot
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8080/api/v1';
  }
  // Local network IP: derive from hostname
  if (hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
    return `http://${hostname}:8080/api/v1`;
  }
  // Production (Vercel): always use Railway cloud API
  return RAILWAY_API;
};

const BASE_URL = getApiBaseUrl();

// ─── Railway Keep-Alive ─────────────────────────────────────────────────────
// Prevents Railway container from sleeping (free tier sleeps after ~5 min)
const IS_PRODUCTION = !window.location.hostname.includes('localhost') &&
                      !window.location.hostname.includes('127.0.0.1') &&
                      !window.location.hostname.startsWith('192.168.');

if (IS_PRODUCTION) {
  const pingRailway = () => {
    fetch(`${RAILWAY_API}/properties?page=0&size=1`, { method: 'GET', cache: 'no-store' })
      .then(() => console.info('[Keep-Alive] Railway backend pinged ✓'))
      .catch(() => console.warn('[Keep-Alive] Railway ping failed'));
  };
  // Immediate ping on load, then every 8 minutes
  setTimeout(pingRailway, 500);
  setInterval(pingRailway, 8 * 60 * 1000);
}

// ─── In-Memory Properties Cache ────────────────────────────────────────────
// Serves cached data instantly on tab revisit, avoids cold-start delay
const _propertiesCache = {
  data: null,
  timestamp: 0,
  TTL: 5 * 60 * 1000, // 5 minutes
  isValid() { return this.data && (Date.now() - this.timestamp < this.TTL); },
  set(data) { this.data = data; this.timestamp = Date.now(); },
  get() { return this.isValid() ? this.data : null; },
  invalidate() { this.data = null; this.timestamp = 0; },
};


// Helper to retrieve JWT token and construct authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// --- LOCAL BROWSER-BASED DATABASE SIMULATION (OFFLINE FALLBACK) ---
const initialProperties = [
  {
    id: "prop-1",
    title: "24K Opula Premium 3 BHK",
    description: "Luxurious residential apartments with modular kitchens, located on Baner-Balewadi Link Road, close to prime IT corridors. Features premium marble flooring, spacious decks, and piped gas connection.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 14500000,
    areaSquareFeet: 1650,
    location: "BANER",
    address: "Baner-Balewadi Link Road, near Balewadi High Street, Pune",
    latitude: 18.5590,
    longitude: 73.7868,
    bedrooms: 3,
    bathrooms: 3,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "RERA-PUN-PRM-24K091",
    imageUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/24k-opula/opula_main_s3_hero.png",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "FULLY_FURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-2",
    title: "24K Altura Smart 2 BHK",
    description: "Modern apartments with smart automation, located in the heart of Wakad, near Datta Mandir road, offering excellent connectivity. Equipped with modular fittings and direct pipeline gas.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 8200000,
    areaSquareFeet: 1100,
    location: "WAKAD",
    address: "Datta Mandir Road, Wakad, Pune",
    latitude: 18.5987,
    longitude: 73.7707,
    bedrooms: 2,
    bathrooms: 2,
    status: "AVAILABLE",
    verifiedListing: true,
    reraNumber: "RERA-PUN-PRM-24K074",
    imageUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/gallery/lodha_2_mid_construction.png",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-3",
    title: "Hinjewadi IT Plaza Office Space",
    description: "Plug-and-play commercial space in Hinjewadi Phase 1, fully furnished with conference rooms, cabins, and cafeteria access. Excellent location inside Rajiv Gandhi IT Park.",
    propertyType: "COMMERCIAL",
    transactionType: "RENT",
    price: 250000,
    areaSquareFeet: 4500,
    location: "HINJEWADI",
    address: "Phase 1, Rajiv Gandhi Infotech Park, Hinjewadi, Pune",
    latitude: 18.5913,
    longitude: 73.7389,
    bedrooms: 0,
    bathrooms: 4,
    status: "AVAILABLE",
    verifiedListing: true,
    noBrokerage: true,
    reraNumber: "RERA-PUN-PRM-24K118",
    imageUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/gallery/lodha_4_grand_lobby.png",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "FULLY_FURNISHED",
    gasPipeline: false,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-4",
    title: "Balewadi High Street Retail Showroom",
    description: "Prime retail space on Balewadi High Street, offering high footfall, dual frontage, and premium glass architecture. Ideal for boutique or luxury brand outlet.",
    propertyType: "COMMERCIAL",
    transactionType: "RENT",
    price: 18000,
    areaSquareFeet: 1800,
    location: "BALEWADI",
    address: "Balewadi High Street, Balewadi, Pune",
    latitude: 18.5779,
    longitude: 73.7816,
    bedrooms: 0,
    bathrooms: 2,
    status: "AVAILABLE",
    noBrokerage: true,
    reraNumber: "RERA-PUN-PRM-24K085",
    imageUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/gallery/lodha_6_italian_kitchen.png",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "UNFURNISHED",
    gasPipeline: false,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-5",
    title: "24K Glitterati Elite 4 BHK Penthouse",
    description: "Super-spacious ultra-luxury penthouse with private deck, panoramic views, and premium automation fittings in Tathawade. Includes piped gas connection and Italian modular setup.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 19500000,
    areaSquareFeet: 2800,
    location: "TATHAWADE",
    address: "Tathawade Road, near D.Y. Patil University, Pune",
    latitude: 18.6225,
    longitude: 73.7547,
    bedrooms: 4,
    bathrooms: 4,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "RERA-PUN-PRM-24K041",
    imageUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_5_sky_pool.png",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "FULLY_FURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-6",
    title: "Baner Corporate Tower Studio",
    description: "Premium corporate desk workspace office studio unit, ideal for startups and consultancy services. Centrally located on Baner High Street.",
    propertyType: "COMMERCIAL",
    transactionType: "BUY",
    price: 12500000,
    areaSquareFeet: 950,
    location: "BANER",
    address: "Main Baner Road, near Pan Card Club Road, Pune",
    latitude: 18.5620,
    longitude: 73.7820,
    bedrooms: 0,
    bathrooms: 1,
    status: "AVAILABLE",
    noBrokerage: true,
    reraNumber: "RERA-PUN-PRM-24K199",
    imageUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_6_grand_lobby.png",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: false,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-7",
    title: "24K Mahalunge Oasis 3 BHK",
    description: "Premium apartments featuring state-of-the-art ventilation, modular configurations, and scenic views in Mahalunge. Complete with private amenities and gas connection.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 11000000,
    areaSquareFeet: 1400,
    location: "MAHALUNGE",
    address: "Near Nande-Balewadi Road, Mahalunge, Pune",
    latitude: 18.5830,
    longitude: 73.7490,
    bedrooms: 3,
    bathrooms: 3,
    status: "AVAILABLE",
    verifiedListing: true,
    noBrokerage: true,
    reraNumber: "RERA-PUN-PRM-24K212",
    imageUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/gallery/lodha_8_clubhouse_gardens.png",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "FULLY_FURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-8",
    title: "Megapolis 150-Acre Township — 2 & 3 BHK",
    description: "Pune's largest integrated 150-acre township in Hinjewadi Phase 3, crafted by Marvel Realtors. Megapolis offers a self-sustained ecosystem with over 60 world-class amenities, resort-style infinity pools, 5-star grand clubhouse, dedicated sports arenas, panoramic Sahyadri views, and direct walkability to India's largest IT corridor. Offering premium 2 BHK & 3 BHK residences with Italian marble flooring, modular kitchens, piped gas, and RERA-certified clean title.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 8500000,
    areaSquareFeet: 1050,
    location: "HINJEWADI",
    address: "Megapolis Township, Phase 3, Hinjewadi, Pune — 411057",
    latitude: 18.5919,
    longitude: 73.7025,
    bedrooms: 2,
    bathrooms: 2,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "RERA-PUN-PRM-24K301",
    versionTag: "v2026_megapolis_single_v5",
    possessionDate: "Ready to Move",
    imageUrl: "/properties/megapolis-sunway/01_aerial_hero.png",
    videoUrl: null,
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: true,
    amenities: [
      "5-Star Grand Clubhouse",
      "Resort-Style Infinity Pool",
      "Technogym Fitness Studio",
      "Badminton & Squash Courts",
      "Children Dedicated Play Zone",
      "Landscaped Central Park",
      "24/7 Concierge Desk",
      "Underground Parking",
      "Jogging & Cycling Track",
      "Solar-Powered Common Areas",
      "EV Charging Stations",
      "Multi-Purpose Hall"
    ],
    slideshowImages: [
      "/properties/megapolis-sunway/01_aerial_hero.png",
      "/properties/megapolis-sunway/02_architecture.png",
      "/properties/megapolis-sunway/03_landscape.png",
      "/properties/megapolis-sunway/04_living_room.png",
      "/properties/megapolis-sunway/05_balcony_view.png",
      "/properties/megapolis-sunway/06_master_bedroom.png",
      "/properties/megapolis-sunway/07_kitchen.png",
      "/properties/megapolis-sunway/08_clubhouse.png",
      "/properties/megapolis-sunway/09_swimming_pool.png",
      "/properties/megapolis-sunway/10_gym.png",
      "/properties/megapolis-sunway/11_garden_kids.png",
      "/properties/megapolis-sunway/12_lobby.png",
      "/properties/megapolis-sunway/13_location_map.png",
      "/properties/megapolis-sunway/14_connectivity_map.png",
      "/properties/megapolis-sunway/15_night_township.png"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-9",
    title: "Godrej Elements Luxury 2 BHK",
    description: "Modern premium fully-furnished 2 BHK apartment in Godrej Elements, Hinjewadi Phase 1. Features high-end woodwork, smart home automation, modular kitchen, piped gas, and premium accessories.",
    propertyType: "RESIDENTIAL",
    transactionType: "RENT",
    price: 28000,
    areaSquareFeet: 1150,
    location: "HINJEWADI",
    address: "Godrej Elements, Phase 1, Hinjewadi, Pune",
    latitude: 18.5955,
    longitude: 73.7380,
    bedrooms: 2,
    bathrooms: 2,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "RERA-PUN-PRM-24K302",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "FULLY_FURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-10",
    title: "TCG The Crown Greens 3 BHK",
    description: "Spacious semi-furnished 3 BHK flat in TCG The Crown Greens, Hinjewadi Phase 2, right next to Embassy Techzone. Boasts three large balconies, modular kitchen, and double parking slots.",
    propertyType: "RESIDENTIAL",
    transactionType: "RENT",
    price: 38000,
    areaSquareFeet: 1550,
    location: "HINJEWADI",
    address: "TCG The Crown Greens, Phase 2, Hinjewadi, Pune",
    latitude: 18.5872,
    longitude: 73.7251,
    bedrooms: 3,
    bathrooms: 3,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "RERA-PUN-PRM-24K303",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-11",
    title: "Kasturi Apostle Signature 4 BHK",
    description: "Ultra-luxury expansive 4 BHK residential apartments in Kasturi Apostle, Baner, Pune. Close to Balewadi High Street. Top tier marble fittings and private pool deck.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 22500000,
    areaSquareFeet: 3100,
    location: "BANER",
    address: "Apostle Baner, near Balewadi High Street, Pune",
    latitude: 18.5680,
    longitude: 73.7850,
    bedrooms: 4,
    bathrooms: 4,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "RERA-PUN-PRM-24K304",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "FULLY_FURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-12",
    title: "Kolte Patil Life Republic 3 BHK",
    description: "Premium cozy 3 BHK flat in Kolte Patil Life Republic, Hinjewadi, Pune. Excellent landscaped gardens, luxury modular setup, and 100% power backup.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 10500000,
    areaSquareFeet: 1450,
    location: "HINJEWADI",
    address: "Life Republic Township, Hinjewadi-Marunji, Pune",
    latitude: 18.6015,
    longitude: 73.7120,
    bedrooms: 3,
    bathrooms: 3,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "RERA-PUN-PRM-24K305",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-13",
    title: "Gera Joy on the Banks 2 BHK",
    description: "Brand new kid-centric 2 BHK luxury apartment in Gera Joy on the Banks, Wakad, Pune. Offers high-end automation, central clubhouse access, and safety gates.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 8800000,
    areaSquareFeet: 1020,
    location: "WAKAD",
    address: "Joy on the Banks, Wakad, Pune",
    latitude: 18.5970,
    longitude: 73.7660,
    bedrooms: 2,
    bathrooms: 2,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "RERA-PUN-PRM-24K306",
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "UNFURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-14",
    title: "Pride Purple Park Landmark 3 BHK",
    description: "Spacious 3 BHK signature residence at Pride Purple Park Landmark, Baner. Features premium Italian marble flooring, false ceiling, and large master bedroom layout.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 15500000,
    areaSquareFeet: 1600,
    location: "BANER",
    address: "Park Landmark, Baner, Pune",
    latitude: 18.5610,
    longitude: 73.7845,
    bedrooms: 3,
    bathrooms: 3,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "RERA-PUN-PRM-24K307",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "FULLY_FURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-15",
    title: "Panchshil Towers Luxury 3 BHK",
    description: "Ultra-luxury 3 BHK apartment in Panchshil Towers, Kharadi. Features contemporary architecture, VRF air conditioning, modular designer kitchen, three side open views, and concierge services.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 24500000,
    areaSquareFeet: 2150,
    location: "KHARADI",
    address: "Panchshil Towers, Kharadi, Pune — 411014",
    latitude: 18.5520,
    longitude: 73.9480,
    bedrooms: 3,
    bathrooms: 3,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "RERA-PUN-PRM-24K308",
    possessionDate: "Ready to Move",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    videoUrl: null,
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "FULLY_FURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-16",
    title: "Kohinoor Sportsville Active 3 BHK",
    description: "Premium sport-centric 3 BHK apartment in Kohinoor Sportsville, Hinjewadi Phase 2. Features international amenities, open landscape, and clean title.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 11200000,
    areaSquareFeet: 1350,
    location: "HINJEWADI",
    address: "Kohinoor Sportsville, Phase 2, Hinjewadi, Pune",
    latitude: 18.5895,
    longitude: 73.7290,
    bedrooms: 3,
    bathrooms: 3,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "RERA-PUN-PRM-24K309",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "UNFURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-17",
    title: "VTP Blue Waters Modern 2 BHK",
    description: "Modern smart 2 BHK flat in VTP Blue Waters (Aers & Leon), Mahalunge-Baner, Pune. Riverfront views, modular layout, and excellent highway connectivity.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 7800000,
    areaSquareFeet: 900,
    location: "MAHALUNGE",
    address: "VTP Blue Waters, Mahalunge, Pune",
    latitude: 18.5790,
    longitude: 73.7470,
    bedrooms: 2,
    bathrooms: 2,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: false,
    reraNumber: "RERA-PUN-PRM-24K310",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-18",
    title: "Shapoorji Joyville Premium 2 BHK",
    description: "State-of-the-art 2 BHK residential apartment at Joyville by Shapoorji Pallonji, Hinjewadi Phase 1. Features high-speed elevators, premium styling, and absolute security.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 8400000,
    areaSquareFeet: 990,
    location: "HINJEWADI",
    address: "Joyville Hinjewadi, Near Phase 1 IT Park, Pune",
    latitude: 18.5990,
    longitude: 73.7420,
    bedrooms: 2,
    bathrooms: 2,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "RERA-PUN-PRM-24K311",
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "UNFURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-19",
    title: "Vilas Javdekar Yashwin 3 BHK",
    description: "Eco-friendly luxury 3 BHK apartment at Vilas Javdekar Yashwin, Wakad. Offers modular dry balcony setup, robust design, and children play zones.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 9800000,
    areaSquareFeet: 1280,
    location: "WAKAD",
    address: "Yashwin Wakad, near highway exit, Wakad, Pune",
    latitude: 18.5940,
    longitude: 73.7630,
    bedrooms: 3,
    bathrooms: 3,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: false,
    reraNumber: "RERA-PUN-PRM-24K312",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-20",
    title: "Lodha Belmondo Golf Luxury Villa",
    description: "Premium ultra-luxurious 4 BHK villa at Lodha Belmondo, Tathawade highway corridor, overlooking the golf course. Features private gardens, premium security, and absolute elite privacy.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 37500000,
    areaSquareFeet: 4200,
    location: "TATHAWADE",
    address: "Lodha Belmondo, Pune-Mumbai Expressway, Pune",
    latitude: 18.6410,
    longitude: 73.6820,
    bedrooms: 4,
    bathrooms: 4,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "RERA-PUN-PRM-24K313",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "FULLY_FURNISHED",
    gasPipeline: false,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-21",
    title: "Godrej Ivara Kharadi",
    description: "Welcome to Godrej Ivara, an exquisite township coming up in Central Kharadi, Pune. This 11-tower-strong residential community presents 2 BHK, 3 BHK, and 4 BHK apartments with spacious decks offering beautiful panoramic views. The apartments in this enclave are designed to harness maximum space, sunlight, and air flow. From lavish flooring to branded fittings, this project offers the means for an indulgent lifestyle. It also presents a set of thoughtfully curated amenities, including a 100,000 sq. ft. clubhouse, 10,000 sq. ft. gymnasium, forest lounge, swimming pool, jogging track, indoor games room, co-working space, and more.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 11700000,
    areaSquareFeet: 1650,
    location: "KHARADI",
    address: "Upper Kharadi Main Rd, Wagholi, Haveli, Pune, Maharashtra 400079",
    latitude: 18.5525,
    longitude: 73.9535,
    bedrooms: 3,
    bathrooms: 3,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "PR1260002502426",
    imageUrl: "/luxury_sunset_tower.png",
    slideshowImages: [
      "/luxury_sunset_pool.png",
      "/luxury_sunset_tower.png",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85"
    ],
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "UNFURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    configurations: [
      { name: "2 BHK Premium", area: "725 - 750 sq.ft", price: "₹1.17 Cr", status: "Selling Fast" },
      { name: "3 BHK Elite", area: "875 - 900 sq.ft", price: "₹1.49 Cr", status: "Available" },
      { name: "3 BHK Regal", area: "975 - 1000 sq.ft", price: "₹1.69 Cr", status: "Selling Fast" },
      { name: "3 BHK Ultra", area: "1100 - 1150 sq.ft", price: "₹1.95 Cr", status: "Premium Units" },
      { name: "3 BHK Opulent", area: "1200 - 1250 sq.ft", price: "₹2.19 Cr", status: "Premium Units" },
      { name: "4 BHK Iconic", area: "1550 - 1650 sq.ft", price: "₹2.89 Cr", status: "Exclusive Launch" }
    ],
    specificAmenities: [
      "100,000 sq.ft Club Forest",
      "10,000 sq.ft Gymnasium",
      "Infinity Swimming Pool",
      "Forest Lounge Zone",
      "Jogging & Cycling Track",
      "Indoor Video Games Room",
      "Co-working Space Lounge",
      "Landscaped Zen Gardens",
      "Child-Centric Sports Center",
      "24/7 Security & CCTV Grid"
    ]
  },
  {
    id: "prop-22",
    title: "Shapoorji Pallonji Joyville Vyomora",
    description: "Vyomora represents Hinjewadi's premier luxury residential landmark by Shapoorji Pallonji Real Estate. Nestled in a low-density 25-acre integrated development, it features state-of-the-art ventilation, modular configurations, Vaastu-compliant layouts, and biometric safety door access. Residents enjoy an expansive 25,454 sq ft grand clubhouse, Miyawaki forest gardens, panic alarm systems, and high-speed elevator access close to the upcoming Pune Metro line.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 8400000,
    areaSquareFeet: 1477,
    location: "HINJEWADI",
    address: "Joyville Sensorium, Near Phase 1 IT Park, Hinjewadi, Pune",
    latitude: 18.5995,
    longitude: 73.7425,
    bedrooms: 3,
    bathrooms: 3,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "MahaRERA: PR1260002600999",
    builderName: "Shapoorji Pallonji Real Estate",
    possessionDate: "Dec 2028",
    projectArea: "12.5 Acres",
    imageUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_hero_facade.png",
    slideshowImages: [
      "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_hero_facade.png",
      "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_master_living.png",
      "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_italian_kitchen.png",
      "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_master_bedroom.png",
      "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_sky_pool.png",
      "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_grand_lobby.png",
      "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/hero.jpg",
      "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/pool.jpg"
    ],
    videoUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_tour.mp4",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "UNFURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    configurations: [
      { name: "2 BHK Luxe", area: "684.91 sq.ft", price: "₹84 Lakhs", status: "Selling Fast" },
      { name: "2 BHK Smart", area: "749.60 sq.ft", price: "₹92 Lakhs", status: "Available" },
      { name: "2 BHK Grande", area: "779.42 sq.ft", price: "₹1.02 Cr", status: "Selling Fast" },
      { name: "2 BHK Royale", area: "838.95 sq.ft", price: "₹1.12 Cr", status: "Premium Units" },
      { name: "3 BHK Select", area: "1051.86 sq.ft", price: "₹1.35 Cr", status: "Limited Release" },
      { name: "3 BHK Elite", area: "1090.72 sq.ft", price: "₹1.45 Cr", status: "Selling Fast" },
      { name: "3 BHK Imperial", area: "1184.47 sq.ft", price: "₹1.60 Cr", status: "Premium Units" },
      { name: "3 BHK Signature Duplex", area: "1477.00 sq.ft", price: "₹1.95 Cr", status: "Exclusive Launch" }
    ],
    specificAmenities: [
      "25,454 sq.ft Grand Clubhouse",
      "Miyawaki Forest Zone",
      "Wellness Clinic",
      "Digital Dome Theater",
      "Cricket Simulator Suite",
      "Video Games Arcade Room",
      "Trampoline & Adventure Park",
      "Spa & Reflexology Path",
      "Lap Pool & Aqua Gym",
      "Library & Co-working Lounge"
    ]
  }
];

const initialLeads = [
  {
    id: "lead-1",
    name: "Rohan Sharma",
    phone: "+919876543210",
    email: "rohan.sharma@gmail.com",
    requirementType: "BUY",
    budgetMin: 12000000,
    budgetMax: 16000000,
    preferredLocation: "BANER",
    status: "NEW",
    notes: "Enquired for 24K Opula. Prefers higher floor, Vaastu compliant.",
    assignedAgentName: "Jyoti Dhale",
    assignedAgentPhone: "+919876543201",
    leadScore: 85,
    createdDate: new Date().toISOString()
  },
  {
    id: "lead-2",
    name: "Priya Patel",
    phone: "+919123456789",
    email: "priya.patel@outlook.com",
    requirementType: "BUY",
    budgetMin: 7500000,
    budgetMax: 9000000,
    preferredLocation: "WAKAD",
    status: "IN_PROGRESS",
    notes: "Interested in 24K Altura. Needs details on home loan tie-ups.",
    assignedAgentName: "Jyoti Jagtap",
    assignedAgentPhone: "+919876543202",
    leadScore: 65,
    createdDate: new Date().toISOString()
  },
  {
    id: "lead-3",
    name: "Vikram Malhotra",
    phone: "+919988776655",
    email: "vikram@techcorp.in",
    requirementType: "CONSULTATION",
    budgetMin: 200000,
    budgetMax: 300000,
    preferredLocation: "HINJEWADI",
    status: "VISITED",
    notes: "Requires commercial workspace for IT team. Visited Tech Center, likes office layout.",
    assignedAgentName: "Yash Murkute",
    assignedAgentPhone: "+919876543203",
    createdDate: new Date().toISOString()
  }
];

const initialBuilders = [
  { id: "builder-1", name: "Pride Purple Group", slug: "pride-purple-group", experienceYears: 20, completedProjectsCount: 35, ongoingProjectsCount: 8, awards: "Best Luxury Developer Pune 2025" },
  { id: "builder-2", name: "Kolte Patil Developers", slug: "kolte-patil-developers", experienceYears: 30, completedProjectsCount: 60, ongoingProjectsCount: 15, awards: "RERA Certified Quality Builder 2024" },
  { id: "builder-3", name: "Gera Developments", slug: "gera-developments", experienceYears: 50, completedProjectsCount: 80, ongoingProjectsCount: 12, awards: "Developer of the Year 2026" }
];

const initialBlogs = [
  {
    id: "blog-1",
    title: "Top 5 Reasons to Invest in Wakad Real Estate",
    slug: "top-5-reasons-to-invest-in-wakad",
    content: "Wakad is rapidly emerging as one of Pune's premier residential corridors. With direct connectivity to the Hinjewadi IT Park, Wakad offers excellent rental yields and steady capital appreciation. In this article, we analyze five major infrastructure projects that will boost Wakad in 2026...",
    coverImageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
    author: "Prasad Kulkarni",
    seoTitle: "Invest in Wakad Real Estate - Top 5 Reasons",
    seoDescription: "Discover why Wakad, Pune is the ideal location for property investment in 2026. Insights on rental yields, IT park proximity, and capital growth.",
    published: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  }
];

const initialSocieties = [
  {
    id: "soc-1",
    name: "24K Opula",
    slug: "24k-opula-baner",
    location: "BANER",
    developer: "Pride Purple Group",
    reraNumber: "RERA-PUN-PRM-24K091",
    projectStatus: "READY_TO_MOVE",
    startingPrice: 14500000,
    possessionDate: "December 2025",
    overview: "Ultra-luxury residential community situated on the Baner-Balewadi Link Road, close to high streets. Designed for prime lifestyles, it features imported marble flooring, custom ceilings, premium bath fixtures, and extensive high-tech security controls.",
    amenities: "Infinity Pool, High-tech Gymnasium, Grand Clubhouse, Concierge Lobby, Italian Marble Finish",
    priceRange: "₹1.45 Cr - ₹3.20 Cr",
    configuration: "3 BHK, 4 BHK Penthouse",
    nearbySchools: "The Orchid School (1.2 km), VIBGYOR High (2.5 km)",
    nearbyHospitals: "Jupiter Hospital (2.0 km), Medipoint Hospital (1.5 km)",
    nearbyItParks: "Hinjewadi Phase 1 (5.0 km), Embassy Tech Zone (8.0 km)",
    nearbyMetro: "Balewadi Metro Station (0.8 km)",
    nearbyMalls: "Westend Mall (3.5 km), Balewadi High Street (0.5 km)",
    googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.33333333333!2d73.7868!3d18.5590!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bec!2sBalewadi%20High%20Street!5e0!3m2!1sen!2sin!4v1625118",
    travelTimeInfo: "Balewadi High Street: 2 mins | Baner Hill: 8 mins | Hinjewadi IT Park: 12 mins | Pune Airport: 40 mins",
    investmentScore: 88,
    rentalYield: 4.2,
    faqs: "Q: Is 24K Opula RERA registered?\nA: Yes, it is fully registered under number RERA-PUN-PRM-24K091.\n\nQ: What is the possession date?\nA: Possession starts in December 2025.",
    seoTitle: "24K Opula Baner - Luxury 3 & 4 BHK Apartments by Pride Purple",
    seoDescription: "Explore 24K Opula on Baner-Balewadi Link Road, Pune. Premium 3 & 4 BHK luxury residences starting from ₹1.45 Cr. View price, configurations, and amenities."
  },
  {
    id: "soc-2",
    name: "24K Altura",
    slug: "24k-altura-wakad",
    location: "WAKAD",
    developer: "Kolte Patil Developers",
    reraNumber: "RERA-PUN-PRM-24K074",
    projectStatus: "UNDER_CONSTRUCTION",
    startingPrice: 8200000,
    possessionDate: "June 2027",
    overview: "Smart high-rise residences with automated temperature, mood lighting controls and skydecks in Wakad. Positioned perfectly near Datta Mandir Road with excellent highway access.",
    amenities: "Sky Lounge, Smart Home Automation, Reflexology Path, Jogging Track, EV Charging Stations",
    priceRange: "₹82 Lakhs - ₹1.40 Cr",
    configuration: "2 BHK, 3 BHK",
    nearbySchools: "EuroSchool Wakad (1.0 km), Akshara International School (1.8 km)",
    nearbyHospitals: "Lifepoint Multispecialty Hospital (2.2 km)",
    nearbyItParks: "Rajiv Gandhi IT Park (4.0 km)",
    nearbyMetro: "Wakad Chowk Metro (1.2 km)",
    nearbyMalls: "Phoenix Mall of the Millennium (1.5 km)",
    googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.44444444444!2d73.7707!3d18.5987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bef!2sWakad!5e0!3m2!1sen!2sin!4v1625118",
    travelTimeInfo: "Phoenix Mall: 5 mins | Hinjewadi Phase 1: 10 mins | Balewadi High Street: 12 mins",
    investmentScore: 82,
    rentalYield: 3.8,
    faqs: "Q: When is the possession of 24K Altura?\nA: The possession is scheduled for June 2027.\n\nQ: Are there EV charging points?\nA: Yes, dedicated EV points are available in visitor and owner parkings.",
    seoTitle: "24K Altura Wakad - Smart 2 & 3 BHK Apartments by Kolte Patil",
    seoDescription: "Book smart 2 & 3 BHK homes at 24K Altura Wakad, Pune. RERA registered high-rise apartments starting from ₹82 Lakhs. Check amenities and floor plans."
  },
  {
    id: "soc-3",
    name: "Kolte Patil Life Republic",
    slug: "kolte-patil-life-republic-hinjewadi",
    location: "HINJEWADI",
    developer: "Kolte Patil Developers",
    reraNumber: "RERA-PUN-PRM-24K305",
    projectStatus: "UNDER_CONSTRUCTION",
    startingPrice: 10500000,
    possessionDate: "December 2028",
    overview: "Sprawling township community in Hinjewadi-Marunji, offering multi-phase premium housing, state-of-the-art sports academies, and scenic green belts.",
    amenities: "Acres of Greenery, Multi-sport Arena, International School, Retail Plaza, Dedicated Fire Station",
    priceRange: "₹1.05 Cr - ₹2.50 Cr",
    configuration: "1 BHK, 2 BHK, 3 BHK, Villas",
    nearbySchools: "Anisha Global School (Township), Crimson Anisha (2.0 km)",
    nearbyHospitals: "Ruby Hall Clinic Hinjewadi (3.5 km)",
    nearbyItParks: "Embassy Techzone (2.0 km), Hinjewadi Phase 2 (3.0 km)",
    nearbyMetro: "Hinjewadi Phase 2 Metro (2.5 km)",
    nearbyMalls: "Grand Highstreet Hinjewadi (2.0 km)",
    googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.55555555555!2d73.7120!3d18.6015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c00!2sHinjewadi!5e0!3m2!1sen!2sin!4v1625118",
    travelTimeInfo: "Embassy Tech Zone: 5 mins | Hinjewadi Phase 3: 10 mins | Wakad highway: 15 mins",
    investmentScore: 91,
    rentalYield: 4.5,
    faqs: "Q: Is it a township?\nA: Yes, it is a fully integrated township spread over 150+ acres.",
    seoTitle: "Kolte Patil Life Republic Hinjewadi - Township Residences",
    seoDescription: "Explore premium 2 & 3 BHK homes at Kolte Patil Life Republic township in Hinjewadi, Pune. High rental demand, starting at ₹1.05 Cr."
  },
  {
    id: "soc-4",
    name: "Gera Joy on the Banks",
    slug: "gera-joy-on-the-banks-wakad",
    location: "WAKAD",
    developer: "Gera Developments",
    reraNumber: "RERA-PUN-PRM-24K306",
    projectStatus: "READY_TO_MOVE",
    startingPrice: 8800000,
    possessionDate: "Immediate",
    overview: "Premium child-centric homes on the river banks, with direct access to physical training academies and custom learning centers.",
    amenities: "Riverview Deck, Child Academy, Olympic Swimming Coach, Tennis Court, Organic Garden",
    priceRange: "₹88 Lakhs - ₹1.75 Cr",
    configuration: "2 BHK, 3 BHK Duplex",
    nearbySchools: "EuroSchool Wakad (0.8 km)",
    nearbyHospitals: "Jupiter Hospital (3.0 km)",
    nearbyItParks: "Hinjewadi Phase 1 (3.5 km)",
    nearbyMetro: "Wakad Metro Station (1.0 km)",
    nearbyMalls: "Phoenix Mall: 1.0 km",
    googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.44444444444!2d73.7660!3d18.5970!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bef!2sWakad!5e0!3m2!1sen!2sin!4v1625118",
    travelTimeInfo: "Phoenix Mall: 3 mins | Balewadi High Street: 10 mins | Hinjewadi IT Park: 8 mins",
    investmentScore: 85,
    rentalYield: 4.1,
    faqs: "Q: What does child-centric mean?\nA: It includes professional coaching for sports, music, and arts inside the gated community.",
    seoTitle: "Gera Joy on the Banks Wakad - Child-Centric Homes by Gera",
    seoDescription: "Book 2 & 3 BHK homes at Gera Joy on the Banks, Wakad. Riverview apartments starting from ₹88 Lakhs with active sports training programs."
  },
  {
    id: "soc-5",
    name: "Shapoorji Pallonji Joyville Vyomora",
    slug: "shapoorji-joyville-vyomora-hinjewadi",
    location: "HINJEWADI",
    developer: "Shapoorji Pallonji Real Estate",
    reraNumber: "MahaRERA: PR1260002600999",
    projectStatus: "NEW_LAUNCH",
    startingPrice: 8400000,
    possessionDate: "June 2029",
    overview: "Vyomora represents Hinjawadi's premier luxury residential landmark by Shapoorji Pallonji Real Estate. Nestled in a low-density 25-acre integrated development, it features state-of-the-art ventilation, modular configurations, Vaastu-compliant layouts, and biometric safety door access. Residents enjoy an expansive 25,454 sq ft grand clubhouse, Miyawaki forest gardens, panic alarm systems, and high-speed elevator access close to the upcoming Pune Metro line.",
    amenities: "25,454 sq.ft Grand Clubhouse, Miyawaki Forest Zone, Wellness Clinic, Digital Dome Theater, Cricket Simulator Suite, Video Games Arcade Room, Trampoline & Adventure Park, Spa & Reflexology Path, Infinity Swimming Pool, Library & Co-working Lounge",
    priceRange: "₹84 Lakhs - ₹1.95 Cr",
    configuration: "2 BHK Luxe, 2 BHK Smart, 2 BHK Grande, 2 BHK Royale, 3 BHK Select, 3 BHK Elite, 3 BHK Imperial, 3 BHK Signature Duplex",
    nearbySchools: "Mercedes-Benz International School (1.5 km), Blue Ridge Public School (2.5 km)",
    nearbyHospitals: "Ruby Hall Clinic Hinjewadi (3.0 km)",
    nearbyItParks: "Rajiv Gandhi IT Park (1.0 km), Embassy Tech Zone (3.0 km)",
    nearbyMetro: "Hinjewadi Phase 1 Metro (1.2 km)",
    nearbyMalls: "Grand Highstreet Hinjewadi (2.5 km)",
    googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.55555555555!2d73.7425!3d18.5995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c00!2sHinjewadi!5e0!3m2!1sen!2sin!4v1625118",
    travelTimeInfo: "Metro Station: 3 mins | IT Park Phase 1: 5 mins | Mumbai Highway: 12 mins",
    investmentScore: 94,
    rentalYield: 5.4,
    faqs: "Q: When is the possession of Vyomora?\nA: The possession is scheduled for June 2029.\n\nQ: Is it RERA registered?\nA: Yes, it is fully registered under MahaRERA: PR1260002600999.",
    seoTitle: "Shapoorji Pallonji Joyville Vyomora Hinjewadi - 2 & 3 BHK Homes",
    seoDescription: "Book premium 2 & 3 BHK homes and signature duplexes at Shapoorji Pallonji Joyville Vyomora in Hinjawadi, Pune. RERA registered premium residences starting from ₹84 Lakhs."
  }
];

const initialLocalities = [
  {
    id: "loc-1",
    name: "Hinjewadi",
    slug: "hinjewadi-pune",
    overview: "Hinjewadi is Pune's leading IT hub, housing the Rajiv Gandhi Infotech Park. It sees huge demand for residential rentals from tech professionals.",
    connectivityInfo: "Directly linked to the Pune-Mumbai Highway. The upcoming Hinjewadi-Shivajinagar Metro Line 3 will enhance public transit connectivity.",
    schools: "Mercedes-Benz International School, Blue Ridge Public School, Anisha Global",
    hospitals: "Ruby Hall Clinic Hinjewadi, Hinjawadi Hospital, Sahyadri Hospital",
    markets: "Grand Highstreet Hinjewadi, D-Mart Hinjewadi",
    metroConnectivity: "Metro Line 3 under active construction, stations located at Phase 1, Phase 2, Phase 3.",
    investmentAnalysis: "IT hub expansion drives high capital appreciation. Average price per sq ft ranges between ₹6,500 and ₹9,500.",
    rentalDemand: "Extremely high rental demand due to thousands of IT employees working nearby.",
    futureGrowth: "Ongoing infrastructure projects including the metro and new ring roads ensure long-term value appreciation."
  },
  {
    id: "loc-2",
    name: "Wakad",
    slug: "wakad-pune",
    overview: "Wakad is a premium residential corridor in West Pune, offering proximity to both Hinjewadi IT parks and Balewadi High Street entertainment hubs.",
    connectivityInfo: "Bordering the Bangalore-Mumbai bypass. Connected well via BRT routes and upcoming Metro stations.",
    schools: "EuroSchool Wakad, Indira Group of Institutes, Mount Litera School",
    hospitals: "Lifepoint Multispecialty Hospital, Surya Mother & Child Care",
    markets: "Phoenix Mall of the Millennium, Wakad Market",
    metroConnectivity: "Connected through Hinjewadi Metro bypass line stations.",
    investmentAnalysis: "Strong price growth following the launch of Phoenix Mall. Prices range between ₹7,500 and ₹10,500 per sq ft.",
    rentalDemand: "High demand for semi and fully-furnished 2 & 3 BHK flats.",
    futureGrowth: "New road expansions and proximity to premium IT corridors keep Wakad as Pune's top real estate investment hotspot."
  },
  {
    id: "loc-3",
    name: "Baner",
    slug: "baner-pune",
    overview: "Baner is an upscale residential-cum-commercial suburb, known for high-end dining, high streets, and premium residential towers like 24K Opula.",
    connectivityInfo: "Well-connected to Pune University, Aundh, and Mumbai Highway. Easy travel access to downtown Pune.",
    schools: "The Orchid School, VIBGYOR High School",
    hospitals: "Jupiter Hospital, Elite Healthcare",
    markets: "Balewadi High Street retail blocks, Westend Mall",
    metroConnectivity: "Metro stations at Baner Road under construction.",
    investmentAnalysis: "Elite residential market with high pricing stability. Premium properties average ₹10,000 - ₹14,000 per sq ft.",
    rentalDemand: "Sought after by senior executives and families preferring premium lifestyle apartments.",
    futureGrowth: "High commercial demand from corporate offices keeps residential appreciation robust."
  }
];

const initialAgents = [
  { id: "agent-5", name: "Neeraj Giri", phone: "+919876543205", email: "neeraj.giri@24krealtors.com", active: true },
  { id: "agent-1", name: "Jyoti Dhale", phone: "+919876543201", email: "jyoti.dhale@24krealtors.com", active: true },
  { id: "agent-2", name: "Jyoti Jagtap", phone: "+919876543202", email: "jyoti.jagtap@24krealtors.com", active: true },
  { id: "agent-3", name: "Yash Murkute", phone: "+919876543203", email: "yash.murkute@24krealtors.com", active: true },
  { id: "agent-4", name: "Nilesh Rai", phone: "+919876543204", email: "nilesh.rai@24krealtors.com", active: true },
  { id: "agent-6", name: "Manish Kumar Rai", phone: "+919876543206", email: "24krealtorshinjewadi@gmail.com", active: true }
];

const initialTasks = [
  {
    id: "task-1",
    lead: { id: "lead-1", name: "Rohan Sharma" },
    agent: { id: "agent-1", name: "Jyoti Dhale" },
    title: "Initial Discovery Call",
    description: "Call Rohan to understand budget expectations and floor choice.",
    taskType: "CALL",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    status: "PENDING",
    priority: "HIGH",
    createdDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    id: "task-2",
    lead: { id: "lead-2", name: "Priya Patel" },
    agent: { id: "agent-2", name: "Jyoti Jagtap" },
    title: "Home Loan Documents Follow-up",
    description: "Collect salary slips and bank statements from Priya for SBI pre-approval.",
    taskType: "EMAIL",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // in 4 hours
    status: "PENDING",
    priority: "MEDIUM",
    createdDate: new Date().toISOString()
  },
  {
    id: "task-3",
    lead: { id: "lead-3", name: "Vikram Malhotra" },
    agent: { id: "agent-3", name: "Yash Murkute" },
    title: "Showroom Site Visit",
    description: "Accompany Vikram for physical walkthrough of Hinjewadi commercial space.",
    taskType: "SITE_VISIT",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: "COMPLETED",
    priority: "HIGH",
    createdDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  }
];

const getLocalStorageItem = (key, initial) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initial;
  }
};

const saveLocalStorageItem = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const LocalMockDb = {
  getProperties() {
    return getLocalStorageItem('mock_properties', initialProperties);
  },
  saveProperties(props) {
    saveLocalStorageItem('mock_properties', props);
  },
  getLeads() {
    return getLocalStorageItem('mock_leads', initialLeads);
  },
  saveLeads(leads) {
    saveLocalStorageItem('mock_leads', leads);
  },
  getAgents() {
    return getLocalStorageItem('mock_agents', initialAgents);
  },
  getTasks() {
    return getLocalStorageItem('mock_tasks', initialTasks);
  },
  saveTasks(tasks) {
    saveLocalStorageItem('mock_tasks', tasks);
  },
  getUsers() {
    return getLocalStorageItem('mock_users', [
      { username: 'Manishrai07', password: 'Manish@993100', role: 'SUPER_ADMIN', fullName: 'Manish Kumar Rai', email: '24krealtorshinjewadi@gmail.com' },
      { username: 'neeraj.giri', password: 'Neeraj@24K2026!', role: 'ADMIN', fullName: 'Neeraj Giri' },
      { username: 'nilesh.rai', password: 'Nilesh@24K2026!', role: 'SALES_MANAGER', fullName: 'Nilesh Rai' },
      { username: 'hr24k', password: 'Jyoti.D@24K2026!', role: 'HR', fullName: 'Jyoti Dhale' },
      { username: 'jyoti.jagtap', password: 'Jyoti.J@24K2026!', role: 'RELATIONSHIP_MANAGER', fullName: 'Jyoti Jagtap' },
      { username: 'yash.murkute', password: 'Yash@24K2026!', role: 'RELATIONSHIP_MANAGER', fullName: 'Yash Murkute' }
    ]);
  },
  saveUsers(users) {
    saveLocalStorageItem('mock_users', users);
  },
  getSocieties() {
    return getLocalStorageItem('mock_societies', initialSocieties);
  },
  saveSocieties(societies) {
    saveLocalStorageItem('mock_societies', societies);
  },
  getBuilders() {
    return getLocalStorageItem('mock_builders', initialBuilders);
  },
  saveBuilders(builders) {
    saveLocalStorageItem('mock_builders', builders);
  },
  getLocalities() {
    return getLocalStorageItem('mock_localities', initialLocalities);
  },
  saveLocalities(localities) {
    saveLocalStorageItem('mock_localities', localities);
  },
  getBlogs() {
    return getLocalStorageItem('mock_blogs', initialBlogs);
  },
  saveBlogs(blogs) {
    saveLocalStorageItem('mock_blogs', blogs);
  }
};

const isMockId = (id) => {
  if (!id) return false;
  return typeof id === 'string' && (
    id.startsWith('blog-') || 
    id.startsWith('lead-') || 
    id.startsWith('agent-') || 
    id.startsWith('soc-') || 
    id.startsWith('builder-') || 
    id.startsWith('task-') || 
    id.startsWith('emp-')
  );
};

const isMockToken = () => {
  const token = localStorage.getItem('token');
  return token && token.startsWith('mock-');
};

let isBackendOfflineCached = false;
let offlineCacheResetTimer = null;

// Generic runner that automatically falls back to client database on network errors
const runWithFallback = async (apiFn, fallbackFn, bypassMockCheck = false) => {
  if (isMockToken() && !bypassMockCheck) {
    return fallbackFn();
  }
  if (isBackendOfflineCached) {
    return fallbackFn();
  }
  try {
    const result = await apiFn();
    isBackendOfflineCached = false;
    localStorage.setItem('OFFLINE_MODE_ACTIVE', 'false');
    return result;
  } catch (err) {
    const isNetworkError = err.name === 'TypeError' || 
                           (err.message && (
                             err.message.includes('Failed to fetch') || 
                             err.message.includes('NetworkError') || 
                             err.message.includes('Failed to execute') ||
                             err.message.includes('network error')
                           ));
                           
    if (isNetworkError) {
      if (!isBackendOfflineCached) {
        console.warn("[OFFLINE SYNC] Spring Boot server unreachable. Falling back to local browser-based database.");
        isBackendOfflineCached = true;
        localStorage.setItem('OFFLINE_MODE_ACTIVE', 'true');
        if (!offlineCacheResetTimer) {
          offlineCacheResetTimer = setTimeout(() => {
            isBackendOfflineCached = false;
            offlineCacheResetTimer = null;
          }, 30000);
        }
      }
      return fallbackFn();
    }
    localStorage.setItem('OFFLINE_MODE_ACTIVE', 'false');
    throw err;
  }
};



const enrichGodrejIvaraProperty = (p) => {
  if (!p) return p;
  if (p.id === 'prop-21' || (p.title && p.title.toLowerCase().includes('ivara'))) {
    return {
      ...p,
      location: "KHARADI",
      imageUrl: "https://www.godrejivaraskharadi.com/assets/img/desk1.webp",
      slideshowImages: [
        "https://www.godrejivaraskharadi.com/assets/img/desk1.webp",
        "https://www.godrejivaraskharadi.com/assets/img/desk2.webp",
        "https://www.godrejivaraskharadi.com/assets/img/gallery/g1.webp",
        "https://www.godrejivaraskharadi.com/assets/img/gallery/g2.webp",
        "https://www.godrejivaraskharadi.com/assets/img/gallery/g3.webp",
        "https://www.godrejivaraskharadi.com/assets/img/gallery/g4.webp"
      ],
      floorPlanUrl: "https://www.godrejivaraskharadi.com/assets/img/floorplan/2bhk_725_750.webp",
      masterPlanUrl: "https://www.godrejivaraskharadi.com/assets/img/floorplan/masterplan.webp",
      locationMapUrl: "https://www.godrejivaraskharadi.com/assets/img/locationmap.webp",
      configurations: [
        { name: "2 BHK Premium", area: "725 - 750 sq.ft", price: "₹1.17 Cr", status: "Selling Fast" },
        { name: "3 BHK Elite", area: "875 - 900 sq.ft", price: "₹1.49 Cr", status: "Available" },
        { name: "3 BHK Regal", area: "975 - 1000 sq.ft", price: "₹1.69 Cr", status: "Selling Fast" },
        { name: "3 BHK Ultra", area: "1100 - 1150 sq.ft", price: "₹1.95 Cr", status: "Premium Units" },
        { name: "3 BHK Opulent", area: "1200 - 1250 sq.ft", price: "₹2.19 Cr", status: "Premium Units" },
        { name: "4 BHK Iconic", area: "1550 - 1650 sq.ft", price: "₹2.89 Cr", status: "Exclusive Launch" }
      ],
      specificAmenities: [
        "100,000 sq.ft Club Forest",
        "10,000 sq.ft Gymnasium",
        "Infinity Swimming Pool",
        "Forest Lounge Zone",
        "Jogging & Cycling Track",
        "Indoor Video Games Room",
        "Co-working Space Lounge",
        "Landscaped Zen Gardens",
        "Child-Centric Sports Center",
        "24/7 Security & CCTV Grid"
      ]
    };
  }
  return p;
};

const enrichVyomoraProperty = (p) => {
  if (!p) return p;
  if (p.id === 'prop-22' || p.id === 22 || (p.title && p.title.toLowerCase().includes('vyomora'))) {
    return {
      ...p,
      location: "HINJEWADI",
      imageUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/shapoorji-joyville-vyomora/vyomora_hero_facade.png",
      description: "Vyomora by Shapoorji Pallonji Real Estate is a landmark residential project nestled at Hinjewadi Off Maan Road, Pune's fastest appreciating IT corridor. Spread across 12.5 acres with 6 premium towers, Vyomora offers intelligently designed 2 & 3 BHK residences featuring expansive balconies, superior RCC framed structure, and a 25,454 sq.ft Grand Clubhouse with 40+ world-class amenities. Powered by 160 years of Shapoorji Pallonji engineering legacy — RERA registered & MahaRERA verified.",
      videoUrl: "https://www.youtube.com/watch?v=Sn4_9-3SXTY",
      slideshowImages: [
        "/properties/vyomora/hero.jpg",
        "/properties/vyomora/pool.jpg",
        "/properties/vyomora/playarea.jpg",
        "/properties/vyomora/wormeye.jpg",
        "/properties/vyomora/livingroom.jpg",
        "/properties/vyomora/kitchen.jpg",
        "/properties/vyomora/bedroom.jpg"
      ],
      floorPlanUrl: "/properties/vyomora/floorplan_2bhk.png",
      floorPlan3BHKUrl: "/properties/vyomora/floorplan_3bhk.png",
      masterPlanUrl: "/properties/vyomora/masterplan.png",
      locationMapUrl: "/properties/vyomora/locationmap.jpg",
      amenityImages: {
        clubhouse: "/properties/vyomora/brochure_p4_Im0.jpg",
        pool: "/properties/vyomora/pool.jpg",
        playarea: "/properties/vyomora/playarea.jpg",
        exterior: "/properties/vyomora/brochure_p2_Im0.jpg",
        aerial: "/properties/vyomora/wormeye.jpg",
        living: "/properties/vyomora/livingroom.jpg",
        kitchen: "/properties/vyomora/kitchen.jpg",
        bedroom: "/properties/vyomora/bedroom.jpg"
      },
      configurations: [
        { name: "2 BHK Luxe", area: "684.91 sq.ft", price: "₹84 Lakhs", status: "Selling Fast" },
        { name: "2 BHK Smart", area: "749.60 sq.ft", price: "₹92 Lakhs", status: "Available" },
        { name: "2 BHK Grande", area: "779.42 sq.ft", price: "₹1.02 Cr", status: "Selling Fast" },
        { name: "2 BHK Royale", area: "838.95 sq.ft", price: "₹1.12 Cr", status: "Premium Units" },
        { name: "3 BHK Select", area: "1051.86 sq.ft", price: "₹1.35 Cr", status: "Limited Release" },
        { name: "3 BHK Elite", area: "1090.72 sq.ft", price: "₹1.45 Cr", status: "Selling Fast" },
        { name: "3 BHK Imperial", area: "1184.47 sq.ft", price: "₹1.60 Cr", status: "Premium Units" },
        { name: "3 BHK Signature Duplex", area: "1477.00 sq.ft", price: "₹1.95 Cr", status: "Exclusive Launch" }
      ],
      specificAmenities: [
        "25,454 sq.ft Grand Clubhouse",
        "Infinity Swimming Pool",
        "Miyawaki Forest Zone",
        "Wellness Clinic",
        "Digital Dome Theater",
        "Cricket Simulator Suite",
        "Video Games Arcade Room",
        "Trampoline & Adventure Park",
        "Spa & Reflexology Path",
        "Library & Co-working Lounge"
      ]
    };
  }
  return p;
};

const enrichPropertiesResponse = (res) => {
  if (!res) return res;
  if (Array.isArray(res)) {
    return res.map(p => enrichVyomoraProperty(enrichGodrejIvaraProperty(p)));
  }
  if (res.content && Array.isArray(res.content)) {
    return {
      ...res,
      content: res.content.map(p => enrichVyomoraProperty(enrichGodrejIvaraProperty(p)))
    };
  }
  return enrichVyomoraProperty(enrichGodrejIvaraProperty(res));
};


// --- EXPORTED SERVICE ENDPOINTS ---
export const apiService = {
  // --- UTILITY METHODS ---
  setApiBaseUrl(url) {
    if (url && url.trim()) {
      localStorage.setItem('API_BASE_URL', url.trim());
    } else {
      localStorage.removeItem('API_BASE_URL');
    }
    window.location.reload();
  },

  getApiBaseUrl() {
    return BASE_URL;
  },

  isOfflineModeActive() {
    return localStorage.getItem('OFFLINE_MODE_ACTIVE') === 'true';
  },

  // --- AUTH ENDPOINTS ---
  
  async loginInit(username, password, rememberDevice) {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/auth/login-init`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, rememberDevice }),
        });
        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          throw new Error(errText || 'Authentication failed. Please check your credentials.');
        }
        return await response.json();
      },
      () => {
        const users = LocalMockDb.getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
          throw new Error('Authentication failed. Invalid local credentials.');
        }
        
        // Mock email masking
        const email = user.email || (username + "@24krealtors.com");
        const atIndex = email.indexOf("@");
        const namePart = email.substring(0, atIndex);
        const domainPart = email.substring(atIndex);
        const masked = namePart.charAt(0) + "***" + namePart.charAt(namePart.length - 1) + domainPart;

        return {
          tempToken: "mock-temp-token-" + username,
          emailMasked: masked,
          devMockOtp: "123456" // Default local fallback OTP
        };
      },
      true
    );
  },

  async loginVerify(tempToken, code) {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/auth/login-verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tempToken, code }),
        });
        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          throw new Error(errText || 'Verification failed. Incorrect OTP.');
        }
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('role', data.role);
        localStorage.setItem('adminUser', data.username);
        localStorage.setItem('fullName', data.fullName || data.username);
        return data;
      },
      () => {
        // If local tempToken starts with mock-temp-token-
        if (!tempToken.startsWith("mock-temp-token-")) {
          throw new Error('Invalid temporary session token.');
        }
        if (code !== "123456") {
          throw new Error('Incorrect verification code. Hint: Use 123456');
        }
        
        const username = tempToken.replace("mock-temp-token-", "");
        const users = LocalMockDb.getUsers();
        const user = users.find(u => u.username === username);
        if (!user) {
          throw new Error('User session not found.');
        }

        const token = "mock-jwt-session-token-xyz-123";
        const refreshToken = "mock-refresh-token-xyz-123";
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('role', user.role || 'CRM_ADMIN');
        localStorage.setItem('adminUser', username);
        localStorage.setItem('fullName', user.fullName || username);
        return { token, refreshToken, username, role: user.role || 'CRM_ADMIN', fullName: user.fullName || username };
      },
      true
    );
  },

  // Retain legacy login for backward compatibility
  async login(username, password) {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          throw new Error(errText || 'Authentication failed.');
        }
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('role', data.role);
        localStorage.setItem('adminUser', data.username);
        localStorage.setItem('fullName', data.fullName || data.username);
        return data;
      },
      () => {
        const users = LocalMockDb.getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) throw new Error('Authentication failed.');
        const token = "mock-jwt-session-token-xyz-123";
        const refreshToken = "mock-refresh-token-xyz-123";
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('role', user.role || 'CRM_ADMIN');
        localStorage.setItem('adminUser', username);
        localStorage.setItem('fullName', user.fullName || username);
        return { token, refreshToken, username, role: user.role || 'CRM_ADMIN', fullName: user.fullName || username };
      },
      true
    );
  },

  async register(username, password) {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, role: 'CRM_ADMIN' }),
        });
        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          throw new Error(errText || 'Registration failed.');
        }
        return response;
      },
      () => {
        const users = LocalMockDb.getUsers();
        if (users.some(u => u.username === username)) {
          throw new Error('Username already exists in local database.');
        }
        users.push({ username, password });
        LocalMockDb.saveUsers(users);
        return { status: 'created' };
      },
      true
    );
  },

  async googleLogin(credential) {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/auth/google-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ credential }),
        });
        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          throw new Error(errText || 'Google sign-in failed.');
        }
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('role', data.role);
        localStorage.setItem('adminUser', data.username);
        localStorage.setItem('fullName', data.fullName || data.username);
        return data;
      },
      () => {
        let email = "manishrajapakari@gmail.com";
        let name = "Manish Kumar Rai";
        try {
          const parts = credential.split(".");
          if (parts.length >= 2) {
            const payload = JSON.parse(atob(parts[1]));
            email = payload.email || email;
            name = payload.name || name;
          }
        } catch (e) {
          console.warn("Could not decode Google mock credential, using default profile info");
        }
        
        const token = "mock-jwt-session-token-xyz-123";
        const refreshToken = "mock-refresh-token-xyz-123";
        const username = email.split("@")[0].toLowerCase();
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('role', 'CRM_ADMIN');
        localStorage.setItem('adminUser', username);
        localStorage.setItem('fullName', name);
        return { token, refreshToken, username, role: 'CRM_ADMIN', fullName: name };
      },
      true
    );
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;
    try {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.accessToken);
        return data.accessToken;
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
    }
    return null;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('adminUser');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // --- PROPERTIES ENDPOINTS ---
  
  async getProperties(filters = {}, page = 0, size = 10, sortBy = 'createdDate', direction = 'desc') {
    // ── Cache shortcut: serve instantly for unfiltered full-list requests ──
    const isUnfilteredFullLoad = !filters.location && !filters.minPrice && !filters.maxPrice &&
      !filters.propertyType && !filters.transactionType && !filters.bedrooms &&
      !filters.status && !filters.furnishingStatus && !filters.query && size >= 50 && page === 0;

    if (isUnfilteredFullLoad && _propertiesCache.isValid()) {
      console.info('[Cache] Serving properties from in-memory cache ⚡');
      return _propertiesCache.get();
    }

    const res = await runWithFallback(
      async () => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);
        params.append('sortBy', sortBy);
        params.append('direction', direction);
        
        if (filters.location) params.append('location', filters.location);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.propertyType) params.append('propertyType', filters.propertyType);
        if (filters.transactionType) params.append('transactionType', filters.transactionType);
        if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
        if (filters.status) params.append('status', filters.status);
        if (filters.furnishingStatus) params.append('furnishingStatus', filters.furnishingStatus);
        if (filters.query) params.append('query', filters.query);
        
        const response = await fetch(`${BASE_URL}/properties?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch properties: ${response.statusText}`);
        }
        const json = await response.json();
        // Cache unfiltered full-list result
        if (isUnfilteredFullLoad) _propertiesCache.set(json);
        return json;
      },
      () => {
        let list = LocalMockDb.getProperties();
        
        if (filters.location) list = list.filter(p => p.location === filters.location);
        if (filters.minPrice) list = list.filter(p => p.price >= Number(filters.minPrice));
        if (filters.maxPrice) list = list.filter(p => p.price <= Number(filters.maxPrice));
        if (filters.propertyType) list = list.filter(p => p.propertyType === filters.propertyType);
        if (filters.transactionType) list = list.filter(p => p.transactionType === filters.transactionType);
        if (filters.bedrooms) list = list.filter(p => p.bedrooms === Number(filters.bedrooms));
        if (filters.status) list = list.filter(p => p.status === filters.status);
        if (filters.furnishingStatus) list = list.filter(p => p.furnishingStatus === filters.furnishingStatus);
        if (filters.query) {
          const q = filters.query.toLowerCase();
          list = list.filter(p => 
            p.title.toLowerCase().includes(q) || 
            (p.description && p.description.toLowerCase().includes(q)) || 
            (p.address && p.address.toLowerCase().includes(q)) || 
            p.location.toLowerCase().includes(q)
          );
        }
        
        // Sort logic
        list.sort((a, b) => {
          let fieldA = a[sortBy] || '';
          let fieldB = b[sortBy] || '';
          if (typeof fieldA === 'string') {
            return direction === 'desc' ? fieldB.localeCompare(fieldA) : fieldA.localeCompare(fieldB);
          }
          return direction === 'desc' ? fieldB - fieldA : fieldA - fieldB;
        });
 
        // Pagination
        const start = page * size;
        const pagedList = list.slice(start, start + size);
        return {
          content: pagedList,
          totalPages: Math.ceil(list.length / size),
          totalElements: list.length,
          size,
          number: page
        };
      }
    );
    return enrichPropertiesResponse(res);
  },
 
  async getPropertyById(id) {
    const res = await runWithFallback(
      async () => {
        if (isMockId(id)) throw new TypeError('Mock ID bypass');
        const response = await fetch(`${BASE_URL}/properties/${id}`);
        if (!response.ok) {
          throw new Error(`Property lookup failed: ${response.statusText}`);
        }
        return response.json();
      },
      () => {
        const list = LocalMockDb.getProperties();
        const prop = list.find(p => p.id === id);
        if (!prop) throw new Error('Property not found in local database');
        return prop;
      }
    );
    return enrichPropertiesResponse(res);
  },

  async createProperty(propertyData) {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/properties`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(propertyData),
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Access denied. Please log in as an administrator.');
          }
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to create property listing');
        }
        return response.json();
      },
      () => {
        const list = LocalMockDb.getProperties();
        const newProperty = {
          ...propertyData,
          id: 'mock-prop-' + Math.random().toString(36).substr(2, 9),
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        };
        list.push(newProperty);
        LocalMockDb.saveProperties(list);
        
        // Simulating the matchmaking alert log in console
        setTimeout(() => {
          const leads = LocalMockDb.getLeads();
          const matches = leads.filter(l => l.preferredLocation === newProperty.location &&
            (!l.budgetMin || newProperty.price >= l.budgetMin) &&
            (!l.budgetMax || newProperty.price <= l.budgetMax)
          );
          matches.forEach(m => {
            console.log(`%c[LOCAL OFFLINE MATCH ALERT] Lead '${m.name}' matches new property '${newProperty.title}' in ${newProperty.location}!`, "color: #FFD700; font-weight: bold; background: #000; padding: 2px 5px;");
          });
        }, 1000);

        return newProperty;
      }
    );
  },

  async updateProperty(id, propertyData) {
    return runWithFallback(
      async () => {
        if (isMockId(id)) throw new TypeError('Mock ID bypass');
        const response = await fetch(`${BASE_URL}/properties/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(propertyData),
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Access denied. Please log in as an administrator.');
          }
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to update property listing');
        }
        return response.json();
      },
      () => {
        const list = LocalMockDb.getProperties();
        const idx = list.findIndex(p => p.id === id);
        if (idx === -1) throw new Error('Property not found in local database');
        
        const updated = {
          ...list[idx],
          ...propertyData,
          updatedDate: new Date().toISOString()
        };
        list[idx] = updated;
        LocalMockDb.saveProperties(list);
        return updated;
      }
    );
  },

  async deleteProperty(id) {
    return runWithFallback(
      async () => {
        if (isMockId(id)) throw new TypeError('Mock ID bypass');
        const response = await fetch(`${BASE_URL}/properties/${id}`, {
          method: 'DELETE',
          headers: {
            ...getAuthHeaders()
          }
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Access denied. Please log in as an administrator.');
          }
          throw new Error(`Failed to delete property: ${response.statusText}`);
        }
        return true;
      },
      () => {
        let list = LocalMockDb.getProperties();
        list = list.filter(p => p.id !== id);
        LocalMockDb.saveProperties(list);
        return true;
      }
    );
  },

  // --- LEADS ENDPOINTS ---

  async submitLead(leadData) {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadData),
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.errors ? Object.values(errData.errors).join(', ') : (errData.message || 'Failed to submit lead'));
        }
        return response.json();
      },
      () => {
        const list = LocalMockDb.getLeads();
        const agents = LocalMockDb.getAgents();
        
        // Round-robin agent assignment simulation
        const counter = Number(localStorage.getItem('mock_lead_counter') || '0');
        const assignedAgent = agents[counter % agents.length];
        localStorage.setItem('mock_lead_counter', (counter + 1).toString());

        // Calculate lead score simulation
        let score = 40;
        if (leadData.preferredLocation === "HINJEWADI" || leadData.preferredLocation === "BANER" || leadData.preferredLocation === "WAKAD") {
          score += 15;
        }
        if (leadData.budgetMax && Number(leadData.budgetMax) >= 15000000) {
          score += 20;
        }
        if (leadData.notes && (leadData.notes.toLowerCase().includes('immediate') || leadData.notes.toLowerCase().includes('urgent'))) {
          score += 15;
        }

        const newLead = {
          ...leadData,
          id: 'mock-lead-' + Math.random().toString(36).substr(2, 9),
          status: leadData.status || 'NEW',
          assignedAgentName: assignedAgent ? assignedAgent.name : 'Unassigned',
          assignedAgentPhone: assignedAgent ? assignedAgent.phone : null,
          leadScore: Math.min(score, 100),
          createdDate: new Date().toISOString()
        };
        
        list.push(newLead);
        LocalMockDb.saveLeads(list);

        // Seed mock WhatsApp Webhook Logs for dashboard payload auditing
        const logs = getLocalStorageItem('mock_whatsapp_logs', []);
        logs.push({
          id: Math.floor(Math.random() * 100000),
          leadId: newLead.id,
          phone: newLead.phone,
          templateName: "welcome_lead_intro",
          parametersJson: JSON.stringify([
            {type: "text", text: newLead.name},
            {type: "text", text: newLead.preferredLocation || "PUNE PRIME CORRIDORS"},
            {type: "text", text: newLead.assignedAgentName},
            {type: "text", text: newLead.assignedAgentPhone || "N/A"}
          ]),
          status: "SIMULATING",
          errorMessage: null,
          payloadJson: JSON.stringify({
            messaging_product: "whatsapp",
            to: newLead.phone,
            type: "template",
            template: {
              name: "welcome_lead_intro",
              language: { code: "en_US" },
              components: [
                {
                  type: "body",
                  parameters: [
                    {type: "text", text: newLead.name},
                    {type: "text", text: newLead.preferredLocation || "PUNE PRIME CORRIDORS"},
                    {type: "text", text: newLead.assignedAgentName},
                    {type: "text", text: newLead.assignedAgentPhone || "N/A"}
                  ]
                }
              ]
            }
          }),
          sentTimestamp: new Date().toISOString()
        });
        saveLocalStorageItem('mock_whatsapp_logs', logs);

        return newLead;
      }
    );
  },

  async getLeads(filters = {}, page = 0, size = 10, sortBy = 'createdDate', direction = 'desc') {
    return runWithFallback(
      async () => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);
        params.append('sortBy', sortBy);
        params.append('direction', direction);

        if (filters.status) params.append('status', filters.status);
        if (filters.preferredLocation) params.append('preferredLocation', filters.preferredLocation);

        const response = await fetch(`${BASE_URL}/leads?${params.toString()}`, {
          headers: {
            ...getAuthHeaders()
          }
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Access denied. Please log in as an administrator.');
          }
          throw new Error(`Failed to fetch leads: ${response.statusText}`);
        }
        return response.json();
      },
      () => {
        let list = LocalMockDb.getLeads();
        if (filters.status) list = list.filter(l => l.status === filters.status);
        if (filters.preferredLocation) list = list.filter(l => l.preferredLocation === filters.preferredLocation);

        list.sort((a, b) => {
          let fieldA = a[sortBy] || '';
          let fieldB = b[sortBy] || '';
          if (typeof fieldA === 'string') {
            return direction === 'desc' ? fieldB.localeCompare(fieldA) : fieldA.localeCompare(fieldB);
          }
          return direction === 'desc' ? fieldB - fieldA : fieldA - fieldB;
        });

        const start = page * size;
        const pagedList = list.slice(start, start + size);
        return {
          content: pagedList,
          totalPages: Math.ceil(list.length / size),
          totalElements: list.length,
          size,
          number: page
        };
      }
    );
  },

  async updateLeadStatus(id, status) {
    return runWithFallback(
      async () => {
        if (isMockId(id)) throw new TypeError('Mock ID bypass');
        const response = await fetch(`${BASE_URL}/leads/${id}/status?status=${status}`, {
          method: 'PATCH',
          headers: {
            ...getAuthHeaders()
          }
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Access denied. Please log in as an administrator.');
          }
          throw new Error(`Failed to update lead status: ${response.statusText}`);
        }
        return response.json();
      },
      () => {
        const list = LocalMockDb.getLeads();
        const idx = list.findIndex(l => l.id === id);
        if (idx === -1) throw new Error('Lead not found in local database');
        
        list[idx].status = status;
        LocalMockDb.saveLeads(list);
        return list[idx];
      }
    );
  },

  async deleteLead(id) {
    return runWithFallback(
      async () => {
        if (isMockId(id)) throw new TypeError('Mock ID bypass');
        const response = await fetch(`${BASE_URL}/leads/${id}`, {
          method: 'DELETE',
          headers: {
            ...getAuthHeaders()
          }
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Access denied. Please log in as an administrator.');
          }
          throw new Error(`Failed to delete lead: ${response.statusText}`);
        }
        return true;
      },
      () => {
        let list = LocalMockDb.getLeads();
        list = list.filter(l => l.id !== id);
        LocalMockDb.saveLeads(list);
        return true;
      }
    );
  },

  async assignLead(leadId, agentId) {
    return runWithFallback(
      async () => {
        if (isMockId(leadId) || isMockId(agentId)) throw new TypeError('Mock ID bypass');
        const response = await fetch(`${BASE_URL}/leads/${leadId}/assign/${agentId}`, {
          method: 'PATCH',
          headers: {
            ...getAuthHeaders()
          }
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Access denied. Please log in as an administrator.');
          }
          throw new Error(`Failed to assign agent: ${response.statusText}`);
        }
        return response.json();
      },
      () => {
        const leads = LocalMockDb.getLeads();
        const agents = LocalMockDb.getAgents();
        const leadIdx = leads.findIndex(l => l.id === leadId);
        const agent = agents.find(a => a.id === agentId);
        if (leadIdx === -1) throw new Error('Lead not found in local database');
        if (!agent) throw new Error('Agent not found in local database');
        
        leads[leadIdx].assignedAgentName = agent.name;
        leads[leadIdx].assignedAgentPhone = agent.phone;
        LocalMockDb.saveLeads(leads);
        return leads[leadIdx];
      }
    );
  },


  async getStats() {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/dashboard/stats`, {
          headers: {
            ...getAuthHeaders()
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.statusText}`);
        }
        return response.json();
      },
      () => {
        const leads = LocalMockDb.getLeads();
        const properties = LocalMockDb.getProperties();

        const totalLeads = leads.length;
        const newLeads = leads.filter(l => l.status === 'NEW').length;
        const contactedLeads = leads.filter(l => l.status === 'IN_PROGRESS' || l.status === 'CONTACTED' || l.status === 'VISITED').length;
        const convertedLeads = leads.filter(l => l.status === 'CONVERTED').length;
        const activeProperties = properties.filter(p => p.status === 'AVAILABLE').length;

        return {
          totalLeads,
          newLeads,
          contactedLeads,
          convertedLeads,
          activeProperties
        };
      }
    );
  },

  async getAgents() {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/agents`, {
          headers: {
            ...getAuthHeaders()
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch agents: ${response.statusText}`);
        }
        return response.json();
      },
      () => {
        return LocalMockDb.getAgents();
      }
    );
  },

  async getWhatsAppLogs(leadId) {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/whatsapp/logs/lead/${leadId}`, {
          headers: {
            ...getAuthHeaders()
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch WhatsApp logs: ${response.statusText}`);
        }
        return response.json();
      },
      () => {
        const logs = getLocalStorageItem('mock_whatsapp_logs', [
          {
            id: 1,
            leadId: "lead-1",
            phone: "+919876543210",
            templateName: "welcome_lead_intro",
            parametersJson: JSON.stringify([
              {type: "text", text: "Rohan Sharma"},
              {type: "text", text: "BANER"},
              {type: "text", text: "Jyoti Dhale"},
              {type: "text", text: "+919876543201"}
            ]),
            status: "SIMULATING",
            errorMessage: null,
            payloadJson: '{"messaging_product":"whatsapp","to":"+919876543210","type":"template","template":{"name":"welcome_lead_intro","language":{"code":"en_US"}}}',
            sentTimestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
          }
        ]);
        return logs.filter(l => l.leadId === leadId);
      }
    );
  },

  async getTasks() {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/tasks`, {
          headers: {
            ...getAuthHeaders()
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }
        return response.json();
      },
      () => {
        return LocalMockDb.getTasks();
      }
    );
  },

  async createTask(taskData) {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(taskData)
        });
        if (!response.ok) {
          throw new Error(`Failed to create task: ${response.statusText}`);
        }
        return response.json();
      },
      () => {
        const tasks = LocalMockDb.getTasks();
        const leads = LocalMockDb.getLeads();
        const agents = LocalMockDb.getAgents();

        const lead = leads.find(l => l.id === taskData.leadId) || { id: taskData.leadId, name: 'Unknown Lead' };
        const agent = agents.find(a => a.id === taskData.agentId) || { id: taskData.agentId, name: 'Unknown Agent' };

        const newTask = {
          id: `task-${Date.now()}`,
          lead,
          agent,
          title: taskData.title,
          description: taskData.description,
          taskType: taskData.taskType,
          dueDate: taskData.dueDate,
          status: 'PENDING',
          priority: taskData.priority,
          createdDate: new Date().toISOString()
        };

        tasks.push(newTask);
        LocalMockDb.saveTasks(tasks);
        return newTask;
      }
    );
  },

  async updateTaskStatus(id, status) {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/tasks/${id}/status?status=${status}`, {
          method: 'PATCH',
          headers: {
            ...getAuthHeaders()
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to update task status: ${response.statusText}`);
        }
        return response.json();
      },
      () => {
        const tasks = LocalMockDb.getTasks();
        const idx = tasks.findIndex(t => t.id === id);
        if (idx === -1) throw new Error('Task not found in local database');
        
        tasks[idx].status = status;
        LocalMockDb.saveTasks(tasks);
        return tasks[idx];
      }
    );
  },

  async deleteTask(id) {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/tasks/${id}`, {
          method: 'DELETE',
          headers: {
            ...getAuthHeaders()
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to delete task: ${response.statusText}`);
        }
        return true;
      },
      () => {
        let tasks = LocalMockDb.getTasks();
        tasks = tasks.filter(t => t.id !== id);
        LocalMockDb.saveTasks(tasks);
        return true;
      }
    );
  },

  async getTaskStats() {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/tasks/stats`, {
          headers: {
            ...getAuthHeaders()
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch task stats: ${response.statusText}`);
        }
        return response.json();
      },
      () => {
        const tasks = LocalMockDb.getTasks();
        const totalTasks = tasks.length;
        const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
        const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
        
        const now = new Date();
        const overdueTasks = tasks.filter(t => t.status === 'PENDING' && new Date(t.dueDate) < now).length;

        return {
          totalTasks,
          pendingTasks,
          completedTasks,
          overdueTasks
        };
      }
    );
  },

  // --- EMPLOYEES ENDPOINTS ---
  async getEmployees() {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/employees`, { headers: getAuthHeaders() });
        return res.ok ? res.json() : [];
      },
      () => LocalMockDb.getAgents()
    );
  },

  async createEmployee(data) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/employees`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(data)
        });
        return res.json();
      },
      () => {
        const agents = LocalMockDb.getAgents();
        const newAg = { id: 'agent-' + (agents.length + 1), ...data, active: true };
        agents.push(newAg);
        localStorage.setItem('mock_agents', JSON.stringify(agents));
        return newAg;
      }
    );
  },

  // --- ATTENDANCE ENDPOINTS ---
  async getAttendanceLogs() {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/attendance/my-logs`, { headers: getAuthHeaders() });
        return res.ok ? res.json() : [];
      },
      () => getLocalStorageItem('mock_attendance_logs', [])
    );
  },

  async checkIn(lat, lon) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/attendance/check-in`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({ latitude: lat, longitude: lon })
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      },
      () => {
        const OFFICE_LAT = 18.583418;
        const OFFICE_LON = 73.727354;
        const earthRadius = 6371000;
        const dLat = (lat - OFFICE_LAT) * Math.PI / 180;
        const dLon = (lon - OFFICE_LON) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(OFFICE_LAT * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = earthRadius * c;
        if (distance > 500) {
          throw new Error(`Outside office geofence. Distance: ${distance.toFixed(1)}m. Check-in restricted to 500m.`);
        }

        const logs = getLocalStorageItem('mock_attendance_logs', []);
        const todayStr = new Date().toISOString().split('T')[0];
        if (logs.some(l => l.date === todayStr)) {
          throw new Error("Already checked in for today!");
        }

        const newLog = {
          id: 'att-mock-' + (logs.length + 1),
          date: todayStr,
          checkInTime: new Date().toLocaleTimeString(),
          checkOutTime: null,
          latitude: lat,
          longitude: lon,
          totalBreakMinutes: 0,
          overtimeHours: 0,
          status: new Date().getHours() >= 9 && new Date().getMinutes() > 30 ? 'LATE' : 'ON_TIME',
          breaks: []
        };
        logs.push(newLog);
        saveLocalStorageItem('mock_attendance_logs', logs);
        return newLog;
      }
    );
  },

  async checkOut(lat, lon) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/attendance/check-out`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({ latitude: lat, longitude: lon })
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      },
      () => {
        const OFFICE_LAT = 18.583418;
        const OFFICE_LON = 73.727354;
        const earthRadius = 6371000;
        const dLat = (lat - OFFICE_LAT) * Math.PI / 180;
        const dLon = (lon - OFFICE_LON) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(OFFICE_LAT * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = earthRadius * c;
        if (distance > 500) {
          throw new Error(`Outside office geofence. Distance: ${distance.toFixed(1)}m. Check-out restricted to 500m.`);
        }

        const logs = getLocalStorageItem('mock_attendance_logs', []);
        const todayStr = new Date().toISOString().split('T')[0];
        const logIndex = logs.findIndex(l => l.date === todayStr);
        if (logIndex === -1) {
          throw new Error("No active check-in record found for today.");
        }
        if (logs[logIndex].checkOutTime) {
          throw new Error("Already checked out for today!");
        }
        logs[logIndex].checkOutTime = new Date().toLocaleTimeString();
        saveLocalStorageItem('mock_attendance_logs', logs);
        return logs[logIndex];
      }
    );
  },

  async startBreak() {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/attendance/break/start`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
        return res.json();
      },
      () => {
        const logs = getLocalStorageItem('mock_attendance_logs', []);
        const todayStr = new Date().toISOString().split('T')[0];
        const logIndex = logs.findIndex(l => l.date === todayStr);
        if (logIndex === -1) throw new Error("No active check-in record found.");
        
        const newBreak = {
          startTime: new Date().toISOString(),
          endTime: null
        };
        if (!logs[logIndex].breaks) logs[logIndex].breaks = [];
        logs[logIndex].breaks.push(newBreak);
        saveLocalStorageItem('mock_attendance_logs', logs);
        return newBreak;
      }
    );
  },

  async endBreak() {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/attendance/break/end`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
        return res.json();
      },
      () => {
        const logs = getLocalStorageItem('mock_attendance_logs', []);
        const todayStr = new Date().toISOString().split('T')[0];
        const logIndex = logs.findIndex(l => l.date === todayStr);
        if (logIndex === -1) throw new Error("No active check-in record found.");
        
        const breakIndex = logs[logIndex].breaks.findIndex(b => !b.endTime);
        if (breakIndex === -1) throw new Error("No active break session found.");
        
        const nowStr = new Date().toISOString();
        logs[logIndex].breaks[breakIndex].endTime = nowStr;
        const breakMinutes = Math.floor((new Date(nowStr).getTime() - new Date(logs[logIndex].breaks[breakIndex].startTime).getTime()) / 60000);
        logs[logIndex].totalBreakMinutes = (logs[logIndex].totalBreakMinutes || 0) + breakMinutes;
        
        saveLocalStorageItem('mock_attendance_logs', logs);
        return logs[logIndex].breaks[breakIndex];
      }
    );
  },

  async applyWfh(wfhData) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/wfh/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(wfhData)
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      },
      () => {
        const list = getLocalStorageItem('mock_wfh_requests', []);
        const newRequest = {
          id: 'wfh-mock-' + Math.random().toString(36).substr(2, 9),
          startDate: wfhData.startDate,
          endDate: wfhData.endDate,
          reason: wfhData.reason,
          status: 'PENDING',
          employee: { fullName: localStorage.getItem('adminUser') || 'Self' }
        };
        list.push(newRequest);
        saveLocalStorageItem('mock_wfh_requests', list);
        return newRequest;
      }
    );
  },

  async getMyWfhRequests() {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/wfh/my-requests`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error("Failed to fetch WFH requests");
        return res.json();
      },
      () => {
        return getLocalStorageItem('mock_wfh_requests', []);
      }
    );
  },

  async getPendingWfhRequests() {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/wfh/pending`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error("Failed to fetch pending WFH requests");
        return res.json();
      },
      () => {
        const list = getLocalStorageItem('mock_wfh_requests', []);
        return list.filter(w => w.status === 'PENDING');
      }
    );
  },

  async approveWfh(id) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/wfh/${id}/approve`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to approve WFH request");
        return res.json();
      },
      () => {
        const list = getLocalStorageItem('mock_wfh_requests', []);
        const idx = list.findIndex(w => w.id === id);
        if (idx !== -1) {
          list[idx].status = 'APPROVED';
          saveLocalStorageItem('mock_wfh_requests', list);
          return list[idx];
        }
        throw new Error('WFH request not found');
      }
    );
  },

  async rejectWfh(id) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/wfh/${id}/reject`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to reject WFH request");
        return res.json();
      },
      () => {
        const list = getLocalStorageItem('mock_wfh_requests', []);
        const idx = list.findIndex(w => w.id === id);
        if (idx !== -1) {
          list[idx].status = 'REJECTED';
          saveLocalStorageItem('mock_wfh_requests', list);
          return list[idx];
        }
        throw new Error('WFH request not found');
      }
    );
  },

  async isWfhActiveToday() {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/wfh/active-today`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error("Failed to check active WFH status");
        return res.json();
      },
      () => {
        const list = getLocalStorageItem('mock_wfh_requests', []);
        const todayStr = new Date().toISOString().split('T')[0];
        const today = new Date(todayStr);
        return list.some(w => {
          if (w.status !== 'APPROVED') return false;
          const start = new Date(w.startDate);
          const end = new Date(w.endDate);
          return today >= start && today <= end;
        });
      }
    );
  },

  async getDailyDashboard(dateStr) {
    return runWithFallback(
      async () => {
        const url = dateStr ? `${BASE_URL}/attendance/daily-dashboard?date=${dateStr}` : `${BASE_URL}/attendance/daily-dashboard`;
        const res = await fetch(url, { headers: getAuthHeaders() });
        return res.ok ? res.json() : [];
      },
      () => {
        const agents = LocalMockDb.getAgents();
        const dateKey = dateStr || new Date().toISOString().split('T')[0];
        return agents.map((agent, index) => {
          if (index === 0) {
            return {
              id: "att-1",
              user: agent,
              date: dateKey,
              checkInTime: new Date(dateKey + "T09:15:00").toLocaleTimeString(),
              checkOutTime: new Date(dateKey + "T18:05:00").toLocaleTimeString(),
              status: "PRESENT",
              totalBreakMinutes: 45,
              overtimeMinutes: 30,
              checkInLat: 18.5590,
              checkInLon: 73.7868
            };
          } else if (index === 1) {
            return {
              id: "att-2",
              user: agent,
              date: dateKey,
              checkInTime: new Date(dateKey + "T09:45:00").toLocaleTimeString(),
              checkOutTime: null,
              status: "LATE",
              totalBreakMinutes: 15,
              overtimeMinutes: 0,
              checkInLat: 18.5592,
              checkInLon: 73.7870
            };
          } else if (index === 2) {
            return {
              id: "att-3",
              user: agent,
              date: dateKey,
              checkInTime: new Date(dateKey + "T09:05:00").toLocaleTimeString(),
              checkOutTime: new Date(dateKey + "T17:30:00").toLocaleTimeString(),
              status: "PRESENT",
              totalBreakMinutes: 30,
              overtimeMinutes: 0,
              checkInLat: 18.5588,
              checkInLon: 73.7865
            };
          } else {
            return {
              id: "att-" + (index + 1),
              user: agent,
              date: dateKey,
              checkInTime: null,
              checkOutTime: null,
              status: "ABSENT",
              totalBreakMinutes: 0,
              overtimeMinutes: 0
            };
          }
        });
      }
    );
  },

  // --- LEAVES ENDPOINTS ---
  async getLeaveBalance() {
    const res = await fetch(`${BASE_URL}/leaves/balance`, { headers: getAuthHeaders() });
    return res.ok ? res.json() : { casualLeaves: 0, sickLeaves: 0, earnedLeaves: 0 };
  },

  async getMyLeaveRequests() {
    const res = await fetch(`${BASE_URL}/leaves/my-requests`, { headers: getAuthHeaders() });
    return res.ok ? res.json() : [];
  },

  async getPendingLeaveRequests() {
    const res = await fetch(`${BASE_URL}/leaves/pending`, { headers: getAuthHeaders() });
    return res.ok ? res.json() : [];
  },

  async applyLeave(data) {
    const res = await fetch(`${BASE_URL}/leaves/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async approveLeave(id) {
    const res = await fetch(`${BASE_URL}/leaves/${id}/approve`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async rejectLeave(id) {
    const res = await fetch(`${BASE_URL}/leaves/${id}/reject`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // --- CRM & SALES ENDPOINTS ---
  async getLeadTimeline(leadId) {
    const res = await fetch(`${BASE_URL}/leads/${leadId}/timeline`, { headers: getAuthHeaders() });
    return res.ok ? res.json() : [];
  },

  async logLeadActivity(leadId, data) {
    const res = await fetch(`${BASE_URL}/leads/${leadId}/timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async scheduleSiteVisit(data) {
    const res = await fetch(`${BASE_URL}/site-visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getMySiteVisits() {
    const res = await fetch(`${BASE_URL}/site-visits/my-visits`, { headers: getAuthHeaders() });
    return res.ok ? res.json() : [];
  },

  async getAllSiteVisits() {
    const res = await fetch(`${BASE_URL}/site-visits/all`, { headers: getAuthHeaders() });
    return res.ok ? res.json() : [];
  },

  async createBooking(data) {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async confirmBooking(id) {
    const res = await fetch(`${BASE_URL}/bookings/${id}/confirm`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getMyBookings() {
    const res = await fetch(`${BASE_URL}/bookings/my-bookings`, { headers: getAuthHeaders() });
    return res.ok ? res.json() : [];
  },

  async getAllBookings() {
    const res = await fetch(`${BASE_URL}/bookings/all`, { headers: getAuthHeaders() });
    return res.ok ? res.json() : [];
  },

  // --- PAYROLL & ERP ENDPOINTS ---
  async generatePayslip(data) {
    const res = await fetch(`${BASE_URL}/payroll/payslips/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async payPayslip(id) {
    const res = await fetch(`${BASE_URL}/payroll/payslips/${id}/pay`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getMyPayslips() {
    const res = await fetch(`${BASE_URL}/payroll/payslips/my-payslips`, { headers: getAuthHeaders() });
    return res.ok ? res.json() : [];
  },

  async getAllPayslips() {
    const res = await fetch(`${BASE_URL}/payroll/payslips/all`, { headers: getAuthHeaders() });
    return res.ok ? res.json() : [];
  },

  async submitExpense(data) {
    const res = await fetch(`${BASE_URL}/payroll/expenses/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async processExpense(id, status) {
    const res = await fetch(`${BASE_URL}/payroll/expenses/${id}/process`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async getMyExpenses() {
    const res = await fetch(`${BASE_URL}/payroll/expenses/my-expenses`, { headers: getAuthHeaders() });
    return res.ok ? res.json() : [];
  },

  async getPendingExpenses() {
    const res = await fetch(`${BASE_URL}/payroll/expenses/pending`, { headers: getAuthHeaders() });
    return res.ok ? res.json() : [];
  },

  async getAllExpenses() {
    const res = await fetch(`${BASE_URL}/payroll/expenses/all`, { headers: getAuthHeaders() });
    return res.ok ? res.json() : [];
  },

  async getSocieties(page = 0, size = 10) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/societies?page=${page}&size=${size}`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error("Failed to fetch societies");
        return res.json();
      },
      () => {
        const socs = LocalMockDb.getSocieties();
        const start = page * size;
        const pageContent = socs.slice(start, start + size);
        return {
          content: pageContent,
          totalPages: Math.ceil(socs.length / size),
          totalElements: socs.length
        };
      }
    );
  },

  async getSocietyBySlug(slug) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/societies/slug/${slug}`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error("Society not found");
        return res.json();
      },
      () => {
        const socs = LocalMockDb.getSocieties();
        const found = socs.find(s => s.slug === slug);
        if (!found) throw new Error("Society not found");
        return found;
      }
    );
  },

  async createSociety(data) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/societies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to create society");
        return res.json();
      },
      () => {
        const socs = LocalMockDb.getSocieties();
        const newSoc = { id: 'soc-' + (socs.length + 1), slug: data.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-"), ...data };
        socs.push(newSoc);
        LocalMockDb.saveSocieties(socs);
        return newSoc;
      }
    );
  },

  async updateSociety(id, data) {
    return runWithFallback(
      async () => {
        if (isMockId(id)) throw new TypeError('Mock ID bypass');
        const res = await fetch(`${BASE_URL}/societies/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to update society");
        return res.json();
      },
      () => {
        const socs = LocalMockDb.getSocieties();
        const idx = socs.findIndex(s => s.id === id);
        if (idx === -1) throw new Error("Society not found");
        const updated = { ...socs[idx], ...data };
        socs[idx] = updated;
        LocalMockDb.saveSocieties(socs);
        return updated;
      }
    );
  },

  async deleteSociety(id) {
    return runWithFallback(
      async () => {
        if (isMockId(id)) throw new TypeError('Mock ID bypass');
        const res = await fetch(`${BASE_URL}/societies/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to delete society");
        return true;
      },
      () => {
        const socs = LocalMockDb.getSocieties();
        const filtered = socs.filter(s => s.id !== id);
        LocalMockDb.saveSocieties(filtered);
        return true;
      }
    );
  },

  async getBuilders() {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/builders`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error("Failed to fetch builders");
        return res.json();
      },
      () => LocalMockDb.getBuilders()
    );
  },

  async createBuilder(data) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/builders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(data)
        });
        return res.json();
      },
      () => {
        const builders = LocalMockDb.getBuilders();
        const newBuilder = { id: 'builder-' + (builders.length + 1), slug: data.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-"), ...data };
        builders.push(newBuilder);
        LocalMockDb.saveBuilders(builders);
        return newBuilder;
      }
    );
  },

  async getLocalities() {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/localities`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error("Failed to fetch localities");
        return res.json();
      },
      () => LocalMockDb.getLocalities()
    );
  },

  async createLocality(data) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/localities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(data)
        });
        return res.json();
      },
      () => {
        const localities = LocalMockDb.getLocalities();
        const newLoc = { id: 'loc-' + (localities.length + 1), slug: data.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-"), ...data };
        localities.push(newLoc);
        LocalMockDb.saveLocalities(localities);
        return newLoc;
      }
    );
  },

  async getBlogs(page = 0, size = 10) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/blogs?page=${page}&size=${size}`);
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return res.json();
      },
      () => {
        const blogs = LocalMockDb.getBlogs().filter(b => b.published);
        const start = page * size;
        return {
          content: blogs.slice(start, start + size),
          totalElements: blogs.length,
          totalPages: Math.ceil(blogs.length / size)
        };
      }
    );
  },

  async getBlogsAdmin(page = 0, size = 10) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/blogs/admin?page=${page}&size=${size}`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error("Failed to fetch admin blogs");
        return res.json();
      },
      () => {
        const blogs = LocalMockDb.getBlogs();
        const start = page * size;
        return {
          content: blogs.slice(start, start + size),
          totalElements: blogs.length,
          totalPages: Math.ceil(blogs.length / size)
        };
      }
    );
  },

  async getBlogBySlug(slug) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/blogs/slug/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch blog by slug");
        return res.json();
      },
      () => {
        const blog = LocalMockDb.getBlogs().find(b => b.slug === slug);
        if (!blog) throw new Error("Blog not found");
        return blog;
      }
    );
  },

  async createBlog(data) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/blogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to create blog");
        return res.json();
      },
      () => {
        const blogs = LocalMockDb.getBlogs();
        const newBlog = {
          id: 'blog-' + (blogs.length + 1),
          slug: data.slug || data.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-"),
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
          ...data
        };
        blogs.push(newBlog);
        LocalMockDb.saveBlogs(blogs);
        return newBlog;
      }
    );
  },

  async updateBlog(id, data) {
    return runWithFallback(
      async () => {
        if (isMockId(id)) throw new TypeError('Mock ID bypass');
        const res = await fetch(`${BASE_URL}/blogs/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to update blog");
        return res.json();
      },
      () => {
        const blogs = LocalMockDb.getBlogs();
        const idx = blogs.findIndex(b => b.id === id);
        if (idx === -1) throw new Error("Blog not found");
        const updated = { ...blogs[idx], ...data, updatedDate: new Date().toISOString() };
        blogs[idx] = updated;
        LocalMockDb.saveBlogs(blogs);
        return updated;
      }
    );
  },

  async deleteBlog(id) {
    return runWithFallback(
      async () => {
        if (isMockId(id)) throw new TypeError('Mock ID bypass');
        const res = await fetch(`${BASE_URL}/blogs/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to delete blog");
        return true;
      },
      () => {
        const blogs = LocalMockDb.getBlogs();
        const filtered = blogs.filter(b => b.id !== id);
        LocalMockDb.saveBlogs(filtered);
        return true;
      }
    );
  },

  async uploadMedia(file, folder = 'gallery') {
    return runWithFallback(
      async () => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${BASE_URL}/media/upload?folder=${encodeURIComponent(folder)}`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData
        });
        if (!res.ok) throw new Error("Failed to upload media");
        return res.json(); // { url, key, folder }
      },
      () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80" });
          }, 1000);
        });
      }
    );
  },

  /* ─── Enterprise DAM (Digital Asset Management) APIs ─────────── */
  async fetchDamAssets({ category, propertyId, search, page = 0, size = 24 } = {}) {
    return runWithFallback(
      async () => {
        const params = new URLSearchParams();
        if (category && category !== 'ALL') params.append('category', category);
        if (propertyId) params.append('propertyId', propertyId);
        if (search) params.append('search', search);
        params.append('page', page);
        params.append('size', size);

        const res = await fetch(`${BASE_URL}/dam/assets?${params.toString()}`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to fetch DAM assets");
        return res.json();
      },
      () => {
        return {
          content: [
            { id: 1, title: 'Hinjewadi 4K Drone Aerial View', category: 'DRONE_VIDEO', mimeType: 'video/mp4', fileSizeBytes: 24500000, cdnUrl: '/gallery_tower_2.png', thumbnailUrl: '/gallery_tower_2.png', createdBy: 'Admin', createdAt: new Date().toISOString() },
            { id: 2, title: 'Baner Luxury Penthouse Hero', category: 'HERO', mimeType: 'image/webp', fileSizeBytes: 1200000, width: 3840, height: 2160, cdnUrl: '/gallery_vj_supernova_tower.png', thumbnailUrl: '/gallery_vj_supernova_tower.png', createdBy: 'Admin', createdAt: new Date().toISOString() }
          ],
          totalElements: 2,
          totalPages: 1,
          number: 0
        };
      }
    );
  },

  async fetchTrashDamAssets({ page = 0, size = 24 } = {}) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/dam/assets/trash?page=${page}&size=${size}`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to fetch trash assets");
        return res.json();
      },
      () => ({ content: [], totalElements: 0, totalPages: 0, number: 0 })
    );
  },

  async uploadDamAsset(file, { title, category = 'GALLERY', isPrivate = false, propertyId = null } = {}, onProgress) {
    return runWithFallback(
      async () => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const formData = new FormData();
          formData.append('file', file);
          if (title) formData.append('title', title);
          formData.append('category', category);
          formData.append('isPrivate', isPrivate);
          if (propertyId) formData.append('propertyId', propertyId);

          xhr.open('POST', `${BASE_URL}/dam/assets/upload`);
          const headers = getAuthHeaders();
          Object.keys(headers).forEach(k => {
            if (k.toLowerCase() !== 'content-type') xhr.setRequestHeader(k, headers[k]);
          });

          if (xhr.upload && onProgress) {
            xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress(percent);
              }
            };
          }

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try { resolve(JSON.parse(xhr.responseText)); }
              catch { resolve({ message: "Upload success" }); }
            } else {
              reject(new Error("DAM Upload failed with status " + xhr.status));
            }
          };

          xhr.onerror = () => reject(new Error("DAM Upload network error"));
          xhr.send(formData);
        });
      },
      () => ({
        id: Date.now(),
        title: title || file.name,
        category,
        cdnUrl: URL.createObjectURL(file),
        thumbnailUrl: URL.createObjectURL(file),
        fileSizeBytes: file.size,
        mimeType: file.type
      })
    );
  },

  async replaceDamAsset(id, file) {
    return runWithFallback(
      async () => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${BASE_URL}/dam/assets/${id}/replace`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData
        });
        if (!res.ok) throw new Error("Failed to replace asset");
        return res.json();
      },
      () => ({ id, versionNumber: 2, cdnUrl: URL.createObjectURL(file) })
    );
  },

  async getDamPresignedUrl(id, durationMinutes = 60) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/dam/assets/${id}/presigned-url?durationMinutes=${durationMinutes}`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to generate presigned URL");
        return res.json();
      },
      () => ({ presignedUrl: "https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/documents/sample.pdf" })
    );
  },

  async softDeleteDamAsset(id) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/dam/assets/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to delete asset");
        return res.json();
      },
      () => ({ message: "Moved to trash" })
    );
  },

  async restoreDamAsset(id) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/dam/assets/${id}/restore`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to restore asset");
        return res.json();
      },
      () => ({ message: "Restored" })
    );
  },

  async purgeDamAsset(id) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/dam/assets/${id}/purge`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to purge asset");
        return res.json();
      },
      () => ({ message: "Purged" })
    );
  },

  async fetchDamVersions(id) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/dam/assets/${id}/versions`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to fetch versions");
        return res.json();
      },
      () => []
    );
  },

  async fetchDamAuditLogs(id) {
    return runWithFallback(
      async () => {
        const res = await fetch(`${BASE_URL}/dam/assets/${id}/audit-logs`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to fetch audit logs");
        return res.json();
      },
      () => []
    );
  },



  async addToWishlist(propertyId) {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/wishlist/${propertyId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to add to wishlist: ${response.statusText}`);
        }
      },
      () => {
        const saved = localStorage.getItem('wishlist_properties');
        let list = saved ? JSON.parse(saved) : [];
        if (!list.includes(propertyId)) {
          list.push(propertyId);
          localStorage.setItem('wishlist_properties', JSON.stringify(list));
        }
      }
    );
  },

  async removeFromWishlist(propertyId) {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/wishlist/${propertyId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (!response.ok) {
          throw new Error(`Failed to remove from wishlist: ${response.statusText}`);
        }
      },
      () => {
        const saved = localStorage.getItem('wishlist_properties');
        let list = saved ? JSON.parse(saved) : [];
        list = list.filter(id => id !== propertyId);
        localStorage.setItem('wishlist_properties', JSON.stringify(list));
      }
    );
  },

  async getWishlist() {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/wishlist`, {
          headers: getAuthHeaders()
        });
        if (!response.ok) {
          throw new Error(`Failed to get wishlist: ${response.statusText}`);
        }
        return response.json();
      },
      () => {
        const saved = localStorage.getItem('wishlist_properties');
        const list = saved ? JSON.parse(saved) : [];
        const allProps = LocalMockDb.getProperties();
        return allProps.filter(p => list.includes(p.id));
      }
    );
  },

  async getMarketTrends(location) {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/analytics/market-trends?location=${location}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch market trends: ${response.statusText}`);
        }
        return response.json();
      },
      () => {
        const defaultTrends = {
          HINJEWADI: { pricePerSqft: 7800, yield: '5.2%', growth: '+11%' },
          BANER: { pricePerSqft: 11500, yield: '3.8%', growth: '+16%' },
          WAKAD: { pricePerSqft: 8200, yield: '4.5%', growth: '+14%' },
          BALEWADI: { pricePerSqft: 10200, yield: '4.0%', growth: '+13%' },
          TATHAWADE: { pricePerSqft: 7200, yield: '4.6%', growth: '+15%' },
          MAHALUNGE: { pricePerSqft: 6900, yield: '4.8%', growth: '+18%' }
        };
        const upper = location.toUpperCase();
        const trend = defaultTrends[upper] || defaultTrends.BANER;
        
        const months = ["Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026"];
        const growthRate = parseFloat(trend.growth) / 100.0;
        const monthGrowth = growthRate / 12.0;
        const historicalData = months.map((m, idx) => {
          const discount = (12 - idx) * monthGrowth;
          return {
            month: m,
            price: Math.round(trend.pricePerSqft * (1.0 - discount))
          };
        });
        
        return {
          location: upper,
          averagePricePerSqft: `₹${trend.pricePerSqft.toLocaleString()}`,
          appreciationRate: trend.growth,
          rentalYield: trend.yield,
          historicalData
        };
      }
    );
  },

  // ─── Auth Methods ─────────────────────────────────────────────────────────

  /** Step 1: MFA login init — returns { tempToken, emailMasked, devMockOtp } */
  async loginInit(username, password) {
    const response = await fetch(`${BASE_URL}/auth/login-init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, rememberDevice: false }),
    });
    if (!response.ok) {
      const text = await response.text().catch(() => 'Authentication failed');
      throw new Error(text || 'Invalid credentials');
    }
    return response.json();
  },

  /** Step 2: MFA OTP verify — returns { token, refreshToken, role, fullName, username } */
  async loginVerify(tempToken, code) {
    const response = await fetch(`${BASE_URL}/auth/login-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempToken, code }),
    });
    if (!response.ok) {
      const text = await response.text().catch(() => 'Verification failed');
      throw new Error(text || 'Invalid OTP');
    }
    return response.json();
  },

  /** Classic single-step login (no MFA) */
  async login(username, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const text = await response.text().catch(() => 'Login failed');
      throw new Error(text || 'Invalid credentials');
    }
    return response.json();
  },

  /** Refresh the access token using the stored refresh token */
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) throw new Error('Refresh failed');
    const data = await response.json();
    localStorage.setItem('token', data.accessToken);
    return data.accessToken;
  },

  /** Clear all auth state from localStorage */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('username');
  },

  /** List all users (SUPER_ADMIN only) */
  async listUsers() {
    const response = await fetch(`${BASE_URL}/users`, {
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  /** Change a user's role (SUPER_ADMIN only) */
  async changeUserRole(userId, role) {
    const response = await fetch(`${BASE_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error('Failed to update role');
    return response.json();
  },

  /** Soft-delete a user (SUPER_ADMIN only) */
  async deleteUser(userId) {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },

  // ─── LEADS API ─────────────────────────────────────────────────────────────
  async getLeads({ status, preferredLocation, page = 0, size = 10, sortBy = 'createdDate', direction = 'desc' } = {}) {
    let url = `${BASE_URL}/leads?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
    if (status && status !== 'ALL') url += `&status=${status}`;
    if (preferredLocation) url += `&preferredLocation=${preferredLocation}`;

    const response = await fetch(url, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch leads');
    return response.json();
  },

  async getLeadById(id) {
    const response = await fetch(`${BASE_URL}/leads/${id}`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch lead');
    return response.json();
  },

  async createLead(leadData) {
    const response = await fetch(`${BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(leadData)
    });
    if (!response.ok) throw new Error('Failed to create lead');
    return response.json();
  },

  async updateLeadStatus(id, status) {
    const response = await fetch(`${BASE_URL}/leads/${id}/status?status=${status}`, {
      method: 'PATCH',
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to update lead status');
    return response.json();
  },

  async assignLeadAgent(id, agentId) {
    const response = await fetch(`${BASE_URL}/leads/${id}/assign/${agentId}`, {
      method: 'PATCH',
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to assign agent');
    return response.json();
  },

  async deleteLead(id) {
    const response = await fetch(`${BASE_URL}/leads/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to delete lead');
    return true;
  },

  // ─── DASHBOARD & ANALYTICS API ─────────────────────────────────────────────
  async getDashboardStats() {
    const response = await fetch(`${BASE_URL}/dashboard/stats`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },

  async getCrmAnalytics() {
    const response = await fetch(`${BASE_URL}/crm/analytics/pipeline`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch CRM analytics');
    return response.json();
  },

  // ─── EMPLOYEES & AGENTS API ────────────────────────────────────────────────
  async getAgents() {
    const response = await fetch(`${BASE_URL}/agents`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch agents');
    return response.json();
  },

  async getEmployees() {
    const response = await fetch(`${BASE_URL}/employees`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  },

  // ─── SOCIETIES API ────────────────────────────────────────────────────────
  async getSocieties() {
    const response = await fetch(`${BASE_URL}/societies`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch societies');
    return response.json();
  },

  // ─── ATTENDANCE & LEAVES API ───────────────────────────────────────────────
  async getAttendance({ employeeId, date } = {}) {
    let url = `${BASE_URL}/attendance`;
    const params = [];
    if (employeeId) params.push(`employeeId=${employeeId}`);
    if (date) params.push(`date=${date}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    const response = await fetch(url, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch attendance');
    return response.json();
  },

  async getLeaves() {
    const response = await fetch(`${BASE_URL}/leaves`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch leaves');
    return response.json();
  },

  // ─── LEADS DATABASE CAPTURE & SYNC API ──────────────────────────────────────
  async submitLeadToDatabase(leadData) {
    // 1. Format payload to match Spring Boot LeadRequest DTO
    const cleanPhone = (leadData.phone || '').replace(/\D/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : (leadData.phone.startsWith('+') ? leadData.phone : `+91${cleanPhone}`);
    
    let locationEnum = 'HINJEWADI';
    const loc = (leadData.location || leadData.preferredLocation || '').toUpperCase();
    if (loc.includes('WAKAD')) locationEnum = 'WAKAD';
    else if (loc.includes('BANER')) locationEnum = 'BANER';
    else if (loc.includes('KHARADI')) locationEnum = 'KHARADI';
    else if (loc.includes('BALEWADI')) locationEnum = 'BALEWADI';
    else if (loc.includes('TATHAWADE')) locationEnum = 'TATHAWADE';

    const payload = {
      name: leadData.name || 'Anonymous Visitor',
      phone: formattedPhone,
      email: (leadData.email && leadData.email.includes('@')) ? leadData.email : `${cleanPhone || 'visitor'}@24krealtors.com`,
      requirementType: leadData.requirementType || 'BUY_RESIDENTIAL',
      budgetMin: leadData.budgetMin || 6500000,
      budgetMax: leadData.budgetMax || 15000000,
      preferredLocation: locationEnum,
      notes: leadData.notes || `Submitted via ${leadData.source || 'Website Portal'} on ${new Date().toLocaleString()}`,
      propertyId: leadData.propertyId || null
    };

    // 2. Also save to mock_leads in localStorage for instant CRM view sync
    try {
      const existingLeads = JSON.parse(localStorage.getItem('mock_leads') || '[]');
      const newMockLead = {
        id: `LD-${Date.now().toString().slice(-6)}`,
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        requirementType: payload.requirementType,
        budgetMin: payload.budgetMin,
        budgetMax: payload.budgetMax,
        location: payload.preferredLocation,
        status: 'NEW',
        notes: payload.notes,
        score: 75,
        createdDate: new Date().toISOString(),
        source: leadData.source || '24K Web Portal'
      };
      existingLeads.unshift(newMockLead);
      localStorage.setItem('mock_leads', JSON.stringify(existingLeads.slice(0, 100)));
    } catch (err) {
      console.warn('[Lead Storage] LocalStorage sync skipped:', err);
    }

    // 3. POST to Spring Boot Backend DB Endpoint (/api/v1/leads)
    try {
      const response = await fetch(`${BASE_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        console.warn('[Backend API] Leads endpoint returned non-200 status:', response.status);
        return { success: true, offline: true, payload };
      }
      const data = await response.json();
      console.info('[Backend API] Lead successfully stored in DB ✓', data);
      return { success: true, data };
    } catch (error) {
      console.warn('[Backend API] Network error posting lead to DB, cached in offline CRM:', error);
      return { success: true, offline: true, payload };
    }
  },

  async submitLead(leadData) {
    return this.submitLeadToDatabase(leadData);
  },

  // ─── AUDIT LOGS API ────────────────────────────────────────────────────────
  async getAuditLogs({ page = 0, size = 20 } = {}) {
    const response = await fetch(`${BASE_URL}/audit-logs?page=${page}&size=${size}`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch audit logs');
    return response.json();
  },

  // ─── TASKS & SITE VISITS API ──────────────────────────────────────────────
  async getTasks({ leadId, status } = {}) {
    let url = `${BASE_URL}/tasks`;
    if (leadId) url += `?leadId=${leadId}`;
    const response = await fetch(url, { headers: { ...getAuthHeaders() } });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  async createTask(taskData) {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(taskData)
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  async updateTaskStatus(id, status) {
    const response = await fetch(`${BASE_URL}/tasks/${id}/status?status=${status}`, {
      method: 'PATCH',
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to update task status');
    return response.json();
  },

  // ─── BLOGS & ARTICLES API ──────────────────────────────────────────────────
  async getBlogs() {
    const response = await fetch(`${BASE_URL}/blogs`, { headers: { ...getAuthHeaders() } });
    if (!response.ok) throw new Error('Failed to fetch blogs');
    return response.json();
  },

  async createBlog(blogData) {
    const response = await fetch(`${BASE_URL}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(blogData)
    });
    if (!response.ok) throw new Error('Failed to create blog');
    return response.json();
  },

  // ─── WHATSAPP & CAMPAIGNS API ─────────────────────────────────────────────
  async sendCampaign(campaignData) {
    const response = await fetch(`${BASE_URL}/whatsapp/send-bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(campaignData)
    });
    if (!response.ok) throw new Error('Failed to trigger campaign');
    return response.json();
  },

  async getWhatsAppLogs() {
    const response = await fetch(`${BASE_URL}/whatsapp/logs`, { headers: { ...getAuthHeaders() } });
    if (!response.ok) throw new Error('Failed to fetch whatsapp logs');
    return response.json();
  }
};


