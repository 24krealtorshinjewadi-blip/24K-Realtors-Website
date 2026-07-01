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
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "FULLY_FURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-8",
    title: "Megapolis Splendour 1 BHK",
    description: "Premium cozy 1 BHK apartment in Megapolis Splendour, Hinjewadi Phase 3. Fully equipped with semi-furnished cabinets, modular kitchen setup, piped gas connection, and private balcony overlooking the IT corridor.",
    propertyType: "RESIDENTIAL",
    transactionType: "RENT",
    price: 22000,
    areaSquareFeet: 650,
    location: "HINJEWADI",
    address: "Megapolis Splendour, Phase 3, Hinjewadi, Pune",
    latitude: 18.5919,
    longitude: 73.7025,
    bedrooms: 1,
    bathrooms: 1,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: true,
    reraNumber: "RERA-PUN-PRM-24K301",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "SEMI_FURNISHED",
    gasPipeline: true,
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
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "FULLY_FURNISHED",
    gasPipeline: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: "prop-15",
    title: "Cozy Megapolis Sunway 2 BHK",
    description: "Premium 2 BHK rental apartment in Megapolis Sunway, Hinjewadi Phase 3. Fully equipped kitchen, clean ventilation, and parking space.",
    propertyType: "RESIDENTIAL",
    transactionType: "RENT",
    price: 26000,
    areaSquareFeet: 980,
    location: "HINJEWADI",
    address: "Megapolis Sunway, Phase 3, Hinjewadi, Pune",
    latitude: 18.5900,
    longitude: 73.7050,
    bedrooms: 2,
    bathrooms: 2,
    status: "AVAILABLE",
    verifiedListing: true,
    exclusiveDeal: false,
    reraNumber: "RERA-PUN-PRM-24K308",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "SEMI_FURNISHED",
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
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    threeDTourUrl: "https://my.matterport.com/show/?m=JGPmBB6q58g",
    furnishingStatus: "FULLY_FURNISHED",
    gasPipeline: false,
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
    assignedAgentName: "Amit Verma",
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
    assignedAgentName: "Neha Kulkarni",
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
    assignedAgentName: "Rahul Patil",
    assignedAgentPhone: "+919876543203",
    leadScore: 90,
    createdDate: new Date().toISOString()
  }
];

const initialAgents = [
  { id: "agent-1", name: "Amit Verma", phone: "+919876543201", email: "amit.verma@24krealtors.com", active: true },
  { id: "agent-2", name: "Neha Kulkarni", phone: "+919876543202", email: "neha.kulkarni@24krealtors.com", active: true },
  { id: "agent-3", name: "Rahul Patil", phone: "+919876543203", email: "rahul.patil@24krealtors.com", active: true }
];

const getLocalStorageItem = (key, initial) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
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
  getUsers() {
    return getLocalStorageItem('mock_users', [{ username: 'admin', password: 'adminpassword' }]);
  },
  saveUsers(users) {
    saveLocalStorageItem('mock_users', users);
  }
};

// Generic runner that automatically falls back to client database on network errors
const runWithFallback = async (apiFn, fallbackFn) => {
  try {
    const result = await apiFn();
    localStorage.setItem('OFFLINE_MODE_ACTIVE', 'false');
    return result;
  } catch (err) {
    const isNetworkError = err.name === 'TypeError' || 
                           err.message.includes('Failed to fetch') || 
                           err.message.includes('NetworkError') || 
                           err.message.includes('Failed to execute') ||
                           err.message.includes('network error');
                           
    if (isNetworkError) {
      console.warn("[OFFLINE SYNC] Spring Boot server unreachable. Falling back to local browser-based database.", err);
      localStorage.setItem('OFFLINE_MODE_ACTIVE', 'true');
      return fallbackFn();
    }
    localStorage.setItem('OFFLINE_MODE_ACTIVE', 'false');
    throw err;
  }
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
          throw new Error(errText || 'Authentication failed. Please check your credentials.');
        }
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('role', data.role);
        localStorage.setItem('adminUser', data.username);
        return data;
      },
      () => {
        const users = LocalMockDb.getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
          throw new Error('Authentication failed. Invalid local credentials.');
        }
        const token = "mock-jwt-session-token-xyz-123";
        const refreshToken = "mock-refresh-token-xyz-123";
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('role', 'CRM_ADMIN');
        localStorage.setItem('adminUser', username);
        return { token, refreshToken, username, role: 'CRM_ADMIN' };
      }
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
      }
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
    return runWithFallback(
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
        
        const response = await fetch(`${BASE_URL}/properties?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch properties: ${response.statusText}`);
        }
        return response.json();
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
  },

  async getPropertyById(id) {
    return runWithFallback(
      async () => {
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
              {type: "text", text: "Amit Verma"},
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
  }
};
