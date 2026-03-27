import React, { useEffect, useState, useRef } from 'react';  // ← Added useRef
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import VerifyEmail from './pages/VerifyEmail';
import { supabase } from './services/supabaseClient';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);
  
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const lastEventRef = useRef(null);      // ← Added this
  const lastEventTimeRef = useRef(0);     // ← Added this
  
  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);

        const now = Date.now();
        const eventKey = `${event}-${session?.user?.email || 'no-user'}`;
        
        // Prevent duplicate events within 2 seconds
        if (lastEventRef.current === eventKey && (now - lastEventTimeRef.current) < 2000) {
          console.log('Skipping duplicate event:', event);
          return;
        }
        
        lastEventRef.current = eventKey;
        lastEventTimeRef.current = now;
        
        if (event === 'SIGNED_IN') {
          // Show success toast only
          toast.success('Sign-in successful');
          // Let the ProtectedRoute handle navigation
        } else if (event === 'SIGNED_OUT') {
          toast.success('Logged out successfully');
        }
        
        setIsInitialized(true);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
              color: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Routes (require authentication) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;