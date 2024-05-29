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
        ApiClient.get(`tracking`, { affiliate_id: did }).then(res => {
            if (res.success) {
                setData(res?.data?.data)
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

            <div className="sidebar-left-content">
                <div className=" pprofile1 card card-shadow p-4">

                    <div className='main_title_head profile-card'>

                        <h3 className="  ">
                            {/* <a to="/campaign" onClick={back}>  <i className="fa fa-arrow-left mr-2 " title='Back' aria-hidden="true"></i></a>  */}
                            <span> Affiliate Tracking status</span>
                        </h3>
                        <hr></hr>

                    </div>

                    <div className='row'>




                        {data?.length <= 0 ?
                            <div className='NoProgressHeading'>
                                <h3>No Progress</h3>
                            </div>
                            : <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12 '>
                              <div className='table_section mt-3'>
                              <div className='table-responsive '>
                                    <table className='table table-striped'>
                                        <thead>
                                            <tr>
                                                <th>Campaign</th>
                                                <th>Event Type</th>
                                                <th>No of Member Click On Link</th>
                                            </tr>
                                        </thead>
                                        {data?.map((item) => {
                                            return <tbody>
                                                <tr>
                                                    <td>{item && item?.campign_name}</td>
                                                    <td>{item && methodModel.capitalizeFirstLetter(item?.event_type)}</td>
                                                    <td>{item && item?.clicks}</td>
                                                </tr>
                                            </tbody>
                                        })}
                                    </table>
                                </div>
                              </div>
                            </div>}
                    </div>
                </div>
            </div>
        </Layout >

    );
};

export default Detail;
