import React, {useState} from "react";
import styles from "../../App.module.css"

const HtmlCode  = () => {

    const [html] = useState(
        ()=>{
            const localData = localStorage.getItem("unlayer-exported-html"); //Load exported HTML
            return localData ? localData : [];
        }
    );

    return <div className={styles.htmlWrapper}>
        {html}
    </div>
}

export default HtmlCode;
