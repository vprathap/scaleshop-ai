import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing    from './pages/Landing';
import Login      from './pages/Login';
import Dashboard  from './pages/Dashboard';
import Admin      from './pages/Admin';
import IPOTracker from './pages/IPOTracker';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"      element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Protected — any logged-in user */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/ipo" element={
            <ProtectedRoute><IPOTracker /></ProtectedRoute>
          } />

          {/* Protected — admin only */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
