"use client"

import React, { useEffect, useState } from 'react';
import crendentialModel from '@/models/credential.model';
import ApiClient from '@/methods/api/apiClient';
import Swal from 'sweetalert2';
import Html from './Html';
import { toast } from 'react-toastify';
import loader from '@/methods/loader';
import { useRouter } from 'next/navigation';

const AffiliateTeam = () => {

    const user = crendentialModel.getUser()
    const [filters, setFilter] = useState({page: 0, count: 10, search: '', isDeleted: false,status:'',role:''})
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const history=useRouter()
    

    useEffect(() => {
        if (user) {
            // setFilter({ ...filters})
            getData({ page: 1 })
        }
    }, [])


    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        let url='invite/users-list'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                setData(res.data.data)
                setTotal(res?.data?.total)
            }
            setLoader(false)
        })
    }


    const clear = () => {
        setFilter({ ...filters, search: '', page: 0 })
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
            loader(true)
            ApiClient.delete(`delete?model=users&id=${id}`).then(res => {
                if (res.success) {
                    toast.success(res.message)
                    clear()
                }
                loader(false)
            })
            }
          })
    }

    const pageChange = (e) => {
        setFilter({ ...filters, page: e?.selected })
        getData({ page: e?.selected + 1 })
    }

    const ChangeStatus = (e) => {
        setFilter({ ...filters, status: e, page: 0 })
        getData({ status: e, page: 1 })
    }

    const ChangeRole =(e)=>{
        setFilter({ ...filters, role: e })
        getData({ role: e, page: 1 })  
    }

    const filter = (p={}) => {
        setFilter({ ...filters, ...p})
        getData({ ...p , page:1})
    }

    const statusChange=(itm)=>{
        let status='active'
        if(itm.status=='active') status='deactive'

        Swal.fire({
            title: ``,
            text: `Do you want to ${status=='active'?'Active':'Inactive'} this group`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
                loader(true)
                ApiClient.put(`change/status`,{status,id:itm.id,model:'users'}).then(res=>{
                    if(res.success){
                        getData({page:1})
                    }
                    loader(false)
                })
            }
          })
    }

    const statusPopular=(itm)=>{
        let key='isPopular'
        if(itm?.isPopular) key='isPopular'

        Swal.fire({
            title: ``,
            text: `Do you want to update this `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
                loader(true)
                ApiClient.put(`common/toggle-key`,{key,id:itm.id,model:'affiliatemanagement'}).then(res=>{
                    if(res.success){
                        getData({page:1})
                    }
                    loader(false)
                })
            }
          })
    }

    const view = (id) => {
        history.push("/users/detail/" + id)
    }

    const edit = (id) => {
        let url = `/users/edit/${id}`
        // if (role) url = `/subcategories/${role}/edit/${id}`
        history.push(url)
    }

    const add = () => {
        let url = `/users/add`
        // if (role) url = `/subcategoriess/${role}/add`
        history.push(url)
    }


    const reset = () => {
        let filter = {
            status: '',
            count:10,
            search: '',
            page: 1,
            role:''
        }
        setFilter({ ...filters, ...filter })
        getData({ ...filter })
        // dispatch(search_success(''))
    }

    const sorting=(key)=>{
        let sorder='asc'
        if(filters.key==key){
          if(filters?.sorder=='asc'){
            sorder='desc'
          }else{
            sorder='asc'
          }
        }
        
        let sortBy=`${key} ${sorder}`;
        filter({sortBy,key,sorder})
      }


    return <>

        <Html
            filter={filter}
            reset={reset}
            sorting={sorting}
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
            statusPopular={statusPopular}
            setFilter={setFilter}
            user={user}
            history={history}
            ChangeRole={ChangeRole}
        />
    </>;
};

AffiliateTeam.layout = "Contentlayout"

export default AffiliateTeam;
