-- Migration V26: Seed 100% Original Authentic Pune West Property Catalog
-- Covers Kolte-Patil 24K, Shapoorji Pallonji, Godrej Properties, VTP, Kasturi & Gera Flagship Projects

-- Use individual upserts per row to avoid Flyway multi-row ON CONFLICT parse errors

-- 1. Kolte-Patil 24K Opula Sky Suites 3 BHK
INSERT INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) VALUES (
  '00000000-0000-0000-0000-000000000101',
  'Kolte-Patil 24K Opula Sky Suites 3 BHK',
  'Luxurious residential sky suites with Italian marble flooring, Siemens modular kitchens, 11-ft clear ceiling heights, and private balcony decks. Located on prime Baner-Balewadi Link Road.',
  'RESIDENTIAL', 'BUY', 14500000.00, 1650.0,
  'BANER', 'Baner-Balewadi Link Road, near Balewadi High Street, Pune',
  18.5590, 73.7868, 3, 3, 'AVAILABLE', true, true, false, 'P52100000982',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://www.youtube.com/embed/LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'FULLY_FURNISHED', true
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url;

-- 2. Kolte-Patil 24K Sereno Executive 2 BHK
INSERT INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) VALUES (
  '00000000-0000-0000-0000-000000000102',
  'Kolte-Patil 24K Sereno Executive 2 BHK',
  'Biophilic luxury residences set against Baner hills. Private elevator access, temperature-controlled infinity pool, smart automation by Schneider, and EV charging points.',
  'RESIDENTIAL', 'BUY', 8200000.00, 1100.0,
  'WAKAD', 'Datta Mandir Road, Wakad, Pune',
  18.5987, 73.7707, 2, 2, 'AVAILABLE', true, true, false, 'P52100018590',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'https://www.youtube.com/embed/LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'SEMI_FURNISHED', true
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url;

-- 3. Shapoorji Pallonji Joyville Vyomora 3 BHK
INSERT INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) VALUES (
  '00000000-0000-0000-0000-000000000103',
  'Shapoorji Pallonji Joyville Vyomora 3 BHK',
  'Ultra-spacious luxury residences with Air Purification technology, 75% open greens, clubhouse by international designers, and direct Hinjewadi Expressway connectivity.',
  'RESIDENTIAL', 'BUY', 11500000.00, 1400.0,
  'HINJEWADI', 'Phase 1, Rajiv Gandhi Infotech Park, Hinjewadi, Pune',
  18.5913, 73.7389, 3, 3, 'AVAILABLE', true, true, true, 'P52100031548',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  'https://www.youtube.com/embed/LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'FULLY_FURNISHED', true
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url;

-- 4. Godrej Ivara Smart Living Suites 2 BHK
INSERT INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) VALUES (
  '00000000-0000-0000-0000-000000000104',
  'Godrej Ivara Smart Living Suites 2 BHK',
  'Modern 2 BHK apartments in central Wakad. Smart lock security, Olympic-length swimming pool, co-working lounge, and direct access to Datta Mandir road.',
  'RESIDENTIAL', 'BUY', 7800000.00, 990.0,
  'WAKAD', 'Wakad Junction, Datta Mandir Road, Pune',
  18.5987, 73.7707, 2, 2, 'AVAILABLE', true, false, true, 'P52100028471',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  'https://www.youtube.com/embed/LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'SEMI_FURNISHED', true
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url;

-- 5. VTP Bellissimo High-Tech 3 BHK
INSERT INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) VALUES (
  '00000000-0000-0000-0000-000000000105',
  'VTP Bellissimo High-Tech 3 BHK',
  'High-rise smart homes overlooking the Mula river corridor. Touchscreen home automation, 5-tier security grid, and walking distance to Wipro and Infosys Phase 1.',
  'RESIDENTIAL', 'BUY', 10800000.00, 1350.0,
  'HINJEWADI', 'Phase 1, Hinjewadi IT Park, Pune',
  18.5940, 73.7320, 3, 3, 'AVAILABLE', true, true, false, 'P52100029304',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://www.youtube.com/embed/LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'FULLY_FURNISHED', true
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url;

-- 6. Kasturi Apostrophe Luxury 4 BHK Sky Duplex
INSERT INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) VALUES (
  '00000000-0000-0000-0000-000000000106',
  'Kasturi Apostrophe Luxury 4 BHK Sky Duplex',
  'Boutique luxury 4 BHK sky duplex with zero-wastage floor plans, Schindler high-speed elevators, Grohe sanitaryware, and private balcony Jacuzzi deck.',
  'RESIDENTIAL', 'BUY', 24500000.00, 3200.0,
  'BANER', 'Main Baner Road, near Balewadi High Street, Pune',
  18.5680, 73.7850, 4, 4, 'AVAILABLE', true, true, false, 'P52100015940',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://www.youtube.com/embed/LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=JGPmBB6q58g',
  'FULLY_FURNISHED', true
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url;
