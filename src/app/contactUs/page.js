'use client'

import { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../components/global/layout';

export default function ContactUs() {

  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
        <div className='pricing-padding contactus'>
          <div className='container '>
            <div className="row align-items-center ">
              <div className='main-title text-center'>
                <h1 className=''>Contact Us</h1>
                <p className=' printit'>Lorem Ipsum is simply dummy text of the printing and typesetting  <br /> industry. Lorem Ipsum has been the industry's standard </p>

              </div>

            </div>

            <div className='row cpadd pt-0'>
              <div className='col-md-12'>
                <div className='need_contactus'>
                  <div className='row'>
                    <h3 className="main-head mb-4">Need Assistance?</h3>

                    <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
                      <div className='card_box text-center'>
                        <div className='imgtag_card'>
                          <img src="/assets/img/c1.png" className='img-fluid heighteual mb-0' />
                          <h6>Visit our Forum</h6>
                          <p>Go to our community forum to ask questions and take advantage of the incredible experience of the worldwide television industry, 24 hours a day!</p>
                          <button className='btn btn-primary'>Visit the Forum</button>
                        </div>
                      </div>
                    </div>

                    <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
                      <div className='card_box text-center '>
                        <div className='imgtag_card'>
                          <img src="/assets/img/c2.png" className='img-fluid heighteual mb-0' />
                          <h6>Visit our Forum</h6>
                          <p>Go to our community forum to ask questions and take advantage of the incredible experience of the worldwide television industry, 24 hours a day!</p>
                          <button className='btn btn-primary'>Visit the Forum</button>
                        </div>
                      </div>
                    </div>

                    <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
                      <div className='card_box text-center'>
                        <div className='imgtag_card'>
                          <img src="/assets/img/c3.png" className='img-fluid heighteual mb-0' />
                          <h6>Visit our Forum</h6>
                          <p>Go to our community forum to ask questions and take advantage of the incredible experience of the worldwide television industry, 24 hours a day!</p>
                          <button className='btn btn-primary'>Visit the Forum</button>
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
    </>
  );
}
