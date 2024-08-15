import React from 'react';

const TodoDetails = ({ todos }) => {
  const categories = {
    "To do": todos.filter(todo => !todo.completed && !todo.inProgress),
    "Doing": todos.filter(todo => todo.inProgress && !todo.completed),
    "Done": todos.filter(todo => todo.completed),
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Todos for Selected Day</h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(categories).map((category) => (
          <div key={category} className="bg-gray-50 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2 border-b pb-2">{category}</h3>
            {categories[category].map(todo => (
              <div key={todo._id} className="bg-white p-2 mb-2 rounded border-l-4 border-blue-400">
                <h4 className="font-bold">{todo.title}</h4>
                <p className="text-sm text-gray-500">{new Date(todo.date).toDateString()}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoDetails;


