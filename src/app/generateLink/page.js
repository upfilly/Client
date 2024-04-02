"use client"

import React, { useEffect } from 'react';
import crendentialModel from '@/models/credential.model';
import Html from './Html';
import { useRouter } from 'next/navigation';

const GenerateLink = () => {
const user = crendentialModel.getUser()
const history = useRouter()

useEffect(() => {
    if (user?.role == 'affiliate' && !user?.account_id) {
        history.push('/addAccount/detail')
    }
}, [])

    return <>
        <Html  
        />
    </>;
};

export default GenerateLink;
