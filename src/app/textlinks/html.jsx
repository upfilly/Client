import React, { useState } from "react";
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
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) => {
  const history = useRouter();
  const [activeSidebar, setActiveSidebar] = useState(false);

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

  const renderCategories = (categories) => {
    if (!categories || categories.length === 0) return "--";
    return categories.slice(0, 2).map(cat => cat.name).join(", ");
  };

  return (
    <Layout
      activeSidebar={activeSidebar}
      handleKeyPress={handleKeyPress}
      setFilter={setFilter}
      reset={reset}
      filter={filter}
      name="Text Links"
      filters={filters}
    >
      <div className="sidebar-left-content">
        <div className="d-flex justify-content-md-end gap-2 flex-wrap align-items-center all_flexbx">
          <SelectDropdown
            theme="search"
            id="statusDropdown"
            style={"cursor: pointer"}
            displayValue="name"
            placeholder="Status"
            intialValue={filters.status}
            result={(e) => {
              ChangeStatus(e.value);
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

          <article className="d-flex filterFlex phView">
            {(user?.role == "brand" || permission("textlink_add")) && (
              <>
                <a
                  className="btn btn-primary mb-0 set_reset"
                  onClick={(e) => add()}
                >
                  Add Text Links
                </a>
              </>
            )}

            {(filters.status || startDate) ? (
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
          <div className="table-responsive ">
            <table className="table table-striped table-width">
              <thead className="table_head">
                <tr className="heading_row">
                  <th
                    scope="col"
                    className="table_data"
                    onClick={(e) => sorting("linkName")}
                  >
                    Link Name{filters?.sorder === "asc" ? "↑" : "↓"}
                  </th>
                  <th scope="col" className="table_data">
                    Destination URL
                  </th>
                  <th scope="col" className="table_data">
                    Categories
                  </th>
                  {/* <th scope="col" className="table_data">
                    Description
                  </th> */}
                  <th scope="col" className="table_data">
                    Start Date
                  </th>
                  <th scope="col" className="table_data">
                    End Date
                  </th>
                  <th scope="col" className="table_data">
                    SEO
                  </th>
                  <th scope="col" className="table_data">
                    Deep Link
                  </th>
                  <th
                    scope="col"
                    className="table_data"
                    onClick={(e) => sorting("createdAt")}
                  >
                    Created Date{filters?.sorder === "asc" ? "↑" : "↓"}
                  </th>
                  <th scope="col" className="table_data">
                    Status
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
                    return (
                      <tr className="data_row" key={i}>
                        <td
                          className="table_dats"
                          onClick={(e) => view(itm.id || itm?._id)}
                        >
                          {methodModel.capitalizeFirstLetter(itm.linkName)}
                        </td>
                        <td className="table_datsanch">
                          <a href={itm.destinationUrl} target="_blank" rel="noopener noreferrer">
                            {itm.destinationUrl}
                          </a>
                        </td>
                        <td className="table_dats">
                          {renderCategories(itm.categroyDetails)}
                        </td>
                        {/* <td className="table_dats">
                          {itm.description || "--"}
                        </td> */}
                        <td className="table_dats">
                          {datepipeModel.date(itm.startDate)}
                        </td>
                        <td className="table_dats">
                          {datepipeModel.date(itm.endDate)}
                        </td>
                        <td className="table_dats">
                          {itm.seo ? "Yes" : "No"}
                        </td>
                        <td className="table_dats">
                          {itm.deepLink ? "Yes" : "No"}
                        </td>
                        <td className="table_dats">
                          {datepipeModel.date(itm.createdAt)}
                        </td>
                        <td className="table_dats">
                          <div className={`user_hours`}>
                            <span
                              className={
                                itm?.status == "active"
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

                        {(user?.role == "brand" ||
                          permission("textlink_edit")) && (
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
            from {total} Links
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