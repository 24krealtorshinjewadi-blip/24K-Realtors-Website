-- Migration V28: Add Godrej Park World - The Aqua Retreat (Hinjewadi Ph1, Pune)
-- Source: https://www.godrejproperties.com/digitalcollateral/pune/the-aqua-retreat-at-godrej-park-world/
-- Verified: INR 1.18 Cr onwards | 2 & 3 BHK | Possession September 2031 | MahaRERA: PM1260002500070

-- Property 110: Godrej Park World The Aqua Retreat 2 BHK
MERGE INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) KEY (id) VALUES (
  '00000000-0000-0000-0000-000000000110',
  'Godrej Park World - The Aqua Retreat 2 BHK',
  'Experience Aqua Living in the 275+ acre township at Hinjewadi Phase 1. 8.60+ acre Aqua Retreat with 3,150+ sqm resort amenities: infinity pool with waterfall, wooden sun deck, amphitheatre, kids play zone, camping area. 5 mins Rajiv Gandhi Infotech Park. MahaRERA PM1260002500070.',
  'RESIDENTIAL', 'BUY', 11800000.00, 900.0,
  'HINJEWADI', 'Godrej Park World, Village Mahalunge & Hinjewadi Phase 1, Pune - 411057',
  18.5924, 73.7412, 2, 2, 'AVAILABLE', true, true, false, 'PM1260002500070',
  '/properties/godrej-aqua-retreat.jpg',
  'https://www.youtube.com/embed/i9Uk1bydq5s',
  'https://thevrcompany.in/the-aqua-retreat',
  'UNFURNISHED', true
);

-- Property 111: Godrej Park World The Aqua Retreat 3 BHK
MERGE INTO properties (
  id, title, description, property_type, transaction_type, price, area_square_feet,
  location, address, latitude, longitude, bedrooms, bathrooms, status, verified_listing,
  exclusive_deal, no_brokerage, rera_number, image_url, video_url, three_d_tour_url,
  furnishing_status, gas_pipeline
) KEY (id) VALUES (
  '00000000-0000-0000-0000-000000000111',
  'Godrej Park World - The Aqua Retreat 3 BHK',
  'Spacious 3 BHK in 275+ acre Godrej Park World township, Hinjewadi Phase 1. Cascading infinity pools, resort clubhouse 3150+ sqm, playground, amphitheatre, camping area, 80% green open spaces. 5 mins Mahindra International School, 15 mins Xion Mall, 45 mins Pune Airport. Possession September 2031. MahaRERA PM1260002500070.',
  'RESIDENTIAL', 'BUY', 16500000.00, 1200.0,
  'HINJEWADI', 'Godrej Park World, Village Mahalunge & Hinjewadi Phase 1, Pune - 411057',
  18.5924, 73.7412, 3, 3, 'AVAILABLE', true, true, false, 'PM1260002500070',
  '/properties/godrej-aqua-retreat.jpg',
  'https://www.youtube.com/embed/i9Uk1bydq5s',
  'https://thevrcompany.in/the-aqua-retreat',
  'UNFURNISHED', true
);
