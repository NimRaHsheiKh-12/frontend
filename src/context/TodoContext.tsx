// src/context/TodoContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Todo, CreateTodoData, UpdateTodoData, todoService } from '../services/todo';
import { useAuth } from './AuthContext';

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (todo: CreateTodoData) => Promise<void>;
  updateTodo: (id: string, todoData: UpdateTodoData) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodoCompletion: (id: string) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Load todos when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadTodos();
    } else {
      // Reset todos if user is not authenticated
      setTodos([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadTodos = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await todoService.getTodos();
      setTodos(response.todos);
    } catch (err) {
      console.error('Error loading todos:', err);
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData: CreateTodoData) => {
    try {
      setError(null);
      const newTodo = await todoService.createTodo(todoData);
      setTodos(prev => [newTodo, ...prev]);
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo');
      throw err;
    }
  };

  const updateTodo = async (id: string, todoData: UpdateTodoData) => {
    try {
      setError(null);
      const updatedTodo = await todoService.updateTodo(id, todoData);
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo');
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo');
      throw err;
    }
  };

  const toggleTodoCompletion = async (id: string) => {
    try {
      setError(null);
      const updatedTodo = await todoService.toggleTodoCompletion(id);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      console.error('Error toggling todo completion:', err);
      setError('Failed to toggle todo completion');
      throw err;
    }
  };

  const refreshTodos = async () => {
    await loadTodos();
  };

  const value = {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompletion,
    refreshTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};