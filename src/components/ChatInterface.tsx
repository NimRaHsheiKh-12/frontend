/**
 * ChatInterface component for TaskBox Chatbot Assistant (Taskie)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming auth context exists
import { useTodos } from '../context/TodoContext'; // Assuming todo context exists
import chatApiService from '../services/chatApi';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'taskie';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user: currentUser, loading: authLoading } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Prevent multiple simultaneous API calls
  const isSendingRef = useRef<boolean>(false);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    // Prevent multiple simultaneous API calls
    if (isSendingRef.current) {
      console.log('Send already in progress, ignoring duplicate call');
      return;
    }

    console.log('handleSendMessage called', { inputValue, currentUser }); // Debug log

    if (!inputValue.trim()) {
      console.log('Message is empty, not sending'); // Debug log
      return;
    }

    // Mark as sending to prevent duplicate calls
    isSendingRef.current = true;
    
    const messageText = inputValue; // Capture message before clearing

    // We can proceed even without a current user since we're using the public endpoint
    // Just log that the user is not authenticated if needed for debugging
    if (!currentUser) {
      console.log('No current user, proceeding with temporary ID'); // Debug log
    }

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('Calling chat API with:', {
        message: messageText
      }); // Debug log

      // Process the message with the chat API
      // Authentication relies only on JWT cookies
      const response = await chatApiService.processMessage(
        currentUser?.id || `temp_${Date.now()}`,
        messageText,
        []
      );

      console.log('Received response from chat API:', response); // Debug log

      // Add Taskie's response to chat
      const taskieMessage: Message = {
        id: `taskie-${Date.now()}`,
        text: response.reply,
        sender: 'taskie',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, taskieMessage]);

      // Update todos based on the action performed
      // NOTE: Don't call addTodo/updateTodo/deleteTodo because the chat API already modified the tasks!
      // The backend returns updated_tasks which is the source of truth.
      // We only need to reflect those changes in local state.
      if (response.action_performed === 'CREATE') {
        // Tasks were already created by the backend, just sync local state
        // Don't call addTodo() as it would make another API call
        console.log('Task created by backend, syncing local state'); // Debug log
      } else if (response.action_performed === 'UPDATE') {
        // Tasks were already updated by the backend
        // Just reflect in local todos - don't call updateTodo() API again
        if (response.updated_tasks && response.updated_tasks.length > 0) {
          // Update the local todos with the backend response
          console.log('Tasks updated by backend, syncing local state'); // Debug log
        }
      } else if (response.action_performed === 'DELETE') {
        // Tasks were already deleted by the backend
        // Just reflect in local todos - don't call deleteTodo() API again
        if (response.updated_tasks) {
          console.log('Tasks deleted by backend, syncing local state'); // Debug log
        }
      } else if (response.action_performed === 'COMPLETE') {
        // Tasks were already completed by the backend
        // Just reflect in local todos - don't call toggleTodoCompletion() API again
        if (response.updated_tasks && response.updated_tasks.length > 0) {
          console.log('Tasks completed by backend, syncing local state'); // Debug log
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);

      // Determine the specific error message based on the error type
      let errorMessageText = "Sorry, I encountered an issue processing your request. Please try again.";

      if (error instanceof Error && 'response' in error) {
        const axiosError = error as any;
        // Server responded with error status
        if (axiosError.response.status === 401) {
          errorMessageText = "Authentication error. Please log in again.";
        } else if (axiosError.response.status === 422) {
          errorMessageText = "Invalid request format. Please try rephrasing your message.";
        } else {
          errorMessageText = `Server error (${axiosError.response.status}). Please try again later.`;
        }
      } else if (error instanceof Error && 'request' in error) {
        // Request was made but no response received
        errorMessageText = "Network error. Please check your connection and try again.";
      } else {
        // Something else happened
        errorMessageText = "An unexpected error occurred. Please try again.";
      }

      // Add error message to chat
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: errorMessageText,
        sender: 'taskie',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Only clear the sending flag after a small delay to ensure UI updates
      setTimeout(() => {
        isSendingRef.current = false;
      }, 100);
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show loading state if auth is still loading
  if (authLoading) {
    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-md p-4 items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-4 pb-2 border-b">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">T</span>
        </div>
        <div className="ml-3">
          <h2 className="font-semibold text-gray-800">Taskie</h2>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto mb-4 max-h-[400px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl max-w-md">
              <h3 className="font-bold text-lg text-gray-800 mb-2">Hi there! 👋</h3>
              <p className="text-gray-600">
                I'm Taskie, your friendly AI assistant for TaskBox!
                I can help you manage your tasks. Try saying:
              </p>
              <ul className="mt-3 text-sm text-left text-gray-600 list-disc pl-5 space-y-1">
                <li>"Add 'buy groceries'"</li>
                <li>"Show my tasks"</li>
                <li>"Mark 'task name' as completed"</li>
                <li>"Update 'old task' to 'new task'"</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-none'
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex space-x-2">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message to Taskie..."
          className="flex-grow border border-gray-300 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim() || isSendingRef.current}
          className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl px-6 py-3 font-medium ${
            isLoading || !inputValue.trim() || isSendingRef.current ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;