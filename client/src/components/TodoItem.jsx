import React from 'react';

const TodoItem = React.memo(({ todo, onToggle, onDelete, onDragStart, onDrop }) => {
  return (
    <div
      className="flex justify-between items-center bg-white p-2 my-1 rounded shadow-sm cursor-pointer border border-gray-200"
      draggable
      onDragStart={(e) => onDragStart(e, todo._id)}
      onDrop={(e) => onDrop && onDrop(e, todo._id)}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex flex-col">
        <input 
          type="checkbox" 
          checked={todo.completed} 
          onChange={() => onToggle(todo._id)}  
          className="mr-2 cursor-pointer"
        />
        <span className={todo.completed ? 'line-through text-gray-500' : ''}>{todo.title}</span>
        <small className="text-gray-400">{new Date(todo.date).toLocaleDateString()}</small>
      </div>
      <button 
        onClick={() => onDelete(todo._id)} 
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
});

export default TodoItem;
