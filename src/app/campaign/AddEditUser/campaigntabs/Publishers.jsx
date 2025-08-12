import { useState } from "react";

export default function PublisherPolicyForm({formPublisherData, setFormPublisherData,formPublisherFields}) {

  const handleValueChange = (field, value) => {
    setFormPublisherData({
      ...formPublisherData,
      [field]: { ...formPublisherData[field], value },
    });
  };

  const handleInfoChange = (field, value) => {
    setFormPublisherData({
      ...formPublisherData,
      [field]: { ...formPublisherData[field], additionalInfo: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formPublisherData);
  };

  return (
    <div className="row">
      <div className="col-12">
        <form onSubmit={handleSubmit}>
          {formPublisherFields.map((field) => (
            <div key={field} className="mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="row align-items-center">
                    {/* Field Label */}
                    <div className="col-lg-4 col-md-12 mb-2 mb-lg-0">
                      <p className="mb-0 fw-medium small">{field}</p>
                    </div>

                    {/* Yes/No Radio Buttons */}
                    <div className="col-lg-4 col-md-6 mb-2 mb-lg-0">
                      <div className="d-flex gap-5 justify-content-center justify-content-sm-start">
                        <div className="form-check pl-4">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`${field}-option`}
                            id={`${field}-yes`}
                            value="Yes"
                            checked={formPublisherData[field].value === "Yes"}
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
                            checked={formPublisherData[field].value === "No"}
                            onChange={() => handleValueChange(field, "No")}
                          />
                          <label className="form-check-label small" htmlFor={`${field}-no`}>
                            No
                          </label>
                        </div>
                      </div>
                    </div>


                    {/* Additional Info Textarea */}
                    <div className="col-lg-4 col-md-6">
                      <textarea
                        className="form-control rounded-2 form-control-sm"
                        placeholder="Click to edit"
                        value={formPublisherData[field].additionalInfo}
                        onChange={(e) => handleInfoChange(field, e.target.value)}
                        rows={3} // You can adjust the number of rows as needed
                      />
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
  );
}