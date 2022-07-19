import { useState, useEffect } from "react";
import Item from "./Item/Item";
import AddItemkBar from "./AddItemBar/AddItemBar";
import ButtonsBar from "./ButtonsBar/ButtonsBar";
import Pagination from "./Pagination/Pagination";
import ItemList from "./ItemList/ItemList";
import style from "./ItemsContainer.module.css";

function ItemsContainer() {
    const [inputValue, setInputValue] = useState("");
    const [itemsList, setItemsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;
    let currentPageItems = itemsList.slice(
        ((currentPage - 1) * itemsPerPage), (currentPage * itemsPerPage));

    useEffect(() => {
      initClient();
    }, []);
  
    const initClient = async () => {
      //const tasks = await Client.getAllTasks();
      const tasks = [];
      setItemsList(tasks);
    };


    // // check if string is valid pokemon id: positive integer
    // const isValidPokemonId = (str) => {
    //     if (!isNaN(str) && parseInt(Number(str)) == str &&
    //         !isNaN(parseInt(str, 10)) && str > 0 && str < 900) return true;
    //     return false;
    // }

    // // check if the input was a commas separated string
    // const checkForCommas = (str) => {
    //     if (str.indexOf(",") > -1) {
    //         let nanFlag = false; // in case str is not a number
    //         const tokens = str.split(",");
    //         for (const token of tokens)
    //             if (!isValidPokemonId(token)) nanFlag = true;
    //         if (!nanFlag) {
    //             // in case all the tokens are numbers then
    //             // check again the string and fetching pokemons
    //             // if not, just post the string as is
    //             return tokens;
    //         }
    //     }
    //     return str;
    // }

    const addNewItem = async (itemName) => {
        itemsList.push({ItemName: itemName, PokemonId: null, status: null});
        setItemsList([...itemsList]);
        const lastPage = Math.ceil(itemsList.length / 5);
        if (lastPage > currentPage)
            setCurrentPage(lastPage);
        // send to server the data
    }


    return (
        <div className={style.itemsContainer}>
            <AddItemkBar
            SetItemsList={setItemsList}
            SetInputLineValue={setInputValue}
            InputValue={inputValue}
            ItemsList={itemsList}
            CurrentPage={currentPage}
            SetCurrentPage={setCurrentPage}
            AddNewItem={addNewItem}
            ></AddItemkBar>
            <ButtonsBar></ButtonsBar>
            <ItemList 
            CurrentPageItems={currentPageItems}
            ItemsList={itemsList}
            SetItemsList={setItemsList}
            ></ItemList>
            <Pagination 
            ItemsList={itemsList}
            SetCurrentPage={setCurrentPage}
            CurrentPage={currentPage}></Pagination>
        </div>
    )
}

export default ItemsContainer;