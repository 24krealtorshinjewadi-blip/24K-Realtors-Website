/**
 * KasturiEonHomesProjectPage.jsx — 24K Realtors
 * ─────────────────────────────────────────────────────────────────────────────
 * Ultra-Luxury Flagship Project Subpage for Kasturi Eon Homes,
 * Hinjawadi Phase 3, Pune.
 *
 * Project Specifications:
 *  - Project Name: Kasturi Eon Homes
 *  - Developer: Kasturi Housing
 *  - Location: Hinjawadi Phase 3, Opposite TCS Sahyadri Park, Pune — 411057
 *  - Primary / Recent MahaRERA Numbers:
 *      • P52100046679
 *      • P52100080318
 *      • P52100055358
 *      • P52100024680
 *      • P52100030732
 *      • P52100048176
 *  - Architectural Masterplan:
 *      • 12 Iconic symmetrical towers arranged around a continuous 8-acre vehicle-free central park.
 *      • 25,000 sq. ft. lifestyle club with multi-tier sports arena.
 *  - Apartment Configurations & Carpet Areas:
 *      • 2 BHK: 839 – 845 sq. ft. Standard layouts (premium variants up to ~914–940 sq. ft.)
 *      • 2.5 BHK: 950 – 970 sq. ft. Offers extra study / flexible work space
 *      • 3 BHK Mini / Comfort: 1,145 – 1,150 sq. ft. Standard 3 BHK configuration
 *      • 3 BHK Luxury: 1,185 – 1,282 sq. ft. Maximum spacious variants available in the property
 *  - Key Amenities:
 *      • The Club & Sports Arena: Fully equipped Gymnasium, Lap Pool and Kids Pool, Squash Court,
 *        Badminton Court, Tennis Courts, Basketball Court, Cricket Pitches, Billiards/Pool Table, and a sports bar.
 *      • Rejuvenation & Entertainment: Aerobics/Meditation Room, Steam Room, Amphitheatre,
 *        Mini Theatre, and landscaped podium gardens.
 *      • Convenience & Utilities: 100% DG Power Backup, Piped Gas Pipeline, Solar Water Heating,
 *        Schindler High-Speed Elevators, EV Charging Bays.
 *      • Security: 3-Tier Integrated Security, 24/7 CCTV, Biometric Access, Intercom & Video Door Phone.
 *  - 100% Authentic On-Site Photos (Verified Views):
 *      • Balcony Deck overlooking 8-acre vehicle-free podium park
 *      • Grand Living & Dining Hall with floor-to-ceiling glass sliding doors
 *      • Corner Glazed Master Bedroom with dual-aspect skyline view
 *      • Parallel Counter Modular Kitchen with Hob & Chimney
 *      • Designer Bathroom with Glass Walk-in Shower Enclosure & Wall-Hung Commode
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, ShieldCheck, Phone, MessageSquare, ArrowLeft,
  CheckCircle2, Star, Clock, Zap, Car, Dumbbell, Trees,
  Lock, Home, IndianRupee, ChevronDown, ChevronUp,
  Building2, Award, X, ChevronLeft, ChevronRight, Maximize2,
  ZoomIn, ZoomOut, RotateCcw, Sparkles, Trophy, Activity, Waves,
  Check, ExternalLink, HelpCircle, Layers, Compass, Eye, Shield,
  Copy, ArrowRight, Share2, Calendar, Droplets, Sun, Wind, Tv,
  Coffee, HeartPulse, Flame
} from 'lucide-react';
import { useSEO } from '../services/seoService';
import CompanyLogo from './CompanyLogo';

/* ══════════════════════════════════════════════════════════════════
   KASTURI EON HOMES PROJECT DATA SPECIFICATION
══════════════════════════════════════════════════════════════════ */
const KASTURI_EON_DATA = {
  key: 'kasturi-eon-homes',
  name: 'Kasturi Eon Homes',
  shortName: 'Eon Homes',
  developer: 'Kasturi Housing',
  reraNumbers: [
    { number: 'P52100046679', phase: 'Recent Phase / Tower Expansion', type: 'Residential Tower' },
    { number: 'P52100080318', phase: 'Latest MahaRERA Registration', type: 'Residential Tower' },
    { number: 'P52100055358', phase: 'Active Registered Phase', type: 'High-Rise Wing' },
    { number: 'P52100024680', phase: 'Certified Residential Cluster', type: 'Residential Wing' },
    { number: 'P52100030732', phase: 'Registered High-Rise Wing', type: 'Residential Wing' },
    { number: 'P52100048176', phase: 'Podium Residence Phase', type: 'Residential Wing' }
  ],
  reraSummary: 'P52100046679 · P52100080318 · P52100055358 · P52100024680 · P52100030732 · P52100048176',
  location: 'Hinjawadi Phase 3, Opposite TCS Sahyadri Park, Hinjewadi, Pune — 411057',
  status: 'Ready to Move & Nearing Possession Wings',
  tagline: '12 Iconic Symmetrical Towers Arranged Around an 8-Acre Vehicle-Free Central Park',
  heroSubline: 'Pune’s gold standard of luxury architecture by Kasturi Housing in Hinjawadi Phase 3. Featuring pristine 2 BHK (839–845 sq.ft), 2.5 BHK (950–970 sq.ft with dedicated study), 3 BHK Mini / Comfort (1,145–1,150 sq.ft), and ultra-spacious 3 BHK Luxury (1,185–1,282 sq.ft) residences. Complete with 25,000 sq.ft lifestyle clubhouse, Olympic lap pool, squash courts, sports bar, and multi-tier sports arena directly opposite TCS Sahyadri Park.',
  accentColor: '#D4AF37',
  accentGradient: 'linear-gradient(135deg, #B38918 0%, #D4AF37 50%, #FFDF79 100%)',
  heroBg: 'linear-gradient(160deg, #070e1b 0%, #151a28 45%, #050913 100%)',
  showcaseImage: '/kasturi_eon_homes_project_card.jpg',
  investmentScore: 99,
  priceNegotiable: true,
  whatsappText: 'Hi 24K Realtors, I am interested in Kasturi Eon Homes in Hinjawadi Phase 3 (2 BHK / 2.5 BHK / 3 BHK Luxury). Please share verified inventory, floor plans, and schedule a VIP private site visit.',

  gallery: [
    {
      id: 1,
      tag: 'Verified Actual Tower Elevation & Main Gate',
      icon: '🏢',
      roomName: 'High-Rise Tower & Gate',
      title: 'Kasturi Eon Homes — Actual High-Rise Elevation & Entrance Canopy',
      subtitle: 'Authentic on-site photograph showcasing the soaring 22+ storey residential towers, grand cantilevered entrance canopy gate, security access control, and tree-lined frontage directly opposite TCS Sahyadri Park.',
      src: '/kasturi_eon_homes_project_card.jpg',
      badge: 'VERIFIED ON-SITE ELEVATION',
      features: [
        { icon: '🏙️', title: 'Soaring Contemporary Facade', desc: 'Full-height glass balconies and pristine modern architectural symmetry' },
        { icon: '⛩️', title: 'Grand Covered Entrance Canopy', desc: 'Exclusive access control gate with security canopy, RFID boom barriers, and lush tree canopy' },
        { icon: '🏢', title: 'Iconic Hinjawadi Phase 3 Skyline', desc: 'Direct landmark presence right opposite the TCS Sahyadri Park campus' }
      ]
    },
    {
      id: 2,
      tag: 'Grand Masterplan & 8-Acre Central Park Layout',
      icon: '🌳',
      roomName: '8-Acre Park Masterplan',
      title: 'Architectural Masterplan — 12 Symmetrical Towers & Central Podium Greens',
      subtitle: 'Architectural master layout illustrating the 12 symmetrical high-rise towers arranged seamlessly around the 8-acre continuous vehicle-free central park with Olympic lap pool.',
      src: '/kasturi_eon_homes_masterplan.jpg',
      badge: 'MASTER ARCHITECTURAL PLAN',
      features: [
        { icon: '🏙️', title: '12 Iconic Symmetrical Towers', desc: 'Flawlessly planned architectural symmetry with unhindered air circulation and natural daylight' },
        { icon: '🌳', title: '8-Acre Vehicle-Free Central Park', desc: 'Massive elevated green podium park free of vehicular traffic for children, seniors, and jogging' },
        { icon: '🏊', title: 'Resort-Scale Lap & Kids Pool', desc: 'Olympic-style swimming pool, kids splash pool, and sunken deck lounges' }
      ]
    },
    {
      id: 2,
      tag: 'Panoramic Central Park Viewing Balcony',
      icon: '🌿',
      roomName: 'Podium Park Balcony',
      title: 'Private Viewing Terrace — Wood-Finish Deck & Clear Glass Railing',
      subtitle: 'Authentic on-site balcony view with rich wood-textured anti-skid plank tiles and sleek seamless glass balustrade looking out over the 8-acre central park landscape and towering high-rises.',
      src: '/kasturi_eon_homes_balcony.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🪵', title: 'Wood-Finish Ceramic Deck', desc: 'Rustic timber-textured anti-skid tile flooring that provides a luxurious resort-like balcony atmosphere' },
        { icon: '🛡️', title: 'Frameless Glass Balustrade', desc: 'Heavy-duty toughened safety glass railing maximizing unobstructed panoramic garden views' },
        { icon: '🌧️', title: 'Weatherproof Integrated Drainage', desc: 'Concealed rainwater drainage grid and premium granite sill borders' }
      ]
    },
    {
      id: 3,
      tag: 'Expansive Living & Dining Hall',
      icon: '🛋️',
      roomName: 'Grand Living Hall',
      title: 'Palatial Living & Dining Lounge — Mirror Polish Vitrified Flooring',
      subtitle: 'Extra-wide open living hall laid with high-gloss mirror-finish vitrified tiles, designer gypsum false ceiling with warm recessed LED downlights, and floor-to-ceiling glass sliding doors to the deck.',
      src: '/kasturi_eon_homes_living.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '✨', title: 'Mirror-Finish Floor Tiles', desc: 'Seamless large-format vitrified tiles reflecting ample natural light throughout the room' },
        { icon: '🪟', title: 'Floor-to-Ceiling Sliding Doors', desc: 'Multi-track black anodized sliding doors connecting living space effortlessly to the deck' },
        { icon: '💡', title: 'Concealed Architectural Lighting', desc: 'Gypsum false ceiling with integrated warm LED spots and pre-wired inverter backup circuits' }
      ]
    },
    {
      id: 4,
      tag: 'Corner Glazed Master Bedroom',
      icon: '🛏️',
      roomName: 'Scenic Master Bedroom',
      title: 'Sunlit Master Bedroom — Corner Full-Height Glazing & High Ceilings',
      subtitle: 'Peaceful master bedroom featuring wrap-around corner black powder-coated aluminum windows, glossy porcelain tiles, gypsum finished walls, and skyline views of Hinjawadi Phase 3.',
      src: '/kasturi_eon_homes_bedroom.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🪟', title: 'Corner Panoramic Windows', desc: 'Double-glazed sound-dampened corner window frame admitting dual-direction natural light' },
        { icon: '🌬️', title: 'Cross-Ventilation Dynamics', desc: 'Architecturally engineered window placements for constant breeze from Sahyadri hill slopes' },
        { icon: '🔌', title: 'Concealed Wiring & AC Conduits', desc: 'Neatly concealed conduit routing for split air conditioning and bedside multi-plugs' }
      ]
    },
    {
      id: 5,
      tag: 'Contemporary Fitted Modular Kitchen',
      icon: '🍳',
      roomName: 'Fitted Kitchen',
      title: 'Parallel Countertop Kitchen — Quartz Platform, Chimney & Utility Access',
      subtitle: 'Fully-equipped modern kitchen layout with parallel quartz/granite work surfaces, glossy white soft-close cabinetry, branded stainless steel exhaust hood, deep sink, and utility balcony door.',
      src: '/kasturi_eon_homes_kitchen.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🍽️', title: 'Parallel Quartz Prep Platforms', desc: 'Ergonomic dual-sided work counters offering separated wet and dry prep zones' },
        { icon: '💨', title: 'Integrated Electric Chimney', desc: 'High-suction stainless steel and glass chimney with dedicated exhaust venting duct' },
        { icon: '🧺', title: 'Dry Balcony & Gas Pipeline', desc: 'Piped natural gas connection and attached service balcony for washing machine & utility' }
      ]
    },
    {
      id: 6,
      tag: 'Designer Bathroom with Glass Walk-In Shower',
      icon: '🚿',
      roomName: 'Luxury Bathroom',
      title: 'Hotel-Grade Master Bathroom — Glass Cubicle & Wall-Hung Commode',
      subtitle: 'Pristine master en-suite bathroom with frameless glass walk-in shower partition, rainfall showerhead, European wall-hung commode with concealed flush, vanity basin, and mirror cabinet.',
      src: '/kasturi_eon_homes_bathroom.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🚿', title: 'Glass Walk-In Shower Partition', desc: 'Full-height toughened glass enclosure keeping the bath space completely dry and slip-free' },
        { icon: '🚽', title: 'Wall-Hung Commode & Dual Flush', desc: 'Concealed geberit cistern with chrome dual-flush plate and hygienic wall-hung fixture' },
        { icon: '🪞', title: 'Floating Vanity & Chrome Tapware', desc: 'Wall-mounted designer washbasin with under-storage drawers and branded hot/cold mixer' }
      ]
    }
  ],

  configurations: [
    {
      type: '2 BHK Premium Residence',
      shortType: '2 BHK',
      carpet: '839 – 845 sq. ft.',
      carpetNote: 'Standard Layouts (Older / Selected variants up to ~914–940 sq. ft.)',
      inclusions: '2 Bedrooms, 2 Bathrooms, Living & Dining Hall, Fitted Kitchen, Private Balcony Deck, Dry Balcony',
      balcony: 'Attached Central Park Viewing Deck + Utility Dry Balcony',
      bathrooms: '2 Luxury Bathrooms (Master En-suite with Glass Shower + Common)',
      pricing: '₹92 L – ₹98 L* (Negotiable)',
      status: 'Ready to Move & Available',
      idealFor: 'IT Professionals, Young Families seeking large carpet area and luxury podium amenities',
      highlightBadge: 'MOST POPULAR 2 BHK CARPET',
      specs: [
        { label: 'Usable Carpet Area', val: '839 to 845 sq. ft. pure carpet' },
        { label: 'Living Room', val: 'Spacious hall with floor-to-ceiling glass sliding doors' },
        { label: 'Kitchen', val: 'Fitted parallel counters with chimney & dry balcony' },
        { label: 'Balcony Deck', val: 'Wood-finish ceramic deck overlooking 8-acre park' }
      ]
    },
    {
      type: '2.5 BHK Smart Luxury Residence',
      shortType: '2.5 BHK',
      carpet: '950 – 970 sq. ft.',
      carpetNote: 'Includes Dedicated Work-From-Home / Study Room',
      inclusions: '2 Bedrooms + Dedicated Study/Flexible Room, 2 Bathrooms, Living & Dining, Kitchen, Deck, Utility',
      balcony: 'Park-Facing Private Terrace + Attached Dry Balcony',
      bathrooms: '2 Bathrooms with Glass Shower & Wall-Hung Commodes',
      pricing: '₹1.05 Cr – ₹1.15 Cr* (Negotiable)',
      status: 'High Demand Work-From-Home Configuration',
      idealFor: 'Tech Leads, Remote Work Professionals requiring a dedicated private office/study space',
      highlightBadge: 'DEDICATED STUDY ROOM',
      specs: [
        { label: 'Usable Carpet Area', val: '950 to 970 sq. ft. pure carpet' },
        { label: 'Extra Flex Space', val: 'Dedicated private study / nursery / office room' },
        { label: 'Living & Dining', val: 'Open plan entertaining area with abundant light' },
        { label: 'Fittings', val: 'Grohe / Toto sanitaryware and mirror vitrified tiles' }
      ]
    },
    {
      type: '3 BHK Mini / Comfort Residence',
      shortType: '3 BHK Comfort',
      carpet: '1,145 – 1,150 sq. ft.',
      carpetNote: 'Standard 3 BHK Configuration',
      inclusions: '3 Bedrooms, 3 Bathrooms, Living & Dining Hall, Gourmet Kitchen, Viewing Deck, Dry Balcony',
      balcony: 'Expansive Central Park View Deck + Utility Balcony',
      bathrooms: '3 Designer Bathrooms with Frameless Glass Partitions',
      pricing: '₹1.28 Cr – ₹1.38 Cr* (Negotiable)',
      status: 'Ready to Move / Verified Units',
      idealFor: 'Growing Families, Senior Managers wanting balanced 3 BHK layout with 3 full baths',
      highlightBadge: 'COMFORT 3 BHK SUITE',
      specs: [
        { label: 'Usable Carpet Area', val: '1,145 to 1,150 sq. ft. pure carpet' },
        { label: 'Bedrooms', val: '3 Full-sized private bedrooms with large windows' },
        { label: 'Bathrooms', val: '3 Luxury bathrooms with hot/cold diverters' },
        { label: 'Balcony', val: 'Deep wood-textured viewing deck towards central greens' }
      ]
    },
    {
      type: '3 BHK Ultra-Luxury Residence',
      shortType: '3 BHK Luxury',
      carpet: '1,185 – 1,282 sq. ft.',
      carpetNote: 'Maximum Spacious Variants Available in Kasturi Eon Homes',
      inclusions: '3 Grand Bedrooms, 3 Bathrooms, Palatial Living & Dining Lounge, Island Kitchen Space, Grand Deck',
      balcony: 'Panoramic Unobstructed High-Floor Podium & Hill Deck',
      bathrooms: '3 Bathrooms with Italian Marble Patterns & Glass Enclosures',
      pricing: '₹1.42 Cr – ₹1.58 Cr* (Negotiable)',
      status: 'Flagship Luxury Inventory',
      idealFor: 'HNWIs, Tech Directors, Executives desiring maximum carpet area in Phase 3',
      highlightBadge: 'MAXIMUM SPAPIOUS VARIANT',
      specs: [
        { label: 'Usable Carpet Area', val: '1,185 to 1,282 sq. ft. (Flagship variant)' },
        { label: 'Living Lounge', val: 'Palatial entertaining space with double sliding doors' },
        { label: 'Master Suite', val: 'Grand master suite with dressing area and en-suite bath' },
        { label: 'Finishes', val: 'Schindler elevators, Toto fittings, and Italian marble accents' }
      ]
    }
  ],

  amenities: [
    {
      category: 'The Club & Sports Arena',
      icon: '🏆',
      accent: '#D4AF37',
      items: [
        { name: 'Fully Equipped Gymnasium', desc: 'State-of-the-art commercial grade fitness equipment, free weights, and cardio stations' },
        { name: 'Olympic Lap Pool & Kids Pool', desc: 'Resort-style crystal clear swimming lap pool with separate shallow children’s splash zone' },
        { name: 'Indoor Squash Court', desc: 'Glass-back championship squash court with wooden sports flooring' },
        { name: 'Badminton Courts', desc: 'Indoor multi-court badminton facility with high ceilings and anti-glare illumination' },
        { name: 'Tennis Courts', desc: 'Full-size outdoor synthetic floodlit tennis courts for day and night matches' },
        { name: 'Basketball Court & Cricket Pitches', desc: 'Dedicated hoop court and professional netted cricket batting pitches' },
        { name: 'Billiards / Pool Table Lounge', desc: 'Elite indoor cue sports room featuring championship slate pool and billiards tables' },
        { name: 'Sports Bar & Lounge', desc: 'Exclusive community sports bar for screening live matches and social gatherings' }
      ]
    },
    {
      category: 'Rejuvenation & Entertainment',
      icon: '🎭',
      accent: '#3B82F6',
      items: [
        { name: 'Aerobics & Meditation Room', desc: 'Acoustically treated yoga and mindfulness hall with wooden floor and mirrors' },
        { name: 'Steam Room & Wellness Suite', desc: 'Dedicated hydrothermal steam rooms for restorative post-workout recovery' },
        { name: 'Open-Air Amphitheatre', desc: 'Stepped amphitheatre set amidst green lawns for community cultural evenings and performances' },
        { name: 'Private Mini Theatre', desc: 'Surround-sound private screening cinema for weekend movies and family screenings' },
        { name: 'Landscaped Podium Gardens', desc: '8-acre vehicle-free manicured central park with flowering avenues and zen rock gardens' }
      ]
    },
    {
      category: 'Convenience & Utilities',
      icon: '⚡',
      accent: '#10B981',
      items: [
        { name: '25,000 Sq. Ft. Lifestyle Club', desc: 'Grand multi-level clubhouse serving as the premier social nerve center of the township' },
        { name: '100% DG Power Backup', desc: 'Automatic generator backup powering lifts, water pumps, lighting, and internal apartment points' },
        { name: 'Schindler High-Speed Elevators', desc: 'World-class passenger and stretcher lifts with automatic rescue devices' },
        { name: 'Piped Gas Pipeline & Solar Water', desc: 'Direct MNGL piped cooking gas connection and eco-friendly solar water heating' }
      ]
    },
    {
      category: '3-Tier Integrated Security',
      icon: '🛡️',
      accent: '#EC4899',
      items: [
        { name: 'Biometric & RFID Access Control', desc: 'Automated RFID boom barriers at entrance gates and smart biometric access for towers' },
        { name: '24/7 CCTV Campus Surveillance', desc: 'Over 150 HD infrared cameras monitoring perimeter, basements, lobbies, and podium park' },
        { name: 'Video Door Phone & Intercom', desc: 'Direct digital video intercom connecting every residence with main security guard booths' },
        { name: 'Vehicle-Free Safe Podium', desc: 'Complete segregation of vehicular driveways in basements, keeping children 100% safe on podium' }
      ]
    }
  ],

  commuteMatrix: [
    { destination: 'TCS Sahyadri Park (Directly Opposite)', distance: '0.1 km', time: '1 min' },
    { destination: 'Tech Mahindra Hinjawadi Phase 3', distance: '0.8 km', time: '2 mins' },
    { destination: 'Megapolis Circle & Pawar Public School', distance: '1.2 km', time: '3 mins' },
    { destination: 'Infosys Phase 2 Campus', distance: '2.5 km', time: '5 mins' },
    { destination: 'Wipro Technologies Hinjawadi Phase 2', distance: '3.2 km', time: '7 mins' },
    { destination: 'Pune Metro Line 3 (Upcoming Ph 3 Station)', distance: '1.5 km', time: '4 mins' },
    { destination: 'Hinjawadi Phase 1 Shivaji Chowk', distance: '6.5 km', time: '12 mins' },
    { destination: 'Mumbai-Pune Expressway (Bypass Junction)', distance: '9.0 km', time: '15 mins' }
  ],

  faqs: [
    {
      q: 'What are the official MahaRERA registration numbers for Kasturi Eon Homes?',
      a: 'Kasturi Eon Homes holds multiple primary and recent MahaRERA registrations for its residential towers and wings, including P52100046679, P52100080318, P52100055358, P52100024680, P52100030732, and P52100048176 (along with earlier phases P52100001644 and P52100019489). All phases carry 100% clean title and RERA-approved sanctions.'
    },
    {
      q: 'What are the exact apartment configurations and carpet areas at Kasturi Eon Homes?',
      a: 'Kasturi Eon Homes offers four distinct layout categories: (1) 2 BHK with 839 to 845 sq. ft. carpet area (some premium/older variants up to 940 sq. ft.), (2) 2.5 BHK with 950 to 970 sq. ft. carpet area featuring a dedicated study / work-from-home room, (3) 3 BHK Mini / Comfort with 1,145 to 1,150 sq. ft. carpet area, and (4) 3 BHK Luxury with 1,185 to 1,282 sq. ft. of usable carpet area (the largest residential floor plan available in the property).'
    },
    {
      q: 'What makes the architectural layout of Kasturi Eon Homes unique?',
      a: 'Eon Homes is designed with 12 iconic symmetrical towers encircling an expansive 8-acre continuous vehicle-free central podium park. No cars are allowed on the ground podium level, ensuring peaceful manicured gardens, Olympic lap pool, children play areas, and uninhibited fresh breeze from the Sahyadri hills.'
    },
    {
      q: 'What sports and club amenities are available in the 25,000 sq. ft. clubhouse?',
      a: 'The Club & Sports Arena features a fully equipped commercial gym, lap pool, kids pool, indoor squash court, badminton courts, tennis courts, basketball court, netted cricket pitches, billiards/pool table, and an exclusive sports bar. For wellness, there is an aerobics/meditation room, steam room, amphitheatre, and mini theatre.'
    },
    {
      q: 'Where is Kasturi Eon Homes located in Hinjawadi?',
      a: 'Kasturi Eon Homes is located in Hinjawadi Phase 3, directly opposite TCS Sahyadri Park, Hinjewadi, Pune — 411057. It is walking distance from major IT employers like TCS and Tech Mahindra, and within 3 to 5 minutes of Megapolis Circle and Pawar Public School.'
    },
    {
      q: 'Are prices negotiable and how can I book a site visit?',
      a: 'Yes, 24K Realtors offers direct developer and verified resale advisory with negotiated pricing. You can schedule a complimentary chauffeur-driven private site visit or receive official PDF brochures and floor plans by clicking WhatsApp or calling +91 9673 000 053.'
    }
  ]
};

