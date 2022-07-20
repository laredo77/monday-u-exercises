import style from "./AddItemBar.module.css";

const MAX_ITEMS = 35;
const MAX_CHARS = 30;

function AddItemBar(props) {

    const onChangeInputLine = (event) => {
        props.SetInputLineValue(event.target.value);
    }

    const onKeyPress = (event) => {
        if (event.key === "Enter") addNewItem();
    }
    
    const addNewItem = async () => {
        if (props.InputValue.trim().length === 0)
            props.SetConsoleLine("Undefined input: Cannot add blank item");
        else if (props.ItemsList.length === MAX_ITEMS)
            props.SetConsoleLine("ToDo list is full (35 Items)");
        else if (props.InputValue.length >= MAX_CHARS)
            props.SetConsoleLine("Cannot add item with more then 30 letters length");
        else
            await props.AddNewItem(props.InputValue);
        props.SetInputLineValue("");
    }

    return (
        <div className={style.addItemBar}>
            <input id="input" type="text" placeholder="Task to be done.."
            onChange={onChangeInputLine} onKeyPress={onKeyPress} value={props.InputValue}></input>
            <button id="addItemBar" onClick={addNewItem}>Add</button>
        </div>
    )
}

export default AddItemBar;
