import { useState, useEffect } from "react";
import "./App.css";
import Todo from "./components/Todo/Todo";
import TodoList from "./components/TodoList/TodoList";
import Title from "./components/Background/Title/Title";
import BackgroundAnimation from "./components/Background/BackgroundAnimation/BackgroundAnimation";
function App() {
  return (
    <div className="App">
      <BackgroundAnimation></BackgroundAnimation>
      <Title></Title>
      <TodoList></TodoList>
    </div>
  );
}

export default App;
