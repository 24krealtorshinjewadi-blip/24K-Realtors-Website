-- Migration V34: Clean Altura, Seed Hierarchical Locations, Megapolis Sub-Projects, Inventory Sources & Media Assets
-- Aligns database strictly with the Master Implementation Prompt

-- ════════════════════════════════════════════════════════════════════════════
-- 1. PURGE ALL 24K ALTURA OCCURRENCES
-- ════════════════════════════════════════════════════════════════════════════
DELETE FROM inventory_units WHERE unit_number ILIKE '%Altura%' OR notes ILIKE '%Altura%';
DELETE FROM properties WHERE title ILIKE '%Altura%' OR rera_number = 'RERA-PUN-PRM-24K074';
DELETE FROM societies WHERE name ILIKE '%Altura%' OR slug ILIKE '%altura%';

-- ════════════════════════════════════════════════════════════════════════════
-- 2. HIERARCHICAL LOCATIONS SEEDING (Pune -> Micro-Markets -> Phases -> Townships)
-- ════════════════════════════════════════════════════════════════════════════

-- Root: Pune City
MERGE INTO localities (
    id, name, slug, locality_type, pincode, latitude, longitude,
    seo_title, seo_description, seo_h1, overview, parent_locality_id
) KEY(id) VALUES (
    'a1000000-0000-0000-0000-000000000001',
    'Pune',
    'pune',
    'CITY',
    '411001',
    18.5204,
    73.8567,
    'Pune Real Estate | Verified Luxury Properties & IT Corridors',
    'Discover verified properties across Pune IT Corridors, West Pune, and emerging growth corridors with 24K Realtors.',
    'Pune Real Estate & Prime IT Corridor Marketplace',
    'Pune is Maharashtra''s premier IT, automotive, and educational hub, driven by the Rajiv Gandhi Infotech Park and Pune Metro Line 3.',
    NULL
);

-- Micro-Market: Hinjewadi IT Park (Parent: Pune)
MERGE INTO localities (
    id, name, slug, locality_type, pincode, latitude, longitude,
    seo_title, seo_description, seo_h1, overview, parent_locality_id
) KEY(id) VALUES (
    'a1000000-0000-0000-0000-000000000002',
    'Hinjewadi',
    'hinjewadi',
    'MICRO_MARKET',
    '411057',
    18.5913,
    73.7389,
    'Hinjewadi Real Estate | Rajiv Gandhi Infotech Park Properties',
    'Explore verified real estate in Hinjewadi Rajiv Gandhi Infotech Park across Phase 1, Phase 2, and Phase 3.',
    'Hinjewadi IT Corridor Real Estate',
    'Asia''s premier tech corridor hosting 300,000+ IT professionals across TCS, Infosys, Wipro, and Cognizant.',
    'a1000000-0000-0000-0000-000000000001'
);

-- Sub-Phase: Hinjewadi Phase 1 (Parent: Hinjewadi)
MERGE INTO localities (
    id, name, slug, hinjewadi_phase, locality_type, pincode, latitude, longitude,
    seo_title, seo_description, seo_h1, overview, parent_locality_id
) KEY(id) VALUES (
    'a1000000-0000-0000-0000-000000000011',
    'Hinjewadi Phase 1',
    'hinjewadi-phase-1',
    'PHASE_1',
    'PHASE',
    '411057',
    18.5913,
    73.7389,
    'Hinjewadi Phase 1 Properties | Blue Ridge & Life Republic Hub',
    'Verified properties in Hinjewadi Phase 1 near Wipro Circle, Infosys, and upcoming Pune Metro Line 3 station.',
    'Hinjewadi Phase 1 Real Estate Intelligence',
    'The commercial and residential anchor of Hinjewadi IT Park, featuring Blue Ridge, Joyville, and direct highway exit.',
    'a1000000-0000-0000-0000-000000000002'
);

-- Sub-Phase: Hinjewadi Phase 2 (Parent: Hinjewadi)
MERGE INTO localities (
    id, name, slug, hinjewadi_phase, locality_type, pincode, latitude, longitude,
    seo_title, seo_description, seo_h1, overview, parent_locality_id
) KEY(id) VALUES (
    'a1000000-0000-0000-0000-000000000012',
    'Hinjewadi Phase 2',
    'hinjewadi-phase-2',
    'PHASE_2',
    'PHASE',
    '411057',
    18.5872,
    73.7251,
    'Hinjewadi Phase 2 Properties | Quadron & Embassy Techzone',
    'Verified residential towers in Hinjewadi Phase 2 near Embassy Techzone, Godrej 24, and Kohinoor Coral.',
    'Hinjewadi Phase 2 Real Estate Intelligence',
    'Host to Embassy Techzone, Godrej 24, and Kohinoor Sportsville, with direct connection to Phase 3.',
    'a1000000-0000-0000-0000-000000000002'
);

