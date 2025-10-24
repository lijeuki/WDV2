-- =====================================================
-- WD Dental EHR - Initial Database Schema
-- Version: 1.0
-- Date: October 24, 2025
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ORGANIZATIONS & MULTI-TENANCY
-- =====================================================

-- Walking Doctor (Grand Parent - Level 0)
CREATE TABLE walking_doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Branch (Parent - Level 1)
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  walking_doctor_id UUID REFERENCES walking_doctors(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  capacity INTEGER DEFAULT 10,
  status VARCHAR(50) DEFAULT 'active', -- active, suspended, inactive
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinic (Child - Level 2)
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  specialties TEXT[], -- ['general', 'ortho', 'pedo', etc.]
  capacity INTEGER DEFAULT 5,
  operating_hours JSONB, -- {monday: {open: '09:00', close: '17:00'}}
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- USERS & ROLES
-- =====================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE, -- Link to Supabase auth.users
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'walking_doctor', 'branch_owner', 'clinic_owner', 'doctor', 'front_desk', 'hygienist', 'assistant'
  license_number VARCHAR(100),
  license_expiry DATE,
  phone VARCHAR(50),
  specialization VARCHAR(100),
  employment_status VARCHAR(50) DEFAULT 'active', -- active, on_leave, suspended, resigned
  hire_date DATE,
  walking_doctor_id UUID REFERENCES walking_doctors(id),
  branch_id UUID REFERENCES branches(id),
  clinic_id UUID REFERENCES clinics(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PATIENTS
-- =====================================================

CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  walking_doctor_id UUID REFERENCES walking_doctors(id), -- For cross-clinic access
  patient_record_number VARCHAR(50) UNIQUE NOT NULL, -- PRN for cross-clinic access
  
  -- Personal Information
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20),
  ktp_number VARCHAR(50) UNIQUE, -- National ID (Indonesia)
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(20),
  
  -- Emergency Contact
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  emergency_contact_relationship VARCHAR(100),
  
  -- Medical Information
  blood_type VARCHAR(10),
  allergies TEXT[],
  medical_conditions TEXT[],
  current_medications TEXT[],
  
  -- Insurance
  insurance_provider VARCHAR(255),
  insurance_number VARCHAR(100),
  insurance_expiry DATE,
  
  -- Metadata
  registration_date DATE DEFAULT CURRENT_DATE,
  last_visit_date DATE,
  total_visits INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, deceased
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cross-clinic patient access consent
CREATE TABLE patient_consent_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  source_clinic_id UUID REFERENCES clinics(id),
  target_clinic_id UUID REFERENCES clinics(id),
  consent_given_at TIMESTAMPTZ DEFAULT NOW(),
  consent_verified_by UUID REFERENCES users(id),
  ktp_verified BOOLEAN DEFAULT false,
  bod_approval BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- APPOINTMENTS
-- =====================================================

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES users(id),
  
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  
  appointment_type VARCHAR(100), -- 'check-up', 'cleaning', 'treatment', 'emergency', 'follow-up'
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, confirmed, checked_in, in_progress, completed, cancelled, no_show
  
  reason TEXT,
  notes TEXT,
  
  -- Reminders
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMPTZ,
  
  -- Cancellation
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES users(id),
  cancellation_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CLINICAL RECORDS - ODONTOGRAM & EXAMS
-- =====================================================

CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id),
  doctor_id UUID REFERENCES users(id),
  
  exam_date DATE DEFAULT CURRENT_DATE,
  exam_type VARCHAR(100), -- 'comprehensive', 'limited', 'emergency', 'follow-up'
  
  -- Chief Complaint
  chief_complaint TEXT,
  
  -- Vital Signs
  blood_pressure VARCHAR(20),
  pulse INTEGER,
  temperature DECIMAL(4,1),
  
  -- Odontogram Data (JSON structure)
  odontogram_data JSONB, -- {teeth: {11: {conditions: [...], surfaces: {...}}, 12: {...}}}
  
  -- Clinical Notes
  clinical_notes TEXT,
  diagnosis TEXT[],
  
  -- Exam Status
  status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, completed, pending_review
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual tooth findings
CREATE TABLE tooth_findings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  tooth_number INTEGER NOT NULL, -- FDI notation (11-48)
  
  -- Conditions
  conditions TEXT[], -- ['caries', 'filled', 'crown', 'missing', etc.]
  surfaces_affected VARCHAR(10)[], -- ['M', 'O', 'D', 'B', 'L']
  
  -- Details
  severity VARCHAR(50), -- 'mild', 'moderate', 'severe'
  notes TEXT,
  requires_treatment BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TREATMENT PLANS
-- =====================================================

