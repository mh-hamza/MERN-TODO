import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit,MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";


import "./App.css";
import axios from "axios";

function App() {
  const [inputText, setInputText] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Fetch todos from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/todos")
      .then((response) => setTodos(response.data))
  }, []);

  // Add a new todo
  const addTodo = () => {
    axios
      .post("http://localhost:5000/todos", { title: inputText })
      .then((response) => setTodos([...todos, response.data]));
    setInputText("");
  };

  // Delete a todo
  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:5000/todos/${id}`)
      .then(() => setTodos(todos.filter((todo) => todo._id !== id)));
  };

  // Save the updated todo (edit)
  const saveEditTodo = (id) => {
    axios
      .put(`http://localhost:5000/todos/${id}`, { title: editingText })
      .then((response) => {
        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, title: response.data.title } : todo
          )
        );
        setEditingId(null); // Close the editing mode
        setEditingText(""); // Reset the editing text
      });
  };

  // Start editing a todo
  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditingText(todo.title); // Set the current text to the editing input
  };

  return (
    <div className="container">
      <h1>TODO LIST</h1>
      <div className="inputContainer">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          type="text"
          placeholder="Enter your todos"
          className="inputBox"
        />
        <button onClick={addTodo} className="add"><IoMdAdd size={20}/></button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <div>
            {todo.completed ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}


              {/* If editing this todo, show input, otherwise just show the title */}
              {editingId === todo._id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
              ) : (
                <span>{todo.title}</span>
              )}
            </div>
            <div>
              <button className="delete" onClick={() => deleteTodo(todo._id)}>
                <MdDelete />
              </button>
              {editingId === todo._id ? (
                <button className="save" onClick={() => saveEditTodo(todo._id)}>
                  <FaSave/>
                </button>
              ) : (
                <button className="edit" onClick={() => startEditing(todo)}>
                  <MdEdit />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
