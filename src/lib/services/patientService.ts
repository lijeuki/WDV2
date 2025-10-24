import { supabase } from '../supabase/client';

export interface Patient {
  id: string;
  clinicId: string;
  walkingDoctorId?: string;
  patientRecordNumber: string;
  
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  gender?: 'male' | 'female' | 'other';
  ktpNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  
  // Medical Information
  bloodType?: string;
  allergies?: string[];
  medicalConditions?: string[];
  currentMedications?: string[];
  
  // Insurance
  insuranceProvider?: string;
  insuranceNumber?: string;
  insuranceExpiry?: string;
  
  // Metadata
  registrationDate: string;
  lastVisitDate?: string;
  totalVisits: number;
  status: 'active' | 'inactive' | 'deceased';
  
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientInput {
  clinicId: string;
  fullName: string;
  dateOfBirth: string;
  gender?: string;
  ktpNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  bloodType?: string;
  allergies?: string[];
  medicalConditions?: string[];
  insuranceProvider?: string;
  insuranceNumber?: string;
}

// Generate unique patient record number
function generatePatientRecordNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `PRN-${timestamp}-${random}`.toUpperCase();
}

// Get all patients for a clinic
export async function getPatients(clinicId: string): Promise<Patient[]> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('clinic_id', clinicId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get patient by ID
export async function getPatientById(patientId: string): Promise<Patient | null> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single();

  if (error) {
    console.error('Error fetching patient:', error);
    return null;
  }
  
  return data;
}

// Search patients
export async function searchPatients(clinicId: string, query: string): Promise<Patient[]> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('clinic_id', clinicId)
    .or(`full_name.ilike.%${query}%,phone.ilike.%${query}%,patient_record_number.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Create new patient
export async function createPatient(input: CreatePatientInput): Promise<Patient> {
  const patientRecordNumber = generatePatientRecordNumber();
  
  const { data, error } = await supabase
    .from('patients')
    .insert({
      clinic_id: input.clinicId,
      patient_record_number: patientRecordNumber,
      full_name: input.fullName,
      date_of_birth: input.dateOfBirth,
      gender: input.gender,
      ktp_number: input.ktpNumber,
      phone: input.phone,
      email: input.email,
      address: input.address,
      city: input.city,
      province: input.province,
      postal_code: input.postalCode,
      blood_type: input.bloodType,
      allergies: input.allergies,
      medical_conditions: input.medicalConditions,
      insurance_provider: input.insuranceProvider,
      insurance_number: input.insuranceNumber,
      status: 'active',
      total_visits: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update patient
export async function updatePatient(patientId: string, updates: Partial<Patient>): Promise<Patient> {
  const { data, error } = await supabase
    .from('patients')
    .update({
      full_name: updates.fullName,
      date_of_birth: updates.dateOfBirth,
      gender: updates.gender,
      ktp_number: updates.ktpNumber,
      phone: updates.phone,
      email: updates.email,
      address: updates.address,
      city: updates.city,
      province: updates.province,
      postal_code: updates.postalCode,
      blood_type: updates.bloodType,
      allergies: updates.allergies,
      medical_conditions: updates.medicalConditions,
      current_medications: updates.currentMedications,
      insurance_provider: updates.insuranceProvider,
      insurance_number: updates.insuranceNumber,
      insurance_expiry: updates.insuranceExpiry,
      emergency_contact_name: updates.emergencyContactName,
      emergency_contact_phone: updates.emergencyContactPhone,
      emergency_contact_relationship: updates.emergencyContactRelationship,
    })
    .eq('id', patientId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete patient (soft delete - set status to inactive)
export async function deletePatient(patientId: string): Promise<void> {
  const { error } = await supabase
    .from('patients')
    .update({ status: 'inactive' })
    .eq('id', patientId);

  if (error) throw error;
}

// Get patient statistics
export async function getPatientStats(clinicId: string) {
  const { data: patients, error } = await supabase
    .from('patients')
    .select('status, total_visits')
    .eq('clinic_id', clinicId);

  if (error) throw error;

  const total = patients?.length || 0;
  const active = patients?.filter(p => p.status === 'active').length || 0;
  const inactive = patients?.filter(p => p.status === 'inactive').length || 0;
  const totalVisits = patients?.reduce((sum, p) => sum + (p.total_visits || 0), 0) || 0;

  return {
    total,
    active,
    inactive,
    totalVisits,
    averageVisitsPerPatient: total > 0 ? (totalVisits / total).toFixed(1) : '0',
  };
}

// Get recent patients
export async function getRecentPatients(clinicId: string, limit: number = 10): Promise<Patient[]> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('status', 'active')
    .order('last_visit_date', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Update last visit date
export async function updateLastVisit(patientId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_patient_visits', {
    patient_id: patientId,
  });

  if (error) {
    // Fallback if function doesn't exist - fetch current value first
    const { data: patient } = await supabase
      .from('patients')
      .select('total_visits')
      .eq('id', patientId)
      .single();

    const { error: updateError } = await supabase
      .from('patients')
      .update({
        last_visit_date: new Date().toISOString().split('T')[0],
        total_visits: (patient?.total_visits || 0) + 1,
      })
      .eq('id', patientId);

    if (updateError) throw updateError;
  }
}