export default function KasturiEonHomesProjectPage({ initialBhkFilter = null, onBackHome }) {
  const navigate = useNavigate();
  const p = KASTURI_EON_DATA;

  // SEO configuration
  useSEO({
    title: 'Kasturi Eon Homes Hinjawadi Phase 3 Pune | 2, 2.5 & 3 BHK Luxury Flats | 24K Realtors',
    description: 'Explore verified 2 BHK (839-845 sq.ft), 2.5 BHK (950-970 sq.ft with study), 3 BHK Comfort (1145-1150 sq.ft) & 3 BHK Luxury (1185-1282 sq.ft) in Kasturi Eon Homes Hinjawadi Phase 3 Pune opposite TCS. MahaRERA P52100046679, P52100080318. 100% authentic on-site photos.',
    canonical: 'https://24krealtors.in/kasturi-eon-homes-hinjawadi'
  });

  // State
  const [selectedBhk, setSelectedBhk] = useState(initialBhkFilter || 'ALL');
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [openFaqIdx, setOpenFaqIdx] = useState(0);
  const [copiedRera, setCopiedRera] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'f' || e.key === 'F') handleToggleFullscreen();
      if (e.key === '+' || e.key === '=') setZoomLevel(prev => Math.min(prev + 0.4, 3.5));
      if (e.key === '-' || e.key === '_') setZoomLevel(prev => Math.max(prev - 0.4, 0.6));
      if (e.key === '0') { setZoomLevel(1); setPanPosition({ x: 0, y: 0 }); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIdx]);

  const openLightbox = (idx) => {
    setLightboxIdx(idx);
    setZoomLevel(1);
    setRotation(0);
    setPanPosition({ x: 0, y: 0 });
  };

  const closeLightbox = () => {
    setLightboxIdx(null);
    setZoomLevel(1);
    setRotation(0);
    setPanPosition({ x: 0, y: 0 });
  };

  const nextPhoto = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % p.gallery.length);
    setZoomLevel(1);
    setRotation(0);
    setPanPosition({ x: 0, y: 0 });
  };

  const prevPhoto = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + p.gallery.length) % p.gallery.length);
    setZoomLevel(1);
    setRotation(0);
    setPanPosition({ x: 0, y: 0 });
  };

  // Mouse pan inside lightbox
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const copyReraToClipboard = (num) => {
    navigator.clipboard.writeText(num).then(() => {
      setCopiedRera(num);
      setTimeout(() => setCopiedRera(''), 2500);
    });
  };

  const filteredConfigs = selectedBhk === 'ALL'
    ? p.configurations
    : p.configurations.filter(c => {
        if (selectedBhk === '2 BHK') return c.shortType.startsWith('2 BHK');
        if (selectedBhk === '2.5 BHK') return c.shortType.startsWith('2.5');
        if (selectedBhk === '3 BHK') return c.shortType.startsWith('3 BHK');
        return true;
      });

  const activePhoto = p.gallery[activeGalleryIdx] || p.gallery[0];

  return (
    <div className="kasturi-eon-page" style={{ background: '#040814', color: '#F1F5F9', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif" }}>

      {/* ── TOP NAV STRIP ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(4, 8, 20, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => onBackHome ? onBackHome() : navigate('/')}
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#D4AF37',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={16} /> Back to Portal
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Flagship Showcase
            </span>
            <span style={{ color: 'rgba(212,175,55,0.4)' }}>/</span>
            <span style={{ fontSize: '0.88rem', color: '#F3E5AB', fontWeight: 700 }}>
              Kasturi Eon Homes Hinjawadi
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href={`https://wa.me/919673000053?text=${encodeURIComponent(p.whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#25D366',
              color: '#040814',
              borderRadius: '8px',
              padding: '8px 18px',
              fontSize: '0.84rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <MessageSquare size={15} /> WhatsApp VIP Desk
          </a>
          <a
            href="tel:+919673000053"
            style={{
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#D4AF37',
              fontSize: '0.84rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Phone size={15} /> +91 9673 000 053
          </a>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section style={{
        position: 'relative',
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        padding: '60px 5% 40px',
        background: `radial-gradient(circle at 75% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 60%), ${p.heroBg}`,
        borderBottom: '1px solid rgba(212,175,55,0.2)'
      }}>
        <div style={{ maxWidth: '1380px', width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Column: Brand, Titles & Badges */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', borderRadius: '50px', padding: '6px 16px', marginBottom: '18px' }}>
              <Sparkles size={14} color="#D4AF37" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F3E5AB', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Ultra-Luxury Landmark • Hinjawadi Phase 3
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
              lineHeight: 1.15,
              fontWeight: 900,
              margin: '0 0 16px 0',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F3E5AB 50%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.02em'
            }}>
              Kasturi Eon Homes
            </h1>

            <p style={{ fontSize: '1.18rem', color: '#E2E8F0', fontWeight: 600, margin: '0 0 14px 0' }}>
              {p.tagline}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '0.95rem', marginBottom: '24px' }}>
              <MapPin size={18} color="#D4AF37" />
              <span>{p.location}</span>
            </div>

            <p style={{ fontSize: '0.94rem', lineHeight: 1.75, color: '#94A3B8', maxWidth: '640px', marginBottom: '32px' }}>
              {p.heroSubline}
            </p>

            {/* Quick Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Configurations</span>
                <p style={{ margin: '4px 0 0', fontSize: '1.05rem', fontWeight: 700, color: '#F3E5AB' }}>2, 2.5 & 3 BHK</p>
                <span style={{ fontSize: '0.7rem', color: '#10B981' }}>839 – 1,282 sq.ft</span>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Central Greens</span>
                <p style={{ margin: '4px 0 0', fontSize: '1.05rem', fontWeight: 700, color: '#F3E5AB' }}>8-Acre Park</p>
                <span style={{ fontSize: '0.7rem', color: '#10B981' }}>100% Vehicle-Free</span>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Lifestyle Club</span>
                <p style={{ margin: '4px 0 0', fontSize: '1.05rem', fontWeight: 700, color: '#F3E5AB' }}>25,000 Sq.Ft</p>
                <span style={{ fontSize: '0.7rem', color: '#D4AF37' }}>Sports & Wellness</span>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>TCS Campus</span>
                <p style={{ margin: '4px 0 0', fontSize: '1.05rem', fontWeight: 700, color: '#F3E5AB' }}>Directly Opp.</p>
                <span style={{ fontSize: '0.7rem', color: '#38BDF8' }}>Sahyadri Park</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              <a
                href={`https://wa.me/919673000053?text=${encodeURIComponent(p.whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'linear-gradient(135deg, #FFDF79 0%, #D4AF37 50%, #997819 100%)',
                  color: '#040814',
                  borderRadius: '10px',
                  padding: '14px 28px',
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 24px rgba(212,175,55,0.3)',
                  transition: 'transform 0.2s'
                }}
              >
                <Calendar size={18} /> Schedule Chauffeur Site Visit
              </a>
              <button
                onClick={() => {
                  const elem = document.getElementById('configurations-table');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#F1F5F9',
                  borderRadius: '10px',
                  padding: '14px 24px',
                  fontSize: '0.94rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                View Carpet Area Specs <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Hero Showcase Image with Interactive Badge */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '2px solid rgba(212,175,55,0.4)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 35px rgba(212,175,55,0.2)',
              height: '460px'
            }}>
              <img
                src={p.showcaseImage}
                alt="Kasturi Eon Homes Actual Elevation"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 22%', display: 'block', transform: 'scale(1.01)', transition: 'transform 0.4s' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(0deg, rgba(4,8,20,0.95) 0%, rgba(4,8,20,0.2) 50%, transparent 100%)'
              }} />

              {/* Float Overlay Badge */}
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.9)', color: '#040814', fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    <ShieldCheck size={13} /> 100% Verified Project
                  </span>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>
                    Actual Towers &amp; Gate Entrance
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#CBD5E1' }}>
                    Opp. TCS Sahyadri Park, Hinjawadi Phase 3
                  </p>
                </div>
                <button
                  onClick={() => openLightbox(0)}
                  style={{
                    background: 'rgba(15,23,42,0.85)',
                    border: '1px solid rgba(212,175,55,0.5)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#D4AF37',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <Maximize2 size={14} /> Expand High-Res
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── MAHARERA NUMBERS REGISTRY ── */}
      <section style={{ padding: '48px 5%', background: '#070D1C', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', gap: '16px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                <ShieldCheck size={16} /> Statutory Compliance Registry
              </div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', margin: 0, color: '#F3E5AB' }}>
                Primary &amp; Recent MahaRERA Numbers
              </h2>
            </div>
            <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.86rem', maxWidth: '480px' }}>
              All towers and expansion phases are duly registered with Maharashtra Real Estate Regulatory Authority. Click any number to copy instantly for legal due diligence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {p.reraNumbers.map((item, idx) => (
              <div
                key={idx}
                onClick={() => copyReraToClipboard(item.number)}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: copiedRera === item.number ? '1px solid #10B981' : '1px solid rgba(212, 175, 55, 0.22)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s',
                  boxShadow: copiedRera === item.number ? '0 0 15px rgba(16,185,129,0.3)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase' }}>
                    {item.type}
                  </span>
                  {copiedRera === item.number ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '0.72rem', fontWeight: 700 }}>
                      <Check size={13} /> Copied!
                    </span>
                  ) : (
                    <Copy size={13} color="#94A3B8" />
                  )}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 800, color: '#FFF', letterSpacing: '0.04em' }}>
                  {item.number}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                  {item.phase}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748B' }}>
            <Shield size={14} color="#D4AF37" />
            <span>MahaRERA Project Website: <a href="https://maharera.maharashtra.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#D4AF37', textDecoration: 'underline' }}>maharera.maharashtra.gov.in</a> (Earlier Phases: P52100001644, P52100019489)</span>
          </div>

        </div>
      </section>

      {/* ── APARTMENT CONFIGURATIONS & CARPET AREAS TABLE ── */}
      <section id="configurations-table" style={{ padding: '60px 5%', background: '#040814' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px auto' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Authentic Typology &amp; Usable Carpet Areas
            </span>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#F3E5AB', margin: '8px 0 14px 0' }}>
              Apartment Configurations &amp; Layout Details
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6 }}>
              From standard efficient 2 BHKs to extra-spacious 2.5 BHK work-from-home suites and palatial 3 BHK Luxury residences up to 1,282 sq. ft. pure carpet.
            </p>

            {/* Filter Tabs */}
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '8px', background: 'rgba(15, 23, 42, 0.8)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.25)', marginTop: '20px' }}>
              {['ALL', '2 BHK', '2.5 BHK', '3 BHK'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedBhk(tab)}
                  style={{
                    background: selectedBhk === tab ? 'linear-gradient(135deg, #FFDF79 0%, #D4AF37 100%)' : 'transparent',
                    color: selectedBhk === tab ? '#040814' : '#94A3B8',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab === 'ALL' ? 'All Configurations' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '24px' }}>
            {filteredConfigs.map((cfg, idx) => (
              <div
                key={idx}
                style={{
                  background: 'linear-gradient(180deg, #0e1726 0%, #070d18 100%)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D4AF37', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', padding: '4px 10px', borderRadius: '50px', letterSpacing: '0.04em' }}>
                      {cfg.highlightBadge}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 600 }}>
                      {cfg.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFF', margin: '0 0 6px 0' }}>
                    {cfg.type}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '12px 0 6px 0' }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#F3E5AB' }}>
                      {cfg.carpet}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>usable carpet</span>
                  </div>
                  <p style={{ margin: '0 0 16px 0', fontSize: '0.78rem', color: '#94A3B8', fontStyle: 'italic' }}>
                    {cfg.carpetNote}
                  </p>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', marginBottom: '16px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.82rem', color: '#E2E8F0', lineHeight: 1.5 }}>
                      <strong>Key Inclusions:</strong> {cfg.inclusions}
                    </p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.82rem', color: '#CBD5E1' }}>
                      <strong>Deck:</strong> {cfg.balcony}
                    </p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.82rem', color: '#CBD5E1' }}>
                      <strong>Ideal For:</strong> {cfg.idealFor}
                    </p>
                  </div>

                  <div style={{ background: 'rgba(4,8,20,0.6)', borderRadius: '10px', padding: '12px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Verified Pricing</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D4AF37', margin: '2px 0 0' }}>
                      {cfg.pricing}
                    </div>
                  </div>
                </div>

                <a
                  href={`https://wa.me/919673000053?text=${encodeURIComponent(`Hi 24K Realtors, I am inquiring about the ${cfg.type} (${cfg.carpet}) in Kasturi Eon Homes Hinjawadi Phase 3. Please share available floor layouts, pricing breakdown, and inventory.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'rgba(212,175,55,0.15)',
                    border: '1px solid rgba(212,175,55,0.4)',
                    color: '#F3E5AB',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'all 0.2s'
                  }}
                >
                  Inquire Floor Plans &amp; Pricing
                </a>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 100% AUTHENTIC ON-SITE VERIFIED PHOTO GALLERY ── */}
      <section style={{ padding: '60px 5%', background: '#070D1C', borderTop: '1px solid rgba(212,175,55,0.2)', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', gap: '16px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                <Eye size={15} /> 100% Genuine On-Site Telemetry
              </div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#F3E5AB', margin: 0 }}>
                Verified Apartment &amp; Deck Photo Gallery
              </h2>
            </div>
            <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.88rem', maxWidth: '520px' }}>
              Actual photographs taken on-site at Kasturi Eon Homes Hinjawadi Phase 3. Experience the wood-decked balcony, mirror vitrified floors, designer bathrooms, and parallel modular kitchen.
            </p>
          </div>

          {/* Master Interactive Viewer */}
          <div style={{
            background: 'linear-gradient(180deg, #0e1726 0%, #060b14 100%)',
            border: '2px solid rgba(212,175,55,0.3)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 0,
            marginBottom: '24px'
          }}>
            {/* Left: Big Main Photo */}
            <div style={{ position: 'relative', minHeight: '440px', background: '#020610', overflow: 'hidden' }}>
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: (activePhoto.src.includes('elevation') || activePhoto.src.includes('project_card')) ? 'center 22%' : 'center', display: 'block', cursor: 'zoom-in' }}
                onClick={() => openLightbox(activeGalleryIdx)}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(4,8,20,0.85) 0%, transparent 60%)', pointerEvents: 'none' }} />

              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                <span style={{ background: 'rgba(212,175,55,0.9)', color: '#040814', fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: '4px' }}>
                  {activePhoto.badge}
                </span>
              </div>

              <button
                onClick={() => openLightbox(activeGalleryIdx)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(4,8,20,0.8)',
                  border: '1px solid rgba(212,175,55,0.5)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#D4AF37',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Maximize2 size={14} /> Fullscreen Lightbox
              </button>

              <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase' }}>
                  {activePhoto.tag}
                </span>
                <h4 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
                  {activePhoto.title}
                </h4>
              </div>
            </div>

            {/* Right: Key Architectural Highlights of Selected Room */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.6rem' }}>{activePhoto.icon}</span>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Room Dossier</span>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#F3E5AB' }}>{activePhoto.roomName}</h3>
                  </div>
                </div>

                <p style={{ fontSize: '0.92rem', color: '#94A3B8', lineHeight: 1.7, marginBottom: '24px' }}>
                  {activePhoto.subtitle}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {activePhoto.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', background: 'rgba(4,8,20,0.5)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '1.2rem' }}>{feat.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>{feat.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>{feat.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setActiveGalleryIdx((activeGalleryIdx - 1 + p.gallery.length) % p.gallery.length)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFF',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ChevronLeft size={16} /> Previous View
                </button>
                <button
                  onClick={() => setActiveGalleryIdx((activeGalleryIdx + 1) % p.gallery.length)}
                  style={{
                    background: 'rgba(212,175,55,0.15)',
                    border: '1px solid rgba(212,175,55,0.4)',
                    color: '#D4AF37',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Next View <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnails Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            {p.gallery.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveGalleryIdx(idx)}
                style={{
                  position: 'relative',
                  height: '90px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: activeGalleryIdx === idx ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: activeGalleryIdx === idx ? '0 0 15px rgba(212,175,55,0.4)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <img
                  src={img.src}
                  alt={img.roomName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: activeGalleryIdx === idx ? 'transparent' : 'rgba(4,8,20,0.5)' }} />
                <span style={{ position: 'absolute', bottom: '6px', left: '6px', right: '6px', fontSize: '0.68rem', fontWeight: 700, color: '#FFF', textShadow: '0 1px 3px rgba(0,0,0,0.9)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {img.roomName}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── KEY AMENITIES SHOWCASE ── */}
      <section style={{ padding: '60px 5%', background: '#040814' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px auto' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Resort-Scale Infrastructure
            </span>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#F3E5AB', margin: '8px 0 14px 0' }}>
              Key Amenities &amp; Lifestyle Facilities
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6 }}>
              A 25,000 sq. ft. club house, championship sports arena, continuous 8-acre park, and 3-tier security grid designed for high-standard family living.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '24px' }}>
            {p.amenities.map((cat, idx) => (
              <div
                key={idx}
                style={{
                  background: 'linear-gradient(180deg, #0e1726 0%, #070d18 100%)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#FFF', fontWeight: 800 }}>
                    {cat.category}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {cat.items.map((item, itemIdx) => (
                    <div key={itemIdx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <CheckCircle2 size={16} color="#D4AF37" style={{ marginTop: '3px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F3E5AB' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px', lineHeight: 1.5 }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── LOCATION HIGHLIGHTS & COMMUTE MATRIX ── */}
      <section style={{ padding: '60px 5%', background: '#070D1C', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '48px', alignItems: 'center' }}>
          
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Strategic Positioning
            </span>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', color: '#F3E5AB', margin: '8px 0 16px 0' }}>
              Hinjawadi Phase 3, Pune
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>
              Located right opposite the expansive <strong>TCS Sahyadri Park</strong> campus, Kasturi Eon Homes offers the rare luxury of a walking commute for thousands of senior IT engineers and management leaders.
            </p>

            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10B981', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
                <Building2 size={18} /> Opposite TCS Sahyadri Park Campus
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.6 }}>
                Walk to work within 1 minute. Direct access to Hinjawadi Phase 3 arterial road, Pawar Public School, Megapolis Circle, and the upcoming Pune Metro Line 3 station.
              </p>
            </div>

            <a
              href="https://maps.app.goo.gl/3gZ7F6YMXe1Y5Pfp7"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(212,175,55,0.15)',
                border: '1px solid rgba(212,175,55,0.4)',
                borderRadius: '8px',
                padding: '10px 18px',
                color: '#D4AF37',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <MapPin size={16} /> Open in Google Maps <ExternalLink size={14} />
            </a>
          </div>

          {/* Commute Table */}
          <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', background: 'rgba(212,175,55,0.12)', borderBottom: '1px solid rgba(212,175,55,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F3E5AB' }}>Destination Corridor</span>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Distance &amp; Commute Time</span>
            </div>
            <div>
              {p.commuteMatrix.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 20px',
                    borderBottom: idx === p.commuteMatrix.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                    fontSize: '0.84rem'
                  }}
                >
                  <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{item.destination}</span>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{item.distance}</span>
                    <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem' }}>
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS (ACCORDION) ── */}
      <section style={{ padding: '60px 5%', background: '#040814' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Due Diligence &amp; Buyer FAQs
            </span>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', color: '#F3E5AB', margin: '8px 0 10px 0' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              Key answers regarding MahaRERA certifications, carpet sizes, developer pedigree, and negotiation support.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {p.faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15,23,42,0.7)',
                    border: isOpen ? '1px solid rgba(212,175,55,0.45)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'border 0.2s'
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: isOpen ? '#F3E5AB' : '#FFF',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} color="#D4AF37" /> : <ChevronDown size={18} color="#94A3B8" />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px 20px', fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── FOOTER VIP INQUIRY DESK ── */}
      <section style={{ padding: '60px 5%', background: 'linear-gradient(180deg, #070d18 0%, #03060c 100%)', borderTop: '1px solid rgba(212,175,55,0.3)', textAlign: 'center' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#D4AF37', marginBottom: '14px' }}>
            <Award size={20} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              24K Realtors • Authorized Luxury Partner
            </span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.4rem', color: '#F3E5AB', margin: '0 0 14px 0' }}>
            Experience Kasturi Eon Homes in Person
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '28px' }}>
            Connect with our Hinjawadi Phase 3 luxury desk to inspect verified 2 BHK, 2.5 BHK, and 3 BHK residences, review tower sanction blueprints, and secure pre-negotiated direct purchase terms.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
            <a
              href={`https://wa.me/919673000053?text=${encodeURIComponent(p.whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#25D366',
                color: '#040814',
                borderRadius: '10px',
                padding: '14px 30px',
                fontSize: '0.94rem',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <MessageSquare size={18} /> Inquire via WhatsApp
            </a>
            <a
              href="tel:+919673000053"
              style={{
                background: 'linear-gradient(135deg, #FFDF79 0%, #D4AF37 50%, #997819 100%)',
                color: '#040814',
                borderRadius: '10px',
                padding: '14px 28px',
                fontSize: '0.94rem',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Phone size={18} /> Call Locality Specialist
            </a>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE LIGHTBOX MODAL (ZOOM, PAN, ROTATE, FULLSCREEN) ── */}
      {lightboxIdx !== null && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(3, 6, 12, 0.96)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px'
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Lightbox Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFF', zIndex: 10 }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase' }}>
                {p.gallery[lightboxIdx]?.badge} • {lightboxIdx + 1} of {p.gallery.length}
              </span>
              <h4 style={{ margin: '2px 0 0', fontSize: '1.1rem', color: '#FFF' }}>
                {p.gallery[lightboxIdx]?.title}
              </h4>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.3, 3.5))}
                title="Zoom In (+)"
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '8px', color: '#FFF', cursor: 'pointer' }}
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.3, 0.6))}
                title="Zoom Out (-)"
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '8px', color: '#FFF', cursor: 'pointer' }}
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={() => { setZoomLevel(1); setPanPosition({ x: 0, y: 0 }); setRotation(0); }}
                title="Reset Zoom & Pan (0)"
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '8px', color: '#FFF', cursor: 'pointer' }}
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={handleToggleFullscreen}
                title="Toggle Fullscreen (F)"
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '8px', color: '#FFF', cursor: 'pointer' }}
              >
                <Maximize2 size={18} />
              </button>
              <button
                onClick={closeLightbox}
                title="Close (Esc)"
                style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '6px', padding: '8px 12px', color: '#D4AF37', cursor: 'pointer', fontWeight: 700 }}
              >
                <X size={18} /> Close
              </button>
            </div>
          </div>

          {/* Lightbox Center Image Stage */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              userSelect: 'none',
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            onMouseDown={handleMouseDown}
          >
            <img
              src={p.gallery[lightboxIdx]?.src}
              alt={p.gallery[lightboxIdx]?.title}
              draggable={false}
              style={{
                maxWidth: '90%',
                maxHeight: '82vh',
                objectFit: 'contain',
                transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                borderRadius: '8px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.9)'
              }}
            />

            {/* Prev / Next Arrows */}
            <button
              onClick={prevPhoto}
              style={{
                position: 'absolute',
                left: '20px',
                background: 'rgba(4,8,20,0.7)',
                border: '1px solid rgba(212,175,55,0.4)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D4AF37',
                cursor: 'pointer',
                zIndex: 20
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextPhoto}
              style={{
                position: 'absolute',
                right: '20px',
                background: 'rgba(4,8,20,0.7)',
                border: '1px solid rgba(212,175,55,0.4)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D4AF37',
                cursor: 'pointer',
                zIndex: 20
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Lightbox Footer Captions & Room Features */}
          <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem', padding: '8px 0', zIndex: 10 }}>
            <span>{p.gallery[lightboxIdx]?.subtitle}</span>
          </div>
        </div>
      )}

    </div>
  );
}
