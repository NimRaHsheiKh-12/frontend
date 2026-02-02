// src/pages/dashboard.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import TodoFilter from '../components/TodoFilter';
import TodoList from '../components/TodoList';
import ChatInterface from '../components/ChatInterface';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState({
    status: 'all' as 'all' | 'completed' | 'pending',
    priority: 'all' as 'all' | 'Low' | 'Medium' | 'High',
    category: 'all',
    dueDate: 'all',
    searchTerm: '',
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleFilterChange = (newFilters: {
    status: 'all' | 'completed' | 'pending';
    priority: 'all' | 'Low' | 'Medium' | 'High';
    category: string;
    dueDate: string;
    searchTerm: string;
  }) => {
    setFilters(newFilters);
  };

  const handleLogout = async () => {
    await logout();
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-pastel-gray to-white p-4 md:p-8">
        <nav className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-800">Todo Dashboard</h1>
              </div>
              <div className="flex items-center">
                <div className="ml-3 relative">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700 font-medium">Welcome, {user?.email}</span>
                    <button
                      onClick={handleLogout}
                      className="ml-4 px-4 py-2 text-sm font-medium text-white bg-pastel-blue rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-blue transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <TodoFilter onFilterChange={handleFilterChange} />
              <TodoList
                filterStatus={filters.status}
                filterPriority={filters.priority}
                filterCategory={filters.category}
                filterDueDate={filters.dueDate}
                searchTerm={filters.searchTerm}
              />
            </div>
          </div>
        </main>

        {/* Floating Chat Icon */}
        <div className="fixed bottom-6 right-6 z-50">
          {isChatOpen ? (
            <div className="relative">
              {/* Chat Panel */}
              <div className="absolute bottom-20 right-0 w-80 h-[500px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col transform transition-transform duration-300 scale-100 opacity-100">
                <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-500 p-4">
                  <h3 className="text-white font-semibold">Taskie Assistant</h3>
                  <button
                    onClick={toggleChat}
                    className="text-white hover:text-gray-200 focus:outline-none"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-grow overflow-hidden">
                  <ChatInterface />
                </div>
              </div>
              {/* Close button overlay */}
              <button
                onClick={toggleChat}
                className="absolute inset-0 -z-10 bg-black bg-opacity-30 rounded-full"
                aria-label="Close chat"
              ></button>
            </div>
          ) : (
            <button
              onClick={toggleChat}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Open chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;