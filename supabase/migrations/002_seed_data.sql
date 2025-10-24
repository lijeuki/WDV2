-- WD Dental EHR - Sample Data
-- Created: October 24, 2025
-- Purpose: Seed database with sample data for testing

-- =====================================================
-- 1. INSERT BRANCHES
-- =====================================================
INSERT INTO branches (name, code, subscription_tier, status, contact_email, contact_phone, city, country)
VALUES 
  ('WD Dental Main Network', 'WDN-001', 'enterprise', 'active', 'admin@wddental.com', '+62-21-1234567', 'Jakarta', 'Indonesia'),
  ('Smile Care Dental Group', 'SCG-001', 'professional', 'active', 'info@smilecare.co.id', '+62-22-7654321', 'Bandung', 'Indonesia'),
  ('Healthy Teeth Clinics', 'HTC-001', 'basic', 'active', 'contact@healthyteeth.co.id', '+62-31-9876543', 'Surabaya', 'Indonesia');

-- =====================================================
-- 2. INSERT CLINICS
-- =====================================================
INSERT INTO clinics (branch_id, name, code, city, address, phone, email, operating_hours, status, timezone)
VALUES 
  -- WD Dental Main Network clinics
  (
    (SELECT id FROM branches WHERE code = 'WDN-001'),
    'WD Dental Jakarta Central',
    'WDJ-C01',
    'Jakarta',
    'Jl. Sudirman No. 123, Jakarta Pusat',
    '+62-21-5551234',
    'jakarta@wddental.com',
    '{"monday": "08:00-17:00", "tuesday": "08:00-17:00", "wednesday": "08:00-17:00", "thursday": "08:00-17:00", "friday": "08:00-17:00", "saturday": "09:00-14:00", "sunday": "closed"}'::jsonb,
    'active',
    'Asia/Jakarta'
  ),
  (
    (SELECT id FROM branches WHERE code = 'WDN-001'),
    'WD Dental Jakarta South',
    'WDJ-S01',
    'Jakarta',
    'Jl. TB Simatupang No. 456, Jakarta Selatan',
    '+62-21-5555678',
    'jakartasouth@wddental.com',
    '{"monday": "08:00-17:00", "tuesday": "08:00-17:00", "wednesday": "08:00-17:00", "thursday": "08:00-17:00", "friday": "08:00-17:00", "saturday": "09:00-14:00", "sunday": "closed"}'::jsonb,
    'active',
    'Asia/Jakarta'
  ),
  
  -- Smile Care clinics
  (
    (SELECT id FROM branches WHERE code = 'SCG-001'),
    'Smile Care Bandung',
    'SCB-01',
    'Bandung',
    'Jl. Dago No. 789, Bandung',
    '+62-22-1112233',
    'bandung@smilecare.co.id',
    '{"monday": "09:00-18:00", "tuesday": "09:00-18:00", "wednesday": "09:00-18:00", "thursday": "09:00-18:00", "friday": "09:00-18:00", "saturday": "09:00-15:00", "sunday": "closed"}'::jsonb,
    'active',
    'Asia/Jakarta'
  ),
  
  -- Healthy Teeth clinics
  (
    (SELECT id FROM branches WHERE code = 'HTC-001'),
    'Healthy Teeth Surabaya',
    'HTS-01',
    'Surabaya',
    'Jl. HR Muhammad No. 321, Surabaya',
    '+62-31-4445566',
    'surabaya@healthyteeth.co.id',
    '{"monday": "08:00-16:00", "tuesday": "08:00-16:00", "wednesday": "08:00-16:00", "thursday": "08:00-16:00", "friday": "08:00-16:00", "saturday": "closed", "sunday": "closed"}'::jsonb,
    'active',
    'Asia/Jakarta'
  );

