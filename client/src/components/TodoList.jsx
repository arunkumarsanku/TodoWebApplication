import React, { useState, useReducer, useEffect, useCallback } from 'react';
import Calendar from './Calendar';
import WeekView from './WeekView';
import TodoForm from './TodoForm';
import UpcomingTasks from './UpcomingTasks';

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo._id === action.payload._id ? action.payload : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo._id !== action.payload),
      };
    case 'MOVE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo._id === action.payload._id ? { ...todo, date: action.payload.newDate } : todo
        ),
      };
    case 'SET_NEW_TODO':
      return { ...state, newTodo: action.payload };
    case 'SET_TODO_DATE':
      return { ...state, todoDate: action.payload };
    case 'SET_CURRENT_MONTH':
      return { ...state, currentMonth: action.payload };
    case 'SET_CURRENT_WEEK':
      return { ...state, currentWeek: action.payload };
    default:
      return state;
  }
};

const initialState = {
  todos: [],
  newTodo: '',
  todoDate: '',
  currentMonth: new Date(),
  currentWeek: new Date(),
};

const TodoList = () => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [viewMode, setViewMode] = useState('month');

  useEffect(() => {
    fetch('/api/todos')
      .then(response => response.json())
      .then(data => dispatch({ type: 'SET_TODOS', payload: data }));
  }, [state.currentMonth, state.currentWeek]);

  const addTodo = useCallback(() => {
    if (state.newTodo.trim() === "" || state.todoDate === "") {
      console.error("Todo title and date cannot be empty");
      return;
    }

    fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: state.newTodo, date: state.todoDate }),
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw err });
      }
      return res.json();
    })
    .then(todo => {
      dispatch({ type: 'ADD_TODO', payload: todo });
      dispatch({ type: 'SET_NEW_TODO', payload: '' });
      dispatch({ type: 'SET_TODO_DATE', payload: '' });
    })
    .catch(err => {
      console.error('Error adding todo:', err);
      alert(`Failed to add todo: ${err.message}`);
    });
  }, [state.newTodo, state.todoDate]);

  const toggleTodo = useCallback((id) => {
    const todo = state.todos.find(todo => todo._id === id);

    fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !todo.completed }),
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw err });
      }
      return res.json();
    })
    .then(updatedTodo => {
      dispatch({ type: 'TOGGLE_TODO', payload: updatedTodo });
    })
    .catch(err => {
      console.error('Error toggling todo:', err);
      alert(`Failed to toggle todo: ${err.message}`);
    });
  }, [state.todos]);

  const deleteTodo = useCallback((id) => {
    fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      dispatch({ type: 'DELETE_TODO', payload: id });
    })
    .catch(err => {
      console.error('Error deleting todo:', err);
      alert(`Failed to delete todo: ${err.message}`);
    });
  }, []);

  const onDropTodo = useCallback((e, newDate) => {
    const todoId = e.dataTransfer.getData("todoId");
    const todo = state.todos.find(todo => todo._id === todoId);
    if (!todo) return;

    const formattedDate = new Date(newDate).toISOString();

    fetch(`/api/todos/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: formattedDate }),
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw err });
      }
      return res.json();
    })
    .then(updatedTodo => {
      dispatch({ type: 'MOVE_TODO', payload: { _id: todoId, newDate: formattedDate } });
    })
    .catch(err => {
      console.error('Error moving todo:', err);
      alert(`Failed to move todo: ${err.message}`);
    });
  }, [state.todos]);

  const handlePrevious = () => {
    if (viewMode === 'month') {
      const newMonth = new Date(state.currentMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      dispatch({ type: 'SET_CURRENT_MONTH', payload: newMonth });
    } else if (viewMode === 'week') {
      const newWeek = new Date(state.currentWeek);
      newWeek.setDate(newWeek.getDate() - 7);
      dispatch({ type: 'SET_CURRENT_WEEK', payload: newWeek });
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      const newMonth = new Date(state.currentMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      dispatch({ type: 'SET_CURRENT_MONTH', payload: newMonth });
    } else if (viewMode === 'week') {
      const newWeek = new Date(state.currentWeek);
      newWeek.setDate(newWeek.getDate() + 7);
      dispatch({ type: 'SET_CURRENT_WEEK', payload: newWeek });
    }
  };

  const handleToday = () => {
    const today = new Date();
    if (viewMode === 'month') {
      dispatch({ type: 'SET_CURRENT_MONTH', payload: today });
    } else if (viewMode === 'week') {
      dispatch({ type: 'SET_CURRENT_WEEK', payload: today });
    }
  };

  const formattedCurrentMonth = state.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const formattedCurrentWeek = `Week of ${state.currentWeek.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}`;

  return (
    <div className="flex h-screen">
      <div className="w-4/5 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <TodoForm 
            newTodo={state.newTodo}
            todoDate={state.todoDate}
            setNewTodo={(value) => dispatch({ type: 'SET_NEW_TODO', payload: value })}
            setTodoDate={(value) => dispatch({ type: 'SET_TODO_DATE', payload: value })}
            addTodo={addTodo}
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2" onClick={handlePrevious}>
              Previous
            </button>
            <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2" onClick={handleToday}>
              Today
            </button>
            <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={handleNext}>
              Next
            </button>
          </div>
          <div className="text-lg font-semibold">
            {viewMode === 'month' ? formattedCurrentMonth : formattedCurrentWeek}
          </div>
          <div className="flex items-center">
            <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2" onClick={() => setViewMode('month')}>
              Month
            </button>
            <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={() => setViewMode('week')}>
              Week
            </button>
          </div>
        </div>

        {viewMode === 'month' ? (
          <Calendar 
            todos={state.todos} 
            onToggle={toggleTodo} 
            onDelete={deleteTodo} 
            onDropTodo={onDropTodo} 
            currentMonth={state.currentMonth}
          />
        ) : (
          <WeekView 
            todos={state.todos} 
            onToggle={toggleTodo} 
            onDelete={deleteTodo} 
            onDropTodo={onDropTodo} 
            currentWeek={state.currentWeek}
          />
        )}
      </div>

      <div className="w-1/5">
        <UpcomingTasks
          todos={state.todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onDropTodo={onDropTodo}
        />
      </div>
    </div>
  );
};

export default TodoList;
