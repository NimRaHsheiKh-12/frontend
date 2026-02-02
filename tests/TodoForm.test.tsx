// tests/TodoForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoForm from '../src/components/TodoForm';

// Mock the todoService
jest.mock('../src/services/todo', () => ({
  todoService: {
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
  },
  CreateTodoData: {},
  UpdateTodoData: {},
}));

// Import the mock after creating it
import { todoService } from '../src/services/todo';

describe('TodoForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (todoService.createTodo as jest.MockedFunction<any>).mockResolvedValue({
      id: '1',
      user_id: 'user1',
      title: 'New Todo',
      description: 'New Description',
      is_completed: false,
      priority: 'Medium',
      category: 'Work',
      due_date: '2023-12-31',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    });
  });

  test('renders form fields correctly', () => {
    render(
      <TodoForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  test('submits form with correct data', async () => {
    render(
      <TodoForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Title *'), {
      target: { value: 'New Todo Title' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New Todo Description' },
    });
    fireEvent.change(screen.getByLabelText('Priority'), {
      target: { value: 'High' },
    });
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'Personal' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Create Todo'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Todo Title',
        description: 'New Todo Description',
        priority: 'High',
        category: 'Personal',
        due_date: '',
      });
    });
  });

  test('validates required fields', async () => {
    render(
      <TodoForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Submit the form without filling in required fields
    fireEvent.click(screen.getByText('Create Todo'));

    // Check that error message appears
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(
      <TodoForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockOnCancel).toHaveBeenCalled();
  });
});