import style from "./ButtonsBar.module.css";

function ButtonsBar() {
    return (
        <div className={style.buttonsBar}>
            <button id="deleteAll">Delete All</button>
        </div>
    )
}

export default ButtonsBar;