// API utility functions for chatbot assessment
// This file can be expanded to include actual API calls

export const mockApiCall = async (endpoint, data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock responses based on endpoint
  switch (endpoint) {
    case '/auth/login':
      if (data.username === 'demo' && data.password === 'demo') {
        return { success: true, user: { username: data.username, id: 1 } };
      }
      throw new Error('Invalid credentials');
    
    case '/chat/messages':
      return { success: true, messages: [] };
    
    case '/chat/send':
      return { success: true, messageId: Date.now() };
    
    default:
      throw new Error('Endpoint not found');
  }
};

export const sendMessage = async (message) => {
  return mockApiCall('/chat/send', { message });
};

export const getMessages = async (chatId) => {
  return mockApiCall('/chat/messages', { chatId });
};
