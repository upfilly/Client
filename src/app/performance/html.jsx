'use client'
import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/global/layout';
import './style.scss';
import { useRouter } from 'next/navigation';
import {Chart} from "react-google-charts";
import { toast } from 'react-toastify';
import loader from '@/methods/loader';
import ApiClient from '@/methods/api/apiClient';
import environment from '@/environment';

const Html = ({
  view,
  edit,
  reset,
  ChangeStatus,
  sorting,
  pageChange,
  deleteItem,
  filters,
  loaging,
  isAllow,
  total,
  setFilter,
  filter,
  statusChange,
  getData
}) => {
  const history = useRouter()
  const [activeSidebar, setActiveSidebar] = useState(false)
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      filter();
    }
  };

   const data = [
    [
      "Day",
      "Guardians of the Galaxy",
      // "The Avengers",
      // "Transformers: Age of Extinction",
    ],
    [1, 3.8],
    [2, 3.9],
    [3, 2.4],
    [4, 1.7],
    [5, 1.9],
    [6, 8.87],
    [7, 7.66],
    [8, 1.3],
    [9, 1.9],
    [10, 2.8],
    [11, 5.3],
    [12, 6.6],
    [13, 4.8],
    [14, 4.2],
    [15, 3.8],
    [25, 3.9],
    [35, 2.4],
    [45, 1.7],
    [55, 1.9],
    [65, 8.87],
    [75, 7.66],
    [85, 1.3],
    [95, 1.9],
    [105, 2.8],
    [115, 5.3],
    [125, 6.6],
    [135, 4.8],
    [145, 4.2],
  ];
  
   const options = {
    chart: {
      title: "Box Office Earnings in First Two Weeks of Opening",
      subtitle: "in millions of dollars (USD)",
    },
  };

  return (
    <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Performance" filters={filters}>
      <div className='sidebar-left-content'>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 ">
          jhhh

        </div>
        <div className=" ">
         

        <Chart
      chartType="LineChart"
      width="100%"
      height="700px"
      data={data}
      options={options}
    />
        </div>
      </div>
    </Layout>
  );
};

export default Html;
