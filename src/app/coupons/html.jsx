import React, { useState } from "react";
import Layout from "@/app/components/global/layout";
import ReactPaginate from "react-paginate";
import "./style.scss";
import methodModel from "../../methods/methods";
import datepipeModel from "../../models/datepipemodel";
import { useRouter } from "next/navigation";
import ApiClient from "@/methods/api/apiClient";
import SelectDropdown from "../components/common/SelectDropdown";
import { Tooltip } from "react-tooltip";
import environment from "@/environment";

const Html = ({
  view,
  edit,
  reset,
  add,
  user,
  sorting,
  pageChange,
  deleteItem,
  filters,
  loaging,
  data,
  total,
  setFilter,
  filter,
  ChangeStatus,
  getData,
}) => {
  const history = useRouter();
  const [activeSidebar, setActiveSidebar] = useState(false);
  const [copied, setCopied] = useState({ csv: false, xml: false });

  // Checkbox state
  const [selectedRows, setSelectedRows] = useState([]);
  const allIds = data?.map((itm) => itm.id || itm._id) || [];
  const isAllSelected =
    allIds.length > 0 && selectedRows.length === allIds.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

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

  const getExportUrl = (type) => {
    const baseUrl = `${environment.api}coupon/getAll`;
    const params = new URLSearchParams({
      media: user?.id,
      [type]: "yes",
      visibility: "Public",
    }).toString();
    return `${baseUrl}?${params}`;
  };

  const exportCSV = () => {
    const url = getExportUrl("csv");
    ApiClient.get(url).then((res) => {
      if (res) {
        const blob = new Blob([res], { type: "application/xml" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Coupons.csv";
        link.click();
      }
    });
  };

  const exportXML = () => {
    const url = getExportUrl("xml");
    ApiClient.get(url).then((res) => {
      if (res) {
        const blob = new Blob([res], { type: "application/xml" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "CouponsXml.xml";
        link.click();
      }
    });
  };

  const copyToClipboard = (type) => {
    const url = getExportUrl(type);
    navigator.clipboard.writeText(url).then(() => {
      setCopied({ ...copied, [type]: true });
      setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
    });
  };

  const handleCountChange = (count) => {
    setFilter({ ...filters, count: count, page: 1 });
    getData({ count: count, page: 1 });
  };

  const getCouponStatus = (item) => {
    const currentDate = new Date();
    const startDate = new Date(item.startDate);

    if (startDate > currentDate) {
      return "Pending";
    }

    return item.status;
  };

  return (
    <Layout
      activeSidebar={activeSidebar}
      handleKeyPress={handleKeyPress}
      setFilter={setFilter}
      reset={reset}
      filter={filter}
      name="Coupons"
      filters={filters}
    >
      <div className="sidebar-left-content">
        <div className="d-flex justify-content-end gap-2 flex-md-wrap align-items-center all_flexbx">
          <article className="d-flex coupons-page-top-export-options filterFlex phView">
            {(user?.role == "brand" || permission("coupon_add")) && (
              <a
                className="btn btn-primary h-100 mb-0 set_reset"
                onClick={(e) => add()}
              >
                Add Coupon
              </a>
            )}
            <SelectDropdown
              theme="search"
              id="statusDropdown"
              className="mr-2 all-status-dropdown-btn"
              displayValue="name"
              placeholder="Status"
              intialValue={filters?.status}
              result={(e) => {
                ChangeStatus(e.value);
              }}
              options={[
                { id: "Enabled", name: "Enabled" },
                { id: "Expired", name: "Expired" },
                { id: "Pending", name: "Pending" },
              ]}
            />
            {filters.status && (
              <a className="btn btn-primary h-100" onClick={(e) => reset()}>
                Reset
              </a>
            )}
          </article>
          <div className="d-flex gap-2 align-items-center export-group-wrapper">
            <div className="export-group">
              <button
                className="btn btn-success export-btn"
                onClick={exportCSV}
                data-tooltip-id="csv-tooltip"
                data-tooltip-content={getExportUrl("csv")}
              >
                Export CSV
              </button>
              <button
                className="btn btn-outline-secondary copy-btn"
                onClick={() => copyToClipboard("csv")}
                title="Copy CSV URL"
              >
                {copied.csv ? "Copied!" : "Copy URL"}
              </button>
            </div>
            <div className="export-group">
              <button
                className="btn btn-warning export-btn"
                onClick={exportXML}
                data-tooltip-id="xml-tooltip"
                data-tooltip-content={getExportUrl("xml")}
              >
                Export XML
              </button>
              <button
                className="btn btn-outline-secondary copy-btn"
                onClick={() => copyToClipboard("xml")}
                title="Copy XML URL"
              >
                {copied.xml ? "Copied!" : "Copy URL"}
              </button>
            </div>
          </div>
          <Tooltip id="csv-tooltip" place="bottom" effect="solid" />
          <Tooltip id="xml-tooltip" place="bottom" effect="solid" />
        </div>
        <div className="table_section">
          <div className="table-responsive ">
            <table className="table table-striped table-width">
              <thead className="table_head">
                <tr className="heading_row">
                  <th>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      title="Select All"
                    />
                  </th>
                  <th
                    scope="col"
                    className="table_data"
                    onClick={(e) => sorting("title")}
                  >
                    Title
                    {filters?.sorder === "asc" ? "↑" : "↓"}
                  </th>
                  <th
                    scope="col"
                    className="table_data"
                    onClick={(e) => sorting("couponCode")}
                  >
                    Coupon Code {filters?.sorder === "asc" ? "↑" : "↓"}
                  </th>
                  <th scope="col" className="table_data">
                    Coupon Type
                  </th>
                  <th scope="col" className="table_data">
                    Brand Name
                  </th>
                  <th scope="col" className="table_data">
                    Visibility
                  </th>
                  <th scope="col" className="table_data">
                    Start Date
                  </th>
                  <th scope="col" className="table_data">
                    Expiration Date
                  </th>
                  <th scope="col" className="table_data">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="table_data"
                    onClick={(e) => sorting("createdAt")}
                  >
                    Created Date{filters?.sorder === "asc" ? "↑" : "↓"}
                  </th>
                  {user?.role == "brand" && (
                    <th scope="col" className="table_data">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {!loaging &&
                  data &&
                  data.map((itm, i) => {
                    const displayStatus = getCouponStatus(itm);
                    const rowId = itm.id || itm._id;
                    return (
                      <tr className="data_row" key={i}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(rowId)}
                            onChange={() => handleRowSelect(rowId)}
                            title="Select Row"
                          />
                        </td>
                        <td className="table_dats" onClick={(e) => view(rowId)}>
                          <div className="user_detail">
                            <div className="user_name">
                              <h4 className="user">
                                {itm.title
                                  ? methodModel.capitalizeFirstLetter(itm.title)
                                  : "--"}
                              </h4>
                            </div>
                          </div>
                        </td>
                        {/* ...rest of your columns... */}
                        <td className="table_dats">
                          <div className="user_detail">
                            <div className="user_name">
                              <h4 className="user">
                                {itm.couponCode
                                  ? methodModel.capitalizeFirstLetter(
                                      itm.couponCode
                                    )
                                  : "--"}
                              </h4>
                            </div>
                          </div>
                        </td>
                        <td className="table_dats">
                          <div className="user_detail">
                            <div className="user_name">
                              <h4 className="user">
                                {methodModel.capitalizeFirstLetter(
                                  itm?.couponType
                                )}
                              </h4>
                            </div>
                          </div>
                        </td>
                        <td className="table_dats">
                          <div className="user_detail">
                            <div className="user_name">
                              <h4 className="user">
                                {methodModel.capitalizeFirstLetter(
                                  itm?.addedByDetails?.fullName
                                )}
                              </h4>
                            </div>
                          </div>
                        </td>
                        <td className="table_dats">
                          <div className="user_detail">
                            <div className="user_name">
                              <h4 className="user">
                                {methodModel.capitalizeFirstLetter(
                                  itm?.visibility
                                )}
                              </h4>
                            </div>
                          </div>
                        </td>
                        <td className="table_dats">
                          <div className="user_name">
                            <h4 className="user">
                              {datepipeModel.date(itm.startDate)}
                            </h4>
                          </div>
                        </td>
                        <td className="table_dats">
                          <div className="user_name">
                            <h4 className="user">
                              {datepipeModel.date(itm.expirationDate)}
                            </h4>
                          </div>
                        </td>
                        <td className="table_dats">
                          <div className={`user_hours`}>
                            <span
                              className={
                                displayStatus == "Enabled"
                                  ? "contract"
                                  : displayStatus == "Expired"
                                  ? "inactive"
                                  : "pending_status"
                              }
                            >
                              {displayStatus}
                            </span>
                          </div>
                        </td>
                        <td className="table_dats">
                          {datepipeModel.date(itm.createdAt)}
                        </td>
                        {user?.role == "brand" && (
                          <td className="table_dats">
                            <div className="action_icons gap-3 ">
                              {(user?.role == "brand" ||
                                permission("coupon_edit")) && (
                                <>
                                  <a
                                    className="edit_icon action-btn"
                                    title="Edit"
                                    onClick={(e) => edit(rowId)}
                                  >
                                    <i
                                      className="material-icons edit"
                                      title="Edit"
                                    >
                                      edit
                                    </i>
                                  </a>
                                  <a
                                    className="edit_icon edit-delete"
                                    onClick={
                                      displayStatus == "accepted"
                                        ? ""
                                        : () => deleteItem(rowId)
                                    }
                                  >
                                    <i
                                      className={`material-icons ${
                                        displayStatus == "accepted"
                                          ? "delete"
                                          : "diabled"
                                      }`}
                                      title="Delete"
                                    >
                                      {" "}
                                      delete
                                    </i>
                                  </a>
                                </>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {!loaging && data?.length == 0 ? (
              <div className="py-3 text-center">No Coupon Found</div>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* ...existing pagination and loader code... */}
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
            from {total} Coupons
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
