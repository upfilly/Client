import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss';
import methodModel from '@/methods/methods';
import rolesModel from '@/models/role.model';
import { useRouter,useParams } from 'next/navigation';
import crendentialModel from '@/models/credential.model';
import datepipeModel from '@/models/datepipemodel';

const Detail = (p) => {
    const history = useRouter()
    const user = crendentialModel.getUser()
    const { id } = useParams()
    const [data, setData] = useState()
    const getDetail = (did) => {
        loader(true)
        ApiClient.get(`common-category`, { id: did }).then(res => {
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
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
        <div className="text-right">
                <div>
                    <a to="/campaign" onClick={back}>  <i className="fa fa-arrow-left mr-4 mb-3 " title='Back' aria-hidden="true"></i></a>
                </div>
            </div>
            <div className="row">
                <div className="sideclass col-md-12">
                    <h3 className="Profilehedding mt-3 ">
                    Detail
                    </h3>

                    <div className="form-row">
                        <div className="col-md-6 mb-3">
                            <label className="profileheddingcls">Name</label>
                            <div className='profiledetailscls'>{data && data?.name}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="profileheddingcls">Date</label>
                            <div className='profiledetailscls'>{datepipeModel.date(data?.createdAt)}</div>
                        </div>
                        
                        {/* <div className="col-md-6 mb-3">
                            <label className="profileheddingcls">Image</label>
                            <div>
                                <div className="imagethumbWrapper">
                                    <img src={methodModel.noImg(data && data?.image, 'users')} className="thumbnail" />
                                </div>
                            </div>
                        </div> */}

                       
                        {/* <div className="col-md-12 mb-3">
                            <label className="profileheddingcls">About Us</label>
                            <div className='profiledetailscls'>{data && data.aboutUs}</div>
                        </div> */}
                    </div>
                </div>
            </div>
        </Layout >

    );
};

export default Detail;
