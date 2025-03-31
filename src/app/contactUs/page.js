'use client'

import { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../components/global/layout';

export default function ContactUs() {

  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>



        {/* Overview Section */}
        <section className=" bgdots">

          <div className="minus_margin container">

            <h5 className="innerhtmls">Contact Us</h5>


            <p className="para3">
              Lorem Ipsum is simply dummy text of the printing and typesetting  <br /> industry. Lorem Ipsum has been the industry's standard            </p>
          </div>
        </section>



        <div className='cuspadding contactus'>
          <div className='container '>
            <div className='row'>
              <h3 className="mainhead mb-4">Need Assistance?</h3>

              <div className='col-12 col-sm-6 col-lg-4 '>
                <div className='card_box text-center'>
                  <div className='imgtag_card'>
                    <img src="/assets/img/c2.png" className='img-fluid heighteual' />
                    <h6>Visit our Forum</h6>
                    <p>Go to our community forum to ask questions and take advantage of the incredible experience of the worldwide television industry, 24 hours a day!</p>
                    <button className='btn btn-blue'>Visit the Forum</button>
                  </div>  
                </div>
              </div>

              <div className='col-12 col-sm-6 col-lg-4 '>
                <div className='card_box text-center '>
                  <div className='imgtag_card'>
                    <img src="/assets/img/c1.png" className='img-fluid heighteual' />
                    <h6>Email Us </h6>
                    <p>When you need to ask us a specific question, simply contact us via email and one of our support engineers will get back to you with an answer.</p>
                    <button className='btn btn-blue'>Send us an Email</button>
                  </div>
                </div>
              </div>

              <div className='col-12 col-sm-6 col-lg-4 '>
                <div className='card_box text-center'>
                  <div className='imgtag_card'>
                    <img src="/assets/img/c3.png" className='img-fluid heighteual' />
                    <h6>Telephone Us</h6>
                    <p>When you need urgent help, call the Blackmagic Design support office closest to you. If you need out of hours help, call one of our worldwide support offices.</p>
                    <button className='btn btn-blue'>Contact Us</button>
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
