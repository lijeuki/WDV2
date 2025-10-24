-- =====================================================
-- QUICK FIX: Create Demo Users with Passwords
-- Copy and paste this ENTIRE file into Supabase SQL Editor
-- =====================================================

-- Step 1: Add password_hash column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- Step 2: Create organization structure (if not exists)
INSERT INTO walking_doctors (id, name, email, phone, address) VALUES
('00000000-0000-0000-0000-000000000001', 'Walking Doctors Indonesia', 'admin@walkingdoctors.co.id', '+62-21-12345678', 'Jl. Sudirman No. 123, Jakarta')
ON CONFLICT (id) DO NOTHING;

INSERT INTO branches (id, walking_doctor_id, name, location, address, phone, email, status) VALUES
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Jakarta Branch', 'Jakarta', 'Jl. Thamrin No. 45, Jakarta Pusat', '+62-21-87654321', 'jakarta@walkingdoctors.co.id', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO clinics (id, branch_id, name, location, address, phone, email, specialties, status) VALUES
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Jakarta Central Clinic', 'Jakarta Pusat', 'Jl. MH Thamrin No. 45, Jakarta Pusat 10350', '+62-21-55555555', 'central@walkingdoctors.co.id', ARRAY['general', 'orthodontics', 'pediatric'], 'active')
ON CONFLICT (id) DO NOTHING;

-- Step 3: Create demo users with password: "password"
-- Password hash: cGFzc3dvcmQ= (Base64 encoded "password")

INSERT INTO users (email, full_name, role, password_hash, clinic_id, branch_id, walking_doctor_id, employment_status, phone) VALUES
('walkingdoctor@admin.com', 'Dr. Admin Super', 'walking_doctor', 'cGFzc3dvcmQ=', NULL, NULL, '00000000-0000-0000-0000-000000000001', 'active', '+62-811-1111-1111'),
('branch@owner.com', 'Mr. Branch Manager', 'branch_owner', 'cGFzc3dvcmQ=', NULL, '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-2222-2222'),
('clinic@owner.com', 'Mrs. Clinic Owner', 'clinic_owner', 'cGFzc3dvcmQ=', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-3333-3333'),
('doctor@clinic.com', 'Dr. John Smith', 'doctor', 'cGFzc3dvcmQ=', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-4444-4444'),
('desk@clinic.com', 'Ms. Sarah Front', 'front_desk', 'cGFzc3dvcmQ=', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-5555-5555'),
('hygienist@clinic.com', 'Ms. Mary Clean', 'hygienist', 'cGFzc3dvcmQ=', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-6666-6666'),
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

-- Step 4: Verify users were created
SELECT 
  email, 
  full_name, 
  role, 
  CASE WHEN password_hash IS NOT NULL THEN '✓ Has password' ELSE '✗ No password' END as password_status,
  employment_status
FROM users 
ORDER BY role;

-- Done! You should see 7 users with passwords.
-- Now you can login at http://localhost:5173/login
-- Use any email above with password: password
