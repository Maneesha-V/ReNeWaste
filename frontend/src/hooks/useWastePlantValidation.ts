import { useState } from "react";
import { formatFieldLabel } from "../utils/formatFieldLabel";
import { ValidationErrors } from "../types/wastePlantTypes"

export const useWastePlantValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (name: string, value: any) => {
    let error = "";
    const label = formatFieldLabel(name);

    switch (name) {
      case "plantName":
      case "ownerName":
      case "location":
      case "city":
      case "state":
      case "contactInfo":
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

      case "contactNo":
        if (!value.trim()) error = "Contact Number is required.";
        else if (!/^\d{10}$/.test(value))
          error = "Contact Number must be 10 digits.";
        break;

      case "licenseNumber":
        if (!value.trim()) error = `${label} is required.`;
        break;

      case "capacity":
        if (!value) error = `${label} is required.`;
        else if (isNaN(value) || value <= 0)
          error = `${label} must be a positive number.`;
        break;

      case "subscriptionPlan":
        if (!value) error = `Please select a Subscription Plan.`;
        break;

      case "password":
        if (!value) error = "Password is required.";
        else if (value.length < 6)
          error = "Password must be at least 6 characters.";
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
