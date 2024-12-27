import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import datepipeModel from '@/models/datepipemodel';
import loader from '@/methods/loader';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Layout from '@/app/components/global/layout';
import './style.scss';

const Detail = (p) => {
    const history = useRouter()
    const { id } = useParams();
    const [data, setData] = useState()

    const getDetail = (did) => {
        loader(true)
        if (did)
            ApiClient.get(`affiliate-group`, { id: did }).then(res => {
                if (res.success) {
                    setData(res.data)
                }
                loader(false)
            })
    };

    // console.log(data, "=========")

    const back = () => {
        history.back()
    }

    const edit = (id) => {
        let url = `/group/edit/${id}`
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
                ApiClient.delete(`delete?model=affiliatemanagement&id=${id}`).then(res => {
                    if (res.success) {
                        toast.success(res.message)
                        // clear()
                        history.push(`/group`)
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
                        <div className="d-flex justify-content-between align-items-center  gap-3 flex-wrap ">

                            <div className='main_title_head'>
                                <div className='d-flex gap-2 align-items-center '>
                                    <button onClick={back} type='button' className='btn btn-primary px-2 py-0 ' ><i className="fa fa-arrow-left " title='Back' aria-hidden="true"></i></button>
                                    <h3 className=" ">
                                        {/* <a to="/categories"  className="back_icon">  </a> */}
                                        Group Details
                                    </h3>

                                </div>

                            </div>
                            <div>
                                <>
                                    <button className='btn btn-primary mr-2 ' title="Edit" onClick={e => edit(data.id)}>
                                        <i className="material-icons edit text-white mr-2" title="Edit">edit</i>
                                        Edit
                                    </button>
                                </>
                                {/* // : <></>} */}

                                {/* {isAllow('deleteAdmins') ?  */}
                                <>
                                    <button className='btn btn-danger br50' onClick={() => deleteItem(data.id)}>
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
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-4 mb-4'>
                                            
                                            <div className='userdata'>
                                                <p className='headmain'>Group Name:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && data?.group_name}</p>
                                            </div>
                                        </div>
                                      
                                  
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='userdata'>
                                                <p className='headmain'>Creation Date:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{datepipeModel.date(data?.createdAt)}</p>
                                            </div>
                                        </div>
                                       
                                    
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='userdata'>
                                                <p className='headmain'>Status:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && data?.status}</p>
                                            </div>
                                        </div>
                                     
                                  
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='userdata'>
                                                <p className='headmain'>Commision:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub' dangerouslySetInnerHTML={{ __html: data && data?.commision }} />
                                            </div>
                                        </div>
                                      
                                    
                                        <div className='col-12 col-sm-12 col-md-12 col-lg-12 mb-4'>
                                            <div className='userdata'>
                                                <p className='headmain'>Added Affiliates:</p>
                                            </div>
                                            <div className='name-dtls d-flex flex-wrap'>
                                                <ul className='ulclass flex-wrap'>

                                                    {data && data?.addedAffiliates && data.addedAffiliates.map((item) => {
                                                        return <li className="mr-2 progs_data mb-2">{item}</li>
                                                    })}


                                                </ul>

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
