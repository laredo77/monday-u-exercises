import PropTypes from 'prop-types';
import style from "./Item.module.css";
import Client from "../../../ItemClients";

function Item(props) {

    const onDeleteItem = async () => {
        const resultFromServer = await Client.deleteItem(props.ItemName);
        if ((await resultFromServer.status) == true) {
            let itemIndex = -1;
            for (let i = 0; i < props.ItemsList.length; i++) {
                if (props.ItemsList[i].ItemName == props.ItemName) itemIndex = i;
            }
            props.ItemsList.splice(itemIndex, 1)
            props.SetItemsList([...props.ItemsList]);
            if (props.ItemsList.length % 5 === 0 && props.CurrentPage > 1) {
                const newCurrentPage = props.CurrentPage - 1;
                props.SetCurrentPage(newCurrentPage);
            }
        }
        props.SetConsoleLine(resultFromServer.code);
    }

    const onChangeItemStatus = async (event) => {
        props.SetConsoleLine(props.status);
        const resultFromServer = await Client.changeItemStatus(
            {ItemName: props.ItemName, status: event.target.checked});
        for(const item of props.ItemsList) {
            if (item.ItemName === props.ItemName) {
                item.status = !event.target.checked;
            }
        }
        props.SetConsoleLine(resultFromServer.code);
    }

    const onClickedItem = async () => {
        const itemTokens = props.ItemName.split(" ");
        const resultFromServer = await Client.fetchPokemon(itemTokens[1]);
        props.Pokemon.name = resultFromServer.name;
        props.Pokemon.type = resultFromServer.types[0].type.name;
        props.Pokemon.img = resultFromServer.sprites.other.dream_world.front_default;
        props.Pokemon.weight = resultFromServer.weight / 10;
        props.Pokemon.height = resultFromServer.height / 10;
        props.SetTrigger(true);
    }

    return (
        <div className={style.item}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" />
            <input className={style.checkbox} checked={props.status} type="checkbox" id="checkbox"
            onChange={onChangeItemStatus}/>
            <span className={style.itemname} id="taskname" onClick={onClickedItem}>{props.ItemName}</span>
            <button className={"delete"} onClick={() => onDeleteItem()}>
                <i className="far fa-trash-alt"></i>
            </button>
        </div>
    )
}

Item.propTypes = {
    ItemName: PropTypes.string,
    status: PropTypes.bool
}

export default Item;

