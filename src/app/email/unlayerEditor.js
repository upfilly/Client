import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from "react-router";
import styles from './Editor.module.css';
import sample from '../../sample.json';
import WebEditor from '../script/unlayer';

const UnlayerEditor = (props) => {
    const emailEditorRef = useRef(null); //Ref for editor usage
    const exportedJsonDesignLocalKey = 'unlayer-exported-Json';//Local key for exported template in JSON
    const lastTemplateName = "last-temp-name"; //Local key for last used template name
    let history = useHistory();

    const [templates, setTemplates] = React.useState( //For all templates storage as array of objects
        () => {
            const localData = localStorage.getItem(exportedJsonDesignLocalKey);
            return localData ? JSON.parse(localData) : [];
        }
    )

    const [currentTemplateName, setCurrentTemplateName] = useState(() => { //For current template name
            const localJson = localStorage.getItem(props.savedJsonDesignLocalKey);
            const localName = localStorage.getItem(lastTemplateName);
            return localJson && localName ? localName : "New Template"
        }
    );

    const [currentTemplate, setCurrentTemplate] = useState(JSON.parse(localStorage.getItem(props.savedJsonDesignLocalKey))); //for current Template JSON
    const [isEditorLoaded, setEditorLoadStatus] = useState(false); //for Editor Load tracking
    const [isComponentMounted, setComponentMountStatus] = useState(false); //for component mount tracking


    useEffect(() => { //For first mount and template reloading
        setComponentMountStatus(true);
        loadTemplate()
    })

    useEffect(() => { //For templates auto save in state
        localStorage.setItem(exportedJsonDesignLocalKey, JSON.stringify(templates));
    }, [templates])

    useEffect(()=> {  //For first template delete case
        if(templates[0] && isComponentMounted){
            setCurrentTemplate(templates[0].Json);
            setCurrentTemplateName(templates[0].title);
            localStorage.setItem(lastTemplateName, templates[0].title);
        }
    }, [templates[0]])

    const exportHtml = (path) => { //Unlayer Export function
        emailEditorRef.current.editor.exportHtml((data) => {
            localStorage.setItem("unlayer-exported-html", data.html);
            localStorage.setItem(currentTemplateName, JSON.stringify(data.design));
            history.push(path);
        });
    };

    const onLoad = () => {
        setEditorLoadStatus(true);
        loadTemplate();
    }

    const loadTemplate = () => {
        if (!isEditorLoaded || !isComponentMounted) return; //Check if Component is mounted & editor loaded
        emailEditorRef.current.editor.addEventListener('design:updated', () => { // Auto save to localStorage
            emailEditorRef.current.editor.saveDesign(function (data) {
                localStorage.setItem(props.savedJsonDesignLocalKey, JSON.stringify(data));// Json data
                localStorage.setItem(lastTemplateName, currentTemplateName);
                saveTemplateJson(data);
            })
        })

        const localData = localStorage.getItem(props.savedJsonDesignLocalKey); // Load design from localStorage
        return localData ? emailEditorRef.current.editor.loadDesign(currentTemplate) : [];
    };

    const deleteTemplate = () => { //Delete current template and switch to first in selector
        if (window.confirm("Are you sure you want to clear template?")) {
            if (templates.length > 1) {
                setTemplates(() => {
                        return templates.filter((el) => {
                                return el.title !== currentTemplateName;
                            }
                        )})
                setCurrentTemplate(templates[0].Json);
                setCurrentTemplateName(templates[0].title);
                localStorage.setItem(lastTemplateName, templates[0].title);
            } else {
                alert("You can't delete last template");
            }
        }
    }

    const saveTemplateJson = (templateJson = sample) => {
        let foundElem = false;

        templates.map((el, index) => {
            if (el.title === currentTemplateName) { // If element exist
                foundElem = true;
                if (templateJson !== sample) { // And if template isn't empty
                    el.Json = templateJson; // rewrite template json
                }
            }
            return el;
        })
        if (!foundElem) { //If the template with the current name is not found - create new
            setTemplates(templates.concat([{
                id: Date.now(),
                title: currentTemplateName,
                Json: templateJson
            }]))
            setCurrentTemplate(templateJson);
        }
        localStorage.setItem(exportedJsonDesignLocalKey, JSON.stringify(templates));
    }

    const onChangeSelectedTemplate = (e) => { //On selected option change
        {
            templates.forEach((el) => { //Display selected template
                    if (el.title === e.currentTarget.value) {
                        setCurrentTemplate(el.Json);
                        setCurrentTemplateName(e.currentTarget.value);
                        localStorage.setItem(props.savedJsonDesignLocalKey, JSON.stringify(el.Json));
                        localStorage.setItem(lastTemplateName, e.currentTarget.value);
                    }
                }
            )

        }
    }

    const externalOptions = { //displayMode & Tags
        displayMode: "web",

        designTags: {
            price: props.price,
            image: props.image
        },
        mergeTags: {
            tag_Content: {
                name: "Tag content",
                mergeTags: {
                    text: {
                        name: "Mustache_value",
                        value: "{{mustache_value}}"
                    },
                    image: {
                        name: "Image",
                        value: props.image
                    }
                }
            },
            content: {
                name: "Content",
                rules: {
                    repeat: {
                        name: "Content and image",
                        before: props.image,
                        after: props.image,
                    }
                }
            }
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <select className={styles.dropDown} value={currentTemplateName} onChange={onChangeSelectedTemplate}>
                    {templates.map((el, index) => (
                        <option key={index} value={el.title}>{el.title}</option>
                    ))}
                </select>
                <input className={styles.nameInput} value={currentTemplateName}
                       onChange={e => setCurrentTemplateName(e.target.value)} onBlur={(e) => {
                    onChangeSelectedTemplate(e);
                    saveTemplateJson();
                }}/>
                <button className={styles.deleteBtn} onClick={deleteTemplate}>Delete template</button>
                <button className={styles.exportBtn} onClick={() => {exportHtml("htmlcode")}}>Get HTML code</button>
                <button className={styles.exportBtn} onClick={() => {exportHtml("consumer")}}>Export HTML</button>
            </div>
            <WebEditor ref={emailEditorRef} onLoad={onLoad} options={externalOptions} style={{marginTop: "50px"}}/>
        </div>
    );
};


export default UnlayerEditor;
