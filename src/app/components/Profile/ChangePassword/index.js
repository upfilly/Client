import React, { useState } from 'react';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import methodModel from '@/methods/methods';
import { useRouter } from 'next/navigation';
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';

const ChangePassword = p => {
  const history = useRouter()
  const [form, setForm] = useState({ confirmPassword: '', currentPassword: '', newPassword: '' })
  const [submitted, setSubmitted] = useState(false)
  const formValidation = [
    { key: 'confirmPassword', minLength: 8, confirmMatch: ['confirmPassword', 'newPassword'] },
    { key: 'currentPassword', minLength: 8 },
    { key: 'newPassword', minLength: 8 },
  ]
  const [eyes, setEyes] = useState({ password: false, confirmPassword: false, currentPassword: false });
  const getError = (key) => {
    return methodModel.getError(key, form, formValidation)
  }

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true)
    let invalid = methodModel.getFormError(formValidation, form)
    if (invalid) return

    loader(true)
    ApiClient.put('change/password', { currentPassword: form.currentPassword, newPassword: form.newPassword }).then(res => {
      if (res.success) {
        crendentialModel.logout()
        history.push('/login');
        toast.success(res.message)
      }
      loader(false)
    })
  };

  return (
    <>
<section className='change_passwordbx' >
  <div className='container'>
  <div className='row'>
        <div className='col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6 mx-auto'>
          <form
            className=" chage_profiles shadow  "
            onSubmit={handleSubmit}
          >
            <div className="col-md-12 mb-3">
              <h3 className='ViewUser1 chage_titles mb-4 mt-3'>Change Password</h3>
              <label>Current Password<span className="start">*</span></label>
              <div className="inputWrapper">
                <input
                  type={eyes.currentPassword ? 'text' : 'password'}
                  className="form-control"
                  value={form.currentPassword}
                  maxLength="20"
                  onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                  required
                />
                <i className={eyes.currentPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, currentPassword: !eyes.currentPassword })}></i>
              </div>
              {submitted && getError('currentPassword').invalid ? <div className="invalid-feedback d-block">Min Length must be 8 characters long</div> : <></>}
            </div>

            <div className="col-md-12 mb-3">
              <label>New Password<span className="start">*</span></label>

              <div className="inputWrapper">
                <input
                  type={eyes.password ? 'text' : 'password'}
                  className="form-control"
                  value={form.newPassword}
                  maxLength="20"
                  onChange={e => setForm({ ...form, newPassword: e.target.value })}
                  required
                />
                <i className={eyes.password ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, password: !eyes.password })}></i>
              </div>
              {submitted && getError('newPassword').invalid ? <div className="invalid-feedback d-block">Min Length must be 8 characters long</div> : <></>}
            </div>

            <div className="col-md-12 mb-3">
              <label>Confirm Password<span className="start">*</span></label>

              <div className="inputWrapper">
                <input
                  type={eyes.confirmPassword ? 'text' : 'password'}
                  className="form-control"

                  value={form.confirmPassword}
                  maxLength="20"
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                />
                <i className={eyes.confirmPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, confirmPassword: !eyes.confirmPassword })}></i>
              </div>
              {submitted && getError('confirmPassword').invalid ? <>

                {/* {getError('confirmPassword').err.minLength ? <div>Min Length must be 8 characters long</div> : <></>} */}
                {getError('confirmPassword').err.confirmMatch ? <div className="invalid-feedback d-block">Comfirm Password is not matched with New Password</div> : <></>}

              </> : <></>}




            </div>

            <div className="col-md-12 text-right mt-3  mb-3">
              <button type="submit" className="btn btn-primary update_btns">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
  </div>
</section>
    </>
  );
};

export default ChangePassword;
