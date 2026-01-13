'use client'

import { useRouter } from "next/navigation";
import ApiClient from "@/methods/api/apiClient";
import { useEffect, useState } from "react";
import PageContainer from "../components/main/PageContainer";
import Link from "next/link";

export default function SignupOption() {
  const [settingData, setSettingData] = useState([])
  const history = useRouter()

  useEffect(() => {
    ApiClient.get('settings').then(res => {
      if (res.success) {
        setSettingData(res?.data)
      }
    })
  }, [])

  return (
    <PageContainer title='Login Page' description='Login Page' settingData={settingData}>
      <div className='card_parent'>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-7 mx-auto">
              <div className="sgnup data">

                <div className="row">

                  <div className="col-12">

                    <div className="d-flex mb-3 align-items-center">
                      <Link href="/"><i className="fa fa-angle-double-left aroows" aria-hidden="true"></i></Link>
                      <h4 className="text-white ml-2 mb-0 ">Signup As</h4>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6" onClick={() => history.push("/track/signup/affiliate")}>
                    <div className="miansign">
                      <label className="center_img">
                        <img src="./assets/img/affi.png" className="banesr_sizes" />
                        <p className="m-0 aff_liate  ">Affiliate</p>
                      </label>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6"
                    onClick={() => history.push("/bookingform")}
                  // onClick={()=>history.push("/track/signup/brand")}
                  >
                    <div className="miansign">
                      <label className="center_img">
                        <img src="./assets/img/brnd.png" className="banesr_sizes" />
                        <p className="m-0 aff_liate">Brand</p>
                      </label>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  );
}
