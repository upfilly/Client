"use client"

import React, { forwardRef, useRef, useImperativeHandle} from 'react';
import EmailEditor from 'react-email-editor';
import { toast } from 'react-toastify';

const EmailEditorTemplate = ({ state, setstate ,exportHtml,emailEditorRef}) => {

console.log(emailEditorRef,"lklkjkkl")
  const onReady = (unlayer) => {
    unlayer.setAppearance({
      theme: 'modern_light',
      panels: {
        tools: {
          dock: 'left'
        }
      },
    });
    const templateJson = state?.textJSONContent || '{}';
    emailEditorRef.current.editor.loadDesign(templateJson);
  };

  const loadSelectedDesign = (design) => {
    // console.log("loadSelectedDesign", design);
    if (emailEditorRef.current && emailEditorRef.current.editor)
      emailEditorRef.current.editor.loadDesign(design);
  };

  return (
      <div className='decbx'>
        <div className='text-right mb-3'>
          <button className='btn btn-primary invisible' onClick={exportHtml} type='button'>Export HTML</button>
        </div>
     <div className='descrption_multi '>
        <EmailEditor
          projectId={239054}
          ref={emailEditorRef}
          onReady={onReady}
          // onLoad={onLoad}
          initialContent={state?.textContent}
        />
     </div>
      </div>
    
  );
};

export default EmailEditorTemplate;


