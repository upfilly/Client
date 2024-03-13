import datepipeModel from '@/models/datepipemodel';
import React from 'react';
import SelectDropdown from '../components/common/SelectDropdown';
import methodModel from '@/methods/methods';
import ReactPaginate from 'react-paginate';
import Layout from '../components/global/layout';

const Html = ({
    filter,
    reset,
    filters,
    setFilter,
}) => {

    return (
        <>
            <Layout handleKeyPress={''} setFilter={''} reset={''} filter={''} name="Generate Link" filters={''} >
            Generate Link
            </Layout>
        </>
    );
};

export default Html;
