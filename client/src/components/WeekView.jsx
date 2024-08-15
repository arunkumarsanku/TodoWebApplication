import React, { useState } from 'react';

const WeekView = ({ todos, onToggle, onDelete, onDropTodo, currentWeek }) => {
  const [hoveredTodo, setHoveredTodo] = useState(null);
  const startOfWeek = new Date(currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay()));
  const daysInWeek = Array.from({ length: 7 }, (_, i) => new Date(startOfWeek.getTime() + i * 86400000));

  const renderDay = (day, index) => {
    const dateKey = day.toLocaleDateString();
    const dayTodos = todos.filter(todo => new Date(todo.date).toLocaleDateString() === dateKey);

    return (
      <div
        key={dateKey}
        className={`border p-4 flex flex-col bg-white cursor-pointer relative ${day.toDateString() === new Date().toDateString() ? 'bg-blue-100 border-blue-400' : ''}`}
        onDrop={(e) => onDropTodo(e, day)}
        onDragOver={(e) => e.preventDefault()}
        style={{
          minHeight: '100px',
          borderColor: '#e0e0e0',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
        }}
      >
        <div className="text-right font-semibold text-gray-700 mb-1">{day.toDateString()}</div>
        <div className="flex flex-col space-y-1">
          {dayTodos.map(todo => (
            <div
              key={todo._id}
              className={`flex items-center justify-between text-xs truncate p-1 ${todo.completed ? 'bg-green-100 line-through text-gray-500' : 'text-gray-600'}`}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("todoId", todo._id)}
              onMouseEnter={() => setTimeout(() => setHoveredTodo(todo._id), 300)} // Delay hover effect
              onMouseLeave={() => setTimeout(() => setHoveredTodo(null), 1000)} // Delay hover removal
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => onToggle(todo._id)}
                  className="mr-2 cursor-pointer"
                />
                {todo.title}
              </div>
              <button onClick={() => onDelete(todo._id)} className="text-red-500 hover:text-red-700 ml-2">
                ✖
              </button>
              {hoveredTodo === todo._id && (
                <div className="absolute top-0 left-0 w-full bg-white shadow-lg p-2 z-10">
                  <div className="flex items-center justify-between">
                    <div>{todo.title}</div>
                    <button onClick={() => onDelete(todo._id)} className="text-red-500 hover:text-red-700">
                      ✖
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {daysInWeek.map((day, index) => renderDay(day, index))}
    </div>
  );
};

export default WeekView;
