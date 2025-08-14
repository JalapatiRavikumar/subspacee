import React, { useState, useEffect } from 'react';
import { mockNhost, MockGraphQLClient } from './graphql';
import { ThemeProvider } from './context/ThemeContext';
import AuthPage from './components/AuthPage';
import ChatPage from './pages/ChatPage';
import CosmicStyles from './components/CosmicStyles';

// Using imported CosmicStyles component

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize authentication state
    try {
      // FIX: Correctly call the function on the 'auth' object 
      mockNhost.auth.onAuthStateChanged((isAuth) => { 
        console.log('Auth state changed:', isAuth);
        setIsAuthenticated(isAuth); 
        if (isAuth) { 
          setClient(new MockGraphQLClient()); 
        } else { 
          setClient(null); 
        } 
        setIsLoading(false);
      }); 
    } catch (error) {
      console.error('Authentication error:', error);
      setIsLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    await mockNhost.auth.signOut();
    setIsAuthenticated(false);
    setClient(null);
    // Clear the mock DB on logout for a clean slate
    localStorage.removeItem('mock_db_chats');
    localStorage.removeItem('mock_db_messages');
  };

  return (
    <ThemeProvider>
      <CosmicStyles />
      {isLoading ? (
        <div className="flex items-center justify-center h-screen bg-slate-900">
          <div className="text-white text-xl">Loading application...</div>
        </div>
      ) : !isAuthenticated ? (
        <AuthPage onLogin={() => {
          setIsAuthenticated(true);
          setClient(new MockGraphQLClient());
        }} />
      ) : (
        <ChatPage client={client} onLogout={handleLogout} />
      )}
    </ThemeProvider>
  );
}
