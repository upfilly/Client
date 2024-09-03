import React from 'react';
import './DataComparison.css'; // Import the CSS file

const truncateText = (text, maxLength) => {
    const str = text != null ? String(text) : '';
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

const DataComparison = ({ oldData, newData, module, type }) => {

    const getDifferences = (oldData, newData) => {
        const excludedKeys = ['id', 'affiliate_id', 'addedBy', 'brand_id'];
        const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
        const differences = {};

        allKeys.forEach(key => {
            if (excludedKeys.includes(key)) {
                return;
            }

            const oldValue = oldData[key];
            const newValue = newData[key];

            if ((oldValue !== undefined && oldValue !== null && oldValue !== '') ||
                (newValue !== undefined && newValue !== null && newValue !== '')) {
                if (oldValue !== newValue) {
                    differences[key] = {
                        old: oldValue || '',
                        new: newValue || ''
                    };
                }
            }
        });

        return differences;
    };


    const differences = getDifferences(oldData, newData);

    const filteredDifferences = Object.keys(differences).reduce((acc, key) => {
        const oldValue = differences[key].old;
        const newValue = differences[key].new;

        if (oldValue !== newValue) {
            acc[key] = {
                old: oldValue || '',
                new: newValue || ''
            };
        }

        return acc;
    }, {});

    function transformString(inputString) {
        let noUnderscores = inputString.replace(/_/g, ' ');

        let capitalized = noUnderscores
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return capitalized;
    }

    return (
        <>
            <div className='mb-5'>
                <div className='container'>
                    <div className='all_brder_div'>
                        <h5 className='title_detailss px-3'>Activity Detail</h5>
                        <h5 className='title_generate text-center mb-0 pt-3'>{transformString(module)}</h5>
                        <div className="comparison-containe pt-3 px-3">
                            {type !== "created" && <div className="title_newchanges">
                                <h5 className='changes_new'>Previous Changes</h5>
                                <div className="row mx-auto">
                                    {Object.keys(filteredDifferences).length === 0 ? (
                                        <p>No differences found.</p>
                                    ) : (
                                        Object.keys(filteredDifferences).map(key => (
                                            <div className='col-sm-6 mb-3' key={key}>
                                                <div className='title_key'>{key}:</div>
                                                <div className='key_ans'>
                                                    {truncateText(filteredDifferences[key].old, 50)}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>}

                            <div className='pt-4 pb-5'>
                                <div className=''>
                                    <div className='title_newchanges'>
                                        <h5 className='changes_new'>New Changes</h5>
                                        <div className="section new-section">
                                            <div className="row mx-auto">
                                                {Object.keys(filteredDifferences).length === 0 ? (
                                                    <p>No differences found.</p>
                                                ) : (
                                                    Object.keys(filteredDifferences).map(key => {
                                                        if (!filteredDifferences[key].new) {
                                                            return
                                                        }
                                                        return (
                                                            <div className='col-sm-6 mb-3' key={key}>
                                                                <div className='title_key'>{key}:</div>
                                                                <h5 className='key_ans'>
                                                                    {truncateText(filteredDifferences[key].new, 50)}
                                                                </h5>
                                                            </div>
                                                        )
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DataComparison;