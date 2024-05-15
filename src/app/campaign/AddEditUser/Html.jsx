import React, { useState } from "react";
import methodModel from "@/methods/methods";
import Layout from "@/app/components/global/layout";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import ApiClient from "@/methods/api/apiClient";
import '../style.scss';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import MultiSelectDropdown from "@/app/components/common/MultiSelectDropdown";

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ id, role, form, affiliateData, handleSubmit, setform, submitted, images, imageResult, getError, setEyes, eyes, back, emailCheck, emailErr, emailLoader }) => {

    const [loaderr, setLoader] = useState()
    const [imgLoder, setImgLoder] = useState()
    const [loadViderr, setVidLoader] = useState()
    const [vidLoder, setvidLoder] = useState()
    const [loadDocerr, setDocLoader] = useState()
    const [docLoder, setDocLoder] = useState()

    const handleRemove = (valueToRemove) => {
        const updatedValues = form?.event_type?.filter((value) => value !== valueToRemove);
        setform({ ...form, event_type: updatedValues });
    };

    const uploadImage = async (e, key) => {
        let files = e.target.files
        let i = 0
        let imgfile = []
        for (let item of files) {
            imgfile.push(item)
        }

        setLoader(true)
        for await (let item of imgfile) {
            let file = files.item(i)
            let url = 'upload/image?modelName=campaign'

            const res = await ApiClient.postFormData(url, { file: file })
            if (res.success) {
                let path = res?.data?.fullpath
                if (form?.images.length <= 9) {
                    form?.images?.push({
                        name: `images/campaign/${path}`,
                        url: `images/campaign/${path}`
                    })
                }
            }
            i++
        }
        setLoader(false)
        setImgLoder(false)
    }

    // const uploadImage = async (e, key) => {
    //     let files = e.target.files;
    //     let imgfile = Array.from(files);
      
    //     setLoader(true);
      
    //     const promises = imgfile.map(async (file) => {
      
    //       const formData = new FormData();
    //       formData.append('file', file);
      
    //       try {
    //         const res = await axios.post(`${environment?.api}/upload/image?modelName=campaign`, formData, {
    //           headers: {
    //             'Content-Type': 'multipart/form-data',
    //           },
    //         });
      
    //         if (res.data.success) {
    //           let path = res.data.data.fullpath;
    //           if (form.images.length <= 10) {
    //             setform((prevForm) => ({
    //               ...prevForm,
    //               images: [
    //                 ...prevForm.images,
    //                 {
    //                   name: `images/campaign/${path}`,
    //                   url: `images/campaign/${path}`,
    //                 },
    //               ],
    //             }));
    //           }
    //         }
    //       } catch (error) {
    //         console.error('Upload error:', error);
    //       }
    //     });
      
    //     try {
    //       await Promise.all(promises);
    //     } catch (error) {
    //       console.error('Multiple file upload error:', error);
         
    //     }
      
    //     setLoader(false);
    //     setImgLoder(false);
    //   };
      

    const uploadVideos = async (e, key) => {
        console.log('enter');
        let files = e.target.files
        let i = 0
        let imgfile = []
        for (let item of files) {
            imgfile.push(item)
        }

        setVidLoader(true)
        for await (let item of imgfile) {
            let file = files.item(i)
            let url = 'upload/video/multiple?modelName=videos'

            const res = await ApiClient.postFormData(url, { file: file })
            if (res.success) {
                let path = res?.data?.videoPath
                let items = path?.map((itm) => {
                    return itm
                })
                if (form?.videos.length <= 9) {
                form?.videos?.push({
                    name: `videos/${items}`,
                    url: `videos/${items}`
                })
            }
            }
            i++
        }
        setVidLoader(false)
        setvidLoder(false)
        // setVdo(false)
    }

    const uploadDocument = async (e, key) => {
        console.log('enter');
        let files = e.target.files
        let i = 0
        let imgfile = []
        for (let item of files) {
            imgfile.push(item)
        }

        setDocLoader(true)
        for await (let item of imgfile) {
            let file = files.item(i)
            let url = 'upload/document'

            const res = await ApiClient.postFormData(url, { file: file })
            if (res.success) {
                let path = res?.data?.imagePath
                if (form?.documents?.length <= 9) {    
                form?.documents?.push({
                    name: `documents/${path}`,
                    url: `documents/${path}`
                })
            }
            }
            i++
        }
        setDocLoader(false)
        setDocLoder(false)
        // setVdo(false)
    }


    const removeVideo = (index, key) => {
        const filterVid = form?.videos?.length > 0 && form.videos.filter((data, indx) => {
            return index != indx
        })
        setform({ ...form, videos: filterVid })
    }

    const removeDocument = (index, key) => {
        const filterVid = form?.documents?.length > 0 && form.documents.filter((data, indx) => {
            return index != indx
        })
        setform({ ...form, documents: filterVid })
    }

    const remove = (index, key) => {
        const filterImg = form?.images.length > 0 && form.images.filter((data, indx) => {
            return index != indx
        })
        setform({ ...form, images: filterImg })
    }

    return <>
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Camapaign"} filters={undefined}>
            <form onSubmit={handleSubmit}>
                <div className="sidebar-left-content">
                    <div className=" pprofile1 card card-shadow p-4">
                        <div className="">
                            <div className="main_title_head profile-card">

                                <h3 className='VieUser'>
                                    <a to="/campaign" onClick={e => back()}>  <i className="fa fa-arrow-left mr-2 " title='Back' aria-hidden="true"></i></a>
                                    {form && form.id ? 'Edit' : 'Add'} Campaign</h3>
                                <hr></hr>
                            </div>
                            <div className="form-row">
                                <div className="col-md-6 mb-3">
                                    <label>Name<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.name}
                                        onChange={e => setform({ ...form, name: e.target.value })}
                                    />
                                    {submitted && !form?.name ? <div className="invalid-feedback d-block">Name is Required</div> : <></>}
                                </div>
                               
                                <div className="col-md-6 mb-3">
                                    <label>Type<span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Type"
                                            intialValue={form?.access_type}
                                            // disabled={(form?.status == "rejected" || !id) ? false : true}
                                            result={e => {
                                                setform({ ...form, access_type: e.value })
                                            }}
                                            options={[{
                                                id:"public",name:"Public"
                                            },{
                                                id:"private",name:"Private"
                                            }]}
                                        />
                                    </div>
                                    {submitted && !form?.access_type ? <div className="invalid-feedback d-block">Access Type is Required</div> : <></>}
                                </div>
                                {form?.access_type == "private" && <div className="col-md-6 mb-3">
                                    <label>Affiliate<span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="fullName"
                                            placeholder="Select Affiliate"
                                            intialValue={form?.affiliate_id}
                                            disabled={(form?.status == "rejected" || !id) ? false : true}
                                            result={e => {
                                                setform({ ...form, affiliate_id: e.value })
                                            }}
                                            options={affiliateData}
                                        />
                                    </div>
                                    {submitted && !form?.affiliate_id ? <div className="invalid-feedback d-block">Affiliate is Required</div> : <></>}
                                </div>}
                                <div className="col-md-6 mb-3">
                                    <label>Event Type:<span className="star">*</span></label>
                                    <div className="select_row">
                                        <MultiSelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Type"
                                            intialValue={form?.event_type}
                                            disabled={!id? false : true}
                                            result={e => {
                                                setform({ ...form, event_type: e.value })
                                            }}
                                            options={[
                                                { id: 'lead', name: 'Lead' },
                                                { id: 'visitor', name: 'Visitor' },
                                                { id: 'purchase', name: 'Purchase' },
                                                // { id: 'line-item', name: 'Line-item' }
                                            ]}
                                        />
                                        {form?.event_type?.length > 0 && <div className="selected_offrs_market">
                                            {form?.event_type?.map((value, index) => (
                                                <span key={index}>
                                                    {value} <i className="fa fa-times" onClick={() => handleRemove(value)}></i>
                                                </span>
                                            ))}
                        </div>}
                                    </div>
                                    {submitted && !form?.event_type ? <div className="invalid-feedback d-block">Event type is Required</div> : <></>}
                                </div>
                                <div className="col-md-6">
                                    <label>Target URL</label>
                                    <input
                                        type="text"
                                        className="form-control w-100"
                                        value="https://upfilly.com/"
                                        disabled
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Amount<span className="star">*</span></label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="0"
                                        name="amount"
                                        value={form?.amount}
                                        onChange={(e) => {
                                            const enteredValue = e.target.value;
                                            const regex = /^[0-9]*$/;
                                            if (enteredValue === '' || regex.test(enteredValue)) {
                                                setform({ ...form, amount: enteredValue });
                                            }
                                        }}
                                    />
                     {submitted && !form?.amount ? <div className="invalid-feedback d-block">Amount is Required</div> : <></>}
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label>Description<span className="star">*</span></label>
                                    {/* <Editor  apiKey='e9b46x5ebse3zswyqxc5gpl8b5zzduu2ziq9r75c2s91ytpe' textareaName='content' value={form?.description ? form?.description : ''} className='tuncketcls'
                                        onEditorChange={(newValue, editor) => {
                                            setform({ ...form, description: newValue })
                                        }}

                                        init={{
                                            selector: 'textarea#autocompleter-cardmenuitem',
                                            height: 250,
                                        }}
                                    /> */}
                                   {affiliateData && <DynamicReactQuill
                                        theme="snow"
                                        value={form?.description ? form?.description : ''}
                                       
                                        onChange={(newValue, editor) => {
                                            setform({ ...form, description: newValue })
                                        }}
                                        className='tuncketcls'
                                        modules={{
                                            toolbar: [
                                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                [{ size: [] }],
                                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                                { 'indent': '-1' }, { 'indent': '+1' }],
                                                ['link', 'image', 'video'],
                                                ['clean']
                                            ],
                                        }}
                                        formats={[
                                            'header', 'font', 'size',
                                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                                            'list', 'bullet', 'indent',
                                            'link', 'image', 'video'
                                        ]}
                                        bounds={'.app'}
                                    />}
                                    {submitted && !form?.description ? <div className="invalid-feedback d-block">Description is Required</div> : <></>}
                                </div>
                                {/* <div className='col-md-6'>
                                    <label>Images (Max. Limit 10) </label>
                                    <div className="form-group drag_drop">
                                        <div className='upload_file'>
                                           {form?.images?.length <= 9 && <><button className="btn btn-primary upload_image">Upload Image</button>
                                            <input type="file" className="form-control-file over_input" accept="images/*" multiple={true}
                                                // disabled={loader}
                                                onChange={(e) => {
                                                    setImgLoder(true)
                                                    uploadImage(e, 'images');
                                                }} /></>}
                                            {loaderr && imgLoder ? <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}
                                            <div className="imagesRow mt-4 img-wrappper">
                                                {form?.images && form?.images?.map((itm, i) => {
                                                    return <div className="imagethumbWrapper" key={i}>
                                                        <img src={methodModel?.noImg(itm?.url)} className="thumbnail" />
                                                        <i className="fa fa-times kliil" title="Remove" onClick={e => remove(i)}></i>
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                                {/* <div className='col-md-6'>
                                    <label>Videos (Max. Limit 10)   </label>
                                    <div className="form-group drag_drop">
                                        <div className='upload_file'>
                                           {form?.videos?.length <= 9 && <><button className="btn btn-primary upload_image">Upload Video</button>
                                            <input type="file" className="form-control-file over_input" accept="video/*" multiple={true}
                                                // disabled={loader}
                                                onChange={(e) => {
                                                    setvidLoder(true)
                                                    uploadVideos(e, 'images');
                                                }} /></>}
                                            {loadViderr && vidLoder ? <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}
                                            <div className="imagesRow mt-4">
                                                {form?.videos && form?.videos.map((itm, i) => {
                                                    return <div className="imagethumbWrapper videowrapper" key={i}>
                                                        <video width="150" height="100" controls className="mr-3">
                                                            <source src={methodModel.noImg(itm?.url)} type="video/mp4">
                                                            </source>
                                                        </video>
                                                        <i className="fa fa-times kliil" title="Remove" onClick={e => removeVideo(i)}></i>
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                                <div className='col-md-6'>
                                    <label>Document(Max. Limit 10)  </label>
                                    <div className="form-group drag_drop">
                                        <div className='upload_file'>
                                           {form?.documents?.length <= 9 && <><button className="btn btn-primary upload_image">Upload Document</button>
                                            <input type="file" className="form-control-file over_input" accept=".doc,.docx,.xml,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" multiple={true}
                                                // disabled={loader}
                                                onChange={(e) => {
                                                    setDocLoder(true)
                                                    uploadDocument(e, 'images');
                                                }} /></>}
                                            {loadDocerr && docLoder ? <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}
                                            <div className="imagesRow mt-4 img-wrappper">
                                                {form?.documents && form?.documents.map((itm, i) => {
                                                    return <div className="imagethumbWrapper cover" key={i}>
                                                        <img src="/assets/img/document.png" className="thumbnail" onClick={() => window.open(methodModel.noImg(itm?.url))} />
                                                        <i className="fa fa-times kliil" title="Remove" onClick={e => removeDocument(i)}></i>
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>


                            <div className="text-right edit-btns">

                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Layout>
    </>
}

export default Html