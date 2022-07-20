import style from "./ButtonsBar.module.css";
import Client from "../../../ItemClients";
// import Box from "monday-ui-react-core/dist/Box";
// import "monday-ui-react-core/dist/main.css";
// import { DialogContentContainer } from "monday-ui-react-core";

function ButtonsBar(props) {

    const deleteAll = async () => {
        const resultFromServer = await Client.deleteAllItems();
        if ((await resultFromServer.status) == true) {
            props.SetItemsList([]);
            props.SetCurrentPage(1);
        }
        console.log(resultFromServer.code);
    }

    return (
        <div className={style.buttonsBar}>
            <button id="deleteAll" onClick={deleteAll}>Delete All</button>
            {/* <DialogContentContainer size={DialogContentContainer.sizes.LARGE}
            className={style.dialogcontainer}></DialogContentContainer> */}
            {/* <div className={style.alert} role="alert">This</div> */}
        </div>
    )
}

export default ButtonsBar;