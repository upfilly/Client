'use client'
import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/global/layout';
import './style.scss';
import { useRouter } from 'next/navigation';
import LineChart from '../components/common/LineChart/LineChart'
import crendentialModel from '@/models/credential.model';
import ApiClient from '@/methods/api/apiClient';
import SelectDropdown from '../components/common/SelectDropdown';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Html = ({
  reset,
  filters,
  setFilter,
  filter,
  AffiliateDataId,
  setAffiliateDataId,
  AffiliateData,
  setAffiliateData,
  dateRange,
  setDateRange,
  start,
  end,
}) => {
  const history = useRouter()
  const user = crendentialModel.getUser()
  const [activeSidebar, setActiveSidebar] = useState(false)
  const [analyticData, setAnalyticData] = useState()
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      filter();
    }
  };
  const isoStart = start instanceof Date ? start.toISOString() : start;
  const isoEnd = end instanceof Date ? end.toISOString() : end;

  const getAnalyticsData = (p = {}) => {
    let url = 'analytics-sales'

    let filter = { ...filters , affiliate_id: AffiliateDataId , startDate: isoStart , endDate: isoEnd }

    if (!AffiliateDataId) {
      filter = { ...filters, ...p, brand_id: user?.id }
    } else {
      filter = { ...filters, ...p, affiliate_id: AffiliateDataId}
    }

    ApiClient.get(url, filter).then(res => {
      if (res.success) {
        setAnalyticData(res?.data)
      }
    })
  }

  useEffect(() => {
    getAnalyticsData()
  }, [start, end])

  const options = {
    chart: {
      title: "Box Office Earnings in First Two Weeks of Opening",
      subtitle: "in millions of dollars (USD)",
    },
  };

  return (
    <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Performance" filters={filters}>
      <div className='sidebar-left-content'>


      <div className="accordion" id="accordionExample">
      <div className="accordion-item main_accordingbx">
        <h2 className="accordion-header">
          <button 
            className="accordion-button" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#collapseOne" 
            aria-expanded="true" 
            aria-controls="collapseOne"
          >
            Program - Daily
          </button>
        </h2>
        <div 
          id="collapseOne" 
          className="accordion-collapse collapse show" 
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <div className="program_bx">
              <div className="row">
                <div className="col-6">
                  <div className="selectbx1">
                    <SelectDropdown
                      id="statusDropdown"
                      displayValue="name"
                      placeholder="All Affiliates"
                      initialValue={AffiliateDataId}
                      result={e => { setAffiliateDataId(e.value); }}
                      options={AffiliateData}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="selectbx1">
                    <div className="form-group">
                      <DatePicker
                        showIcon
                        className="date-picker form-control"
                        monthsShown={1}
                        shouldCloseOnSelect={true}
                        selectsRange={true}
                        placeholderText="Select Date Range"
                        startDate={start}
                        endDate={end}
                        onChange={(update) => {
                          setDateRange([update[0], update[1]]);
                        }}
                        isClearable
                        minDate={new Date()}
                        // withPortal
                        dateFormat={"dd/MM/yyyy"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        <div className=" graph_charts ">
          <LineChart data={analyticData?.data?.[0]} />
        </div>
      </div>
    </Layout>
  );
};

export default Html;
