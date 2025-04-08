import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  fetchWastePlantById,
  updateWastePlant,
} from "../../redux/slices/superAdmin/superAdminWastePlantSlice";
import { Spin } from "antd";
import { useWastePlantValidation } from "../../hooks/useWastePlantValidation";
import {
  PartialWastePlantFormData,
  ValidationErrors,
} from "../../types/wastePlantTypes";
import { toast } from "react-toastify";

const EditWastePlant = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { errors, validateField, setErrors } = useWastePlantValidation();

  const { wastePlant, loading } = useSelector(
    (state: RootState) => state.superAdminWastePlant
  );
  const [formData, setFormData] = useState<PartialWastePlantFormData>({});

  useEffect(() => {
    if (id) dispatch(fetchWastePlantById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (wastePlant) {
      // setFormData(wastePlant);
      setFormData({
        ...wastePlant,
        licenseDocument: undefined, 
      });
    }
  }, [wastePlant]);

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        if (!wastePlant?.licenseDocumentPath && !(value instanceof File)) {
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
      if (key !== "licenseDocument" && value !== undefined && value !== null) {
        formDataToSend.append(key, value.toString());
      }
    });
    if (formData.licenseDocument instanceof File) {
      formDataToSend.append("licenseDocument", formData.licenseDocument);
    }
    try {
      if (!id) {
        toast.error("Invalid waste plant ID.");
        return;
      }
      const result = await dispatch(
        updateWastePlant({ id, data: formDataToSend })
      );
      if (result.payload?.error) {
        toast.error(result.payload.error);
        return;
      }
      toast.success("Waste Plant updated successfully!");
      setTimeout(() => {
        navigate("/super-admin/waste-plants");
      }, 2000);
    } catch (error: any) {
      toast.error("Waste Plant updation failed. Please try again.");
    }
  };

  if (loading) return <Spin size="large" />;
  if (!formData) return <p>No data found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit Waste Plant</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Plant Name</label>
          <input
            type="text"
            name="plantName"
            value={formData.plantName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded"
          />
          {errors.plantName && (
            <p className="text-red-500 text-sm">{errors.plantName}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Owner Name</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded"
          />
          {errors.ownerName && (
            <p className="text-red-500 text-sm">{errors.ownerName}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded"
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-gray-700">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded"
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Contact Person</label>
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onBlur={handleBlur}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.contactInfo && (
            <p className="text-red-500 text-sm">{errors.contactInfo}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Contact No</label>
          <input
            type="text"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded"
          />
          {errors.contactNo && (
            <p className="text-red-500 text-sm">{errors.contactNo}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded"
          />
          {errors.licenseNumber && (
            <p className="text-red-500 text-sm">{errors.licenseNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded"
          />
          {errors.capacity && (
            <p className="text-red-500 text-sm">{errors.capacity}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Subscription Plan</label>
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

        <div>
          <label className="block text-gray-700">License Document</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            onChange={handleFileChange}
            onBlur={handleBlur}
          />
          {wastePlant.licenseDocumentPath && (
            <a
              href={`/${wastePlant.licenseDocumentPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm"
            >
              View current document
            </a>
          )}
          {errors.subscriptionPlan && (
            <p className="text-red-500 text-sm">{errors.subscriptionPlan}</p>
          )}
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Update Waste Plant
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditWastePlant;
