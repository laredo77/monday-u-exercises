import style from "./ButtonsBar.css";
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
        props.SetConsoleLine(resultFromServer.code);
    }

    return (
        <div className="buttonsBar">
            <div className="terminalContainer">
                <div className="fakeMenu">
                    <div className="fakeButtons fakeClose"></div>
                    <div className="fakeButtons fakeMinimize"></div>
                    <div className="fakeButtons fakeZoom"></div>
                </div>
                <div className="fakeScreen">
                    <p className="line1">{'>'} {props.ConsoleLine}<span className="cursor1">_</span></p>
                </div>
            </div>
            <button id="deleteAll" onClick={deleteAll}>Delete All</button>
        </div>
    )
}

export default ButtonsBar;