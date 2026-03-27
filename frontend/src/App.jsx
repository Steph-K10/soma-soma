import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

// Inner component that has access to useLocation
const AppContent = () => {
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  const lastEventRef = useRef(null);      
  const lastEventTimeRef = useRef(0);
  
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
          // Only show toast if not on landing page
          if (location.pathname !== '/') {
            toast.success('Sign-in successful');
          }
        } else if (event === 'SIGNED_OUT') {
          toast.success('Logged out successfully');
        }
        
        setIsInitialized(true);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [location.pathname]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <>
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;