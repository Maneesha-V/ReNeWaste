import {  useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  addWastePlant,
  fetchAddWastePlant,
  fetchPostOffices,
} from "../../redux/slices/superAdmin/superAdminWastePlantSlice";
import { useAppDispatch } from "../../redux/hooks";
import { useWastePlantValidation } from "../../hooks/useWastePlantValidation";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { PostOffice, WastePlantFormData } from "../../types/wasteplant/wastePlantTypes";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import { SubsptnPlans } from "../../types/subscription/subscriptionTypes";
import { ValidationErrors } from "../../types/common/commonTypes";

const AddWastePlant = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { errors, validateField, setErrors } = useWastePlantValidation();
  const { subscriptionPlans } = useSelector(
    (state: RootState) => state.superAdminWastePlant
  );
  console.log("subscriptionPlans", subscriptionPlans);
  useEffect(() => {
    dispatch(fetchAddWastePlant());
  }, [dispatch]);
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
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "pincode" && value.length === 6) {
      try {
        const res = await dispatch(fetchPostOffices(value)).unwrap();
        setPostOffices(res);
      } catch (error) {
        const msg = getAxiosErrorMessage(error);
        toast.error(msg);
        setPostOffices([]);
        setFormData((prev) => ({ ...prev, location: "", taluk: "" }));
      }
    }
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
      console.log("file",file);
      
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
    if (formData.pincode.length === 6 && postOffices.length === 0) {
      currentErrors.pincode =
        "Please enter a valid Malappuram district PIN code.";
    }
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
     
      const result = await dispatch(addWastePlant(formDataToSend)).unwrap();
      console.log("result",result);
      
      toast.success(result?.message);
      setTimeout(() => {
        navigate("/super-admin/waste-plants");
      }, 2000);
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      toast.error(msg);
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
            <label className="block text-gray-700 font-medium" htmlFor="plantName">
              Plant Name
            </label>
            <input
              type="text"
              id="plantName"
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
            <label className="block text-gray-700 font-medium" htmlFor="ownerName">
              Owner Name
            </label>
            <input
              id="ownerName"
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

          {/* Pincode */}
          <div>
            <label className="block text-gray-700 font-medium" htmlFor="pincode">Pincode</label>
            <input
              id="pincode"
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

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium" htmlFor="location">Location</label>
            {postOffices.length > 0 ? (
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={(e) => {
                  const selectedLocation = postOffices.find(
                    (po) => po.name === e.target.value
                  );
                  setFormData({
                    ...formData,
                    location: selectedLocation?.name || "",
                    taluk: selectedLocation?.taluk || "",
                  });
                }}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Location</option>
                {postOffices.map((po, i) => (
                  <option key={i} value={po.name}>
                    {po.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
              />
            )}
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

          {/* Taluk */}
          <div>
            <label className="block text-gray-700 font-medium" htmlFor="taluk">Taluk</label>
            <select
              id="taluk"
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

          {/* District */}
          <div>
            <label className="block text-gray-700 font-medium" htmlFor="district">District</label>
            <input
              id="district"
              type="text"
              name="district"
              value="Malappuram"
              readOnly
              className="w-full border px-3 py-2 rounded-md bg-gray-100 text-gray-600"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-gray-700 font-medium" htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              name="state"
              value="Kerala"
              readOnly
              className="w-full border px-3 py-2 rounded-md bg-gray-100 text-gray-600"
            />
          </div>
          {/*Contact No */}
          <div>
            <label className="block text-gray-700 font-medium" htmlFor="contactNo">
              Contact No
            </label>
            <input
              id="contactNo"
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
            <label className="block text-gray-700 font-medium" htmlFor="contactInfo">
              Contact Person Name
            </label>
            <input
              id="contactInfo"
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
            <label className="block text-gray-700 font-medium" htmlFor="email">Email</label>
            <input
              id="email"
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
            <label className="block text-gray-700 font-medium" htmlFor="licenseNumber">
              License Number
            </label>
            <input
              id="licenseNumber"
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
            <label className="block text-gray-700 font-medium" htmlFor="licenseDocument">
              Upload License Document
            </label>
            <input
              id="licenseDocument"
              type="file"
              accept=".pdf"
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
             <span className="block text-gray-700 font-medium mb-1">
    Services Provided
  </span>
            <div className="flex flex-wrap gap-4">
              {[
                "Building Waste",
                "Medical Waste",
                "E-Waste",
                "Plastic Waste",
                "Food Waste",
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
            <label className="block text-gray-700 font-medium" htmlFor="capacity">
              Capacity (Kg/Day)
            </label>
            <input
              id="capacity"
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
            <label className="block text-gray-700 font-medium" htmlFor="status">Status</label>
            <select
              id="status"
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
            <label className="block text-gray-700 font-medium" htmlFor="subscriptionPlan">
              Subscription Plan
            </label>
            <select
              id="subscriptionPlan"
              name="subscriptionPlan"
              value={formData.subscriptionPlan}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Plan</option>
              {subscriptionPlans.map((plan: SubsptnPlans) => (
                <option key={plan._id} value={plan.planName}>
                  {plan.planName}
                </option>
              ))}
            </select>
            {errors.subscriptionPlan && (
              <p className="text-red-500 text-sm">{errors.subscriptionPlan}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium" htmlFor="password">Password</label>
            <input
              id="password"
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
