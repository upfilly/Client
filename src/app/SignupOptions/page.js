'use client'

import { useRouter } from "next/navigation";
import Layout from "../components/global/layout";

export default function SignupOption() {
  const history = useRouter()

  return (
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
      <div className='card_parent'>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-7 mx-auto">
              <div className="sgnup data">
                <h4 className="text-white mb-3 ">Signup As</h4>
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6" onClick={() => history.push("/track/signup/affiliate")}>
                    <div className="miansign">
                      <label className="center_img">
                        <img src="./assets/img/affi.png" className="banesr_sizes" />
                        <p className="m-0 aff_liate  ">Affiliate</p>
                      </label>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6"
                    onClick={() => history.push("/bookingForm")}
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
    </Layout>
  );
}
