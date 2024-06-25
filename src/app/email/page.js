import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import EmailEditor from 'react-email-editor';
import { toast } from 'react-toastify';

const Emaileditor = forwardRef(({ state, setstate }, ref) => {
  const emailEditorRef = useRef(null);

  // Imperative handle to expose exportHtml method
  useImperativeHandle(ref, () => ({
    export_to_html: exportHtml,
  }));

  // Export HTML content from the editor
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
          toast.success('Data Exported Successfully');
        }
      });
    } else {
      console.error('Unlayer editor not available');
    }
  };

  // Callback for handling image uploads
  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const imageUrl = '/assets/img/logo.png';
        resolve({ data: { link: imageUrl } });
      }, 2000)
    });
  };

  // Load the editor with initial content and handle editor ready state
  const onLoad = () => {
    const templateJson = state?.textJSONContent || '{}';
    emailEditorRef.current.editor.loadDesign(templateJson);
  };

  // Handle editor being ready
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

  // Load a selected design into the editor (if needed)
  const loadSelectedDesign = (design) => {
    console.log("loadSelectedDesign", design);
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
          ref={emailEditorRef}
          onReady={onReady}
          onLoad={onLoad}
          initialContent={state?.textContent}
          imageUpload={{
            handle: handleImageUpload,
          }}
        />
     </div>
      </div>
    
  );
});

export default Emaileditor;
