import React, { useState, useEffect, useRef } from 'react';
import { GQL } from '../graphql';
import { SendIcon, BotIcon, UserIcon } from '../icons';

export default function MessageView({ chatId, client }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!chatId) return;

        setMessages([]); // Clear previous messages
        
        const subscription = client.subscribe(
            GQL.MESSAGES_SUBSCRIPTION,
            { chat_id: chatId },
            (response) => {
                if (response.data) {
                    setMessages(response.data.messages);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [chatId, client]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatId) return;

        const content = newMessage.trim();
        setNewMessage('');
        
        // Optimistic update (optional but good for UX)
        const optimisticMessage = {
            id: `temp_${Date.now()}`,
            content,
            role: 'user',
            created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, optimisticMessage]);

        await client.mutation(GQL.SEND_MESSAGE_MUTATION, {
            chat_id: chatId,
            content: content,
        });
    };

    if (!chatId) {
        return (
            <div className="flex items-center justify-center h-full text-gray-600 dark:text-gray-400 bg-white dark:bg-black">
                Select a chat to start messaging
            </div>
        );
    }

    return (
        // High-contrast message view background
        <div className="flex flex-col h-full bg-white dark:bg-black">
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center dark:bg-gray-700"><BotIcon /></div>}
                            <div className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md lg:max-w-2xl ${
                                // High-contrast message bubbles
                                msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-gray-200 text-black rounded-bl-none dark:bg-gray-800 dark:text-white'
                            }`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center"><UserIcon /></div>}
                        </div>
                    ))}
                </div>
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-300 dark:border-gray-800">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        // High-contrast input
                        className="w-full px-4 py-2 text-black bg-white border border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-500 dark:text-white"
                    />
                    <button type="submit" className="p-3 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400" disabled={!newMessage.trim()}>
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
}
