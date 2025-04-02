'use client'

import React, { useEffect } from 'react'
import './style.scss';
import Layout from '../components/global/layout';
import { useRouter, useSearchParams } from 'next/navigation';
import ApiClient from '../../methods/api/apiClient'

const Html = () => {
  const history = useRouter()
  const param = useSearchParams()
  const id = param.get('id')

  useEffect(() => {
    if (id) {
      ApiClient.delete(`destroy/user?id=${id}`).then(res => {
        if (res.success) {
          crendentialModel.logout()
          // toast.error("Payment cannot complete...")
        }
      })
    }
  }, [id])

  return (
    <div>
       <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
            <div className='container p-80'>
              <div className='row'>
                <div className='col-12 col-md-6 mx-auto'>
                  <div className='shadow_card'>
                      <div className='card'>
                        <div className='card-header'>
                            <div className='text_lines'>
                                <h6 className='m-0'>Cancel Transaction</h6>
                            </div>
                        </div>
                        <div className='card-body'>
                              <div className='requ_failed text-center'>
                                <img src="assets/img/cancelpage.png" className='transc_cnle' />
                                 
                              </div>
                              <div className='text-center mt-4'>
                              <button className='cancel_btns mt-2' onClick={()=>history.push('/')}>go to home</button>
                              </div>
                        </div>
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
