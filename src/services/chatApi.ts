/**
 * API client for chat functionality in TaskBox
 */

import axios from 'axios';

// Get the API base URL from environment variable with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
console.log('API_BASE_URL:', API_BASE_URL); // Debug log

// Create axios instance with default config
const chatApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
chatApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log('Token in request interceptor:', token ? 'exists' : 'missing'); // Debug log
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // For public endpoints, we don't need the token
      // Check if this is a public endpoint
      if (config.url && !config.url.includes('public')) {
        console.warn('No token found in localStorage for chat API request');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
chatApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response || error.message); // Debug log
    return Promise.reject(error);
  }
);

// API methods
export const chatApiService = {
  // Process a chat message
  processMessage: async (user_id: string, message: string, current_tasks: any[]) => {
    console.log('processMessage called with:', { user_id, message, current_tasks }); // Debug log

    try {
      // Check if user is authenticated by checking for token
      const token = localStorage.getItem('access_token');

      let response;
      if (token) {
        // Use the authenticated endpoint when token is available
        response = await chatApi.post('/chat/process', {
          message
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        // Use the public endpoint when no token is available
        response = await chatApi.post('/chat/process_public', {
          message
        });
      }

      console.log('processMessage response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error processing chat message:', error);
      // More detailed error reporting
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as any;
        console.error('Error response data:', axiosError.response?.data);
        console.error('Error response status:', axiosError.response?.status);
        console.error('Error response headers:', axiosError.response?.headers);
      } else if (error instanceof Error && 'request' in error) {
        console.error('Error request:', (error as any).request);
      } else if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      throw error;
    }
  },

  // Get chat history for a user
  getChatHistory: async (user_id: string) => {
    console.log('getChatHistory called with user_id:', user_id); // Debug log

    try {
      const response = await chatApi.get(`/chat/history/${user_id}`);
      console.log('getChatHistory response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  // Initialize a chat session
  initializeSession: async (user_id: string) => {
    console.log('initializeSession called with user_id:', user_id); // Debug log

    try {
      const response = await chatApi.post('/chat/session', {
        user_id
      });
      console.log('initializeSession response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error initializing chat session:', error);
      throw error;
    }
  },

  // End a chat session
  endSession: async (session_id: string) => {
    console.log('endSession called with session_id:', session_id); // Debug log

    try {
      const response = await chatApi.delete(`/chat/session/${session_id}`);
      console.log('endSession response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error ending chat session:', error);
      throw error;
    }
  }
};

export default chatApiService;