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
    const [consoleLine, setConsoleLine] = useState("");

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
        for (const item in resultFromServer.task) {
            //items.push(resultFromServer.task[item]);
            items.push({ItemName: resultFromServer.task[item].ItemName,
                status: Boolean(resultFromServer.task[item].status),
                })
        }  
        setItemsList(items);
      }
      setConsoleLine(resultFromServer.code);
    };

    const addNewItem = async (itemName) => {
        const resultFromServer = await Client.addNewItem(itemName);
        if ((await resultFromServer.status) == true) {
            for (const item of resultFromServer.task)
                itemsList.push({
                    ItemName: item,
                    status: false});
            setItemsList([...itemsList]);
            const lastPage = Math.ceil(itemsList.length / 5);
            if (lastPage > currentPage)
                setCurrentPage(lastPage);
        }
        setConsoleLine(resultFromServer.code);
    }

    return (
        <div className={style.itemsContainer}>
            <AddItemkBar
            SetInputLineValue={setInputValue}
            InputValue={inputValue}
            ItemsList={itemsList}
            AddNewItem={addNewItem}
            SetConsoleLine={setConsoleLine}
            ></AddItemkBar>
            <ButtonsBar 
            SetItemsList={setItemsList}
            SetCurrentPage={setCurrentPage}
            ConsoleLine={consoleLine}
            SetConsoleLine={setConsoleLine}>
            </ButtonsBar>
            <ItemList 
            CurrentPageItems={currentPageItems}
            ItemsList={itemsList}
            SetItemsList={setItemsList}
            SetConsoleLine={setConsoleLine}
            SetCurrentPage={setCurrentPage}
            CurrentPage={currentPage}>
            </ItemList>
            <Pagination 
            ItemsList={itemsList}
            SetCurrentPage={setCurrentPage}
            CurrentPage={currentPage}></Pagination>
        </div>
    )
}

export default ItemsContainer;