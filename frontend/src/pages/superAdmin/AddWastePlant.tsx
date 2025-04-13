import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addWastePlant } from "../../redux/slices/superAdmin/superAdminWastePlantSlice";
import { useAppDispatch } from "../../redux/hooks";
import { useWastePlantValidation } from "../../hooks/useWastePlantValidation";
import {
  ValidationErrors,
  WastePlantFormData,
} from "../../types/wastePlantTypes";

const AddWastePlant = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { errors, validateField, setErrors } = useWastePlantValidation();

  const [formData, setFormData] = useState<WastePlantFormData>({
    plantName: "",
    ownerName: "",
    location: "",
    district: "Malappuram",
    taluk: "",
    pincode: "",
    state: "Kerala",
    contactInfo: "",
    contactNo: "",
    email: "",
    licenseNumber: "",
    capacity: 0,
    status: "Pending",
    subscriptionPlan: "",
    password: "",
    licenseDocument: undefined,
    services: [],
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
  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const updatedServices = checked
      ? [...formData.services, value]
      : formData.services.filter((service) => service !== value);

    setFormData((prev) => ({ ...prev, services: updatedServices }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }
      setFormData({ ...formData, licenseDocument: file });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentErrors: ValidationErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      if (name === "licenseDocument") {
        if (!(value instanceof File)) {
          currentErrors[name] = "License Document is required.";
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
      if (
        key !== "licenseDocument" &&
        key !== "services" &&
        value !== undefined &&
        value !== null
      ) {
        formDataToSend.append(key, value.toString());
      }
    });
    if (formData.licenseDocument instanceof File) {
      formDataToSend.append("licenseDocument", formData.licenseDocument);
    }
    formData.services.forEach((service) => {
      formDataToSend.append("services", service);
    });

    try {
      const result = await dispatch(addWastePlant(formDataToSend));
      if (result.payload?.error) {
        toast.error(result.payload.error);
        return;
      }
      toast.success("Waste Plant added successfully!");
      setTimeout(() => {
        navigate("/super-admin/waste-plants");
      }, 2000);
    } catch (error: any) {
      toast.error("Waste Plant creation failed. Please try again.");
    }
  };

  return (
    <div className="px-4 py-4">
      {/* <Breadcrumbs
        paths={[
          { label: "Waste Plants", path: "/super-admin/waste-plants" },
          { label: "Add Waste Plant" },
        ]}
      /> */}
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
          Add Waste Plant
        </h2>
        {/* {error && <p className="text-red-500 text-center mb-4">{error}</p>} */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Plant Name */}
          <div>
            <label className="block text-gray-700 font-medium">
              Plant Name
            </label>
            <input
              type="text"
              name="plantName"
              value={formData.plantName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.plantName && (
              <p className="text-red-500 text-sm">{errors.plantName}</p>
            )}
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-gray-700 font-medium">
              Owner Name
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.ownerName && (
              <p className="text-red-500 text-sm">{errors.ownerName}</p>
            )}
          </div>
          {/* Location Address */}
          <div>
            <label className="block text-gray-700 font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-gray-700 font-medium">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm">{errors.pincode}</p>
            )}
          </div>

          {/* District */}
          <div>
            <label className="block text-gray-700 font-medium">District</label>
            <input
              type="text"
              name="district"
              value="Malappuram"
              readOnly
              className="w-full border px-3 py-2 rounded-md bg-gray-100 text-gray-600"
            />
          </div>
          {/* Taluk */}
          <div>
            <label className="block text-gray-700 font-medium">Taluk</label>
            <select
              name="taluk"
              value={formData.taluk}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Taluk</option>
              <option value="Tirur">Tirur</option>
              <option value="Perinthalmanna">Perinthalmanna</option>
              <option value="Ponnani">Ponnani</option>
              <option value="Kondotty">Kondotty</option>
              <option value="Tirurangadi">Tirurangadi</option>
              <option value="Nilambur">Nilambur</option>
              <option value="Eranad">Eranad</option>
            </select>
            {errors.taluk && (
              <p className="text-red-500 text-sm">{errors.taluk}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-gray-700 font-medium">State</label>
            <input
              type="text"
              name="state"
              value="Kerala"
              readOnly
              className="w-full border px-3 py-2 rounded-md bg-gray-100 text-gray-600"
            />
          </div>
          {/*Contact No */}
          <div>
            <label className="block text-gray-700 font-medium">
              Contact No
            </label>
            <input
              type="tel"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.contactNo && (
              <p className="text-red-500 text-sm">{errors.contactNo}</p>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-gray-700 font-medium">
              Contact Person Name
            </label>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.contactInfo && (
              <p className="text-red-500 text-sm">{errors.contactInfo}</p>
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

          {/* License Document Upload */}
          <div>
            <label className="block text-gray-700 font-medium">
              Upload License Document
            </label>
            <input
              type="file"
              name="licenseDocument"
              onChange={handleFileChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            />
            {errors.licenseDocument && (
              <p className="text-red-500 text-sm">{errors.licenseDocument}</p>
            )}
          </div>
          {/* Services  */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">
              Services Provided
            </label>
            <div className="flex flex-wrap gap-4">
              {[
                "Building Waste",
                "Medical Waste",
                "E-Waste",
                "Plastic Waste",
                "Residential Waste",
              ].map((service) => (
                <label key={service} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="services"
                    value={service}
                    checked={formData.services.includes(service)}
                    onChange={handleServiceChange}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
            {errors.services && (
              <p className="text-red-500 text-sm">{errors.services}</p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-gray-700 font-medium">
              Capacity (Tons/Day)
            </label>
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

          {/* Status */}
          <div>
            <label className="block text-gray-700 font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
              disabled
            >
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          {/* Subscription Plan */}
          <div>
            <label className="block text-gray-700 font-medium">
              Subscription Plan
            </label>
            <select
              name="subscriptionPlan"
              value={formData.subscriptionPlan}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Plan</option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Pro">Pro</option>
            </select>
            {errors.subscriptionPlan && (
              <p className="text-red-500 text-sm">{errors.subscriptionPlan}</p>
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

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all"
            >
              Add Waste Plant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWastePlant;
