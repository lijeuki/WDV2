import { supabase } from '../supabase/client';

export interface User {
  id: string;
  email: string;
  role: 'walking_doctor' | 'branch_owner' | 'clinic_owner' | 'doctor' | 'front_desk' | 'hygienist' | 'assistant';
  fullName: string;
  clinicId?: string;
  branchId?: string;
  walkingDoctorId?: string;
}

// Simple password hashing (for demo - in production use bcrypt)
function hashPassword(password: string): string {
  // For demo purposes - in production, use bcrypt or similar
  // This is just a simple hash to store passwords
  return btoa(password); // Base64 encoding (NOT SECURE for production)
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  try {
    return btoa(password) === hashedPassword;
  } catch {
    return false;
  }
}

// Sign in with email and password (database-only)
export async function signInWithDatabase(email: string, password: string) {
  console.log('🔑 db-auth.ts: Signing in with database auth, email:', email);
  
  try {
    // Fetch user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('employment_status', 'active')
      .maybeSingle();

    if (error) {
      console.error('❌ db-auth.ts: Database error:', error);
      throw new Error('Database error during login');
    }

    if (!user) {
      console.error('❌ db-auth.ts: User not found:', email);
      throw new Error('Invalid email or password');
    }

    console.log('✅ db-auth.ts: User found:', user.email, 'Role:', user.role);

    // Check if user has password_hash field
    if (user.password_hash) {
      // Verify password
      if (!verifyPassword(password, user.password_hash)) {
        console.error('❌ db-auth.ts: Invalid password');
        throw new Error('Invalid email or password');
      }
      console.log('✅ db-auth.ts: Password verified');
    } else {
      // No password set - for demo, allow any password
      // In production, you should require password setup first
      console.warn('⚠️ db-auth.ts: No password set for user, allowing login for demo');
    }

    // Create session data
    const sessionData = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
        clinicId: user.clinic_id,
        branchId: user.branch_id,
        walkingDoctorId: user.walking_doctor_id,
      } as User,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    // Store session in localStorage
    localStorage.setItem('dental_ehr_session', JSON.stringify(sessionData));
    
    console.log('✅ db-auth.ts: Login successful, session created');
    
    return sessionData;
  } catch (error: any) {
    console.error('❌ db-auth.ts: Login error:', error);
    throw error;
  }
}

// Get current session from localStorage
export function getDatabaseSession() {
  try {
    const sessionStr = localStorage.getItem('dental_ehr_session');
    if (!sessionStr) return null;

    const session = JSON.parse(sessionStr);
    
    // Check if session expired
    if (session.expiresAt && session.expiresAt < Date.now()) {
      localStorage.removeItem('dental_ehr_session');
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

// Get current user from session
export function getCurrentDatabaseUser(): User | null {
  const session = getDatabaseSession();
  return session?.user || null;
}

// Sign out
export function signOutFromDatabase() {
  localStorage.removeItem('dental_ehr_session');
  console.log('✅ db-auth.ts: User signed out');
}

// Update user profile
export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { error } = await supabase
    .from('users')
    .update({
      full_name: updates.fullName,
      phone: updates.fullName, // Add phone if needed
      // Add other fields as needed
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;
}

// Set password for user (for admin)
export async function setUserPassword(userId: string, newPassword: string) {
  const hashedPassword = hashPassword(newPassword);
  
  const { error } = await supabase
    .from('users')
    .update({
      password_hash: hashedPassword,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;
  
  console.log('✅ db-auth.ts: Password updated for user:', userId);
}

// Check if user exists
export async function checkUserExists(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  return !error && !!data;
}

// Get user by email
export async function getUserByEmail(email: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (error || !user) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.full_name,
    clinicId: user.clinic_id,
    branchId: user.branch_id,
    walkingDoctorId: user.walking_doctor_id,
  } as User;
}
