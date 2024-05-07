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
            ApiClient.get(`user/detail?id=${id}`).then(res => {
                if (res.success) {
                    setData(res.data)
                }
                loader(false)
            })
    };

    console.log(data, "=========")

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
            cancelButtonColor: '#d33',
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
                                        <div className='col-6'>
                                           <div className='mb-3'>
                                           <div className='userdata'>
                                                <p className='headmain'>Name:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && data?.fullName}</p>
                                            </div>
                                           </div>
                                        </div>
                                        <div className='col-6'>
                                       <div className='mb-3'>
                                       <div className='userdata'>
                                                <p className='headmain'>Email:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && data?.email}</p>
                                            </div>
                                       </div>
                                        </div>
                                  
                                        {(data?.mobileNo) && <div className='col-6'>
                                            <div className='mb-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>Mobile Number:</p>
                                                </div>
                                                <div className='name-dtls'>
                                                    <p className='headsub'>{data?.dialCode}{data && data?.mobileNo}</p>
                                                </div>
                                            </div>
                                        </div>}
                                        {/* <div className='col-6'>
                                     <div className='mb-3'>
                                     <div className='userdata'>
                                                <p className='headmain'>Address:</p>
                                            </div>
                                        
                                      
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && data?.address}</p>
                                            </div>
                                     </div>
                                        </div> */}
                                        <div className='col-6'>
                                        <div className='mb-3'>
                                        <div className='userdata'>
                                                <p className='headmain'>Creation Date:</p>
                                            </div>
                                      
                                        
                                            <div className='name-dtls'>
                                                <p className='headsub'>{datepipeModel.date(data?.createdAt)}</p>
                                            </div>
                                        </div>
                                        </div>

                                        <div className='col-6'>
                                      <div className='mb-3'>
                                      <div className='userdata  d-flex gap-3'>
                                                <p className='headmain'>Status:</p>
                                                 <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.status)}</p>
                                            </div> 
                                            </div>

                                      

                                        {data?.social_media_platforms?.length > 0 && 
                                            <div className='inputFlexs width400'>
                                                <label >Social Media</label>
                                                <div className='d-flex wraps'>
                                                    {data?.social_media_platforms?.map((item, index, array) =>
                                                        <p className="profile_data">{item} {index !== array.length - 1 && <span>,</span>}</p>
                                                    )
                                                    }
                                                </div>
                                            </div>
                                       }

                                        {data?.tags?.length > 0 && 
                                            <div className='inputFlexs width400'>
                                                <div className='d-flex wraps'>
                                                <label className='mr-2'>Tags:</label>
                                                
                                                    {data?.tags?.map((item, index, array) =>
                                                        <div key={item} className="profile_data_wrapper">
                                                            <p className="profile_data">{item} {index !== array.length - 1 && <span>,</span>}</p></div>
                                                    )

                                                    }
                                                </div>
                                            </div>
                                        }
                                      </div>
                                        </div>
                                       
                                    </div>
                                   

                               

                                  
                                      
                                            
                                   

                                    <div className='row'>
                                       
                                           

                                        <div className='col-9'>
                                           
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
