import React, { useState, useEffect, useRef } from "react";
import Layout from "@/app/components/global/layout";
import ReactPaginate from "react-paginate";
import "./style.scss";
import methodModel from "../../methods/methods";
import datepipeModel from "@/models/datepipemodel";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Html = ({
  view,
  edit,
  reset,
  add,
  user,
  ChangeStatus,
  sorting,
  pageChange,
  deleteItem,
  filters,
  loaging,
  data,
  isAllow,
  total,
  setFilter,
  filter,
  getData,
  campaign,
  brandData,
  changeBrand,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  ChangeAddType
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

  const allColumns = [
    { key: 'type', label: 'Type', sortable: false, default: true },
    { key: 'title', label: 'Title', sortable: true, default: true },
    { key: 'brandName', label: 'Brand Name', sortable: false, default: true },
    { key: 'destination', label: 'Destination', sortable: false, default: true },
    { key: 'seoAttributes', label: 'SEO Attributes', sortable: false, default: false },
    { key: 'expirationDate', label: 'Expiration Date', sortable: false, default: false },
    { key: 'activationDate', label: 'Activation Date', sortable: false, default: false },
    { key: 'status', label: 'Status', sortable: false, default: true },
    { key: 'createdDate', label: 'Created Date', sortable: true, default: true },
    { key: 'action', label: 'Action', sortable: false, default: true, alwaysShow: true }
  ];

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const defaultColumns = allColumns.filter(col => col.default).map(col => col.key);
    return defaultColumns;
  });

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      filter();
    }
  };

  function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    const newFilters = {
      ...filters,
      startDate: start ? formatLocalDate(start) : "",
      endDate: end ? formatLocalDate(end) : "",
      page: 1
    };

    setFilter(newFilters);

    if (start && end) {
      getData(newFilters);
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

  const toggleColumn = (columnKey) => {
    const column = allColumns.find(col => col.key === columnKey);
    if (column?.alwaysShow) return;

    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.filter(key => key !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  const isColumnVisible = (columnKey) => {
    return visibleColumns.includes(columnKey);
  };

  const resetColumns = () => {
    const defaultColumns = allColumns.filter(col => col.default).map(col => col.key);
    setVisibleColumns(defaultColumns);
  };

  const showAllColumns = () => {
    setVisibleColumns(allColumns.map(col => col.key));
  };

  // Helper function to determine item type
  const getItemType = (item) => {
    return item.addType === "link" ? "Text Link" : "Banner";
  };

  // Helper function to get display title
  const getDisplayTitle = (item) => {
    if (item.addType === "link") {
      return item.linkName || "Untitled Link";
    }
    return item.title || "Untitled Banner";
  };

  // Helper function to get destination URL
  const getDestinationUrl = (item) => {
    if (item.addType === "link") {
      return item.linkDestinationUrl;
    }
    return item.destination_url;
  };

  // Helper function to get description
  const getDescription = (item) => {
    if (item.addType === "link") {
      return item.linkDescription;
    }
    return item.description;
  };

  // Helper function to get activation date
  const getActivationDate = (item) => {
    if (item.addType === "link") {
      return item.linkStartDate;
    }
    return item.activation_date;
  };

  // Helper function to get expiration date
  const getExpirationDate = (item) => {
    if (item.addType === "link") {
      return item.linkEndDate;
    }
    return item.expiration_date;
  };

  const renderColumnSelector = () => (
    <div className="column-selector-wrapper" ref={columnSelectorRef}>
      <div className="column-selector-dropdown">
        <div className="column-selector-header">
          <h6>Manage <br /> Columns</h6>
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
      name="Banners & Links"
      filters={filters}
    >
      <div className="sidebar-left-content">

        <div className="d-flex justify-content-md-end gap-2 flex-wrap align-items-center all_flexbx">
          <div className="tabs-container d-flex align-items-center">
            {/* <button
              className={`tab-button active`}
              onClick={() => {
                history.push("/banners");
              }}
            >
              Banners & Links
            </button> */}
            {/* Uncomment if you have separate pages for banners and text links */}
            {/* <button
              className={`tab-button`}
              onClick={() => {
                history.push("/textlinks");
              }}
            >
              Text Links
            </button> */}
          </div>

          {user?.role == "affiliate" && (
            <SelectDropdown
              theme="search"
              id="brandDropdown"
              style={"cursor: pointer"}
              displayValue="name"
              placeholder="Select Brand"
              intialValue={filters.addedBy}
              result={(e) => {
                changeBrand(e.value);
                setShowColumnSelector(false)
              }}
              options={brandData.map((item) => ({
                id: item?.id,
                name: item?.userName,
              }))}
            />
          )}

          <SelectDropdown
            theme="search"
            id="statusDropdown"
            style={"cursor: pointer"}
            displayValue="name"
            placeholder="Type"
            intialValue={filters.addType}
            result={(e) => {
              ChangeAddType(e.value);
              setShowColumnSelector(false)
            }}
            options={[
              { name: "Banner", id: "banner" },
              { name: "Link", id: "link" },
            ]}
          />

          <SelectDropdown
            theme="search"
            id="statusDropdown"
            style={"cursor: pointer"}
            displayValue="name"
            placeholder="Status"
            intialValue={filters.status}
            result={(e) => {
              ChangeStatus(e.value);
              setShowColumnSelector(false)
            }}
            options={[
              { id: "active", name: "Active" },
              { id: "deactive", name: "Inactive" },
            ]}
          />

          <div className="datepicker-dropdown-wrapper">
            <DatePicker
              className="datepicker-field"
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              showIcon
              placeholderText="Date Range"
              selectsRange
            />
          </div>

          <article className="d-flex filterFlex phView gap-2">
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

            {(user?.role == "brand" || permission("banner_add")) && (
              <>
                <a
                  className="btn btn-primary mb-0 set_reset"
                  onClick={(e) => add()}
                >
                  <i className="fa fa-plus mr-1"> </i>
                  Add Banner/Link
                </a>
              </>
            )}

            {startDate || endDate || filters.addType || filters.status || filters?.addedBy ? (
              <>
                <a className="btn btn-primary" onClick={(e) => reset()}>
                  Reset
                </a>
              </>
            ) : (
              <></>
            )}
          </article>
        </div>

        <div className="table_section">
          <div className="table-responsive">
            <table className="table table-striped table-width">
              <thead className="table_head">
                <tr className="heading_row">
                  {isColumnVisible('type') && (
                    <th scope="col" className="table_data">
                      Type
                    </th>
                  )}
                  {isColumnVisible('title') && (
                    <th
                      scope="col"
                      className="table_data"
                      onClick={(e) => sorting("title")}
                    >
                      Title{filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                  )}
                  {isColumnVisible('brandName') && (
                    <th scope="col" className="table_data">
                      Brand Name
                    </th>
                  )}
                  {isColumnVisible('destination') && (
                    <th scope="col" className="table_data">
                      Destination
                    </th>
                  )}
                  {isColumnVisible('seoAttributes') && (
                    <th scope="col" className="table_data">
                      SEO Attributes
                    </th>
                  )}
                  {isColumnVisible('expirationDate') && (
                    <th scope="col" className="table_data">
                      Expiration Date
                    </th>
                  )}
                  {isColumnVisible('activationDate') && (
                    <th scope="col" className="table_data">
                      Activation Date
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
                  {((user?.role == "brand" || permission("banner_edit")) && isColumnVisible('action')) && (
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
                    const itemType = getItemType(itm);
                    const isLink = itemType === "Text Link";

                    return (
                      <tr className="data_row" key={i}>
                        {isColumnVisible('type') && (
                          <td className="table_dats">
                            <span className={`type-badge ${isLink ? 'link-type' : 'banner-type'}`}>
                              {itemType}
                            </span>
                          </td>
                        )}
                        {isColumnVisible('title') && (
                          <td
                            className="table_dats inline_bx"
                            onClick={(e) => view(itm.id || itm?._id)}
                          >
                            {!isLink && itm?.image ? (
                              <img
                                src={methodModel.userImg(itm?.image)}
                                className="user_imgs"
                                alt={getDisplayTitle(itm)}
                              />
                            ) : (
                              <div className="link-icon-placeholder">
                                <i className="fa fa-link"></i>
                              </div>
                            )}
                            <div className="user_detail">
                              <div className="user_name">
                                <h4 className="user">
                                  {methodModel.capitalizeFirstLetter(getDisplayTitle(itm))}
                                </h4>
                                {isLink && (
                                  <p className="user-description text-muted small mb-0">
                                    {getDescription(itm) || "No description"}
                                  </p>
                                )}
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
                                    itm?.addedBy_details?.fullName
                                  )}
                                </h4>
                              </div>
                            </div>
                          </td>
                        )}
                        {isColumnVisible('destination') && (
                          <td className="table_dats">
                            <a
                              href={getDestinationUrl(itm)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-truncate d-inline-block max-w-200"
                              title={getDestinationUrl(itm)}
                            >
                              {getDestinationUrl(itm) || "--"}
                            </a>
                          </td>
                        )}
                        {isColumnVisible('seoAttributes') && (
                          <td className="table_dats">
                            {isLink ? (itm.linkSeo ? "Yes" : "No") : (itm.seo_attributes || "--")}
                          </td>
                        )}
                        {isColumnVisible('expirationDate') && (
                          <td className="table_dats">
                            {datepipeModel.date(getExpirationDate(itm)) || "--"}
                          </td>
                        )}
                        {isColumnVisible('activationDate') && (
                          <td className="table_dats">
                            {datepipeModel.date(getActivationDate(itm)) || "--"}
                          </td>
                        )}
                        {isColumnVisible('status') && (
                          <td className="table_dats">
                            <div className={`user_hours`}>
                              <span
                                className={
                                  itm?.status == "accepted"
                                    ? "contract"
                                    : itm?.status == "pending"
                                      ? "pending_status"
                                      : itm?.status == "active"
                                        ? "active"
                                        : "inactive"
                                }
                              >
                                {itm.status === "deactive"
                                  ? "Inactive"
                                  : "Active"}
                              </span>
                            </div>
                          </td>
                        )}
                        {isColumnVisible('createdDate') && (
                          <td className="table_dats">
                            {datepipeModel.date(itm.createdAt)}
                          </td>
                        )}

                        {/* Action column */}
                        {((user?.role == "brand" || permission("banner_edit")) && isColumnVisible('action')) && (
                          <td className="table_dats">
                            <div className="action_icons gap-3 ">
                              {
                                <>
                                  {isAllow("editAdmins") ? (
                                    <>
                                      <a
                                        className="edit_icon action-btn"
                                        title="Edit"
                                        onClick={(e) =>
                                          edit(itm.id || itm?._id)
                                        }
                                      >
                                        <i
                                          className="material-icons edit "
                                          title="Edit"
                                        >
                                          edit
                                        </i>
                                      </a>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {isAllow("deleteAdmins") &&
                                    permission("banner_delete") ? (
                                    <>
                                      <a
                                        className="edit_icon edit-delete"
                                        onClick={() =>
                                          deleteItem(itm.id || itm?._id)
                                        }
                                      >
                                        <i
                                          className={`material-icons delete`}
                                          title="Delete"
                                        >
                                          {" "}
                                          delete
                                        </i>
                                      </a>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              }
                              <></>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {!loaging && total == 0 ? (
              <div className="py-3 text-center">No Data Found</div>
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
            from {total} Items
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

      <style jsx>{`
        .type-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .banner-type {
          background-color: #e3f2fd;
          color: #1976d2;
        }
        .link-type {
          background-color: #f3e5f5;
          color: #7b1fa2;
        }
        .link-icon-placeholder {
          width: 40px;
          height: 40px;
          background: #f8f9fa;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
        }
        .user-description {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .max-w-200 {
          max-width: 200px;
        }
      `}</style>
    </Layout>
  );
};

export default Html;