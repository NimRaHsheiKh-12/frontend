// tests/TodoItem.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoItem from '../src/components/TodoItem';

// Mock the todoService
jest.mock('../src/services/todo', () => ({
  todoService: {
    toggleTodoCompletion: jest.fn(),
  },
  Todo: {},
}));

// Import the mock after creating it
import { todoService } from '../src/services/todo';

// Define a mock todo for testing
const mockTodo = {
  id: '1',
  user_id: 'user1',
  title: 'Test Todo',
  description: 'Test Description',
  is_completed: false,
  priority: 'Medium' as const,
  category: 'Work',
  due_date: '2023-12-31',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
};

describe('TodoItem Component', () => {
  const mockOnToggle = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (todoService.toggleTodoCompletion as jest.MockedFunction<any>).mockResolvedValue({
      ...mockTodo,
      is_completed: !mockTodo.is_completed,
    });
  });

  test('renders todo title and description', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('calls onToggle when checkbox is clicked', async () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(todoService.toggleTodoCompletion).toHaveBeenCalledWith(mockTodo.id);
    expect(mockOnToggle).toHaveBeenCalled();
  });

  test('calls onEdit when edit button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTodo);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  test('displays priority with correct color', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const priorityElement = screen.getByText('Medium');
    expect(priorityElement).toHaveClass('text-yellow-600');
  });
});