'use client'

import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/global/layout';
import EditProfile from '@/app/components/Profile/Edit';
import ChangePassword from '@/app/components/Profile/ChangePassword';
import { useParams } from 'next/navigation';

const Settings = () => {
  const { tab } = useParams()
  let dtab:any=tab
  const [tabs, setTabs] = useState(dtab);

  useEffect(() => {
    if (tab) {
      setTabs(tab)
    } else {
      setTabs('profile')
    }
  }, [tab])

  return (
    <>
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
        {!tab ? <>
          <h3 className="mb-3">Settings</h3>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a
                className={tabs == 'profile' ? 'nav-link active' : 'nav-link'}
                href="#"
                onClick={() => setTabs('profile')}
              >
                Edit Profile
              </a>
            </li>
            <li className="nav-item">
              <a
                className={
                  tabs == 'change-pass' ? 'nav-link active' : 'nav-link'
                }
                href="#"
                onClick={() => setTabs('change-pass')}
              >
                Change Password
              </a>
            </li>
          </ul> </> : <></>}


          <div>
          {tabs === 'edit' ? <EditProfile /> : <></>}
          {tabs === 'change-password' ? <ChangePassword /> : <></>}
        </div>
      </Layout>
    </>
  );
};

export default Settings;
