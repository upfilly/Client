"use client"

import React, { useEffect, useState } from 'react';
import crendentialModel from '@/models/credential.model';
import Html from './Html';
import { useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import { toast } from 'react-toastify';

const GenerateLink = () => {
const user = crendentialModel.getUser()
const history = useRouter()
const [relatedAffiliate,setAllAffiliate] = useState([])
const [form, setForm] = useState({
    title: "",
    user_id: "",
    description: '',
})

const resetForm = () => {
    const data = {
        title: "",
        user_id: "",
        description: "",
    }

    setForm(data)
}

const handleSubmit = () => {

    const payload = {
        addedBy: user?.id,
        title: form?.title,
        user_id: form?.user_id,
        description: form?.description
    }
    // loader(true);
    ApiClient.post('emailmessage/send', payload).then((res) => {
        if (res?.success) {
            toast.success(res?.message)
            setTimeout(()=>{
                location.reload()
            },1000)
        }
        // loader(false);
    });
};

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
        form={form}
        setForm ={setForm} 
        handleSubmit={handleSubmit}
        />
    </>;
};

export default GenerateLink;
