import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, Mail } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import Logo from '../components/Logo';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      console.log('All URL params:', Object.fromEntries(searchParams));

      const token = searchParams.get('token_hash');
      const type = searchParams.get('type');

      console.log('Token:', token, 'Type:', type);

      if (!token || type !== 'signup') {
        setStatus('error');
        setMessage('Invalid verification link. Please request a new one.');
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup',
        });

        if (error) throw error;

        setStatus('success');
        setMessage('Email verified successfully! Redirecting to dashboard...');
        
        // Add to waitlist after verification
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          await supabase.from('waitlist').upsert({
            email: user.email,
            is_verified: true,
          });
        }
        
        // Auto-redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
        
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error.message || 'Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-dark-primary dark:via-dark-secondary dark:to-dark-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <Logo className="w-16 h-16" />
        </div>
        
        {status === 'verifying' && (
          <>
            <Loader className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">Verifying Your Email</h2>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we confirm your email address...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">Email Verified! 🎉</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">You will be redirected automatically.</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">Verification Failed</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition w-full justify-center"
              >
                <span>Back to Home</span>
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center space-x-2 px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg transition w-full justify-center"
              >
                <Mail className="w-4 h-4" />
                <span>Request New Link</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;