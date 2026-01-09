// src/pages/dashboard.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import TodoFilter from '../components/TodoFilter';
import TodoList from '../components/TodoList';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState({
    status: 'all' as 'all' | 'completed' | 'pending',
    priority: 'all' as 'all' | 'Low' | 'Medium' | 'High',
    category: 'all',
    dueDate: 'all',
    searchTerm: '',
  });

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
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;