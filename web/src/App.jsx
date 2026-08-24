import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BloodRequestPage from './pages/patient/BloodRequestPage';
import MyRequestsPage from './pages/patient/MyRequestsPage';

// Hospital Pages
import HospitalDashboard from './pages/hospital/DashboardPage';
import HospitalRequests from './pages/hospital/RequestsPage';
import HospitalRequestDetail from './pages/hospital/RequestDetailPage';

// Blood Bank Pages
import BloodBankDashboard from './pages/bloodBank/DashboardPage';
import InventoryPage from './pages/bloodBank/InventoryPage';
import DonationsPage from './pages/bloodBank/DonationsPage';
import ReservationsPage from './pages/bloodBank/ReservationsPage';

// Admin Pages
import AdminDashboard from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import AdminRequestsPage from './pages/admin/RequestsPage';
import AdminInventoryPage from './pages/admin/InventoryPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Patient Portal */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/request" element={<BloodRequestPage />} />
        <Route path="/patient/my-requests" element={<MyRequestsPage />} />
        <Route path="/patient/track" element={<MyRequestsPage />} />
        <Route path="/patient/profile" element={<PatientDashboard />} />

        {/* Hospital Portal */}
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/requests" element={<HospitalRequests />} />
        <Route path="/hospital/requests/:id" element={<HospitalRequestDetail />} />

        {/* Blood Bank Portal */}
        <Route path="/blood-bank/dashboard" element={<BloodBankDashboard />} />
        <Route path="/blood-bank/inventory" element={<InventoryPage />} />
        <Route path="/blood-bank/donations" element={<DonationsPage />} />
        <Route path="/blood-bank/reservations" element={<ReservationsPage />} />

        {/* Admin Portal */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/requests" element={<AdminRequestsPage />} />
        <Route path="/admin/inventory" element={<AdminInventoryPage />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