-- =====================================================
-- 3. INSERT USERS
-- =====================================================
INSERT INTO users (email, name, role, primary_clinic_id, phone, license_number, specialization, status, permissions)
VALUES 
  -- Super Admin
  (
    'admin@wddental.com',
    'System Administrator',
    'super-admin',
    NULL,
    '+62-811-1234567',
    NULL,
    NULL,
    'active',
    '["system-admin", "manage-branches", "manage-clinics", "manage-users", "view-all-data"]'::jsonb
  ),
  
  -- Branch Owner
  (
    'owner@wddental.com',
    'Dr. Budi Santoso',
    'branch-owner',
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    '+62-812-2345678',
    'SIP.001/2020',
    'General Dentistry',
    'active',
    '["manage-clinics", "manage-staff", "view-reports", "view-financials"]'::jsonb
  ),
  
  -- Clinic PIC
  (
    'manager@wddental.com',
    'Ratna Wijaya',
    'clinic-pic',
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    '+62-813-3456789',
    NULL,
    NULL,
    'active',
    '["manage-staff", "view-reports", "approve-treatments", "view-financials"]'::jsonb
  ),
  
  -- Doctors
  (
    'doctor1@wddental.com',
    'Dr. Siti Nurhaliza',
    'doctor',
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    '+62-814-4567890',
    'SIP.456/2018',
    'General Dentistry',
    'active',
    '["perform-exams", "execute-treatments", "view-clinical-notes", "prescribe-medications"]'::jsonb
  ),
  (
    'doctor2@wddental.com',
    'Dr. Ahmad Hidayat',
    'doctor',
    (SELECT id FROM clinics WHERE code = 'WDJ-S01'),
    '+62-815-5678901',
    'SIP.789/2019',
    'Orthodontics',
    'active',
    '["perform-exams", "execute-treatments", "view-clinical-notes", "prescribe-medications"]'::jsonb
  ),
  (
    'doctor3@smilecare.co.id',
    'Dr. Rina Kartika',
    'doctor',
    (SELECT id FROM clinics WHERE code = 'SCB-01'),
    '+62-816-6789012',
    'SIP.321/2020',
    'Endodontics',
    'active',
    '["perform-exams", "execute-treatments", "view-clinical-notes", "prescribe-medications"]'::jsonb
  ),
  
  -- Front Desk
  (
    'frontdesk1@wddental.com',
    'Ani Setyawati',
    'front-desk',
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    '+62-817-7890123',
    NULL,
    NULL,
    'active',
    '["manage-appointments", "process-payments", "view-patient-profile", "checkin-patients"]'::jsonb
  ),
  (
    'frontdesk2@smilecare.co.id',
    'Dewi Lestari',
    'front-desk',
    (SELECT id FROM clinics WHERE code = 'SCB-01'),
    '+62-818-8901234',
    NULL,
    NULL,
    'active',
    '["manage-appointments", "process-payments", "view-patient-profile", "checkin-patients"]'::jsonb
  );

-- =====================================================
-- 4. INSERT USER CLINIC ASSIGNMENTS
-- =====================================================
INSERT INTO user_clinic_assignments (user_id, clinic_id, branch_id, role, is_primary)
VALUES 
  -- Branch Owner can access all clinics in their branch
  (
    (SELECT id FROM users WHERE email = 'owner@wddental.com'),
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    (SELECT id FROM branches WHERE code = 'WDN-001'),
    'branch-owner',
    true
  ),
  (
    (SELECT id FROM users WHERE email = 'owner@wddental.com'),
    (SELECT id FROM clinics WHERE code = 'WDJ-S01'),
    (SELECT id FROM branches WHERE code = 'WDN-001'),
    'branch-owner',
    false
  ),
  
  -- Clinic PIC
  (
    (SELECT id FROM users WHERE email = 'manager@wddental.com'),
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    (SELECT id FROM branches WHERE code = 'WDN-001'),
    'clinic-pic',
    true
  ),
  
  -- Doctors
  (
    (SELECT id FROM users WHERE email = 'doctor1@wddental.com'),
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    (SELECT id FROM branches WHERE code = 'WDN-001'),
    'doctor',
    true
  ),
  (
    (SELECT id FROM users WHERE email = 'doctor2@wddental.com'),
    (SELECT id FROM clinics WHERE code = 'WDJ-S01'),
    (SELECT id FROM branches WHERE code = 'WDN-001'),
    'doctor',
    true
  ),
  (
    (SELECT id FROM users WHERE email = 'doctor3@smilecare.co.id'),
    (SELECT id FROM clinics WHERE code = 'SCB-01'),
    (SELECT id FROM branches WHERE code = 'SCG-001'),
    'doctor',
    true
  ),
  
  -- Front Desk
  (
    (SELECT id FROM users WHERE email = 'frontdesk1@wddental.com'),
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    (SELECT id FROM branches WHERE code = 'WDN-001'),
    'front-desk',
    true
  ),
  (
    (SELECT id FROM users WHERE email = 'frontdesk2@smilecare.co.id'),
    (SELECT id FROM clinics WHERE code = 'SCB-01'),
    (SELECT id FROM branches WHERE code = 'SCG-001'),
    'front-desk',
    true
  );

