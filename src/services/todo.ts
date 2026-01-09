// src/services/todo.ts
import axios from 'axios';

// Define types for our todo items
export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  category?: string;
  due_date?: string; // ISO string format
  created_at: string; // ISO string format
  updated_at: string; // ISO string format
}

export interface CreateTodoData {
  title: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  category?: string;
  due_date?: string; // ISO string format
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  is_completed?: boolean;
  priority?: 'Low' | 'Medium' | 'High';
  category?: string;
  due_date?: string; // ISO string format
}

// Create an axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, clear it and redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Todo API functions
export const todoService = {
  // Get all todos for the authenticated user
  getTodos: async (
    search?: string,
    status?: boolean,
    priority?: string,
    category?: string,
    dueDate?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ todos: Todo[]; total: number; limit: number; offset: number }> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status !== undefined) params.append('status', status.toString());
    if (priority) params.append('priority', priority);
    if (category) params.append('category', category);
    if (dueDate) params.append('due_date', dueDate);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const response = await apiClient.get(`/todos?${params.toString()}`);

    // The backend returns an array directly, not an object with a todos property
    // So we need to wrap it in the expected format
    const todos = Array.isArray(response.data) ? response.data : [];
    return {
      todos,
      total: todos.length, // Since backend doesn't provide total, we use the length
      limit,
      offset
    };
  },

  // Create a new todo
  createTodo: async (todoData: CreateTodoData): Promise<Todo> => {
    const response = await apiClient.post('/todos', todoData);
    return response.data;
  },

  // Get a specific todo by ID
  getTodoById: async (id: string): Promise<Todo> => {
    const response = await apiClient.get(`/todos/${id}`);
    return response.data;
  },

  // Update a specific todo by ID
  updateTodo: async (id: string, todoData: UpdateTodoData): Promise<Todo> => {
    const response = await apiClient.put(`/todos/${id}`, todoData);
    return response.data;
  },

  // Toggle completion status of a specific todo
  toggleTodoCompletion: async (id: string): Promise<Todo> => {
    const response = await apiClient.patch(`/todos/${id}/toggle`);
    return response.data;
  },

  // Delete a specific todo by ID
  deleteTodo: async (id: string): Promise<void> => {
    await apiClient.delete(`/todos/${id}`);
  },
};