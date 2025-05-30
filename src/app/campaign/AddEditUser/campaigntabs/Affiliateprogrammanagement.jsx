import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PublisherPolicyForm from './Publishers';
import Deduplication from './Deduplication';
import Transactions from './Transactions';
import Ppc from './Ppc';
import Terms from './Terms';

const AffiliateProgramManagement = ({ onAcceptTerms }) => {
  const tabsData = [
    { 
      id: 'legal-terms', 
      title: 'Legal Terms', 
      content: <Terms onAcceptTerms={onAcceptTerms} /> 
    },
    { 
      id: 'publishers', 
      title: 'Publishers', 
      content: <PublisherPolicyForm /> 
    },
    { 
      id: 'deduplication', 
      title: 'Deduplication', 
      content: <Deduplication /> 
    },
    { 
      id: 'transactions', 
      title: 'Transactions', 
      content: <Transactions /> 
    },
    { 
      id: 'ppc', 
      title: 'PPC', 
      content: <Ppc /> 
    },
  ];
  
  const [activeTab, setActiveTab] = useState(tabsData[0].id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-3">
      <div className="row flex-grow-1">
        <div className="col-12 d-flex flex-column h-100">
          
          {/* Tab Navigation */}
          <ul className="nav nav-tabs flex-shrink-0" id="affiliateTab" role="tablist">
            {tabsData.map((tab) => (
              <li className="nav-item" role="presentation" key={tab.id}>
                <button
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  id={`${tab.id}-tab`}
                  type="button"
                  role="tab"
                  aria-controls={tab.id}
                  aria-selected={activeTab === tab.id}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.title}
                </button>
              </li>
            ))}
          </ul>

          {/* Tab Content */}
          <div 
            className="tab-content border border-top-0 rounded-bottom shadow-sm flex-grow-1 d-flex flex-column" 
            id="affiliateTabContent"
          >
            {tabsData.map((tab) => (<>
              {(activeTab == tab.id) && <div
                key={tab.id}
                className={`tab-pane fade h-100 d-flex flex-column ${
                  activeTab == tab.id ? 'show active' : ''
                }`}
                id={tab.id}
                role="tabpanel"
                aria-labelledby={`${tab.id}-tab`}
              >
               {(activeTab == tab.id) && <div className="p-4 flex-grow-1 overflow-auto">
                  {tab.content}
                </div>}
              </div>}
              </>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};

AffiliateProgramManagement.propTypes = {
  onAcceptTerms: PropTypes.func.isRequired,
};

export default AffiliateProgramManagement;