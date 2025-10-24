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

// Sign in with email and password
export async function signIn(email: string, password: string) {
  console.log('🔑 auth.ts: Signing in with email:', email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('❌ auth.ts: Supabase auth error:', error);
    throw error;
  }

  console.log('✅ auth.ts: Auth successful, fetching user profile...');

  // Get user profile from users table
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', data.user.id)
    .maybeSingle();

  if (profileError) {
    console.error('❌ auth.ts: Profile fetch error:', profileError);
    throw profileError;
  }
  
  // If no profile exists, throw error
  if (!profile) {
    console.error('❌ auth.ts: No profile found for auth_id:', data.user.id);
    throw new Error('User profile not found. Please link your account in the database. See AUTHENTICATION_SETUP.md');
  }

  console.log('✅ auth.ts: Profile found:', profile.email, 'Role:', profile.role);

  return {
    session: data.session,
    user: {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      fullName: profile.full_name,
      clinicId: profile.clinic_id,
      branchId: profile.branch_id,
      walkingDoctorId: profile.walking_doctor_id,
    } as User,
  };
}

// Sign up new user
export async function signUp(email: string, password: string, userData: Partial<User>) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error('User creation failed');

  // Create user profile
  const { error: profileError } = await supabase
    .from('users')
    .insert({
      auth_id: data.user.id,
      email: email,
      full_name: userData.fullName,
      role: userData.role,
      clinic_id: userData.clinicId,
      branch_id: userData.branchId,
      walking_doctor_id: userData.walkingDoctorId,
    });

  if (profileError) throw profileError;

  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current session
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', session.user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  if (!profile) {
    console.error('User profile not found in database');
    return null;
  }

  return {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    fullName: profile.full_name,
    clinicId: profile.clinic_id,
    branchId: profile.branch_id,
    walkingDoctorId: profile.walking_doctor_id,
  };
}

// Listen to auth changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      const user = await getCurrentUser();
      callback(user);
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });
}

// Password reset
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

// Update password
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
}
