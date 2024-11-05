'use client'

import crendentialModel from "@/models/credential.model";
import Layout from "../../../components/global/layout";
import "../../style.scss";
import { useParams, useRouter } from "next/navigation";
import ApiClient from "@/methods/api/apiClient";
import OfferFormModal from "../../MakeofferModal";
import loader from "@/methods/loader";
import { useEffect, useState } from "react";
import datepipeModel from "@/models/datepipemodel";
import methodModel from "../../../../methods/methods";

export default function MarketPlaceDetail() {
    const history = useRouter()
    const user = crendentialModel.getUser()
    const { id } = useParams()
    const [data, setData] = useState()
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [affiliateName, setAffiliateName] = useState('')

    const getDetail = (did) => {
        loader(true)
        ApiClient.get(`product`, { id: did }).then(res => {
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
        if (id) {
            getDetail(id)
        }
    }, [id])

    const permission=(p)=>{
        if (user && user?.permission_detail && p) {
            return user?.permission_detail[p]
        }else{
            return false
        }
    }

    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
            <div className="p-80">
            <div className="container">
                <div className="col-sm-12 col-md-8 mx-auto ">
                    <div className="d-flex gap-2 align-items-center mb-3" onClick={()=>back()}>
                    <i className="fa fa-arrow-left  left_arrows  mr-0" aria-hidden="true"></i>
                        <span className="offer_detail">Offer Details</span>
                    </div>
                
                    <div className="showngmkt lists_mkt">

                        <div className="grid_lists_mkt ">
                            <div className="subparttop d-flex align-items-center justify-content-between">
                                <div className="leftshead">
                                    <h6>{methodModel.capitalizeFirstLetter(data?.name)}</h6>
                                    
                                    {/* <p className="types_date">Type:<span className="types_main"> {data?.opportunity_type?.map((itm) => itm).join(',\n') || ''}</span> - Added: {datepipeModel.date(data?.createdAt)}</p> */}

                                   <div className="d-flex align-items-start set_gapbx flex-column">
                                <p className="types_dates" >Type:</p>
                                <p className="mb-0 date_types" > <span className="types_main"> {data?.opportunity_type?.map((itm) => itm).join(',\n') || ''}</span> - Added: {datepipeModel.date(data?.createdAt)}</p>
                              </div>
                                </div>


                            </div>

                            <div className="showin_mkt mt-4 mb-4">
                                <h5>Placements: {data?.placement?.map((itm) => itm).join(',\n') || ''}</h5>

                                <div>
                                    <p className="descmkt" dangerouslySetInnerHTML={{ __html:data?.description }}></p>
                                </div>

                            </div>


                            <div className="d-flex align-items-center justify-content-between bordertop gap-3">
                                <div className="leftshead d-flex gap-2 align-items-center">
                                    {/* <h6>${data?.price}</h6> */}
                                    {/* <p className="types_date"><span className="types_main">Start: {datepipeModel.date(data?.start_date)} End: {datepipeModel.date(data?.end_date)}</span></p> */}

                                    <div className="d-flex align-items-start set_gapbx gap-2">
                                <p className="types_dates" >Start:</p>
                                <p className="mb-0 date_types" > {datepipeModel.date(data?.start_date)} </p>
                              </div>

                              <div className="d-flex align-items-start set_gapbx gap-2">
                                <p className="types_dates" >End:</p>
                                <p className="mb-0 date_types" > {datepipeModel.date(data?.end_date)} </p>
                              </div>
                             
                                </div>

                                {(user?.role == 'brand' || permission("make_offer_add")) && <div className="rightimg">
                                    <div className="btn_offers d-flex justify-content-end">
                                        {data?.isSubmitted ?
                                            <button className="btn-cancel" disabled>Offer Sent</button>
                                            :
                                            <button className="btn-cancel" onClick={() => {
                                                setModalIsOpen(true)
                                                // setid(data?._id)
                                                setAffiliateName(data?.addedBy_name)
                                            }}> Make Offer</button>}
                                    </div>
                                </div>}
                            </div>

                        </div>
                    </div>
                </div>
    <OfferFormModal getProductData={getDetail} modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} id={id} affiliateName={affiliateName} />
            </div>
            </div>
        </Layout>
    );
}
