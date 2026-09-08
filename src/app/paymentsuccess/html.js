'use client'

import React from 'react'
import './style.scss';
import Layout from '../components/global/layout';
import { useRouter } from 'next/navigation';
import crendentialModel from '@/models/credential.model';

const Html = () => {
  const router = useRouter()

  const handleDashboardRedirect = () => {
    const user = crendentialModel.getUser();
    if (user?.role === 'white_label' || user?.role === 'white_lable') {
      router.push('/white-label-onboarding');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div>
       <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
      <div className="container-fluid my-3 px-5">
        <div className="row ">
          <div className="col-12 text-center">
            <div className="payment_section">
              <img src="/assets/img/payment_successful_img.png" className="payment_img" alt="..." />
              <div className="card-body  payment_body">
                <h5 className="card-title">Payment Successful!</h5>
                <p className="card-text">Thanks for your Purchase..</p>
                <button className="btn btn-primary done_btn" onClick={handleDashboardRedirect}>Go To Your Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Layout>
    </div>
  )
}

export default Html
