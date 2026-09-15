-- Migration V35: Seed Authentic Hinjewadi Phase 3 Verified Master Portfolio
-- Projects: Megapolis Integrated Township, TCG The Cliff Garden, Kasturi Eon Homes

-- 1. Megapolis Mystic 3 BHK Royale Residence
MERGE INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) KEY (id) VALUES (
  '00000000-0000-0000-0000-000000000301',
  'Megapolis Mystic 3 BHK Royale Residence',
  'Official Megapolis 150-Acre Integrated Township residence in Hinjewadi Phase 3. Features 1,040 sq.ft pure carpet area, 2B+G+21 floors, panoramic Sahyadri hill views, double balcony, piped gas, and 25,000 sq.ft mega clubhouse access. Walking distance from TCS Sahyadri Park.',
  'RESIDENTIAL', 'BUY', 11500000.00, 1040.0,
  'HINJEWADI', 'Megapolis Mystic, Phase 3, Rajiv Gandhi Infotech Park, Hinjewadi, Pune — 411057',
  18.5919, 73.7025, 3, 3, 'AVAILABLE', true, true, false, 'P52100001256',
  '/properties/megapolis-sunway/01_aerial_hero.png',
  'https://www.youtube.com/embed/LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'SEMI_FURNISHED', true
);

-- 2. Megapolis Sunway 2 BHK Smart Home
MERGE INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) KEY (id) VALUES (
  '00000000-0000-0000-0000-000000000302',
  'Megapolis Sunway 2 BHK Smart Home',
  'High-rise 2 BHK smart automation apartments walking distance to TCS Sahyadri Park & Hinjewadi Phase 3 Metro. 640 sq.ft carpet area, high-speed elevators, 3-tier security, and hill breeze cross-ventilation.',
  'RESIDENTIAL', 'BUY', 7200000.00, 640.0,
  'HINJEWADI', 'Megapolis Sunway, Phase 3, Rajiv Gandhi Infotech Park, Hinjewadi, Pune — 411057',
  18.5919, 73.7025, 2, 2, 'AVAILABLE', true, true, false, 'P52100001428',
  '/properties/megapolis-sunway/02_architecture.png',
  'https://www.youtube.com/embed/LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'SEMI_FURNISHED', true
);

-- 3. Megapolis Sparklet 1 BHK Executive Suite
MERGE INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) KEY (id) VALUES (
  '00000000-0000-0000-0000-000000000303',
  'Megapolis Sparklet 1 BHK Executive Suite',
  'Compact, highly functional 1 BHK apartment with 425 sq.ft carpet area. Highest rental yield asset in Hinjewadi Phase 3, consistently rented by senior IT engineers working at TCS, Infosys, and Tech Mahindra.',
  'RESIDENTIAL', 'BUY', 4400000.00, 425.0,
  'HINJEWADI', 'Megapolis Sparklet, Phase 3, Rajiv Gandhi Infotech Park, Hinjewadi, Pune — 411057',
  18.5919, 73.7025, 1, 1, 'AVAILABLE', true, false, false, 'P52100001428',
  '/properties/megapolis-sunway/03_grand_entrance.png',
  NULL,
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'FULLY_FURNISHED', true
);

-- 4. TCG The Cliff Garden 3 BHK Panoramic Hillview
MERGE INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) KEY (id) VALUES (
  '00000000-0000-0000-0000-000000000304',
  'TCG The Cliff Garden 3 BHK Panoramic Hillview',
  'Flagship 3 BHK high-rise residence in TCG The Cliff Garden, Hinjewadi Phase 3. Spread over 28 scenic hillside acres adjoining the Sahyadri mountains. 890 sq.ft carpet, 2B+G+24 floors, and exclusive membership to the 20,000 sq.ft Club Cliff.',
  'RESIDENTIAL', 'BUY', 10500000.00, 890.0,
  'HINJEWADI', 'TCG The Cliff Garden, Phase 3, Near Megapolis Circle, Hinjewadi, Pune — 411057',
  18.5905, 73.7010, 3, 3, 'AVAILABLE', true, true, false, 'P52100017124',
  '/dev_shapoorji_township.png',
  'https://www.youtube.com/embed/LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'SEMI_FURNISHED', true
);

-- 5. TCG The Cliff Garden 2 BHK Grande Residence
MERGE INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) KEY (id) VALUES (
  '00000000-0000-0000-0000-000000000305',
  'TCG The Cliff Garden 2 BHK Grande Residence',
  'Well-ventilated 2 BHK Grande with 690 sq.ft carpet area, 2 bathrooms, wide sunset-view balcony, and direct access to podium reflexology gardens in Hinjewadi Phase 3.',
  'RESIDENTIAL', 'BUY', 7800000.00, 690.0,
  'HINJEWADI', 'TCG The Cliff Garden, Phase 3, Near Megapolis Circle, Hinjewadi, Pune — 411057',
  18.5905, 73.7010, 2, 2, 'AVAILABLE', true, true, false, 'P52100021677',
  '/gallery_tower_2.png',
  NULL,
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'SEMI_FURNISHED', true
);

-- 6. Kasturi Eon Homes 3 BHK Royal Podium Residence
MERGE INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) KEY (id) VALUES (
  '00000000-0000-0000-0000-000000000306',
  'Kasturi Eon Homes 3 BHK Royal Podium Residence',
  'The gold standard of luxury in Hinjewadi Phase 3. 12 iconic symmetrical towers arranged around an 8-acre continuous vehicle-free central park. 1,220 sq.ft carpet area, Italian marble flooring, Grohe & Toto sanitaryware, Schindler high-speed elevators, and 25,000 sq.ft lifestyle club.',
  'RESIDENTIAL', 'BUY', 14800000.00, 1220.0,
  'HINJEWADI', 'Kasturi Eon Homes, Phase 3, Opposite TCS Sahyadri Park, Hinjewadi, Pune — 411057',
  18.5925, 73.7040, 3, 3, 'AVAILABLE', true, true, false, 'P52100001644',
  '/dev_kasturi_forbes.png',
  'https://www.youtube.com/embed/LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'SEMI_FURNISHED', true
);

-- 7. Kasturi Eon Homes 2 BHK Grand Apartment
MERGE INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) KEY (id) VALUES (
  '00000000-0000-0000-0000-000000000307',
  'Kasturi Eon Homes 2 BHK Grand Apartment',
  'Spacious 2 BHK with 780 sq.ft pure carpet area, private deck overlooking manicured zen gardens, covered car park, and opposite TCS Sahyadri Park campus.',
  'RESIDENTIAL', 'BUY', 9200000.00, 780.0,
  'HINJEWADI', 'Kasturi Eon Homes, Phase 3, Opposite TCS Sahyadri Park, Hinjewadi, Pune — 411057',
  18.5925, 73.7040, 2, 2, 'AVAILABLE', true, false, false, 'P52100019489',
  '/lodha_4_grand_lobby.png',
  NULL,
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'SEMI_FURNISHED', true
);
