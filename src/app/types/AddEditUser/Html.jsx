import React from "react";
import ImageUpload from "@/app/components/common/ImageUpload";
import Layout from "@/app/components/global/layout";
import rolesModel from "@/models/role.model";
import SelectDropdown from "@/app/components/common/SelectDropdown";

const Html = ({  form, handleSubmit, setform, submitted, images, imageResult, getError,back }) => {
    return <>
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
            <form onSubmit={handleSubmit}>
                <div className="pprofile1">
                    <h3 className='ViewUser'>{form && form.id ? 'Edit' : 'Add'} Type</h3>
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

                        {/* <div className="col-md-6  mb-3">
                            <label className='lablefontcls'>Image</label><br></br>
                            <ImageUpload model="users" result={e => imageResult(e, 'image')} value={images.image || form.image} multiple={false} />
                        </div> */}

                    </div>


                    <div className="text-right">
                        <button type="button" className="btn btn-secondary discard mr-2" onClick={e=>back()}>Back</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </div>

            </form>
        </Layout>
    </>
}

export default Html