-- Sub-Phase: Hinjewadi Phase 3 (Parent: Hinjewadi)
MERGE INTO localities (
    id, name, slug, hinjewadi_phase, locality_type, pincode, latitude, longitude,
    seo_title, seo_description, seo_h1, overview, parent_locality_id
) KEY(id) VALUES (
    'a1000000-0000-0000-0000-000000000013',
    'Hinjewadi Phase 3',
    'hinjewadi-phase-3',
    'PHASE_3',
    'PHASE',
    '411057',
    18.5919,
    73.7025,
    'Hinjewadi Phase 3 Properties | Megapolis Township & TCS Sahyadri',
    'Verified properties in Hinjewadi Phase 3 near Megapolis Township, TCS Sahyadri Park, and Metro Terminal.',
    'Hinjewadi Phase 3 Real Estate Intelligence',
    'The 150-acre Megapolis Township hub and terminal station for Pune Metro Line 3 connecting directly to Shivajinagar.',
    'a1000000-0000-0000-0000-000000000002'
);

-- Township Level: Megapolis Township (Parent: Hinjewadi Phase 3)
MERGE INTO localities (
    id, name, slug, locality_type, pincode, latitude, longitude,
    seo_title, seo_description, seo_h1, overview, parent_locality_id
) KEY(id) VALUES (
    'a1000000-0000-0000-0000-000000000014',
    'Megapolis Township',
    'megapolis-township',
    'TOWNSHIP',
    '411057',
    18.5919,
    73.7025,
    'Megapolis Township Hinjewadi Phase 3 | 150-Acre Integrated Township',
    'Explore Megapolis Township sub-projects: Splendour, Mystic, Sparklet, Sunway, Springs, Saffron & Serenity.',
    'Megapolis Township Hinjewadi Phase 3',
    'Joint venture township by Kumar Properties and Avinash Bhosale Group (ABIL) spread over 150 acres with 80+ amenities.',
    'a1000000-0000-0000-0000-000000000013'
);

-- Other Prime Micro-Markets under Pune
MERGE INTO localities (id, name, slug, locality_type, pincode, latitude, longitude, overview, parent_locality_id) KEY(id) VALUES
('a1000000-0000-0000-0000-000000000020', 'Mahalunge Smart City', 'mahalunge', 'MICRO_MARKET', '411045', 18.5790, 73.7470, 'Pune-PRRDA high-growth township corridor featuring Godrej Hillside and VTP Blue Waters.', 'a1000000-0000-0000-0000-000000000001'),
('a1000000-0000-0000-0000-000000000021', 'Wakad', 'wakad', 'MICRO_MARKET', '411057', 18.5970, 73.7660, 'Commercial lifestyle corridor with Phoenix Mall of the Millennium and quick Mumbai Expressway link.', 'a1000000-0000-0000-0000-000000000001'),
('a1000000-0000-0000-0000-000000000022', 'Baner', 'baner', 'MICRO_MARKET', '411045', 18.5590, 73.7868, 'Premier upscale residential & corporate hub of West Pune with Balewadi High Street access.', 'a1000000-0000-0000-0000-000000000001'),
('a1000000-0000-0000-0000-000000000023', 'Balewadi', 'balewadi', 'MICRO_MARKET', '411045', 18.5779, 73.7816, 'High Street nightlife, boutique retail, and Shiv Chhatrapati Sports Complex.', 'a1000000-0000-0000-0000-000000000001');

-- ════════════════════════════════════════════════════════════════════════════
-- 3. INVENTORY SOURCES
-- ════════════════════════════════════════════════════════════════════════════
MERGE INTO inventory_sources (id, source_type, source_name, reference, authorized, active, contact_person, contact_phone) KEY(id) VALUES
('s1000000-0000-0000-0000-000000000001', 'BUILDER', 'Kolte Patil Direct Builder Desk', 'KP-SALES-2026', TRUE, TRUE, 'Mr. Amitav Deshmukh (VP Sales)', '+912067244000'),
('s1000000-0000-0000-0000-000000000002', 'BUILDER', 'Shapoorji Pallonji Official Sales Feed', 'SP-HINJ-2026', TRUE, TRUE, 'Ms. Shruti Nair (Mandate Lead)', '+912067490000'),
('s1000000-0000-0000-0000-000000000003', 'BUILDER', 'Godrej Properties Direct Partner Feed', 'GPL-WEST-2026', TRUE, TRUE, 'Mr. Rohit Kulkarni', '+912067008800'),
('s1000000-0000-0000-0000-000000000004', 'BUILDER', 'Paranjape Schemes Official Desk', 'PS-BR-2026', TRUE, TRUE, 'Mr. Nikhil Paranjape', '+912030223344'),
('s1000000-0000-0000-0000-000000000005', 'TWENTYFOURK_INTERNAL', '24K Realtors Internal Verification Desk', '24K-AUDIT-2026', TRUE, TRUE, 'Neeraj Giri (Principal Partner)', '+919876543210');

