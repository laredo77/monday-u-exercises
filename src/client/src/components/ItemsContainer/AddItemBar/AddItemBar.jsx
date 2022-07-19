import style from "./AddItemBar.module.css";
import Client from "../../../ItemClients";
import ItemsContainer from "../ItemsContainer"

const MAX_ITEMS = 35;

function AddItemBar(props) {

    const onChangeInputLine = (event) => {
        props.SetInputLineValue(event.target.value);
    }

    const onKeyPress = (event) => {
        if (event.key === "Enter") addNewItem();
    }
    
    const addNewItem = async () => {
        if (props.InputValue.trim().length === 0) {
            alert("Undefined input");
        }
        else if (props.ItemsList.length === MAX_ITEMS) {
            alert("ToDo list is full (35 Items)");
        }
        else {
            // const resultFromServer = await Client.addNewTask(props.InputValue);
            // if ((await resultFromServer.status) == false) {
            //     console.log(resultFromServer.code);
            // } else {
            //     console.log(resultFromServer.code);
            //     await ItemsContainer.addNewTaskScheme(resultFromServer.task, props);
            // }
            //const itemList = props.ItemsList;
            await props.AddNewItem(props.InputValue);
            //await ItemsContainer.addNewTaskScheme(props.InputValue, props); // should removed
            //props.SetItemsList([...props.ItemsList, props.InputValue]);
        }
        props.SetInputLineValue("");
    }

    return (
        <div className={style.addItemBar}>
            <input id="input" type="text" placeholder="Task to be done.."
            onChange={onChangeInputLine} onKeyPress={onKeyPress}></input>
            <button id="addItemBar" onClick={addNewItem}>Add</button>
        </div>
    )
}

export default AddItemBar;
