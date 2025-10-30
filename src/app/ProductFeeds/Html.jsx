import React, { useState } from "react";
import Layout from "@/app/components/global/layout";
import ReactPaginate from "react-paginate";
import "./style.scss";
import { toast } from "react-toastify";
import loader from "@/methods/loader";
import ApiClient from "@/methods/api/apiClient";
import environment from "../../environment";
import { FaCopy } from "react-icons/fa"; // import the copy icon from react-icons
import datepipeModel from "@/models/datepipemodel";

const Html = ({
  reset,
  pageChange,
  filters,
  loaging,
  data,
  total,
  setFilter,
  filter,
  getData,
  comprehensiveTemplate,
  sorting,
}) => {
  const [activeSidebar, setActiveSidebar] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setform] = useState({
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [copySuccess, setCopySuccess] = useState("");

  const downloadCsv = (csv) => {
    ApiClient.get("csv", { csv_url: `${csv}` }).then((res) => {
      if (res.success) {
        const file = res?.data;
        window.open(file);
      }
    });
  };

  const copyToClipboard = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopySuccess("URL copied to clipboard!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  const handleCountChange = (count) => {
    setFilter({ ...filters, count: count, page: 1 });
    getData({ count: count, page: 1 });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      filter();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form?.email) {
      setSubmitted(true);
      return;
    }
    loader(true);
    let method = "post";
    let url = "invite";

    let value = {
      ...form,
    };

    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        toast.success(res.message);
        handleClose();
        setform({
          email: "",
        });
      }
      getData({ ...filters, page: 1 });
      loader(false);
    });
  };

  return (
    <Layout
      activeSidebar={activeSidebar}
      handleKeyPress={handleKeyPress}
      setFilter={setFilter}
      reset={reset}
      filter={filter}
      name="Product Feeds"
      filters={filters}
    >
      <div className="sidebar-left-content">
        <div className="d-flex justify-content-end align-items-center flex-wrap gap-3 ">
          <div className="d-flex align-items-center flex-wrap gap-2">
            <div className="searchInput">
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
                className="fa fa-search search_fa"
                onClick={() => filter()}
                aria-hidden="true"
              ></i>
            </div>
          </div>

          <div className="d-flex gap-3 align-items-center">
            <div className="d-flex filterFlex phView">
              {filters.status ? (
                <>
                  <a className="btn btn-primary" onClick={(e) => reset()}>
                    Reset
                  </a>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        <div className="table_section">
          <div className="table-responsive ">
            <table className="table table-striped table-width">
              {total !== 0 && (
                <thead className="table_head">
                  <tr className="heading_row">
                    <th
                      scope="col"
                      className="table_data"
                      onClick={(e) => sorting("doc_name")}
                    >
                      Document Name{filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                    <th scope="col" className="table_data">
                      Brand Name
                    </th>
                    <th scope="col" className="table_data">
                      No. of Products
                    </th>
                    <th
                      scope="col"
                      className="table_data"
                      onClick={(e) => sorting("lastImportedDate")}
                    >
                      Last Updated{filters?.sorder === "asc" ? "↑" : "↓"}
                    </th>
                    {/* <th scope="col" className='table_data'>Type</th> */}
                    <th scope="col" className="table_data">
                      Action
                    </th>
                  </tr>
                </thead>
              )}
              <tbody>
                {!loaging &&
                  data &&
                  data.map((itm, i) => {
                    console.log(itm, "item");
                    return (
                      <tr className="data_row" key={i}>
                        <td className="table_dats">{itm?.doc_name || "--"}</td>
                        <td className="table_dats">
                          {itm?.brand_id?.fullName}
                        </td>
                        <td className="table_dats">
                          {itm?.noOfProducts || "--"}
                        </td>
                        <td className="table_dats">
                          {datepipeModel.date(itm.lastImportedDate)}
                        </td>
                        {/* <td className='table_dats'>{itm?.url ? "URL" : "CSV"}</td> */}
                        {itm?.url ? (
                          <td className="table_dats">
                            <a
                              href={`${environment?.api}/${itm?.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              CSV
                            </a>
                            <FaCopy
                              onClick={() =>
                                copyToClipboard(
                                  `${environment?.api}/${itm?.url}`
                                )
                              }
                              className="copy-icon ml-2"
                              title={`Copy CSV URL ${`${environment?.api}/${itm?.xml}`}`}
                            />
                            <a
                              className="ml-4"
                              href={`${environment?.api}/${itm?.xml}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              XML
                            </a>
                            <FaCopy
                              onClick={() =>
                                copyToClipboard(
                                  `${environment?.api}/${itm?.xml}`
                                )
                              }
                              className="copy-icon ml-2"
                              title={`Copy XML URL ${`${environment?.api}/${itm?.xml}`}`}
                            />
                          </td>
                        ) : (
                          <td className="table_dats">
                            <a
                              href={`${environment?.api}/${itm?.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              CSV
                            </a>
                            <FaCopy
                              onClick={() =>
                                copyToClipboard(
                                  `${environment?.api}/${itm?.filePath}`
                                )
                              }
                              className="copy-icon ml-2"
                              title={`Copy CSV URL ${`${environment?.api}/${itm?.xml}`}`}
                            />
                            <a
                              className="ml-4"
                              href={`${environment?.api}/${itm?.xml}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              XML
                            </a>
                            <FaCopy
                              onClick={() =>
                                copyToClipboard(
                                  `${environment?.api}/${itm?.xml}`
                                )
                              }
                              className="copy-icon ml-2"
                              title={`Copy XML URL ${`${environment?.api}/${itm?.xml}`}`}
                            />
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {loaging ? (
              <div className="text-center py-4">
                <img src="/assets/img/loader.gif" className="pageLoader" />
              </div>
            ) : null}
            {!loaging && comprehensiveTemplate?.length === 0 ? (
              <div className="py-3 text-center">No Data Found</div>
            ) : null}
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
            from {total} Product Feeds
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
      </div>
    </Layout>
  );
};

export default Html;
