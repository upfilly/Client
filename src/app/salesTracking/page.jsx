'use client'

import React, { useEffect, useState } from 'react';
import ApiClient from '../../methods/api/apiClient';
import './style.scss';
import loader from '../../methods/loader';
import Html from './html';
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import { useParams,useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2'


const untrackedSales = () => {
    const user = crendentialModel.getUser()
    const {role} =useParams()
    const [filters, setFilter] = useState({ page: 0, count: 10, search: '', role:role||'', isDeleted: false,status:''})
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const history=useRouter()
    const searchParams = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());

    useEffect(() => {
        if (user) {
            setFilter({ ...filters ,page: 1 ,...params})
            getData({role, page: 1 ,...params})
        }
    }, [role])


    const getData = (p = {}) => {
        setLoader(true)
        let filter;
        if(user?.role == 'brand'){
            filter = { ...filters, ...p ,brand_id:user?.id}
        }else{
            filter = { ...filters, ...p ,addedBy:user?.id}
        }

        let url='getallSalesDetails'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                setData(res.data)
                setTotal(res.total)
            }
            setLoader(false)
        })
    }


    const clear = () => {
        setFilter({ ...filters, search: '', page: 1 })
        getData({ search: '', page: 1 })
    }

    const statusChange = (itm, id) => {
        if (itm === 'accepted') {

            loader(true);
          ApiClient.put('updateSales', {brand_id:user?.id || user?._id, status: itm, id: id }).then((res) => {
            if (res.success) {
    
              toast.success(res.message)
              getData({ page: 1 });
            }
            loader(false);
          });
        } else {

            Swal.fire({
         
            html: `
             <h2 style="" class="modal-title-main pt-0">Deny Campaign</h2>
                <p class="text-left  mt-3 mb-2" style="font-weight:600; font-size:14px; letter-spacing:.64px;">Mention your reason :<p/>
                  <textarea type="text" id="denialReason" class="swal2-textarea p-2 w-100 m-0" placeholder="Enter here..."></textarea>
                `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Deny',
          }).then((result) => {
            if (result.isConfirmed) {
              const denialReason = document.getElementById('denialReason').value;
    
              if (denialReason.trim() === '') {
                Swal.fire('Error', 'Please enter a reason for deny', 'error');
                return;
              }
    
              loader(true);
              ApiClient.put('update/status', { status: itm, id: id, reason: denialReason }).then((res) => {
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
            ApiClient.delete('removeSales', {id: id }).then(res => {
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
        getData({ ...p , page:1})
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
        const filterParams = {
            ...filters,
            page:1,
          };
        
          const queryString = new URLSearchParams(filterParams).toString();
        
          history.push(`/salesTracking/detail/${id}?${queryString}`);
        // history.push("/salesTracking/detail/"+id)
    }

    const edit=(id)=>{
        let url=`/salesTracking/edit/${id}`
        if(role) url=`/salesTracking/${role}/edit/${id}`
        history.push(url)
    }

    const add=()=>{
        let url=`/salesTracking/add`
        if(role) url=`/salesTracking/${role}/add`
        history.push(url)
    }


    const reset=()=>{
        let filter = {
            status: '',
            role: '',
            search: '',
            page: 1,
            count: 10
        }
        setFilter({ ...filters,...filter })
        getData({ ...filter })
        history.push("/salesTracking")
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
        user={user}
        statusChange={statusChange}
        getData={getData}
    />
    </>;
};

export default untrackedSales;
