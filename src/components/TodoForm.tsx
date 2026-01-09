// src/components/TodoForm.tsx
import React, { useState, useEffect } from 'react';
import { Todo, CreateTodoData, UpdateTodoData, todoService } from '../services/todo';

interface TodoFormProps {
  todo?: Todo | null;
  onSubmit: (todo: CreateTodoData | UpdateTodoData) => void;
  onCancel: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo, onSubmit, onCancel }) => {
  const isEditing = !!todo;

  const [formData, setFormData] = useState<CreateTodoData>({
    title: '',
    description: '',
    priority: 'Medium',
    category: '',
    due_date: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // If editing, populate form with existing todo data
  useEffect(() => {
    if (isEditing && todo) {
      setFormData({
        title: todo.title,
        description: todo.description || '',
        priority: todo.priority,
        category: todo.category || '',
        due_date: todo.due_date || '',
      });
    } else {
      // Reset form for new todo
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        category: '',
        due_date: '',
      });
    }
  }, [isEditing, todo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.due_date && isNaN(Date.parse(formData.due_date))) {
      newErrors.due_date = 'Invalid date format. Use YYYY-MM-DD';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (isEditing && todo) {
      // For editing, only include fields that have been modified
      const updateData: UpdateTodoData = {};

      if (formData.title !== todo.title) updateData.title = formData.title;
      if (formData.description !== todo.description) updateData.description = formData.description;
      if (formData.priority !== todo.priority) updateData.priority = formData.priority;
      if (formData.category !== todo.category) updateData.category = formData.category;
      if (formData.due_date !== todo.due_date) updateData.due_date = formData.due_date;

      // Only update completion status if it's different
      if (todo.is_completed !== (todo.is_completed)) updateData.is_completed = todo.is_completed;

      onSubmit(updateData);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md border border-pastel-gray">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {isEditing ? 'Edit Todo' : 'Create New Todo'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent transition-all ${
                  errors.title ? 'border-red-300' : 'border-pastel-gray'
                }`}
                placeholder="What needs to be done?"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-pastel-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent transition-all"
                placeholder="Add details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-600 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-pastel-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent transition-all"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-600 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent transition-all ${
                    errors.due_date ? 'border-red-300' : 'border-pastel-gray'
                  }`}
                />
                {errors.due_date && <p className="mt-1 text-sm text-red-500">{errors.due_date}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-600 mb-1">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-pastel-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent transition-all"
                placeholder="Work, Personal, etc."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-pastel-gray rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-gray transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-pastel-blue rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-blue transition-colors"
              >
                {isEditing ? 'Update Todo' : 'Create Todo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TodoForm;