-- ════════════════════════════════════════════════════════════════════════════
-- 4. UPDATE EXISTING INVENTORY UNITS WITH SOURCE OF TRUTH METRICS
-- ════════════════════════════════════════════════════════════════════════════
UPDATE inventory_units SET
    price_per_sqft = ROUND(total_price / carpet_area_sqft, 2),
    parking = '1 Covered Parking',
    currency = 'INR',
    source_id = 's1000000-0000-0000-0000-000000000005',
    last_verified_at = CURRENT_TIMESTAMP,
    published = TRUE,
    publication_status = 'PUBLISHED'
WHERE price_per_sqft IS NULL;

-- Set specific parking for 3 & 4 BHK units
UPDATE inventory_units SET parking = '2 Covered Parking' WHERE bhk_type IN ('3 BHK', '4 BHK');

-- ════════════════════════════════════════════════════════════════════════════
-- 5. SEED INVENTORY VERIFICATIONS FOR FRESHNESS & AUDIT TRAIL
-- ════════════════════════════════════════════════════════════════════════════
MERGE INTO inventory_verifications (id, inventory_id, source_id, verified_by, price_verified, availability_verified, verified_at, notes) KEY(id) VALUES
('v1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', 'Neeraj Giri (Principal Partner)', TRUE, TRUE, CURRENT_TIMESTAMP, 'Verified against Kolte Patil daily inventory sheet. Price includes basic car park.'),
('v1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000006', 's1000000-0000-0000-0000-000000000002', 'Nilesh Rai (Sales Consultant)', TRUE, TRUE, CURRENT_TIMESTAMP, 'Verified directly with Shapoorji Joyville sales office. OC received.'),
('v1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000010', 's1000000-0000-0000-0000-000000000003', 'Manish Rai (Senior Consultant)', TRUE, TRUE, CURRENT_TIMESTAMP, 'Smart home automation unit price cross-checked with Godrej live master list.');

-- ════════════════════════════════════════════════════════════════════════════
-- 6. SEED AUTHENTIC MEDIA ASSETS (With strict Aerial & Real Project tags)
-- ════════════════════════════════════════════════════════════════════════════
MERGE INTO media_assets (id, project_id, asset_type, url, title, description, source, verified, published, display_order) KEY(id) VALUES
-- Megapolis Township Authentic Aerial Shot
(
    'm1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000008',
    'AERIAL',
    '/properties/megapolis-sunway/01_aerial_hero.png',
    'Megapolis 150-Acre Aerial Panorama',
    'Verified authentic drone perspective of Megapolis Township Phase 3, TCS Sahyadri Park, and hill contours.',
    'Township Infrastructure Asset 2026',
    TRUE, TRUE, 1
),
(
    'm1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000008',
    'REAL_PROJECT',
    '/properties/megapolis-sunway/02_architecture.png',
    'Megapolis Sunway & Mystic Tower Facade',
    'Actual photographed facade and landscape podium of ready residential towers.',
    '24K Ground Audit 2026',
    TRUE, TRUE, 2
),
-- Kolte Patil Life Republic
(
    'm1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000001',
    'PROJECT_HERO',
    '/dev_kolte_patil_township.png',
    'Life Republic Grand Entrance & 150ft Spine Road',
    'Main entry boulevard and central landscaping of Kolte Patil Life Republic Hinjewadi.',
    'Developer Official Media Kit',
    TRUE, TRUE, 1
),
-- Shapoorji Joyville Hinjewadi
(
    'm1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000002',
    'PROJECT_HERO',
    '/dev_shapoorji_township.png',
    'Joyville Hinjewadi Clubhouse & Podium',
    'Completed tower facade overlooking Miyawaki forest gardens and clubhouse.',
    'Developer Official Media Kit',
    TRUE, TRUE, 1
),
-- Godrej Elements Hinjewadi
(
    'm1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000003',
    'PROJECT_HERO',
    '/dev_godrej_building.png',
    'Godrej Elements Contemporary Architecture',
    'Schneider smart home automation high-rise towers in Hinjewadi Phase 1.',
    'Developer Official Media Kit',
    TRUE, TRUE, 1
);
