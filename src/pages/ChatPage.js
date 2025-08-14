import React, { useState, useEffect, useCallback } from 'react';
import { mockNhost } from '../graphql';
import { GQL } from '../graphql';
import { useTheme } from '../context/ThemeContext';
import ChatList from '../components/ChatList';
import MessageView from '../components/MessageView';

// Dynamic theme styles
const ThemeStyles = ({ theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: '#0f172a'
  }
} }) => (
  <style>{`
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animated-gradient {
      background: linear-gradient(-45deg, ${theme.colors.primary}, ${theme.colors.secondary}, ${theme.colors.accent}, ${theme.colors.primary});
      background-size: 400% 400%;
      animation: gradient-shift 15s ease infinite;
    }
    @keyframes wave {
      0% { transform: translateX(0) scaleY(1); }
      50% { transform: translateX(-25%) scaleY(0.55); }
      100% { transform: translateX(-50%) scaleY(1); }
    }
    .wave {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 200%;
      height: 100px;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3e%3cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='${theme.colors.background.replace('#', '%23')}'/%3e%3c/svg%3e");
      background-repeat: repeat-x;
      animation: wave 10s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
      transform: translate3d(0, 0, 0);
      opacity: 0.1;
    }
    @keyframes pulse-theme {
      0%, 100% { box-shadow: 0 0 7px ${theme.colors.primary}, 0 0 12px ${theme.colors.primary}, 0 0 20px ${theme.colors.primary}; }
      50% { box-shadow: 0 0 15px ${theme.colors.accent}, 0 0 25px ${theme.colors.accent}, 0 0 45px ${theme.colors.accent}; }
    }
    .pulse-theme-anim {
      animation: pulse-theme 3s ease-in-out infinite;
    }
    @keyframes slide-fade-in {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .slide-fade-in-anim {
      animation: slide-fade-in 0.5s ease-out forwards;
    }
    @keyframes shimmer-button {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    .shimmer-button-effect {
      background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary}, ${theme.colors.accent}, ${theme.colors.primary});
      background-size: 200% auto;
      animation: shimmer-button 4s linear infinite;
    }
  `}</style>
);

export default function ChatPage({ client, onLogout }) {
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const { currentThemeData } = useTheme();
    const user = mockNhost.auth.getUser();

    // Debug logging
    console.log('Current theme data:', currentThemeData);
    console.log('Current theme colors:', currentThemeData?.colors);

    const fetchChats = useCallback(async () => {
        const { data } = await client.query(GQL.GET_CHATS_QUERY, { user_id: user.id });
        if (data && data.chats) {
            setChats(data.chats);
            if (!activeChatId && data.chats.length > 0) {
                setActiveChatId(data.chats[0].id);
            }
        }
    }, [client, user.id, activeChatId]);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    const handleCreateChat = async () => {
        const { data } = await client.mutation(GQL.CREATE_CHAT_MUTATION, { user_id: user.id });
        if (data && data.insert_chats_one) {
            const newChat = data.insert_chats_one;
            setChats(prev => [newChat, ...prev]);
            setActiveChatId(newChat.id);
        }
    };

    return (
        <div className="relative h-screen w-screen flex font-sans text-white overflow-hidden animated-gradient">
            <ThemeStyles theme={currentThemeData} />

            {/* Theme debug info and indicators removed */}
            
            <div className="wave"></div>
            <div className="wave" style={{ animationDelay: '-2s', animationDuration: '12s', opacity: 0.2 }}></div>
            <div className="wave" style={{ animationDelay: '-4s', animationDuration: '15s', opacity: 0.15 }}></div>

            {/* Main Content */}
            <div className="relative z-10 w-full md:w-1/3 lg:w-1/4 xl:w-1/5 h-full">
                <ChatList
                    chats={chats}
                    onSelectChat={setActiveChatId}
                    onCreateChat={handleCreateChat}
                    activeChatId={activeChatId}
                    onLogout={onLogout}
                />
            </div>
            <div className="relative z-10 hidden md:flex flex-col flex-grow h-full">
                <MessageView chatId={activeChatId} client={client} />
            </div>
        </div>
    );
}
