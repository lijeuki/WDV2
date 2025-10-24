-- WD Dental EHR - Initial Database Schema
-- Created: October 24, 2025
-- Purpose: Complete multi-tenant dental EHR system

-- =====================================================
-- 1. BRANCHES TABLE (Multi-tenant root level)
-- =====================================================
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  subscription_tier VARCHAR(50) DEFAULT 'basic', -- basic, professional, enterprise
  status VARCHAR(50) DEFAULT 'active', -- active, suspended, cancelled
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Indonesia',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 2. CLINICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  city VARCHAR(100),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  operating_hours JSONB, -- {"monday": "08:00-17:00", ...}
  status VARCHAR(50) DEFAULT 'active',
  timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 3. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- super-admin, branch-owner, clinic-pic, doctor, front-desk
  primary_clinic_id UUID REFERENCES clinics(id),
  phone VARCHAR(50),
  avatar_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  permissions JSONB, -- Array of permission strings
  license_number VARCHAR(100), -- For doctors
  specialization VARCHAR(100), -- For doctors
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 4. USER CLINIC ASSIGNMENTS (Many-to-many)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_clinic_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, clinic_id)
);

-- =====================================================
-- 5. PATIENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  patient_number VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(20),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  blood_type VARCHAR(10),
  allergies TEXT[], -- Array of allergy strings
  medical_conditions TEXT[], -- Array of conditions
  current_medications TEXT[], -- Array of medications
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  emergency_contact_relationship VARCHAR(50),
  insurance_provider VARCHAR(255),
  insurance_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 6. APPOINTMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES users(id),
  appointment_date TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration_minutes INTEGER DEFAULT 30,
  appointment_type VARCHAR(100), -- exam, cleaning, filling, root-canal, crown, extraction, consultation, follow-up
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, confirmed, checked-in, in-progress, completed, cancelled, no-show
  notes TEXT,
  internal_notes TEXT, -- Only visible to staff
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_at TIMESTAMP,
  no_show_count INTEGER DEFAULT 0,
  cancellation_reason TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 7. VISITS TABLE (Clinical encounters)
-- =====================================================
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES users(id),
  appointment_id UUID REFERENCES appointments(id),
  visit_date TIMESTAMP DEFAULT NOW(),
  visit_number INTEGER, -- Sequential visit number per patient
  chief_complaint TEXT,
  
  -- Odontogram Data (JSON format for flexibility)
  -- Format: { "16": { condition: "caries", surfaces: ["O", "M"], notes: "..." }, ... }
  odontogram_data JSONB,
  
  -- SOAP Notes
  soap_subjective TEXT,
  soap_objective TEXT,
  soap_assessment TEXT,
  soap_plan TEXT,
  
  -- Additional Clinical Data
  vital_signs JSONB, -- {"blood_pressure": "120/80", "pulse": "72", ...}
  clinical_findings TEXT,
  diagnosis_codes TEXT[], -- ICD-10 codes
  treatment_notes TEXT,
  
  status VARCHAR(50) DEFAULT 'draft', -- draft, in-progress, completed
  duration_minutes INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- =====================================================
