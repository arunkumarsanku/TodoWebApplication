import React from 'react';

const Calendar = ({ todos, onToggle, onDelete, onDropTodo, currentMonth }) => {
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDay = startOfMonth.getDay();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = Array.from({ length: daysInMonth + startDay }, (_, i) => {
    if (i >= startDay) {
      return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i - startDay + 1);
    }
    return null;
  });

  const calculateRowHeight = (row) => {
    let maxTodos = 1; // Default height for rows with no todos
    row.forEach(day => {
      if (day) {
        const dateKey = day.toLocaleDateString();
        const dayTodos = todos.filter(todo => new Date(todo.date).toLocaleDateString() === dateKey);
        maxTodos = Math.max(maxTodos, dayTodos.length);
      }
    });
    return maxTodos * 20 + 40; // Adjust row height based on max todos, adjust multipliers as needed
  };

  const renderDay = (day, index, rowHeight) => {
    if (!day) return <div key={`empty-${index}`} className="border bg-white h-full"></div>;

    const dateKey = day.toLocaleDateString();
    const dayTodos = todos.filter(todo => new Date(todo.date).toLocaleDateString() === dateKey);

    return (
      <div
        key={dateKey}
        className={`border p-1 flex flex-col justify-start bg-white cursor-pointer relative ${day.toDateString() === new Date().toDateString() ? 'bg-blue-100 border-blue-400' : ''}`}
        onDrop={(e) => onDropTodo && onDropTodo(e, day)}
        onDragOver={(e) => e.preventDefault()}
        style={{
          minHeight: '80px', // Smaller default height
          height: `${rowHeight}px`, // Use calculated row height
          borderColor: '#e0e0e0',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          overflow: 'hidden',
        }}
      >
        <div className="text-right font-semibold text-gray-700 mb-1">{day.getDate()}</div>
        <div className="flex flex-col space-y-1 overflow-hidden">
          {dayTodos.map(todo => (
            <div
              key={todo._id}
              className={`flex items-center justify-between text-xs truncate p-1 ${todo.completed ? 'bg-green-100 line-through text-gray-500' : 'text-gray-600'}`}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("todoId", todo._id)}
              title={todo.title}  // Full text on hover
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
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 text-center font-bold">
        {daysOfWeek.map(day => (
          <div key={day} className="p-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const rowIndex = Math.floor(index / 7);
          const rowHeight = calculateRowHeight(days.slice(rowIndex * 7, (rowIndex + 1) * 7));
          return renderDay(day, index, rowHeight);
        })}
      </div>
    </div>
  );
};

export default Calendar;
