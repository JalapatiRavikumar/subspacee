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

  useEffect(() => {
    // FIX: Correctly call the function on the 'auth' object 
    mockNhost.auth.onAuthStateChanged((isAuth) => { 
      setIsAuthenticated(isAuth); 
      if (isAuth) { 
        setClient(new MockGraphQLClient()); 
      } else { 
        setClient(null); 
      } 
    }); 
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
      {!isAuthenticated ? (
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
