-- =====================================================
-- WD Dental EHR - Seed Data (Correct Schema)
-- Run this to populate initial demo data
-- =====================================================

-- Clear existing seed data (optional)
DELETE FROM users WHERE email LIKE '%@walkingdoctors%' OR email LIKE '%@demo%';
DELETE FROM clinics WHERE id = '00000000-0000-0000-0000-000000000003';
DELETE FROM branches WHERE id = '00000000-0000-0000-0000-000000000002';
DELETE FROM walking_doctors WHERE id = '00000000-0000-0000-0000-000000000001';

-- Insert demo Walking Doctor
INSERT INTO walking_doctors (id, name, email, phone, address) VALUES
('00000000-0000-0000-0000-000000000001', 
 'Walking Doctors Indonesia', 
 'admin@walkingdoctors.co.id', 
 '+62-21-12345678',
 'Jl. Sudirman No. 123, Jakarta');

-- Insert demo Branch
INSERT INTO branches (id, walking_doctor_id, name, location, address, phone, email, status) VALUES
('00000000-0000-0000-0000-000000000002', 
 '00000000-0000-0000-0000-000000000001', 
 'Jakarta Branch', 
 'Jakarta',
 'Jl. Thamrin No. 45, Jakarta Pusat',
 '+62-21-87654321',
 'jakarta@walkingdoctors.co.id',
 'active');

-- Insert demo Clinic
INSERT INTO clinics (id, branch_id, name, location, address, phone, email, specialties, status) VALUES
('00000000-0000-0000-0000-000000000003', 
 '00000000-0000-0000-0000-000000000002', 
 'Jakarta Central Clinic', 
 'Jakarta Pusat',
 'Jl. MH Thamrin No. 45, Jakarta Pusat 10350',
 '+62-21-55555555',
 'central@walkingdoctors.co.id',
 ARRAY['general', 'orthodontics', 'pediatric'],
 'active');

-- Success message
SELECT 
  'Seed data inserted successfully!' as message,
  (SELECT COUNT(*) FROM walking_doctors) as walking_doctors_count,
  (SELECT COUNT(*) FROM branches) as branches_count,
  (SELECT COUNT(*) FROM clinics) as clinics_count;
