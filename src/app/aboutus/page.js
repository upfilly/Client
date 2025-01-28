'use client'

import { useEffect, useState } from 'react';
import crendentialModel from '@/models/credential.model';
import "./style.scss";
import { useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import methodModel from '@/methods/methods';
import Layout from '../components/global/layout';

export default function AboutUs() {
  const router = useRouter();
  const user = crendentialModel.getUser();
  const [data, setData] = useState();
  const [FAQdata, setFAQData] = useState([]);

  const getContentData = (p = {}) => {
    let url = 'content';
    ApiClient.get(url, { title: "About us" }).then(res => {
      if (res) {
        setData(res?.data);
        getData(res?.data?.id);
      }
    });
  };

  const getData = (id) => {
    let url = 'faq/all';
    ApiClient.get(url, { content_id: id }).then(res => {
      if (res.success) {
        const data = res?.data?.data;
        setFAQData(data);
      }
    });
  };

  useEffect(() => {
    getContentData();
  }, []);

  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
        <section id="about-section" className="pt-1 pb-2">
          <div className="container p-0">

            <div className="row align-items-center mt-5 mb-5">
              <div className="col-md-12">
                <h3 className="text-center rise">{data && data?.meta_title}</h3>
              </div>
            </div>

            <div className='row'>
              <div className='col-12 col-md-6'>
                {data?.image && <img src={methodModel.userImg(data && data?.image)} alt="Signature" className="img-fluid" />}
              </div>
              <div className="col-12 col-md-6 text-left mx-auto">
                <p dangerouslySetInnerHTML={{ __html: data && data?.description?.slice(0, 999) }}></p>
              </div>
            </div>

            <div className="row mx-auto d-flex align-items-center text-center">
              <div className="col-md-12 p-0 mx-auto">
                <p dangerouslySetInnerHTML={{ __html: data && data?.description?.slice(999) }}></p>
              </div>
            </div>

          </div>
        </section>

        <section className="common-padding pt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h2 className="customers">Frequent Asked Questions</h2>
              </div>
              <div className="accordion" id="accordionExample">
                <div className="row">
                  {FAQdata ? <>
                    {FAQdata?.map((itm, index) => {
                      if (index <= 2) {
                        return (
                          <div key={itm?._id} className="col-md-6">
                            <div className="accordion-item mb-3">
                              <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseTwo-${index}`} aria-expanded="false" aria-controls={`collapseTwo-${index}`}>
                                  {itm?.question}
                                </button>
                              </h2>
                              <div id={`collapseTwo-${index}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                  <p dangerouslySetInnerHTML={{ __html: itm?.answer }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </>
                    : <><p>No Question for now</p></>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
