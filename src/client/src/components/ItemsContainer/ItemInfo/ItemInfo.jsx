import style from "./ItemInfo.css";

function ItemInfo(props) {

    return (props.Trigger) ? (
    <div id="popup-container" className="popup-container" onClick={() => props.SetTrigger(false)}>
        <div className="popup-content">
            <span className="popup-close-btn" onClick={() => props.SetTrigger(false)}>&times;</span>
            <div className="img-container" id="img-container">
                <img className="updateImg" id="updateImg" src={props.Pokemon.img} alt=""/>
            </div>
            <div className="detail-container">
                <div className="title-container" id="title-container">
                    <h3 className="name text-center" id="updateName">
                        {props.Pokemon.name}
                    </h3>
                    <hr className="seperator" id="seperator" />
                </div>
                <div className="attribute-container" id="attribute-container">
                    <div className="attributes-title" id="attributes-title">
                        <small className="attribute-title">Type</small>
                        <small className="attribute-title">Weight</small>
                        <small className="attribute-title">Height</small>
                    </div>
                    <div className="attributes-value" id="attributes-title">
                        <small className="attribute-value" id="updateType">
                            {props.Pokemon.type}
                        </small>
                        <small className="attribute-value" id="updateWeight">
                            {props.Pokemon.weight}
                        </small>
                        <small className="attribute-value" id="updateHeight">
                            {props.Pokemon.height}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    ) : "";
}

export default ItemInfo;