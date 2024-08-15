import React from 'react';

const UpcomingTasks = ({ todos, onToggle, onDelete, onDropTodo }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize the time to start of the day for accurate comparison

  // Group todos by date
  const groupedTodos = todos.reduce((acc, todo) => {
    const dateKey = new Date(todo.date).toLocaleDateString('en-US'); // Ensure consistent date format
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(todo);
    return acc;
  }, {});

  // Separate upcoming and pending todos
  const upcomingTodos = Object.entries(groupedTodos).filter(
    ([dateKey, todosForDate]) =>
      new Date(dateKey) >= today && todosForDate.some(todo => !todo.completed)
  );

  const pendingTodos = Object.entries(groupedTodos).filter(
    ([dateKey, todosForDate]) =>
      new Date(dateKey) < today && todosForDate.some(todo => !todo.completed)
  );

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex-grow overflow-y-auto mb-4" style={{ maxHeight: '70%' }}>
        <h2 className="font-semibold mb-4">Upcoming Tasks</h2>
        {upcomingTodos.map(([dateKey, todosForDate]) => (
          <div key={dateKey} className="mb-4">
            <h3 className="text-gray-600 text-sm mb-2">{new Date(dateKey).toDateString()}</h3>
            {todosForDate
              .filter(todo => !todo.completed)
              .map(todo => (
                <div
                  key={todo._id}
                  className={`flex justify-between items-center p-2 bg-white shadow-sm rounded cursor-pointer`}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("todoId", todo._id)}
                  onDrop={(e) => onDropTodo && onDropTodo(e, todo.date)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => onToggle(todo._id)}
                      className="mr-2 cursor-pointer"
                    />
                    <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {todo.title}
                    </span>
                  </div>
                  <button onClick={() => onDelete(todo._id)} className="text-red-500 hover:text-red-700">
                    ✖
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>

      {pendingTodos.length > 0 && (
        <div className="overflow-y-auto" style={{ maxHeight: '30%' }}>
          <h2 className="font-semibold mb-4">Pending Tasks</h2>
          {pendingTodos.map(([dateKey, todosForDate]) => (
            <div key={dateKey} className="mb-4">
              <h3 className="text-gray-600 text-sm mb-2">{new Date(dateKey).toDateString()}</h3>
              {todosForDate
                .filter(todo => !todo.completed)
                .map(todo => (
                  <div
                    key={todo._id}
                    className="flex justify-between items-center p-2 bg-red-100 shadow-sm rounded cursor-pointer"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("todoId", todo._id)}
                    onDrop={(e) => onDropTodo && onDropTodo(e, todo.date)}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onToggle(todo._id)}
                        className="mr-2 cursor-pointer"
                      />
                      <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                        {todo.title}
                      </span>
                    </div>
                    <button onClick={() => onDelete(todo._id)} className="text-red-500 hover:text-red-700">
                      ✖
                    </button>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingTasks;
