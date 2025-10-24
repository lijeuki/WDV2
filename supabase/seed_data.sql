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

-- Insert demo users with passwords
-- Password for all users: "password" (Base64: cGFzc3dvcmQ=)

INSERT INTO users (email, full_name, role, password_hash, clinic_id, branch_id, walking_doctor_id, employment_status, phone) VALUES
-- Walking Doctor (Super Admin)
('walkingdoctor@admin.com', 'Dr. Admin Super', 'walking_doctor', 'cGFzc3dvcmQ=', NULL, NULL, '00000000-0000-0000-0000-000000000001', 'active', '+62-811-1111-1111'),

-- Branch Owner
('branch@owner.com', 'Mr. Branch Manager', 'branch_owner', 'cGFzc3dvcmQ=', NULL, '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-2222-2222'),

-- Clinic Owner
('clinic@owner.com', 'Mrs. Clinic Owner', 'clinic_owner', 'cGFzc3dvcmQ=', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-3333-3333'),

-- Doctor
('doctor@clinic.com', 'Dr. John Smith', 'doctor', 'cGFzc3dvcmQ=', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-4444-4444'),

-- Front Desk
('desk@clinic.com', 'Ms. Sarah Front', 'front_desk', 'cGFzc3dvcmQ=', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-5555-5555'),

-- Hygienist
('hygienist@clinic.com', 'Ms. Mary Clean', 'hygienist', 'cGFzc3dvcmQ=', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-6666-6666'),

-- Assistant
('assistant@clinic.com', 'Mr. Tom Helper', 'assistant', 'cGFzc3dvcmQ=', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-7777-7777')

ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  clinic_id = EXCLUDED.clinic_id,
  branch_id = EXCLUDED.branch_id,
  walking_doctor_id = EXCLUDED.walking_doctor_id,
  employment_status = EXCLUDED.employment_status,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Success message
SELECT 
  'Seed data inserted successfully!' as message,
  (SELECT COUNT(*) FROM walking_doctors) as walking_doctors_count,
  (SELECT COUNT(*) FROM branches) as branches_count,
  (SELECT COUNT(*) FROM clinics) as clinics_count,
  (SELECT COUNT(*) FROM users) as users_count;
