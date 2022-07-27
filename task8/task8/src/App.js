import logo from './logo.svg';
import React, {useState} from "react";
import './App.css';
import TodoForm from "./TodoForm.js";
import TodoList from './TodoList';

function App() {
  const [todos, setTodos] = useState([]);
  

  function addTodo(todo) {
    setTodos([todo, ...todos]);
  }

  return (


    <div className="App">
      <header className="App-header">
        <p> React Distance Calculator</p>
      </header>
    </div>
  );
}

export default App;
