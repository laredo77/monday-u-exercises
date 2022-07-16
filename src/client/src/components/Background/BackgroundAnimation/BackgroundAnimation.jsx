import style from "./BackgroundAnimation.css";

function BackgroundAnimation() {
    let g2 = "style.bg bg2";
    let g3 = "style.bg bg3";
    return (
        <div>
            <div className={style.bg}></div>
            <div className={g2}></div>
            <div className={g3}></div>
        </div>
    )
}

export default BackgroundAnimation;