import { useState } from "react";
import { formatFieldLabel } from "../utils/formatFieldLabel";
import { ValidationErrors } from "../types/wastePlantTypes";

export const useWastePlantValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (name: string, value: any) => {
    let error = "";
    const label = formatFieldLabel(name);

    switch (name) {
      case "firstName":
      case "lastName":
      case "assignedZone":
      case "businessName":
      case "plantName":
      case "ownerName":
      case "addressLine1":
      case "addressLine2":
      case "district":
      case "taluk":
      case "city":
      case "location":
      case "state":
      case "contactInfo":
      case "name":
        if (!value.trim()) error = `${label} is required.`;
        else if (!/^[A-Za-z\s]+$/.test(value))
          error = `${label} must contain only letters.`;
        break;

      case "email":
        if (!value.trim()) error = "Email is required.";
        else if (
          !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
        )
          error = "Invalid email format.";
        break;
      case "phone":
      case "contactNo":
      case "contact":
        if (!value.trim()) error = "Contact Number is required.";
        else if (!/^\d{10}$/.test(value))
          error = "Contact Number must be 10 digits.";
        break;
      case "pincode":
        if (!value.trim()) error = "Pincode is required.";
        else if (!/^\d{6}$/.test(value)) error = "Pincode must be 6 digits.";
        break;
      case "pickupTime":
        if (!value.trim()) {
          error = "Pickup time is required.";
        } else {
          const [hours, minutes] = value.split(":").map(Number);
          const totalMinutes = hours * 60 + minutes;

          const minMinutes = 9 * 60; // 09:00 AM
          const maxMinutes = 17 * 60; // 05:00 PM

          if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
            error = "Pickup time must be between 9:00 AM and 5:00 PM.";
          }
        }
        break;   
      case "vehicleNumber":
      case "licenseNumber":
        if (!value.trim()) error = `${label} is required.`;
        break;

      case "capacity":
      case "experience":
        if (!value) error = `${label} is required.`;
        else if (isNaN(value) || value <= 0)
          error = `${label} must be a positive number.`;
        break;

      case "frequency":
        if (!value) error = `Please select frequency.`;
        break;
      case "subscriptionPlan":
        if (!value) error = `Please select a Subscription Plan.`;
        break;
      case "status":
        if (!value) error = `Please select a status.`;
        break;
      case "password":
        if (!value) error = "Password is required.";
        else if (value.length < 6)
          error = "Password must be at least 6 characters.";
        break;
      case "username":
        if (!value.trim()) error = "Username is required.";
        else if (!/^[A-Za-z0-9_]+$/.test(value))
          error =
            "Username can only contain letters, numbers, and underscores.";
        break;
      case "services":
        if (value.length === 0)
          error = "At least one service must be selected.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  return {
    errors,
    validateField,
    setErrors,
  };
};
