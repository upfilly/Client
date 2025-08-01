import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ApiClient from "@/methods/api/apiClient";
import datepipeModel from "@/models/datepipemodel";
import loader from "@/methods/loader";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Layout from "@/app/components/global/layout";
import "./style.scss";

const Detail = (p) => {
  const history = useRouter();
  const { id } = useParams();
  const [data, setData] = useState({
    createdAt: "2024-12-17T06:07:07.517Z",
    updatedAt: "2025-04-04T05:41:42.488Z",
    id: "6761150b20f83e94cadcfb28",
    group_name: "ddfdf",
    group_code: "fdjxq6cf7ytf",
    group_type: "affiliate",
    isDefaultAffiliateGroup: false,
    isArchive: false,
    isPreRegisterLeads: false,
    commision: "",
    status: "active",
    isDeleted: false,
    addedBy: "66dab098231607c158aa25be",
    updatedBy: "66dab098231607c158aa25be",
    addedAffiliates: ["simos vlassis", "new affiliate"],
  });
  console.log(data, "groupdetailsdata");

  const getDetail = (did) => {
    loader(true);
    if (did)
      ApiClient.get(`affiliate-group`, { id: did }).then((res) => {
        if (res.success) {
          setData(res.data);
        }
        loader(false);
      });
  };

  const back = () => {
    const searchParams = window.location.search;
    window.location.href = "/group" + searchParams;
  };

  const edit = (id) => {
    let url = `/group/edit/${id}`;
    history.push(url);
  };

  const deleteItem = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.delete(`delete?model=affiliatemanagement&id=${id}`).then(
          (res) => {
            if (res.success) {
              toast.success(res.message);
              history.push(`/group`);
            }
            loader(false);
          }
        );
      }
    });
  };

  useEffect(() => {
    if (id) {
      getDetail(id);
    }
  }, [id]);

  const rediredctView = (id) => {
    let url = `/affiliate/detail/${id}`;
    history.push(url);
  };

  return (
    <Layout>
      <div className="view_page sidebar-left-content ">
        <div className=" card ">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center  gap-3 flex-wrap ">
              <div className="main_title_head">
                <div className="d-flex gap-2 align-items-center group-detail-btn-wrapper ">
                  <button
                    onClick={back}
                    type="button"
                    className="btn  px-2 py-0 "
                  >
                    <i
                      className="fa fa-arrow-left "
                      title="Back"
                      aria-hidden="true"
                    ></i>
                  </button>
                  <h3 className=" ">Group Details </h3>
                </div>
              </div>
              <div>
                <button
                  className="btn btn-primary mr-2 "
                  title="Edit"
                  onClick={(e) => edit(data.id)}
                >
                  <i
                    className="material-icons edit text-white mr-2"
                    title="Edit"
                  >
                    edit
                  </i>
                  Edit
                </button>
                <button
                  className="btn btn-danger br50"
                  onClick={() => deleteItem(data.id)}
                >
                  <i
                    className="material-icons delete text-white mr-2"
                    title="Delete"
                  >
                    {" "}
                    delete
                  </i>
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="main-view-pages ">
              <div className="row">
                <div className=" col-md-12">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-4">
                      <div className="userdata">
                        <p className="headmain">Group Name:</p>
                      </div>
                      <div className="name-dtls">
                        <p className="headsub">{data?.group_name || "N/A"}</p>
                      </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-4">
                      <div className="userdata">
                        <p className="headmain">Group Code:</p>
                      </div>
                      <div className="name-dtls">
                        <p className="headsub">{data?.group_code || "N/A"}</p>
                      </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-4">
                      <div className="userdata">
                        <p className="headmain">Group Type:</p>
                      </div>
                      <div className="name-dtls">
                        <p className="headsub">
                          {data?.group_type
                            ? data.group_type.charAt(0).toUpperCase() +
                              data.group_type.slice(1)
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-4">
                      <div className="userdata">
                        <p className="headmain">Creation Date:</p>
                      </div>
                      <div className="name-dtls">
                        <p className="headsub">
                          {datepipeModel.date(data?.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-4">
                      <div className="userdata">
                        <p className="headmain">Last Updated:</p>
                      </div>
                      <div className="name-dtls">
                        <p className="headsub">
                          {datepipeModel.date(data?.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-4">
                      <div className="userdata">
                        <p className="headmain">Status:</p>
                      </div>
                      <div className="name-dtls">
                        <p className="headsub">
                          {data?.status
                            ? data.status.charAt(0).toUpperCase() +
                              data.status.slice(1)
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-4">
                      <div className="userdata">
                        <p className="headmain">Commission:</p>
                      </div>
                      <div className="name-dtls">
                        <p
                          className="headsub"
                          dangerouslySetInnerHTML={{
                            __html: data?.commision || "N/A",
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-4">
                      <div className="userdata">
                        <p className="headmain">Default Group:</p>
                      </div>
                      <div className="name-dtls">
                        <p className="headsub">
                          {data?.isDefaultAffiliateGroup ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-4">
                      <div className="userdata">
                        <p className="headmain">Archived:</p>
                      </div>
                      <div className="name-dtls">
                        <p className="headsub">
                          {data?.isArchive ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-4">
                      <div className="userdata">
                        <p className="headmain">Added Affiliates:</p>
                      </div>
                      <div className="name-dtls">
                        {data?.addedAffiliates?.length > 0 ? (
                          <ul className="list-unstyled">
                            {data.addedAffiliates.map((affiliate, index) => (
                              <li key={`affiliate-${index}`} className="mb-2">
                                <div className="d-flex align-items-center gap-2 flex-wrap pointer">
                                  <span
                                    onClick={() => rediredctView(affiliate.id)}
                                    className="badge bg-primary rounded-pill"
                                  >
                                    {affiliate.fullName || "No name"}
                                  </span>
                                  <span className="text-muted small">
                                    {affiliate.email || "No email"}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted">No affiliates added</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Detail;
