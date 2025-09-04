import React, { useEffect, useState } from "react";
import Layout from "@/app/components/global/layout";
import ReactPaginate from "react-paginate";
import "./style.scss";
import datepipeModel from "@/models/datepipemodel";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import { useRouter } from "next/navigation";
import methodModel from "../../methods/methods";

const Html = ({
  view,
  edit,
  reset,
  add,
  ChangeRole,
  ChangeStatus,
  sorting,
  pageChange,
  deleteItem,
  filters,
  loaging,
  data,
  statusChange,
  isAllow,
  total,
  setFilter,
  filter,
  user,
  activeTab,
  setActiveTab,
  getData,
  archiveStatus,
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

  // Filter data based on active tab
  const filteredData = data;
  console.log(filteredData, "filteredData");

  useEffect(() => {
    activeTab === "active"
      ? getData({ isArchive: false, page: 1 })
      : getData({ isArchive: true, page: 1 });
  }, [activeTab]);

  console.log(filters, "ioioiooioio");

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
        <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
          {/* Tabs with improved styling */}
          <div className="tabs-container d-flex align-items-center">
            <button
              className={`tab-button ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              Campaigns
              {activeTab === "active" && (
                <span className="badge bg-primary ms-2">{total}</span>
              )}
            </button>
            <button
              className={`tab-button ${
                activeTab === "archived" ? "active" : ""
              }`}
              onClick={() => setActiveTab("archived")}
            >
              Archived Campaigns
              {activeTab === "archived" && (
                <span className="badge bg-secondary ms-2">
                  {/* {data?.filter(item => item.isArchive).length} */}
                  {total}
                </span>
              )}
            </button>
          </div>

          {/* Right side controls with better spacing */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="d-flex align-items-center gap-2 ">
              <SelectDropdown
                theme="search"
                id="statusDropdown"
                displayValue="name"
                placeholder="Status "
                intialValue={filters.status}
                result={(e) => {
                  ChangeStatus(e.value);
                }}
                options={[
                  { id: "active", name: "Active" },
                  { id: "deactive", name: "Inactive" },
                ]}
                // className="status-filter-dropdown"
              />
              {filters.status && (
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center reset-btn"
                  onClick={(e) => reset()}
                >
                  <i className="material-icons me-1">refresh</i>
                  Reset
                </button>
              )}
            </div>

            {permission("campaign_add") && activeTab === "active" && (
              <button
                type="button"
                className="btn btn-primary add-button d-flex align-items-center"
                onClick={(e) => add()}
              >
                <i className="material-icons me-2">add</i>
                Add Campaign
              </button>
            )}
          </div>
        </div>

        <div className="table_section">
          <div className="table-responsive ">
            <table className="table table-striped table-width">
              <thead className="table_head">
                <tr className="heading_row">
                  <th
                    scope="col"
                    className="table_data"
                    onClick={(e) => sorting("name")}
                  >
                    Name{filters?.sorder === "asc" ? "↑" : "↓"}
                  </th>
                  <th
                    scope="col"
                    className="table_data"
                    onClick={(e) => sorting("event_type")}
                  >
                    Event Type{filters?.sorder === "asc" ? "↑" : "↓"}
                  </th>
                  <th
                    scope="col"
                    className="table_data"
                    onClick={(e) => sorting("access_type")}
                  >
                    Access Type{filters?.sorder === "asc" ? "↑" : "↓"}
                  </th>
                  <th
                    scope="col"
                    className="table_data"
                    onClick={(e) => sorting("affiliateCount")}
                  >
                    Affiliates{filters?.sorder === "asc" ? "↑" : "↓"}
                  </th>
                  <th
                    scope="col"
                    className="table_data"
                    onClick={(e) => sorting("commission")}
                  >
                    Commission{filters?.sorder === "asc" ? "↑" : "↓"}
                  </th>
                  <th
                    scope="col"
                    className="table_data"
                    onClick={(e) => sorting("lead_amount")}
                  >
                    Lead Amount{filters?.sorder === "asc" ? "↑" : "↓"}
                  </th>
                  <th
                    scope="col"
                    className="table_data"
                    onClick={(e) => sorting("currencies")}
                  >
                    Currency{filters?.sorder === "asc" ? "↑" : "↓"}
                  </th>
                  <th scope="col" className="table_data">
                    Status{filters?.sorder === "asc" ? "↑" : "↓"}
                  </th>
                  <th
                    scope="col"
                    className="table_data"
                    onClick={(e) => sorting("createdAt")}
                  >
                    Created Date{filters?.sorder === "asc" ? "↑" : "↓"}
                  </th>
                  {activeTab != "archived" && (
                    <th scope="col" className="table_data">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {!loaging &&
                  filteredData &&
                  filteredData.map((itm, i) => {
                    console.log(itm, "itm");
                    return (
                      <tr className="data_row" key={i}>
                        <td
                          className="table_dats"
                          onClick={(e) => view(itm.id || itm._id)}
                        >
                          <div className="user_detail">
                            <div className="user_name">
                              <h4 className="user">
                                {methodModel.capitalizeFirstLetter(itm.name)}
                              </h4>
                            </div>
                          </div>
                        </td>
                        <td className="table_dats">
                          <div className="user_detail">
                            <div className="user_name">
                              <h4 className="user">
                                {itm?.event_type.map((itm) => itm).join(",")}
                              </h4>
                            </div>
                          </div>
                        </td>
                        <td className="table_dats">{itm?.access_type}</td>
                        <td className="table_dats">{itm?.affiliateCount}</td>
                        <td className="table_dats">
                          {itm?.commission || "--"}{" "}
                          {itm?.commission_type == "percentage" ? "%" : "$"}
                        </td>
                        <td className="table_dats">{`$ ${
                          itm?.lead_amount || "--"
                        }`}</td>
                        <td className="table_dats">
                          {itm?.currencies || "--"}
                        </td>
                        <td className="table_dats">
                          <span
                            className={`active_btn${itm?.status}`}
                            onClick={() => statusChange(itm)}
                          >
                            <span
                              className={
                                itm?.status == "deactive"
                                  ? "inactive"
                                  : "contract"
                              }
                            >
                              {itm?.status == "deactive"
                                ? "Inactive"
                                : "Active"}
                            </span>
                          </span>
                        </td>
                        <td className="table_dats">
                          {datepipeModel.date(itm.createdAt)}
                        </td>
                        <td className="table_dats">
                          <div className="action_icons">
                            {isAllow("editAdmins") &&
                              permission("campaign_edit") &&
                              !itm.isArchive && (
                                <a
                                  className="edit_icon action-btn"
                                  title="Edit"
                                  onClick={(e) => edit(itm.id || itm._id)}
                                >
                                  <i
                                    className="material-icons edit"
                                    title="Edit"
                                  >
                                    edit
                                  </i>
                                </a>
                              )}

                            {!itm.isArchive &&
                              permission("campaign_delete") && (
                                <a
                                  className="edit_icon edit-delete"
                                  onClick={() =>
                                    deleteItem(itm.id || itm._id, itm)
                                  }
                                >
                                  <i
                                    className={`material-icons ${
                                      itm?.status == "accepted"
                                        ? "delete"
                                        : "diabled"
                                    }`}
                                    title={
                                      itm.isArchive ? "Restore" : "Archive"
                                    }
                                  >
                                    {itm.isArchive ? "unarchive" : "archive"}
                                  </i>
                                </a>
                              )}

                            {/* {permission('campaign_edit') && (
                                                    <a className='edit_icon action-btn' onClick={() => {
                                                        history.push(`/chat`)
                                                    }}>
                                                        <i className='fa fa-comment-o text-white'></i>
                                                    </a>
                                                )} */}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {!loaging && filteredData?.length === 0 ? (
              <div className="py-3 text-center">
                No {activeTab === "active" ? "Active" : "Archived"} Campaigns
                Found
              </div>
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
            from {total} Campaigns
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

        {loaging ? (
          <div className="text-center py-4">
            <img src="/assets/img/loader.gif" className="pageLoader" />
          </div>
        ) : (
          <></>
        )}
      </div>
    </Layout>
  );
};

export default Html;
