import React, { useEffect, useState } from "react";
import methodModel from "@/methods/methods";
import Layout from "@/app/components/global/layout";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import ApiClient from "@/methods/api/apiClient";
import '../style.scss';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import MultiSelectDropdownData from "../MultiSelectDropdownData";
import MultiSelectRegionDropdown from "../MultiSelectRegion"
import axios from "axios";
import MultiSelectValue from "@/app/components/common/MultiSelectValue";

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ id, form, affiliateData, selectedRegionItems, setSelectedRegionItems, handleSubmit, setform, submitted, back, errors, selectedItems, setSelectedItems }) => {
    const [countries, setCountries] = useState([]);
    const [loadDocerr, setDocLoader] = useState()
    const [docLoder, setDocLoder] = useState()
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subSubCategories, setSubSubCategories] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isRegionOpen, setRegionIsOpen] = useState(false);
    const categoryTypes = [
        { id: 'promotional_models', name: 'Promotional Models' },
        { id: 'property_types', name: 'Property Types' },
        // { id: 'advertiser_categories', name: 'Advertiser Categories' },
    ]

    const EventType = [
        { id: 'lead', name: 'Lead' },
        // { id: 'visitor', name: 'Visitor' },
        { id: 'purchase', name: 'Purchase' },
        // { id: 'line-item', name: 'Line-item' }
    ]

    const uploadDocument = async (e, key) => {
        let files = e.target.files
        let i = 0
        let imgfile = []
        for (let item of files) {
            imgfile.push(item)
        }

        setDocLoader(true)
        for await (let item of imgfile) {
            let file = files.item(i)
            let url = 'upload/document'

            const res = await ApiClient.postFormData(url, { file: file })
            if (res.success) {
                let path = res?.data?.imagePath
                if (form?.documents?.length <= 9) {
                    form?.documents?.push({
                        name: `documents/${path}`,
                        url: `documents/${path}`
                    })
                }
            }
            i++
        }
        setDocLoader(false)
        setDocLoder(false)
        // setVdo(false)
    }

    const removeDocument = (index, key) => {
        const filterVid = form?.documents?.length > 0 && form.documents.filter((data, indx) => {
            return index != indx
        })
        setform({ ...form, documents: filterVid })
    }

    const handleCategoryTypeChange = (selectedCategoryType) => {
        getCategory(selectedCategoryType)
        setSubCategories([]);
        setSubSubCategories([]);
    };

    const getCategory = () => {
        let url = `categoryWithSub?page&count&search&cat_type=advertiser_categories&status=active`;
        ApiClient.get(url).then((res) => {
            if (res.success) {
                // const data = res.data.data;
                // const category = res.data.data.map((dat) => {
                //     return ({
                //         id: dat?._id,
                //         name: dat?.parent_cat_name,
                //         subCategories: dat?.subCategories
                //     })
                // })
                setCategories(res.data.data);
            }
        });
    };

    const handleNumericInput = (e, fieldName) => {
        const value = e.target.value;

        if (/^\d*\.?\d*$/.test(value)) {
            setform({ ...form, [fieldName]: value });
        }
    };

    const handleCategoryChange = (selectedCategoryIds) => {
        const filteredSubCategories = categories
            .filter(cat => selectedCategoryIds.includes(cat.id))
            .flatMap(cat => cat.subCategories);

        console.log(filteredSubCategories, "klklklk");
        setSubCategories(filteredSubCategories);
        setSubSubCategories([]);
    };

    const handleSubCategoryChange = (selectedSubCategoryIds) => {
        const filteredSubSubCategories = subCategories
            .filter(sub => selectedSubCategoryIds.includes(sub.id))
            .flatMap(sub => sub.subchildcategory);

        console.log(filteredSubSubCategories, "klklkll");

        const SubSubCategories = filteredSubSubCategories.map((dat) => {
            return {
                id: dat?._id || dat?.id,
                name: dat?.name,
            };
        });

        setSubSubCategories(SubSubCategories);
    };

    const fetchCountriesByRegions = async (regions) => {
        try {
            const countries = await Promise.all(
                regions.map(async (region) => {
                    const response = await axios.get(
                        `https://restcountries.com/v3.1/region/${region}`
                    );
                    return response.data.map((country) => ({
                        label: country.name.common,
                        id: country.name.common,
                    }));
                })
            );

            // Flatten the array of country arrays and return
            setCountries(countries.flat());
        } catch (error) {
            console.error('Error fetching countries:', error);
            return [];
        }
    };

    useEffect(() => {
        getCategory()
    }, [])

    return <>
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Campaign"} filters={undefined}>
            <form onSubmit={handleSubmit}>
                <div className="sidebar-left-content">
                    <div className="pprofile1 card card-shadow p-4">
                        <div className="">
                            <div className="main_title_head profile-card">
                                <h3 className='VieUser'>
                                    <a to="/campaign" onClick={e => back()}>
                                        <i className="fa fa-arrow-left mr-2" title='Back' aria-hidden="true"></i>
                                    </a>
                                    {form && form.id ? 'Edit' : 'Add'} Campaign
                                </h3>
                                <hr />
                            </div>

                            <div className="form-row">
                                <div className="col-md-6 mb-3">
                                    <label>Name<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.name}
                                        onChange={e => setform({ ...form, name: e.target.value })}
                                    />
                                    {submitted && !form?.name && <div className="invalid-feedback d-block">{errors?.name}</div>}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Type<span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Type"
                                            intialValue={form?.access_type}
                                            disabled={form?.status === "rejected" || !id ? false : true}
                                            result={e => {
                                                setform({ ...form, access_type: e.value });
                                            }}
                                            options={[{ id: "public", name: "Public" }, { id: "private", name: "Private" }]}
                                        />
                                    </div>
                                    {submitted && !form?.access_type && <div className="invalid-feedback d-block">{errors?.access_type}</div>}
                                </div>

                                {form?.access_type === "private" && (
                                    <div className="col-md-6 mb-3">
                                        <label>Affiliate<span className="star">*</span></label>
                                        <div className="select_row">
                                            <MultiSelectValue
                                                id="statusDropdown"
                                                displayValue="fullName"
                                                placeholder="Select Affiliate"
                                                intialValue={form?.affiliate_id}
                                                result={e => {
                                                    setform({ ...form, affiliate_id: e.value });
                                                }}
                                                disabled={form?.status === "rejected" || !id ? false : true}
                                                options={affiliateData}
                                            />
                                        </div>
                                        {submitted && !form?.affiliate_id && <div className="invalid-feedback d-block">{errors?.affiliate_id}</div>}
                                    </div>
                                )}

                                <div className="col-md-6 mb-3">
                                    <label>Event Type:<span className="star">*</span></label>
                                    <div className="select_row">
                                        <MultiSelectValue
                                            id="statusDropdown"
                                            // singleSelect={true}
                                            displayValue="name"
                                            placeholder="Select Type"
                                            intialValue={form?.event_type}
                                            disabled={!id}
                                            result={e => {
                                                setform({ ...form, event_type: e.value });
                                            }}
                                            options={EventType}
                                        />
                                    </div>
                                    {submitted && !form?.event_type && <div className="invalid-feedback d-block">{errors?.event_type}</div>}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Affiliate Approval:<span className="star">*</span></label>
                                    <div className="select_row">
                                        <MultiSelectValue
                                            id="statusDropdown"
                                            singleSelect={true}
                                            displayValue="name"
                                            placeholder="Select Type"
                                            intialValue={form?.campaign_type}
                                            disabled={!id ? false : true}
                                            result={e => {
                                                setform({ ...form, campaign_type: e.value });
                                            }}
                                            options={[
                                                { id: 'manual', name: 'Manual' },
                                                { id: 'automatic', name: 'Automatic' },
                                            ]}
                                        />
                                    </div>
                                    {submitted && !form?.campaign_type && <div className="invalid-feedback d-block">{errors?.campaign_type}</div>}
                                </div>

                                {/* New Dropdown for Percentage or Amount */}
                                {form?.event_type?.includes("purchase") && <div className="col-md-6 mb-3">
                                    <label>Purchase Amount/Percentage Type<span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="amount_typeDropdown"
                                            displayValue="name"
                                            placeholder="Select Amount or Percentage"
                                            intialValue={form?.commission_type}
                                            disabled={!id ? false : true}
                                            result={e => {
                                                setform({ ...form, commission_type: e.value });
                                            }}
                                            options={[{ id: "percentage", name: "Percentage" }, { id: "amount", name: "Amount" }]}
                                        />
                                    </div>
                                    {submitted && !form?.commission_type && <div className="invalid-feedback d-block">{errors?.commission_type}</div>}
                                </div>}

                                {(form?.commission_type === "percentage" && form?.event_type?.includes("purchase")) && (
                                    <div className="col-md-6 mb-3">
                                        <label>Commission(%)<span className="star">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form?.commission || ''}
                                            disabled={!id ? false : true}
                                            // onChange={e => setform({ ...form, commission: e.target.value })}
                                            onChange={(e) => handleNumericInput(e, 'commission')}
                                            placeholder="Enter Percentage"
                                        />
                                        {submitted && !form?.commission && <div className="invalid-feedback d-block">{errors?.commission}</div>}
                                    </div>
                                )}

                                {(form?.commission_type === "amount" && form?.event_type?.includes("purchase")) && (
                                    <div className="col-md-6 mb-3">
                                        <label>Commission Amount<span className="star">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form?.commission || ''}
                                            disabled={!id ? false : true}
                                            // onChange={e => setform({ ...form, commission: e.target.value })}
                                            onChange={(e) => handleNumericInput(e, 'commission')}
                                            placeholder="Enter Amount"
                                        />
                                        {submitted && !form?.commission && <div className="invalid-feedback d-block">{errors?.commission}</div>}
                                    </div>
                                )}

                                {form?.event_type?.includes("lead") && (
                                    <div className="col-md-6 mb-3">
                                        <label>Lead Amount<span className="star">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form?.lead_amount || ''}
                                            disabled={!id ? false : true}
                                            // onChange={e => setform({ ...form, lead_amount: e.target.value })}
                                            onChange={(e) => handleNumericInput(e, 'lead_amount')}
                                            placeholder="Enter Lead Amount"
                                        />
                                        {submitted && !form?.lead_amount && <div className="invalid-feedback d-block">{errors?.lead_amount}</div>}
                                    </div>
                                )}

                                {/* Conditionally Render the Input Field for Amount or Percentage */}

                                <div className="col-md-12 mb-3">
                                    <label>Default Campaign</label>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={form?.isDefault || false}
                                            onChange={e => setform({ ...form, isDefault: e.target.checked })}
                                        />
                                        <label className="form-check-label" htmlFor="defaultCampaign">
                                            Set this as the default campaign
                                        </label>
                                    </div>
                                </div>

                                {/* Category Type Dropdown */}
                                {/* <div className="col-md-6 mb-3">
                                    <label>Category Type<span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="categoryTypeDropdown"
                                            displayValue="name"
                                            placeholder="Select Category Type"
                                            intialValue={form?.category_type}
                                            result={e => {
                                                setform({ ...form, category_type: e.value });
                                                handleCategoryTypeChange(e.value);
                                            }}
                                            options={categoryTypes}
                                        />
                                    </div>
                                    {submitted && !form?.category_type && <div className="invalid-feedback d-block">{errors?.category_type}</div>}
                                </div> */}

                                <div className="col-md-12 mb-3" onClick={() => setRegionIsOpen(false)}>
                                    <label>Select Category<span className="star">*</span></label>
                                    <div className="drops category-input">
                                        <MultiSelectDropdownData
                                            isOpen={isOpen}
                                            setIsOpen={setIsOpen}
                                            data={categories}
                                            selectedItems={selectedItems}
                                            setSelectedItems={setSelectedItems}
                                        />
                                    </div>
                                    {submitted && selectedItems?.categories?.length == 0 && <div className="invalid-feedback d-block">{errors?.categories}</div>}
                                </div>

                                {/* Category Dropdown */}
                                {/* {categories?.length > 0 && <div className="col-md-6 mb-3">
                                    <label>Category<span className="star">*</span></label>
                                    <div className="select_row">
                                        <MultiSelectValue
                                            id="categoryDropdown"
                                            displayValue="name"
                                            placeholder="Select Category"
                                            intialValue={form?.category}
                                            result={e => {
                                                setform({ ...form, category: e.value });
                                                handleCategoryChange(e.value);
                                            }}
                                            options={categories}
                                        />
                                    </div>
                                </div>} */}

                                {/* Sub Category Dropdown */}
                                {/* {subCategories?.length > 0 && <div className="col-md-6 mb-3">
                                    <label>Sub Category<span className="star">*</span></label>
                                    <div className="select_row">
                                        <MultiSelectValue
                                            id="subCategoryDropdown"
                                            displayValue="name"
                                            placeholder="Select Sub Category"
                                            intialValue={form?.sub_category}
                                            result={e => {
                                                setform({ ...form, sub_category: e.value });
                                                handleSubCategoryChange(e.value);
                                            }}
                                            options={subCategories}
                                        />
                                    </div>
                                </div>} */}

                                {/* Sub Sub Category Dropdown */}
                                {/* {subSubCategories?.length > 0 && <div className="col-md-6 mb-3">
                                    <label>Sub Sub Category<span className="star">*</span></label>
                                    <div className="select_row">
                                        <MultiSelectValue
                                            id="subSubCategoryDropdown"
                                            displayValue="name"
                                            placeholder="Select Sub Sub Category"
                                            intialValue={form?.sub_child_category}
                                            result={e => {
                                                setform({ ...form, sub_child_category: e.value });
                                            }}
                                            options={subSubCategories}
                                        />
                                    </div>
                                </div>} */}

                                {/* Region Dropdown */}
                                {/* <div className="col-md-6 mb-3">
                                    <label>Region<span className="star">*</span></label>
                                    <div className="select_row">
                                        <MultiSelectValue
                                            id="subSubCategoryDropdown"
                                            displayValue="name"
                                            placeholder="Select Region"
                                            intialValue={form?.region}
                                            result={e => {
                                                setform({ ...form, region: e.value });
                                                fetchCountriesByRegions(e.value)
                                            }}
                                            options={[{ id: "Africa", name: "Africa" }, { id: "Asia", name: "Asia" }, { id: "Europe", name: "Europe" },
                                            { id: "North America", name: "North America" }, { id: "Oceania", name: "Oceania" }
                                            ]}
                                        />
                                    </div>
                                    {submitted && !form?.region && <div className="invalid-feedback d-block">{errors?.region}</div>}
                                </div> */}
                                <div className="col-md-12 mb-3" onClick={() => setIsOpen(false)}>
                                    <label>Select Country<span className="star">*</span></label>
                                    <div className="drops category-input">
                                        <MultiSelectRegionDropdown
                                            isRegionOpen={isRegionOpen}
                                            setRegionIsOpen={setRegionIsOpen}
                                            selectedItems={selectedRegionItems}
                                            setSelectedItems={setSelectedRegionItems}
                                        />
                                    </div>
                                    {submitted && selectedRegionItems?.regions?.length == 0 && <div className="invalid-feedback d-block">{errors?.region}</div>}
                                </div>

                                {/* Region Dropdown */}
                                {/* {form?.region?.length > 0 && <div className="col-md-12 mb-3">
                                    <label>Countries<span className="star">*</span></label>
                                    <div className="select_row">
                                        <MultiSelectValue
                                            id="subSubCategoryDropdown"
                                            displayValue="label"
                                            placeholder="Select Country"
                                            intialValue={form?.region_continents}
                                            result={e => {
                                                setform({ ...form, region_continents: e.value });
                                                // fetchCountriesByRegions(e.value)
                                            }}
                                            options={countries}
                                        />
                                    </div>
                                    {submitted && !form?.region_continents && <div className="invalid-feedback d-block">{errors?.region_continents}</div>}
                                </div>} */}

                                <div className="col-md-12 mb-3">
                                    <label>Description<span className="star">*</span></label>
                                    {true && <DynamicReactQuill
                                        theme="snow"
                                        value={form?.description ? form?.description : ''}
                                        onChange={(newValue) => setform((prev) => ({ ...prev, description: newValue }))
                                            // setform({ ...form, description: newValue })
                                        }
                                        className='tuncketcls'
                                        modules={{
                                            toolbar: [
                                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                [{ size: [] }],
                                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                                { 'indent': '-1' }, { 'indent': '+1' }],
                                                ['link', 'image', 'video'],
                                                ['clean']
                                            ],
                                        }}
                                        formats={[
                                            'header', 'font', 'size',
                                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                                            'list', 'bullet', 'indent',
                                            'link', 'image', 'video'
                                        ]}
                                        bounds={'.app'}
                                    />}
                                    {submitted && !form?.description && <div className="invalid-feedback d-block">Description is Required</div>}
                                </div>

                                <div className='col-md-6'>
                                    <label>Document(Max. Limit 10)</label>
                                    <div className="form-group drag_drop">
                                        <div className='upload_file'>
                                            {form?.documents?.length <= 9 && (
                                                <>
                                                    <button className="btn btn-primary upload_image">Upload Document</button>
                                                    <input
                                                        type="file"
                                                        className="form-control-file over_input"
                                                        accept=".doc,.docx,.xml,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        multiple={true}
                                                        onChange={(e) => {
                                                            setDocLoder(true)
                                                            uploadDocument(e, 'images');
                                                        }}
                                                    />
                                                </>
                                            )}
                                            {loadDocerr && docLoder && <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div>}
                                            <div className="imagesRow mt-4 img-wrappper">
                                                {form?.documents && form?.documents.map((itm, i) => {
                                                    return <div className="imagethumbWrapper cover" key={i}>
                                                        <img src="/assets/img/document.png" className="thumbnail" onClick={() => window.open(methodModel.noImg(itm?.url))} />
                                                        <i className="fa fa-times kliil" title="Remove" onClick={e => removeDocument(i)}></i>
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right edit-btns">
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </div>

                    </div>
                </div>

            </form>

        </Layout>
    </>
}

export default Html