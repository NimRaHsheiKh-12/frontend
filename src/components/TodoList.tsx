// src/components/TodoList.tsx
import React, { useState, useEffect } from 'react';
import { Todo, todoService } from '../services/todo';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

interface TodoListProps {
  filterStatus?: 'all' | 'completed' | 'pending';
  filterPriority?: 'Low' | 'Medium' | 'High' | 'all';
  filterCategory?: string;
  filterDueDate?: string;
  searchTerm?: string;
}

const TodoList: React.FC<TodoListProps> = ({
  filterStatus = 'all',
  filterPriority = 'all',
  filterCategory = 'all',
  filterDueDate = 'all',
  searchTerm = '',
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // To trigger refresh

  // Fetch todos when component mounts or when refresh is triggered
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);

        // Map filterStatus to the appropriate value for the API
        let statusFilter: boolean | undefined;
        if (filterStatus === 'completed') statusFilter = true;
        else if (filterStatus === 'pending') statusFilter = false;
        else statusFilter = undefined;

        // Map filterPriority to the appropriate value for the API
        const priorityFilter = filterPriority === 'all' ? undefined : filterPriority;

        // Map filterCategory to the appropriate value for the API
        const categoryFilter = filterCategory === 'all' ? undefined : filterCategory;

        // Map filterDueDate to the appropriate value for the API
        const dueDateFilter = filterDueDate === 'all' ? undefined : filterDueDate;

        const response = await todoService.getTodos(
          searchTerm,
          statusFilter,
          priorityFilter,
          categoryFilter,
          dueDateFilter
        );

        // Ensure response.todos exists and is an array before setting state
        setTodos(Array.isArray(response.todos) ? response.todos : []);
      } catch (err) {
        setError('Failed to fetch todos');
        console.error('Error fetching todos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [filterStatus, filterPriority, filterCategory, filterDueDate, searchTerm, refreshTrigger]);

  const handleToggle = (updatedTodo: Todo) => {
    setTodos(todos.map(todo =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await todoService.deleteTodo(id);
        setTodos(todos.filter(todo => todo.id !== id));
      } catch (error) {
        setError('Failed to delete todo');
        console.error('Error deleting todo:', error);
      }
    }
  };

  const handleFormSubmit = async (todoData: any) => {
    try {
      if (editingTodo) {
        // Update existing todo
        const updatedTodo = await todoService.updateTodo(editingTodo.id, todoData);
        setTodos(todos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        ));
      } else {
        // Create new todo
        const newTodo = await todoService.createTodo(todoData);
        setTodos([newTodo, ...todos]);
      }

      setShowForm(false);
      setEditingTodo(null);
    } catch (error) {
      setError('Failed to save todo');
      console.error('Error saving todo:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading todos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-pastel-pink rounded-xl p-4 mb-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Todos</h2>
        <button
          onClick={() => {
            setEditingTodo(null);
            setShowForm(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-pastel-blue rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-blue transition-colors"
        >
          Add New Todo
        </button>
      </div>

      {Array.isArray(todos) && todos.length === 0 ? (
        <div className="text-center py-12 bg-pastel-gray rounded-xl">
          <p className="text-gray-600">No todos found. Create your first todo!</p>
        </div>
      ) : Array.isArray(todos) ? (
        <div className="space-y-4">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-pastel-gray rounded-xl">
          <p className="text-gray-600">Error loading todos</p>
        </div>
      )}

      {showForm && (
        <TodoForm
          todo={editingTodo}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default TodoList;