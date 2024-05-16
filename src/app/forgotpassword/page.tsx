'use client'

import React, { useEffect, useState } from 'react';
import ApiClient from '@/methods/api/apiClient';
import loader from '../../methods/loader';
import './style.scss';
import PageContainer from '../components/main/PageContainer';
import Link from 'next/link';
import crendentialModel from '@/models/credential.model';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';

const Forgotpassword = () => {
    const history = useRouter();
    const [settingData, setSettingData] = useState([])
    const user = crendentialModel.getUser()
    useEffect(() => {
        if (user) {
            history.push('/dashboard')
        }
    }, [])

    const [form, setForm] = useState({ email: '' });

    const hendleSubmit = (e:any) => {
        e.preventDefault();
        loader(true)

        ApiClient.post('forgot/password/users', { ...form }).then(res => {
            if (res.success) {
                toast.success(res.message)
                history.push('/resetpassword');
            }
            loader(false)
        })
    };

    useEffect(() => {
        ApiClient.get('settings').then(res => {
          if (res.success) {
            setSettingData(res?.data)
          }
        })
    }, [])

    return (
        <>
            <PageContainer title='Forgot Password' description='Forgot Password' settingData={settingData}>
               <div className='card_parent' >
               <div className="container-fluid p-0 bg-black">
                    <div className="row align-items-center mx-auto">
                        <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 mx-auto">
                            {/* <div className='banner_img'>
                                <div className='logo_img'>
                                    <Image src="/assets/img/logo.png" alt='Logo' width="300" height="55" className='logo' />
                                </div>
                                <div className='loginLeftImg'>
                                    <h3>The multipurpose tool you need to succeed in business</h3>
                                </div>
                               
                            </div>
                        </div>

                        <div className="col-md-8 p-0"> */}
                            <div className='right_side'>
                                <form
                                    className="centerLogin"
                                    onSubmit={hendleSubmit}
                                >
                                    <div className="text-center mb-4">
                                        <h3 className="text-left lgtext">Forgot password?</h3>
                                    </div>
                                    <p className='para_forget'>No worriest! Just enter your email and we’ll send you a reset password link.</p>
                                    <div className="mb-3">
                                        <div className="inputWrapper">
                                            <input
                                                type="email"
                                                className="form-control  mb-0 bginput" placeholder='Email*'
                                                value={form.email}
                                                required
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                            />

                                        </div>
                                    </div>


                                    <div className="buttons">

                                        <button type="submit" className="btn btn-primary loginclass mb-2">
                                            Send
                                        </button>
                                    </div>

                                    {/* <p className='accopuntt'> Just Remember?<Link className="sign_up" href="/signup"> Sign Up</Link></p> */}
                                </form>

                            </div>

                        </div>


                    </div>
                </div>
               </div>
            </PageContainer>
        </>
    );
};

export default Forgotpassword;
