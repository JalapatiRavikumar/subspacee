// --- MOCKED NHOST AUTHENTICATION ---
// This object simulates the Nhost auth client.
export const mockNhost = {
  auth: {
    // In a real app, this would make a network request.
    signUp: async ({ email, password }) => {
      if (!email || !password) {
        return { user: null, error: { message: 'Email and password are required.' } };
      }
      const newUser = { id: `user_${Date.now()}`, email, role: 'user' };
      try {
        localStorage.setItem('mock_user', JSON.stringify(newUser));
        localStorage.setItem('mock_jwt', `mock_jwt_for_${newUser.id}`);
      } catch (e) {
        console.error('LocalStorage error:', e);
        // Fallback for environments without localStorage (like SSR)
        window.mock_user = newUser;
        window.mock_jwt = `mock_jwt_for_${newUser.id}`;
      }
      return { user: newUser, session: { accessToken: `mock_jwt_for_${newUser.id}` }, error: null };
    },
    signIn: async ({ email }) => {
        // Simplified sign-in for this mock
        const existingUser = { id: `user_12345`, email, role: 'user' };
        try {
          localStorage.setItem('mock_user', JSON.stringify(existingUser));
          localStorage.setItem('mock_jwt', `mock_jwt_for_${existingUser.id}`);
        } catch (e) {
          console.error('LocalStorage error:', e);
          // Fallback for environments without localStorage (like SSR)
          window.mock_user = existingUser;
          window.mock_jwt = `mock_jwt_for_${existingUser.id}`;
        }
        return { user: existingUser, session: { accessToken: `mock_jwt_for_${existingUser.id}` }, error: null };
    },
    // In a real app, this clears the session.
    signOut: async () => {
      try {
        localStorage.removeItem('mock_user');
        localStorage.removeItem('mock_jwt');
      } catch (e) {
        console.error('LocalStorage error:', e);
        // Fallback for environments without localStorage (like SSR)
        delete window.mock_user;
        delete window.mock_jwt;
      }
      return { error: null };
    },
    // This function simulates checking the auth state on app load.
    onAuthStateChanged: (callback) => {
      let user, token;
      try {
        user = JSON.parse(localStorage.getItem('mock_user'));
        token = localStorage.getItem('mock_jwt');
      } catch (e) {
        console.error('LocalStorage error:', e);
        // Fallback for environments without localStorage (like SSR)
        user = window.mock_user;
        token = window.mock_jwt;
      }
      
      // For Vercel deployment, auto-authenticate for demo purposes
      if (!user || !token) {
        const demoUser = { id: 'demo_user', email: 'demo@example.com', role: 'user' };
        try {
          localStorage.setItem('mock_user', JSON.stringify(demoUser));
          localStorage.setItem('mock_jwt', 'demo_token');
        } catch (e) {
          console.error('LocalStorage error:', e);
          window.mock_user = demoUser;
          window.mock_jwt = 'demo_token';
        }
        user = demoUser;
        token = 'demo_token';
      }
      
      if (user && token) {
        callback(true, { accessToken: token });
      } else {
        callback(false, null);
      }
      // This is a dummy unsubscribe function.
      return { unsubscribe: () => {} };
    },
    getUser: () => {
        try {
          return JSON.parse(localStorage.getItem('mock_user'));
        } catch (e) {
          console.error('LocalStorage error:', e);
          // Fallback for environments without localStorage (like SSR)
          return window.mock_user || null;
        }
    }
  },
};

// --- GRAPHQL QUERIES AND MUTATIONS ---
export const GQL = {
  GET_CHATS_QUERY: 'getChats',
  GET_MESSAGES_QUERY: 'getMessages',
  CREATE_CHAT_MUTATION: 'createChat',
  SEND_MESSAGE_MUTATION: 'sendMessage',
  MESSAGES_SUBSCRIPTION: 'getMessages'
};

// --- MOCKED HASURA/GRAPHQL CLIENT & DATABASE ---
// This class simulates a GraphQL client and a local database.
// In a real app, you would use a library like Apollo Client.
export class MockGraphQLClient {
  constructor() {
    this.db = {
      chats: JSON.parse(localStorage.getItem('mock_db_chats')) || [],
      messages: JSON.parse(localStorage.getItem('mock_db_messages')) || [],
    };
    this.subscriptions = {};
    this.userId = mockNhost.auth.getUser()?.id;
  }

