import React from 'react';
import { mockNhost } from '../graphql';
import { PlusIcon, LogoutIcon } from '../icons';
import { useTheme } from '../context/ThemeContext';
import CosmicStyles from './CosmicStyles';

export default function ChatList({ chats, onSelectChat, onCreateChat, activeChatId, onLogout }) {
    const user = mockNhost.auth.getUser();
    // Removed unused variable
    useTheme();
    
    return (
        <div className="flex flex-col h-full bg-black/50 backdrop-blur-xl border-r border-cyan-300/20">
            <CosmicStyles />
            <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-black dark:text-white">Chats</h2>
                <button
                    onClick={onCreateChat}
                    className="p-2 text-gray-800 rounded-full hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-700"
                    title="New Chat"
                >
                    <PlusIcon />
                </button>
            </div>
            <div className="flex-grow overflow-y-auto">
                {chats.map(chat => (
                    <div
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={`relative p-4 cursor-pointer border-l-4 ${
                            activeChatId === chat.id
                                ? 'border-purple-500 bg-purple-900/60 pulse-glow-anim'
                                : 'border-transparent hover:bg-white/10'
                        }`}
                    >
                        <p className={`font-semibold truncate ${activeChatId === chat.id ? 'text-white' : 'text-black dark:text-gray-200'}`}>{chat.title}</p>
                        <p className={`text-xs ${activeChatId === chat.id ? 'text-indigo-200' : 'text-gray-600 dark:text-gray-400'}`}>
                            {new Date(chat.created_at).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-300 dark:border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-800 dark:text-gray-300 truncate">
                    {user?.email}
                </div>
                <button onClick={onLogout} className="p-2 text-gray-700 rounded-full hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-700" title="Logout">
                    <LogoutIcon />
                </button>
            </div>
        </div>
    );
}
