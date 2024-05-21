'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageContainer from '../components/main/PageContainer'
import "./style.scss";
import { useRouter, useSearchParams } from 'next/navigation';
import ApiClient from "../../methods/api/apiClient";
import loader from '@/methods/loader';
import crendentialModel from "../../models/credential.model";
import { requestForToken } from '../firebase/function';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';

export default function Login() {
  const history = useRouter()
  const param = useSearchParams()
  const id = param.get("code")
  const user = crendentialModel.getUser()
  const [showPopup, setShowPopup] = useState(false)
  const [username, setUsername] = useState('');
  const [remember, setRemember] = useState(false);
  const [password, setPassword] = useState('');
  const [settingData, setSettingData] = useState([])
  const [eyes, setEyes] = useState({ password: false, confirmPassword: false, currentPassword: false });

  const onSuccess = async (response) => {
    const response1 = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${response?.access_token}`,
      },
    });
  }

  const googleLogin = () => {
    ApiClient.get('google/login/authentication').then((res) => {
      window?.open(res?.data)
    })
  }

  useEffect(() => {
    if (id) {
      loader(true)
      ApiClient.post(`google/login?authCode=${id}`, { campaign_unique_id: localStorage.getItem('campaign_unique_id') || '' }).then((res) => {
        if (res.success == true) {
          localStorage?.removeItem('campaign_unique_id')
          if (remember) {
            localStorage.setItem('remember', JSON.stringify(data))
          } else {
            localStorage.removeItem('remember')
          }
          // toast.success(res.message)
          localStorage.setItem('token', res.data.access_token)
          crendentialModel.setUser(res.data)
          let url = '/dashboard'
          history.push(url);
        }
        loader(false)
      })
    }
  }, [])

  const FaceBookLoginHandler = (e) => {
    loader(true)
    const FullName = e?.name || ""
    const data = {
      "role": "brand",
      "email": e?.email || "",
      "facebook_auth_id": e?.id || "",
      "firstName": FullName?.split(" ")[0] || "",
      "lastName": FullName?.split(" ")[1] || "",
      "fullName": FullName,
    }
    if (data?.email) {
      ApiClient.post('user/social-lggin',data).then((res) => {
        if (res.success == true) {
          localStorage?.removeItem('campaign_unique_id')
          if (remember) {
            localStorage.setItem('remember', JSON.stringify(data))
          } else {
            localStorage.removeItem('remember')
          }
          // toast.success(res.message)
          localStorage.setItem('token', res.data.access_token)
          crendentialModel.setUser(res.data)
          let url = '/dashboard'
          history.push(url);
        }
      })
      loader(false)
    } else {
      loader(false)
      return
    }
  }

  useEffect(() => {
    if (user) {
      history.push('/')
    }
  }, [])

  useEffect(() => {
    let r = localStorage.getItem('remember')
    if (r) {
      let data = JSON.parse(r)
      setUsername(data.email)
      setPassword(data.password)
      setRemember(true)
    }
  }, [])

  useEffect(() => {
    requestForToken()
  }, [])

  const setIPaddress = async () => {
    const res = await axios.get("https://api.ipify.org?format=json");
    localStorage.setItem("ip_address", res?.data?.ip)
  }

  useEffect(() => {
    if (!localStorage.getItem("ip_address")) {
      setIPaddress()
    }
  }, [])

  useEffect(() => {
    ApiClient.get('settings').then(res => {
      if (res.success) {
        setSettingData(res?.data)
      }
    })
  }, [])

  const hendleSubmit = (e) => {
    e.preventDefault()
    let data;
    if (localStorage.getItem("device_token")) {
      data = {
        email: username,
        device_token: localStorage.getItem("device_token"),
        password
      };
    } else {
      data = {
        email: username,
        device_token: "",
        password
      };
    }
    loader(true)
    ApiClient.post('user/signin', data).then(res => {

      if (res.success == true) {
        if (remember) {
          localStorage.setItem('remember', JSON.stringify(data))
        } else {
          localStorage.removeItem('remember')
        }
        // toast.success(res.message)
        localStorage.setItem('token', res.data.access_token)
        crendentialModel.setUser(res.data)

        let url = '/dashboard'
        if (res?.data?.tax_detail == '' && res?.data?.role == 'affiliate') {
          history.push('/addAccount/detail')
        } else {
          history.push(url)
        }
       ;
      }
      loader(false)
    })
  };

  const handleClose = () => {
    setShowPopup(false)
  }

  return (
    <PageContainer title='Login Page' description='Login Page' settingData={settingData}>
      <div className='card_parent'>
      <div className="container ">

<div className="form-row align-items-center mx-auto">
  {/* <div className="col-md-4 px-0">
    <div className='banner_img'>
      <div className='logo_img'>
        <Link href="/"> <Image src="/assets/img/logo.png" className='logo' width="300" height="55" alt="logo" /></Link>
      </div>
      <div className='loginLeftImg'>
        <h3>Multipurpose <br /> tool you need to succeed <br /> in business</h3>
      </div> 
    </div>
  </div> */}
  <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto">
    <div className='right_side'>

      <form
        className="centerLogin"
        onSubmit={hendleSubmit}
      >
        <Link href="/"><i className="fa fa-angle-double-left back_button" aria-hidden="true"></i></Link>
        
        <div className="text-center mb-3">
          <h3 className="text-center lgtext">Login</h3>
        </div>
        <div className="mb-3">
          <input
            type="email"
            className="form-control mb-0 bginput" placeholder='Email address'
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <div className="inputWrapper">
            <input
              type={eyes.password ? 'text' : 'password'}
              className="form-control mb-0 bginput"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <i className={eyes.password ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, password: !eyes.password })}></i>
          </div>
        </div>
        <div className="mt-0 border-bottom pb-3">
          <button type="submit" className="btn btn-primary loginclass mb-2 mt-1">
            Login
          </button>
          <div className='d-flex flex-wrap  justify-content-between  mt-2'>
            <label className='d-flex align-items-center mb-0'><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="mr-2" /><span className='forbx '>Keep me logged</span></label>

            <Link href="/forgotpassword" className="text-primary  forbx text-black">Forgot Password</Link>
          </div>


        </div>
        <div className="text-center or mt-2 mb-1 orbx">
          OR
        </div>
        <button className='btn btn-outline-white font_set' type='button'
          onClick={e => googleLogin()}
        >
          <svg className='google_right' xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
            <path d="M16.1094 13.1786V19.3466H24.6803C24.4975 20.3198 24.1199 21.2461 23.5699 22.0696C23.02 22.8931 22.3093 23.5969 21.4803 24.1386L26.6493 28.1496C28.2163 26.6381 29.4487 24.8146 30.2667 22.797C31.0848 20.7794 31.4702 18.6125 31.3983 16.4366C31.3992 15.3441 31.3021 14.2537 31.1083 13.1786H16.1094Z" fill="#4285F4" />
            <path d="M7.18359 19.1056L6.01758 19.9976L1.8916 23.2116C3.21419 25.85 5.24393 28.069 7.75439 29.6208C10.2649 31.1726 13.1572 31.9962 16.1085 31.9996C19.9844 32.1073 23.755 30.7296 26.6486 28.1486L21.4796 24.1376C19.8839 25.1767 18.0123 25.7115 16.1085 25.6726C14.1233 25.6473 12.1959 25.0011 10.5966 23.8248C8.9972 22.6485 7.80617 21.0011 7.19055 19.1136L7.18359 19.1056Z" fill="#34A853" />
            <path d="M1.8916 8.93561C0.767523 11.147 0.18226 13.5929 0.183596 16.0736C0.18226 18.5543 0.767523 21.0002 1.8916 23.2116C1.8916 23.2256 7.19165 19.0996 7.19165 19.0996C6.86063 18.1249 6.68934 17.103 6.68457 16.0736C6.68936 15.0442 6.86065 14.0224 7.19165 13.0476L1.8916 8.93561Z" fill="#FBBC05" />
            <path d="M16.1095 6.4896C18.3746 6.45551 20.5635 7.30731 22.2096 8.86356L26.7705 4.30259C23.8904 1.59022 20.0705 0.100722 16.1145 0.147556C13.1624 0.148065 10.2687 0.970441 7.75757 2.52256C5.24642 4.07467 3.21695 6.29526 1.89648 8.93558L7.19653 13.0476C7.81191 11.161 9.00221 9.51428 10.6006 8.33823C12.199 7.16218 14.1253 6.51576 16.1095 6.4896Z" fill="#EA4335" />
          </svg>
          Sign In With Google
        </button>

        <div className='facebok_width'>
        <FacebookLogin
          className="p-0"
          appId="425676736552748"
          fields="name,email,picture"
          textButton={<button className='btn btn-outline-white font_set' type='button'>
            <svg className='facebook_right' xmlns="http://www.w3.org/2000/svg" width="18" height="32" viewBox="0 0 18 32" fill="none">
              <path d="M11.438 31.08H6.13803C5.97129 31.08 5.81135 31.0139 5.69326 30.8962C5.57517 30.7785 5.50856 30.6187 5.50803 30.452V17.557H1.46203C1.29494 17.557 1.1347 17.4906 1.01655 17.3725C0.898406 17.2543 0.832031 17.0941 0.832031 16.927V11.817C0.832561 11.6503 0.899169 11.4905 1.01726 11.3728C1.13535 11.2551 1.29529 11.189 1.46203 11.189H5.51503V7.661C5.43491 6.68612 5.55764 5.70521 5.87548 4.78013C6.19332 3.85504 6.69938 3.00584 7.36175 2.28607C8.02411 1.56629 8.82843 0.991558 9.72397 0.5981C10.6195 0.204642 11.5869 0.000995435 12.565 0H17C17.0835 0.000308738 17.1661 0.0171726 17.243 0.0496149C17.3199 0.0820572 17.3896 0.129434 17.448 0.189C17.5074 0.248241 17.5541 0.318965 17.5852 0.396852C17.6163 0.47474 17.6312 0.558155 17.629 0.642V5.415C17.6285 5.58174 17.5619 5.74147 17.4438 5.85918C17.3257 5.9769 17.1658 6.043 16.999 6.043H14.287C12.415 6.043 12.072 6.773 12.072 8.21V11.195H16.811C16.9778 11.195 17.1377 11.2611 17.2558 11.3788C17.3739 11.4965 17.4405 11.6563 17.441 11.823V16.936C17.441 17.0187 17.4247 17.1007 17.3931 17.1771C17.3614 17.2535 17.315 17.323 17.2565 17.3815C17.198 17.44 17.1286 17.4864 17.0521 17.518C16.9757 17.5497 16.8938 17.566 16.811 17.566H12.073V30.448C12.0736 30.5314 12.0575 30.6141 12.0257 30.6912C11.994 30.7683 11.9472 30.8383 11.8881 30.8972C11.8289 30.956 11.7587 31.0025 11.6814 31.0338C11.6042 31.0652 11.5214 31.0809 11.438 31.08Z" fill="#4285F4" />
            </svg>
            Sign In With Facebook
          </button>}
          buttonStyle={{ border: "none", background: "none" }}
          callback={e => FaceBookLoginHandler(e)} />
        </div>


        <p className='text-center font_set border-top pt-2 mb-1 mt-2 account_ptag'>Don't have an account?</p>
        <Link className='btn btn-outline-white mb-0 font_set' type='button' href="/SignupOptions" >
          Register Now
        </Link>
      </form>
    </div>
  </div>

  {showPopup && (

    <div className="modal d-block bgBlur">
      <div className="modal-dialog modal-dialog-centered  dateModal" role="document">
        <div className="modal-content text-center">
          <a type="button" className="closeIcon" data-dismiss="modal" aria-label="Close" onClick={() => setShowPopup(false)}>
            <span aria-hidden="true">&times;</span>
          </a>
          <div className="modal-body pb-5">
            <div className='mb-4'>
              <img src="../../../assets/img/logo.png" className="greentik" />
            </div>
            <div>
              <h6 className='mb-3'>Signing up as</h6>
              <Link className='btn btn-primary mr-3 pl-4 pr-4' onClick={handleClose} href="signup/brand">Brand</Link>
              <Link className='btn btn-primary pl-4 pr-4' onClick={handleClose} href="/pricing">Affiliate</Link>
            </div>
            <div>
            </div>
          </div>

        </div>
      </div>
    </div>


  )}
</div>
</div>
      </div>
    </PageContainer>
  )
}
