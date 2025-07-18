'use client'

import React, { useEffect, useState } from 'react';
import ApiClient from '../../methods/api/apiClient';
import './style.scss';
import Html from './Html';
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import { useParams,useRouter } from 'next/navigation';
import Swal from 'sweetalert2'

const Users = () => {
    const user = crendentialModel.getUser()
    const {role} =useParams()
    const [filters, setFilter] = useState({ page: 0, count: 10, search: '', isDeleted: false, affiliate_id:user?.id || user?._id
    })
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const history=useRouter()

    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        let url='listDataSets'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                setData(res.data)
                setTotal(res.total)
            }
            setLoader(false)
        })
    }

    const uniqueKeys = new Set();
    data?.forEach(item => {
        Object.keys(item).forEach(key => uniqueKeys.add(key));
    });

    const cleanKey = (key) => {
        return key.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().replace(/\s+/g, ' ');
      };
    
    const uniqueKeysArray = Array.from(uniqueKeys).map(cleanKey).sort();

    const comprehensiveTemplate = data.length ? data?.map(item => {
        const newItem = {};
        uniqueKeysArray.forEach(key => {
          newItem[key] = item[key] !== undefined ? item[key] : '--';
        });
        return newItem;
      }) : []
    
    const clear = () => {
        setFilter({ ...filters, search: '', page: 1 })
        getData({ search: '', page: 1 })
    }

    const deleteItem = (id) => {

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
            // loader(true)
            ApiClient.delete('delete', {id: id ,model:'product' }).then(res => {
                if (res.success) {
                    toast.success(res.message)
                    clear()
                }
                // loader(false)
            })
            }
          })
    }

    const pageChange = (e) => {
        setFilter({ ...filters, page: e.selected })
        getData({ page: e.selected + 1 })
    }

    const filter = (p={}) => {
        setFilter({ ...filters, ...p})
        getData({ ...p , page:1,addedBy:user?.id})
    }

    const ChangeRole = (e) => {
        setFilter({ ...filters, role: e, page: 1 })
        getData({ role: e, page: 1 })
    }

    const ChangeStatus = (e) => {
        setFilter({ ...filters, invite_status: e, page: 1 })
        getData({...filters, invite_status: e, page: 1 })
    }

    const view=(id)=>{
        history.push("/invites/detail/"+id)
    }

    const reset=()=>{
        let filter={
            status: '',
            role:'',
            search:'',
             page: 1,
             count:10, start_date:'', end_date: '',addedBy:user?.id
        }
        setFilter({ ...filters,...filter })
        getData({ ...filter })
    }

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
        filter({sortBy, key, sorder  })
    }

    const isAllow=(key='')=>{
        
        return true
    }

    console.log(data,"klklklkl")

    return <><Html
        filter={filter}
        isAllow={isAllow}
        reset={reset}
        view={view}
        role={role}
        ChangeRole={ChangeRole}
        ChangeStatus={ChangeStatus}
        pageChange={pageChange}
        deleteItem={deleteItem}
        filters={filters}
        loaging={loaging}
        data={data}
        total={total}
        sorting={sorting}
        setFilter={setFilter}
        getData={getData}
        uniqueKeys={uniqueKeys}
        comprehensiveTemplate={comprehensiveTemplate}
        uniqueKeysArray={uniqueKeysArray}
    />
    </>;
};

export default Users;
