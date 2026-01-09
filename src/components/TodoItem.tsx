// src/components/TodoItem.tsx
import React from 'react';
import { Todo, todoService } from '../services/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete }) => {
  const handleToggle = async () => {
    try {
      const updatedTodo = await todoService.toggleTodoCompletion(todo.id);
      onToggle(updatedTodo);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  // Determine priority color with pastel shades
  const priorityColor = {
    Low: 'text-green-600 bg-pastel-green',
    Medium: 'text-yellow-600 bg-pastel-yellow',
    High: 'text-red-600 bg-pastel-pink',
  }[todo.priority];

  return (
    <div className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-md ${todo.is_completed ? 'bg-pastel-green border-pastel-gray' : 'bg-white border-pastel-gray shadow-sm'}`}>
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={todo.is_completed}
          onChange={handleToggle}
          className="mt-1 h-5 w-5 rounded border-pastel-gray text-pastel-blue focus:ring-pastel-blue focus:ring-offset-0"
        />
        <div className="ml-4 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-medium truncate ${todo.is_completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {todo.title}
            </h3>
            <div className="flex space-x-4 ml-2">
              <button
                onClick={handleEdit}
                className="text-sm font-medium text-pastel-blue hover:text-blue-500 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-sm font-medium text-pastel-pink hover:text-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
          {todo.description && (
            <p className={`mt-2 text-sm ${todo.is_completed ? 'line-through text-gray-500' : 'text-gray-600'} break-words`}>
              {todo.description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor}`}>
              {todo.priority}
            </span>
            {todo.category && (
              <span className="px-3 py-1 rounded-full text-xs font-medium text-gray-600 bg-pastel-gray">
                {todo.category}
              </span>
            )}
            {todo.due_date && (
              <span className="px-3 py-1 rounded-full text-xs font-medium text-gray-600 bg-pastel-gray">
                Due: {new Date(todo.due_date).toLocaleDateString()}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-medium text-gray-500 bg-pastel-gray">
              {new Date(todo.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;