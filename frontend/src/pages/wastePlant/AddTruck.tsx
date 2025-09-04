import React, { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useWastePlantValidation } from "../../hooks/useWastePlantValidation";
import { TruckFormData, ValidationErrors } from "../../types/truckTypes";
import { addTruck } from "../../redux/slices/wastePlant/wastePlantTruckSlice";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";

const AddTruck = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { errors, validateField, setErrors } = useWastePlantValidation();
  //   const { loading, error } = useSelector((state: any) => state.user);
  const [formData, setFormData] = useState<TruckFormData>({
    name: "",
    vehicleNumber: "",
    capacity: 0,
    status: "Active",
    tareWeight: 0
  });

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentErrors: ValidationErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value as string);
      if (error) {
        currentErrors[name as keyof ValidationErrors] = error;
      }
    });
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formDataToSend.append(key, value.toString());
      }
    });
    try {
      const result = await dispatch(addTruck(formDataToSend)).unwrap();

      toast.success(result?.message);
      setTimeout(() => {
        navigate("/waste-plant/trucks");
      }, 2000);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <div className="px-4 py-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
          Add Truck
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="block text-gray-700 font-medium">
              Vehicle Number
            </label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.vehicleNumber && (
              <p className="text-red-500 text-sm">{errors.vehicleNumber}</p>
            )}
          </div>
          {/* Capacity */}
          <div>
            <label className="block text-gray-700 font-medium">Capacity (Kg)</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.capacity && (
              <p className="text-red-500 text-sm">{errors.capacity}</p>
            )}
          </div>
             {/* Tare Weight */}
          <div>
            <label className="block text-gray-700 font-medium">Tare Weight (Kg)</label>
            <input
              type="number"
              name="tareWeight"
              value={formData.tareWeight}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.tareWeight && (
              <p className="text-red-500 text-sm">{errors.tareWeight}</p>
            )}
          </div>
          {/* Status */}
          <div>
            <label className="block text-gray-700 font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTruck;
