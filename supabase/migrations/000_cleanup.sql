-- =====================================================
-- CLEANUP: Drop all existing tables (if any)
-- Run this FIRST if you have conflicts
-- =====================================================

-- Drop tables in reverse order (due to foreign keys)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS treatment_procedures CASCADE;
DROP TABLE IF EXISTS treatment_plans CASCADE;
DROP TABLE IF EXISTS tooth_findings CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS patient_consent_records CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS clinics CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS walking_doctors CASCADE;

-- Clean up any existing functions
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS increment_patient_visits(UUID) CASCADE;

-- Success message
SELECT 'All tables dropped successfully' AS status;
