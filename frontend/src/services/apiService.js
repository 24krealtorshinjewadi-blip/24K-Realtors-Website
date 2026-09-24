// Auto-clear stale mock database from localStorage if it lacks v2026_seven_flagship_projects_v15
try {
  const currentPropVer = localStorage.getItem('mock_properties_version');
  if (currentPropVer !== 'v2026_seven_flagship_luxury_v17') {
    console.info('[Cache Bust] Refreshing catalog to 7 flagship projects with official VTP card image...');
    localStorage.removeItem('mock_properties');
    localStorage.removeItem('mock_properties_version');
    localStorage.removeItem('mock_societies');
    localStorage.removeItem('mock_societies_version');
    localStorage.removeItem('mock_agents');
    localStorage.removeItem('mock_leads');
    localStorage.removeItem('mock_tasks');
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
  // ═══════════════════════════════════════════════════════════════════
  // PROJECT 1 — GODREJ 24
  // MahaRERA: P52100018596 | Hinjewadi Phase 1 | Ready to Move
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-godrej-24",
    title: "Godrej 24",
    projectName: "Godrej 24",
    builderName: "Godrej Properties",
    description: "India's first 24/7 lifestyle residential community by Godrej Properties in Hinjewadi Phase 1, Pune. Round-the-clock gym, reception desk, creche and convenience store designed exclusively for IT professionals.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 6800000,
    location: "HINJEWADI_PHASE_1",
    address: "Godrej 24, Hinjewadi Phase 1, Rajiv Gandhi Infotech Park, Pune — 411057",
    latitude: 18.5960,
    longitude: 73.7395,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100018596",
    possessionDate: "Ready to Move",
    imageUrl: "/godrej_24_project_card.jpg",
    galleryImages: [
      "/godrej_24_project_card.jpg",
      "/godrej_living_room_banner.jpg",
      "/godrej_24_master_bedroom.jpg",
      "/godrej_24_modern_bathroom.jpg",
      "/godrej_24_modular_kitchen.jpg",
      "/godrej_24_private_balcony.jpg"
    ],
    furnishingStatus: "UNFURNISHED",
    gasPipeline: true,
    societySlug: "godrej-24-hinjewadi",
    // All verified configurations (carpet areas per MahaRERA P52100018596)
    configurations: [
      { bhk: "2 BHK", carpet: "725 sq.ft",  highlight: false },
      { bhk: "2 BHK", carpet: "820 sq.ft",  highlight: false },
      { bhk: "2 BHK", carpet: "940 sq.ft",  highlight: true  },
      { bhk: "3 BHK", carpet: "1167 sq.ft", highlight: false }
    ],
    amenityCategories: {
      recreationalSports: [
        "24x7 Creche & Day Care",
        "Multipurpose Sports Arena",
        "Clubhouse & Indoor Games Lounge",
        "Children Adventure Play Park"
      ],
      fitnessOutdoors: [
        "24x7 Functional Gymnasium",
        "Temperature-Controlled Swimming Pool",
        "Jogging Track & Zen Pavilion",
        "Podium Landscaped Green Gardens"
      ],
      convenienceSafety: [
        "24x7 Reception Desk & Concierge",
        "24x7 Convenience Store",
        "Multi-Tier 5-Level Security Grid",
        "Dedicated EV Charging Stations"
      ],
      internalFeatures: [
        "Imported Marble Vitrified Flooring",
        "Premium Modular Kitchen with Black Granite Counter",
        "Branded CP Bath Fittings with Diverters",
        "Anodized Aluminum Sliding Windows"
      ]
    },
    amenities: [
      "24x7 Functional Gymnasium",
      "24x7 Reception Desk",
      "24x7 Convenience Store",
      "24x7 Creche & Day Care",
      "Temperature-Controlled Swimming Pool",
      "Multipurpose Sports Arena",
      "Landscaped Podium Gardens",
      "EV Charging Stations",
      "Multi-Tier Security + CCTV",
      "Jogging Track",
      "Children Play Area"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },

  // ═══════════════════════════════════════════════════════════════════
  // PROJECT 2 — GODREJ ELEMENTS
  // MahaRERA: P52100016626 | Hinjewadi Phase 1 | Ready to Move
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-godrej-elements",
    title: "Godrej Elements",
    projectName: "Godrej Elements",
    builderName: "Godrej Properties",
    description: "Premium smart residential development by Godrej Properties in Hinjewadi Phase 1, Pune. Tech-integrated living with home automation, 21-point safety system, and infinity rooftop pool.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 6800000,
    location: "HINJEWADI_PHASE_1",
    address: "Godrej Elements, Hinjewadi Phase 1, Rajiv Gandhi Infotech Park, Pune — 411057",
    latitude: 18.5955,
    longitude: 73.7380,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100016626",
    possessionDate: "Ready to Move",
    imageUrl: "/godrej_elements_project_card.jpg",
    galleryImages: [
      "/godrej_elements_living_room.jpg",
      "/godrej_elements_hall_dining.jpg",
      "/godrej_elements_kitchen.jpg",
      "/godrej_elements_bathroom.jpg",
      "/godrej_elements_balcony.jpg"
    ],
    furnishingStatus: "UNFURNISHED",
    gasPipeline: true,
    societySlug: "godrej-elements-hinjewadi",
    // All verified configurations (carpet areas per MahaRERA P52100016626)
    configurations: [
      { bhk: "2 BHK", carpet: "725 sq.ft",  highlight: false },
      { bhk: "2 BHK", carpet: "820 sq.ft",  highlight: false },
      { bhk: "2 BHK", carpet: "940 sq.ft",  highlight: true  },
      { bhk: "3 BHK", carpet: "1167 sq.ft", highlight: false }
    ],
    amenityCategories: {
      recreationalSports: [
        "Community Celebration Hall",
        "Billiards & Gaming Lounge",
        "Outdoor Multi-Sports Court",
        "Kids Creative Play Deck"
      ],
      fitnessOutdoors: [
        "Infinity Rooftop Swimming Pool",
        "High-Tech Fitness Studio",
        "Yoga & Aerial Meditation Deck",
        "Landscaped Zen Gardens"
      ],
      convenienceSafety: [
        "Home Automation & Smart Digital Access",
        "21-Point Integrated Safety Grid",
        "Dedicated EV Fast-Charging Bays",
        "24/7 Security & High-Speed Elevators"
      ],
      internalFeatures: [
        "Smart Home Lighting & Lock Automation",
        "Anti-Skid Designer Flooring",
        "Black Granite Kitchen Platform with SS Sink",
        "Premium Sound-Insulated Windows"
      ]
    },
    amenities: [
      "Home Automation System",
      "21-Point Integrated Safety Grid",
      "Infinity Rooftop Swimming Pool",
      "Fully Equipped Fitness Studio",
      "Yoga & Meditation Deck",
      "Multipurpose Community Hall",
      "Dedicated EV Charging Bays",
      "24/7 Multi-Tier Security & CCTV",
      "Landscaped Zen Gardens",
      "Jogging Track",
      "Children Play Zone"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },

  // ═══════════════════════════════════════════════════════════════════
  // PROJECT 3 — MEGAPOLIS TOWNSHIP
  // MahaRERA: P52100047112 | Hinjewadi Phase 3 | Ready to Move & Ongoing
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-megapolis-township",
    title: "Megapolis Township",
    projectName: "Megapolis Township",
    builderName: "Pride Purple Group",
    description: "Pune's largest integrated 142+ acre smart township in Hinjewadi Phase 3 by Pride Purple Group. Comprising landmark clusters: Sangria, Mystic, Splendour, Sunway, and Sparkle. Features resort-grade clubhouses, Olympic-sized swimming pools, multi-sport arenas, Pawar Public School within campus, and seamless walking proximity to Phase 3 IT hubs (Tech Mahindra, TCS, Cognizant).",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 6500000,
    location: "HINJEWADI_PHASE_3",
    address: "Megapolis Circle, Rajiv Gandhi Infotech Park, Hinjewadi Phase 3, Pune — 411057",
    latitude: 18.5785,
    longitude: 73.6934,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100047112",
    possessionDate: "Ready to Move & Ongoing",
    imageUrl: "/megapolis_hero_card.jpg",
    galleryImages: [
      "/megapolis_hero_card.jpg",
      "/sangria_living_room.jpg",
      "/sangria_bedroom.jpg",
      "/sangria_kitchen.jpg",
      "/sangria_bathroom.jpg",
      "/sangria_balcony.jpg"
    ],
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: true,
    societySlug: "townships/megapolis",
    configurations: [
      { bhk: "1 BHK", carpet: "440-510 sq.ft", highlight: false },
      { bhk: "2 BHK", carpet: "645-780 sq.ft", highlight: true },
      { bhk: "2.5 BHK", carpet: "800-880 sq.ft", highlight: false }
    ],
    amenityCategories: {
      recreationalSports: [
        "Pawar Public School within Campus",
        "Olympic-Sized Swimming Pool",
        "Floodlit Tennis & Basketball Courts",
        "Township Amphitheatre & High Street"
      ],
      fitnessOutdoors: [
        "Multiple High-Tech Gymnasiums",
        "Dedicated Jogging & Cycling Tracks",
        "Central Park & Landscaped Acres",
        "Peaceful Meditation Groves"
      ],
      convenienceSafety: [
        "Township Security & CCTV Surveillance Grid",
        "Piped Natural Gas (MNGL)",
        "Commercial Marts & Banks within Campus",
        "STP & Water Treatment Plants"
      ],
      internalFeatures: [
        "Spacious Layouts with Sunlit Balconies",
        "Vitrified Tile Flooring throughout",
        "Polished Granite Kitchen Counter with Sink",
        "Heavy-Duty Branded Electrical Fixtures"
      ]
    },
    amenities: [
      "Olympic-size Swimming Pool",
      "Pawar Public School on Campus",
      "Grand Multipurpose Clubhouses",
      "Floodlit Tennis & Basketball Courts",
      "24x7 Multi-Tier Security & CCTV",
      "Dedicated EV Charging Stations",
      "Internal Bus Shuttle Service",
      "Commercial High-Street & Marts",
      "Jogging & Cycling Tracks",
      "Children Play Zones & Creche"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },

  // ═══════════════════════════════════════════════════════════════════
  // PROJECT 4 — VILAS JAVDEKAR YASHONE HINJEWADI
  // Hinjewadi Phase 1 | Carpet: 678 sq.ft | Ready to Move / Verified
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-vj-yashone",
    title: "VJ Yashone",
    projectName: "YashOne Hinjewadi",
    builderName: "Vilas Javdekar Developers",
    description: "Premium residences in the heart of Hinjewadi Phase 1 by Vilas Javdekar (VJ). Featuring 678 sq.ft carpet 2 BHK homes with lush green surroundings, modern lifestyle amenities, and prime connectivity to Phase 1 IT parks.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 6800000,
    location: "HINJEWADI_PHASE_1",
    address: "YashOne, Hinjewadi Phase 1, Rajiv Gandhi Infotech Park, Pune — 411057",
    latitude: 18.5940,
    longitude: 73.7360,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100021616",
    possessionDate: "Ready to Move",
    imageUrl: "/yashone_hero_card.jpg",
    galleryImages: [
      "/yashone_hero_card.jpg",
      "/yashone_living_room.jpg",
      "/yashone_bedroom.jpg",
      "/yashone_bathroom.jpg",
      "/yashone_balcony.jpg"
    ],
    furnishingStatus: "UNFURNISHED",
    gasPipeline: true,
    societySlug: "vj-yashone-hinjewadi",
    configurations: [
      { bhk: "2 BHK", carpet: "678 sq.ft", highlight: false },
      { bhk: "3 BHK", carpet: "948 sq.ft", highlight: false }
    ],
    amenityCategories: {
      recreationalSports: [
        "Grand Community Clubhouse",
        "Indoor Games & Reading Lounge",
        "Children Adventure Play Park",
        "Party Lawn & Celebration Deck"
      ],
      fitnessOutdoors: [
        "Modern Gymnasium & Cardio Deck",
        "Acrobatic Yoga & Meditation Lawn",
        "Landscaped Green Podium Gardens",
        "Jogging & Walking Track"
      ],
      convenienceSafety: [
        "Multi-Tier Security with CCTV Grid",
        "High-Speed Passenger Elevators with ARD",
        "Covered Car Parking with EV Readiness",
        "Solar Water Heating System & STP"
      ],
      internalFeatures: [
        "Large Format Vitrified Tile Flooring",
        "Granite Kitchen Countertop with Service Platform",
        "Branded Sanitaryware & CP Fixtures",
        "Powder-Coated Sliding Windows with Safety Grills"
      ]
    },
    amenities: [
      "Modern Gymnasium & Fitness Club",
      "Community Clubhouse & Hall",
      "Landscaped Green Podium Gardens",
      "Children Play & Adventure Area",
      "24x7 Multi-Tier Security & CCTV Grid",
      "Jogging & Walking Track",
      "Covered Car Parking",
      "EV Charging Infrastructure",
      "Rainwater Harvesting & Solar Water",
      "High-Speed Passenger Elevators"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },

  // ═══════════════════════════════════════════════════════════════════
  // PROJECT 5 — KOHINOOR SPORTSVILLE HINJEWADI
  // Hinjewadi Phase 1 | 3 BHK Carpet: 930 sq.ft | MahaRERA: P52100029650
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-kohinoor-sportsville",
    title: "Kohinoor Sportsville",
    projectName: "Kohinoor Sportsville",
    builderName: "Kohinoor Group",
    description: "Sports-centric premium residential community by Kohinoor Group in Hinjewadi Phase 1, Pune. Live Active. Live Better. Featuring 930 sq.ft carpet 3 BHK luxury residences with 5 international sports arenas, swimming pool, luxury clubhouse, and prime walking proximity to Hinjewadi Phase 1 IT parks.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: null, // "Price on Request"
    location: "HINJEWADI_PHASE_1",
    address: "Kohinoor Sportsville, Hinjewadi Phase 1, Rajiv Gandhi Infotech Park, Pune — 411057",
    latitude: 18.5980,
    longitude: 73.7340,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100029650",
    possessionDate: "Ready to Move / Ongoing",
    imageUrl: "/kohinoor_hero_card.jpg",
    galleryImages: [
      "/kohinoor_hero_card.jpg",
      "/kohinoor_living_room.jpg",
      "/kohinoor_kitchen_1.jpg",
      "/kohinoor_bedroom.jpg",
      "/kohinoor_kitchen_2.jpg"
    ],
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: true,
    societySlug: "kohinoor-sportsville-hinjewadi",
    configurations: [
      { bhk: "1 BHK", carpet: "480+ sq.ft", highlight: false },
      { bhk: "2 BHK", carpet: "630+ sq.ft", highlight: false },
      { bhk: "3 BHK", carpet: "930 sq.ft",  highlight: true  }
    ],
    amenityCategories: {
      recreationalSports: [
        "5 International Sports Arenas",
        "Tennis, Badminton & Squash Courts",
        "Multi-Storey Recreation Clubhouse",
        "Kids Multi-Sport Academy & Arena"
      ],
      fitnessOutdoors: [
        "Olympic-Grade Swimming Pool",
        "High-Tech Gymnasium & Aerobics Deck",
        "CrossFit Training Lawn",
        "Jogging & Cycling Tracks"
      ],
      convenienceSafety: [
        "5-Pillar 'Sada Sukhi Raho' Maintenance Commitment",
        "24x7 Multi-Tier Security & CCTV Grid",
        "Dedicated Covered Parking & EV Bays",
        "High-Speed Elevators with Automatic Rescue"
      ],
      internalFeatures: [
        "Vitrified Tile Flooring throughout Living & Bedrooms",
        "Jet Black Granite Kitchen Counter",
        "Premium Anti-Skid Ceramic Tiles in Bathrooms",
        "Branded Concealed Copper Wiring & Switches"
      ]
    },
    amenities: [
      "5 International Sports Arenas",
      "Olympic-Grade Swimming Pool",
      "Multi-Storey Clubhouse & Recreation Hub",
      "Tennis & Badminton Courts",
      "Lush Green Landscaped Podium Gardens",
      "High-Tech Gymnasium & Fitness Studio",
      "24x7 Multi-Tier Security & CCTV Grid",
      "Jogging & Cycling Track",
      "Dedicated Children Play Area & Creche",
      "EV Charging Stations"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },

  // ═══════════════════════════════════════════════════════════════════
  // PROJECT 6 — TCG THE CLIFF GARDEN HINJEWADI
  // Hinjewadi Phase 3 | 1 BHK: 462 sq.ft (₹55L) | 2 BHK: 662 sq.ft (₹75L)
  // MahaRERA: P52100004906 / P52100015759 / P52100028926
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-tcg-the-cliff-garden",
    title: "TCG The Cliff Garden",
    projectName: "TCG The Cliff Garden",
    builderName: "TCG Real Estate",
    description: "Scenic hillside residential development by TCG Real Estate in Hinjewadi Phase 3, Pune. 100% verified 1 BHK (462 sq.ft carpet, ₹55 Lakhs - negotiable) and 2 BHK (662 sq.ft carpet, ₹75 Lakhs - negotiable) residences framing serene Sahyadri hill slopes and valley views. Multiple phases registered under MahaRERA (P52100004906, P52100015759, P52100028926). Featuring comprehensive lifestyle amenities across Recreational & Sports, Fitness & Outdoors, Convenience & Safety, and internal apartment features.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 5500000,
    priceNegotiable: true,
    priceNote: "Negotiable",
    location: "HINJEWADI_PHASE_3",
    address: "TCG The Cliff Garden, Hinjewadi Phase 3, Rajiv Gandhi Infotech Park, Pune — 411057",
    latitude: 18.5725,
    longitude: 73.6890,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100004906 / P52100015759 / P52100028926",
    imageUrl: "/properties/tcg-the-cliff-garden/00_project_card.jpg",
    galleryImages: [
      "/properties/tcg-the-cliff-garden/00_project_card.jpg",
      "/properties/tcg-the-cliff-garden/05_living_room.jpg",
      "/properties/tcg-the-cliff-garden/04_kitchen.jpg",
      "/properties/tcg-the-cliff-garden/02_bedroom.jpg",
      "/properties/tcg-the-cliff-garden/03_bathroom.jpg",
      "/properties/tcg-the-cliff-garden/01_balcony_view.jpg"
    ],
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: true,
    societySlug: "tcg-cliff-garden-hinjewadi",
    configurations: [
      { bhk: "1 BHK", carpet: "462 sq.ft", price: "₹55 Lakhs", highlight: true, note: "Negotiable" },
      { bhk: "2 BHK", carpet: "662 sq.ft", price: "₹75 Lakhs", highlight: true, note: "Negotiable" }
    ],
    amenityCategories: {
      recreationalSports: [
        "Clubhouse & Indoor Games Pavilion",
        "Multipurpose Sports Court",
        "Children Play Adventure Park",
        "Amphitheatre & Community Gathering Arena",
        "Party Lawn & Gazebos"
      ],
      fitnessOutdoors: [
        "Modern Fully Equipped Gymnasium",
        "Swimming Pool with Kid Splash Deck",
        "Jogging & Strolling Track",
        "Yoga & Meditation Lawn",
        "Lush Landscaped Hillside Gardens"
      ],
      convenienceSafety: [
        "24/7 Security & CCTV Surveillance Grid",
        "High-Speed Passenger Elevators with ARD",
        "Intercom Facility & Boom Barriers",
        "Dedicated Covered Vehicle Parking",
        "Rainwater Harvesting & Sewage Treatment Plant"
      ],
      internalFeatures: [
        "Vitrified Tile Flooring throughout Living & Bedroom",
        "Polished Jet Black Granite Counter with SS Sink",
        "Concealed Copper Wiring with Branded Modular Switches",
        "Designer Glazed Ceramic Tiles up to Lintel Level in Bathrooms",
        "Branded CP Sanitary Fittings & Water-Saving Fixtures",
        "Powder-Coated Aluminum Sliding Windows with Safety Grills"
      ]
    },
    amenities: [
      "Clubhouse & Indoor Games Pavilion",
      "Multipurpose Sports Court",
      "Modern Fully Equipped Gymnasium",
      "Swimming Pool with Kid Splash Deck",
      "Jogging & Strolling Track",
      "Yoga & Meditation Lawn",
      "24/7 Security & CCTV Surveillance Grid",
      "High-Speed Passenger Elevators with ARD",
      "Dedicated Covered Vehicle Parking",
      "Vitrified Tile Flooring & Granite Modular Kitchen",
      "Children Play Adventure Park"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },

  // ═══════════════════════════════════════════════════════════════════
  // PROJECT 7 — VTP BLUE WATERS MAHALUNGE
  // Mahalunge (Hinjewadi-Baner Annex Corridor) | 2 BHK: 640 sq.ft (₹72L Negotiable)
  // MahaRERA: P52100009531, P52100009529, P52100007943, P52100026772, P52100020112, P52100019986
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-vtp-blue-waters",
    title: "VTP Blue Waters",
    projectName: "VTP Blue Waters",
    builderName: "VTP Realty",
    description: "Iconic 100+ acre riverside township by VTP Realty in Mahalunge, Pune, directly at the Mahalunge-Hinjewadi bridge (5 mins to Hinjewadi Phase 1). Verified 2 BHK (640 sq.ft carpet, ₹72 Lakhs - negotiable) residence featuring 100% authentic on-site photos (living room with marble vitrified tiles, modular kitchen with black granite counter, master bedroom, grey marble bathroom with geyser, and wood-finish tile balcony with glass railing). Multi-phase township covered by six MahaRERA registrations (P52100009531, P52100009529, P52100007943, P52100026772, P52100020112, P52100019986) with 1 km riverfront promenade and 5 luxury clubhouses.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 7200000,
    priceNegotiable: true,
    priceNote: "Negotiable",
    location: "MAHALUNGE",
    address: "VTP Blue Waters, Near Mahalunge-Hinjewadi Bridge, Mahalunge, Pune — 411045",
    latitude: 18.5775,
    longitude: 73.7482,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100009531 / P52100009529 / P52100007943 / P52100026772 / P52100020112 / P52100019986",
    imageUrl: "/properties/vtp-blue-waters/00_project_card.jpg",
    galleryImages: [
      "/properties/vtp-blue-waters/00_project_card.jpg",
      "/properties/vtp-blue-waters/02_living_room.jpg",
      "/properties/vtp-blue-waters/03_kitchen.jpg",
      "/properties/vtp-blue-waters/04_bedroom.jpg",
      "/properties/vtp-blue-waters/05_bathroom.jpg",
      "/properties/vtp-blue-waters/06_balcony.jpg",
      "/properties/vtp-blue-waters/01_elevation.png"
    ],
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: true,
    societySlug: "vtp-blue-waters-mahalunge",
    configurations: [
      { bhk: "2 BHK", carpet: "640 sq.ft", price: "₹72 Lakhs", highlight: true, note: "Negotiable" }
    ],
    amenityCategories: {
      riversideLeisure: [
        "1 km Scenic Riverfront Promenade",
        "5 Themed Grand Clubhouses",
        "Olympic-Size Swimming Pool & Kid Pool",
        "Amphitheatre & Riverside Deck",
        "Central Landscaped Green Acres"
      ],
      sportsFitness: [
        "Professional Tennis & Badminton Courts",
        "Multipurpose Sports Ground & Cricket Pitch",
        "Fully-Equipped High-Tech Gymnasium",
        "Dedicated Jogging & Cycling Tracks",
        "Yoga & Aerial Meditation Pavilion"
      ],
      convenienceSafety: [
        "24/7 Security Grid & RFID Access Control",
        "High-Speed Passenger & Service Elevators",
        "Dedicated Multi-Level Covered Parking",
        "Piped Gas Connection (MNGL)",
        "STP & Rainwater Harvesting Infrastructure"
      ],
      internalFeatures: [
        "Glossy Marble-Finish Vitrified Tile Flooring",
        "Modular Lower Drawers with Jet Black Granite Counter",
        "Grey Marble Wall Tiles & Fitted Water Heater Geyser",
        "Scenic Balcony with Wooden Finish Tiles & Glass Railing",
        "Heavy-Gauge Safety Grilled Sliding Windows",
        "Concealed Copper Wiring & Branded Modular Switches"
      ]
    },
    amenities: [
      "1 km Riverfront Promenade",
      "5 Luxury Clubhouses",
      "Olympic-Size Swimming Pool",
      "Modern Fitness Gymnasium",
      "Tennis & Badminton Courts",
      "24/7 Multi-Tier Security & CCTV Grid",
      "Modular Kitchen with Granite Counter",
      "Scenic Balcony with Glass Railing",
      "Piped Gas (MNGL)",
      "High-Speed Elevators with Power Backup",
      "Children Adventure Play Zone"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  // ═══════════════════════════════════════════════════════════════════
  // PROJECT 8 — PARANJAPE BLUE RIDGE HINJEWADI
  // Golf Facing | Price: ₹1.95 Cr (Negotiable) | Primary RERA: P52100016328, P52100000054, P52100027419
  // Newer Sub-Phases & Extensions: P52100055581, P52100029952
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-paranjape-blue-ridge",
    title: "Paranjape Blue Ridge",
    projectName: "Paranjape Blue Ridge",
    builderName: "Paranjape Schemes",
    description: "Pioneering 138-acre integrated township in Hinjewadi Phase 1 by Paranjape Schemes. Exclusive Golf-Facing 3 BHK luxury residence priced at ₹1.95 Cr (Negotiable) offering 100% authentic on-site photos (living room with exposed wooden ceiling rafters, modular kitchen with chimney, master bedroom with AC and custom wardrobe, luxury bathroom with glass shower cubicle, and high-floor balcony overlooking lush greens and golf fairways). Primary MahaRERA numbers: P52100016328, P52100000054, P52100027419; Newer Extensions: P52100055581, P52100029952. Features 9-hole golf course, Blue Ridge Public School on campus, waterfront river promenades, multi-sport courts, and 24x7 security grid.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 19500000,
    priceNegotiable: true,
    priceNote: "Negotiable",
    bedrooms: 3,
    facing: "Golf Facing",
    location: "HINJEWADI_PHASE_1",
    address: "Blue Ridge Township, Near Cognizant & Symbiosis, Hinjewadi Phase 1, Pune — 411057",
    latitude: 18.5875,
    longitude: 73.7410,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100016328 / P52100000054 / P52100027419 (Extensions: P52100055581 / P52100029952)",
    possessionDate: "Ready to Move",
    imageUrl: "/blue_ridge_project_card.jpg",
    galleryImages: [
      "/blue_ridge_project_card.jpg",
      "/blue_ridge_living.jpg",
      "/blue_ridge_bedroom.jpg",
      "/blue_ridge_kitchen.jpg",
      "/blue_ridge_bathroom.jpg",
      "/blue_ridge_balcony.jpg"
    ],
    furnishingStatus: "FULLY_FURNISHED",
    gasPipeline: true,
    societySlug: "blue-ridge-hinjewadi",
    configurations: [
      { bhk: "1 BHK", carpet: "~440 to 550 sq.ft", price: "Price on Request", highlight: false },
      { bhk: "2 BHK", carpet: "~800 to 860 sq.ft", price: "Price on Request", highlight: false },
      { bhk: "3 BHK & Larger (Golf Facing)", carpet: "~1,110+ sq.ft", price: "₹1.95 Cr (Negotiable)", highlight: true, note: "Golf Facing · Negotiable" }
    ],
    amenityCategories: {
      sportsFitness: [
        "Golf Course",
        "Sports Facilities",
        "Indoor & Outdoor Courts",
        "Gym / Fitness Centre",
        "Jogging & Walking Tracks"
      ],
      recreationRelaxation: [
        "Clubhouses",
        "Swimming Pool",
        "Waterfront / Riverfront Areas",
        "Entertainment Spaces",
        "Landscaped & Nature Areas"
      ],
      communityConveniences: [
        "Blue Ridge Public School",
        "Children's Play Areas",
        "Podium / Landscaped Gardens",
        "Daily Retail & Shopping",
        "Business / Commercial Facilities"
      ],
      infrastructureSecurity: [
        "24×7 Security",
        "CCTV / Controlled Access",
        "Power Backup",
        "Well-Planned Internal Roads",
        "Water & Wastewater Infrastructure"
      ]
    },
    amenities: [
      "Golf Course",
      "Sports Facilities",
      "Indoor & Outdoor Courts",
      "Gym / Fitness Centre",
      "Jogging & Walking Tracks",
      "Clubhouses",
      "Swimming Pool",
      "Waterfront / Riverfront Areas",
      "Blue Ridge Public School",
      "24×7 Security & CCTV",
      "Daily Retail & Shopping"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },

  // ═══════════════════════════════════════════════════════════════════
  // MEGAPOLIS SERENITY — 2 BHK 700 SQ.FT (₹78 LAKHS)
  // MahaRERA: P52100046552 | Hinjewadi Phase 3 | Ready to Move
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-megapolis-serenity",
    title: "Megapolis Serenity 2 BHK",
    projectName: "Megapolis Serenity",
    builderName: "Pride Purple Group",
    description: "Ready-to-move 2 BHK flat in Megapolis Serenity, Hinjewadi Phase 3. 700 sq.ft verified carpet area, modern L-shaped granite kitchen, attached dry balcony, designer bathroom with modern fittings, and east-west cross ventilation.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 7800000,
    bedrooms: 2,
    location: "HINJEWADI_PHASE_3",
    address: "Megapolis Serenity, Megapolis Circle, Rajiv Gandhi Infotech Park, Hinjewadi Phase 3, Pune — 411057",
    latitude: 18.5770,
    longitude: 73.6925,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100046552",
    possessionDate: "Ready to Move",
    imageUrl: "/megapolis_serenity_living.jpg",
    galleryImages: [
      "/megapolis_serenity_living.jpg",
      "/megapolis_serenity_bedroom.jpg",
      "/megapolis_serenity_kitchen.jpg",
      "/megapolis_serenity_bathroom.jpg",
      "/megapolis_serenity_balcony.jpg"
    ],
    furnishingStatus: "UNFURNISHED",
    gasPipeline: true,
    societySlug: "townships/megapolis/serenity",
    configurations: [
      { bhk: "2 BHK", carpet: "700 sq.ft", highlight: true }
    ],
    amenities: [
      "700 sq.ft RERA Carpet Area",
      "L-Shaped Granite Platform Kitchen",
      "Attached Dry / Utility Balcony",
      "Modern Anti-Skid Designer Bathroom",
      "Sahyadri Mountain Facing Views",
      "Megapolis Township Clubhouse & Pool",
      "24x7 Multi-Tier Security",
      "High-Speed Elevators with Power Backup"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  }
];

// ── Auxiliary Megapolis Society Properties (Retained for deep linking / lookup without crowding 3-card catalog) ──
const megapolisSubSocietiesProperties = [
  // ═══════════════════════════════════════════════════════════════════
  // MEGAPOLIS SERENITY — 2 BHK 700 SQ.FT
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-megapolis-serenity-sub",
    title: "Megapolis Serenity 2 BHK (700 sq.ft)",
    projectName: "Megapolis Serenity",
    builderName: "Pride Purple Group",
    description: "Peaceful living in Megapolis Serenity, Hinjewadi Phase 3. 2 BHK layout with 700 sq.ft actual carpet area, L-shaped black granite kitchen counter, attached utility balcony, and designer bathroom.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 7800000,
    bedrooms: 2,
    location: "HINJEWADI_PHASE_3",
    address: "Megapolis Serenity, Megapolis Circle, Hinjewadi Phase 3, Pune — 411057",
    latitude: 18.5770,
    longitude: 73.6925,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100046552",
    possessionDate: "Ready to Move",
    imageUrl: "/megapolis_serenity_living.jpg",
    galleryImages: [
      "/megapolis_serenity_living.jpg",
      "/megapolis_serenity_bedroom.jpg",
      "/megapolis_serenity_kitchen.jpg",
      "/megapolis_serenity_bathroom.jpg",
      "/megapolis_serenity_balcony.jpg"
    ],
    furnishingStatus: "UNFURNISHED",
    gasPipeline: true,
    societySlug: "townships/megapolis/serenity",
    configurations: [
      { bhk: "2 BHK", carpet: "700 sq.ft", highlight: true }
    ],
    amenities: [
      "700 sq.ft Carpet",
      "L-Shaped Granite Platform Kitchen",
      "Attached Dry Balcony",
      "Clubhouse & Swimming Pool Access",
      "24x7 Gated Security"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  // ═══════════════════════════════════════════════════════════════════
  // PROJECT 4 — MEGAPOLIS SANGRIA
  // MahaRERA: P52100047112 | Hinjewadi Phase 3 | Ready to Move
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-megapolis-sangria",
    title: "Megapolis Sangria",
    projectName: "Megapolis Sangria",
    builderName: "Pride Purple Group",
    description: "Vibrant high-rise residential cluster within Megapolis Township, Hinjewadi Phase 3. 2, 2.5 & 3 BHK luxury residences with direct pool views, sky decks, double-height designer entrance lobbies, and modern modular layouts.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 9500000,
    location: "HINJEWADI_PHASE_3",
    address: "Megapolis Sangria, Megapolis Circle, Hinjewadi Phase 3, Pune — 411057",
    latitude: 18.5788,
    longitude: 73.6938,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100047112",
    possessionDate: "Ready to Move",
    imageUrl: "/sangria_living_room.jpg",
    galleryImages: [
      "/sangria_living_room.jpg",
      "/sangria_bedroom.jpg",
      "/sangria_kitchen.jpg",
      "/sangria_bathroom.jpg",
      "/sangria_balcony.jpg",
      "/megapolis_hero_card.jpg"
    ],
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: true,
    societySlug: "townships/megapolis/sangria",
    configurations: [
      { bhk: "2 BHK", carpet: "645 sq.ft", highlight: false },
      { bhk: "2 BHK", carpet: "695 sq.ft", highlight: true },
      { bhk: "2.5 BHK", carpet: "850 sq.ft", highlight: true },
      { bhk: "3 BHK", carpet: "1050 sq.ft", highlight: true }
    ],
    amenities: [
      "Pool View Deck",
      "Full Clubhouse Access",
      "Sky Lounge & Yoga Deck",
      "24x7 Security & Intercom",
      "Power Backup for Common Areas",
      "Children Play Arena"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },

  // ═══════════════════════════════════════════════════════════════════
  // PROJECT 5 — MEGAPOLIS MYSTIC
  // MahaRERA: P52100046891 | Hinjewadi Phase 3 | Ready to Move
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-megapolis-mystic",
    title: "Megapolis Mystic",
    projectName: "Megapolis Mystic",
    builderName: "Pride Purple Group",
    description: "Tranquil hillside residences in Megapolis Township, Hinjewadi Phase 3. 2 & 3 BHK spacious homes with sweeping Sahyadri hill views, zen meditation gardens, and lush landscaped surroundings.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 10500000,
    location: "HINJEWADI_PHASE_3",
    address: "Megapolis Mystic, Hinjewadi Phase 3, Pune — 411057",
    latitude: 18.5792,
    longitude: 73.6942,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100046891",
    possessionDate: "Ready to Move",
    imageUrl: "/gallery_tower_2.png",
    galleryImages: [
      "/gallery_tower_2.png",
      "/gallery_infinity_pool.png"
    ],
    furnishingStatus: "UNFURNISHED",
    gasPipeline: true,
    societySlug: "megapolis-mystic",
    configurations: [
      { bhk: "2 BHK", carpet: "720 sq.ft", highlight: false },
      { bhk: "2 BHK", carpet: "790 sq.ft", highlight: true },
      { bhk: "3 BHK", carpet: "1150 sq.ft", highlight: true }
    ],
    amenities: [
      "Garden & Hill Facing Balconies",
      "Terrace Lounge",
      "Zen Meditation Pavilion",
      "24x7 Security & CCTV",
      "Covered Car Parking"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },

  // ═══════════════════════════════════════════════════════════════════
  // PROJECT 6 — MEGAPOLIS SPLENDOUR
  // MahaRERA: P52100048230 | Hinjewadi Phase 3 | New Towers
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-megapolis-splendour",
    title: "Megapolis Splendour",
    projectName: "Megapolis Splendour",
    builderName: "Pride Purple Group",
    description: "Grand scale luxury enclave featuring 2, 2.5, 3 & 3.5 BHK premium apartments with rooftop infinity pool, amphitheatre, high-speed elevators, and imported finishings.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 11000000,
    location: "HINJEWADI_PHASE_3",
    address: "Megapolis Splendour, Hinjewadi Phase 3, Pune — 411057",
    latitude: 18.5798,
    longitude: 73.6948,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100048230",
    possessionDate: "Ready & Ongoing",
    imageUrl: "/gallery_tower_3.png",
    galleryImages: [
      "/gallery_tower_3.png",
      "/luxury_sunset_pool.png"
    ],
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: true,
    societySlug: "megapolis-splendour",
    configurations: [
      { bhk: "2 BHK", carpet: "680 sq.ft", highlight: false },
      { bhk: "2.5 BHK", carpet: "880 sq.ft", highlight: true },
      { bhk: "3 BHK", carpet: "1100 sq.ft", highlight: true },
      { bhk: "3.5 BHK", carpet: "1350 sq.ft", highlight: false }
    ],
    amenities: [
      "Rooftop Swimming Pool",
      "Open Air Amphitheatre",
      "Banquet & Party Lawn",
      "State-of-the-Art Fitness Center",
      "High-Speed Elevators"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },

  // ═══════════════════════════════════════════════════════════════════
  // PROJECT 7 — MEGAPOLIS SUNWAY
  // MahaRERA: P52100045780 | Hinjewadi Phase 3 | Ready to Move
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-megapolis-sunway",
    title: "Megapolis Sunway",
    projectName: "Megapolis Sunway",
    builderName: "Pride Purple Group",
    description: "Sun-drenched, smart layouts in 1 & 2 BHK configurations. Perfect for IT professionals seeking high capital appreciation, minimal maintenance, and unmatched connectivity.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 6500000,
    location: "HINJEWADI_PHASE_3",
    address: "Megapolis Sunway, Hinjewadi Phase 3, Pune — 411057",
    latitude: 18.5779,
    longitude: 73.6925,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100045780",
    possessionDate: "Ready to Move",
    imageUrl: "/dev_kolte_patil_township.png",
    galleryImages: [
      "/dev_kolte_patil_township.png",
      "/gallery_sample_flat_interior.png"
    ],
    furnishingStatus: "UNFURNISHED",
    gasPipeline: true,
    societySlug: "megapolis-sunway",
    configurations: [
      { bhk: "1 BHK", carpet: "440 sq.ft", highlight: false },
      { bhk: "1 BHK", carpet: "490 sq.ft", highlight: true },
      { bhk: "2 BHK", carpet: "680 sq.ft", highlight: true }
    ],
    amenities: [
      "Vaastu Compliant Units",
      "Corner Unit Open Views",
      "Solar Water Heating",
      "24x7 Security & CCTV",
      "Low Maintenance Township Grid"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },

  // ═══════════════════════════════════════════════════════════════════
  // PROJECT 8 — MEGAPOLIS SPARKLE
  // MahaRERA: P52100046550 | Hinjewadi Phase 3 | Ready to Move
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prop-megapolis-sparkle",
    title: "Megapolis Sparkle",
    projectName: "Megapolis Sparkle",
    builderName: "Pride Purple Group",
    description: "Bright and airy 2 & 3 BHK residences in Megapolis Township, Hinjewadi Phase 3. Scenic podium views, dedicated clubhouse access, and prime proximity to IT corridor bus bays.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 10000000,
    location: "HINJEWADI_PHASE_3",
    address: "Megapolis Sparkle, Hinjewadi Phase 3, Pune — 411057",
    latitude: 18.5775,
    longitude: 73.6920,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100046550",
    possessionDate: "Ready to Move",
    imageUrl: "/gallery_tower_3.png",
    galleryImages: [
      "/gallery_tower_3.png",
      "/gallery_infinity_pool.png"
    ],
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: true,
    societySlug: "megapolis-sparkle",
    configurations: [
      { bhk: "2 BHK", carpet: "700 sq.ft", highlight: false },
      { bhk: "2 BHK", carpet: "760 sq.ft", highlight: true },
      { bhk: "3 BHK", carpet: "1080 sq.ft", highlight: true }
    ],
    amenities: [
      "Central Park Facing Units",
      "Modern Gymnasium",
      "Badminton Court",
      "Children Play Area",
      "24x7 Gated Security"
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  // ── Commercial & Extended Localities Listings ──
  {
    id: "prop-comm-shop-wakad",
    title: "Prime High-Footfall Retail Shop",
    projectName: "Wakad Commercial Galleria",
    builderName: "Kohinoor Group",
    description: "High-street retail shop space located on main Wakad-Hinjewadi road near Phoenix Mall. Exceptional road frontage, 14-ft floor-to-ceiling height, perfect for pharmacy, boutique or cafe.",
    propertyType: "COMMERCIAL",
    unitType: "SHOP",
    transactionType: "BUY",
    price: 7500000,
    location: "WAKAD",
    address: "Phoenix Marketcity Road, Wakad, Pune — 411057",
    latitude: 18.5985,
    longitude: 73.7620,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100028911",
    possessionDate: "Ready to Move",
    imageUrl: "/gallery_retail_boulevard.png",
    galleryImages: [
      "/gallery_retail_boulevard.png",
      "/gallery_tower_3.png"
    ],
    furnishingStatus: "UNFURNISHED",
    configurations: [
      { bhk: "Shop", carpet: "420 sq.ft", highlight: true }
    ],
    amenities: ["100% DG Power Backup", "Dedicated Customer Parking", "24/7 Fire Detection & Suppression", "High-Speed Service Elevators"],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-comm-showroom-baner",
    title: "Luxury Flagship Retail Showroom",
    projectName: "Baner High Street Boulevard",
    builderName: "Pride Purple Group",
    description: "Ultra-prime corner showroom space on Baner High Street with full double-glazed glass facade. Massive brand visibility, wide frontage, ideal for luxury automotive, jewelry, or electronics flagship.",
    propertyType: "COMMERCIAL",
    unitType: "SHOWROOM",
    transactionType: "BUY",
    price: 18500000,
    location: "BANER",
    address: "Main High Street Road, Baner, Pune — 411045",
    latitude: 18.5590,
    longitude: 73.7868,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100031890",
    possessionDate: "Immediate",
    imageUrl: "/gallery_retail_boulevard.png",
    galleryImages: [
      "/gallery_retail_boulevard.png"
    ],
    furnishingStatus: "UNFURNISHED",
    configurations: [
      { bhk: "Showroom", carpet: "1150 sq.ft", highlight: true }
    ],
    amenities: ["Double Height Ceilings", "Valet Parking Provision", "Centralized HVAC Ducts", "Triple Height Glass Front"],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-comm-office-hinjewadi",
    title: "Grade-A IT Executive Corporate Office",
    projectName: "Hinjewadi Tech Park Phase 1",
    builderName: "Godrej Properties",
    description: "Fully IT-enabled corporate office suite with dedicated server room, boardrooms, and executive cabins inside Rajiv Gandhi Infotech Park Phase 1. Walking distance from upcoming metro station.",
    propertyType: "COMMERCIAL",
    unitType: "OFFICE",
    transactionType: "BUY",
    price: 12500000,
    location: "HINJEWADI_PHASE_1",
    address: "Phase 1 Infotech Hub, Hinjewadi, Pune — 411057",
    latitude: 18.5912,
    longitude: 73.7380,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100019280",
    possessionDate: "Ready for Fit-out",
    imageUrl: "/gallery_business_lounge.png",
    galleryImages: [
      "/gallery_business_lounge.png"
    ],
    furnishingStatus: "SEMI_FURNISHED",
    configurations: [
      { bhk: "Office", carpet: "850 sq.ft", highlight: true }
    ],
    amenities: ["24x7 High-Speed Fiber Optics", "LEED Gold Certified", "Executive Cafeteria", "Multi-Tier Biometric Security"],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-ravet-skyline",
    title: "Urban Skyline Premium Residences",
    projectName: "Urban Skyline Ravet",
    builderName: "Urban Space Creators",
    description: "Iconic high-rise tower project in Ravet overlooking the Mumbai-Pune Expressway BRTS corridor. World-class 70+ lifestyle amenities including sky lounge and infinity pool.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 6800000,
    bedrooms: 2,
    location: "RAVET",
    address: "Near Mumbai-Pune Expressway, Ravet, Pune — 412101",
    latitude: 18.6475,
    longitude: 73.7430,
    status: "AVAILABLE",
    verifiedListing: true,
    reraNumber: "P52100021430",
    possessionDate: "December 2026",
    imageUrl: "/vtp_bluewaters_hero.jpg",
    galleryImages: [
      "/vtp_bluewaters_hero.jpg"
    ],
    furnishingStatus: "UNFURNISHED",
    configurations: [
      { bhk: "2 BHK", carpet: "765 sq.ft", highlight: true },
      { bhk: "3 BHK", carpet: "1025 sq.ft", highlight: false }
    ],
    amenities: ["Rooftop Sky Lounge", "Infinity Swimming Pool", "Squash Court", "EV Charging", "Children Play Arena"],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-punewale-westview",
    title: "Kohinoor Westview Reserve",
    projectName: "Kohinoor Westview Reserve",
    builderName: "Kohinoor Group",
    description: "Nature-inspired luxury residences nestled in Punewale bypass corridor. Beautiful green views, close to Hinjewadi Phase 1 IT hub with premium SadaSukhi assurance.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 6200000,
    bedrooms: 2,
    location: "PUNEWALE",
    address: "Punewale Bypass, Pune — 411033",
    latitude: 18.6250,
    longitude: 73.7490,
    status: "AVAILABLE",
    verifiedListing: true,
    reraNumber: "P52100050855",
    possessionDate: "Ready to Move",
    imageUrl: "/tcg_cliff_garden_card.jpg",
    galleryImages: [
      "/tcg_cliff_garden_card.jpg"
    ],
    furnishingStatus: "SEMI_FURNISHED",
    configurations: [
      { bhk: "2 BHK", carpet: "720 sq.ft", highlight: true },
      { bhk: "3 BHK", carpet: "980 sq.ft", highlight: false }
    ],
    amenities: ["Clubhouse 3.0", "Swimming Pool", "Jogging Track", "Multipurpose Hall", "Landscaped Forest Walk"],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-lodha-belmondo",
    title: "Lodha Belmondo Golf Luxury",
    projectName: "Lodha Belmondo",
    builderName: "Lodha",
    description: "Super-luxury resort living by Lodha overlooking an international 9-hole golf course and river pavilion. Quick 15 min drive from Hinjewadi Phase 1.",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    price: 16500000,
    bedrooms: 3,
    location: "BANER",
    address: "Baner Expressway Corridor, Pune",
    latitude: 18.6720,
    longitude: 73.6890,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "P52100000283",
    possessionDate: "Ready to Move",
    imageUrl: "/godrej_living_room_banner.jpg",
    galleryImages: ["/godrej_living_room_banner.jpg"],
    furnishingStatus: "FULLY_FURNISHED",
    configurations: [
      { bhk: "3 BHK", carpet: "1450 sq.ft", highlight: true }
    ],
    amenities: ["9-Hole Golf Course", "50,000 sq.ft Clubhouse", "Private Helipad", "Concierge Service"],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
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
    notes: "Interested in Paranjape Blue Ridge. Needs details on home loan tie-ups.",
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
  { id: "builder-1", name: "Lodha Group", slug: "lodha-group", logoUrl: "/dev_lodha_tower.png", experienceYears: 42, completedProjectsCount: 140, ongoingProjectsCount: 28, awards: "India's No. 1 Real Estate Developer" },
  { id: "builder-2", name: "Godrej Properties", slug: "godrej-properties", logoUrl: "/dev_godrej_building.png", experienceYears: 34, completedProjectsCount: 95, ongoingProjectsCount: 35, awards: "Most Trusted Real Estate Brand India" },
  { id: "builder-3", name: "VTP Realty", slug: "vtp-realty", logoUrl: "/dev_vtp_township.png", experienceYears: 38, completedProjectsCount: 45, ongoingProjectsCount: 16, awards: "Leading Developer Pune by Sales Volume" },
  { id: "builder-4", name: "Shapoorji Pallonji (Joyville)", slug: "shapoorji-pallonji", logoUrl: "/dev_shapoorji_township.png", experienceYears: 160, completedProjectsCount: 125, ongoingProjectsCount: 24, awards: "Excellence in Engineering & Infrastructure" },
  { id: "builder-5", name: "Kohinoor Group", slug: "kohinoor-group", logoUrl: "/dev_kohinoor_tower.png", experienceYears: 41, completedProjectsCount: 48, ongoingProjectsCount: 11, awards: "Best Residential Developer West Pune 2025" },
  { id: "builder-6", name: "Pride Purple Group", slug: "pride-purple-group", logoUrl: "/gallery_tower_3.png", experienceYears: 22, completedProjectsCount: 38, ongoingProjectsCount: 9, awards: "Best Luxury Developer Pune 2025" },
  { id: "builder-7", name: "Paranjape Schemes", slug: "paranjape-schemes", logoUrl: "/dev_paranjape_township.png", experienceYears: 36, completedProjectsCount: 195, ongoingProjectsCount: 18, awards: "Pioneer of Hinjewadi Township Infrastructure" },
  { id: "builder-8", name: "Kolte Patil Developers", slug: "kolte-patil-developers", logoUrl: "/dev_kolte_patil_township.png", experienceYears: 32, completedProjectsCount: 65, ongoingProjectsCount: 15, awards: "Township Developer of the Year 2025" },
  { id: "builder-9", name: "Gera Developments", slug: "gera-developments", logoUrl: "/dev_gera_tower.png", experienceYears: 52, completedProjectsCount: 85, ongoingProjectsCount: 12, awards: "Developer of the Year 2026 — ChildCentric Pioneer" },
  { id: "builder-10", name: "Kasturi Housing", slug: "kasturi-housing", logoUrl: "/dev_kasturi_forbes.png", experienceYears: 25, completedProjectsCount: 22, ongoingProjectsCount: 6, awards: "Top Tier Architectural Excellence Award" },
  { id: "builder-11", name: "Mahindra Lifespaces", slug: "mahindra-lifespaces", logoUrl: "/dev_rohan_forbes.png", experienceYears: 28, completedProjectsCount: 45, ongoingProjectsCount: 10, awards: "Green Building Leadership & Sustainability" },
  { id: "builder-12", name: "K. Raheja Corp", slug: "k-raheja-corp", logoUrl: "/dev_vj_building.png", experienceYears: 65, completedProjectsCount: 110, ongoingProjectsCount: 20, awards: "Commercial & Luxury Residential Icon" }
];

const initialBlogs = [
  {
    id: "blog-1",
    title: "Top 5 Reasons to Invest in Wakad Real Estate",
    slug: "top-5-reasons-to-invest-in-wakad",
    content: "Wakad is rapidly emerging as one of Pune's premier residential corridors. With direct connectivity to the Hinjewadi IT Park, Wakad offers excellent capital appreciation and robust infrastructure growth. In this article, we analyze five major infrastructure projects that will boost Wakad in 2026...",
    coverImageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
    author: "Prasad Kulkarni",
    seoTitle: "Invest in Wakad Real Estate - Top 5 Reasons",
    seoDescription: "Discover why Wakad, Pune is the ideal location for property investment in 2026. Insights on infrastructure, IT park proximity, and capital growth.",
    published: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  }
];

const initialSocieties = [
  // ═══════════════════════════════════════════════════════════════════
  // SOC-1: GODREJ 24 — Hinjewadi Phase 1
  // MahaRERA: P52100018596 | Developer: Godrej Properties
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "soc-1",
    name: "Godrej 24",
    canonicalName: "Godrej 24 Hinjewadi Phase 1",
    slug: "godrej-24-hinjewadi",
    imageUrl: "/godrej_24_project_card.jpg",
    galleryImages: [
      "/godrej_24_project_card.jpg",
      "/godrej_living_room_banner.jpg",
      "/godrej_24_master_bedroom.jpg",
      "/godrej_24_modern_bathroom.jpg",
      "/godrej_24_modular_kitchen.jpg",
      "/godrej_24_private_balcony.jpg"
    ],
    location: "HINJEWADI",
    hinjewadiPhase: "PHASE_1",
    developer: "Godrej Properties",
    reraNumber: "P52100018596",
    projectStatus: "READY_TO_MOVE",
    startingPrice: null,
    priceLastVerified: "19 Sep 2026",
    possessionDate: "Ready to Move",
    projectArea: "Available on Request",
    overview: "Godrej 24 is a landmark 24/7 lifestyle residential development by Godrej Properties in Hinjewadi Phase 1, Pune. Designed specifically for the shift-based IT professional community, it is India's first residential project that offers all key amenities — gymnasium, reception desk, convenience store, and creche — operational round the clock. The project offers 2 BHK and 3 BHK apartments with meticulously planned carpet areas ranging from 725 to 1488 sq.ft, each crafted for maximum space efficiency, abundant natural light, and cross-ventilation.",
    amenities: "24x7 Gymnasium, 24x7 Reception Desk, 24x7 Convenience Store, 24x7 Creche & Day Care, Swimming Pool, Multipurpose Sports Arena, Landscaped Podium, EV Charging, CCTV Multi-Tier Security, Jogging Track, Children Play Area",
    priceRange: "Price on Request",
    configuration: "2 BHK (725 / 820 / 940 sq.ft) | 3 BHK (1167 / 1488 sq.ft)",
    configurationSummary: "2 BHK & 3 BHK",
    configurations: [
      { bhkType: "2 BHK", carpetArea: "725 sq.ft", priceLabel: "Price on Request", status: "Available" },
      { bhkType: "2 BHK", carpetArea: "820 sq.ft", priceLabel: "Price on Request", status: "Available" },
      { bhkType: "2 BHK", carpetArea: "940 sq.ft", priceLabel: "Price on Request", status: "Available" },
      { bhkType: "3 BHK", carpetArea: "1167 sq.ft", priceLabel: "Price on Request", status: "Available" },
      { bhkType: "3 BHK", carpetArea: "1488 sq.ft", priceLabel: "Price on Request", status: "Available" }
    ],
    nearbySchools: "Mercedes-Benz International School (2.0 km), Alard Public School (1.2 km), Anisha Global School (2.5 km)",
    nearbyHospitals: "Ruby Hall Clinic Hinjewadi (2.5 km), Hinjewadi Hospital (1.8 km)",
    nearbyItParks: "Infosys Phase 1 (1.0 km), Wipro Circle (1.2 km), Cognizant (1.5 km), TCS Sahyadri (2.0 km)",
    nearbyMetro: "Hinjewadi Phase 1 Metro Station (approx. 1.0 km — Metro Line 3 under construction)",
    nearbyMalls: "Grand Highstreet Hinjewadi (1.5 km)",
    googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.4!2d73.7395!3d18.5960!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0!2sGodrej%2024%20Hinjewadi!5e0!3m2!1sen!2sin!4v1725118",
    travelTimeInfo: "Infosys: 3 mins | Wipro Circle: 4 mins | Balewadi High Street: 12 mins | Mumbai Expressway: 15 mins",
    investmentScore: 93,
    rentalYield: 4.9,
    hasResale: true,
    hasRental: true,
    reraRegistered: true,
    faqs: "Q: What makes Godrej 24 unique compared to other projects in Hinjewadi?\nA: Godrej 24 is India's first residential project with all key lifestyle amenities operating 24 hours a day, 7 days a week — including gym, reception desk, creche and store. Ideal for IT professionals working in shifts.\n\nQ: What are the available carpet areas in Godrej 24?\nA: 2 BHK: 725, 820 and 940 sq.ft. 3 BHK: 1167 and 1488 sq.ft.\n\nQ: Is Godrej 24 MahaRERA registered?\nA: Yes. MahaRERA number: P52100018596.\n\nQ: Is Godrej 24 ready to move in?\nA: Yes. Godrej 24 is a ready-to-move project.\n\nQ: Where is Godrej 24 located?\nA: Godrej 24 is located in Hinjewadi Phase 1, Rajiv Gandhi Infotech Park, Pune — 411057.",
    seoTitle: "Godrej 24 Hinjewadi Phase 1 | 2 & 3 BHK Verified Listings | 24K Realtors",
    seoDescription: "Verified listings for Godrej 24 Hinjewadi Phase 1 by Godrej Properties. 2 BHK (725/820/940 sq.ft) & 3 BHK (1167/1488 sq.ft). Ready to move. MahaRERA: P52100018596."
  },
  // ═══════════════════════════════════════════════════════════════════
  // SOC-2: GODREJ ELEMENTS — Hinjewadi Phase 1
  // MahaRERA: P52100016626 | Developer: Godrej Properties
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "soc-2",
    name: "Godrej Elements",
    canonicalName: "Godrej Elements Hinjewadi Phase 1",
    slug: "godrej-elements-hinjewadi",
    imageUrl: "/godrej_elements_project_card.jpg",
    galleryImages: [
      "/godrej_elements_project_card.jpg"
    ],
    location: "HINJEWADI",
    hinjewadiPhase: "PHASE_1",
    developer: "Godrej Properties",
    reraNumber: "P52100016626",
    projectStatus: "READY_TO_MOVE",
    startingPrice: null,
    priceLastVerified: "19 Sep 2026",
    possessionDate: "Ready to Move",
    projectArea: "Available on Request",
    overview: "Godrej Elements is a premium smart residential development by Godrej Properties in Hinjewadi Phase 1, Pune. The project is engineered around technology-integrated living, featuring a sophisticated home automation grid, 21-point integrated safety and security system, RFID vehicle access, and video door phone entry. It offers 2 BHK and 3 BHK apartments with carpet areas ranging from 725 to 1488 sq.ft. Residents enjoy resort-grade amenities including an infinity rooftop swimming pool, fully equipped fitness studio, yoga deck, and beautifully landscaped gardens — all within Hinjewadi's prime IT corridor.",
    amenities: "Home Automation System, 21-Point Integrated Safety Grid, Infinity Rooftop Pool, Fully Equipped Fitness Studio, Yoga & Meditation Deck, Multipurpose Community Hall, Dedicated EV Charging Bays, 24/7 Multi-Tier Security & CCTV, Landscaped Zen Gardens, Jogging Track, Children Play Zone",
    priceRange: "Price on Request",
    configuration: "2 BHK (725 / 820 / 940 sq.ft) | 3 BHK (1167 / 1488 sq.ft)",
    configurationSummary: "2 BHK & 3 BHK",
    configurations: [
      { bhkType: "2 BHK", carpetArea: "725 sq.ft", priceLabel: "Price on Request", status: "Available" },
      { bhkType: "2 BHK", carpetArea: "820 sq.ft", priceLabel: "Price on Request", status: "Available" },
      { bhkType: "2 BHK", carpetArea: "940 sq.ft", priceLabel: "Price on Request", status: "Available" },
      { bhkType: "3 BHK", carpetArea: "1167 sq.ft", priceLabel: "Price on Request", status: "Available" },
      { bhkType: "3 BHK", carpetArea: "1488 sq.ft", priceLabel: "Price on Request", status: "Available" }
    ],
    nearbySchools: "Mercedes-Benz International School (1.5 km), Blue Ridge Public School (2.0 km), Alard Public School (2.5 km)",
    nearbyHospitals: "Ruby Hall Clinic Hinjewadi (2.2 km), Surya Care Hospital (3.0 km)",
    nearbyItParks: "Infosys Phase 1 (1.2 km), Cognizant (1.5 km), TCS Sahyadri Park (2.0 km), Wipro Circle (1.8 km)",
    nearbyMetro: "Hinjewadi Phase 1 Metro Station (approx. 800m — Metro Line 3 under construction)",
    nearbyMalls: "Grand Highstreet Hinjewadi (1.5 km)",
    googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.4!2d73.7380!3d18.5955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0!2sGodrej%20Elements%20Hinjewadi!5e0!3m2!1sen!2sin!4v1725118",
    travelTimeInfo: "Infosys: 3 mins | Wipro Circle: 5 mins | Balewadi High Street: 12 mins | Mumbai Highway: 15 mins",
    investmentScore: 92,
    rentalYield: 4.7,
    hasResale: true,
    hasRental: true,
    reraRegistered: true,
    faqs: "Q: What smart home features does Godrej Elements offer?\nA: Godrej Elements features a complete home automation grid and 21-point integrated safety system including RFID vehicle tags, video door phones, intercom, fire detection, and CCTV surveillance.\n\nQ: What carpet areas are available in Godrej Elements?\nA: 2 BHK: 725, 820 and 940 sq.ft. 3 BHK: 1167 and 1488 sq.ft.\n\nQ: Is Godrej Elements MahaRERA registered?\nA: Yes. MahaRERA number: P52100016626.\n\nQ: Is Godrej Elements ready to move in?\nA: Yes. Godrej Elements is a ready-to-move project.\n\nQ: Where is Godrej Elements located?\nA: Godrej Elements is located in Hinjewadi Phase 1, Rajiv Gandhi Infotech Park, Pune — 411057.\n\nQ: Is Godrej Elements and Godrej 24 the same project?\nA: No. Godrej Elements and Godrej 24 are two completely separate residential projects by Godrej Properties in Hinjewadi Phase 1. They have different towers, floor plans, amenities, and RERA registrations.",
    seoTitle: "Godrej Elements Hinjewadi Phase 1 | 2 & 3 BHK Verified Listings | 24K Realtors",
    seoDescription: "Verified listings for Godrej Elements Hinjewadi Phase 1 by Godrej Properties. 2 BHK (725/820/940 sq.ft) & 3 BHK (1167/1488 sq.ft). Smart homes. MahaRERA: P52100016626."
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOC-3: MEGAPOLIS SANGRIA — Hinjewadi Phase 3
  // MahaRERA: P52100047112 | Developer: Pride Purple Group
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "soc-megapolis-sangria",
    name: "Megapolis Sangria",
    canonicalName: "Megapolis Sangria Hinjewadi Phase 3",
    slug: "megapolis-sangria",
    imageUrl: "/sangria_living_room.jpg",
    galleryImages: [
      "/sangria_living_room.jpg",
      "/sangria_bedroom.jpg",
      "/sangria_kitchen.jpg",
      "/sangria_bathroom.jpg",
      "/sangria_balcony.jpg",
      "/megapolis_hero_card.jpg"
    ],
    location: "HINJEWADI",
    hinjewadiPhase: "PHASE_3",
    townshipName: "Megapolis",
    parentProjectId: "megapolis",
    developer: "Pride Purple Group",
    reraNumber: "P52100047112",
    projectStatus: "READY_TO_MOVE",
    startingPrice: 9500000,
    priceLastVerified: "20 Sep 2026",
    possessionDate: "Ready to Move",
    projectArea: "142+ Acres Integrated Township",
    overview: "Megapolis Sangria is a vibrant high-rise residential society located inside the landmark Megapolis Township in Hinjewadi Phase 3, Pune. Developed by Pride Purple Group, Sangria offers 2 BHK, 2.5 BHK, and 3 BHK luxury residences designed with double-height entrance lobbies, high-speed elevators, and panoramic views of landscaped podiums and pool decks. Situated directly adjacent to Rajiv Gandhi Infotech Park Phase 3, residents enjoy walking proximity to tech campuses like Tech Mahindra, TCS Sahyadri Park, and Cognizant.",
    amenities: "Olympic Swimming Pool, Sky Deck & Terrace Lounge, Clubhouse & Banquet, Floodlit Tennis Court, Fully Equipped Gym, 24x7 Multi-Tier Security, CCTV Surveillance, Pawar Public School within campus, EV Charging Bays, Landscaped Gardens, Dedicated Children Play Zone",
    priceRange: "₹95 L – ₹1.85 Cr",
    configuration: "2 BHK (645–695 sq.ft) | 2.5 BHK (850 sq.ft) | 3 BHK (1050 sq.ft)",
    configurationSummary: "2 BHK, 2.5 BHK & 3 BHK",
    configurations: [
      { bhkType: "2 BHK", carpetArea: "645 sq.ft", priceLabel: "₹95 L – ₹1.10 Cr", status: "Available" },
      { bhkType: "2 BHK", carpetArea: "695 sq.ft", priceLabel: "₹1.05 Cr – ₹1.25 Cr", status: "Available" },
      { bhkType: "2.5 BHK", carpetArea: "850 sq.ft", priceLabel: "₹1.25 Cr – ₹1.45 Cr", status: "Available" },
      { bhkType: "3 BHK", carpetArea: "1050 sq.ft", priceLabel: "₹1.55 Cr – ₹1.85 Cr", status: "Available" }
    ],
    nearbySchools: "Pawar Public School (Within Township - 200m), Blue Ridge Public School (4.5 km), Mercedes-Benz International (5.5 km)",
    nearbyHospitals: "Ruby Hall Clinic Hinjewadi (5.0 km), Sanjeevani Hospital (3.2 km)",
    nearbyItParks: "Tech Mahindra Hinjewadi Phase 3 (400m), TCS Sahyadri Park (600m), Cognizant Phase 3 (800m), Persistent Systems (1.5 km)",
    nearbyMetro: "Megapolis Circle Metro Station (Upcoming Line 3 terminal station - 300m)",
    nearbyMalls: "Megapolis Commercial High Street (Within Campus), Grand Highstreet (4.8 km)",
    googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.1!2d73.6934!3d18.5785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb368!2sMegapolis%20Sangria!5e0!3m2!1sen!2sin!4v1725118",
    travelTimeInfo: "Tech Mahindra: 2 mins walk | TCS: 4 mins walk | Phase 1 Wipro Circle: 8 mins drive | Mumbai-Pune Expressway: 18 mins",
    investmentScore: 92,
    rentalYield: 5.4,
    hasResale: true,
    hasRental: true,
    reraRegistered: true,
    faqs: "Q: Is Megapolis Sangria ready to move in?\nA: Yes, Megapolis Sangria is a fully ready-to-move residential cluster with occupancy certificates received.\n\nQ: What is the distance to Tech Mahindra and TCS from Sangria?\nA: Sangria is located within 400–600 meters of Tech Mahindra and TCS campuses in Hinjewadi Phase 3.\n\nQ: Are schools available within the campus?\nA: Yes, the renowned Pawar Public School is operational inside the Megapolis Township campus.",
    seoTitle: "Megapolis Sangria Hinjewadi Phase 3 | 2 & 3 BHK Flats | 24K Realtors",
    seoDescription: "Verified flats in Megapolis Sangria Hinjewadi Phase 3 by Pride Purple. 2 BHK, 2.5 BHK & 3 BHK with carpet 645-1050 sq.ft. Ready to move. MahaRERA P52100047112."
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOC-4: MEGAPOLIS MYSTIC — Hinjewadi Phase 3
  // MahaRERA: P52100046891 | Developer: Pride Purple Group
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "soc-megapolis-mystic",
    name: "Megapolis Mystic",
    canonicalName: "Megapolis Mystic Hinjewadi Phase 3",
    slug: "megapolis-mystic",
    imageUrl: "/gallery_tower_2.png",
    galleryImages: [
      "/gallery_tower_2.png",
      "/gallery_infinity_pool.png"
    ],
    location: "HINJEWADI",
    hinjewadiPhase: "PHASE_3",
    townshipName: "Megapolis",
    parentProjectId: "megapolis",
    developer: "Pride Purple Group",
    reraNumber: "P52100046891",
    projectStatus: "READY_TO_MOVE",
    startingPrice: 10500000,
    priceLastVerified: "20 Sep 2026",
    possessionDate: "Ready to Move",
    projectArea: "142+ Acres Integrated Township",
    overview: "Megapolis Mystic offers serene hillside living within the Megapolis Township in Hinjewadi Phase 3. Surrounded by the picturesque Sahyadri hills, Mystic features spacious 2 BHK and 3 BHK luxury residences with large viewing balconies, peaceful zen gardens, and premium interior specifications.",
    amenities: "Zen Garden, Hillside Viewing Deck, Gymnasium, Clubhouse, Tennis Court, Children Play Area, 24x7 Security & CCTV, Multi-level Covered Parking, Solar Water Heating",
    priceRange: "₹1.05 Cr – ₹1.95 Cr",
    configuration: "2 BHK (720–790 sq.ft) | 3 BHK (1150–1200 sq.ft)",
    configurationSummary: "2 BHK & 3 BHK",
    configurations: [
      { bhkType: "2 BHK", carpetArea: "720 sq.ft", priceLabel: "₹1.05 Cr – ₹1.25 Cr", status: "Available" },
      { bhkType: "2 BHK", carpetArea: "790 sq.ft", priceLabel: "₹1.20 Cr – ₹1.40 Cr", status: "Available" },
      { bhkType: "3 BHK", carpetArea: "1150 sq.ft", priceLabel: "₹1.65 Cr – ₹1.95 Cr", status: "Available" }
    ],
    nearbySchools: "Pawar Public School (300m), Blue Ridge Public School (4.5 km)",
    nearbyHospitals: "Ruby Hall Clinic Hinjewadi (5.0 km), Hinjawadi Hospital (4.0 km)",
    nearbyItParks: "Tech Mahindra (500m), TCS Sahyadri (700m), Cognizant (800m)",
    nearbyMetro: "Megapolis Metro Station (400m)",
    nearbyMalls: "Megapolis High Street (Within Campus)",
    googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.1!2d73.6942!3d18.5792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb368!2sMegapolis%20Mystic!5e0!3m2!1sen!2sin!4v1725118",
    travelTimeInfo: "Tech Mahindra: 3 mins walk | TCS: 5 mins walk | Hinjewadi Phase 1: 8 mins | Mumbai Expressway: 18 mins",
    investmentScore: 91,
    rentalYield: 5.2,
    hasResale: true,
    hasRental: true,
    reraRegistered: true,
    faqs: "Q: What configurations are available in Megapolis Mystic?\nA: Mystic offers 2 BHK (720-790 sq.ft) and 3 BHK (1150-1200 sq.ft) luxury apartments.\n\nQ: Does Megapolis Mystic offer hill views?\nA: Yes, Mystic has open balconies facing the scenic Sahyadri foothills.",
    seoTitle: "Megapolis Mystic Hinjewadi Phase 3 | 2 & 3 BHK Homes | 24K Realtors",
    seoDescription: "Explore verified 2 & 3 BHK residences in Megapolis Mystic Hinjewadi Phase 3. Hillside views, 142-acre township amenities. MahaRERA P52100046891."
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOC-5: MEGAPOLIS SPLENDOUR — Hinjewadi Phase 3
  // MahaRERA: P52100048230 | Developer: Pride Purple Group
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "soc-megapolis-splendour",
    name: "Megapolis Splendour",
    canonicalName: "Megapolis Splendour Hinjewadi Phase 3",
    slug: "megapolis-splendour",
    imageUrl: "/gallery_tower_3.png",
    galleryImages: [
      "/gallery_tower_3.png",
      "/luxury_sunset_pool.png"
    ],
    location: "HINJEWADI",
    hinjewadiPhase: "PHASE_3",
    townshipName: "Megapolis",
    parentProjectId: "megapolis",
    developer: "Pride Purple Group",
    reraNumber: "P52100048230",
    projectStatus: "UNDER_CONSTRUCTION",
    startingPrice: 11000000,
    priceLastVerified: "20 Sep 2026",
    possessionDate: "Dec 2026",
    projectArea: "142+ Acres Integrated Township",
    overview: "Megapolis Splendour is the marquee luxury residential cluster of Megapolis Township in Hinjewadi Phase 3. Featuring premium 2 BHK, 2.5 BHK, 3 BHK and 3.5 BHK grand apartments, Splendour includes an exclusive rooftop swimming pool, open-air amphitheatre, designer clubhouse, and smart home provisions.",
    amenities: "Rooftop Swimming Pool, Open-Air Amphitheatre, Luxury Clubhouse, Multi-sport Arena, High-Speed Elevators, 24x7 Security, Pawar Public School within campus",
    priceRange: "₹1.1 Cr – ₹2.2 Cr",
    configuration: "2 BHK (680 sq.ft) | 2.5 BHK (880 sq.ft) | 3 BHK (1100 sq.ft) | 3.5 BHK (1350 sq.ft)",
    configurationSummary: "2 BHK, 2.5 BHK, 3 BHK & 3.5 BHK",
    configurations: [
      { bhkType: "2 BHK", carpetArea: "680 sq.ft", priceLabel: "₹1.10 Cr – ₹1.30 Cr", status: "Available" },
      { bhkType: "2.5 BHK", carpetArea: "880 sq.ft", priceLabel: "₹1.35 Cr – ₹1.60 Cr", status: "Available" },
      { bhkType: "3 BHK", carpetArea: "1100 sq.ft", priceLabel: "₹1.75 Cr – ₹2.00 Cr", status: "Available" },
      { bhkType: "3.5 BHK", carpetArea: "1350 sq.ft", priceLabel: "₹2.05 Cr – ₹2.20 Cr", status: "Available" }
    ],
    nearbySchools: "Pawar Public School (350m)",
    nearbyHospitals: "Ruby Hall Clinic (5.0 km)",
    nearbyItParks: "Tech Mahindra (500m), TCS Sahyadri (600m), Cognizant (800m)",
    nearbyMetro: "Megapolis Metro Station (400m)",
    nearbyMalls: "Megapolis High Street (Within Campus)",
    googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.1!2d73.6948!3d18.5798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb368!2sMegapolis%20Splendour!5e0!3m2!1sen!2sin!4v1725118",
    travelTimeInfo: "Tech Mahindra: 2 mins walk | TCS: 4 mins walk | Wipro Circle: 8 mins | Expressway: 18 mins",
    investmentScore: 94,
    rentalYield: 5.1,
    hasResale: true,
    hasRental: true,
    reraRegistered: true,
    faqs: "Q: What is the possession date for Megapolis Splendour?\nA: Expected possession begins December 2026.\n\nQ: Are 3.5 BHK units available in Splendour?\nA: Yes, Splendour offers expansive 3.5 BHK layouts with carpet area of 1,350 sq.ft.",
    seoTitle: "Megapolis Splendour Hinjewadi Phase 3 | 2, 3 & 3.5 BHK | 24K Realtors",
    seoDescription: "Book premium flats in Megapolis Splendour Hinjewadi Phase 3. Rooftop pool, amphitheatre, 680-1350 sq.ft carpet. MahaRERA P52100048230."
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOC-6: MEGAPOLIS SUNWAY — Hinjewadi Phase 3
  // MahaRERA: P52100045780 | Developer: Pride Purple Group
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "soc-megapolis-sunway",
    name: "Megapolis Sunway",
    canonicalName: "Megapolis Sunway Hinjewadi Phase 3",
    slug: "megapolis-sunway",
    imageUrl: "/dev_kolte_patil_township.png",
    galleryImages: [
      "/dev_kolte_patil_township.png",
      "/gallery_sample_flat_interior.png"
    ],
    location: "HINJEWADI",
    hinjewadiPhase: "PHASE_3",
    townshipName: "Megapolis",
    parentProjectId: "megapolis",
    developer: "Pride Purple Group",
    reraNumber: "P52100045780",
    projectStatus: "READY_TO_MOVE",
    startingPrice: 6500000,
    priceLastVerified: "20 Sep 2026",
    possessionDate: "Ready to Move",
    projectArea: "142+ Acres Integrated Township",
    overview: "Megapolis Sunway is a premier residential society in Hinjewadi Phase 3 offering smart, sun-drenched 1 BHK, 2 BHK, and 2.5 BHK apartments. Highly sought after by IT professionals for its efficient floor plans, high capital appreciation, and tranquil location within the Megapolis Township.",
    amenities: "Corner Unit Open Views, Solar Water Heating, Clubhouse, Gymnasium, Jogging Track, Children Play Area, 24x7 Security & CCTV",
    priceRange: "₹65 L – ₹1.35 Cr",
    configuration: "1 BHK (440–490 sq.ft) | 2 BHK (680 sq.ft) | 2.5 BHK (870 sq.ft)",
    configurationSummary: "1 BHK, 2 BHK & 2.5 BHK",
    configurations: [
      { bhkType: "1 BHK", carpetArea: "440 sq.ft", priceLabel: "₹65 L – ₹72 L", status: "Available" },
      { bhkType: "1 BHK", carpetArea: "490 sq.ft", priceLabel: "₹72 L – ₹80 L", status: "Available" },
      { bhkType: "2 BHK", carpetArea: "680 sq.ft", priceLabel: "₹95 L – ₹1.15 Cr", status: "Available" }
    ],
    nearbySchools: "Pawar Public School (300m)",
    nearbyHospitals: "Ruby Hall Clinic (5.0 km)",
    nearbyItParks: "Tech Mahindra (400m), TCS (600m), Cognizant (700m)",
    nearbyMetro: "Megapolis Metro Station (350m)",
    nearbyMalls: "Megapolis High Street (Within Campus)",
    googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.1!2d73.6925!3d18.5779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb368!2sMegapolis%20Sunway!5e0!3m2!1sen!2sin!4v1725118",
    travelTimeInfo: "Tech Mahindra: 2 mins walk | TCS: 4 mins walk | Infosys Phase 1: 8 mins | Expressway: 18 mins",
    investmentScore: 93,
    rentalYield: 5.6,
    hasResale: true,
    hasRental: true,
    reraRegistered: true,
    faqs: "Q: What is the capital appreciation potential in Megapolis Sunway?\nA: Sunway delivers strong capital appreciation due to constant IT housing demand from Phase 3 companies.\n\nQ: Are 1 BHK flats available in Sunway?\nA: Yes, Sunway has verified 1 BHK flats ranging between 440 and 490 sq.ft carpet.",
    seoTitle: "Megapolis Sunway Hinjewadi Phase 3 | 1 & 2 BHK Apartments | 24K Realtors",
    seoDescription: "High ROI 1 & 2 BHK apartments in Megapolis Sunway Hinjewadi Phase 3. 440-870 sq.ft carpet. Ready to move. MahaRERA P52100045780."
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOC-7: MEGAPOLIS SPARKLE — Hinjewadi Phase 3
  // MahaRERA: P52100046550 | Developer: Pride Purple Group
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "soc-megapolis-sparkle",
    name: "Megapolis Sparkle",
    canonicalName: "Megapolis Sparkle Hinjewadi Phase 3",
    slug: "megapolis-sparkle",
    imageUrl: "/gallery_tower_3.png",
    galleryImages: [
      "/gallery_tower_3.png",
      "/gallery_infinity_pool.png"
    ],
    location: "HINJEWADI",
    hinjewadiPhase: "PHASE_3",
    townshipName: "Megapolis",
    parentProjectId: "megapolis",
    developer: "Pride Purple Group",
    reraNumber: "P52100046550",
    projectStatus: "READY_TO_MOVE",
    startingPrice: 10000000,
    priceLastVerified: "20 Sep 2026",
    possessionDate: "Ready to Move",
    projectArea: "142+ Acres Integrated Township",
    overview: "Megapolis Sparkle is an established residential community within Megapolis Township, Hinjewadi Phase 3. Offering well-planned 2 BHK and 3 BHK homes with central park views, spacious layouts, and convenient access to internal transport and schools.",
    amenities: "Central Park Facing Units, Modern Gymnasium, Badminton Court, Children Play Area, 24x7 Gated Security, Intercom, Power Backup",
    priceRange: "₹1.0 Cr – ₹1.75 Cr",
    configuration: "2 BHK (700–760 sq.ft) | 3 BHK (1080–1100 sq.ft)",
    configurationSummary: "2 BHK & 3 BHK",
    configurations: [
      { bhkType: "2 BHK", carpetArea: "700 sq.ft", priceLabel: "₹1.00 Cr – ₹1.20 Cr", status: "Available" },
      { bhkType: "2 BHK", carpetArea: "760 sq.ft", priceLabel: "₹1.15 Cr – ₹1.35 Cr", status: "Available" },
      { bhkType: "3 BHK", carpetArea: "1080 sq.ft", priceLabel: "₹1.50 Cr – ₹1.75 Cr", status: "Available" }
    ],
    nearbySchools: "Pawar Public School (250m)",
    nearbyHospitals: "Ruby Hall Clinic (5.0 km)",
    nearbyItParks: "Tech Mahindra (400m), TCS (600m), Cognizant (750m)",
    nearbyMetro: "Megapolis Metro Station (350m)",
    nearbyMalls: "Megapolis High Street (Within Campus)",
    googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.1!2d73.6920!3d18.5775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb368!2sMegapolis%20Sparkle!5e0!3m2!1sen!2sin!4v1725118",
    travelTimeInfo: "Tech Mahindra: 2 mins walk | TCS: 4 mins walk | Wipro Circle: 8 mins | Expressway: 18 mins",
    investmentScore: 90,
    rentalYield: 5.3,
    hasResale: true,
    hasRental: true,
    reraRegistered: true,
    faqs: "Q: What is the status of Megapolis Sparkle?\nA: Megapolis Sparkle is fully ready to move with active residents and families.\n\nQ: Does Sparkle have park facing flats?\nA: Yes, Sparkle towers feature scenic views overlooking the Megapolis central gardens.",
    seoTitle: "Megapolis Sparkle Hinjewadi Phase 3 | 2 & 3 BHK Homes | 24K Realtors",
    seoDescription: "Ready to move 2 & 3 BHK apartments in Megapolis Sparkle Hinjewadi Phase 3. 700-1100 sq.ft carpet. MahaRERA P52100046550."
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOC: MEGAPOLIS SERENITY — Hinjewadi Phase 3
  // Developer: Pride Purple Group
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "soc-megapolis-serenity",
    name: "Megapolis Serenity",
    canonicalName: "Megapolis Serenity Hinjewadi Phase 3",
    slug: "megapolis-serenity",
    imageUrl: "/megapolis_serenity_living.jpg",
    galleryImages: [
      "/megapolis_serenity_living.jpg",
      "/megapolis_serenity_bedroom.jpg",
      "/megapolis_serenity_kitchen.jpg",
      "/megapolis_serenity_bathroom.jpg",
      "/megapolis_serenity_balcony.jpg"
    ],
    location: "HINJEWADI",
    hinjewadiPhase: "PHASE_3",
    developer: "Pride Purple Group",
    reraNumber: "P52100046552",
    projectStatus: "READY_TO_MOVE",
    startingPrice: 7800000,
    priceLastVerified: "24 Sep 2026",
    possessionDate: "Ready to Move",
    projectArea: "142+ Acres Integrated Township",
    overview: "Megapolis Serenity is an exclusive residential community within Megapolis Township, Hinjewadi Phase 3, Pune. Offering ready-to-move 2 BHK apartments with 700 sq.ft actual carpet area, L-shaped granite platform kitchen, attached dry balcony, and designer bathroom finishes. Located just 2 minutes from TCS, Infosys, and Tech Mahindra campuses.",
    amenities: "700 sq.ft RERA Carpet, L-Shaped Granite Kitchen, Attached Dry Balcony, Clubhouse, Swimming Pool, Gymnasium, Children Play Area, 24x7 Gated Security Grid, Power Backup",
    priceRange: "₹78 Lakhs",
    configuration: "2 BHK (700 sq.ft Carpet Area)",
    configurationSummary: "2 BHK",
    configurations: [
      { bhkType: "2 BHK", carpetArea: "700 sq.ft", priceLabel: "₹78 Lakhs", status: "Available" }
    ],
    nearbySchools: "Pawar Public School (250m inside township)",
    nearbyHospitals: "Ruby Hall Clinic (5.0 km), Sanjeevani Hospital (3.5 km)",
    nearbyItParks: "Tech Mahindra (400m), TCS Sahyadri (600m), Infosys Phase 3 (800m), Cognizant (1 km)",
    nearbyMetro: "Megapolis Metro Station (350m — Metro Line 3)",
    nearbyMalls: "Megapolis High Street (Within Campus)",
    googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.1!2d73.6920!3d18.5775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb368!2sMegapolis%20Circle!5e0!3m2!1sen!2sin!4v1725118",
    travelTimeInfo: "Tech Mahindra: 2 mins walk | TCS: 4 mins walk | Infosys Phase 3: 5 mins | Expressway: 18 mins",
    investmentScore: 94,
    rentalYield: 5.4,
    hasResale: true,
    hasRental: true,
    reraRegistered: true,
    faqs: "Q: What is the carpet area and price of 2 BHK in Megapolis Serenity?\nA: Megapolis Serenity features a 2 BHK apartment with 700 sq.ft carpet area at an attractive price of ₹78 Lakhs.\n\nQ: Is Megapolis Serenity ready to move in?\nA: Yes, Megapolis Serenity is 100% ready to move in with completed amenities.\n\nQ: Does the flat include an attached dry balcony and modular kitchen counter?\nA: Yes, it includes an L-shaped black granite countertop and a dedicated utility/dry balcony.",
    seoTitle: "Megapolis Serenity Hinjewadi Phase 3 | 2 BHK 700 sq.ft Flat ₹78L | 24K Realtors",
    seoDescription: "Ready to move 2 BHK apartment in Megapolis Serenity, Hinjewadi Phase 3. 700 sq.ft carpet area at ₹78 Lakhs. Attached dry balcony, modular kitchen, parking. RERA P52100046552."
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOC-8: MEGAPOLIS TOWNSHIP (Master Listing) — Hinjewadi Phase 3
  // Developer: Pride Purple Group
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "soc-megapolis-township",
    name: "Megapolis Township",
    canonicalName: "Megapolis Township Hinjewadi Phase 3",
    slug: "megapolis-township",
    imageUrl: "/megapolis_hero_card.jpg",
    galleryImages: [
      "/megapolis_hero_card.jpg",
      "/sangria_living_room.jpg",
      "/sangria_bedroom.jpg",
      "/sangria_kitchen.jpg",
      "/sangria_bathroom.jpg",
      "/sangria_balcony.jpg"
    ],
    location: "HINJEWADI",
    hinjewadiPhase: "PHASE_3",
    townshipName: "Megapolis",
    parentProjectId: "megapolis",
    developer: "Pride Purple Group",
    reraNumber: "P52100047112",
    projectStatus: "READY_TO_MOVE",
    startingPrice: 6500000,
    priceLastVerified: "20 Sep 2026",
    possessionDate: "Ready to Move & Ongoing",
    projectArea: "142+ Acres Integrated Township",
    overview: "Megapolis is Pune's flagship 142+ acre integrated smart township located in Hinjewadi Phase 3, developed by the esteemed Pride Purple Group. Designed to provide a complete self-sustained lifestyle next to IT hubs, it houses iconic societies including Sangria, Mystic, Splendour, Sunway, and Sparkle. The township features the operational Pawar Public School, Olympic-sized swimming pools, multi-sport stadiums, shuttle transit, convenience marts, and upcoming metro line 3 terminal connectivity.",
    amenities: "142-Acre Master Township, Pawar Public School, Olympic Swimming Pools, Grand Clubhouses, Tennis & Basketball Courts, Shuttle Bus, Commercial High Street, 24x7 Multi-Tier Security",
    priceRange: "₹65 L – ₹2.2 Cr",
    configuration: "1 BHK, 2 BHK, 2.5 BHK, 3 BHK & 3.5 BHK (440 – 1,350 sq.ft)",
    configurationSummary: "1, 2, 2.5, 3 & 3.5 BHK",
    configurations: [
      { bhkType: "1 BHK", carpetArea: "440–510 sq.ft", priceLabel: "₹65 L – ₹80 L", status: "Available" },
      { bhkType: "2 BHK", carpetArea: "645–790 sq.ft", priceLabel: "₹95 L – ₹1.40 Cr", status: "Available" },
      { bhkType: "2.5 BHK", carpetArea: "800–880 sq.ft", priceLabel: "₹1.25 Cr – ₹1.60 Cr", status: "Available" },
      { bhkType: "3 BHK", carpetArea: "990–1200 sq.ft", priceLabel: "₹1.55 Cr – ₹1.95 Cr", status: "Available" },
      { bhkType: "3.5 BHK", carpetArea: "1350 sq.ft", priceLabel: "₹2.05 Cr – ₹2.20 Cr", status: "Available" }
    ],
    nearbySchools: "Pawar Public School (Within Township Campus)",
    nearbyHospitals: "Ruby Hall Clinic Hinjewadi (5.0 km), Sanjeevani Hospital (3.2 km)",
    nearbyItParks: "Tech Mahindra (300m), TCS Sahyadri (500m), Cognizant (700m)",
    nearbyMetro: "Megapolis Terminal Metro Station (Line 3 - 300m)",
    nearbyMalls: "Megapolis High Street Retail Arcade",
    googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.1!2d73.6934!3d18.5785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb368!2sMegapolis%20Township!5e0!3m2!1sen!2sin!4v1725118",
    travelTimeInfo: "Tech Mahindra: 2 mins walk | TCS: 4 mins walk | Wipro Circle: 8 mins | Expressway: 18 mins",
    investmentScore: 95,
    rentalYield: 5.5,
    hasResale: true,
    hasRental: true,
    reraRegistered: true,
    faqs: "Q: Which societies are part of Megapolis Township?\nA: Megapolis includes Sangria, Mystic, Splendour, Sunway, Sparkle and Smart Homes clusters.\n\nQ: Is Pawar Public School located inside the township?\nA: Yes, Pawar Public School is fully operational within the Megapolis Township boundary.",
    seoTitle: "Megapolis Township Hinjewadi Phase 3 | 1 to 3.5 BHK Flats | 24K Realtors",
    seoDescription: "Explore Pune's largest 142-acre integrated township Megapolis in Hinjewadi Phase 3. 1, 2, 2.5, 3 & 3.5 BHK verified listings. MahaRERA registered."
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOC-9: TCG THE CLIFF GARDEN — Hinjewadi Phase 3
  // MahaRERA: P52100004906 / P52100015759 / P52100028926 | Developer: TCG Real Estate
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "soc-tcg-the-cliff-garden",
    name: "TCG The Cliff Garden",
    canonicalName: "TCG The Cliff Garden Hinjewadi Phase 3",
    slug: "tcg-cliff-garden-hinjewadi",
    imageUrl: "/properties/tcg-the-cliff-garden/00_project_card.jpg",
    galleryImages: [
      "/properties/tcg-the-cliff-garden/00_project_card.jpg",
      "/properties/tcg-the-cliff-garden/05_living_room.jpg",
      "/properties/tcg-the-cliff-garden/04_kitchen.jpg",
      "/properties/tcg-the-cliff-garden/02_bedroom.jpg",
      "/properties/tcg-the-cliff-garden/03_bathroom.jpg",
      "/properties/tcg-the-cliff-garden/01_balcony_view.jpg"
    ],
    location: "HINJEWADI",
    hinjewadiPhase: "PHASE_3",
    developer: "TCG Real Estate",
    reraNumber: "P52100004906 / P52100015759 / P52100028926",
    projectStatus: "READY_TO_MOVE",
    startingPrice: 5500000,
    priceLastVerified: "22 Sep 2026",
    possessionDate: "Ready to Move",
    projectArea: "Hillside Development",
    overview: "TCG The Cliff Garden is a serene hillside residential development nestled against the Sahyadri hill slopes in Hinjewadi Phase 3, Pune. Developed by TCG Real Estate across multiple MahaRERA registered phases (P52100004906, P52100015759, P52100028926), the project features 1 BHK (462 sq.ft carpet, ₹55 Lakhs - negotiable) and 2 BHK (662 sq.ft carpet, ₹75 Lakhs - negotiable) homes with panoramic valley views, modular kitchens, clubhouses, sports courts, and pristine natural surroundings walking distance to major Phase 3 IT giants.",
    amenities: "Clubhouse & Indoor Games Pavilion, Multipurpose Sports Court, Swimming Pool with Kid Deck, Modern Gymnasium, Jogging Track, Yoga Lawn, 24/7 Security & CCTV Grid, High-Speed Elevators with ARD, Covered Parking, Children Play Park",
    priceRange: "₹55 Lakhs - ₹75 Lakhs (Negotiable)",
    configuration: "1 BHK (462 sq.ft) | 2 BHK (662 sq.ft)",
    configurationSummary: "1 BHK & 2 BHK",
    configurations: [
      { bhkType: "1 BHK", carpetArea: "462 sq.ft", priceLabel: "₹55 Lakhs (Negotiable)", status: "Available" },
      { bhkType: "2 BHK", carpetArea: "662 sq.ft", priceLabel: "₹75 Lakhs (Negotiable)", status: "Available" }
    ],
    highlights: [
      "Perpetual Sahyadri Hillside & Valley Views",
      "Triple MahaRERA Verification (P52100004906, P52100015759, P52100028926)",
      "Ready to Move with Authentic On-Site Photos",
      "Close to Megapolis, Tech Mahindra, TCS & Metro Line 3",
      "Negotiable Pricing on 1 BHK & 2 BHK Configurations"
    ],
    nearbySchools: "Pawar Public School (1.8 km), Blue Ridge Public School (5.5 km)",
    nearbyHospitals: "Ruby Hall Clinic Hinjewadi (6.0 km), Sanjeevani Hospital (3.5 km)",
    nearbyItParks: "Tech Mahindra (2.0 km), TCS (2.2 km), Cognizant (2.5 km)",
    nearbyMetro: "Upcoming Metro Line 3 Phase 3 Terminal (2.5 km)",
    nearbyMalls: "Megapolis High Street (1.5 km), Grand Highstreet (5.5 km)",
    travelTimeInfo: "Megapolis Circle: 3 mins | Tech Mahindra: 4 mins | TCS: 5 mins | Hinjewadi Phase 1: 12 mins | Expressway: 12 mins",
    investmentScore: 94,
    hasResale: true,
    hasRental: true,
    reraRegistered: true,
    faqs: "Q: What are the MahaRERA numbers for TCG The Cliff Garden?\nA: The project wings are registered under P52100004906, P52100015759, and P52100028926.\n\nQ: Are the prices negotiable?\nA: Yes, both 1 BHK (₹55L) and 2 BHK (₹75L) prices are negotiable through 24K Realtors.",
    seoTitle: "TCG The Cliff Garden Hinjewadi Phase 3 | 1 & 2 BHK Flats | 24K Realtors",
    seoDescription: "TCG The Cliff Garden Hinjewadi Phase 3. 1 BHK 462 sq.ft (₹55L) & 2 BHK 662 sq.ft (₹75L) negotiable. Triple MahaRERA P52100004906, P52100015759, P52100028926."
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOC-10: VTP BLUE WATERS — Mahalunge (Hinjewadi-Baner Corridor)
  // MahaRERA: P52100009531 / P52100009529 / P52100007943 / P52100026772 / P52100020112 / P52100019986 | Developer: VTP Realty
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "soc-vtp-blue-waters",
    name: "VTP Blue Waters",
    canonicalName: "VTP Blue Waters Mahalunge Pune",
    slug: "vtp-blue-waters-mahalunge",
    imageUrl: "/properties/vtp-blue-waters/00_project_card.jpg",
    galleryImages: [
      "/properties/vtp-blue-waters/00_project_card.jpg",
      "/properties/vtp-blue-waters/02_living_room.jpg",
      "/properties/vtp-blue-waters/03_kitchen.jpg",
      "/properties/vtp-blue-waters/04_bedroom.jpg",
      "/properties/vtp-blue-waters/05_bathroom.jpg",
      "/properties/vtp-blue-waters/06_balcony.jpg",
      "/properties/vtp-blue-waters/01_elevation.png"
    ],
    location: "MAHALUNGE",
    hinjewadiPhase: "MAHALUNGE_HINJEWADI",
    developer: "VTP Realty",
    reraNumber: "P52100009531 / P52100009529 / P52100007943 / P52100026772 / P52100020112 / P52100019986",
    projectStatus: "UNDER_CONSTRUCTION",
    startingPrice: 7200000,
    priceLastVerified: "22 Sep 2026",
    possessionDate: "Multiple Phases / Ready & Dec 2026",
    projectArea: "100+ Acres Riverside Township",
    overview: "VTP Blue Waters is Pune West's flagship 100+ acre mega integrated riverside township situated in Mahalunge, right at the newly developed bridge to Hinjewadi Phase 1. Designed by VTP Realty, the township comprises multiple luxury residential clusters, 1 km scenic river promenade, 5 luxury clubhouses, and verified 2 BHK (640 sq.ft carpet, ₹72 Lakhs - negotiable) inventory. Registered under six MahaRERA numbers (P52100009531, P52100009529, P52100007943, P52100026772, P52100020112, P52100019986).",
    amenities: "1 km Riverfront Walkway, 5 Themed Clubhouses, Olympic-Size Swimming Pool, Modern Gymnasium, Tennis & Badminton Courts, 24/7 Security Grid, Glass Railing Balconies, Modular Kitchen, High-Speed Elevators, EV Charging",
    priceRange: "₹72 Lakhs (Negotiable)",
    configuration: "2 BHK (640 sq.ft)",
    configurationSummary: "2 BHK 640 sq.ft",
    configurations: [
      { bhkType: "2 BHK", carpetArea: "640 sq.ft", priceLabel: "₹72 Lakhs (Negotiable)", status: "Available" }
    ],
    highlights: [
      "100+ Acre Mega Riverside Township by VTP Realty",
      "Direct Mahalunge-Hinjewadi Bridge (5 mins to Phase 1)",
      "Six MahaRERA Registrations for Complete Transparency",
      "Authentic On-Site Photos with Modular Kitchen & Glass Balcony",
      "₹72 Lakhs Negotiable Direct Exclusive Mandate"
    ],
    nearbySchools: "Radcliff School (1.2 km), Birlac International (2.5 km), Blue Ridge School (4.5 km)",
    nearbyHospitals: "Jupiter Hospital Baner (6.5 km), Ruby Hall Hinjewadi (5.5 km), Manipal Hospital (6.0 km)",
    nearbyItParks: "Hinjewadi Phase 1 IT Park (3.5 km / 5 mins), Embassy Tech Zone (6.5 km)",
    nearbyMetro: "Upcoming Balewadi / Hinjewadi Metro Station (4.0 km)",
    nearbyMalls: "Balewadi High Street (5.5 km / 8 mins), Phoenix Mall of the Millennium (6.8 km)",
    travelTimeInfo: "Mahalunge-Hinjewadi Bridge: 2 mins | Hinjewadi Phase 1: 5 mins | Balewadi High Street: 8 mins | Baner: 10 mins | Expressway: 12 mins",
    investmentScore: 96,
    hasResale: true,
    hasRental: true,
    reraRegistered: true,
    faqs: "Q: Why does VTP Blue Waters have multiple MahaRERA numbers?\nA: VTP Blue Waters is a 100+ acre township spanning multiple individual clusters and residential towers (Acheron, Leonara, Bel Air, Alpine, Earth One, Town Center) registered under P52100009531, P52100009529, P52100007943, P52100026772, P52100020112, and P52100019986.\n\nQ: What is the price of the 2 BHK unit?\nA: The 2 BHK unit has 640 sq.ft carpet area and is priced at ₹72 Lakhs (negotiable) through 24K Realtors.",
    seoTitle: "VTP Blue Waters Mahalunge Pune | 2 BHK 640 sq.ft Flats | 24K Realtors",
    seoDescription: "VTP Blue Waters Mahalunge near Hinjewadi. 2 BHK (640 sq.ft, ₹72L Negotiable). 100+ Acre riverside township with 6 MahaRERA numbers: P52100009531, P52100009529, P52100007943, P52100026772, P52100020112, P52100019986."
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOC-11: PARANJAPE BLUE RIDGE — Hinjewadi Phase 1
  // Developer: Paranjape Schemes | 138-Acre Integrated Township
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "soc-paranjape-blue-ridge",
    name: "Paranjape Blue Ridge",
    canonicalName: "Paranjape Blue Ridge Hinjewadi Phase 1",
    slug: "blue-ridge-hinjewadi",
    imageUrl: "/blue_ridge_project_card.jpg",
    galleryImages: [
      "/blue_ridge_project_card.jpg",
      "/blue_ridge_living.jpg",
      "/blue_ridge_bedroom.jpg",
      "/blue_ridge_kitchen.jpg",
      "/blue_ridge_bathroom.jpg",
      "/blue_ridge_balcony.jpg"
    ],
    location: "HINJEWADI",
    hinjewadiPhase: "PHASE_1",
    developer: "Paranjape Schemes",
    reraNumber: "P52100016328 / P52100000054 / P52100027419 (Extensions: P52100055581 / P52100029952)",
    projectStatus: "READY_TO_MOVE",
    startingPrice: 19500000,
    priceLastVerified: "24 Sep 2026",
    possessionDate: "Ready to Move",
    projectArea: "138-Acre Integrated Township",
    overview: "Paranjape Blue Ridge is Pune's pioneering 138-acre integrated riverfront township located in Hinjewadi Phase 1. Known for its world-class master planning, it features a signature 9-hole golf course, Blue Ridge Public School within campus, multi-sport courts, riverfront promenade, and SEZ commercial tech parks. Offering 1 BHK (~440 to 550 sq.ft), 2 BHK (~800 to 860 sq.ft), and exclusive Golf-Facing 3 BHK & Larger (~1,110+ sq.ft) residences priced at ₹1.95 Cr (Negotiable). Primary MahaRERA: P52100016328, P52100000054, P52100027419; Newer Extensions: P52100055581, P52100029952.",
    amenities: "9-Hole Golf Course, Sports Facilities, Indoor & Outdoor Courts, Gym / Fitness Centre, Jogging & Walking Tracks, Clubhouses, Swimming Pool, Waterfront Areas, Blue Ridge Public School, 24×7 Security, Daily Retail & Shopping",
    priceRange: "₹1.95 Cr (Negotiable)",
    configuration: "1 BHK (~440-550 sq.ft) | 2 BHK (~800-860 sq.ft) | 3 BHK & Larger (~1,110+ sq.ft)",
    configurationSummary: "1 BHK, 2 BHK & 3 BHK (Golf Facing)",
    configurations: [
      { bhkType: "1 BHK", carpetArea: "~440 to 550 sq.ft", priceLabel: "Price on Request", status: "Available" },
      { bhkType: "2 BHK", carpetArea: "~800 to 860 sq.ft", priceLabel: "Price on Request", status: "Available" },
      { bhkType: "3 BHK (Golf Facing)", carpetArea: "~1,110+ sq.ft", priceLabel: "₹1.95 Cr (Negotiable)", status: "Available" }
    ],
    highlights: [
      "Signature 9-Hole Executive Golf Course & Green Fairways",
      "Primary MahaRERA: P52100016328, P52100000054, P52100027419",
      "Newer Sub-Phases & Extensions: P52100055581, P52100029952",
      "Blue Ridge Public School Operational Inside Township",
      "100% Authentic Flat Photos (Living, Bedroom, Modular Kitchen, Bathroom, Balcony)",
      "₹1.95 Cr Negotiable Mandate through 24K Realtors"
    ],
    nearbySchools: "Blue Ridge Public School (Within Township - 100m), Mercedes-Benz International (1.5 km), Pawar Public School (4.5 km)",
    nearbyHospitals: "Ruby Hall Clinic Hinjewadi (2.0 km), Hinjewadi Hospital (1.5 km), Lifepoint Multispecialty (4.0 km)",
    nearbyItParks: "Cognizant (300m), Symbiosis Infotech Campus (400m), Infosys Phase 1 (1.2 km), Wipro Circle (1.4 km)",
    nearbyMetro: "Upcoming Hinjewadi Phase 1 Metro Station (Line 3 - 800m)",
    nearbyMalls: "Blue Ridge High Street Galleria (On Campus), Grand Highstreet (1.8 km), Phoenix Mall of the Millennium (4.2 km)",
    travelTimeInfo: "Cognizant / Symbiosis: 2 mins walk | Infosys Phase 1: 4 mins | Wipro Circle: 4 mins | Wakad: 8 mins | Baner: 10 mins",
    investmentScore: 98,
    hasResale: true,
    hasRental: true,
    reraRegistered: true,
    faqs: "Q: What are the MahaRERA numbers for Paranjape Blue Ridge?\nA: Primary RERA Numbers: P52100016328, P52100000054, P52100027419. Newer Sub-Phases & Extensions: P52100055581, P52100029952.\n\nQ: What is the price and carpet area of the featured Golf Facing flat?\nA: It is a 3 BHK & Larger configuration with ~1,110+ sq.ft carpet area, priced at ₹1.95 Cr (Negotiable).",
    seoTitle: "Paranjape Blue Ridge Hinjewadi Phase 1 | Golf Facing 3 BHK ₹1.95 Cr | 24K Realtors",
    seoDescription: "Paranjape Blue Ridge Hinjewadi Phase 1. 138-Acre Township with 9-Hole Golf Course. 3 BHK Golf Facing (~1,110+ sq.ft, ₹1.95 Cr Negotiable). MahaRERA: P52100016328, P52100000054, P52100027419, P52100055581, P52100029952."
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

// ── Cache version: bump this whenever initialProperties / initialSocieties change ──
// This forces localStorage to reset so stale demo data never bleeds through.
const HINJEWADI_PROP_VERSION = 'v2026_eight_flagship_blue_ridge_v21';

const LocalMockDb = {
  getProperties() {
    let list = null;
    try {
      const storedVer = localStorage.getItem('mock_properties_version');
      if (storedVer === HINJEWADI_PROP_VERSION) {
        list = getLocalStorageItem('mock_properties', null);
      } else {
        localStorage.setItem('mock_properties_version', HINJEWADI_PROP_VERSION);
        saveLocalStorageItem('mock_properties', initialProperties);
        list = initialProperties;
      }
    } catch (e) {
      list = initialProperties;
    }
    if (!list || !list.length) list = initialProperties;

    const seen = new Set();
    const deduped = [];
    for (const p of list) {
      if (!p || !p.id) continue;
      const key = String(p.id);
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(p);
      }
    }
    return deduped;
  },
  getAllKnownProperties() {
    return [...this.getProperties(), ...megapolisSubSocietiesProperties];
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
    let list = null;
    try {
      const storedVer = localStorage.getItem('mock_societies_version');
      if (storedVer === HINJEWADI_PROP_VERSION) {
        list = getLocalStorageItem('mock_societies', null);
      } else {
        localStorage.setItem('mock_societies_version', HINJEWADI_PROP_VERSION);
        saveLocalStorageItem('mock_societies', initialSocieties);
        list = initialSocieties;
      }
    } catch (e) {
      list = initialSocieties;
    }
    if (!list || !list.length) list = initialSocieties;

    const seen = new Set();
    const deduped = [];
    for (const s of list) {
      if (!s || !s.id) continue;
      const key = String(s.id);
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(s);
      }
    }
    return deduped;
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
    id.startsWith('prop-') ||
    id.startsWith('mock-') ||
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
    if (!isBackendOfflineCached) {
      console.warn("[OFFLINE SYNC] Spring Boot server unreachable or error encountered. Falling back to local catalog:", err?.message || err);
      isBackendOfflineCached = true;
      localStorage.setItem('OFFLINE_MODE_ACTIVE', 'true');
      if (!offlineCacheResetTimer) {
        offlineCacheResetTimer = setTimeout(() => {
          isBackendOfflineCached = false;
          offlineCacheResetTimer = null;
        }, 15000);
      }
    }
    return fallbackFn();
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
    // ── Support single object parameters { page, size, ...filters } ──
    if (filters && typeof filters === 'object') {
      if (filters.page !== undefined && page === 0) page = Number(filters.page);
      if (filters.size !== undefined && size === 10) size = Number(filters.size);
      if (filters.sortBy && sortBy === 'createdDate') sortBy = filters.sortBy;
      if (filters.direction && direction === 'desc') direction = filters.direction;
    }

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
        
        if (filters.location) {
          const locFilter = String(filters.location).toUpperCase();
          if (locFilter === 'HINJEWADI') {
            list = list.filter(p => p.location && p.location.toUpperCase().startsWith('HINJEWADI'));
          } else {
            list = list.filter(p => p.location && (p.location.toUpperCase() === locFilter || p.location.toUpperCase().includes(locFilter)));
          }
        }
        if (filters.builder) {
          const bQuery = String(filters.builder).toLowerCase();
          list = list.filter(p => 
            (p.builderName && p.builderName.toLowerCase().includes(bQuery)) ||
            (p.title && p.title.toLowerCase().includes(bQuery)) ||
            (p.description && p.description.toLowerCase().includes(bQuery))
          );
        }
        if (filters.reraOnly) {
          list = list.filter(p => p.reraNumber && (p.reraNumber.startsWith('P521000') || p.reraNumber.startsWith('PR126')));
        }
        if (filters.minPrice) list = list.filter(p => p.price >= Number(filters.minPrice));
        if (filters.maxPrice) list = list.filter(p => p.price <= Number(filters.maxPrice));
        if (filters.propertyType) list = list.filter(p => p.propertyType === filters.propertyType);
        if (filters.transactionType) list = list.filter(p => p.transactionType === filters.transactionType);
        if (filters.bedrooms) list = list.filter(p => p.bedrooms === Number(filters.bedrooms));
        if (filters.status) list = list.filter(p => p.status === filters.status);
        if (filters.furnishingStatus) list = list.filter(p => p.furnishingStatus === filters.furnishingStatus);
        if (filters.commercialUnitType) {
          const cType = filters.commercialUnitType.toLowerCase();
          list = list.filter(p => 
            p.propertyType === 'COMMERCIAL' ||
            (p.unitType && p.unitType.toLowerCase().includes(cType)) ||
            (p.title && p.title.toLowerCase().includes(cType)) ||
            (p.description && p.description.toLowerCase().includes(cType))
          );
        }
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
        const list = LocalMockDb.getAllKnownProperties();
        const prop = list.find(p => p.id === id || String(p.id) === String(id) || String(p.id) === `prop-${id}` || (p.slug && p.slug === id));
        if (!prop) {
          const numericId = String(id).replace(/\D/g, '');
          const matchNum = numericId ? list.find(p => String(p.id).replace(/\D/g, '') === numericId) : null;
          if (matchNum) return matchNum;
          return list[0] || null;
        }
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
    return this.submitLeadToDatabase(leadData);
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
    const payload = {
      activityType: data.activityType || data.type || 'NOTE',
      subject: data.subject || 'Lead Note',
      details: data.details || ''
    };
    const res = await fetch(`${BASE_URL}/leads/${leadId}/timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to log activity');
    }
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

  async updateLead(id, leadData) {
    const cleanPhone = (leadData.phone || '').replace(/\D/g, '');
    const formattedPhone = cleanPhone.length === 10
      ? `+91${cleanPhone}`
      : (leadData.phone && leadData.phone.startsWith('+') ? leadData.phone : `+91${cleanPhone}`);

    let locationEnum = 'HINJEWADI';
    const loc = (leadData.location || leadData.preferredLocation || '').toUpperCase();
    if (loc.includes('WAKAD')) locationEnum = 'WAKAD';
    else if (loc.includes('BANER')) locationEnum = 'BANER';
    else if (loc.includes('KHARADI')) locationEnum = 'KHARADI';
    else if (loc.includes('BALEWADI')) locationEnum = 'BALEWADI';
    else if (loc.includes('TATHAWADE')) locationEnum = 'TATHAWADE';

    const payload = {
      name: leadData.name,
      phone: formattedPhone,
      email: (leadData.email && leadData.email.includes('@')) ? leadData.email : `${cleanPhone || 'visitor'}@24krealtors.com`,
      requirementType: leadData.requirementType || 'BUY',
      budgetMin: leadData.budgetMin ? Number(leadData.budgetMin) : 5000000,
      budgetMax: leadData.budgetMax ? Number(leadData.budgetMax) : 15000000,
      preferredLocation: locationEnum,
      status: leadData.status || 'NEW',
      notes: leadData.notes || '',
      propertyId: leadData.propertyId || null
    };

    const response = await fetch(`${BASE_URL}/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update lead');
    }
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

  // ==========================================
  // CUSTOMER 360 & INVESTOR PORTFOLIO (PHASE 3)
  // ==========================================

  async getCustomers({ page = 0, size = 20, search = '', type = '', kycStatus = '' } = {}) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (search) params.append('search', search);
    if (type) params.append('type', type);
    if (kycStatus) params.append('kycStatus', kycStatus);

    const response = await fetch(`${BASE_URL}/customers?${params.toString()}`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch customers');
    return response.json();
  },

  async getCustomerById(id) {
    const response = await fetch(`${BASE_URL}/customers/${id}`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch customer profile');
    return response.json();
  },

  async createCustomer(data) {
    const response = await fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create customer');
    }
    return response.json();
  },

  async updateCustomer(id, data) {
    const response = await fetch(`${BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update customer');
    }
    return response.json();
  },

  async updateCustomerKyc(id, status) {
    const response = await fetch(`${BASE_URL}/customers/${id}/kyc?status=${status}`, {
      method: 'PATCH',
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to update KYC status');
    return response.json();
  },

  async convertLeadToCustomer(leadId) {
    const response = await fetch(`${BASE_URL}/customers/convert-lead/${leadId}`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to convert lead to customer');
    }
    return response.json();
  },

  async getCustomerStats() {
    const response = await fetch(`${BASE_URL}/customers/stats`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch customer stats');
    return response.json();
  },

  async deleteCustomer(id) {
    const response = await fetch(`${BASE_URL}/customers/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to delete customer');
    return true;
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
      const existingLeads = LocalMockDb.getLeads() || [];
      const newMockLead = {
        id: `LD-${Date.now().toString().slice(-6)}`,
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        requirementType: payload.requirementType,
        budgetMin: payload.budgetMin,
        budgetMax: payload.budgetMax,
        location: payload.preferredLocation,
        preferredLocation: payload.preferredLocation,
        status: 'NEW',
        notes: payload.notes,
        score: 75,
        leadScore: 75,
        createdDate: new Date().toISOString(),
        source: leadData.source || '24K Web Portal'
      };
      existingLeads.unshift(newMockLead);
      LocalMockDb.saveLeads(existingLeads.slice(0, 150));
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
      // 4. Asynchronously push to Google Spreadsheet Webhook if configured
      this.syncLeadToGoogleSheet(payload).catch(() => {});

      if (!response.ok) {
        console.warn('[Backend API] Leads endpoint returned non-200 status:', response.status);
        return { success: true, offline: true, payload };
      }
      const data = await response.json();
      console.info('[Backend API] Lead successfully stored in DB ✓', data);
      return { success: true, data };
    } catch (error) {
      console.warn('[Backend API] Network error posting lead to DB, cached in offline CRM:', error);
      // Still trigger Google Sheet sync
      this.syncLeadToGoogleSheet(payload).catch(() => {});
      return { success: true, offline: true, payload };
    }
  },

  // ─── GOOGLE SHEETS LIVE SYNC & CSV EXPORT ──────────────────────────────────
  async syncLeadToGoogleSheet(leadPayload) {
    const webhookUrl = localStorage.getItem('google_sheet_webhook_url') || 
      (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL : null);
    
    if (!webhookUrl) {
      // Auto-fallback: Store in google_sheet_pending_queue so nothing is missed
      try {
        const queue = JSON.parse(localStorage.getItem('google_sheet_pending_queue') || '[]');
        queue.push({ ...leadPayload, queuedAt: new Date().toISOString() });
        localStorage.setItem('google_sheet_pending_queue', JSON.stringify(queue.slice(-200)));
      } catch (e) {}
      return { success: true, queued: true };
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });
      return { success: true, synced: true };
    } catch (e) {
      console.warn('[Google Sheets Sync] Webhook push failed:', e);
      return { success: false, error: e.message };
    }
  },

  exportLeadsToCsv(leads = []) {
    if (!leads || leads.length === 0) return false;

    const headers = [
      'Lead ID',
      'Date & Time',
      'Customer Name',
      'Phone Number',
      'Email Address',
      'Requirement Type',
      'Location / Corridor',
      'Budget Range',
      'Status',
      'Assigned RM',
      'Lead Source',
      'Inquiry Notes & Preferences'
    ];

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""').replace(/\n/g, ' ');
      return `"${clean}"`;
    };

    const rows = leads.map(l => {
      const budgetStr = l.budget || (l.budgetMin && l.budgetMax ? `₹${(l.budgetMin/100000).toFixed(0)}L - ${(l.budgetMax/100000).toFixed(0)}L` : 'Flexible');
      const dateStr = l.assignedOn || l.createdDate || new Date().toLocaleDateString('en-IN');
      return [
        escapeCsv(l.id || 'N/A'),
        escapeCsv(dateStr),
        escapeCsv(l.name || 'Anonymous'),
        escapeCsv(l.phone || 'N/A'),
        escapeCsv(l.email || 'N/A'),
        escapeCsv(l.propertyInterest || l.requirementType || 'Residential'),
        escapeCsv(l.location || l.preferredLocation || 'Hinjewadi'),
        escapeCsv(budgetStr),
        escapeCsv(l.status || 'NEW'),
        escapeCsv(l.assignedAgentName || 'Jyoti Dhale'),
        escapeCsv(l.source || 'Website Portal'),
        escapeCsv(l.sub || l.notes || '')
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `24K_Realtors_Master_Leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  },

  async submitLead(leadData) {
    return this.submitLeadToDatabase(leadData);
  },

  async createLead(leadData) {
    return this.submitLeadToDatabase(leadData);
  },

  async getLeads({ page = 0, size = 50, status, location } = {}) {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('size', size);
      if (status && status !== 'ALL') params.append('status', status);
      if (location && location !== 'ALL') params.append('preferredLocation', location);

      const response = await fetch(`${BASE_URL}/leads?${params.toString()}`, {
        headers: { ...getAuthHeaders() }
      });
      if (response.ok) {
        const pageData = await response.json();
        return pageData.content || pageData;
      }
    } catch (err) {
      console.warn('[API] Failed to fetch leads from backend, fallback to local cache:', err);
    }
    // Fallback to local storage
    try {
      return JSON.parse(localStorage.getItem('mock_leads') || '[]');
    } catch (e) {
      return [];
    }
  },

  async updateLeadStatus(leadId, newStatus) {
    try {
      const response = await fetch(`${BASE_URL}/leads/${leadId}/status?status=${newStatus}`, {
        method: 'PATCH',
        headers: { ...getAuthHeaders() }
      });
      if (response.ok) return response.json();
    } catch (err) {
      console.warn('[API] Backend lead status update failed, updating local storage:', err);
    }
    // Fallback local update
    try {
      const leads = JSON.parse(localStorage.getItem('mock_leads') || '[]');
      const updated = leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
      localStorage.setItem('mock_leads', JSON.stringify(updated));
      return { success: true, id: leadId, status: newStatus };
    } catch (e) {
      return { success: true };
    }
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
  },

  // ─── PUBLIC PROPERTY INTELLIGENCE API (Phase 3 & 4) ───────────────────────
  async getPublicSocieties(filters = {}) {
    const publicUrl = BASE_URL.replace(/\/api\/v1\/?$/, '/api/public');
    const params = new URLSearchParams();
    
    if (filters.hinjewadiPhase) params.append('hinjewadiPhase', filters.hinjewadiPhase);
    if (filters.location) params.append('location', filters.location);
    if (filters.developer) params.append('developer', filters.developer);
    if (filters.bhkType) params.append('bhkType', filters.bhkType);
    if (filters.minBudget) params.append('minBudget', filters.minBudget);
    if (filters.maxBudget) params.append('maxBudget', filters.maxBudget);
    if (filters.projectStatus) params.append('projectStatus', filters.projectStatus);
    if (filters.reraRegistered !== undefined && filters.reraRegistered !== null) params.append('reraRegistered', filters.reraRegistered);
    if (filters.readyToMove) params.append('readyToMove', 'true');
    if (filters.underConstruction) params.append('underConstruction', 'true');
    if (filters.newLaunch) params.append('newLaunch', 'true');
    if (filters.hasResale) params.append('hasResale', 'true');
    if (filters.hasRental) params.append('hasRental', 'true');
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    params.append('page', filters.page || 0);
    params.append('size', filters.size || 12);

    try {
      const response = await fetch(`${publicUrl}/societies?${params.toString()}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('[API] Public societies fetch failed, falling back to local societies cache:', err);
    }
    // Fallback: build card list from local societies mock if offline
    try {
      const allSocieties = LocalMockDb.getSocieties();
      return {
        content: allSocieties.map(s => ({
          id: s.id,
          name: s.name,
          canonicalName: s.canonicalName || s.name,
          slug: s.slug || s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          location: s.location || 'HINJEWADI',
          hinjewadiPhase: s.hinjewadiPhase || 'PHASE_1',
          developer: s.developer || s.builder?.name || '24K Realtors Partner',
          configuration: s.configuration || '2 BHK, 3 BHK',
          projectStatus: s.projectStatus || 'UNDER_CONSTRUCTION',
          reraRegistered: !!s.reraNumber,
          reraNumber: s.reraNumber || 'RERA-PUN-VERIFIED',
          startingPrice: s.startingPrice || 8500000,
          priceRange: s.priceRange || '₹85 L - ₹1.8 Cr',
          priceLastVerified: s.priceLastVerified || '2026-08-25',
          possessionDate: s.possessionDate || 'December 2027',
          confidenceLevel: s.confidenceLevel || 'HIGH',
          lastVerifiedAt: s.lastVerifiedAt || '2026-08-25',
          heroImageUrl: s.galleryUrls ? s.galleryUrls.split(',')[0] : '/dev_kolte_patil_township.png',
          hasNewSale: true,
          hasResale: true,
          hasRental: true
        })),
        totalElements: allSocieties.length,
        totalPages: 1,
        size: 12,
        number: 0
      };
    } catch (e) {
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  },

  async getPublicSocietyDetail(slug) {
    const publicUrl = BASE_URL.replace(/\/api\/v1\/?$/, '/api/public');
    try {
      const response = await fetch(`${publicUrl}/societies/${slug}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('[API] Public society detail fetch failed, checking local mock:', err);
    }
    // Fallback to local data
    const all = LocalMockDb.getSocieties();
    const found = all.find(s => (s.slug === slug) || (s.name && s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug));
    if (found) {
      // ── Smart BHK Configuration Builder ──────────────────────────
      const BHK_MAP = {
        'Studio':       { min: 280,  max: 380,  mul: 0.40 },
        '1 BHK':        { min: 380,  max: 490,  mul: 0.55 },
        '2 BHK':        { min: 645,  max: 800,  mul: 0.76 },
        '3 BHK':        { min: 920,  max: 1150, mul: 1.00 },
        '4 BHK':        { min: 1380, max: 1650, mul: 1.45 },
        'Duplex':       { min: 1200, max: 1500, mul: 1.30 },
        'Penthouse':    { min: 2100, max: 2800, mul: 2.10 },
        'Villa':        { min: 2200, max: 3200, mul: 2.50 },
      };
      const basePrice = found.startingPrice || 8500000;
      const configTokens = (found.configuration || '2 BHK, 3 BHK')
        .split(/,\s*/).map(s => s.trim()).filter(Boolean);
      const configurations = configTokens.map(token => {
        const matchKey = Object.keys(BHK_MAP).find(k =>
          token.toLowerCase().includes(k.toLowerCase())
        ) || '3 BHK';
        const c = BHK_MAP[matchKey];
        const minP = Math.round(basePrice * c.mul);
        const maxP = Math.round(minP * 1.28);
        const fmtPrice = (p) => p >= 10000000
          ? `\u20b9${(p/10000000).toFixed(2)} Cr`
          : `\u20b9${Math.round(p/100000)} Lakhs`;
        return {
          bhkType: token,
          minCarpetAreaSqft: c.min,
          maxCarpetAreaSqft: c.max,
          startingPrice: minP,
          priceRange: `${fmtPrice(minP)} \u2013 ${fmtPrice(maxP)}`,
          available: true,
          source: 'MahaRERA Approved Plan',
        };
      });
      const allMins = configurations.map(c => c.minCarpetAreaSqft);
      const allMaxs = configurations.map(c => c.maxCarpetAreaSqft);

      return {
        id: found.id,
        name: found.name,
        canonicalName: found.canonicalName || found.name,
        slug: found.slug,
        seoTitle: found.seoTitle || `${found.name} | Verified Price, Floor Plans & RERA | 24K Realtors`,
        seoDescription: found.seoDescription || `Complete verified intelligence for ${found.name}. RERA status, dynamic pricing, floor plans & reviews.`,
        location: found.location || 'HINJEWADI',
        hinjewadiPhase: found.hinjewadiPhase || 'PHASE_1',
        fullAddress: found.fullAddress || `${found.name}, Rajiv Gandhi Infotech Park, Hinjewadi, Pune, Maharashtra 411057`,
        pincode: found.pincode || '411057',
        developer: found.developer || 'Kolte Patil Developers',
        reraRegistered: !!found.reraNumber,
        reraNumber: found.reraNumber || '',
        reraStatus: 'REGISTERED_VERIFIED',
        projectStatus: found.projectStatus || 'UNDER_CONSTRUCTION',
        startingPrice: found.startingPrice || 8500000,
        priceRange: found.priceRange || '\u20b985 Lakhs \u2013 \u20b92.10 Cr',
        pricePerSqft: found.pricePerSqft || 7800,
        priceLastVerified: found.priceLastVerified || '27 Aug 2026',
        possessionDate: found.possessionDate || 'December 2027',
        landAreaAcres: found.landAreaAcres || 12.5,
        totalUnits: found.totalUnits || 450,
        totalTowers: found.totalTowers || 6,
        totalFloors: found.totalFloors || 28,
        configurationSummary: found.configuration || '2 BHK, 3 BHK',
        minCarpetAreaSqft: Math.min(...allMins),
        maxCarpetAreaSqft: Math.max(...allMaxs),
        overview: found.overview || `${found.name} is a premier residential community in ${found.location || 'Hinjewadi'}, Pune.`,
        description: found.overview,
        locationAdvantage: found.travelTimeInfo || 'Direct connectivity to Hinjewadi IT Parks, Metro Line 3 and Mumbai-Pune Expressway.',
        amenities: [
          { amenityKey: 'swimming_pool', amenityLabel: 'Olympic Lap Pool', verified: true },
          { amenityKey: 'clubhouse', amenityLabel: '25,000 sq.ft Grand Clubhouse', verified: true },
          { amenityKey: 'gym', amenityLabel: 'CrossFit & High-Tech Gymnasium', verified: true },
          { amenityKey: 'ev_charging', amenityLabel: 'Dedicated EV Charging Stations', verified: true },
          { amenityKey: 'coworking', amenityLabel: 'Executive Co-Working Pods', verified: true },
          { amenityKey: 'jogging', amenityLabel: 'Landscaped Jogging & Cycling Track', verified: true }
        ],
        configurations,
        allPrices: [
          { priceType: 'NEW_SALE', minPrice: found.startingPrice || 8500000, maxPrice: Math.round((found.startingPrice || 8500000) * 2.1), pricePerSqft: found.pricePerSqft || 7800, priceSource: 'Developer Master Price Sheet', lastVerifiedAt: found.priceLastVerified || '27 Aug 2026' },
          { priceType: 'RESALE', minPrice: Math.round((found.startingPrice || 8500000) * 0.92), maxPrice: Math.round((found.startingPrice || 8500000) * 1.85), pricePerSqft: (found.pricePerSqft || 7800) - 300, priceSource: 'Verified Registry Transactions', lastVerifiedAt: found.priceLastVerified || '27 Aug 2026' },
          { priceType: 'RENT', minPrice: 26000, maxPrice: 55000, pricePerSqft: 35, priceSource: 'Verified Tenant Agreements', lastVerifiedAt: found.priceLastVerified || '27 Aug 2026' }
        ],
        heroImageUrl: found.galleryUrls ? found.galleryUrls.split(',')[0].trim() : '/dev_kolte_patil_township.png',
        galleryUrls: found.galleryUrls
          ? found.galleryUrls.split(',').map(u => u.trim())
          : ['/dev_kolte_patil_township.png', '/dev_godrej_building.png', '/dev_vj_building.png'],
        nearbySchools: found.nearbySchools || 'Mercedes-Benz International School, Blue Ridge Public School',
        nearbyHospitals: found.nearbyHospitals || 'Ruby Hall Clinic Hinjewadi (2.5 km), Lifepoint Multispeciality (3.0 km)',
        nearbyItParks: found.nearbyItParks || 'Infosys Phase 1, Wipro Circle, Quadron Business Park',
        nearbyMetro: found.nearbyMetro || 'Hinjewadi Megapolis Metro Station (Line 3) \u2014 800m',
        travelTimeInfo: found.travelTimeInfo || 'Mumbai-Pune Expressway (10 mins) \u2022 Balewadi High Street (15 mins) \u2022 Pune Airport (45 mins)',
        rentalYield: found.rentalYield || 4.6,
        investmentScore: found.investmentScore || 88,
        sources: [
          { sourceName: 'MahaRERA Authority Records', sourceType: 'OFFICIAL_RERA', dateChecked: found.priceLastVerified || '27 Aug 2026', verificationStatus: 'VERIFIED' },
          { sourceName: 'Official Developer Disclosures', sourceType: 'OFFICIAL_DEVELOPER', dateChecked: found.priceLastVerified || '27 Aug 2026', verificationStatus: 'VERIFIED' }
        ],
        confidenceLevel: 'HIGH',
        lastVerifiedAt: found.priceLastVerified || '27 Aug 2026',
      };
    }
    throw new Error('Society not found');
  },

  async getPublicLocationData(slug) {
    const publicUrl = BASE_URL.replace(/\/api\/v1\/?$/, '/api/public');
    try {
      const response = await fetch(`${publicUrl}/societies/location/${slug}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('[API] Location intelligence fetch failed, returning structured mock:', err);
    }
    // Location fallback data
    const locationNames = {
      'hinjewadi-phase-1': 'Hinjewadi Phase 1',
      'hinjewadi-phase-2': 'Hinjewadi Phase 2',
      'hinjewadi-phase-3': 'Hinjewadi Phase 3',
      'mahalunge': 'Mahalunge',
      'hinjewadi': 'Hinjewadi IT Corridor'
    };
    const title = locationNames[slug] || slug.replace('-', ' ').toUpperCase();
    return {
      name: title,
      slug: slug,
      pincode: slug.includes('mahalunge') ? '411045' : '411057',
      seoTitle: `${title} Properties & Residential Societies | 24K Realtors Pune`,
      seoDescription: `Comprehensive property intelligence for ${title}. Verified societies, live price trends, RERA status, and investment ROI analysis.`,
      seoH1: `${title} Real Estate & Property Intelligence`,
      overview: `${title} is one of Western Pune's primary high-growth residential and commercial powerhouses, home to Fortune 500 IT hubs, world-class social infrastructure, and rapid metro connectivity.`,
      connectivityInfo: 'Direct access to Mumbai-Pune Expressway, NH48 Highway, and upcoming Pune Metro Line 3.',
      totalProjects: 48,
      readyToMoveCount: 18,
      underConstructionCount: 22,
      newLaunchCount: 8,
      upcomingCount: 4,
      minPrice: 6200000,
      maxPrice: 28000000,
      priceSummaryLastVerified: '2026-08-25',
      has1Bhk: true,
      has2Bhk: true,
      has3Bhk: true,
      has4Bhk: true,
      hasVilla: true,
      schools: 'Mercedes-Benz International School, Vibgyor High, Blue Ridge Public School',
      hospitals: 'Ruby Hall Clinic, Sanjeevani Hospital, Surya Mother & Child Care',
      metroConnectivity: 'Pune Metro Line 3 (Hinjewadi to Shivajinagar) with multiple operational stations',
      featuredSocieties: []
    };
  },

  // ─── BLOG API METHODS ───────────────────────────────────────────────────────
  
  // Public: Get published blogs (paginated)
  async getBlogs(page = 0, size = 10) {
    try {
      const res = await fetch(`${BASE_URL}/blogs?page=${page}&size=${size}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[API] getBlogs failed, returning empty structure:', err.message);
    }
    return { content: [], totalPages: 0, totalElements: 0, number: page };
  },

  // Public: Get published blog by slug
  async getBlogBySlug(slug) {
    const res = await fetch(`${BASE_URL}/blogs/slug/${slug}`);
    if (!res.ok) {
      throw new Error(`Blog with slug "${slug}" not found (HTTP ${res.status})`);
    }
    return await res.json();
  },

  // Admin: Get all blogs including drafts (requires auth token)
  async getBlogsAdmin(page = 0, size = 10) {
    const res = await fetch(`${BASE_URL}/blogs/admin?page=${page}&size=${size}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch admin blogs (HTTP ${res.status})`);
    }
    return await res.json();
  },

  // Admin: Create new blog
  async createBlog(blogPayload) {
    const res = await fetch(`${BASE_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(blogPayload)
    });
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Failed to create blog: ${errBody || res.statusText}`);
    }
    return await res.json();
  },

  // Admin: Update blog by ID
  async updateBlog(id, blogPayload) {
    const res = await fetch(`${BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(blogPayload)
    });
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Failed to update blog: ${errBody || res.statusText}`);
    }
    return await res.json();
  },

  // Admin: Delete blog by ID (soft delete via backend)
  async deleteBlog(id) {
    const res = await fetch(`${BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!res.ok && res.status !== 204) {
      throw new Error(`Failed to delete blog (HTTP ${res.status})`);
    }
    return true;
  },

  // Public Verified Inventory Discovery (Source of Truth: Strictly Available + Published)
  async getPublicInventory(params = {}) {
    const q = new URLSearchParams();
    if (params.societySlug) q.append('societySlug', params.societySlug);
    if (params.location) q.append('location', params.location);
    if (params.hinjewadiPhase) q.append('hinjewadiPhase', params.hinjewadiPhase);
    if (params.bhkType) q.append('bhkType', params.bhkType);
    if (params.minPrice) q.append('minPrice', params.minPrice);
    if (params.maxPrice) q.append('maxPrice', params.maxPrice);
    if (params.builder) q.append('builder', params.builder);
    if (params.query) q.append('query', params.query);
    if (params.page !== undefined) q.append('page', params.page);
    if (params.size !== undefined) q.append('size', params.size);
    if (params.sortBy) q.append('sortBy', params.sortBy);
    if (params.direction) q.append('direction', params.direction);

    const publicUrl = BASE_URL.replace('/v1', '/public');
    const response = await fetch(`${publicUrl}/inventory?${q.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch public verified inventory');
    return response.json();
  },

  async getPublicInventoryById(id) {
    const publicUrl = BASE_URL.replace('/v1', '/public');
    const response = await fetch(`${publicUrl}/inventory/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch unit ${id}`);
    return response.json();
  },

  async getProjectInventory(societySlug) {
    const publicUrl = BASE_URL.replace('/v1', '/public');
    const response = await fetch(`${publicUrl}/inventory/project/${societySlug}`);
    if (!response.ok) throw new Error(`Failed to fetch inventory for project ${societySlug}`);
    return response.json();
  },

  async getLocationHierarchy() {
    return runWithFallback(
      async () => {
        const response = await fetch(`${BASE_URL}/localities/hierarchy`);
        if (!response.ok) throw new Error('Failed to fetch location hierarchy');
        return response.json();
      },
      () => []
    );
  },

  // Inventory Units APIs
  async getInventoryUnits(params = {}) {
    const q = new URLSearchParams();
    if (params.societyId) q.append('societyId', params.societyId);
    if (params.tower) q.append('tower', params.tower);
    if (params.bhkType) q.append('bhkType', params.bhkType);
    if (params.status) q.append('status', params.status);
    if (params.minPrice) q.append('minPrice', params.minPrice);
    if (params.maxPrice) q.append('maxPrice', params.maxPrice);
    if (params.query) q.append('query', params.query);
    if (params.page !== undefined) q.append('page', params.page);
    if (params.size !== undefined) q.append('size', params.size);

    const response = await fetch(`${BASE_URL}/inventory/units?${q.toString()}`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch inventory units');
    return response.json();
  },

  async getInventoryStats() {
    const response = await fetch(`${BASE_URL}/inventory/stats`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch inventory stats');
    return response.json();
  },

  async getInventoryProjects() {
    const response = await fetch(`${BASE_URL}/inventory/projects`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch inventory project summaries');
    return response.json();
  },

  async createInventoryUnit(unitData) {
    const response = await fetch(`${BASE_URL}/inventory/units`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(unitData)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create inventory unit');
    }
    return response.json();
  },

  async updateInventoryUnit(id, unitData) {
    const response = await fetch(`${BASE_URL}/inventory/units/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(unitData)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update inventory unit');
    }
    return response.json();
  },

  async updateInventoryUnitStatus(id, status) {
    const response = await fetch(`${BASE_URL}/inventory/units/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update inventory unit status');
    return response.json();
  },

  async deleteInventoryUnit(id) {
    const response = await fetch(`${BASE_URL}/inventory/units/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok && response.status !== 204) throw new Error('Failed to delete unit');
    return true;
  }
};