-- =====================================================
-- 5. INSERT PATIENTS
-- =====================================================
INSERT INTO patients (clinic_id, patient_number, full_name, date_of_birth, gender, phone, email, address, city, blood_type, allergies, medical_conditions, status)
VALUES 
  -- Jakarta Central patients
  (
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    'PT-JC-00001',
    'John Doe',
    '1990-05-15',
    'male',
    '+62-821-1111111',
    'john.doe@email.com',
    'Jl. Kebon Jeruk No. 10',
    'Jakarta',
    'O+',
    ARRAY['Penicillin'],
    ARRAY['Hypertension'],
    'active'
  ),
  (
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    'PT-JC-00002',
    'Jane Smith',
    '1985-08-22',
    'female',
    '+62-822-2222222',
    'jane.smith@email.com',
    'Jl. Mampang Prapatan No. 45',
    'Jakarta',
    'A+',
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    'active'
  ),
  (
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    'PT-JC-00003',
    'Robert Johnson',
    '1978-03-10',
    'male',
    '+62-823-3333333',
    'robert.j@email.com',
    'Jl. Kuningan No. 78',
    'Jakarta',
    'B+',
    ARRAY[]::TEXT[],
    ARRAY['Diabetes Type 2'],
    'active'
  ),
  (
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    'PT-JC-00004',
    'Emily Brown',
    '1995-11-30',
    'female',
    '+62-824-4444444',
    'emily.brown@email.com',
    'Jl. Senopati No. 12',
    'Jakarta',
    'AB+',
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    'active'
  ),
  (
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    'PT-JC-00005',
    'Michael Davis',
    '1988-07-18',
    'male',
    '+62-825-5555555',
    'michael.d@email.com',
    'Jl. Permata Hijau No. 90',
    'Jakarta',
    'O-',
    ARRAY['Aspirin'],
    ARRAY[]::TEXT[],
    'active'
  ),
  
  -- Jakarta South patients
  (
    (SELECT id FROM clinics WHERE code = 'WDJ-S01'),
    'PT-JS-00001',
    'Sarah Williams',
    '1992-12-05',
    'female',
    '+62-826-6666666',
    'sarah.w@email.com',
    'Jl. Cilandak No. 33',
    'Jakarta',
    'A-',
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    'active'
  ),
  (
    (SELECT id FROM clinics WHERE code = 'WDJ-S01'),
    'PT-JS-00002',
    'David Martinez',
    '1980-04-25',
    'male',
    '+62-827-7777777',
    'david.m@email.com',
    'Jl. Pondok Indah No. 67',
    'Jakarta',
    'B-',
    ARRAY[]::TEXT[],
    ARRAY['Asthma'],
    'active'
  ),
  
  -- Bandung patients
  (
    (SELECT id FROM clinics WHERE code = 'SCB-01'),
    'PT-BD-00001',
    'Lisa Anderson',
    '1987-09-14',
    'female',
    '+62-828-8888888',
    'lisa.a@email.com',
    'Jl. Cihampelas No. 55',
    'Bandung',
    'O+',
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    'active'
  ),
  (
    (SELECT id FROM clinics WHERE code = 'SCB-01'),
    'PT-BD-00002',
    'James Wilson',
    '1975-06-08',
    'male',
    '+62-829-9999999',
    'james.w@email.com',
    'Jl. Riau No. 88',
    'Bandung',
    'AB-',
    ARRAY['Ibuprofen'],
    ARRAY['High Cholesterol'],
    'active'
  ),
  
  -- Surabaya patients
  (
    (SELECT id FROM clinics WHERE code = 'HTS-01'),
    'PT-SB-00001',
    'Maria Garcia',
    '1991-02-20',
    'female',
    '+62-830-0000000',
    'maria.g@email.com',
    'Jl. Darmo No. 101',
    'Surabaya',
    'A+',
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    'active'
  );

