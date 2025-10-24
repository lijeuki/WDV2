import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationCenter } from '../organisms/NotificationCenter';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'doctor' | 'front-desk' | 'clinic-pic' | 'branch-owner' | 'super-admin';
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Role-based navigation items
  const navigationItems = {
    doctor: [
      { name: 'Dashboard', path: '/doctor', icon: '🏠' },
      { name: 'Patients', path: '/doctor/patients', icon: '👥' },
      { name: 'Appointments', path: '/doctor/appointments', icon: '📅' },
      { name: 'Procedures', path: '/doctor/procedures', icon: '🦷' },
      { name: 'Reports', path: '/doctor/reports', icon: '📊' },
    ],
    'front-desk': [
      { name: 'Dashboard', path: '/front-desk', icon: '🏠' },
      { name: 'Check-In', path: '/front-desk/check-in', icon: '✅' },
      { name: 'Appointments', path: '/front-desk/appointments', icon: '📅' },
      { name: 'Patients', path: '/front-desk/patients', icon: '👥' },
      { name: 'Payments', path: '/front-desk/payments', icon: '💰' },
    ],
    'clinic-pic': [
      { name: 'Dashboard', path: '/clinic-pic', icon: '🏠' },
      { name: 'Staff', path: '/clinic-pic/staff', icon: '👨‍⚕️' },
      { name: 'Pending Treatments', path: '/clinic-pic/pending', icon: '⏰' },
      { name: 'Reports', path: '/clinic-pic/reports', icon: '📊' },
      { name: 'Settings', path: '/clinic-pic/settings', icon: '⚙️' },
    ],
    'branch-owner': [
      { name: 'Dashboard', path: '/branch-owner', icon: '🏠' },
      { name: 'Clinics', path: '/branch-owner/clinics', icon: '🏥' },
      { name: 'Analytics', path: '/branch-owner/analytics', icon: '📈' },
      { name: 'Staff', path: '/branch-owner/staff', icon: '👨‍⚕️' },
      { name: 'Reports', path: '/branch-owner/reports', icon: '📊' },
    ],
    'super-admin': [
      { name: 'Dashboard', path: '/super-admin', icon: '🏠' },
      { name: 'Branches', path: '/super-admin/branches', icon: '🏢' },
      { name: 'Users', path: '/super-admin/users', icon: '👤' },
      { name: 'System', path: '/super-admin/system', icon: '⚙️' },
    ],
  };

  const navItems = navigationItems[role] || [];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getRoleColors = () => {
    const colors = {
      doctor: {
        bg: 'bg-blue-600',
        hoverBg: 'bg-blue-50',
        text: 'text-blue-700',
      },
      'front-desk': {
        bg: 'bg-teal-600',
        hoverBg: 'bg-teal-50',
        text: 'text-teal-700',
      },
      'clinic-pic': {
        bg: 'bg-purple-600',
        hoverBg: 'bg-purple-50',
        text: 'text-purple-700',
      },
      'branch-owner': {
        bg: 'bg-indigo-600',
        hoverBg: 'bg-indigo-50',
        text: 'text-indigo-700',
      },
      'super-admin': {
        bg: 'bg-red-600',
        hoverBg: 'bg-red-50',
        text: 'text-red-700',
      },
    };
    return colors[role] || colors.doctor;
  };

  const roleColors = getRoleColors();

  const getRoleLabel = () => {
    const labels = {
      doctor: 'Doctor',
      'front-desk': 'Front Desk',
      'clinic-pic': 'Clinic Manager',
      'branch-owner': 'Branch Owner',
      'super-admin': 'Super Admin',
    };
    return labels[role] || 'User';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          {sidebarOpen ? (
            <>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${roleColors.bg} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">WD</span>
                </div>
                <div>
                  <h1 className="text-sm font-bold text-gray-900">WD Dental</h1>
                  <p className="text-xs text-gray-500">{getRoleLabel()}</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors mx-auto"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive(item.path)
                  ? `${roleColors.hoverBg} ${roleColors.text} font-medium`
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 p-4">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                DS
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Dr. Smith</p>
                <p className="text-xs text-gray-500">{getRoleLabel()}</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-3">
              DS
            </div>
          )}
          <button
            onClick={() => navigate('/login')}
            className={`w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center ${
              sidebarOpen ? 'justify-start space-x-2' : 'justify-center'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {navItems.find((item) => isActive(item.path))?.name || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <svg
                className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Notifications */}
            <NotificationCenter 
              role={role === 'front-desk' ? 'front_desk' : role === 'clinic-pic' ? 'clinic_owner' : role === 'branch-owner' ? 'branch_owner' : role === 'super-admin' ? 'walking_doctor' : 'doctor'} 
            />

            {/* Help */}
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
