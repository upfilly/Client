import React, {useState} from "react";

const Consumer = (props) => {

    const [html] = useState(
        ()=>{
            const localData = localStorage.getItem("unlayer-exported-html"); //Load exported HTML
            return localData ? localData : [];
        }
    );

    return (
        <div dangerouslySetInnerHTML={{__html: html}}/>
    );
}

export default Consumer;

