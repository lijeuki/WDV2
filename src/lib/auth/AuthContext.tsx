import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getCurrentUser, onAuthStateChange, signIn as authSignIn, signOut as authSignOut } from './auth';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Listen for auth changes
    const { data } = onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      data?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('📝 AuthContext: Calling authSignIn...');
      const { user: signedInUser } = await authSignIn(email, password);
      console.log('✅ AuthContext: Got user:', signedInUser.email, 'Role:', signedInUser.role);
      setUser(signedInUser);
      
      // Redirect based on role
      if (signedInUser.role === 'doctor') {
        console.log('🏥 Navigating to /doctor');
        navigate('/doctor');
      } else if (signedInUser.role === 'front_desk') {
        console.log('💼 Navigating to /front-desk');
        navigate('/front-desk');
      } else if (signedInUser.role === 'clinic_owner') {
        console.log('🏪 Navigating to /clinic/dashboard');
        navigate('/clinic/dashboard');
      } else if (signedInUser.role === 'branch_owner') {
        console.log('🏢 Navigating to /branch/dashboard');
        navigate('/branch/dashboard');
      } else if (signedInUser.role === 'walking_doctor') {
        console.log('🏥 Navigating to /walking-doctor/dashboard');
        navigate('/walking-doctor/dashboard');
      } else {
        console.log('🔄 Unknown role, navigating to /doctor (default)');
        navigate('/doctor'); // Default
      }
    } catch (error) {
      console.error('❌ AuthContext signIn error:', error);
      throw error; // Re-throw so Login component can catch it
    }
  };

  const signOut = async () => {
    await authSignOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
