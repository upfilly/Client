import React, { useEffect, useRef, useState } from "react";
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
  setTotal,
}) => {
  const history = useRouter();
  const [activeSidebar, setActiveSidebar] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const columnSelectorRef = useRef(null);

  console.log(activeTab, "activeTab");
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showColumnSelector &&
        columnSelectorRef.current &&
        !columnSelectorRef.current.contains(event.target) &&
        !event.target.closest(".column-selector-container button")
      ) {
        setShowColumnSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColumnSelector]);

  // Define all available columns
  const allColumns = [
    { key: "name", label: "Name", sortable: true, default: true },
    { key: "eventType", label: "Event Type", sortable: true, default: true },
    { key: "accessType", label: "Access Type", sortable: true, default: true },
    { key: "affiliates", label: "Affiliates", sortable: true, default: true },
    { key: "commission", label: "Commission", sortable: true, default: true },
    { key: "leadAmount", label: "Lead Amount", sortable: true, default: true },
    { key: "currency", label: "Currency", sortable: true, default: true },
    { key: "status", label: "Status", sortable: false, default: true },
    {
      key: "createdDate",
      label: "Created Date",
      sortable: true,
      default: true,
    },
    {
      key: "updatedDate",
      label: "Archive Date",
      sortable: true,
      default: true,
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      default: true,
      alwaysShow: true,
    },
  ];

  // Initialize visible columns state
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const defaultColumns = allColumns
      .filter((col) => col.default)
      .map((col) => col.key);
    return defaultColumns;
  });

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

  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    const column = allColumns.find((col) => col.key === columnKey);
    if (column?.alwaysShow) return; // Don't allow hiding always-show columns

    setVisibleColumns((prev) => {
      if (prev.includes(columnKey)) {
        return prev.filter((key) => key !== columnKey);
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
    const defaultColumns = allColumns
      .filter((col) => col.default)
      .map((col) => col.key);
    setVisibleColumns(defaultColumns);
  };

  // Show all columns
  const showAllColumns = () => {
    setVisibleColumns(allColumns.map((col) => col.key));
  };

  // Render column selector dropdown
  const renderColumnSelector = () => (
    <div className="column-selector-wrapper" ref={columnSelectorRef}>
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
          {allColumns.map((column) => (
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
                {column.alwaysShow && (
                  <small className="text-muted"> (Required)</small>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
              onClick={() => {
                setActiveTab("active");
                setTotal(0);
              }}
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
              onClick={() => {
                setActiveTab("archived");
                setTotal(0);
              }}
            >
              Archived Campaigns
              {activeTab === "archived" && (
                <span className="badge bg-secondary ms-2">{total}</span>
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
                  setShowColumnSelector(false);
                }}
                options={[
                  { id: "active", name: "Active" },
                  { id: "deactive", name: "Inactive" },
                ]}
              />

              {/* Column Selector Button */}
              <div className="column-selector-container">
                <button
                  className="btn btn-outline-secondary mb-0 me-2"
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  title="Manage Columns"
                >
                  <i className="fa fa-columns mr-1"></i>
                  Columns
                </button>
                {showColumnSelector && renderColumnSelector()}
              </div>

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
                  {isColumnVisible("name") && (
                    <th
                      scope="col"
                      className="table_data"
                      onClick={(e) => sorting("name")}
                    >
                      Name{filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                  )}
                  {isColumnVisible("eventType") && (
                    <th
                      scope="col"
                      className="table_data"
                      onClick={(e) => sorting("event_type")}
                    >
                      Event Type{filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                  )}
                  {isColumnVisible("accessType") && (
                    <th
                      scope="col"
                      className="table_data"
                      onClick={(e) => sorting("access_type")}
                    >
                      Access Type{filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                  )}
                  {isColumnVisible("affiliates") && (
                    <th
                      scope="col"
                      className="table_data"
                      onClick={(e) => sorting("affiliateCount")}
                    >
                      Affiliates{filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                  )}
                  {isColumnVisible("commission") && (
                    <th
                      scope="col"
                      className="table_data"
                      onClick={(e) => sorting("commission")}
                    >
                      Commission{filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                  )}
                  {isColumnVisible("leadAmount") && (
                    <th
                      scope="col"
                      className="table_data"
                      onClick={(e) => sorting("lead_amount")}
                    >
                      Lead Amount{filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                  )}
                  {isColumnVisible("currency") && (
                    <th
                      scope="col"
                      className="table_data"
                      onClick={(e) => sorting("currencies")}
                    >
                      Currency{filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                  )}
                  {isColumnVisible("status") && (
                    <th scope="col" className="table_data">
                      Status{filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                  )}
                  {isColumnVisible("createdDate") && (
                    <th
                      scope="col"
                      className="table_data"
                      onClick={(e) => sorting("createdAt")}
                    >
                      Created Date{filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                  )}
                  {isColumnVisible("updatedDate") &&
                    activeTab == "archived" && (
                      <th
                        scope="col"
                        className="table_data"
                        onClick={(e) => sorting("updatedAt")}
                      >
                        Archive Date{filters?.sorder === "asc" ? "↑" : "↓"}
                      </th>
                    )}
                  {isColumnVisible("actions") && activeTab != "archived" && (
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
                        {isColumnVisible("name") && (
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
                        )}
                        {isColumnVisible("eventType") && (
                          <td className="table_dats">
                            <div className="user_detail">
                              <div className="user_name">
                                <h4 className="user">
                                  {itm?.event_type.map((itm) => itm).join(",")}
                                </h4>
                              </div>
                            </div>
                          </td>
                        )}
                        {isColumnVisible("accessType") && (
                          <td className="table_dats">{itm?.access_type}</td>
                        )}
                        {isColumnVisible("affiliates") && (
                          <td className="table_dats">{itm?.affiliateCount}</td>
                        )}
                        {isColumnVisible("commission") && (
                          <td className="table_dats">
                            {itm?.commission || "--"}{" "}
                            {itm?.commission_type == "percentage" ? "%" : "$"}
                          </td>
                        )}
                        {isColumnVisible("leadAmount") && (
                          <td className="table_dats">{`$ ${
                            itm?.lead_amount || "--"
                          }`}</td>
                        )}
                        {isColumnVisible("currency") && (
                          <td className="table_dats">
                            {itm?.currencies || "--"}
                          </td>
                        )}
                        {isColumnVisible("status") && (
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
                        )}
                        {isColumnVisible("createdDate") && (
                          <td className="table_dats">
                            {datepipeModel.date(itm.createdAt)}
                          </td>
                        )}
                        {isColumnVisible("updatedDate") &&
                          activeTab === "archived" && (
                            <td className="table_dats">
                              {datepipeModel.date(itm.updatedAt)}
                            </td>
                          )}
                        {isColumnVisible("actions") && (
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
                            </div>
                          </td>
                        )}
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
