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
import PageTransition from '../components/PageTransition';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
      <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

      <Route
        path="/mentee-dashboard"
        element={
          <ProtectedRoute allowedRoles={['MENTEE']}>
            <PageTransition><MenteeDashboard /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="/mentor-dashboard"
        element={
          <ProtectedRoute allowedRoles={['MENTOR']}>
            <PageTransition><MentorDashboard /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PageTransition><AdminDashboard /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <PageTransition><ChatPage /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
