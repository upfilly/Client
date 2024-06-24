'use client'
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import Layout from '../components/global/layout';
import { toast } from 'react-toastify';
const Emaileditor =forwardRef( ({state,setstate},ref) => {
  const emailEditorRef = useRef(null);

  useImperativeHandle(ref, () => ({
    export_to_html: exportHtml,
  }));

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;
  
    if (unlayer) {
      unlayer.exportHtml((data) => {
        const { design, html } = data;
        console.log('exportHtml', html);
  
        if (html) {
          setstate((prev) => ({
            ...prev,
            textContent: html,
            textJSONContent: design || {}
          }));
          toast.success('Data Exported Successfully')
        }
      });
    } else {
      console.error('Unlayer editor not available');
    }
  };
  

  const onLoad = () => {
    // editor instance is created
    // you can load your template here;
    const templateJson = state?.textJSONContent||'{}'
        emailEditorRef.current.editor.loadDesign(templateJson);
  }

  const onReady = (unlayer) => {
    unlayer.setAppearance({
      theme: 'modern_light',
      panels: {
        tools: {
          dock: 'left'
        }
      },
    });
  };

  const loadSelectedDesign = (design) => {
    console.log("loadSelectedDesign", design);
    // does not work:
    if (emailEditorRef.current && emailEditorRef.current.editor)
      emailEditorRef.current.editor.loadDesign(design);
  }
  


  return (

      <div className='col-md-12'>
     <div className='decbx'>
    <div className='text-right mb-3'>
    <button className='btn btn-primary' onClick={exportHtml} type='button'>Export HTML</button>
    </div>
     <EmailEditor ref={emailEditorRef} onReady={onReady} onLoad={onLoad} initialContent={state?.textContent}/>
     </div>
      </div>

  )
}
)

export default Emaileditor