"use client"

import React, { useEffect, useState } from 'react';
import DataComparison from '../compareData'
import { useParams } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import Layout from '@/app/components/global/layout';

const ActivityView = () => {
    const [data,setData]=useState([])
    const { id } = useParams();

    const getData = (p = {}) => {
        let url = "activity-log";
        ApiClient.get(url, { id: id }).then((res) => {
          if (res) {
            setData(res?.data);
          }
        });
      };

      console.log(data,"jdgsgd")

      useEffect(()=>{
        getData()
      },[])

    return (<>
    <Layout>
      {data?.length != 0 ?
    <DataComparison oldData={data?.old_data} newData={data?.data} module={data?.module} type={data?.type}/> : 
   <div className="text-center py-4">
      <img src="/assets/img/loader.gif" className="pageLoader" />
    </div>
    }
    </Layout>
    </>
    );
};

export default ActivityView;