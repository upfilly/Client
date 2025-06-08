'use client'

import React, { useEffect, useState } from 'react';
import ApiClient from '../../methods/api/apiClient';
import './style.scss';
import loader from '../../methods/loader';
import Html from './html';
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2'

const Users = () => {
  const user = crendentialModel.getUser()
  const { role } = useParams()
  const [filters, setFilter] = useState({ page: 0, count: 10, search: '', role: role || '', isDeleted: false, status: '', brand_id: user?.id || user?._id})
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loaging, setLoader] = useState(true)
  const history = useRouter()

  useEffect(() => {
    if (user) {
      // setFilter({ ...filters ,role})
      getData({ role, page: 1 })
    }
  }, [role])


  const getData = (p = {}) => {
    setLoader(true)
    let filter = { ...filters, ...p }
    let url = 'campaign-requests'
    ApiClient.get(url, filter).then(res => {
      if (res.success) {
        setData(res?.data?.data)
        setTotal(res?.data?.total_count)
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
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true)
        ApiClient.delete('campaign', { id: id }).then(res => {
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
    setFilter({ ...filters, page: e.selected })
    getData({ page: e.selected + 1 })
  }

  const filter = (p = {}) => {
    setFilter({ ...filters, ...p })
    // setPreviousFilter({ ...previousfilters, page: e.selected })
    getData({ ...p, page: filters?.page + 1 })
    getData({ ...p, page: filters?.page + 1 })
  }

  const ChangeRole = (e) => {
    setFilter({ ...filters, role: e, page: 1 })
    getData({ role: e, page: 1 })
  }
  const ChangeStatus = (e) => {
    setFilter({ ...filters, status: e, page: 1 })
    getData({ status: e, page: 1 })
  }

  const statusChange = (itm,affiliate_id, id) => {
    if (itm === 'accepted') {
      loader(true);
      ApiClient.put('campaign-request/change-status', { status: itm,affiliate_id:affiliate_id, id: id}).then((res) => {
        if (res.success) {

          toast.success(res.message)
          getData({ page: filters?.page + 1 });
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
        cancelButtonColor: '#d33',
        confirmButtonText: 'Deny',
      }).then((result) => {
        if (result.isConfirmed) {
          const denialReason = document.getElementById('denialReason').value;

          if (denialReason.trim() === '') {
            Swal.fire('Error', 'Please enter a reason for deny', 'error');
            return;
          }

          loader(true);
          ApiClient.put('campaign-request/change-status', { status: itm,affiliate_id:affiliate_id, id: id,reason: denialReason }).then((res) => {
            if (res.success) {
              toast.success(res.message)
              getData({ page: filters?.page + 1 });
            }
            loader(false);
          });
        }
      });
    }
  };

  const sendProposal = (brand_id) => {
    Swal.fire({
   
      html: `
           <h2 style="" class="modal-title-main">Send proposal</h2>
            <p class="text-left  mt-3 mb-2" style="font-weight:600; font-size:14px; letter-spacing:.64px;">Proposal Description :<p/>
              <textarea type="text" id="description" class="swal2-textarea p-2 w-100 m-0" placeholder="Enter here..."></textarea>
            `,  
      // icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Send',
    }).then((result) => {
      if (result.isConfirmed) {
        const descriptionData = document.getElementById('description').value;

        if (descriptionData.trim() === '') {
          Swal.fire('Error', 'Please enter a description', 'error');
          return;
        }

        loader(true);
        ApiClient.post('proposal', { "brand_id": brand_id, description: descriptionData }).then((res) => {
          if (res.success) {
            toast.success(res.message)
            getData({ page: filters?.page + 1 });
          }
          loader(false);
        });
      }
    });
  }

  const view = (id) => {
    // history.push("/requestCampaigns/detail/" + id)
  }

  const edit = (id) => {
    let url = `/campaign/edit/${id}`
    if (role) url = `/campaign/${role}/edit/${id}`
    history.push(url)
  }

  const add = () => {
    let url = `/campaign/add`
    if (role) url = `/campaign/${role}/add`
    history.push(url)
  }


  const reset = () => {
    let filter = {
      status: '',
      role: '',
      search: '',
      page: 1,
      count: 5
    }
    setFilter({ ...filters, ...filter })
    getData({ ...filter })
    history.push("/requestCampaigns")
    // dispatch(search_success(''))
  }

  const isAllow = (key = '') => {

    return true
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
    let page = filters?.page;
    filter({ sortBy, key, sorder, page })
  }

  console.log(data,"datadatadata")

  return <><Html
    setFilter={setFilter}
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
    statusChange={statusChange}
    sorting={sorting}
    sendProposal={sendProposal}
    getData={getData}
  />
  </>;
};

export default Users;
