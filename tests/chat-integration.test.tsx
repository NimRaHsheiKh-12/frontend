import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '../src/pages/dashboard';

// Mock the child components
jest.mock('../src/components/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="protected-route">{children}</div>
}));

jest.mock('../src/components/TodoFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="todo-filter">TodoFilter</div>
}));

jest.mock('../src/components/TodoList', () => ({
  __esModule: true,
  default: () => <div data-testid="todo-list">TodoList</div>
}));

jest.mock('../src/components/ChatInterface', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-interface">ChatInterface</div>
}));

jest.mock('../src/context/AuthContext', () => ({
  __esModule: true,
  useAuth: () => ({
    user: { email: 'test@example.com', id: '1' },
    logout: jest.fn()
  })
}));

describe('DashboardPage with Chat Integration', () => {
  it('renders the floating chat icon', () => {
    render(<DashboardPage />);
    
    // Check if the floating chat button is present
    const chatButton = screen.getByLabelText(/open chat/i);
    expect(chatButton).toBeInTheDocument();
  });

  it('opens the chat panel when the floating icon is clicked', () => {
    render(<DashboardPage />);
    
    // Click the floating chat button
    const chatButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(chatButton);
    
    // Check if the chat panel is now visible
    const chatPanel = screen.getByText(/taskie assistant/i);
    expect(chatPanel).toBeInTheDocument();
    
    // Check if the ChatInterface component is rendered
    const chatInterface = screen.getByTestId('chat-interface');
    expect(chatInterface).toBeInTheDocument();
  });

  it('closes the chat panel when the close button is clicked', () => {
    render(<DashboardPage />);
    
    // Open the chat first
    const chatButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(chatButton);
    
    // Check if the chat panel is open
    const chatPanel = screen.getByText(/taskie assistant/i);
    expect(chatPanel).toBeInTheDocument();
    
    // Click the close button
    const closeButton = screen.getByRole('button', { name: /close chat/i });
    fireEvent.click(closeButton);
    
    // The chat panel should no longer be in the document
    expect(screen.queryByText(/taskie assistant/i)).not.toBeInTheDocument();
  });

  it('maintains dashboard content when chat panel is open', () => {
    render(<DashboardPage />);
    
    // Open the chat
    const chatButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(chatButton);
    
    // Check that dashboard elements are still present
    const todoFilter = screen.getByTestId('todo-filter');
    const todoList = screen.getByTestId('todo-list');
    expect(todoFilter).toBeInTheDocument();
    expect(todoList).toBeInTheDocument();
  });
});