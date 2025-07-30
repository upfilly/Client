import { useState } from "react";

export default function Ppc({setFormPpcData,formPpcData,formPpcFields}) {

  const handleValueChange = (label, value) => {
    setFormPpcData((prev) => ({
      ...prev,
      [label]: { ...prev[label], value },
    }));
  };

  const handleInfoChange = (label, value) => {
    setFormPpcData((prev) => ({
      ...prev,
      [label]: { ...prev[label], additionalInfo: value },
    }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formPpcData);
    // Add save logic here
  };

  return (
    <div className="row">
      <div className="col-12">
        {formPpcFields.map(({ label, showInput }) => (
          <div key={label} className="mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  {/* Field Label */}
                  <div className="col-lg-6 col-md-12 mb-2 mb-lg-0">
                    <p className="mb-0 fw-medium small">{label}</p>
                  </div>

                  {/* Yes/No Radio Buttons */}
                  <div className="col-lg-3 col-md-6 mb-2 mb-lg-0">
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`${label}-option`}
                          id={`${label}-yes`}
                          value="Yes"
                          checked={formPpcData[label].value === "Yes"}
                          onChange={() => handleValueChange(label, "Yes")}
                        />
                        <label className="form-check-label small" htmlFor={`${label}-yes`}>
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`${label}-option`}
                          id={`${label}-no`}
                          value="No"
                          checked={formPpcData[label].value === "No"}
                          onChange={() => handleValueChange(label, "No")}
                        />
                        <label className="form-check-label small" htmlFor={`${label}-no`}>
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                 

                  {/* Conditional Textarea */}
                  {showInput && (
                    <div className="col-lg-3 col-md-6">
                      <textarea
                        className="form-control rounded-2 form-control-sm"
                        placeholder="Click to edit"
                        value={formPpcData[label].additionalInfo}
                        onChange={(e) => handleInfoChange(label, e.target.value)}
                        rows={3} // You can adjust the number of rows as needed
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* <div className="mt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary w-100 py-2"
          >
            Save
          </button>
        </div> */}
      </div>
    </div>
  );
}