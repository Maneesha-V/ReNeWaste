import { useState } from "react";
import { AddModalProps } from "../../types/common/modalTypes";
import { toast } from "react-toastify";

const AddMoneyModal = ({ isOpen, onClose, onSubmit }: AddModalProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    const value = Number(amount);
    if (!value || isNaN(value) || value <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!description.trim()) {
      toast.error("Please add a description");
      return;
    }
     onSubmit({
      amount: value,
      description,
      type: "Credit",
    });
  };

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white  border border-green-400 p-6 rounded-2xl w-11/12 max-w-md shadow-2xl transform transition-all">
        <h2 className="text-xl font-bold text-green-700 mb-4 text-center">
          💰 Add Money to Wallet
        </h2>

 <div className="space-y-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full border border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none p-3 rounded-lg"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description (e.g. Salary, Refund)"
            className="w-full border border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none p-3 rounded-lg resize-none"
            rows={3}
          />

          {/* type shown as read-only */}
          <input
            type="text"
            value="Credit"
            disabled
            className="w-full border p-3 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
          >
            Add Money
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMoneyModal;

