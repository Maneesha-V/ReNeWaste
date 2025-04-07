import React, { useState } from "react";
import { DriverFormData, ValidationErrors } from "../../types/driverTypes";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useWastePlantValidation } from "../../hooks/useWastePlantValidation";
import { addDriver } from "../../redux/slices/wastePlant/wastePlantDriverSlice";

const AddDriver = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { errors, validateField, setErrors } = useWastePlantValidation();
  //   const { loading, error } = useSelector((state: any) => state.user);
  const [formData, setFormData] = useState<DriverFormData>({
    name: "",
    contact: "",
    email: "",
    licenseNumber: "",
    experience: 0,
    status: "Active",
    password: "",
    licenseFront: undefined,
    licenseBack: undefined,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }

      if(type==="front"){
        setFormData((prev)=>({ ...prev, licenseFront: file}))
      } else{
        setFormData((prev) => ({ ...prev, licenseBack: file }));
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentErrors: ValidationErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      if (name === "licenseFront" || name === "licenseBack") {
        if (!(value instanceof File)) {
          currentErrors[name as keyof ValidationErrors] = "This image is required.";
        }
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
        } else if (value !== undefined && value !== null) {
          formDataToSend.append(key, value.toString());
        }
      });
    try {
      const result = await dispatch(addDriver(formDataToSend));
      if (result.payload?.error) {
        toast.error(result.payload.error);
        return;
      }
      toast.success("Add driver successfully!");
      setTimeout(() => {
        navigate("/waste-plant/drivers");
      }, 2000);
    } catch (error: any) {
      toast.error("Driver creation failed. Please try again.");
    }
  };

  return (
    <div className="px-4 py-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
          Add Driver
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
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.licenseNumber && (
              <p className="text-red-500 text-sm">{errors.licenseNumber}</p>
            )}
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
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
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

export default AddDriver;
