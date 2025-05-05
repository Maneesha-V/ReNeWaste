import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import { useAppDispatch } from "../../redux/hooks";
import {
  PartialDriverFormData,
  ValidationErrors,
} from "../../types/driverTypes";
import { toast } from "react-toastify";
import { useWastePlantValidation } from "../../hooks/useWastePlantValidation";
import { updateDriverProfile } from "../../redux/slices/driver/profileDriverSlice";

const EditProfileDriver: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { errors, validateField, setErrors } = useWastePlantValidation();

  const { driver } = useSelector((state: RootState) => state.driverProfile);
  const [formData, setFormData] = useState<PartialDriverFormData>({});
  useEffect(() => {
    if (driver) {
      setFormData({
        ...driver,
      });
    }
  }, [driver]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentErrors: ValidationErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      if (name === "email" || name === "licenseNumber") {
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
      if (value !== undefined && value !== null && value !== "") {
        formDataToSend.append(key, value.toString());
      }
    });

    try {
      const result = await dispatch(
        updateDriverProfile({ data: formDataToSend })
      );
      if (result.payload?.error) {
        toast.error(result.payload.error);
        return;
      }
      toast.success("Profile updated successfully!");
      setTimeout(() => navigate("/driver/profile"), 2000);
    } catch {
      toast.error("Update failed. Please try again.");
    }
  };

  return (
    <main className="flex-grow p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <Breadcrumbs
        paths={[
          { label: "Profile", path: "/driver/profile" },
          { label: "Edit Profile" },
        ]}
      />

      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center sm:text-left">
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              disabled
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm">{errors.experience}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.contact && (
              <p className="text-red-500 text-sm">{errors.contact}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfileDriver;
