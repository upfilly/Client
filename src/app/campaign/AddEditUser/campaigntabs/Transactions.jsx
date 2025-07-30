import { useState } from "react";



export default function Transactions({ formTransactionData, setFormTransactionData, formTransactionFields }) {

  const handleValueChange = (label, value) => {
    setFormTransactionData((prev) => ({
      ...prev,
      [label]: { ...prev[label], value },
    }));
  };

  const handleInfoChange = (label, value) => {
    setFormTransactionData((prev) => ({
      ...prev,
      [label]: { ...prev[label], additionalInfo: value },
    }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formTransactionData);
    alert("Form submitted! Check console for data.");
    // Add save logic here
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h3 className="font-bold transaction-heading mb-3">Transaction Settings</h3>

      <div className="space-y-4">
        {formTransactionFields.map(({ label, showInput }) => (
          <div key={label} className="card mb-3">
            <div className="card-body p-3">
              <div className="row align-items-center g-3">
                {/* Field Label */}
                <div className="col-md-3">
                  <label className="form-label mb-0 fw-medium text-muted">{label}</label>
                </div>

                {/* Yes/No Radio Buttons */}
                <div className="col-md-3">
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        type="radio"
                        id={`${label}-yes`}
                        name={`${label}-option`}
                        value="Yes"
                        checked={formTransactionData[label].value === "Yes"}
                        onChange={() => handleValueChange(label, "Yes")}
                        className="form-check-input"
                      />
                      <label htmlFor={`${label}-yes`} className="form-check-label">Yes</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id={`${label}-no`}
                        name={`${label}-option`}
                        value="No"
                        checked={formTransactionData[label].value === "No"}
                        onChange={() => handleValueChange(label, "No")}
                        className="form-check-input"
                      />
                      <label htmlFor={`${label}-no`} className="form-check-label">No</label>
                    </div>
                  </div>
                </div>

                {/* Conditional Textarea */}
                {showInput && (
                  <div className="col-md-6">
                    <textarea
                      rows={3}
                      className="form-control rounded-2 form-control-sm"
                      placeholder="Additional information"
                      value={formTransactionData[label].additionalInfo}
                      onChange={(e) => handleInfoChange(label, e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}