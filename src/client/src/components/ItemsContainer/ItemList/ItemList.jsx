import Item from "../Item/Item";
import style from "./ItemList.module.css";

function ItemList(props) {
    return (
        <div className={style.itemList}>
            {props.CurrentPageItems.map((item, index) => {
                return (
                    <Item key={item.ItemName}
                        ItemName={item.ItemName}
                        status={item.status}
                        ItemsList={props.ItemsList}
                        SetItemsList={props.SetItemsList}
                        SetConsoleLine={props.SetConsoleLine}
                        SetCurrentPage={props.SetCurrentPage}
                        CurrentPage={props.CurrentPage}>
                    </Item>
                )
            })}
        </div>
    )
}

export default ItemList;