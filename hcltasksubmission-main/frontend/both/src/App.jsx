import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreatePoll from './pages/CreatePoll';
import VotePoll from './pages/VotePoll';
import LiveResults from './pages/LiveResults';
import MyPolls from './pages/MyPolls';
import AdminDB from './pages/AdminDB';
import NotFound from './pages/NotFound';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
        Verifying authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Public Audience Voting & Live Stream */}
              <Route path="/poll/:code" element={<VotePoll />} />
              <Route path="/poll/:code/results" element={<LiveResults />} />

              {/* Admin & Manual MongoDB Dashboard View */}
              <Route path="/admin/db" element={<AdminDB />} />

              {/* Protected Creator Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreatePoll />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-polls"
                element={
                  <ProtectedRoute>
                    <MyPolls />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
