'use client'

import React, { useEffect, useState } from 'react';
import ApiClient from '../../methods/api/apiClient';
import './style.scss';
import loader from '../../methods/loader';
import Html from './html';
import { userType } from '../../models/type.model';
import axios from 'axios';
import environment from '../../environment';
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import { useParams,useRouter } from 'next/navigation';
import Swal from 'sweetalert2'


const Users = () => {
    const user = crendentialModel.getUser()
    const {role} =useParams()
    const [filters, setFilter] = useState({ page: 0, count: 5, search: '', role:role||'', isDeleted: false,status:'',brand_id:user?.id})
    const [data, setData] = useState([])
    const [tab, setTab] = useState('list')
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const [tableCols, setTableCols] = useState([])
    const [form, setform] = useState(userType)
    const history=useRouter()
    

    useEffect(() => {
        if (user) {
            // setFilter({ ...filters ,page: filters?.page + 1 ,role})
            getData({role, page: 1 })
        }
    }, [role])


    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        let url='campaign/all'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                setData(res.data.data)
                setTotal(res.data.total_count)
            }
            setLoader(false)
        })
    }


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
            ApiClient.delete('campaign', {id: id }).then(res => {
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

    const statusChange=(itm)=>{
        let modal='users'
        let status='active'
        if(itm.status=='active') status='deactive'

        Swal.fire({
            title: ``,
            text: `Do you want to ${status=='active'?'Activate':'Deactivate'} this user`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
                loader(true)
                ApiClient.put(`campaign/change-status`,{status,id:itm.id,model:'users'}).then(res=>{
                    if(res.success){
                        getData()
                    }
                    loader(false)
                })
            }
          })
    }

    const view=(id)=>{
        history.push("/campaign/detail/"+id)
    }

    const edit=(id)=>{
        let url=`/campaign/edit/${id}`
        if(role) url=`/campaign/${role}/edit/${id}`
        history.push(url)
    }

    const add=()=>{
        let url=`/campaign/add`
        if(role) url=`/campaign/${role}/add`
        history.push(url)
    }


    const reset=()=>{
        let filter={
            status: '',
            role:'',
            search:'',
             page: 1,
             count:5
        }
        setFilter({ ...filters,...filter })
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
        filter({ sortBy, key, sorder  })
    }

    const isAllow=(key='')=>{
        
        return true
    }

    return <><Html
        filter={filter}
        isAllow={isAllow}
        reset={reset}
        add={add}
        view={view}
        edit={edit}
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
        // statusChange={statusChange}
    />
    </>;
};

export default Users;
