import logo from './logo.svg';
import React, {useState} from "react";
import './App.css';
import TodoForm from "./TodoForm";
import TodoList from './TodoList';


//three main items-> check, buttons and items

function Todo({ todo }){
    return (
        <div style={{ display: "flex"}}>
            <input type="checkbox" />
            <li style= {{ color : white, textDecoration: todo.completed ? "line-through" : null
            }}
            > 
            {todo.task} </li>
            <button>X</button>
        </div>
    )
}