import { useState } from "react";



export default function Transactions({formTransactionData, setFormTransactionData,formTransactionFields}) {

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
      <h3 className="font-bold text-gray-800 mb-3">Transaction Settings</h3>

      <div className="space-y-4">
        {formTransactionFields.map(({ label, showInput }) => (
          <div key={label} className="border rounded-lg p-4 bg-white shadow-sm mb-3">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Field Label */}
              <div className="md:w-1/2">
                <p className="text-sm font-medium text-gray-700">{label}</p>
              </div>

              {/* Yes/No Radio Buttons */}
              <div className="flex gap-4 md:w-1/4">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name={`${label}-option`}
                    value="Yes"
                    checked={formTransactionData[label].value === "Yes"}
                    onChange={() => handleValueChange(label, "Yes")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name={`${label}-option`}
                    value="No"
                    checked={formTransactionData[label].value === "No"}
                    onChange={() => handleValueChange(label, "No")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 ml-2"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>

              {/* Conditional Textarea */}
              {showInput && (
                <div className="md:w-1/4">
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-2 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional information"
                    value={formTransactionData[label].additionalInfo}
                    onChange={(e) => handleInfoChange(label, e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}