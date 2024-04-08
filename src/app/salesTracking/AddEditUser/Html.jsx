import React, { useState } from "react";
import methodModel from "@/methods/methods";
import Layout from "@/app/components/global/layout";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import ApiClient from "@/methods/api/apiClient";
import '../style.scss';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import dynamic from 'next/dynamic';
import ImageUpload from "@/app/components/common/ImageUpload";

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ id, BrandData, form, affiliateData, handleSubmit, setform, submitted, images, imageResult, getError, setEyes, eyes, back, emailCheck, emailErr, emailLoader }) => {

    const [loaderr, setLoader] = useState()
    const [imgLoder, setImgLoder] = useState()
    const [loadViderr, setVidLoader] = useState()
    const [vidLoder, setvidLoder] = useState()
    const [loadDocerr, setDocLoader] = useState()
    const [docLoder, setDocLoder] = useState()

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
                                    {form && form.id ? 'Edit' : 'Add'} Untracked Sales</h3>
                                <hr></hr>
                            </div>
                            <div className="form-row">
                                <div className="col-md-6 mb-3">
                                    <label>Title<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.name}
                                        onChange={e => setform({ ...form, name: e.target.value })}
                                    />
                                    {submitted && !form?.name ? <div className="invalid-feedback d-block">Name is Required</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Select Brand<span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="brand_name"
                                            placeholder="Select Affiliate"
                                            intialValue={form?.brand_id}
                                            // disabled={(form?.status == "rejected" || !id) ? false : true}
                                            result={e => {
                                                setform({ ...form, brand_id: e.value })
                                            }}
                                            options={BrandData}
                                        />
                                    </div>
                                    {submitted && !form?.affiliate_id ? <div className="invalid-feedback d-block">Affiliate is Required</div> : <></>}
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label>Description<span className="star">*</span></label>
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

                                <div className="col-md-6 mt-3">
                                    <label className='lablefontcls'>Image</label><br></br>
                                    <ImageUpload model="users" result={e => imageResult(e, 'image')} value={form?.image} multiple={false} />
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