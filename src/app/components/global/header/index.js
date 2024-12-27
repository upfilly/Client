import React, { useState, useEffect } from 'react';
import './style.scss';
import Html from './Html';
import { useRouter } from 'next/navigation';
import crendentialModel from '@/models/credential.model';
import axios from 'axios';
import { ConnectSocket } from '@/app/chat/socket';

const Header = ({setShowPopup,settingData}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [user, setUser] = useState(crendentialModel.getUser());
  const toggle = () => setIsOpen(!isOpen);
  const toggle2 = () => setIsOpen2(!isOpen2);
  const history = useRouter();

  const Logout = () => {
    crendentialModel.logout()
    history.push('/login');
  };

  useEffect(
    () => {
      window.scrollTo({ top: 0 });
    },
    []
  );


  const [search, setSearch] = useState('')

  const searchHandle = (e) => {
    e.preventDefault()
    dispatch(search_success(search))
  }

  const searchChange = (e) => {
    setSearch(e)
  }

  useEffect(() => {
    if (user?.id) {
      ConnectSocket.emit('user-online', { user_id: user?.id });
      return () => {

        ConnectSocket.emit('user-offline', { user_id: user?.id });
      }
    }
  }, [])


  const clear = () => {
    setSearch('')
    dispatch(search_success(''))
  }

  return (
    <Html
    isOpen={isOpen}
    toggle={toggle}
    isOpen2={isOpen2}
    toggle2={toggle2}
    setIsOpen2={setIsOpen2}
    searchHandle={searchHandle}
    search={search}
    user={user}
    searchChange={searchChange}
    clear={clear}
    Logout={Logout}
    setShowPopup={setShowPopup}
    settingData={settingData}
    />
  );
};

export default Header;
