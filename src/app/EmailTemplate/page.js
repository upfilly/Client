"use client"

import React, { useEffect, useState } from 'react';
import crendentialModel from '@/models/credential.model';
import Html from './Html';
import { useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';

const GenerateLink = () => {
const user = crendentialModel.getUser()
const history = useRouter()
const [relatedAffiliate,setAllAffiliate] = useState([])

    const allGetAffiliate = (p = {}) => {
        let url = 'getallaffiliatelisting'
        ApiClient.get(url).then(res => {
            if (res.success) {
                const data = res.data
                const filteredData = data.filter(item => item !== null);
                setAllAffiliate(filteredData)
            }
        })
    }

    useEffect(() => {
        allGetAffiliate()
    }, [])

    return <>
        <Html
        relatedAffiliate={relatedAffiliate}  
        />
    </>;
};

export default GenerateLink;
