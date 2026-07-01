-- Add Employee fields to users table
ALTER TABLE users ADD COLUMN full_name VARCHAR(100);
ALTER TABLE users ADD COLUMN email VARCHAR(100);
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN designation VARCHAR(100);
ALTER TABLE users ADD COLUMN department VARCHAR(100);
ALTER TABLE users ADD COLUMN date_of_joining DATE;
ALTER TABLE users ADD COLUMN date_of_relieving DATE;
ALTER TABLE users ADD COLUMN salary_base DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN pan_number VARCHAR(20);
ALTER TABLE users ADD COLUMN aadhar_number VARCHAR(20);
ALTER TABLE users ADD COLUMN bank_name VARCHAR(100);
ALTER TABLE users ADD COLUMN bank_account_number VARCHAR(50);
ALTER TABLE users ADD COLUMN bank_ifsc_code VARCHAR(20);

-- Create index on employee specific lookup fields
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_department ON users(department);
