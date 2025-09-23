import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";
import { extractDateTimeParts } from "../../utils/formatDate";

interface MeasureWasteModalProps {
  vehicleNumber: string;
  driverName: string;
  returnedAt: string;
  onClose: () => void;
  onSave: (weight: number) => void;
}

const MeasureWasteModal: React.FC<MeasureWasteModalProps> = ({
  vehicleNumber,
  driverName,
  returnedAt,
  onClose,
  onSave,
}) => {
  const [weight, setWeight] = useState("");
  const saveLoading = useSelector((state: RootState) => state.wastePlantNotifications.saveLoading);
  const { date, time } = extractDateTimeParts(returnedAt);

  const handleSave = () => {
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight)) {
      toast.error("Please enter a valid weight.");
      return;
    }
    onSave(parsedWeight);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Measure Waste</h2>
        <p>
          <strong>Truck Returned:</strong> {vehicleNumber}
        </p>
        <p>
          <strong>Driver:</strong> {driverName}
        </p>
        <p>
          <strong>Returned At:</strong> {`${date} ${time}`}
        </p>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="weight">
            Enter Weight (kg)
          </label>
          <input
            id="weight"
            type="number"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 1500"
          />
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={saveLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleSave}
          >
            {saveLoading ? "Saving..." : "Save Measurement"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeasureWasteModal;
