import React from 'react';
import { Modal } from 'react-bootstrap';

const ApprovalRequirementsModal = ({ 
  show, 
  onHide, 
  missingRequirements = [], 
  onEditProfile 
}) => {
  const requirementDescriptions = {
    'Name': 'Your full name is required for account verification',
    'Address': 'A valid address is needed for business verification',
    'Timezone': 'Please select your timezone for proper scheduling',
    'Currency': 'At least one currency must be selected for payments',
    'Property Type': 'Select the social media platforms you work with',
    'Category': 'Choose the categories that match your business focus'
  };

  const requirementIcons = {
    'Name': 'person',
    'Address': 'location_on',
    'Timezone': 'schedule',
    'Currency': 'attach_money',
    'Property Type': 'social_media',
    'Category': 'category'
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      className="shadowboxmodal approval-requirements-modal"
      centered
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <div className="d-flex align-items-center gap-3">
          <div className="approval-icon-wrapper">
            <i className="material-icons text-warning" style={{ fontSize: '32px' }}>
              info
            </i>
          </div>
          <div>
            <h4 className="modal-title mb-1">Complete Your Profile</h4>
            <p className="text-muted mb-0 small">
              To request admin approval, please complete the following requirements
            </p>
          </div>
        </div>
      </Modal.Header>
      
      <Modal.Body className="pt-3">
        <div className="requirements-container">
          <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
            <i className="material-icons me-3">warning</i>
            <div>
              <strong>Profile Incomplete</strong>
              <br />
              <small>
                You need to complete {missingRequirements.length} more field{missingRequirements.length !== 1 ? 's' : ''} 
                before your profile can be submitted for admin approval.
              </small>
            </div>
          </div>

          <div className="missing-requirements">
            <h6 className="requirements-header mb-3">
              <i className="material-icons me-2">checklist</i>
              Missing Requirements ({missingRequirements.length})
            </h6>
            
            {missingRequirements.map((requirement, index) => (
              <div key={requirement} className="requirement-item mb-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="requirement-icon">
                    <i className="material-icons text-danger">
                      {requirementIcons[requirement] || 'error'}
                    </i>
                  </div>
                  <div className="requirement-content flex-grow-1">
                    <h6 className="requirement-title mb-1">{requirement}</h6>
                    <p className="requirement-description text-muted mb-0 small">
                      {requirementDescriptions[requirement] || `Please provide your ${requirement.toLowerCase()}`}
                    </p>
                  </div>
                  <div className="requirement-status">
                    <span className="badge bg-danger text-white small">Missing</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="approval-info mt-4 p-3 bg-light rounded">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="material-icons text-info" style={{ fontSize: '20px' }}>
                lightbulb
              </i>
              <strong className="text-info">What happens after completion?</strong>
            </div>
            <ul className="mb-0 small text-muted ps-4">
              <li>Your profile will be marked as "Ready for Review"</li>
              <li>An admin will review your information within 2-3 business days</li>
              <li>You'll receive an email notification once approved</li>
              <li>Full platform access will be granted upon approval</li>
            </ul>
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer className="border-0 pt-0">
        <div className="w-100 d-flex gap-3">
          <button 
            type="button" 
            className="btn btn-outline-secondary flex-fill"
            onClick={onHide}
          >
            Close
          </button>
          <button 
            type="button" 
            className="btn btn-primary flex-fill"
            onClick={() => {
              onHide();
              if (onEditProfile) onEditProfile();
            }}
          >
            <i className="material-icons me-2" style={{ fontSize: '18px' }}>edit</i>
            Complete Profile
          </button>
        </div>
      </Modal.Footer>

      <style jsx>{`
        .approval-requirements-modal .modal-dialog {
          max-width: 600px;
        }
        
        .approval-icon-wrapper {
          width: 48px;
          height: 48px;
          background: rgba(255, 193, 7, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .requirements-container {
          max-height: 70vh;
          overflow-y: auto;
        }
        
        .requirements-header {
          color: #495057;
          font-weight: 600;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 8px;
        }
        
        .requirement-item {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 16px;
          background: #fff;
          transition: all 0.2s ease;
        }
        
        .requirement-item:hover {
          border-color: #dee2e6;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .requirement-icon {
          width: 32px;
          height: 32px;
          background: rgba(220, 53, 69, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .requirement-title {
          color: #212529;
          font-weight: 600;
          margin: 0;
        }
        
        .requirement-description {
          line-height: 1.4;
        }
        
        .badge {
          font-size: 0.75rem;
          padding: 4px 8px;
        }
        
        .bg-danger {
          background-color: #dc3545 !important;
        }
        
        .text-white {
          color: #fff !important;
        }
        
        .bg-light {
          background-color: #f8f9fa !important;
        }
        
        .text-info {
          color: #0dcaf0 !important;
        }
        
        .ps-4 {
          padding-left: 1.5rem;
        }
        
        .me-2 {
          margin-right: 0.5rem;
        }
        
        .me-3 {
          margin-right: 1rem;
        }
      `}</style>
    </Modal>
  );
};

export default ApprovalRequirementsModal;