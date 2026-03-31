import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, BookOpen, Briefcase, Target, Sparkles, Save, Edit2 } from 'lucide-react';
import { supabase, getCurrentUser } from '../services/supabaseClient';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    learningPurpose: '',
    specificGoal: ''
  });
  const [saving, setSaving] = useState(false);

  const learningPurposes = [
    { value: 'school', label: 'School / University', icon: BookOpen },
    { value: 'career', label: 'Career Development / Upskilling', icon: Briefcase },
    { value: 'certification', label: 'Certification / Exam Prep', icon: Target },
  ];

  useEffect(() => {
    checkUser();
    loadUserProfile();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/');
        return;
      }
      setUser(currentUser);
    } catch (error) {
      console.error(error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      // Try to load existing profile from user_metadata
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata) {
        setProfile({
          username: user.user_metadata.username || user.email?.split('@')[0] || '',
          learningPurpose: user.user_metadata.learning_purpose || '',
          specificGoal: user.user_metadata.specific_goal || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile.username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          username: profile.username,
          learning_purpose: profile.learningPurpose,
          specific_goal: profile.specificGoal,
          profile_completed: true
        }
      });

      if (error) throw error;

      //Send data to n8n webhook
      const n8nResponse = await fetch('http://localhost:5678/webhook/profile-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
          username: profile.username,
          learningPurpose: profile.learningPurpose,
          specificGoal: profile.specificGoal,
          authProvider: user?.app_metadata?.provider || 'email', // 'google' or 'email'
          timestamp: new Date().toISOString()
        })
      });


      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const isProfileComplete = profile.username && profile.learningPurpose;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-dark-primary dark:via-dark-secondary dark:to-dark-primary">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-dark-primary/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-display font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                SomaSoma
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            You're In! 🎉
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Thanks for joining the SomaSoma waitlist! We'll reach out when v1 is ready for early access.
            Check back here for updates and sneak peeks.
          </p>
        </div>

        {/* Profile Setup Card */}
        <div className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white">
                ✨ Complete Your Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Help us personalize your learning journey
              </p>
            </div>
            {!isEditing && isProfileComplete && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {isEditing || !isProfileComplete ? (
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Username *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    placeholder="How should we call you?"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-dark-primary focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Learning Purpose */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  I'm using SomaSoma for...
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {learningPurposes.map((purpose) => {
                    const Icon = purpose.icon;
                    const isSelected = profile.learningPurpose === purpose.value;
                    return (
                      <button
                        key={purpose.value}
                        onClick={() => setProfile({ ...profile, learningPurpose: purpose.value })}
                        className={`flex items-center space-x-3 p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 ring-2 ring-pink-500'
                            : 'border-gray-300 dark:border-gray-700 hover:border-pink-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-pink-500' : 'text-gray-400'}`} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{purpose.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specific Goal */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  What are you studying for? (Optional)
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profile.specificGoal}
                    onChange={(e) => setProfile({ ...profile, specificGoal: e.target.value })}
                    placeholder="e.g., AWS Certification, Machine Learning, Data Structures..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-dark-primary focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving || !profile.username.trim()}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{profile.username}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {learningPurposes.find(p => p.value === profile.learningPurpose)?.label || 'Learning journey'}
                    {profile.specificGoal && ` • ${profile.specificGoal}`}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Thanks for sharing! We'll tailor your learning experience based on your goals.
              </p>
            </div>
          )}
        </div>

        {/* Updates Card */}
        <div className="mt-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-pink-500/5 dark:to-purple-500/5 rounded-2xl p-6 border border-pink-200 dark:border-pink-800/30">
          <div className="flex items-start space-x-4">
            <Mail className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">What's next?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We'll notify you at <strong>{user?.email}</strong> when early access opens. 
                In the meantime, follow us on social media for behind-the-scenes updates and learning tips!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;