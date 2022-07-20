import { useState, useEffect } from "react";
import AddItemkBar from "./AddItemBar/AddItemBar";
import ButtonsBar from "./ButtonsBar/ButtonsBar";
import Pagination from "./Pagination/Pagination";
import ItemList from "./ItemList/ItemList";
import style from "./ItemsContainer.module.css";
import Client from "../../ItemClients";

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
      const resultFromServer = await Client.getAllItems();
      if ((await resultFromServer.status) == true) {
        const items = [];
        for (const item in resultFromServer.task)
            items.push(resultFromServer.task[item]);
        setItemsList(items);
      }
      console.log(resultFromServer.code);
    };

    const addNewItem = async (itemName) => {
        const resultFromServer = await Client.addNewItem(itemName);
        if ((await resultFromServer.status) == true) {
            for (const item of resultFromServer.task)
                itemsList.push({ItemName: item, PokemonId: null, status: null});
            setItemsList([...itemsList]);
            const lastPage = Math.ceil(itemsList.length / 5);
            if (lastPage > currentPage)
                setCurrentPage(lastPage);
        }
        console.log(resultFromServer.code);
    }

    return (
        <div className={style.itemsContainer}>
            <AddItemkBar
            SetInputLineValue={setInputValue}
            InputValue={inputValue}
            ItemsList={itemsList}
            AddNewItem={addNewItem}
            ></AddItemkBar>
            <ButtonsBar 
            SetItemsList={setItemsList}
            SetCurrentPage={setCurrentPage}></ButtonsBar>
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