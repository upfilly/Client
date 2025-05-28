import { useState } from "react";

const formFields = [
  "Cashback",
  "Community",
  "Content",
  "Coupon Code",
  "E-mail",
  "Loyalty",
  "Search",
  "Behavioural Retargeting",
  "Media Brokers",
  "Are there any other restrictions that publishers need to consider?",
];

export default function PublisherPolicyForm() {
  const [formData, setFormData] = useState(
    formFields.reduce((acc, field) => {
      acc[field] = { value: "Yes", additionalInfo: "" };
      return acc;
    }, {})
  );

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
    // Save logic here (e.g., API call)
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
     
      <form  className="space-y-4">
        {formFields.map((field) => (
          <div
            key={field}
            className="border rounded-xl p-4 shadow-sm w-full overflow-x-auto"
          >
            <div className="flex  gap-6 ">
              {/* Field Label */}
              <div className="w-[200px] shrink-0">
                <p className="text-sm font-medium">{field}</p>
              </div>
  
              {/* Yes/No Radio Buttons */}
              <div className="flex gap-4 w-[200px] overflow:hidden">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`${field}-option`}
                    value="Yes"
                    checked={formData[field].value === "Yes"}
                    onChange={() => handleValueChange(field, "Yes")}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`${field}-option`}
                    value="No"
                    checked={formData[field].value === "No"}
                    onChange={() => handleValueChange(field, "No")}
                  />
                  No
                </label>
              </div>
  
              {/* Textarea */}
              <div className=" min-w-[300px]">
                <input
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="Click to edit"
                  value={formData[field].additionalInfo}
                  onChange={(e) => handleInfoChange(field, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
  
}