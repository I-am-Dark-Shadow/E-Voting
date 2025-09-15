import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import VotingDashboard from './pages/VotingDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Route for Login */}
      <Route path="/" element={<AuthPage />} />

      {/* Protected Route for Voters */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <VotingDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Protected Route for Admins */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;