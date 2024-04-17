import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss';
import methodModel from '@/methods/methods';
import { useRouter, useParams } from 'next/navigation';
import crendentialModel from '@/models/credential.model';

const Detail = (p) => {
    const history = useRouter()
    const user = crendentialModel.getUser()
    const { id } = useParams()
    const [data, setData] = useState()
    const getDetail = (did) => {
        loader(true)
        ApiClient.get(`transaction`, { id: did }).then(res => {
            if (res.success) {
                setData(res.data)
            }
            loader(false)
        })
    };

    const back = () => {
        history.back()
    }

    useEffect(() => {
        getDetail(id)
    }, [id])

    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Affiliate"} filters={undefined}>
            <div className='sidebar-left-content'>
                <div className='card'>
                    <div className='card-header'>
                        <div className='main_title_head'>
                            <h3>
                                <a to="/campaign" onClick={back}>  <i className="fa fa-arrow-left mr-2 " title='Back' aria-hidden="true"></i></a>
                                Transaction Detail
                            </h3>
                        </div>
                    </div>
                    <div className='card-body'>

                        <div className="">
                            <div className='row'>
                                <div className='main-view-pages '>
<div className='row'>
                                    {data?.user_id?.fullName && 
                                        <div className='col-6 col-md-6 col-lg-4'>
                                            <div className='mb-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>User:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0'>{data && data?.user_id?.fullName}  </p>
                                            </div>
                                            </div>
                                           
                                        </div>
                                    
                                   }

                                    {data?.user_id?.role && 
                                        <div className='col-6 col-md-6 col-lg-4'>
                                            <div className='mb-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Role:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0'>{data && data?.user_id?.role} </p>
                                            </div>
                                            </div>
                                           
                                        </div>
                                       
                                   }

                                    {data && data?.user_id?.email &&  
                                        <div className='col-6 col-md-6 col-lg-4'>
                                            <div className='mb-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Email:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0'>{data && data?.user_id?.email} </p>
                                            </div>
                                            </div>
                                           
                                        </div>
                                   }


                                    {data && data?.amount && 
                                        <div className='col-6 col-md-6 col-lg-4'>
                                            <div className='mb-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Price:</p>
                                            </div>
                                       
                                      
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0'>{data && data?.amount} </p>
                                            </div>
                                            </div>
                                           
                                            </div>
                                    }



                                    {data && data?.transaction_type && 
                                        <div className='col-6 col-md-6 col-lg-4'>
                                            <div className='mb-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Transaction Type:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0'>{data && data?.transaction_type} </p>
                                            </div>
                                            </div>
                                            
                                      
                                        </div>
                                     
                                            
                                }


                                    {data && data?.transaction_status && 
                                       
                                           
                                      
                                        <div className='col-6 col-md-6 col-lg-4'>
                                            <div className='mb-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Transaction Status:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0'> {data && data?.transaction_status} </p>
                                            </div>
                                            </div>
                                            
                                        </div>
                                }

                                    {data?.transaction_id && 
                                        
                                          
                                        
                                        <div className='col-6 col-md-6 col-lg-4'>
                                            <div className='mb-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Transaction ID:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0'> {data && data?.transaction_id} </p>
                                            </div>
                                            </div>
                                             
                                        </div>
                                    }


                                    {data?.currency && 
                                        
                                           
                                        
                                        <div className='col-6 col-md-6 col-lg-4'>
                                            <div className='mb-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Currency:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0'> {data && data?.currency} </p>
                                            </div>
                                            </div>
                                            
                                        </div>
                                    }

                                    {data?.subscription_plan_id && 
                                       
                                          
                                       
                                        <div className='col-6 col-md-6 col-lg-4'>
                                            <div className='mb-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Subscription Plan:</p>
                                            </div>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0'> {data && data?.subscription_plan_id?.name} </p>
                                            </div>
                                            </div>
                                             
                                        </div>
                                    }
</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>





        </Layout >

    );
};



export default Detail;
