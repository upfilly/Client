'use client'

import React, { useEffect, useState } from 'react';
import ApiClient from '../../methods/api/apiClient';
import './style.scss';
import Html from './html';
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2'

const Users = () => {
    const user = crendentialModel.getUser()
    const { role } = useParams()
    const [filters, setFilter] = useState({ isDeleted: false ,affiliate_id:''})
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [AffiliateDataId, setAffiliateDataId] = useState([]);
    const [AffiliateData, setAffiliateData] = useState()
    const [loaging, setLoader] = useState(true)
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const history = useRouter()

    console.log(startDate, endDate ,"startDate, endDatestartDate, endDate")

    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        let url = 'dataset/list'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                setData(res.data)
                setTotal(res.total)
            }
            setLoader(false)
        })
    }

    const getAffiliateData = (p = {}) => {
        // let filter = {brand_id:user?.id}
        let url = 'getallaffiliatelisting'
        ApiClient.get(url, { brand_id: user?.id || user?._id }).then(res => {
            if (res.success) {
                const data = res?.data?.map((data) => {
                    return ({
                        id: data?.id || data?._id,
                        name: data?.userName
                    })
                })
                setAffiliateData(data)
            }
        })
    }

    useEffect(() => {
        getAffiliateData()
    }, [])

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
                ApiClient.delete('delete', { id: id, model: 'product' }).then(res => {
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

    const filter = (p = {}) => {
        setFilter({ ...filters, ...p })
        getData({ ...p, page: 1, addedBy: user?.id })
    }



    const ChangeRole = (e) => {
        setFilter({ ...filters, role: e, page: 1 })
        getData({ role: e, page: 1 })
    }
    const ChangeStatus = (e) => {
        setFilter({ ...filters, invite_status: e, page: 1 })
        getData({ ...filters, invite_status: e, page: 1 })
    }

    // const statusChange=(itm)=>{
    //     let modal='users'
    //     let status='active'
    //     if(itm.status=='active') status='deactive'

    //     Swal.fire({
    //         title: ``,
    //         text: `Do you want to ${status =='active'?'Active':'Deactive'} this user`,
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#6c757d',
    //         confirmButtonText: 'Yes'
    //       }).then((result) => {
    //         if (result.isConfirmed) {
    //             loader(true)
    //             ApiClient.put(`change/status`,{status,id:itm.id,model:'product'}).then(res=>{
    //                 if(res.success){
    //                     getData({page: 1})
    //                 }
    //                 loader(false)
    //             })
    //         }
    //       })
    // }

    const view = (id) => {
        history.push("/invites/detail/" + id)
    }

    // const edit=(id)=>{
    //     let url=`/Offers/edit/${id}`
    //     if(role) url=`/product/${role}/edit/${id}`
    //     history.push(url)
    // }

    // const add=()=>{
    //     let url=`/Offers/add`
    //     if(role) url=`/Offers/${role}/add`
    //     history.push(url)
    // }


    const reset = () => {
        let filter = {
            status: '',
            role: '',
            search: '',
            page: 1,
            count: 10, start_date: '', end_date: '', addedBy: user?.id
        }
        setFilter({ ...filters, ...filter })
        getData({ ...filter })
        // dispatch(search_success(''))
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
        filter({ sortBy, key, sorder })
    }

    const isAllow = (key = '') => {

        return true
    }

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
        AffiliateDataId={AffiliateDataId}
        setAffiliateDataId={setAffiliateDataId}
        AffiliateData={AffiliateData}
        setAffiliateData={setAffiliateData}
        dateRange={dateRange}
        setDateRange={setDateRange}
        start={startDate}
        end={endDate}
    />
    </>;
};

export default Users;
