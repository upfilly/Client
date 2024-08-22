'use client'

import React, { useEffect, useState } from 'react';
import ApiClient from '../../../methods/api/apiClient';
import './style.scss';
import Html from './html';
import crendentialModel from '@/models/credential.model';
import { useParams,useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const DataFeedslisting  = ({file}) => {
    const user = crendentialModel.getUser()
    const {role} =useParams()
    const [filters, setFilter] = useState({ page: 0, count: 10, search: '', isDeleted: false,status:''})
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const history=useRouter()
    

    useEffect(() => {
        if (user) {
            // setFilter({ ...filters ,page: filters?.page + 1 ,role})
            getData({role, page: 1 })
        }
    }, [file])


    const getData = (p = {}) => {
        setLoader(true)
        let  filter = { ...filters, ...p ,addedBy:user?.id}

        let url='dataset/list'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                setData(res.data)
                setTotal(res.total)
            }
            setLoader(false)
        })
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
            ApiClient.delete(`delete?model=dataset&id=${id}`).then(res => {
                if (res.success) {
                    toast.success(res.message)
                    getData({page:1})
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
        getData({ ...p , page:filters?.page + 1})
    }

    const ChangeRole = (e) => {
        setFilter({ ...filters, role: e, page: 1 })
        getData({ role: e, page: 1 })
    }
    const ChangeStatus = (e) => {
        setFilter({ ...filters, status: e, page: 1 })
        getData({ status: e, page: 1 })
    }

    const view=(id)=>{
        history.push("/coupons/detail/"+id)
    }

    const edit=(id)=>{
        let url=`/coupons/edit/${id}`
        if(role) url=`/coupons/${role}/edit/${id}`
        history.push(url)
    }

    const add=()=>{
        let url=`/coupons/add`
        if(role) url=`/coupons/${role}/add`
        history.push(url)
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
        filter({ sortBy, key, sorder  })
    }

    const isAllow=(key='')=>{
        
        return true
    }

    return <><Html
        filter={filter}
        isAllow={isAllow}
        add={add}
        view={view}
        edit={edit}
        role={role}
        ChangeRole={ChangeRole}
        ChangeStatus={ChangeStatus}
        pageChange={pageChange}
        filters={filters}
        loaging={loaging}
        data={data}
        total={total}
        sorting={sorting}
        setFilter={setFilter}
        user={user}
        deleteItem={deleteItem}
    />
    </>;
};

export default DataFeedslisting ;