CREATE TABLE treatment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES exams(id),
  created_by UUID REFERENCES users(id),
  
  title VARCHAR(255),
  description TEXT,
  
  -- Financial
  total_estimated_cost DECIMAL(12,2),
  insurance_coverage DECIMAL(12,2),
  patient_portion DECIMAL(12,2),
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft', -- draft, presented, accepted, rejected, in_progress, completed, on_hold
  presented_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Priority
  priority VARCHAR(50) DEFAULT 'normal', -- urgent, high, normal, low
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE treatment_procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  treatment_plan_id UUID REFERENCES treatment_plans(id) ON DELETE CASCADE,
  
  tooth_number INTEGER,
  procedure_code VARCHAR(50),
  procedure_name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Financial
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  
  -- Scheduling
  estimated_duration_minutes INTEGER,
  sequence_order INTEGER, -- Order in treatment sequence
  
  -- Status
  status VARCHAR(50) DEFAULT 'planned', -- planned, scheduled, in_progress, completed, cancelled
  scheduled_date DATE,
  completed_date DATE,
  
  -- Clinical
  surfaces VARCHAR(10)[], -- For surface-specific procedures
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PAYMENTS & BILLING
-- =====================================================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id),
  
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  invoice_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  
  subtotal DECIMAL(12,2) NOT NULL,
  tax DECIMAL(12,2) DEFAULT 0,
  discount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  
  status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, partial, paid, overdue, cancelled
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  
  payment_date DATE DEFAULT CURRENT_DATE,
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(50), -- 'cash', 'credit_card', 'debit_card', 'insurance', 'bank_transfer'
  
  transaction_reference VARCHAR(255),
  notes TEXT,
  
  processed_by UUID REFERENCES users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS & TASKS
-- =====================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_role VARCHAR(50),
  
  type VARCHAR(100), -- 'exam_complete', 'high_value_plan', 'urgent_scheduling', 'payment_due'
  priority VARCHAR(50) DEFAULT 'normal', -- urgent, high, normal, low
  
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_required VARCHAR(255),
  action_url VARCHAR(500),
  
  related_entity_type VARCHAR(50), -- 'exam', 'treatment_plan', 'appointment', 'patient'
  related_entity_id UUID,
  
  read_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AUDIT LOGS
-- =====================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  clinic_id UUID REFERENCES clinics(id),
  
  action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'access'
  entity_type VARCHAR(100) NOT NULL, -- 'patient', 'exam', 'treatment_plan', etc.
  entity_id UUID,
  
  changes JSONB, -- Store before/after values
  ip_address VARCHAR(50),
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users
CREATE INDEX idx_users_clinic_id ON users(clinic_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_auth_id ON users(auth_id);

-- Patients
CREATE INDEX idx_patients_clinic_id ON patients(clinic_id);
CREATE INDEX idx_patients_prn ON patients(patient_record_number);
CREATE INDEX idx_patients_ktp ON patients(ktp_number);
CREATE INDEX idx_patients_name ON patients(full_name);

-- Appointments
CREATE INDEX idx_appointments_clinic_id ON appointments(clinic_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Exams
CREATE INDEX idx_exams_clinic_id ON exams(clinic_id);
CREATE INDEX idx_exams_patient_id ON exams(patient_id);
CREATE INDEX idx_exams_doctor_id ON exams(doctor_id);
CREATE INDEX idx_exams_date ON exams(exam_date);

-- Treatment Plans
CREATE INDEX idx_treatment_plans_clinic_id ON treatment_plans(clinic_id);
CREATE INDEX idx_treatment_plans_patient_id ON treatment_plans(patient_id);
CREATE INDEX idx_treatment_plans_status ON treatment_plans(status);

-- Notifications
CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE walking_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = auth_id);

-- Clinic staff can view patients in their clinic
CREATE POLICY "Clinic staff can view clinic patients" ON patients
  FOR SELECT USING (
    clinic_id IN (
      SELECT clinic_id FROM users WHERE auth_id = auth.uid()
    )
  );

-- Doctors can view their appointments
CREATE POLICY "Doctors can view their appointments" ON appointments
  FOR SELECT USING (
    doctor_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    OR
    clinic_id IN (SELECT clinic_id FROM users WHERE auth_id = auth.uid())
  );

-- Similar policies for other tables...
-- (Add more specific RLS policies based on roles)

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_walking_doctors_updated_at BEFORE UPDATE ON walking_doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON clinics FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_treatment_plans_updated_at BEFORE UPDATE ON treatment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- SEED DATA (Optional - for development)
-- =====================================================

-- Insert demo Walking Doctor
INSERT INTO walking_doctors (id, name, email, phone) VALUES
('00000000-0000-0000-0000-000000000001', 'Walking Doctors Indonesia', 'admin@walkingdoctors.co.id', '+62-21-12345678');

-- Insert demo Branch
INSERT INTO branches (id, walking_doctor_id, name, location) VALUES
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Jakarta Branch', 'Jakarta');

-- Insert demo Clinic
INSERT INTO clinics (id, branch_id, name, location, specialties) VALUES
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Jakarta Central Clinic', 'Jakarta Pusat', ARRAY['general', 'ortho']);

-- Demo users will be created via auth signup
