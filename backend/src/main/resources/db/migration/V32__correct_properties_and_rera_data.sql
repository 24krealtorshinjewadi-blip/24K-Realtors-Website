-- V32__correct_properties_and_rera_data.sql
-- 1. Remove 24K Altura from active properties
DELETE FROM properties WHERE title ILIKE '%Altura%' OR rera_number = 'RERA-PUN-PRM-24K074';

-- 2. Update real RERA numbers, accurate locations (Phase 1, 2, 3), realistic prices and carpet areas
UPDATE properties SET
  title = '24K Opula Signature 3 BHK',
  price = 16500000.00,
  area_square_feet = 1450.0,
  rera_number = 'P52100000398',
  location = 'BANER',
  image_url = '/dev_kolte_patil_township.png'
WHERE title ILIKE '%24K Opula%';

UPDATE properties SET
  title = 'Kolte Patil Life Republic 3 BHK',
  price = 10500000.00,
  area_square_feet = 1150.0,
  rera_number = 'P52100027629',
  location = 'HINJEWADI_PHASE_1',
  image_url = '/dev_kolte_patil_township.png'
WHERE title ILIKE '%Life Republic%';

UPDATE properties SET
  title = 'Shapoorji Joyville Hinjewadi 2 BHK',
  price = 8400000.00,
  area_square_feet = 780.0,
  rera_number = 'P52100024965',
  location = 'HINJEWADI_PHASE_1',
  image_url = '/dev_shapoorji_township.png'
WHERE title ILIKE '%Joyville Premium%' OR title ILIKE '%Joyville Hinjewadi%';

UPDATE properties SET
  title = 'Godrej Elements Luxury 2 BHK',
  price = 8900000.00,
  area_square_feet = 760.0,
  rera_number = 'P52100016626',
  location = 'HINJEWADI_PHASE_1',
  image_url = '/dev_godrej_building.png'
WHERE title ILIKE '%Godrej Elements%';

UPDATE properties SET
  title = 'Paranjape Blue Ridge Riverside 2 BHK',
  price = 7800000.00,
  area_square_feet = 790.0,
  rera_number = 'P52100000058',
  location = 'HINJEWADI_PHASE_1',
  image_url = '/dev_paranjape_township.png'
WHERE title ILIKE '%Blue Ridge%';

UPDATE properties SET
  title = 'VJ Yashwin Supernova Hinjewadi 3 BHK',
  price = 9800000.00,
  area_square_feet = 1020.0,
  rera_number = 'P52100030940',
  location = 'HINJEWADI_PHASE_1',
  image_url = '/gallery_vj_supernova_tower.png'
WHERE title ILIKE '%Supernova%';

UPDATE properties SET
  title = 'Hinjewadi IT Plaza Grade-A Office Space',
  price = 250000.00,
  area_square_feet = 4500.0,
  rera_number = 'P52100018590',
  location = 'HINJEWADI_PHASE_1',
  image_url = '/lodha_4_grand_lobby.png'
WHERE title ILIKE '%IT Plaza%';

UPDATE properties SET
  title = 'Godrej 24 Hinjewadi Phase 2',
  price = 7900000.00,
  area_square_feet = 740.0,
  rera_number = 'P52100018596',
  location = 'HINJEWADI_PHASE_2',
  image_url = '/dev_godrej_building.png'
WHERE title ILIKE '%Godrej 24%';

UPDATE properties SET
  title = 'Kohinoor Coral Hinjewadi Phase 2',
  price = 6800000.00,
  area_square_feet = 690.0,
  rera_number = 'P52100028823',
  location = 'HINJEWADI_PHASE_2',
  image_url = '/dev_kohinoor_tower.png'
WHERE title ILIKE '%Kohinoor Coral%';

UPDATE properties SET
  title = 'Kohinoor Sportsville Active 3 BHK',
  price = 9200000.00,
  area_square_feet = 1040.0,
  rera_number = 'P52100029580',
  location = 'HINJEWADI_PHASE_2',
  image_url = '/dev_kohinoor_tower.png'
WHERE title ILIKE '%Sportsville%';

UPDATE properties SET
  title = 'TCG The Crown Greens 3 BHK',
  price = 38000.00,
  area_square_feet = 1250.0,
  rera_number = 'P52100003412',
  location = 'HINJEWADI_PHASE_2',
  image_url = '/gallery_tower_2.png'
WHERE title ILIKE '%Crown Greens%';

UPDATE properties SET
  title = 'Megapolis Splendour Hinjewadi Phase 3',
  price = 7400000.00,
  area_square_feet = 750.0,
  rera_number = 'P52100000032',
  location = 'HINJEWADI_PHASE_3',
  image_url = '/properties/megapolis-sunway/01_aerial_hero.png'
WHERE title ILIKE '%Megapolis Splendour%' OR title ILIKE '%Megapolis 150-Acre%';

