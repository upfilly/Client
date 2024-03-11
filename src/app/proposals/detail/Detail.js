import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss';
import methodModel from '@/methods/methods';
import rolesModel from '@/models/role.model';
import { useRouter,useParams } from 'next/navigation';
import crendentialModel from '@/models/credential.model';

const Detail = (p) => {
    const history = useRouter()
    const user = crendentialModel.getUser()
    const { id } = useParams()
    const [data, setData] = useState()
    const getDetail = (did) => {
        loader(true)
        ApiClient.get(`proposal`, { id: did }).then(res => {
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
        <div className="back-arrow-btn">
                <div>
                    <a to="/campaign" onClick={back}>  <i className="fa fa-arrow-left mr-4 mb-3 " title='Back' aria-hidden="true"></i></a>
                </div>
            </div>
            <div className="">
                <div className=" pprofile1">
                    <h3 className=" ViewUser ">
                    Proposal Detail
                    </h3>

                    <div className="form-row">
                        <div className="col-md-6 mb-3">
                            <label className="profileheddingcls">Affiliate Name</label>
                            <div className='profiledetailscls'>{data && methodModel.capitalizeFirstLetter(data?.addedBy_name)}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="profileheddingcls">Description</label>
                            <div className='profiledetailscls' dangerouslySetInnerHTML={{ __html: data?.description }}/>
                        </div>
                       {user?.role == "affiliate" && <div className="col-md-6 mb-3">
                            <label className="profileheddingcls">Reason</label>
                            <div className='profiledetailscls' >{data?.reason}</div>
                        </div>}
                    </div>
                </div>
            </div>
        </Layout >

    );
};

export default Detail;