-- =====================================================
-- 6. INSERT APPOINTMENTS (Today and upcoming)
-- =====================================================
INSERT INTO appointments (clinic_id, patient_id, doctor_id, appointment_date, end_time, duration_minutes, appointment_type, status, notes, created_by)
VALUES 
  -- Today's appointments
  (
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    (SELECT id FROM patients WHERE patient_number = 'PT-JC-00001'),
    (SELECT id FROM users WHERE email = 'doctor1@wddental.com'),
    NOW() + INTERVAL '2 hours',
    NOW() + INTERVAL '2 hours 30 minutes',
    30,
    'exam',
    'scheduled',
    'Regular checkup',
    (SELECT id FROM users WHERE email = 'frontdesk1@wddental.com')
  ),
  (
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    (SELECT id FROM patients WHERE patient_number = 'PT-JC-00002'),
    (SELECT id FROM users WHERE email = 'doctor1@wddental.com'),
    NOW() + INTERVAL '4 hours',
    NOW() + INTERVAL '5 hours',
    60,
    'filling',
    'confirmed',
    'Composite filling tooth #16',
    (SELECT id FROM users WHERE email = 'frontdesk1@wddental.com')
  ),
  (
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    (SELECT id FROM patients WHERE patient_number = 'PT-JC-00003'),
    (SELECT id FROM users WHERE email = 'doctor1@wddental.com'),
    NOW() + INTERVAL '6 hours',
    NOW() + INTERVAL '6 hours 45 minutes',
    45,
    'cleaning',
    'scheduled',
    'Scaling and polishing',
    (SELECT id FROM users WHERE email = 'frontdesk1@wddental.com')
  ),
  
  -- Tomorrow's appointments
  (
    (SELECT id FROM clinics WHERE code = 'WDJ-C01'),
    (SELECT id FROM patients WHERE patient_number = 'PT-JC-00004'),
    (SELECT id FROM users WHERE email = 'doctor1@wddental.com'),
    NOW() + INTERVAL '1 day 3 hours',
    NOW() + INTERVAL '1 day 3 hours 30 minutes',
    30,
    'consultation',
    'scheduled',
    'Orthodontic consultation',
    (SELECT id FROM users WHERE email = 'frontdesk1@wddental.com')
  ),
  (
    (SELECT id FROM clinics WHERE code = 'WDJ-S01'),
    (SELECT id FROM patients WHERE patient_number = 'PT-JS-00001'),
    (SELECT id FROM users WHERE email = 'doctor2@wddental.com'),
    NOW() + INTERVAL '1 day 4 hours',
    NOW() + INTERVAL '1 day 5 hours 30 minutes',
    90,
    'root-canal',
    'confirmed',
    'Root canal treatment tooth #36',
    (SELECT id FROM users WHERE email = 'frontdesk1@wddental.com')
  );

-- =====================================================
-- Success message
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Sample data inserted successfully!';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '  - 3 Branches';
  RAISE NOTICE '  - 4 Clinics';
  RAISE NOTICE '  - 8 Users (1 admin, 1 owner, 1 manager, 3 doctors, 2 front desk)';
  RAISE NOTICE '  - 10 Patients';
  RAISE NOTICE '  - 5 Appointments';
END $$;
