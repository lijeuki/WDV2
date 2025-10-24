import { useState } from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const supabaseConfigured = isSupabaseConfigured();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (supabaseConfigured) {
        // Real authentication
        console.log('🔐 Attempting login with Supabase...');
        await signIn(email, password);
        console.log('✅ Login successful');
        // Note: navigation happens in AuthContext after successful login
      } else {
        // Demo mode fallback
        console.warn('🔶 Demo mode: Supabase not configured');
        if (email.includes('doctor')) {
          navigate('/doctor');
        } else if (email.includes('desk') || email.includes('front')) {
          navigate('/front-desk');
        } else {
          navigate('/doctor');
        }
        setLoading(false);
      }
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">WD Dental</h1>
          <p className="text-gray-600 mt-2">Electronic Health Records System</p>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="doctor@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          
          {!supabaseConfigured && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
              ⚠️ Demo Mode: Supabase not configured
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs font-semibold text-gray-700 mb-2">
            {supabaseConfigured ? 'Demo Accounts (Setup Required):' : 'Demo Accounts:'}
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>👨‍⚕️ Doctor: <span className="font-mono">doctor@clinic.com</span></div>
            <div>💼 Front Desk: <span className="font-mono">desk@clinic.com</span></div>
            {supabaseConfigured && (
              <>
                <div className="text-gray-400 text-xs mt-2 pt-2 border-t border-gray-200">
                  More roles available (see AUTHENTICATION_SETUP.md):
                </div>
                <div className="text-gray-400">🏥 Walking Doctor, Branch Owner, Clinic Owner</div>
              </>
            )}
            <div className="text-gray-500 mt-2">
              {supabaseConfigured 
                ? 'See AUTHENTICATION_SETUP.md for setup instructions' 
                : 'Password: any (demo mode)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
