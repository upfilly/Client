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
    const [filters, setFilter] = useState({ page: 0, count: 10, search: '', role: role || '', isDeleted: false, status: '', addedBy: user?.id })
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const history = useRouter()
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const currentDate = startDate ? new Date(startDate) : null;
    const formattedStartDate = startDate ? `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}` : null

    const currentEndDate = endDate ? new Date(endDate) : null;
    const formattedEndDate = endDate ? `${currentEndDate.getFullYear()}-${(currentEndDate.getMonth() + 1).toString().padStart(2, '0')}-${currentEndDate.getDate().toString().padStart(2, '0')}` : null

    useEffect(() => {
        if (user) {
            getData({ role, page: 1 })
        }
    }, [role])

    useEffect(() => {
        if (startDate && endDate) {
            setFilter({ ...filters, page: 1, start_date: formattedStartDate, end_date: formattedEndDate })
            getData({ ...filters, page: 1, start_date: formattedStartDate, end_date: formattedEndDate })
        }
    }, [startDate, endDate])


    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        let url = 'product/all'
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
                ApiClient.delete('delete', { id: id, model: 'product' }).then(res => {
                    if (res.success) {
                        toast.success("Offer deleted successfully")
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
        getData({ ...p, page: filters?.page + 1 })
    }



    const ChangeRole = (e) => {
        setFilter({ ...filters, role: e, page: 1 })
        getData({ role: e, page: 1 })
    }
    const ChangeStatus = (e) => {
        setFilter({ ...filters, status: e, page: 1 })
        getData({ ...filters, status: e, page: 1 })
    }

    const statusChange = (itm) => {
        let modal = 'users'
        let status = 'active'
        if (itm.status == 'active') status = 'deactive'

        Swal.fire({
            title: ``,
            text: `Do you want to ${status == 'active' ? 'Active' : 'inactivate'} this Offer ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                loader(true)
                ApiClient.put(`change/status`, { status, id: itm.id, model: 'product' }).then(res => {
                    if (res.success) {
                        getData({ page: 1 })
                    }
                    loader(false)
                })
            }
        })
    }

    const view = (id) => {
        history.push("/Offers/detail/" + id)
    }

    const edit = (id) => {
        let url = `/Offers/edit/${id}`
        if (role) url = `/product/${role}/edit/${id}`
        history.push(url)
    }

    const add = () => {
        let url = `/Offers/add`
        if (role) url = `/Offers/${role}/add`
        history.push(url)
    }


    const reset = () => {
        let filter = {
            addedBy: user?.id,
            status: '',
            role: '',
            search: '',
            page: 1,
            count: 5,
            start_date: '',
            end_date: ''
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
        statusChange={statusChange}
        dateRange={dateRange}
        setDateRange={setDateRange}
        startDate={startDate}
        endDate={endDate}
        user={user}
    />
    </>;
};

export default Users;
