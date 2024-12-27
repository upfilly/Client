"use client"

import React, { useEffect } from 'react';
import crendentialModel from '@/models/credential.model';
import Html from './Html';
import { useRouter } from 'next/navigation';

const GenerateLink = () => {
const user = crendentialModel.getUser()
const history = useRouter()

    return <>
        <Html  
        />
    </>;
};

export default GenerateLink;
