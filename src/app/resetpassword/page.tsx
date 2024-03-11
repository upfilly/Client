'use client'

import crendentialModel from '@/models/credential.model';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import methodModel from '@/methods/methods';
import './style.scss';
import Link from 'next/link';
import { toast } from 'react-toastify';
import PageContainer from '../components/main/PageContainer';
import Image from 'next/image';

const Resetpassword = () => {
    const history = useRouter();
    const user = crendentialModel.getUser()
    const [settingData, setSettingData] = useState([])

    useEffect(() => {
        if (user) {
            history.push('/dashboard')
        }
    }, [])

    const formValidation = [
        { key: 'confirmPassword', minLength: 8, confirmMatch: ['confirmPassword', 'newPassword'] },
        { key: 'newPassword', minLength: 8 },
    ]

    const [form, setForm] = useState({ confirmPassword: '', newPassword: '', code: '',id:'' });
    const [submitted, setSubmitted] = useState(false)
    const [eyes, setEyes] = useState({ password: false, confirmPassword: false });

    const getError = (key:any) => {
        return methodModel.getError(key, form, formValidation)
    }

    useEffect(() => {
        let prm:any = {
            // email: methodModel.getPrams('email'),
            id: methodModel.getPrams('id'),
            code: methodModel.getPrams('code'),
        }

        setForm({ ...form, ...prm })
    },[])

    useEffect(() => {
        ApiClient.get('settings').then(res => {
          if (res.success) {
            setSettingData(res?.data)
          }
        })
    }, [])

    const hendleSubmit = (e:any) => {
        e.preventDefault();
        setSubmitted(true)
        let invalid = methodModel.getFormError(formValidation, form)
        if (invalid) return
        loader(true)
        let payload = {
            newPassword: form.newPassword,
            code: form.code
        }
        ApiClient.put('reset/password', payload).then(res => {
            if (res.success) {
                toast.success(res.message)
                history.push('/login');
            }
            loader(false)
        })
    };


    return (
        <>
        <PageContainer settingData={settingData}>
            <div className="container-fluid p-0 bg-black">
                <div className="row align-items-center mx-auto">
                    <div className="col-md-4 p-0 mx-auto">
                        {/* <div className='banner_img'>
                            <div className='logo_img'>
                                <Link href="/"> <Image alt='logo' width="300" height="55" src="/assets/img/logo.png" className='logo' /></Link>
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
                                <div className="text-center mb-2">
                                    <h3 className="text-left lgtext">New Password</h3>

                                    <p className='para_forget_new'>Please create a new password that you don’t use on any other site.</p>
                                </div>

                                <div className="mb-3">
                                        <div className="inputWrapper mb-3">
                                            <input
                                                type="text"
                                                className="form-control mb-0 bginput"
                                                value={form.code}
                                                onChange={e => setForm({ ...form, code: e.target.value })}
                                                placeholder="Code"
                                                required
                                            />
                                        </div>
                                    {/* <label>New Password<span className="start">*</span></label> */}

                                    <div className="mb-3">
                                        <div className="inputWrapper">
                                            <input
                                                type={eyes.password ? 'text' : 'password'}
                                                className="form-control mb-0 bginput"
                                                value={form.newPassword}
                                                min="12"
                                                onChange={e => setForm({ ...form, newPassword: e.target.value })}
                                                placeholder="Create new password"
                                                required
                                            />
                                            <i className={eyes.password ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, password: !eyes.password })}></i>
                                        </div>

                                        {submitted && getError('newPassword').invalid ? <div className="invalid-feedback d-block">Min Length must be 8 characters long</div> : <></>}
                                    </div>
                                    <div className="inputWrapper">
                                        {/* <label>Confirm Password<span className="start">*</span></label> */}

                                        <div className="inputWrapper">
                                            <input
                                                type={eyes.confirmPassword ? 'text' : 'password'}
                                                className="form-control mb-0 bginput"
                                                value={form.confirmPassword}
                                                maxLength={50}
                                                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                                placeholder="Confirm new password"
                                                required
                                            />
                                            <i className={eyes.confirmPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, confirmPassword: !eyes.confirmPassword })}></i>
                                        </div>
                                        {submitted && getError('confirmPassword').err.confirmMatch ? <div className="invalid-feedback d-block">Comfirm Password is not matched with New Password</div> : <></>}
                                    </div>
                                </div>


                                <div className="buttons">

                                    <button type="submit" className="btn btn-primary loginclass mb-4">
                                        Send
                                    </button>
                                </div>

                                {/* <p className='accopuntt'> Just Remember?<a class="sign_up" href="/login"> Sign Up</a></p> */}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            </PageContainer>
        </>
    );
};

export default Resetpassword;
