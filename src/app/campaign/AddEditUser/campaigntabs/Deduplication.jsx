import { useState } from "react";

export default function Deduplication({formData, setFormData,formFields}) {

  const handleValueChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: { ...formData[field], value },
    });
  };

  const handleInfoChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: { ...formData[field], additionalInfo: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    // <div className="container-fluid">
    <div className="row">
      <div className="col-12">
        <form onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div key={field} className="mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="row align-items-center">
                    {/* Field Label */}
                    <div className="col-lg-6 col-md-12 mb-2 mb-lg-0">
                      <p className="mb-0 fw-medium small">{field}</p>
                    </div>

                     

                    {/* Yes/No Radio Buttons */}
                    <div className="col-lg-6 col-md-12">
                      <div className="d-flex gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`${field}-option`}
                            id={`${field}-yes`}
                            value="Yes"
                            checked={formData[field].value === "Yes"}
                            onChange={() => handleValueChange(field, "Yes")}
                          />
                          <label className="form-check-label small" htmlFor={`${field}-yes`}>
                            Yes
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`${field}-option`}
                            id={`${field}-no`}
                            value="No"
                            checked={formData[field].value === "No"}
                            onChange={() => handleValueChange(field, "No")}
                          />
                          <label className="form-check-label small" htmlFor={`${field}-no`}>
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* <div className="mt-4">
              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
              >
                Save
              </button>
            </div> */}
        </form>
      </div>
    </div>
    // </div>
  );
}