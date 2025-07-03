import React, { useState } from "react";
import methodModel from "@/methods/methods";
import Layout from "@/app/components/global/layout";
import rolesModel from "@/models/role.model";
import ApiClient from "@/methods/api/apiClient";
import "../style.scss";
// import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

const DynamicReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Html = ({
  role,
  form,
  handleSubmit,
  setform,
  submitted,
  images,
  imageResult,
  getError,
  setEyes,
  eyes,
  back,
  emailCheck,
  emailErr,
  emailLoader,
}) => {
  // const [loaderr, setLoader] = useState()
  // const [imgLoder, setImgLoder] = useState()
  // const [loadViderr, setVidLoader] = useState()
  // const [vidLoder, setvidLoder] = useState()
  const [loadDocerr, setDocLoader] = useState();
  const [docLoder, setDocLoder] = useState();

  const uploadDocument = async (e, key) => {
    // console.log('enter');
    let files = e.target.files;
    let i = 0;
    let imgfile = [];
    for (let item of files) {
      imgfile.push(item);
    }

    setDocLoader(true);
    for await (let item of imgfile) {
      let file = files.item(i);
      let url = "upload/document";

      const res = await ApiClient.postFormData(url, { file: file });
      if (res.success) {
        let path = res?.data?.imagePath;
        form?.documents?.push({
          name: `documents/${path}`,
          url: `documents/${path}`,
        });
      }
      i++;
    }
    setDocLoader(false);
    setDocLoder(false);
    // setVdo(false)
  };

  const removeDocument = (index, key) => {
    const filterVid =
      form?.documents?.length > 0 &&
      form.documents.filter((data, indx) => {
        return index != indx;
      });
    setform({ ...form, documents: filterVid });
  };

  return (
    <>
      <Layout
        handleKeyPress={undefined}
        setFilter={undefined}
        reset={undefined}
        filter={undefined}
        name={"CampaignManagement"}
        filters={undefined}
      >
        <form onSubmit={handleSubmit}>
          <div className="pprofile1">
            <h3 className="ViewUser">
              {form && form.id ? "Edit" : "Add"}{" "}
              {role ? rolesModel.name(role) : "Campaign"}
            </h3>
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label>
                  Name<span className="star">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setform({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-12 mb-3">
                <label>
                  Description<span className="star">*</span>
                </label>
                <DynamicReactQuill
                  theme="snow"
                  value={form?.description ? form?.description : ""}
                  onChange={(newValue, editor) => {
                    setform({ ...form, description: newValue });
                  }}
                  className="tuncketcls"
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                      ["link", "image", "video"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "font",
                    "size",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "indent",
                    "link",
                    "image",
                    "video",
                  ]}
                  bounds={".app"}
                />
              </div>

              <div className="col-md-6">
                <label>Document </label>
                <div className="form-group drag_drop">
                  <div className="upload_file">
                    <button className="btn btn-primary upload_image">
                      Upload Document
                    </button>
                    <input
                      type="file"
                      className="form-control-file over_input"
                      accept=".doc,.docx,.xml,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      multiple={true}
                      // disabled={loader}
                      onChange={(e) => {
                        setDocLoder(true);
                        uploadDocument(e, "images");
                      }}
                    />
                    {loadDocerr && docLoder ? (
                      <div className="text-success text-center mt-5 top_loading">
                        Uploading... <i className="fa fa-spinner fa-spin"></i>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="imagesRow mt-4">
                      {form?.documents &&
                        form?.documents.map((itm, i) => {
                          return (
                            <div className="imagethumbWrapper cover" key={i}>
                              <img
                                src="/assets/img/document.png"
                                className="thumbnail"
                                onClick={() =>
                                  window.open(methodModel.noImg(itm?.url))
                                }
                              />
                              <i
                                className="fa fa-times kliil"
                                title="Remove"
                                onClick={(e) => removeDocument(i)}
                              ></i>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right edit-btns">
              <button
                type="button"
                className="btn btn-secondary discard mr-2 back-btn"
                onClick={(e) => back()}
              >
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default Html;
