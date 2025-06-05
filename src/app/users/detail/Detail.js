import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import datepipeModel from '@/models/datepipemodel';
import loader from '@/methods/loader';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Layout from '@/app/components/global/layout';
import './style.scss';
import methodModel from '@/methods/methods';

const Detail = (p) => {
    const history = useRouter()
    const { id } = useParams();
    const [data, setData] = useState()

    const getDetail = (did) => {
        loader(true)
        if (did)
            ApiClient.get(`getinviteuser?user_id=${id}`).then(res => {
                if (res.success) {
                    setData(res.data)
                }
                loader(false)
            })
    };

    const back = () => {
        history.back()
    }

    const edit = (id) => {
        let url = `/users/edit/${id}`
        // if(role) url=`/users/${role}/edit/${id}`
        history.push(url)
    }

    // const clear = () => {
    //     setFilter({ ...filters, search: '', page: 1 })
    //     getData({ search: '', page: 1 })
    // }

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
                        // clear()
                        history.push(`/users`)
                    }
                    loader(false)
                })
            }
        })
    }

    useEffect(() => {
        if (id) {
            getDetail(id)
        }
    }, [id])

    return (<>
        <Layout>
            <div className='view_page sidebar-left-content '>
                <div className=' card '>
                    <div className="card-header">
                        <div className="d-flex justify-content-between align-items-center ">

                            <div className=''>
                                <div className='main_title_head '>
                                    <h3 className=" ">
                                        <a to="/categories" onClick={back} className="back_icon">  <i className="fa fa-arrow-left mr-2" title='Back' aria-hidden="true"></i></a>
                                        Member Details
                                    </h3>

                                </div>

                            </div>
                            <div>
                                <>
                                    <button className='btn btn-primary mr-2 ' title="Edit" onClick={e => edit(data.user_id)}>
                                        <i className="material-icons edit text-white mr-2" title="Edit">edit</i>
                                        Edit
                                    </button>
                                </>
                                {/* // : <></>} */}

                                {/* {isAllow('deleteAdmins') ?  */}
                                <>
                                    <button className='btn btn-danger' onClick={() => deleteItem(data.id)}>
                                        <i className="material-icons delete text-white mr-2" title='Delete'> delete</i>
                                        Delete
                                    </button>
                                </>
                            </div>
                        </div>



                    </div>

                    <div className='card-body'>
                        <div className='main-view-pages '>
                            <div className="row">
                                <div className=" col-md-12">

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                                           <div className='mb-3'>
                                           <div className='userdata'>
                                                <p className='headmain'>Name:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && data?.firstName} {data && data?.lastName}</p>
                                            </div>
                                           </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                                       <div className='mb-3'>
                                       <div className='userdata'>
                                                <p className='headmain'>Email:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && data?.email}</p>
                                            </div>
                                       </div>
                                        </div>
                                  
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                                            <div className='mb-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>Role:</p>
                                                </div>
                                                <div className='name-dtls'>
                                                    <p className='headsub'>{data && data?.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                                        <div className='mb-3'>
                                        <div className='userdata'>
                                                <p className='headmain'>Creation Date:</p>
                                            </div>
                                      
                                        
                                            <div className='name-dtls'>
                                                <p className='headsub'>{datepipeModel.date(data?.createdAt)}</p>
                                            </div>
                                        </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>Description:</p>
                                                </div>
                                            </div>
                                            <div className='col-12'>
                                                <div className='name-dtls'>
                                                    <p className='headsub mb-0' style={{ margin: '0px' }} dangerouslySetInnerHTML={{ __html: data?.description }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    </>
    );
};

export default Detail;
