import PropTypes from 'prop-types';
import style from "./Item.module.css";

function Item(props) {

    const onDeleteItem = async () => {
        let itemIndex = -1;
        for (let i = 0; i < props.ItemsList.length; i++) {
            if (props.ItemsList[i].ItemName == props.ItemName) itemIndex = i;
        }
        props.ItemsList.splice(itemIndex, 1)
        props.SetItemsList([...props.ItemsList]);
        //await ItemClient.deleteTask(ItemName); // calling server
    }

    const onChangeItemStatus = async () => {
        //props.status = !props.status;
        //console.log(props.ItemName)
        //console.log(props.status);
    }

    return (
        <div className={style.item}>
            <input className={style.checkbox} type="checkbox" id="checkbox"
            onClick={() => onChangeItemStatus()}/>
            <span className={style.itemname} id="taskname">{props.ItemName}</span>
            <button className={"delete"} onClick={() => onDeleteItem()}>
                <i className="far fa-trash-alt"></i>
            </button>
        </div>
    )
}

Item.propTypes = {
    ItemName: PropTypes.string,
    PokemonId: PropTypes.string,
    status: PropTypes.bool
}

export default Item;

