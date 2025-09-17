import React, { useEffect, useRef, useState } from "react";
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
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const columnSelectorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showColumnSelector &&
        columnSelectorRef.current &&
        !columnSelectorRef.current.contains(event.target) &&
        !event.target.closest('.column-selector-container button')
      ) {
        setShowColumnSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnSelector]);

  // Define all available columns
  const allColumns = [
    { key: 'affiliateBrand', label: user?.role == "affiliate" ? "Brand Name" : "Affiliate Name", sortable: false, default: true },
    { key: 'title', label: 'Title', sortable: false, default: true },
    { key: 'comment', label: 'Comment', sortable: false, default: true },
    { key: 'status', label: 'Status', sortable: false, default: true },
    { key: 'createdDate', label: 'Created Date', sortable: true, default: true },
    { key: 'modifiedDate', label: 'Last Modified', sortable: true, default: true },
    { key: 'actions', label: 'Actions', sortable: false, default: true, alwaysShow: true }
  ];

  // Initialize visible columns state
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const defaultColumns = allColumns.filter(col => col.default).map(col => col.key);
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
          <div className="offer-management-top-wrapper">
            <div className="main_title_head gap-3 d-flex justify-content-between align-items-center">
              <h3 className="">Offers Management</h3>
              <article className=" filterFlex phView flex-wrap  offer-btn-wrapper  align-items-center d-flex gap-2">
                <div className="searchInput ml-0">
                  <input
                    type="text"
                    value={filters.search}
                    placeholder="Search"
                    className="form-control"
                    onChange={(e) =>{
                      setShowColumnSelector(false)
                      e.target.value == ""
                        ? reset()
                        : setFilter({ search: e.target.value });}
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
                    setShowColumnSelector(false)
                  }}
                  options={[
                    { id: "pending", name: "Pending" },
                    { id: "accepted", name: "Accepted" },
                    { id: "rejected", name: "Rejected" },
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
            <div className="table_section mt-0 ">
              <div className="table-responsive ">
                <table className="table table-striped  ">
                  <thead className="table_head">
                    <tr className="heading_row">
                      {isColumnVisible('affiliateBrand') && (
                        <th scope="col" class="table_data">
                          {user?.role == "affiliate" ? "Brand Name" : "Affiliate Name"}
                        </th>
                      )}
                      {isColumnVisible('title') && (
                        <th scope="col" className="table_data">
                          Title
                        </th>
                      )}
                      {isColumnVisible('comment') && (
                        <th scope="col" className="table_data">
                          Comment
                        </th>
                      )}
                      {isColumnVisible('status') && user && user?.role == "brand" && (
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
                      {isColumnVisible('modifiedDate') && (
                        <th
                          scope="col"
                          className="table_data"
                          onClick={(e) => sorting("updatedAt")}
                        >
                          Last Modified{filters?.sorder === "asc" ? "↑" : "↓"}
                        </th>
                      )}
                      {isColumnVisible('actions') && (
                        <th scope="col" className="table_data">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {!loaging &&
                      data &&
                      data.map((itm, i) => {
                        return (
                          <tr className="data_row" key={i}>
                            {isColumnVisible('affiliateBrand') && (
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
                            )}
                            {isColumnVisible('title') && (
                              <td className="table_dats">{itm?.product_name}</td>
                            )}
                            {isColumnVisible('comment') && (
                              <td className="table_dats">
                                {itm?.comments.slice(0, 40)}
                              </td>
                            )}
                            {isColumnVisible('status') && user && user?.role == "brand" && (
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
                            {isColumnVisible('createdDate') && (
                              <td className="table_dats">
                                {datepipeModel.date(itm.createdAt)}
                              </td>
                            )}
                            {isColumnVisible('modifiedDate') && (
                              <td className="table_dats">
                                {datepipeModel.date(itm.updatedAt)}
                              </td>
                            )}

                            {isColumnVisible('actions') && (
                              <td className="table_dats d-flex gap-2 ">
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
                                    className="btn btn-primary action-btns  offer-mg-page-action-btn"
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
                              </td>
                            )}
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
              className={`paginationWrapper ${!loaging && total > 10 ? "" : "d-none"
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