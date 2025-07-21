import React, { useState } from "react";
import Layout from "@/app/components/global/layout";
import ReactPaginate from "react-paginate";
import methodModel from "@/methods/methods";
import datepipeModel from "@/models/datepipemodel";
import { useRouter } from "next/navigation";
import "./style.scss";
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
  ChangeStatus,
  setFilter,
  Tracklogin,
  user,
  getData,
}) => {
  const history = useRouter();
  const [activeSidebar, setActiveSidebar] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      filter();
    }
  };

  const permission = (p) => {
    if (user && user?.permission_detail && p) {
      return user?.permission_detail[p];
    } else {
      return false;
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
      name={user?.role == "brand" ? "Sent Offers" : "Offer Requests"}
      filters={filters}
    >
      <div className="sidebar-left-content main_box">
        <div className="card">
          <div className="card-header">
            <div className="main_title_head gap-3 d-flex justify-content-between align-items-center">
              <h3 className="">Offers Management</h3>
              <article className=" filterFlex phView flex-wrap align-items-center d-flex gap-2">
                <div className="searchInput ml-0">
                  <input
                    type="text"
                    value={filters.search}
                    placeholder="Search"
                    className="form-control"
                    onChange={(e) =>
                      e.target.value == ""
                        ? reset()
                        : setFilter({ search: e.target.value })
                    }
                    onKeyPress={handleKeyPress}
                  />
                  <i
                    class="fa fa-search search_fa"
                    onClick={() => {
                      filter();
                    }}
                    aria-hidden="true"
                  ></i>
                </div>

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
                    { id: "accepted", name: "Accepted" },
                    { id: "rejected", name: "Rejected" },
                  ]}
                />

                {/* {!role ? <SelectDropdown                                                     theme='search'
                                    id="statusDropdown"
                                    displayValue="name"
                                    placeholder="All User"
                                    intialValue={filters.role}
                                    result={e => { ChangeRole(e.value) }}
                                    options={rolesModel.list}
                                />: <></>} */}

                {filters.search || filters?.status ? (
                  <>
                    <a
                      className="btn btn-primary h-100"
                      onClick={(e) => reset()}
                    >
                      Reset
                    </a>
                  </>
                ) : (
                  <></>
                )}
              </article>
            </div>
          </div>
          <div className="card-body">
            <div className="table_section mt-0">
              <div className="table-responsive ">
                <table className="table table-striped  ">
                  <thead className="table_head">
                    <tr className="heading_row">
                      <th scope="col" class="table_data">
                        {user?.role == "affiliate"
                          ? "Brand Name"
                          : "Affiliate Name"}
                      </th>
                      <th scope="col" className="table_data">
                        Title
                      </th>
                      <th scope="col" className="table_data">
                        Comment
                      </th>
                      {user && user?.role == "brand" && (
                        <th scope="col" className="table_data">
                          Status
                        </th>
                      )}
                      <th
                        scope="col"
                        className="table_data"
                        onClick={(e) => sorting("createdAt")}
                      >
                        Created Date{filters?.sorder === "asc" ? "↑" : "↓"}
                      </th>
                      <th
                        scope="col"
                        className="table_data"
                        onClick={(e) => sorting("updatedAt")}
                      >
                        Last Modified{filters?.sorder === "asc" ? "↑" : "↓"}
                      </th>
                      <th scope="col" className="table_data">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loaging &&
                      data &&
                      data.map((itm, i) => {
                        return (
                          <tr className="data_row" key={i}>
                            <td
                              className="table_dats"
                              onClick={(e) => view(itm.id)}
                            >
                              <div className="user_detail">
                                <div className="user_name">
                                  {user?.role == "affiliate" ? (
                                    <h4 className="user">
                                      {methodModel.capitalizeFirstLetter(
                                        itm.brand_name
                                      )}
                                    </h4>
                                  ) : (
                                    <h4 className="user">
                                      {methodModel.capitalizeFirstLetter(
                                        itm.affiliate_name
                                      )}
                                    </h4>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="table_dats">{itm?.product_name}</td>
                            <td className="table_dats">
                              {itm?.comments.slice(0, 40)}
                            </td>
                            {user && user?.role == "brand" && (
                              <td
                                className={
                                  itm?.status == "deactive"
                                    ? "inactive"
                                    : "contract"
                                }
                              >
                                {itm?.status}
                              </td>
                            )}
                            <td className="table_dats">
                              {datepipeModel.date(itm.createdAt)}
                            </td>
                            <td className="table_dats">
                              {datepipeModel.date(itm.updatedAt)}
                            </td>

                            {
                              <td className="table_dats d-flex ">
                                {((user && user?.role == "affiliate") ||
                                  permission("make_offer_edit")) && (
                                  <>
                                    {itm?.status == "pending" ? (
                                      <div>
                                        <button
                                          onClick={() => {
                                            statusChange("accepted", itm?.id);
                                            Tracklogin(itm?.campaign_unique_id);
                                          }}
                                          className="btn btn-primary action-btns mr-2"
                                        >
                                          <i className="fa fa-check"></i>
                                        </button>
                                        <button
                                          onClick={() =>
                                            statusChange("rejected", itm?.id)
                                          }
                                          className="btn btn-danger br50 action-btns bg-red mr-2"
                                        >
                                          <i className="fa fa-times"></i>
                                        </button>
                                      </div>
                                    ) : itm?.status == "rejected" ? (
                                      <div className="btn btn-primary ">
                                        Rejected
                                      </div>
                                    ) : (
                                      <div className="btn btn-primary">
                                        Accepted
                                      </div>
                                    )}
                                  </>
                                )}
                                <>
                                  <span
                                    className="btn btn-primary action-btns "
                                    onClick={() => {
                                      history.push(`/chat`);
                                      localStorage.setItem(
                                        "chatId",
                                        itm?.brand_id
                                      );
                                    }}
                                  >
                                    <i className="fa fa-comment-o"></i>
                                  </span>
                                </>

                                {/* {itm?.status == 'accepted' &&
                <button onClick={() => sendProposal(itm?.brand_id)} className="btn btn-primary ms-2">
                    Send Proposal
                </button>} */}
                              </td>
                            }
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {!loaging && total == 0 ? (
                  <div className="py-3 text-center">No Data</div>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div
              className={`paginationWrapper ${
                !loaging && total > 10 ? "" : "d-none"
              }`}
            >
              <span>
                Show{" "}
                <select
                  className="form-control"
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
                // pageCount={2}
                previousLabel="< Previous"
                renderOnZeroPageCount={null}
                pageClassName={"pagination-item"}
                activeClassName={"pagination-item-active"}
              />
            </div>

            {loaging ? (
              <div className="text-center py-4">
                <img src="/assets/img/loader.gif" className="pageLoader" />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Html;
