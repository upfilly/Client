import React, { useState } from "react";
import methodModel from "@/methods/methods";
import ImageUpload from "@/app/components/common/ImageUpload";
import Layout from "@/app/components/global/layout";
import rolesModel from "@/models/role.model";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import ApiClient from "@/methods/api/apiClient";
import '../style.scss';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ role, form, handleSubmit, setform, submitted, images, imageResult, getError, setEyes, eyes, back, emailCheck, emailErr, emailLoader }) => {

    const [loaderr, setLoader] = useState()
    const [imgLoder, setImgLoder] = useState()
    const [loadViderr, setVidLoader] = useState()
    const [vidLoder, setvidLoder] = useState()
    const [loadDocerr, setDocLoader] = useState()
    const [docLoder, setDocLoder] = useState()

    const uploadImage = async (e, key) => {
        console.log('enter');
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
                form?.images?.push({
                    name: `images/campaign/${path}`,
                    url: `images/campaign/${path}`
                })

            }
            i++
        }
        setLoader(false)
        setImgLoder(false)
        // setVdo(false)
    }

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
                form?.videos?.push({
                    name: `videos/${items}`,
                    url: `videos/${items}`
                })

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
                form?.documents?.push({
                    name: `documents/${path}`,
                    url: `documents/${path}`
                })

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
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"CampaignManagement"} filters={undefined}>
            <form onSubmit={handleSubmit}>
                <div className="pprofile1">
                    <h3 className='ViewUser'>{form && form.id ? 'Edit' : 'Add'} {role ? rolesModel.name(role) : 'Campaign'}</h3>
                    <div className="form-row">
                        <div className="col-md-6 mb-3">
                            <label>Name<span className="star">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.name}
                                onChange={e => setform({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-md-12 mb-3">
                            <label>Description<span className="star">*</span></label>
                            {/* <Editor apiKey='e9b46x5ebse3zswyqxc5gpl8b5zzduu2ziq9r75c2s91ytpe' textareaName='content' value={form?.description ? form?.description : ''} className='tuncketcls'
                                onEditorChange={(newValue, editor) => {
                                    setform({ ...form, description: newValue })
                                }}

                                init={{
                                    selector: 'textarea#autocompleter-cardmenuitem',
                                    height: 250,
                                }}
                                required
                            /> */}
                               <DynamicReactQuill
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
                                    />
                        </div>
                        <div className='col-md-6'>
                            <label>Images </label>
                            <div className="form-group drag_drop">
                                <div className='upload_file'>
                                    <button className="btn btn-primary upload_image">Upload Image</button>
                                    <input type="file" className="form-control-file over_input" accept="images/*" multiple={true}
                                        // disabled={loader}
                                        onChange={(e) => {
                                            setImgLoder(true)
                                            uploadImage(e, 'images');
                                        }} />
                                    {loaderr && imgLoder ? <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}
                                    <div className="imagesRow mt-4">
                                        {form?.images && form?.images.map((itm, i) => {
                                            return <div className="imagethumbWrapper" key={i}>
                                                <img src={methodModel.noImg(itm?.url)} className="thumbnail" />
                                                <i className="fa fa-times kliil" title="Remove" onClick={e => remove(i)}></i>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-6'>
                            <label>Videos   </label>
                            <div className="form-group drag_drop">
                                <div className='upload_file'>
                                    <button className="btn btn-primary upload_image">Upload Video</button>
                                    <input type="file" className="form-control-file over_input" accept="video/*" multiple={true}
                                        // disabled={loader}
                                        onChange={(e) => {
                                            setvidLoder(true)
                                            uploadVideos(e, 'images');
                                        }} />
                                    {loadViderr && vidLoder ? <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}
                                    <div className="imagesRow mt-4">
                                        {form?.videos && form?.videos.map((itm, i) => {
                                            return <div className="imagethumbWrapper" key={i}>
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
                        </div>

                        <div className='col-md-6'>
                            <label>Document   </label>
                            <div className="form-group drag_drop">
                                <div className='upload_file'>
                                    <button className="btn btn-primary upload_image">Upload Document</button>
                                    <input type="file" className="form-control-file over_input" accept=".doc,.docx,.xml,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" multiple={true}
                                        // disabled={loader}
                                        onChange={(e) => {
                                            setDocLoder(true)
                                            uploadDocument(e, 'images');
                                        }} />
                                    {loadDocerr && docLoder ? <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}
                                    <div className="imagesRow mt-4">
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
                        <button type="button" className="btn btn-secondary discard mr-2 back-btn" onClick={e => back()}>Back</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </div>

            </form>
        </Layout>
    </>
}

export default Html