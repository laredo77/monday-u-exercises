import { useState } from "react";
import "./App.css";
import ItemsContainer from "./components/ItemsContainer/ItemsContainer";
import Title from "./components/Background/Title/Title";
import BackgroundAnimation from "./components/Background/BackgroundAnimation/BackgroundAnimation";
import ItemInfo from "./components/ItemsContainer/ItemInfo/ItemInfo";

function App() {
  const [popupBox, setPopupBox] = useState(false);
  const [pokemon, setPokemon] = useState({
    name: "",
    type: "",
    img: "",
    weight: "",
    height: "",
  });

  return (
    <div className="App">
      <BackgroundAnimation></BackgroundAnimation>
      <Title></Title>
      <ItemsContainer
        Trigger={popupBox}
        SetTrigger={setPopupBox}
        Pokemon={pokemon}
      ></ItemsContainer>
      <ItemInfo
        Trigger={popupBox}
        SetTrigger={setPopupBox}
        Pokemon={pokemon}
      ></ItemInfo>
    </div>
  );
}

export default App;
