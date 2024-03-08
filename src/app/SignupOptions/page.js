'use client'

import { useRouter } from "next/navigation";
import Layout from "../components/global/layout";

export default function SignupOption() {
  const history = useRouter()

  return (
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
      <div className='container-fluid p-80'>
          <div className="container">
              <div className="row">
                <div className="col-12 col-md-8 mx-auto">
                    <div className="card">
                      <div className="card-header">
                        <h4 className="m-0">Signup As</h4>
                      </div>

                      <div className="card-body">
                        <div className="row">
                            <div className="col-12 col-md-6" onClick={()=>history.push("/signup/affiliate")}>
                                <div className="miansign">
                                  <label className="center_img">
                                      <img src="./assets/img/affi.jpg" className="banesr_sizes" />
                                      <p className="m-0">Affiliate</p>
                                  </label>
                                </div>
                            </div>
                            <div className="col-12 col-md-6"  onClick={()=>history.push("/bookingForm")}>
                              <div className="miansign">
                                  <label className="center_img">
                                      <img src="./assets/img/brnd.jpg" className="banesr_sizes" />
                                      <p className="m-0">Brand</p>
                                  </label>
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
  );
}
