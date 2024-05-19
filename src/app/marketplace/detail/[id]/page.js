'use client'

import crendentialModel from "@/models/credential.model";
import Layout from "../../../components/global/layout";
import "../../style.scss";
import { useParams, useRouter } from "next/navigation";
import ApiClient from "@/methods/api/apiClient";
import OfferFormModal from "../../MakeofferModal";
import loader from "@/methods/loader";
import { useEffect, useState } from "react";
import methodModel from "@/methods/methods";
import datepipeModel from "@/models/datepipemodel";

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
        getDetail(id)
    }, [id])

    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
            <div className="p-80">
            <div className="container">
                <div className="col-sm-12 col-md-8 mx-auto ">
                    <div className="showngmkt lists_mkt">

                        <div className="grid_lists_mkt ">
                            <div className="subparttop d-flex align-items-center justify-content-between">
                                <div className="leftshead">
                                    <h6>{methodModel.capitalizeFirstLetter(data?.name)}</h6>
                                    <p className="types_date">Type:<span className="types_main"> {data?.opportunity_type?.map((itm) => itm).join(',\n') || ''}</span> - Added: {datepipeModel.date(data?.createdAt)}</p>
                                </div>


                            </div>

                            <div className="showin_mkt mt-4 mb-4">
                                <h5>Placements: {data?.placement?.map((itm) => itm).join(',\n') || ''}</h5>

                                <div>
                                    <p className="descmkt" dangerouslySetInnerHTML={{ __html:data?.description }}></p>
                                </div>

                            </div>


                            <div className="d-flex align-items-center justify-content-between bordertop gap-3">
                                <div className="leftshead">
                                    {/* <h6>${data?.price}</h6> */}
                                    <p className="types_date"><span className="types_main">Start: {datepipeModel.date(data?.start_date)} End: {datepipeModel.date(data?.end_date)}</span></p>
                                </div>

                                {user?.role == 'brand' && <div className="rightimg">
                                    <div className="btn_offers d-flex justify-content-end">
                                        {data?.isSubmitted ?
                                            <button className="btn-cancel" disabled>Offer Sent</button>
                                            :
                                            <button className="btn-cancel" onClick={() => {
                                                setModalIsOpen(true)
                                                setid(data?._id)
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
