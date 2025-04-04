"use client"

import React, { forwardRef, useRef, useImperativeHandle} from 'react';
import EmailEditor from 'react-email-editor';
import { toast } from 'react-toastify';

const EmailEditorTemplate = ({ state, setstate }) => {
  const emailEditorRef = useRef(null);

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    if (unlayer) {
      unlayer.exportHtml((data) => {
        const { design, html } = data;
        // console.log('exportHtml', html);

        if (html) {
          setstate((prev) => ({
            ...prev,
            textContent: html,
            textJSONContent: design || {}
          }));
          toast.success('Data Exported Successfully');
        }
      });
    } else {
      // console.error('Unlayer editor not available');
    }
  };

  const onLoad = () => {
   
  };

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
          <button className='btn btn-primary' onClick={exportHtml} type='button'>Export HTML</button>
        </div>
     <div className='descrption_multi'>
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


