import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from './pages/auth/Login';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { PatientList } from './pages/doctor/PatientList';
import { FrontDeskDashboard } from './pages/front-desk/FrontDeskDashboard';

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
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Doctor Routes */}
          <Route path="/doctor">
            <Route index element={<DoctorDashboard />} />
            <Route path="patients" element={<PatientList />} />
          </Route>
          
          {/* Front Desk Routes */}
          <Route path="/front-desk">
            <Route index element={<FrontDeskDashboard />} />
          </Route>
          
          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
