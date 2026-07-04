-- Database migration to add listing media and facility details
ALTER TABLE properties ADD COLUMN image_url VARCHAR(1024);
ALTER TABLE properties ADD COLUMN video_url VARCHAR(1024);
ALTER TABLE properties ADD COLUMN three_d_tour_url VARCHAR(1024);
ALTER TABLE properties ADD COLUMN furnishing_status VARCHAR(50);
ALTER TABLE properties ADD COLUMN gas_pipeline BOOLEAN NOT NULL DEFAULT FALSE;
