-- ════════════════════════════════════════════════════════════════════════════
-- V36__kasturi_eon_homes_verified_showcase.sql
-- 24K Realtors Database Migration
-- Landmark Listing: Kasturi Eon Homes Hinjawadi Phase 3, Pune
-- Symmetrical 12 Towers around 8-Acre Continuous Vehicle-Free Central Park
-- Primary & Recent MahaRERA Numbers:
--   P52100046679, P52100080318, P52100055358, P52100024680, P52100030732, P52100048176
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Kasturi Eon Homes 2 BHK Premium Residence (839 – 845 sq. ft.)
MERGE INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) KEY (id) VALUES (
  '00000000-0000-0000-0000-000000000307',
  'Kasturi Eon Homes 2 BHK Premium Residence',
  'Spacious 2 BHK standard layout with 839–845 sq.ft pure usable carpet area (variants up to 940 sq.ft). Features private wood-finish balcony deck overlooking the 8-acre continuous vehicle-free central park, mirror-finish vitrified flooring, Grohe/Toto sanitary fittings, and parallel quartz kitchen countertop directly opposite TCS Sahyadri Park.',
  'RESIDENTIAL', 'BUY', 9500000.00, 845.0,
  'HINJEWADI', 'Kasturi Eon Homes, Phase 3, Opposite TCS Sahyadri Park, Hinjewadi, Pune — 411057',
  18.5925, 73.7040, 2, 2, 'AVAILABLE', true, true, false, 'P52100046679',
  '/kasturi_eon_homes_balcony.jpg',
  'https://www.youtube.com/embed/LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'SEMI_FURNISHED', true
);

-- 2. Kasturi Eon Homes 2.5 BHK Smart Residence with Study (950 – 970 sq. ft.)
MERGE INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) KEY (id) VALUES (
  '00000000-0000-0000-0000-000000000308',
  'Kasturi Eon Homes 2.5 BHK Smart Residence with Study',
  'High-efficiency 2.5 BHK layout offering 950–970 sq.ft pure carpet area with a dedicated private study / home office room. Designed for tech executives with corner glazed master bedroom, floor-to-ceiling sliding glass doors, 25,000 sq.ft club access, Olympic lap pool, squash courts, and 100% DG power backup.',
  'RESIDENTIAL', 'BUY', 11200000.00, 960.0,
  'HINJEWADI', 'Kasturi Eon Homes, Phase 3, Opposite TCS Sahyadri Park, Hinjewadi, Pune — 411057',
  18.5925, 73.7040, 3, 2, 'AVAILABLE', true, true, false, 'P52100080318',
  '/kasturi_eon_homes_bedroom.jpg',
  'https://www.youtube.com/embed/LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'SEMI_FURNISHED', true
);

-- 3. Kasturi Eon Homes 3 BHK Mini / Comfort Residence (1,145 – 1,150 sq. ft.)
MERGE INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) KEY (id) VALUES (
  '00000000-0000-0000-0000-000000000309',
  'Kasturi Eon Homes 3 BHK Mini / Comfort Residence',
  'Standard 3 BHK residence with 1,145–1,150 sq.ft verified carpet area. 3 well-proportioned private bedrooms, 3 designer bathrooms with glass shower partitions and wall-hung commodes, open entertainment living hall, fitted modular kitchen with chimney, and panoramic park-facing viewing deck.',
  'RESIDENTIAL', 'BUY', 13200000.00, 1150.0,
  'HINJEWADI', 'Kasturi Eon Homes, Phase 3, Opposite TCS Sahyadri Park, Hinjewadi, Pune — 411057',
  18.5925, 73.7040, 3, 3, 'AVAILABLE', true, true, false, 'P52100055358',
  '/kasturi_eon_homes_kitchen.jpg',
  'https://www.youtube.com/embed/LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'SEMI_FURNISHED', true
);

-- 4. Kasturi Eon Homes 3 BHK Ultra-Luxury Residence (1,185 – 1,282 sq. ft.)
MERGE INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) KEY (id) VALUES (
  '00000000-0000-0000-0000-000000000306',
  'Kasturi Eon Homes 3 BHK Ultra-Luxury Flagship Residence',
  'The maximum spacious residential variant available in Kasturi Eon Homes with 1,185–1,282 sq.ft pure carpet area. Palatial living & dining lounge, Italian marble-finished walls, Grohe & Toto sanitaryware, Schindler high-speed lifts, 25,000 sq.ft lifestyle club with sports bar, and unhindered podium park & hill vistas.',
  'RESIDENTIAL', 'BUY', 15200000.00, 1282.0,
  'HINJEWADI', 'Kasturi Eon Homes, Phase 3, Opposite TCS Sahyadri Park, Hinjewadi, Pune — 411057',
  18.5925, 73.7040, 3, 3, 'AVAILABLE', true, true, false, 'P52100024680',
  '/kasturi_eon_homes_living.jpg',
  'https://www.youtube.com/embed/LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'SEMI_FURNISHED', true
);
