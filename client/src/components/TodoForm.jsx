import React from 'react';

const TodoForm = ({ newTodo, todoDate, setNewTodo, setTodoDate, addTodo }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="New Todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="date"
          value={todoDate}
          onChange={(e) => setTodoDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <button
        onClick={addTodo}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Add Todo
      </button>
    </div>
  );
};

export default TodoForm;
