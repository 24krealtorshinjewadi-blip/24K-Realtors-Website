-- Alter payslips table to add late_deduction and absent_deduction columns
ALTER TABLE payslips ADD COLUMN late_deduction DECIMAL(15, 2) NOT NULL DEFAULT 0.00;
ALTER TABLE payslips ADD COLUMN absent_deduction DECIMAL(15, 2) NOT NULL DEFAULT 0.00;