-- 8. PROCEDURES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  tooth_number VARCHAR(10), -- FDI notation: 11-48, or "multiple"
  surfaces VARCHAR(20), -- MODBL surfaces (comma-separated)
  procedure_code VARCHAR(50), -- CDT code
  procedure_name VARCHAR(255) NOT NULL,
  procedure_category VARCHAR(100), -- preventive, restorative, endodontic, periodontal, prosthodontic, oral-surgery
  description TEXT,
  
  -- Pricing
  base_price DECIMAL(10, 2),
  discount DECIMAL(10, 2) DEFAULT 0,
  final_price DECIMAL(10, 2),
  
  -- Status & Timing
  status VARCHAR(50) DEFAULT 'planned', -- planned, in-progress, completed, cancelled
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
  estimated_duration_minutes INTEGER,
  performed_at TIMESTAMP,
  performed_by UUID REFERENCES users(id),
  
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 9. PENDING TREATMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS pending_treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES visits(id),
  
  tooth_number VARCHAR(10),
  treatment_name VARCHAR(255) NOT NULL,
  treatment_category VARCHAR(100),
  description TEXT,
  
  -- Why Pending
  pending_reason VARCHAR(100), -- financial, schedule-conflict, medical-reason, patient-decision, needs-consultation
  reason_notes TEXT,
  
  -- Estimates
  estimated_cost DECIMAL(10, 2),
  estimated_duration_minutes INTEGER,
  
  -- Follow-up
  priority VARCHAR(20) DEFAULT 'medium',
  last_contacted_date DATE,
  next_follow_up_date DATE,
  follow_up_notes TEXT,
  conversion_probability INTEGER, -- 0-100, can be calculated by AI
  
  status VARCHAR(50) DEFAULT 'pending', -- pending, scheduled, converted, declined, expired
  converted_to_procedure_id UUID REFERENCES procedures(id),
  conversion_date TIMESTAMP,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 10. PRESCRIPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES users(id),
  
  medication_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  frequency VARCHAR(100), -- "3 times daily", "Every 8 hours"
  duration VARCHAR(100), -- "7 days", "2 weeks"
  quantity INTEGER,
  refills INTEGER DEFAULT 0,
  
  instructions TEXT,
  warnings TEXT,
  
  status VARCHAR(50) DEFAULT 'active', -- active, completed, cancelled
  prescribed_date TIMESTAMP DEFAULT NOW(),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 11. XRAY RECORDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS xray_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES visits(id),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  tooth_number VARCHAR(10),
  
  file_name VARCHAR(255),
  file_url TEXT NOT NULL, -- Supabase Storage URL
  file_path TEXT,
  file_size INTEGER,
  mime_type VARCHAR(100),
  
  xray_type VARCHAR(100), -- periapical, bitewing, panoramic, cephalometric, cbct
  capture_date DATE,
  notes TEXT,
  
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 12. PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  
  receipt_number VARCHAR(100) UNIQUE,
  
  -- Amount Breakdown
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  insurance_covered DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  amount_due DECIMAL(10, 2) DEFAULT 0,
  
  -- Payment Details
  payment_method VARCHAR(50), -- cash, card, transfer, insurance, qris
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, partial, paid, refunded, cancelled
  
  transaction_id VARCHAR(255),
  payment_date TIMESTAMP,
  
  notes TEXT,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 13. AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, LOGOUT, VIEW
  resource_type VARCHAR(100), -- patient, visit, appointment, etc.
  resource_id UUID,
  changes JSONB, -- Before/after values
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- Patients
CREATE INDEX IF NOT EXISTS idx_patients_clinic ON patients(clinic_id);
CREATE INDEX IF NOT EXISTS idx_patients_patient_number ON patients(patient_number);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);

-- Appointments
CREATE INDEX IF NOT EXISTS idx_appointments_clinic ON appointments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Visits
CREATE INDEX IF NOT EXISTS idx_visits_patient ON visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_visits_clinic ON visits(clinic_id);
CREATE INDEX IF NOT EXISTS idx_visits_doctor ON visits(doctor_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_visits_status ON visits(status);

-- Procedures
CREATE INDEX IF NOT EXISTS idx_procedures_visit ON procedures(visit_id);
CREATE INDEX IF NOT EXISTS idx_procedures_patient ON procedures(patient_id);
CREATE INDEX IF NOT EXISTS idx_procedures_status ON procedures(status);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_patient ON payments(patient_id);
CREATE INDEX IF NOT EXISTS idx_payments_clinic ON payments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_payments_visit ON payments(visit_id);
CREATE INDEX IF NOT EXISTS idx_payments_receipt ON payments(receipt_number);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);

-- Pending Treatments
CREATE INDEX IF NOT EXISTS idx_pending_patient ON pending_treatments(patient_id);
CREATE INDEX IF NOT EXISTS idx_pending_clinic ON pending_treatments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_pending_status ON pending_treatments(status);

-- =====================================================
-- TRIGGERS for Auto-updating timestamps
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON clinics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_procedures_updated_at BEFORE UPDATE ON procedures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pending_treatments_updated_at BEFORE UPDATE ON pending_treatments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
