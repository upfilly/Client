'use client'
import React, { useEffect, useState } from 'react';
import Layout from '../components/global/layout';
import "./style.scss";
import crendentialModel from '@/models/credential.model';
import ApiClient from '@/methods/api/apiClient';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import loader from '@/methods/loader';
import PaymentModal from './paymodal'
import { toast } from 'react-toastify';
import SelectDropdown from '../components/common/SelectDropdown';
import { CurencyData } from '../../methods/currency';
import datepipeModel from '@/models/datepipemodel';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Affiliate() {
  const history = useRouter()
  const user = crendentialModel.getUser()
  const [filters, setFilter] = useState({ page: 1, count: 10, search: '', isDeleted: false })
  const [data, setData] = useState({})
  const [total, setTotal] = useState(0)
  const [loaging, setLoader] = useState(true)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [associateId, setAssociateId] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState(100)
  const [upfillyAmount, setUpfillyAmount] = useState(100)
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Define all available columns
  const allColumns = [
    { key: 'urlParams', label: 'URL Parameters', sortable: false, default: true },
    { key: 'affiliate', label: 'Affiliate', sortable: true, default: true },
    { key: 'brand', label: 'Brand', sortable: true, default: true },
    { key: 'currency', label: 'Currency', sortable: false, default: true },
    { key: 'orderPrice', label: 'Order price', sortable: true, default: true },
    { key: 'orderId', label: 'Order Id', sortable: false, default: true },
    { key: 'transactionDate', label: 'Transaction Date', sortable: true, default: true },
    { key: 'commission', label: 'Commission', sortable: true, default: true },
    { key: 'commissionPaid', label: 'Commission paid', sortable: false, default: true },
    { key: 'commissionStatus', label: 'Commission Status', sortable: true, default: true },
    { key: 'paymentStatus', label: 'Payment Status', sortable: true, default: true },
    { key: 'actions', label: 'Actions', sortable: false, default: true, alwaysShow: true }
  ];

  // Initialize visible columns state
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const defaultColumns = allColumns.filter(col => col.default).map(col => col.key);
    return defaultColumns;
  });

  const handleShow = (price, commission, commission_type, id) => {
    setAssociateId(id)
    calculateCommission(commission_type, price, commission)
  };

  const onChange = (dates) => {
    const [start, end] = dates;
    setShowColumnSelector(false)
    setStartDate(start);
    setEndDate(end);
    filter({ "startDate": start.toISOString().split('T')[0], "endDate": end.toISOString().split('T')[0] })
  };

  const getExchangeRate = async (currency) => {
    try {
      const res = await fetch(`https://v6.exchangerate-api.com/v6/b0247d42906773d9631b53b0/pair/USD/${currency}`);
      const data = await res.json();

      if (data.result === "success") {
        setExchangeRate(data.conversion_rate);
      } else {
        setExchangeRate("")
      }
    } catch (err) {
      setExchangeRate("")
      console.error(err);
    }
  };

  const handleCurrencyChange = (e) => {
    setShowColumnSelector(false)
    const currency = e.value;
    setSelectedCurrency(currency);
    getExchangeRate(currency);
  };

  const convertedCurrency = (price) => {
    if (price && exchangeRate) {
      return (price * exchangeRate).toFixed(2) + " " + selectedCurrency
    } else {
      return price
    }
  }

  function calculateCommission(commission_type, price, commission) {
    let CalPrice;

    if (commission_type === "percentage") {
      CalPrice = price * commission / 100;
    } else {
      CalPrice = price - commission;
    }

    const finalPrice = CalPrice * user?.plan_id?.commission_override / 100
    setUpfillyAmount(finalPrice)
    setCalculatedAmount(finalPrice + CalPrice);
    setShowModal(true);
  }

  function calculatetotalCommission(commission_type, price, commission) {
    let CalPrice;

    if (commission_type === "percentage") {
      CalPrice = price * commission / 100;
    } else {
      CalPrice = price - commission;
    }

    const finalPrice = CalPrice * user?.plan_id?.commission_override / 100
    if (selectedCurrency) {
      return convertedCurrency((finalPrice + CalPrice).toFixed(2))
    } else {
      return (finalPrice + CalPrice).toFixed(2)
    }
  }

  const handleClose = () => setShowModal(false);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      filter();
    }
  };

  const sorting = (key) => {
    let sorder = 'asc'
    if (filters.key == key) {
      if (filters?.sorder == 'asc') {
        sorder = 'desc'
      } else {
        sorder = 'asc'
      }
    }

    let sortBy = `${key} ${sorder}`;
    let page = filters?.page;
    filter({ sortBy, key, sorder, page })
  }

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

  const getData = (p = {}) => {
    setLoader(true)
    let filter;

    if (user?.role == "brand") {
      filter = { ...filters, ...p, brand_id: user?.id }
    } else {
      filter = { ...filters, ...p, affiliate_id: user.id }
    }

    ApiClient.get(`affiliatelink/all`, filter).then(res => {
      if (res.success) {
        setData(res?.data)
        setTotal(res?.data?.total_count)
        setLoader(false)
      }
    })
  };

  const handleCountChange = (count) => {
    setFilter({ ...filters, count: count, page: 1 });
    getData({ count: count, page: 1 });
  };

  useEffect(() => {
    if (user.role == 'brand') {
      getData({ page: 1 })
    } else if (user.role != 'brand') {
      getData({ page: 1 })
    }
  }, [])

  const pageChange = (e) => {
    setFilter({ ...filters, page: e.selected })
    getData({ page: e.selected + 1 })
  }

  const filter = (p = {}) => {
    setFilter({ ...filters, ...p })
    getData({ ...p, page: 1 })
  }
  
  const ChangeStatus = (e, key) => {
    setFilter({ ...filters, [key]: e })
    getData({ [key]: e, page: 1, user_id: user?.id })
  }

  const statusChange = (itm, id) => {
    if (itm === 'accepted') {
      ApiClient.put('update/commission/status', { commission_status: itm, id: id }).then((res) => {
        if (res.success) {
          toast.success(res.message)
          getData({ page: 1 });
        }
      });
    } else {
      Swal.fire({
        html: `
         <h2 style="" class="modal-title-main pt-0">Deny Commission</h2>
            <p class="text-left  mt-3 mb-2" style="font-weight:600; font-size:14px; letter-spacing:.64px;">Mention your reason :<p/>
              <textarea type="text" id="denialReason" class="swal2-textarea p-2 w-100 m-0" placeholder="Enter here..."></textarea>
            `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Deny',
      }).then((result) => {
        if (result.isConfirmed) {
          const denialReason = document.getElementById('denialReason').value;

          if (denialReason.trim() === '') {
            Swal.fire('Error', 'Please enter a reason for deny', 'error');
            return;
          }

          loader(true);
          ApiClient.put('update/commission/status', { commission_status: itm, id: id, reason: denialReason }).then((res) => {
            if (res.success) {
              toast.success(res.message)
              getData({ page: 1 });
            }
            loader(false);
          });
        }
      });
    }
  };

  const reset = () => {
    let filter = {
      user_id: user?.id,
      "startDate": "",
      "endDate": "",
      role: '',
      search: '',
      page: 1,
      count: 10,
      commission_paid: '',
      commission_status: ''
    }
    setEndDate(null)
    setStartDate(null)
    setIsOpen(false)
    setFilter({ ...filters, ...filter })
    getData({ ...filter })
  }

  const view = (id) => {
    history.push("/payments/detail/" + id)
  }

  const changeTransactionStatus = (e) => {
    setFilter({ ...filters, transaction_type: e, page: 0 })
    getData({ transaction_type: e, page: 1, user_id: user?.id })
  }

  const exportToExcel = async () => {
    let filter;

    if (user?.role == "brand") {
      filter = {...filters, brand_id: user?.id, export_to_xls: "yes" };
    } else {
      filter = {...filters, affiliate_id: user?.id, export_to_xls: "yes" };
    }

    delete filter?.search

    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
      myHeaders.append("Cookie", "sails.sid=s%3AZt0ciPk2dIjb8j5sjaC8Z_PyD36QeF_C.ZfQkttpL0BhEUCkJnb9f74vjK6g%2BtcZrprMYHBL8cGI");

      const queryParams = new URLSearchParams(filter).toString();
      const url = `https://api.upfilly.com/affiliatelink/all?isDeleted=false&search=&role=&commission_paid=&commission_status=&${queryParams}`;

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'Transactions.xlsx'; // or whatever filename you expect
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (error) {
      console.error("Error exporting to Excel:", error);
      // Handle the error appropriately
    }
  };

  const uniqueKeys = data?.data?.reduce((headers, itm) => {
    if (itm?.urlParams && typeof itm.urlParams === 'object') {
      Object.keys(itm.urlParams).forEach(key => {
        if (!headers.includes(key)) {
          headers.push(key);
        }
      });
    }
    return headers;
  }, []);

  return (
    <>
      <Layout handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Track Data" filters={filters}>
        <div className='nmain-list  mb-3 main_box'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='card-header'>
                <div className="main_title_head d-flex gap-2 justify-content-between align-items-center">
                  <h3 className="mb-2">
                    Commission Transactions
                  </h3>

                  <article className="d-flex gap-2 filterFlex phView ct-dropdown-wrapper">
                    <div className='searchInput m-0'>
                      <input
                        type="text"
                        value={filters.search}
                        placeholder="Search"
                        className="form-control h-100"
                        onChange={(e) =>{setShowColumnSelector(false); e.target.value == "" ? reset() : setFilter({...filters, search: e.target.value })}}
                      />
                      <i className="fa fa-search search_fa" onClick={() => {
                        filter()
                      }} aria-hidden="true"></i>
                    </div>

                    <SelectDropdown theme='search'
                      id="statusDropdown"
                      displayValue="name"
                      placeholder="Commission Status"
                      intialValue={filters.commission_status}
                      result={e => { ChangeStatus(e.value, "commission_status");setShowColumnSelector(false) }}
                      options={[
                        { id: 'pending', name: 'Pending' },
                        { id: 'accepted', name: 'Accepted' },
                        { id: 'rejected', name: 'Rejected' },
                      ]}
                    />

                    <SelectDropdown
                      theme='search'
                      id="currencyDropdown"
                      displayValue="name"
                      placeholder="Select Currency"
                      intialValue={selectedCurrency}
                      result={handleCurrencyChange}
                      options={CurencyData}
                    />

                    <div className='width80'>
                      <SelectDropdown theme='search'
                        id="statusDropdown"
                        displayValue="name"
                        placeholder="Paid Status"
                        intialValue={filters.commission_paid}
                        result={e => { ChangeStatus(e.value, "commission_paid");setShowColumnSelector(false) }}
                        options={[
                          { id: 'pending', name: 'Pending' },
                          { id: 'paid', name: 'Paid' },
                          { id: 'unpaid', name: 'unpaid' },
                        ]}
                      />
                    </div>

                    <div class="date-picker-box">
                      <DatePicker
                        className="datepicker-field"
                        selected={startDate}
                        onChange={onChange}
                        startDate={startDate}
                        endDate={endDate}
                        showIcon
                        placeholderText=" Date Range"
                        selectsRange
                      />
                    </div>

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

                    <button 
                      className="btn btn-primary"
                      onClick={exportToExcel}
                      disabled={loaging || total === 0}
                    >
                      <i className="fa fa-download mr-2"></i> Export
                    </button>

                    {startDate || endDate || filters.search || filters.commission_paid || filters.commission_status ? <>
                      <a className="btn btn-primary" onClick={e => reset()}>
                        Reset
                      </a>
                    </> : <></>}
                  </article>
                </div>
              </div>
            </div>
            <div className='row '>
              <div className='respon_data'>
                <div className='table_section '>
                  <div className='table-responsive '>
                    <table className="table table-striped ">
                      <thead className="thead-clr">
                        <tr>
                          {isColumnVisible('urlParams') && uniqueKeys?.map(key => (
                            <th key={key} scope="col">{key}</th>
                          ))}
                          {isColumnVisible('affiliate') && (
                            <th scope="col" onClick={e => sorting('affiliate_name')}>Affiliate{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                          )}
                          {isColumnVisible('brand') && (
                            <th scope="col" onClick={e => sorting('brand_name')}>Brand{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                          )}
                          {isColumnVisible('currency') && (
                            <th scope="col" >Currency</th>
                          )}
                          {isColumnVisible('orderPrice') && (
                            <th scope="col" onClick={e => sorting('price')}>Order price{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                          )}
                          {isColumnVisible('orderId') && (
                            <th scope="col" >Order Id</th>
                          )}
                          {isColumnVisible('transactionDate') && (
                            <th scope="col" onClick={e => sorting('timestamp')}>Transaction Date{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                          )}
                          {isColumnVisible('commission') && (
                            <th scope="col" onClick={e => sorting('commission')}>Commission{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                          )}
                          {isColumnVisible('commissionPaid') && (
                            <th scope="col" >Commission paid</th>
                          )}
                          {isColumnVisible('commissionStatus') && (
                            <th scope="col" onClick={e => sorting('commission_status')}>Commission Status{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                          )}
                          {isColumnVisible('paymentStatus') && (
                            <th scope="col" onClick={e => sorting('commission_paid')}>Payment Status{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                          )}
                          {isColumnVisible('actions') && (
                            <th>Action</th>
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {!loaging && data?.data?.map((itm, i) => {
                          return <tr className='data_row' key={i}>
                            {isColumnVisible('urlParams') && uniqueKeys?.map(key => {
                              const value = itm?.urlParams && itm.urlParams[key] !== undefined ? itm.urlParams[key] : null;
                              return <td key={key} className='name-person ml-2'>{value || "--"}</td>;
                            })}
                            {isColumnVisible('affiliate') && (
                              <td className='name-person ml-2' >{itm?.affiliate_name}</td>
                            )}
                            {isColumnVisible('brand') && (
                              <td className='name-person ml-2' >{itm?.brand_name || "--"}</td>
                            )}
                            {isColumnVisible('currency') && (
                              <td className='name-person ml-2' >{itm?.currency}</td>
                            )}
                            {isColumnVisible('orderPrice') && (
                              <td className='name-person ml-2' >{convertedCurrency(itm?.price)}</td>
                            )}
                            {isColumnVisible('orderId') && (
                              <td className='name-person ml-2' >{itm?.order_id}</td>
                            )}
                            {isColumnVisible('transactionDate') && (
                              <td className='name-person ml-2' >{datepipeModel.date(itm?.timestamp || itm?.createdAt)}</td>
                            )}
                            {isColumnVisible('commission') && (
                              <td className='name-person ml-2' >{itm?.campaign_details?.commission_type == "percentage" ? "" : "$"}{itm?.campaign_details?.commission_type == "percentage" ? itm?.campaign_details?.commission : convertedCurrency(itm?.campaign_details?.commission || itm?.amount_of_commission)}{itm?.campaign_details?.commission_type == "percentage" ? "%" : ""}</td>
                            )}
                            {isColumnVisible('commissionPaid') && (
                              !itm?.amount_of_commission ? <td className='name-person ml-2' >
                                {selectedCurrency ? calculatetotalCommission(itm?.campaign_details?.commission_type, itm?.price, itm?.campaign_details?.commission) : `$${calculatetotalCommission(itm?.campaign_details?.commission_type, itm?.price, itm?.campaign_details?.commission)}`}
                              </td> : 
                              <td className='name-person ml-2' >
                                {`$${convertedCurrency(itm?.amount_of_commission)}`}
                              </td>
                            )}
                            {isColumnVisible('commissionStatus') && (
                              <td className='name-person ml-2 text-capitalize' >{itm?.commission_status}</td>
                            )}
                            {isColumnVisible('paymentStatus') && (
                              <td className='name-person ml-2 text-capitalize' >{itm?.commission_paid}</td>
                            )}
                            {isColumnVisible('actions') && (
                              <td className='table_dats d-flex align-items-center '>
                                {itm?.commission_status == 'pending' ? (
                                  <div className='d-flex align-items-center'>
                                    <button onClick={() => statusChange("accepted", itm?.id || itm?._id)} className="btn btn-primary mr-2 btn_actions">
                                      <i className='fa fa-check'></i>
                                    </button>
                                    <button onClick={() => statusChange("rejected", itm?.id || itm?._id)} className="btn btn-danger br50 bg-red mr-2 btn_actions">
                                      <i className='fa fa-times'></i>
                                    </button>
                                  </div>
                                ) : itm?.commission_status == 'rejected' ? (
                                  <div className="btn btn-primary mr-2">Rejected</div>
                                ) : (<>
                                  {itm?.commission_paid != "paid" ? <div className="btn btn-primary mr-2" onClick={() => handleShow(itm?.price, itm?.campaign_details?.commission, itm?.campaign_details?.commission_type, itm?.id || itm?._id)}>Pay Now</div> : "Paid"}
                                </>
                                )}
                              </td>
                            )}
                          </tr>
                        })}
                      </tbody>
                    </table>
                    {loaging ? <div className="text-center py-4">
                      <img src="/assets/img/loader.gif" className="pageLoader" />
                    </div> : <></>}
                    {!loaging && total == 0 ? <div className="mb-3 text-center">No Data Found</div> : <></>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`paginationWrapper ${!loaging && total > 10 ? '' : 'd-none'}`}>
          <span>Show <select
            className="form-control"
            onChange={(e) => handleCountChange(parseInt(e.target.value))}
            value={filters.count}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
            <option value={200}>200</option>
          </select> from {total} Requests</span>
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
        <PaymentModal
          showModal={showModal}
          setShowModal={setShowModal}
          calculatedAmount={calculatedAmount}
          setCalculatedAmount={setCalculatedAmount}
          handleShow={handleShow}
          handleClose={handleClose}
          associateId={associateId}
          user={user}
          upfillyAmount={upfillyAmount}
        />
      </Layout>
    </>
  );
}