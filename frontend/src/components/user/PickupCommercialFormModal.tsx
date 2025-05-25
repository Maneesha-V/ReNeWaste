import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useWastePlantValidation } from "../../hooks/useWastePlantValidation";
import { PartialCommPickupReq } from "../../types/pickupTypes";
import { useAppDispatch } from "../../redux/hooks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { updateCommercialPickup } from "../../redux/slices/user/commercialSlice";
import { PickupCommercialFormModalProps } from "../../types/userTypes";

const PickupCommercialFormModal: React.FC<PickupCommercialFormModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  serviceQuery,
  user,
}) => {
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<
    number | "add-new"
  >(0);
  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    district: "",
    location: "",
    pincode: "",
    state: "",
  });
  const [formData, setFormData] = useState<PartialCommPickupReq>({
    phone: "",
    pickupDate: selectedDate ?? undefined,
    pickupTime: "",
    wasteType: "Commercial",
    businessName: "",
    frequency: "",
  });
  const [pickupTimeError, setPickupTimeError] = useState("");
  const { errors, validateField, setErrors } = useWastePlantValidation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isOpen) return;

    if (user?.addresses?.length > 0 && user?.phone) {
      setFormData((prev) => ({
        ...prev,
        phone: user.phone,
        service: serviceQuery
      } as PartialCommPickupReq ));
    }
  }, [isOpen, user?.phone, user?.addresses, serviceQuery]);
  if (!isOpen || !user) return null;

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`;

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };
    const validatePickupTime = (value: string, selectedDateStr?: string): string => {
    if (!value) return "Pickup time is required.";
  
    const [hour, minute] = value.split(":").map(Number);
    const totalMinutes = hour * 60 + minute;
  
    const minTime = 9 * 60; // 9:00 AM
    const maxTime = 18 * 60; // 6:00 PM
  
    if (totalMinutes < minTime || totalMinutes > maxTime) {
      return "Pickup time must be between 9:00 AM and 6:00 PM.";
    }
  
    if (selectedDateStr) {

      const selectDate = new Date(selectedDateStr);
      const today = new Date();
  
      const isToday =
        selectDate.getDate() === today.getDate() &&
        selectDate.getMonth() === today.getMonth() &&
        selectDate.getFullYear() === today.getFullYear();
  
      if (isToday) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        console.log("totalMinutes",totalMinutes);
         console.log("currentMinutes",currentMinutes);
        if (totalMinutes < currentMinutes) {
          return "Pickup time cannot be earlier than the current time.";
        }
      }
    }
  
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
     if (name === "pickupTime") {
      const error = validatePickupTime(value, selectedDate ?? undefined);
      setPickupTimeError(error);
    }
  };
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
     if (name === "pickupTime") {
      const error = validatePickupTime(value, selectedDate ?? undefined);
      setPickupTimeError(error);
    } else {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentErrors: Record<string, string> = {};

    const pickupTimeValidationError = validatePickupTime(
      formData.pickupTime ?? "", selectedDate ?? undefined
    );
    if (pickupTimeValidationError) {
      currentErrors.pickupTime = pickupTimeValidationError;
      setPickupTimeError(pickupTimeValidationError);
      setErrors(currentErrors);
      return;
    }

    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value as string);
      if (error) {
        currentErrors[name] = error;
      }
    });

    if (selectedAddressIndex === "add-new") {
      Object.entries(newAddress).forEach(([name, value]) => {
        const error = validateField(name, value);
        if (error) {
          currentErrors[name] = error;
        }
      });
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    const finalData: PartialCommPickupReq = {
      ...formData,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      pickupDate: selectedDate ? selectedDate : undefined,
      addresses:
        selectedAddressIndex === "add-new"
          ? [newAddress]
          : [user.addresses[selectedAddressIndex]],
    };

    try {
      const result = await dispatch(
        updateCommercialPickup({ data: finalData })
      );
      if (result.payload?.error) {
        toast.error(result.payload.error);
        return;
      }
      toast.success("Pickup form submitted successfully!");
      onClose();
      setTimeout(() => navigate("/commercial"), 2000);
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-lg">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Schedule Pickup for {
              selectedDate ? (() => {
                const [day, month, year] = selectedDate.split('-');
                return `${day}-${month}-${year}`;
              })()
              : 'No date selected'
            }
          </Dialog.Title>
          <form
            className="grid grid-cols-2 gap-x-6 gap-y-4"
            onSubmit={handleSubmit}
          >
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                className="w-full p-2 border rounded"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Select Address
              </label>
              <select
                className="w-full p-2 border rounded"
                value={selectedAddressIndex}
                onChange={(e) =>
                  setSelectedAddressIndex(
                    e.target.value === "add-new"
                      ? "add-new"
                      : parseInt(e.target.value)
                  )
                }
              >
                {user.addresses?.map((addr: any, index: number) => (
                  <option key={index} value={index.toString()}>
                    {addr.addressLine1},{addr.addressLine2},{addr.location},{" "}
                    {addr.pincode},{addr.district},{addr.state}
                  </option>
                ))}
                <option value="add-new">+ Add New Address</option>
              </select>
            </div>

            {/* Show New Address Fields if "add-new" selected */}
            {selectedAddressIndex === "add-new" && (
              <>
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address Line 1
                    </label>
                    <input
                      name="addressLine1"
                      value={newAddress.addressLine1}
                      onChange={handleNewAddressChange}
                      className="w-full p-2 border rounded"
                    />
                    {errors.addressLine1 && (
                      <p className="text-red-500 text-sm">
                        {errors.addressLine1}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address Line 2
                    </label>
                    <input
                      name="addressLine2"
                      value={newAddress.addressLine2}
                      onChange={handleNewAddressChange}
                      className="w-full p-2 border rounded"
                    />
                    {errors.addressLine2 && (
                      <p className="text-red-500 text-sm">
                        {errors.addressLine2}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      District
                    </label>
                    <input
                      name="district"
                      value={newAddress.district}
                      onChange={handleNewAddressChange}
                      className="w-full p-2 border rounded"
                    />
                    {errors.district && (
                      <p className="text-red-500 text-sm">{errors.district}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Location
                    </label>
                    <input
                      name="location"
                      value={newAddress.location}
                      onChange={handleNewAddressChange}
                      className="w-full p-2 border rounded"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm">{errors.location}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Pincode
                    </label>
                    <input
                      name="pincode"
                      value={newAddress.pincode}
                      onChange={handleNewAddressChange}
                      className="w-full p-2 border rounded"
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm">{errors.pincode}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      State
                    </label>
                    <input
                      name="state"
                      value={newAddress.state}
                      onChange={handleNewAddressChange}
                      className="w-full p-2 border rounded"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm">{errors.state}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Waste Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Waste Type
              </label>
              <input
                type="text"
                value="Commercial"
                readOnly
                className="w-full p-2 border rounded bg-gray-100 text-gray-500"
              />
            </div>

            {/* Pickup Time */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Preferred Pickup Time
              </label>
              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded"
              />
                {pickupTimeError && (
                <p className="text-red-500 text-sm mt-1">{pickupTimeError}</p>
              )}
            </div>
            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Selected Service
              </label>
              <input
                type="text"
                name="service"
                value={serviceQuery ?? ""}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 text-gray-500"
              />
            
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded"
              />
              {errors.businessName && (
                <p className="text-red-500 text-sm">{errors.businessName}</p>
              )}
            </div>

            {/* Frequency of Collection */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Frequency of Waste Collection
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Select Frequency --</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
              {errors.frequency && (
                <p className="text-red-500 text-sm">{errors.frequency}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              >
                Submit Request
              </button>
            </div>

            {/* Cancel Button */}
            <div className="col-span-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 w-full"
              >
                Cancel
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PickupCommercialFormModal;
