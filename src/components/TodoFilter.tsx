// src/components/TodoFilter.tsx
import React, { useState } from 'react';

interface TodoFilterProps {
  onFilterChange: (filters: {
    status: 'all' | 'completed' | 'pending';
    priority: 'all' | 'Low' | 'Medium' | 'High';
    category: string;
    dueDate: string;
    searchTerm: string;
  }) => void;
}

const TodoFilter: React.FC<TodoFilterProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [priority, setPriority] = useState<'all' | 'Low' | 'Medium' | 'High'>('all');
  const [category, setCategory] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleApplyFilters = () => {
    onFilterChange({
      status,
      priority,
      category: category.trim() === '' ? 'all' : category,
      dueDate,
      searchTerm: searchTerm.trim(),
    });
  };

  const handleResetFilters = () => {
    setStatus('all');
    setPriority('all');
    setCategory('');
    setDueDate('all');
    setSearchTerm('');

    onFilterChange({
      status: 'all',
      priority: 'all',
      category: 'all',
      dueDate: 'all',
      searchTerm: '',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-pastel-gray">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-600 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title..."
            className="w-full px-3 py-2 border border-pastel-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'all' | 'completed' | 'pending')}
            className="w-full px-3 py-2 border border-pastel-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent transition-all"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-600 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'all' | 'Low' | 'Medium' | 'High')}
            className="w-full px-3 py-2 border border-pastel-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent transition-all"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-600 mb-1">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Filter by category..."
            className="w-full px-3 py-2 border border-pastel-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-600 mb-1">
            Due Date
          </label>
          <select
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-pastel-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent transition-all"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex space-x-3 justify-end">
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-pastel-gray rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-gray transition-colors"
        >
          Reset Filters
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 text-sm font-medium text-white bg-pastel-blue rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-blue transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default TodoFilter;