  // Helper to persist data to localStorage
  _persist() {
    localStorage.setItem('mock_db_chats', JSON.stringify(this.db.chats));
    localStorage.setItem('mock_db_messages', JSON.stringify(this.db.messages));
  }

  // Simulates running a GraphQL query
  query(query, variables) {
    return new Promise((resolve) => {
      // GET_CHATS_QUERY
      if (query.includes('getChats')) {
        const userChats = this.db.chats.filter(c => c.user_id === this.userId);
        resolve({ data: { chats: userChats } });
      }
      // GET_MESSAGES_QUERY
      if (query.includes('getMessages')) {
        const chatMessages = this.db.messages.filter(m => m.chat_id === variables.chat_id);
        resolve({ data: { messages: chatMessages } });
      }
    });
  }

  // Simulates running a GraphQL mutation
  mutation(mutation, variables) {
    return new Promise((resolve) => {
        // CREATE_CHAT_MUTATION
        if (mutation.includes('createChat')) {
            const newChat = {
                id: `chat_${Date.now()}`,
                user_id: this.userId,
                title: 'New Conversation',
                created_at: new Date().toISOString(),
            };
            this.db.chats.unshift(newChat);
            this._persist();
            resolve({ data: { insert_chats_one: newChat } });
        }
        // SEND_MESSAGE_MUTATION
        if (mutation.includes('sendMessage')) {
            const userMessage = {
                id: `msg_${Date.now()}`,
                chat_id: variables.chat_id,
                content: variables.content,
                role: 'user',
                created_at: new Date().toISOString(),
            };
            this.db.messages.push(userMessage);
            this._persist();
            
            // This is the crucial part that simulates the Hasura Action.
            this._triggerBotResponseAction(variables.chat_id, variables.content);
            
            resolve({ data: { insert_messages_one: userMessage } });
        }
    });
  }
  
  // Simulates a GraphQL subscription
  subscribe(query, variables, callback) {
    const key = `${variables.chat_id}`;
    this.subscriptions[key] = callback;

    // Immediately send the current data
    const chatMessages = this.db.messages.filter(m => m.chat_id === variables.chat_id);
    callback({ data: { messages: chatMessages } });

    // Return an unsubscribe function
    return {
      unsubscribe: () => {
        delete this.subscriptions[key];
      },
    };
  }
  
  // Helper to notify subscribers of new data
  _notify(chat_id) {
    if (this.subscriptions[chat_id]) {
      const chatMessages = this.db.messages.filter(m => m.chat_id === chat_id);
      this.subscriptions[chat_id]({ data: { messages: chatMessages } });
    }
  }

  // --- SIMULATED HASURA ACTION -> N8N -> GEMINI API ---
  async _triggerBotResponseAction(chat_id, prompt) {
    // 1. Hasura Action is triggered by the `sendMessage` mutation.
    // 2. Action calls n8n webhook, passing { chat_id, prompt, user_id }.
    // 3. n8n workflow validates user owns the chat_id (we assume this passes).
    // 4. n8n calls the external API (Gemini).
    console.log("🤖 Action Triggered: Getting bot response for prompt:", prompt);
    
    // Simulate network delay for the bot's response
    await new Promise(res => setTimeout(res, 1500));

    try {
      const botContent = await this.getGeminiResponse(prompt);

      // 5. n8n saves the response back to the DB via a GraphQL mutation.
      const botMessage = {
        id: `msg_${Date.now()}`,
        chat_id: chat_id,
        content: botContent,
        role: 'assistant',
        created_at: new Date().toISOString(),
      };
      this.db.messages.push(botMessage);
      this._persist();

      // 6. The subscription on the frontend receives the new message.
      this._notify(chat_id);
      console.log("✅ Bot response saved and notification sent.");

    } catch (error) {
        console.error("Error getting bot response:", error);
        const errorMessage = {
            id: `msg_${Date.now()}`,
            chat_id: chat_id,
            content: "Sorry, I encountered an error. Please try again.",
            role: 'assistant',
            created_at: new Date().toISOString(),
        };
        this.db.messages.push(errorMessage);
        this._persist();
        this._notify(chat_id);
    }
  }

  // --- REAL GEMINI API CALL ---
  // This function makes a real network request to the Gemini API.
  async getGeminiResponse(prompt) {
    // IMPORTANT: The user provided this API key.
    const apiKey = "AIzaSyD2VxZcYMBXLdHW_EF7dbW7L9WUqf-J89Y";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    const result = await response.json();
    
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected API response structure:", result);
      throw new Error("Could not extract text from Gemini API response.");
    }
  }
}
