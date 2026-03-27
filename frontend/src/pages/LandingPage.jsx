import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Sparkles, 
  Users, 
  Brain, 
  Calendar, 
  ChevronRight,
  Moon,
  Sun,
  LogIn,
  UserPlus,
  MessageCircle,
  Award,
  TrendingUp,
  Zap
} from 'lucide-react';
import Logo from '../components/Logo';
import AuthModal from '../components/AuthModal';

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const features = [
    {
      icon: Brain,
      title: "AI Study Partner",
      description: "Your personal Feynman-teacher that helps you truly understand concepts through active recall."
    },
    {
      icon: Users,
      title: "Smart Study Groups",
      description: "Connect with peers who complement your learning style and share your goals."
    },
    {
      icon: MessageCircle,
      title: "Telegram Integration",
      description: "Get reminders, quick summaries, and study tips right in your favorite messenger."
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered study plans that adapt to your calendar and learning pace."
    },
    {
      icon: Award,
      title: "Badge System",
      description: "Earn recognition for consistency, mastery, and helping your study buddies."
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Visual insights into your learning journey and areas for improvement."
    }
  ];

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50'
    }`}>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/80 dark:bg-dark-primary/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Logo className="w-8 h-8" variant={darkMode ? "dark" : "light"} />
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                SomaSoma
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/ S²</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition">Features</a>
              <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition">How It Works</a>
              <a href="#community" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition">Community</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
              </button>
              
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
              
              <button
                onClick={() => openAuthModal('signup')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg transition transform hover:scale-105"
              >
                <UserPlus className="w-4 h-4" />
                <span>Join Waitlist</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative pt-32 pb-20 px-4 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Coming Soon</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Study Smarter,
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Get it right. Every time.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Meet your AI study partner that grows with you. Learn actively, connect with peers, 
              and transform how you understand complex topics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openAuthModal('signup')}
                className="group px-8 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Join the Waitlist</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
              
              <button
                onClick={() => openAuthModal('login')}
                className="px-8 py-3 rounded-lg border-2 border-pink-500 text-pink-600 dark:text-pink-400 font-semibold hover:bg-pink-50 dark:hover:bg-pink-900/20 transition"
              >
                Log In
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Features That Make Learning Magical
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 rounded-2xl bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default LandingPage;