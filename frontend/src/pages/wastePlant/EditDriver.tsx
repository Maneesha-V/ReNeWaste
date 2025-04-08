import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { toast } from "react-toastify";
import {
  PartialDriverFormData,
  ValidationErrors,
} from "../../types/driverTypes";
import { useWastePlantValidation } from "../../hooks/useWastePlantValidation";
import { fetchDriverById, updateDriver } from "../../redux/slices/wastePlant/wastePlantDriverSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const EditDriver = () => {
  const { driverId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { errors, validateField, setErrors } = useWastePlantValidation();

  const { driver, loading } = useSelector(
    (state: RootState) => state.wastePlantDriver
  );
  const [formData, setFormData] = useState<PartialDriverFormData>({});

  useEffect(() => {
    if (driverId) {
      dispatch(fetchDriverById(driverId));
    }
  }, [driverId, dispatch]);

  useEffect(() => {
    if (driver) {
      setFormData({
        ...driver,
        licenseFront: undefined,
        licenseBack: undefined,
      });
    }
  }, [driver]);
 
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        ...(type === "front" ? { licenseFront: file } : { licenseBack: file }),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentErrors: ValidationErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      if (name === "licenseFront" || name === "licenseBack") {
        if (value && !(value instanceof File)) {
          currentErrors[name as keyof ValidationErrors] = "Invalid image.";
        }
      } else if (name === "password" || name === "licenseNumber") {
        return;
      } else {
        const error = validateField(name, value as string);
        if (error) {
          currentErrors[name as keyof ValidationErrors] = error;
        }
      }
    });

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        formDataToSend.append(key, value);
      } else if (value !== undefined && value !== null && value !== "") {
        formDataToSend.append(key, value.toString());
      }
    });

    try {
      if (!driverId) {
        toast.error("Invalid driver ID.");
        return;
      }
      console.log("formDataToSend",formDataToSend);
      const result = await dispatch(   
        updateDriver({ driverId, data: formDataToSend })
      );
      if (result.payload?.error) {
        toast.error(result.payload.error);
        return;
      }
      toast.success("Driver updated successfully!");
      setTimeout(() => navigate("/waste-plant/drivers"), 2000);
    } catch {
      toast.error("Update failed. Please try again.");
    }
  };

  return (
    <div className="px-4 py-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
          Edit Driver
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

          {/* License Number */}
          <div>
            <label className="block text-gray-700 font-medium">
              License Number
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              disabled
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-gray-700 font-medium">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.contact && (
              <p className="text-red-500 text-sm">{errors.contact}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="block text-gray-700 font-medium">
              Experience (years)
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm">{errors.experience}</p>
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
            </select>
          </div>
          {/* License Front */}
          <div>
            <label className="block text-gray-700 font-medium">
              License Front Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "front")}
              onBlur={handleBlur}
              className="w-full"
            />
            {errors.licenseFront && (
              <p className="text-red-500 text-sm">{errors.licenseFront}</p>
            )}
          </div>

          {/* License Back */}
          <div>
            <label className="block text-gray-700 font-medium">
              License Back Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "back")}
              onBlur={handleBlur}
              className="w-full"
            />
            {errors.licenseBack && (
              <p className="text-red-500 text-sm">{errors.licenseBack}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Update Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDriver;
