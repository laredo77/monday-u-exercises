import { useState, useEffect } from "react";
import "./App.css";
import Item from "./components/ItemsContainer/Item/Item";
import ItemsContainer from "./components/ItemsContainer/ItemsContainer";
import Title from "./components/Background/Title/Title";
import BackgroundAnimation from "./components/Background/BackgroundAnimation/BackgroundAnimation";
import AddItemkBar from "./components/ItemsContainer/AddItemBar/AddItemBar";
import ButtonsBar from "./components/ItemsContainer/ButtonsBar/ButtonsBar";
import Pagination from "./components/ItemsContainer/Pagination/Pagination";
import ItemList from "./components/ItemsContainer/ItemList/ItemList";
import Client from "./ItemClients";

function App() {
  return (
    <div className="App">
      <BackgroundAnimation></BackgroundAnimation>
      <Title></Title>
      <ItemsContainer></ItemsContainer>
    </div>
  );
}

export default App;
