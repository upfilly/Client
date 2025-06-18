"use client"

import React, { useEffect, useState } from 'react';
import crendentialModel from '@/models/credential.model';
import Html from './Html';
import { useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import { toast } from 'react-toastify';
import moment from 'moment';

const GenerateLink = () => {
    const user = crendentialModel.getUser()
    const history = useRouter()
    const [relatedAffiliate, setAllAffiliate] = useState([])
    const [form, setForm] = useState({
        isAllJoined: true,
        timeInterval: '',
        acceptedDate: '',
        affiliateStatus: false,
        title: "",
        // user_id: "",
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
            ...form,
            title: form?.title,
            // user_id: form?.user_id,
            description: form?.description
        }

        if (form?.isAllJoined) {
            delete form?.timeInterval
            delete form?.acceptedDate
            delete form?.affiliateStatus
        } else if (form?.timeInterval) {
            delete form?.acceptedDate
            delete form?.affiliateStatus
            delete form?.isAllJoined
        } else if (form?.acceptedDate) {
            delete form?.timeInterval
            delete form?.acceptedDate
            delete form?.affiliateStatus
        } else if (form?.affiliateStatus) {
            delete form?.timeInterval
            delete form?.acceptedDate
            delete form?.isAllJoined
        }

        console.log(payload, "payloadpayload")
        // loader(true);
        ApiClient.post('emailmessage/send', payload).then((res) => {
            if (res?.success) {
                toast.success("E-mail Sent")
                setTimeout(() => {
                    location.reload()
                }, 2000)
            }
            // loader(false);
        });
    };

    const allGetAffiliate = (p = {}) => {
        let url = 'affiliate/count'
        let filters;
        if (form?.timeInterval == 'before') {
            filters = { before: moment(form?.acceptedDate).format('YYYY-MM-DD') }
        } else {
            filters = { after: moment(form?.acceptedDate).format('YYYY-MM-DD') }
        }
        ApiClient.get(url,filters).then(res => {
            if (res?.sucess) {
                console.log(res, "sgdjhsdj")
                const data = res
                const filteredData = data
                setAllAffiliate(filteredData)
            }
        })
    }

    useEffect(() => {
        allGetAffiliate()
    }, [form?.acceptedDate])

    return <>
        <Html
            relatedAffiliate={relatedAffiliate}
            form={form}
            setForm={setForm}
            handleSubmit={handleSubmit}
        />
    </>;
};

export default GenerateLink;
