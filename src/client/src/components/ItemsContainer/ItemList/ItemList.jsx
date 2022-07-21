import Item from "../Item/Item";
import style from "./ItemList.module.css";

function ItemList(props) {
    return (
        <div className={style.itemList}>
            {props.CurrentPageItems.map((item, index) => {
                return (
                    <Item key={item.ItemName}
                        ItemName={item.ItemName}
                        PokemonId={item.PokemonId}
                        status={item.status}
                        ItemsList={props.ItemsList}
                        SetItemsList={props.SetItemsList}
                        SetConsoleLine={props.SetConsoleLine}
                        SetCurrentPage={props.SetCurrentPage}
                        CurrentPage={props.CurrentPage}
                        Trigger={props.Trigger} 
                        SetTrigger={props.SetTrigger}
                        Pokemon={props.Pokemon}>
                    </Item>
                )
            })}
        </div>
    )
}

export default ItemList;