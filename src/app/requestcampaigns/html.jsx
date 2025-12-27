import React, { useState, useEffect } from "react";
import Layout from "@/app/components/global/layout";
import ReactPaginate from "react-paginate";
import "./style.scss";
import methodModel from "../../methods/methods";
import datepipeModel from "@/models/datepipemodel";
import { useRouter } from "next/navigation";
import SelectDropdown from "../components/common/SelectDropdown";

const Html = ({
  view,
  reset,
  statusChange,
  pageChange,
  filters,
  loaging,
  data,
  total,
  filter,
  sorting,
  getData,
  setFilter,
  ChangeStatus,
}) => {
  const history = useRouter();
  const [activeSidebar, setActiveSidebar] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      filter();
    }
  };

  const handleCountChange = (count) => {
    setFilter({ ...filters, count: count, page: 1 });
    getData({ count: count, page: 1 });
  };

  return (
    <Layout
      activeSidebar={activeSidebar}
      handleKeyPress={handleKeyPress}
      setFilter={setFilter}
      reset={reset}
      filter={filter}
      name="Campaigns"
      filters={filters}
    >
      <div className="sidebar-left-content">
        <div className="card">
          <div className="campaign-request-header-wrapper">
            <div className="main_title_head d-flex justify-content-between align-items-center gap-2">
              <h3 className="">Campaign Request</h3>
              <div className="d-flex align-items-center gap-2">
                <SelectDropdown
                  theme="search"
                  id="statusDropdown"
                  displayValue="name"
                  placeholder="Status"
                  intialValue={filters.status}
                  result={(e) => {
                    ChangeStatus(e.value);
                  }}
                  options={[
                    { id: "pending", name: "Pending" },
                    { id: "accepted", name: "Joined" },
                    { id: "rejected", name: "Rejected" },
                    { id: "removed", name: "Removed" },
                  ]}
                />
                {filters.status && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary reset-btn"
                    onClick={(e) => reset()}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table_section mt-0">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead className="table_head">
                    <tr className="heading_row">
                      <th
                        scope="col"
                        className="table_data"
                        onClick={(e) => sorting("campaign_name")}
                      >
                        Campaign Name {filters?.sorder === "asc" ? "↑" : "↓"}
                      </th>
                      <th
                        scope="col"
                        className="table_data"
                        onClick={(e) => sorting("affiliate_name")}
                      >
                        Affiliate Name {filters?.sorder === "asc" ? "↑" : "↓"}
                      </th>
                      <th scope="col" className="table_data">
                        Event Type
                      </th>
                      <th scope="col" className="table_data">
                        Commission
                      </th>
                      <th scope="col" className="table_data">
                        Lead Amount
                      </th>
                      <th
                        scope="col"
                        className="table_data"
                        onClick={(e) => sorting("createdAt")}
                      >
                        Request Date {filters?.sorder === "asc" ? "↑" : "↓"}
                      </th>
                      <th scope="col" className="table_data">
                        Status
                      </th>
                      <th scope="col" className="table_data">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {!loaging && <tbody>
                    {data.map((itm, i) => (
                      <tr className="data_row" key={i}>
                        <td
                          className="table_dats"
                          onClick={(e) =>
                            view(itm.id || itm._id)
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="user_detail">
                            <div className="user_name">
                              <h4 className="user">
                                {methodModel.capitalizeFirstLetter(
                                  itm?.campaign_name || itm?.campaign_details?.name
                                )}
                              </h4>
                            </div>
                          </div>
                        </td>
                        <td className="table_dats">
                          <div className="user_detail">
                            <div className="user_name">
                              <h6 className="user mb-0">
                                {methodModel.capitalizeFirstLetter(
                                  itm?.affiliate_name
                                )}
                              </h6>
                              <small className="text-muted">
                                {itm?.affiliate_email}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="table_dats">
                          {itm?.campaign_details?.event_type?.join(", ") || "--"}
                        </td>
                        <td className="table_dats">
                          {itm?.campaign_details?.commission !== undefined
                            ? `${itm.campaign_details.commission} ${itm?.campaign_details?.commission_type === "percentage"
                              ? "%"
                              : "$"
                            }`
                            : "--"}
                        </td>
                        <td className="table_dats">
                          ${itm?.campaign_details?.lead_amount}
                        </td>
                        <td className="table_dats">
                          {datepipeModel.date(itm.createdAt)}
                        </td>
                        <td className="table_dats">
                          <span className={`badge bg-${itm?.status === "pending" ? "warning" :
                              itm?.status === "accepted" ? "success" :
                                itm?.status === "rejected" ? "danger" : "secondary"
                            }`}>
                            {methodModel.capitalizeFirstLetter(itm?.status)}
                          </span>
                        </td>
                        <td className="table_dats d-flex align-items-center gap-2">
                          {itm?.status === "pending" ? (
                            <>
                              <button
                                onClick={() =>
                                  statusChange(
                                    "accepted",
                                    itm?.affiliate_id,
                                    itm?.id || itm?._id
                                  )
                                }
                                className="btn btn-success btn-sm"
                                title="Accept"
                              >
                                <i className="fa fa-check"></i>
                              </button>
                              <button
                                onClick={() =>
                                  statusChange(
                                    "rejected",
                                    itm?.affiliate_id,
                                    itm?.id || itm?._id
                                  )
                                }
                                className="btn btn-danger btn-sm"
                                title="Reject"
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </>
                          ) : itm?.status === "rejected" ? (
                            <span className="badge bg-danger">Rejected</span>
                          ) : itm?.status === "accepted" ? (
                            <span className="badge bg-success">Accepted</span>
                          ) : (
                            <span className="badge bg-secondary">{itm?.status}</span>
                          )}

                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => {
                              history.push(`/chat`);
                              localStorage.setItem("chatId", itm?.brand_id);
                              localStorage.setItem("affiliateId", itm?.affiliate_id);
                            }}
                            title="Chat"
                          >
                            <i className="fa fa-comment-o"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>}
                </table>
                {!loaging && total === 0 && (
                  <div className="py-3 text-center">No Campaign Requests Found</div>
                )}
              </div>
            </div>

            <div
              className={`paginationWrapper ${!loaging && total > 10 ? "" : "d-none"
                }`}
            >
              <span>
                Show{" "}
                <select
                  className="form-control d-inline w-auto"
                  onChange={(e) => handleCountChange(parseInt(e.target.value))}
                  value={filters.count}
                >
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={150}>150</option>
                  <option value={200}>200</option>
                </select>{" "}
                from {total} Requests
              </span>
              <ReactPaginate
                breakLabel="..."
                nextLabel="Next >"
                initialPage={filters?.page}
                onPageChange={pageChange}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                pageCount={Math.ceil(total / filters?.count)}
                previousLabel="< Previous"
                renderOnZeroPageCount={null}
                pageClassName={"pagination-item"}
                activeClassName={"pagination-item-active"}
              />
            </div>

            {loaging && (
              <div className="text-center py-4">
                <img src="/assets/img/loader.gif" className="pageLoader" alt="Loading..." />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Html;