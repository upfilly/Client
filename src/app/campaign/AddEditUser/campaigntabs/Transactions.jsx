import { useState } from "react";

const formFields = [
    {
        label:
          "Does the transaction value that commissions are paid on include VAT?Sales Tax?",
        showInput: false,
      },
    {
        label:
          "Does the transaction value that commissions are paid on include Delivery charges?",
        showInput: false,
      },
    {
        label:
          "Does the transaction value that commissions are paid on include Credit card fees ?",
        showInput: false,
      },
  {
    label:
      "Does the transaction value that commissions are paid on include gift wrapping or other service charges?",
    showInput: false,
  },
  {
    label:
      "Are commissions not paid out on some products or product categories?",
    showInput: false,
  },
  { label: "Order canceled", showInput: true },
  { label: "Item was returned", showInput: true },
  { label: "Customer failed credit check", showInput: true },
  { label: "Breach of program terms", showInput: true },
  { label: "Duplicate order", showInput: true },
  { label: "Item was out of stock", showInput: true },
  { label: "Other", showInput: true },
];

export default function Transactions() {
  const [formData, setFormData] = useState(
    formFields.reduce((acc, field) => {
      acc[field.label] = { value: "Yes", additionalInfo: "" };
      return acc;
    }, {})
  );

  const handleValueChange = (label, value) => {
    setFormData((prev) => ({
      ...prev,
      [label]: { ...prev[label], value },
    }));
  };

  const handleInfoChange = (label, value) => {
    setFormData((prev) => ({
      ...prev,
      [label]: { ...prev[label], additionalInfo: value },
    }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    alert("Form submitted! Check console for data.");
    // Add save logic here
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      
      <div className="space-y-4">
        {formFields.map(({ label, showInput }) => (
          <div key={label}>
            <div className="border rounded-xl p-4 shadow-sm w-full overflow-x-auto">
              <div className="flex gap-6">
                {/* Field Label */}
                <div className="w-[400px] shrink-0">
                  <p className="text-sm font-medium">{label}</p>
                </div>

                {/* Yes/No Radio Buttons */}
                <div className="flex gap-4 w-[200px] overflow-hidden">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`${label}-option`}
                      value="Yes"
                      checked={formData[label].value === "Yes"}
                      onChange={() => handleValueChange(label, "Yes")}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`${label}-option`}
                      value="No"
                      checked={formData[label].value === "No"}
                      onChange={() => handleValueChange(label, "No")}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>

                {/* Conditional Input */}
                {showInput && (
                  <div className="min-w-[300px]">
                    <input
                      className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Click to edit"
                      value={formData[label].additionalInfo}
                      onChange={(e) =>
                        handleInfoChange(label, e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save
        </button>
      </div>
    </div>
  );
}
