import React from 'react';
import './DataComparison.css'; // Import the CSS file

const truncateText = (text, maxLength) => {
    const str = text != null ? String(text) : '';
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

const DataComparison = ({ oldData, newData, module ,type}) => {
    console.log(oldData,"oldDataoldData")
    console.log(newData,"newDatanewData")

    const getDifferences = (oldData, newData) => {
        const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
        const differences = {};

        allKeys.forEach(key => {
            if (oldData[key] !== newData[key]) {
                differences[key] = {
                    old: oldData[key],
                    new: newData[key]
                };
            }
        });

        return differences;
    };

    const differences = getDifferences(oldData, newData);

    const filteredDifferences = Object.keys(differences).filter(key =>
        differences[key].old || differences[key].new
    ).reduce((acc, key) => {
        acc[key] = differences[key];
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

    return (<>
        <h5 className='text-center'>{transformString(module)}</h5>
        <div className="comparison-container">
           { type != "created" && <div className="section old-section">
                <h5>Previous Changes</h5>
                {Object.keys(filteredDifferences).length === 0 ? (
                    <p>No differences found.</p>
                ) : (
                    Object.keys(filteredDifferences).map(key => (
                        <div key={key} className="data-row">
                            <strong>{key}:</strong> {truncateText(filteredDifferences[key].old, 50)}
                        </div>
                    ))
                )}
            </div>}
            <div className="separator"></div>
            <div className="section new-section">
                <h5>New Changes</h5>
                {Object.keys(filteredDifferences).length === 0 ? (
                    <p>No differences found.</p>
                ) : (
                    Object.keys(filteredDifferences).map(key => (
                        <div key={key} className="data-row">
                            <strong>{key}:</strong> {truncateText(filteredDifferences[key].new, 50)}
                        </div>
                    ))
                )}
            </div>
        </div>
    </>
    );
};

export default DataComparison;