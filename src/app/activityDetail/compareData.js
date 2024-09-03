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
    <div className='container'>
    <h5 className=' my-4 title_detailss'>{transformString(module)}</h5>
        <div className="comparison-containe">
           { type != "created" && <div className="title_newchanges">
                <h5 className='changes_new' >Previous Changes</h5>
                <div className="row mx-auto">
                {Object.keys(filteredDifferences).length === 0 ? (
                    <p>No differences found.</p>
                ) : (
                 
                    Object.keys(filteredDifferences).map(key => (
                       
                            <div className='col-sm-6 mb-3' key={key} > 
                            <div className='title_key'>{key}:</div> 
                        <div className='key_ans'>
                        {truncateText(filteredDifferences[key].old, 50)}
                        </div>
                            </div>
                           
                        
                    ))
             
                )}
            </div>
            </div>
             }
            {/* <div className="separator"></div> */}

         <div className=' pt-4 pb-5'>
         <div className=''>
            <div className='title_newchanges'>
            <h5 className='changes_new' >New Changes</h5>
            
        
           
           
                <div className="section new-section">
                <div className="row mx-auto">
                {Object.keys(filteredDifferences).length === 0 ? (
                    <p>No differences found.</p>
                ) : (

                    Object.keys(filteredDifferences).map(key => (
                    
                           <div className='col-sm-6 mb-3' key={key} >
                           <div className='title_key' >{key}:</div>
                           <h5 className='key_ans'>
                           {truncateText(filteredDifferences[key].new, 50)}
                           </h5>
                           </div> 
                          
                          
                      
                    )
                )
                )}
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