UPDATE properties SET
  title = 'Megapolis Mystic & Sangria 3 BHK',
  price = 8800000.00,
  area_square_feet = 1080.0,
  rera_number = 'P52100000032',
  location = 'HINJEWADI_PHASE_3',
  image_url = '/properties/megapolis-sunway/02_architecture.png'
WHERE title ILIKE '%Megapolis Mystic%' OR title ILIKE '%Megapolis Sunway%';

UPDATE properties SET
  title = 'VTP Bellissimo Hinjewadi Phase 3',
  price = 7600000.00,
  area_square_feet = 725.0,
  rera_number = 'P52100033878',
  location = 'HINJEWADI_PHASE_3',
  image_url = '/dev_vtp_township.png'
WHERE title ILIKE '%Bellissimo%';

UPDATE properties SET
  title = 'Rohan Ananta Hinjewadi Phase 3',
  price = 6200000.00,
  area_square_feet = 620.0,
  rera_number = 'P52100018598',
  location = 'HINJEWADI_PHASE_3',
  image_url = '/dev_rohan_forbes.png'
WHERE title ILIKE '%Ananta%';

UPDATE properties SET
  title = 'VTP Blue Waters (Aers & Leon) 2 BHK',
  price = 6900000.00,
  area_square_feet = 710.0,
  rera_number = 'P52100022378',
  location = 'MAHALUNGE',
  image_url = '/dev_vtp_township.png'
WHERE title ILIKE '%Blue Waters%';

UPDATE properties SET
  title = 'Godrej Hillside Mahalunge',
  price = 7500000.00,
  area_square_feet = 730.0,
  rera_number = 'P52100022099',
  location = 'MAHALUNGE',
  image_url = '/dev_godrej_building.png'
WHERE title ILIKE '%Hillside%';

UPDATE properties SET
  title = '24K Mahalunge Oasis 3 BHK',
  price = 11000000.00,
  area_square_feet = 1100.0,
  rera_number = 'P52100024212',
  location = 'MAHALUNGE',
  image_url = '/gallery_tower_3.png'
WHERE title ILIKE '%Mahalunge Oasis%';

UPDATE properties SET
  title = 'VJ Yashwin Enchante 3 BHK',
  price = 9800000.00,
  area_square_feet = 1020.0,
  rera_number = 'P52100002528',
  location = 'WAKAD',
  image_url = '/dev_vj_building.png'
WHERE title ILIKE '%Yashwin 3 BHK%' OR title ILIKE '%Yashwin Enchante%';

UPDATE properties SET
  title = 'Gera Joy on the Banks 2 BHK',
  price = 8800000.00,
  area_square_feet = 760.0,
  rera_number = 'P52100031589',
  location = 'WAKAD',
  image_url = '/dev_gera_tower.png'
WHERE title ILIKE '%Joy on the Banks%';

UPDATE properties SET
  title = 'Pride Purple Park Landmark 3 BHK',
  price = 15500000.00,
  area_square_feet = 1250.0,
  rera_number = 'P52100001244',
  location = 'BANER',
  image_url = '/gallery_tower_3.png'
WHERE title ILIKE '%Park Landmark%';

UPDATE properties SET
  title = 'Kasturi Apostle Signature 4 BHK',
  price = 22500000.00,
  area_square_feet = 2250.0,
  rera_number = 'P52100020145',
  location = 'BANER',
  image_url = '/dev_kasturi_forbes.png'
WHERE title ILIKE '%Apostle%';

UPDATE properties SET
  title = 'Balewadi High Street Prime Retail Showroom',
  price = 180000.00,
  area_square_feet = 1800.0,
  rera_number = 'P52100002890',
  location = 'BALEWADI',
  image_url = '/gallery_vj_supernova_tower.png'
WHERE title ILIKE '%Balewadi High Street Retail%';

UPDATE properties SET
  title = 'Lodha Belmondo Golf Luxury Estate',
  price = 37500000.00,
  area_square_feet = 2800.0,
  rera_number = 'P52100000287',
  location = 'TATHAWADE',
  image_url = '/lodha_3_completed_aerial.png'
WHERE title ILIKE '%Lodha Belmondo%';

UPDATE properties SET
  title = 'Godrej Ivara Kharadi',
  price = 11700000.00,
  area_square_feet = 975.0,
  rera_number = 'PR1260002502426',
  location = 'KHARADI',
  image_url = '/luxury_sunset_tower.png'
WHERE title ILIKE '%Ivara%';

UPDATE properties SET
  title = 'Shapoorji Pallonji Joyville Vyomora',
  price = 8400000.00,
  area_square_feet = 1051.0,
  rera_number = 'PR1260002600999',
  location = 'HINJEWADI_PHASE_1',
  image_url = '/properties/shapoorji-joyville-vyomora/vyomora_hero_facade.png'
WHERE title ILIKE '%Vyomora%';
