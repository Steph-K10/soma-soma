import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Calendar, Brain, Users, Award, TrendingUp, MessageCircle, Sparkles } from 'lucide-react';
import { supabase, getCurrentUser } from '../services/supabaseClient';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    studyStreak: 0,
    badgesEarned: 0,
    studyGroups: 0,
    aiSessions: 0
  });

  useEffect(() => {
    checkUser();
    fetchUserStats();
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

  const fetchUserStats = async () => {
    // This would fetch real data from your database
    // For now, we'll use placeholder data
    setStats({
      studyStreak: 3,
      badgesEarned: 2,
      studyGroups: 1,
      aiSessions: 12
    });
  };

  const handleLogout = async () => {
    try {
        console.log('Attempting to sign out...');
        const { error } = await supabase.auth.signOut();
        
        if (error) {
        console.error('SignOut error details:', error);
        toast.error(`Logout failed: ${error.message}`);
        return;
        }
        
        console.log('Sign out successful');
        toast.success('Logged out successfully');
        navigate('/');
    } catch (error) {
        console.error('Unexpected logout error:', error);
        toast.error('Logout failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const statCards = [
    { icon: TrendingUp, label: 'Study Streak', value: `${stats.studyStreak} days`, color: 'from-orange-500 to-red-500' },
    { icon: Award, label: 'Badges Earned', value: stats.badgesEarned, color: 'from-yellow-500 to-amber-500' },
    { icon: Users, label: 'Study Groups', value: stats.studyGroups, color: 'from-blue-500 to-cyan-500' },
    { icon: Brain, label: 'AI Sessions', value: stats.aiSessions, color: 'from-purple-500 to-pink-500' },
  ];

  const recentActivities = [
    { icon: Brain, title: 'AI Study Session', description: 'Reviewed Machine Learning concepts', time: '2 hours ago', color: 'text-purple-500' },
    { icon: Users, title: 'Group Study', description: 'Joined "ML Study Group"', time: 'Yesterday', color: 'text-blue-500' },
    { icon: Award, title: 'Badge Earned', description: 'Unlocked "Early Bird" badge', time: '3 days ago', color: 'text-yellow-500' },
    { icon: MessageCircle, title: 'Telegram Reminder', description: 'Study plan generated for tomorrow', time: '5 days ago', color: 'text-green-500' },
  ];

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.user_metadata?.username || user?.email?.split('@')[0]}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Ready to learn something new today? Your AI study partner is here to help.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Day {stats.studyStreak} streak! 🔥</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-display font-semibold mb-4 text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <div className={`${activity.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-display font-semibold mb-4 text-gray-900 dark:text-white">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg transition transform hover:scale-[1.02]">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5" />
                  <span className="font-medium">Start AI Study Session</span>
                </div>
                <span>→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Find Study Partners</span>
                </div>
                <span className="text-gray-500">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Generate Study Plan</span>
                </div>
                <span className="text-gray-500">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Connect Telegram Bot</span>
                </div>
                <span className="text-gray-500">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="mt-8 bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-pink-500/5 dark:to-purple-500/5 rounded-2xl p-6 border border-pink-200 dark:border-pink-800/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-pink-500" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">More features coming soon!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Study groups, badge system, and Telegram integration are on the way.</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm hover:shadow-lg transition">
              Join Waitlist for Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;