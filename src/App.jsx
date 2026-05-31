import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import supabase from './supabase'; // Assuming supabase client is exported from './supabase'

// Import pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard'; // Import AdminDashboard

// ProtectedRoute component to enforce role-based access
function ProtectedRoute({ children, requiredRole }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Needed for redirection if role check fails

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      if (error) {
        console.error("Error fetching session:", error);
      }
    };
    getSession();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // If still loading, show a loading indicator
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
  }

  // If no session, redirect to login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Check for required role
  const userRole = localStorage.getItem('userRole');
  if (requiredRole && userRole !== requiredRole) {
    // If role doesn't match, redirect to login to allow user to choose role again or handle appropriately
    // The user's prompt implies redirecting to login is the desired behavior here
    return <Navigate to="/login" replace />;
  }

  // If session exists and role matches (or no role is required), render children
  return children;
}


function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* Teacher Dashboard Route */}
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Student Dashboard Route */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard Route */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback or Catch-all Route - optional, could redirect to login or home */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}

export default App;
