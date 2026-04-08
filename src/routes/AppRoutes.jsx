import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MenteeDashboard from '../pages/mentee/MenteeDashboard';
import MentorDashboard from '../pages/mentor/MentorDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ChatPage from '../pages/chat/ChatPage';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/mentee-dashboard"
        element={
          <ProtectedRoute allowedRoles={['MENTEE']}>
            <MenteeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mentor-dashboard"
        element={
          <ProtectedRoute allowedRoles={['MENTOR']}>
            <MentorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
