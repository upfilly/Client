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
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Define all available columns
  const allColumns = [
    { key: 'selection', label: 'Selection', sortable: false, default: true, alwaysShow: true },
    { key: 'title', label: 'Title', sortable: true, default: true },
    { key: 'couponCode', label: 'Coupon Code', sortable: true, default: true },
    { key: 'couponType', label: 'Coupon Type', sortable: false, default: true },
    { key: 'brandName', label: 'Brand Name', sortable: false, default: true },
    { key: 'visibility', label: 'Visibility', sortable: false, default: true },
    { key: 'startDate', label: 'Start Date', sortable: false, default: true },
    { key: 'expirationDate', label: 'Expiration Date', sortable: false, default: true },
    { key: 'status', label: 'Status', sortable: false, default: true },
    { key: 'createdDate', label: 'Created Date', sortable: true, default: true },
    { key: 'actions', label: 'Actions', sortable: false, default: true, alwaysShow: user?.role == "brand" }
  ];

  // Initialize visible columns state
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const defaultColumns = allColumns.filter(col => col.default).map(col => col.key);
    return defaultColumns;
  });

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

  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    const column = allColumns.find(col => col.key === columnKey);
    if (column?.alwaysShow) return; // Don't allow hiding always-show columns

    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.filter(key => key !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  // Check if a column is visible
  const isColumnVisible = (columnKey) => {
    return visibleColumns.includes(columnKey);
  };

  // Reset to default columns
  const resetColumns = () => {
    const defaultColumns = allColumns.filter(col => col.default).map(col => col.key);
    setVisibleColumns(defaultColumns);
  };

  // Show all columns
  const showAllColumns = () => {
    setVisibleColumns(allColumns.map(col => col.key));
  };

  // Render column selector dropdown
  const renderColumnSelector = () => (
    <div className="column-selector-wrapper">
      <div className="column-selector-dropdown">
        <div className="column-selector-header">
          <h6>Manage Columns</h6>
          <div className="column-selector-actions">
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={resetColumns}
            >
              Default
            </button>
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={showAllColumns}
            >
              Show All
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setShowColumnSelector(false)}
            >
              ×
            </button>
          </div>
        </div>
        <div className="column-selector-body">
          {allColumns.map(column => (
            <div key={column.key} className="column-selector-item">
              <label className="column-checkbox">
                <input
                  type="checkbox"
                  checked={isColumnVisible(column.key)}
                  onChange={() => toggleColumn(column.key)}
                  disabled={column.alwaysShow}
                />
                <span className="checkmark"></span>
                {column.label}
                {column.alwaysShow && <small className="text-muted"> (Required)</small>}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
    const baseUrl = `coupon/getAll`;
    const params = new URLSearchParams({
      media: user?.id,
      selectedCoupon: selectedRows.map((dat) => dat).join(","),
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
    const url = `${environment.api}${getExportUrl(type)}`;
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
        
        <div className="d-flex justify-content-end add-coupans-dropdown-wrapper  gap-2 flex-sm-wrap align-items-center all_flexbx">
          <article className="d-flex coupons-page-top-export-options filterFlex phView">
            {(user?.role == "brand" || permission("coupon_add")) && (
              <a
                className="btn btn-primary h-100 mb-0 set_reset"
                onClick={(e) => add()}
              >

                 <i className="fa fa-plus mr-1"> </i> 
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
                setShowColumnSelector(false)
              }}
              options={[
                { id: "Enabled", name: "Enabled" },
                { id: "Expired", name: "Expired" },
                { id: "Pending", name: "Pending" },
              ]}
            />
            
            {/* Column Selector Button */}
            <div className="column-selector-container">
              <button
                className="btn btn-outline-secondary mb-0 me-2"
                onClick={() => {setShowColumnSelector(!showColumnSelector)}}
                title="Manage Columns"
              >
                <i className="fa fa-columns mr-1"></i>
                Columns
              </button>
              {showColumnSelector && renderColumnSelector()}
            </div>

            {filters.status && (
              <a className="btn btn-primary h-100" onClick={(e) => reset()}>
                Reset
              </a>
            )}
          </article>

          <div className="d-flex gap-2 align-items-center flex-direction-row export-group-wrapper">
            <div className="export-group">
              <button
                className="btn btn-success export-btn"
                onClick={exportCSV}
                data-tooltip-id="csv-tooltip"
                data-tooltip-content={`${environment.api}${getExportUrl(
                  "csv"
                )}`}
              >
                Export CSV
              </button>
              <button
                className="btn btn-outline-secondary copy-btn"
                onClick={() => copyToClipboard("csv")}
                title="Copy CSV URL"
              >
                {copied.csv ? "Copied!" : selectedRows?.length ?  "Copy Selected"  : "Copy All"}
              </button>
            </div>
            <div className="export-group">
              <button
                className="btn btn-warning export-btn"
                onClick={exportXML}
                data-tooltip-id="xml-tooltip"
                data-tooltip-content={`${environment.api}${getExportUrl(
                  "xml"
                )}`}
              >
                Export XML
              </button>
              <button
                className="btn btn-outline-secondary copy-btn"
                onClick={() => copyToClipboard("xml")}
                title="Copy XML URL"
              >
                {copied.xml ? "Copied!" : selectedRows?.length ?  "Copy Selected"  : "Copy All"}
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
                  {isColumnVisible('selection') && (
                    <th>
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        title="Select All"
                      />
                    </th>
                  )}
                  {isColumnVisible('title') && (
                    <th
                      scope="col"
                      className="table_data"
                      onClick={(e) => sorting("title")}
                    >
                      Title
                      {filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                  )}
                  {isColumnVisible('couponCode') && (
                    <th
                      scope="col"
                      className="table_data"
                      onClick={(e) => sorting("couponCode")}
                    >
                      Coupon Code  {filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                  )}
                  {isColumnVisible('couponType') && (
                    <th scope="col" className="table_data">
                      Coupon Type
                    </th>
                  )}
                  {isColumnVisible('brandName') && (
                    <th scope="col" className="table_data">
                      Brand Name
                    </th>
                  )}
                  {isColumnVisible('visibility') && (
                    <th scope="col" className="table_data">
                      Visibility
                    </th>
                  )}
                  {isColumnVisible('startDate') && (
                    <th scope="col" className="table_data">
                      Start Date
                    </th>
                  )}
                  {isColumnVisible('expirationDate') && (
                    <th scope="col" className="table_data">
                      Expiration Date
                    </th>
                  )}
                  {isColumnVisible('status') && (
                    <th scope="col" className="table_data">
                      Status
                    </th>
                  )}
                  {isColumnVisible('createdDate') && (
                    <th
                      scope="col"
                      className="table_data"
                      onClick={(e) => sorting("createdAt")}
                    >
                      Created Date{filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                  )}
                  {isColumnVisible('actions') && user?.role == "brand" && (
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
                        {isColumnVisible('selection') && (
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(rowId)}
                              onChange={() => handleRowSelect(rowId)}
                              title="Select Row"
                            />
                          </td>
                        )}
                        {isColumnVisible('title') && (
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
                        )}
                        {isColumnVisible('couponCode') && (
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
                        )}
                        {isColumnVisible('couponType') && (
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
                        )}
                        {isColumnVisible('brandName') && (
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
                        )}
                        {isColumnVisible('visibility') && (
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
                        )}
                        {isColumnVisible('startDate') && (
                          <td className="table_dats">
                            <div className="user_name">
                              <h4 className="user">
                                {datepipeModel.date(itm.startDate)}
                              </h4>
                            </div>
                          </td>
                        )}
                        {isColumnVisible('expirationDate') && (
                          <td className="table_dats">
                            <div className="user_name">
                              <h4 className="user">
                                {datepipeModel.date(itm.expirationDate)}
                              </h4>
                            </div>
                          </td>
                        )}
                        {isColumnVisible('status') && (
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
                        )}
                        {isColumnVisible('createdDate') && (
                          <td className="table_dats">
                            {datepipeModel.date(itm.createdAt)}
                          </td>
                        )}
                        {isColumnVisible('actions') && user?.role == "brand" && (
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