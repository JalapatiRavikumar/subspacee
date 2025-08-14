import React, { useState, useEffect } from 'react';
import { mockNhost } from '../graphql';
import { useTheme } from '../context/ThemeContext';
import CosmicStyles from './CosmicStyles';

// Simple Shape components for the background animation
const Shape = ({ className, color }) => <div className={`absolute block rounded-full ${className}`} style={{ backgroundColor: color }} />;

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const { currentThemeData, changeTheme } = useTheme();
  
  // Cycle through themes automatically
  useEffect(() => {
    const themes = ['default', 'cosmic', 'inferno'];
    let currentIndex = 0;
    
    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % themes.length;
      changeTheme(themes[currentIndex]);
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [changeTheme]);
  
  // Load registered users from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('registered_users');
    if (storedUsers) {
      setRegisteredUsers(JSON.parse(storedUsers));
    }
  }, []);

  // Debug logging
  console.log('AuthPage theme data:', currentThemeData);
  console.log('AuthPage theme colors:', currentThemeData?.colors);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (isLogin) {
      // Check if user exists in registered users
      const userExists = registeredUsers.some(user => user.email === email);
      
      if (!userExists) {
        setLoading(false);
        setError('Account not found. Please sign up first.');
        return;
      }
      
      const { error: authError } = await mockNhost.auth.signIn({ email, password });
      setLoading(false);
      
      if (authError) {
        setError(authError.message);
      } else {
        onLogin();
      }
    } else {
      // Sign up process
      const { error: authError } = await mockNhost.auth.signUp({ email, password });
      setLoading(false);
      
      if (authError) {
        setError(authError.message);
      } else {
        // Add user to registered users
        const newUsers = [...registeredUsers, { email, password }];
        setRegisteredUsers(newUsers);
        localStorage.setItem('registered_users', JSON.stringify(newUsers));
        onLogin();
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden aurora-bg pulse-glow-anim">
      <CosmicStyles />
      {/* Animated Shapes with theme colors */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Shape className="w-48 h-48 top-1/4 left-1/4 float-anim" color={`${currentThemeData.colors.primary}40`} />
        <Shape className="w-24 h-24 top-1/2 left-2/3 float-anim" style={{ animationDelay: '1s' }} color={`${currentThemeData.colors.secondary}40`} />
        <Shape className="w-36 h-36 bottom-1/4 right-1/4 float-anim" style={{ animationDelay: '2s' }} color={`${currentThemeData.colors.accent}40`} />
        <Shape className="w-20 h-20 bottom-10 left-10 rotate-3d-anim" color={`${currentThemeData.colors.primary}40`} />
        <Shape className="w-28 h-28 top-10 right-10 rotate-3d-anim" style={{ animationDelay: '3s' }} color={`${currentThemeData.colors.secondary}40`} />
      </div>

      {/* 3D Tilt Form Card Container */}
      <div className="group [perspective:1000px] slide-in-anim">
        <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl border-glow-anim transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)_rotateX(5deg)]">
          <h2 className="text-3xl font-bold text-center color-cycle-anim" 
              style={{ textShadow: `0 0 15px ${currentThemeData.colors.primary}, 0 0 25px ${currentThemeData.colors.secondary}` }}>
            {isLogin ? 'Enter the Cosmos' : 'Join the Nebula'}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-slate-200">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 mt-1 text-white bg-black/30 border-2 rounded-lg shadow-inner focus:outline-none focus:ring-2 placeholder:text-slate-400 transition-all"
                style={{ 
                  borderColor: currentThemeData.colors.primary,
                  '--tw-ring-color': currentThemeData.colors.primary
                }}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 mt-1 text-white bg-black/30 border-2 rounded-lg shadow-inner focus:outline-none focus:ring-2 placeholder:text-slate-400 transition-all"
                style={{ 
                  borderColor: currentThemeData.colors.primary,
                  '--tw-ring-color': currentThemeData.colors.primary
                }}
              />
            </div>
            {error && <p className="text-sm font-semibold text-red-400">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 text-lg font-bold text-white border border-transparent rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 transition-all transform hover:scale-105 pulse-glow-anim"
                style={{
                  background: `linear-gradient(135deg, ${currentThemeData.colors.primary}, ${currentThemeData.colors.secondary})`,
                  backgroundSize: '200% 200%',
                  animation: 'move-aurora 5s ease infinite'
                }}
              >
                {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </div>
          </form>
          <p className="text-sm text-center text-slate-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="ml-1 font-bold hover:underline transition-colors"
              style={{ color: currentThemeData.colors.accent }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
