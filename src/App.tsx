import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './lib/auth/AuthContext';
import { Login } from './pages/auth/Login';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { PatientList } from './pages/doctor/PatientList';
import { PatientDetail } from './pages/doctor/PatientDetail';
import { Appointments as DoctorAppointments } from './pages/doctor/Appointments';
import SmartExam from './pages/doctor/SmartExam';
import TreatmentPlanBuilder from './pages/doctor/TreatmentPlanBuilder';
import NewPatient from './pages/doctor/NewPatient';
import { FrontDeskDashboard } from './pages/front-desk/FrontDeskDashboard';
import PostExamCheckout from './pages/front-desk/PostExamCheckout';
import CheckIn from './pages/front-desk/CheckIn';
import Appointments from './pages/front-desk/Appointments';
import Payments from './pages/front-desk/Payments';
import ClinicDashboard from './pages/clinic/ClinicDashboard';
import StaffManagement from './pages/clinic/StaffManagement';
import InventoryManagement from './pages/clinic/InventoryManagement';
import BranchDashboard from './pages/branch/BranchDashboard';
import WalkingDoctorDashboard from './pages/walking-doctor/WalkingDoctorDashboard';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Doctor Routes */}
          <Route path="/doctor">
            <Route index element={<DoctorDashboard />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="patients/new" element={<NewPatient />} />
            <Route path="patients/:patientId" element={<PatientDetail />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="exam/:patientId" element={<SmartExam />} />
            <Route path="treatment-plan/new/:patientId" element={<TreatmentPlanBuilder />} />
          </Route>
          
          {/* Front Desk Routes */}
          <Route path="/front-desk">
            <Route index element={<FrontDeskDashboard />} />
            <Route path="check-in" element={<CheckIn />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="payments" element={<Payments />} />
          </Route>
          
          {/* Clinic Owner Routes */}
          <Route path="/clinic">
            <Route path="dashboard" element={<ClinicDashboard />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="inventory" element={<InventoryManagement />} />
          </Route>
          
          {/* Branch Owner Routes */}
          <Route path="/branch">
            <Route path="dashboard" element={<BranchDashboard />} />
          </Route>
          
          {/* Walking Doctor Routes */}
          <Route path="/walking-doctor">
            <Route path="dashboard" element={<WalkingDoctorDashboard />} />
          </Route>
          
          {/* Checkout Routes (accessible by both roles) */}
          <Route path="/checkout/:patientId" element={<PostExamCheckout />} />
          
          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
