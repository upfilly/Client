'use client'

import React, { useEffect, useState } from 'react';
import ApiClient from '../../methods/api/apiClient';
import './style.scss';
import loader from '../../methods/loader';
import Html from './html';
import { userType } from '../../models/type.model';
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import { useParams,useRouter } from 'next/navigation';
import Swal from 'sweetalert2'


const Types = () => {
    const user = crendentialModel.getUser()
    const {role} =useParams()
    const [filters, setFilter] = useState({ page: 1, count: 50, search: '', isDeleted: false,status:'' })
    const [data, setData] = useState([])
    const [tab, setTab] = useState('list')
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const [tableCols, setTableCols] = useState([])
    const [form, setform] = useState(userType)
    const history=useRouter()
    

    useEffect(() => {
        if (user) {
            setFilter({ ...filters})
            getData({ page: 1 })
        }
    }, [])


    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        let url='common-category/all'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                setData(res.data.data)
                setTotal(res.data.total)
            }
            setLoader(false)
        })
    }


    const clear = () => {
        setFilter({ ...filters, search: '', page: 1 })
        getData({ search: '', page: 1 })
    }

    const deleteItem = (id:any) => {

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result:any) => {
            if (result.isConfirmed) {
            loader(true)
            ApiClient.delete('common-category', {id: id }).then(res => {
                if (res.success) {
                    toast.success(res.message)
                    clear()
                }
                loader(false)
            })
            }
          })
    }

    const pageChange = (e:any) => {
        setFilter({ ...filters, page: e })
        getData({ page: e })
    }

    const ChangeStatus = (e:any) => {
        setFilter({ ...filters, status: e, page: 1 })
        getData({ status: e, page: 1 })
    }

    const filter = (p={}) => {
        setFilter({ ...filters, ...p})
        getData({ ...p })
    }

    const statusChange=(itm:any)=>{
        let status='active'
        if(itm.status=='active') status='deactive'

        Swal.fire({
            title: ``,
            text: `Do you want to ${status=='active'?'Activate':'Deactivate'} this Type`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result:any) => {
            if (result.isConfirmed) {
                loader(true)
                ApiClient.put(`change/status`,{status,id:itm.id,model:'common-category'}).then(res=>{
                    if(res.success){
                        getData()
                    }
                    loader(false)
                })
            }
          })
    }

    const view=(id:any)=>{
        history.push("/types/detail/"+id)
    }

    const edit=(id:any)=>{
        let url=`/types/edit/${id}`
        if(role) url=`/campaign/${role}/edit/${id}`
        history.push(url)
    }

    const add=()=>{
        let url=`/types/add`
        history.push(url)
    }


    const reset=()=>{
        let filter={
            status: '',
             page: 1,
             search:''
        }
        setFilter({ ...filters,...filter })
        getData({ ...filter })
        // dispatch(search_success(''))
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
        ChangeStatus={ChangeStatus}
        pageChange={pageChange}
        deleteItem={deleteItem}
        filters={filters}
        loaging={loaging}
        data={data}
        total={total}
        statusChange={statusChange}
    />
    </>;
};

export default Types;
