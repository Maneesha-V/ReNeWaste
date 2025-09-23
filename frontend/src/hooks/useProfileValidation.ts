import { useState } from "react";
import { ProfValidationErrors } from "../types/common/commonTypes";

const validateString = (value: string, fieldName: string): string[] => {
  const errors: string[] = [];
  if (!value.trim()) {
    errors.push(`${fieldName} is required.`);
  } 
    else if (!/^[A-Za-z\s]+$/.test(value)) {
      errors.push(`${fieldName} must contain only letters.`);
    }
    else if (value.length < 3) {
        errors.push(`${fieldName} must be at least 3 characters.`);
      }
  return errors;
};

const validateNumber = (value: string, fieldName: string): string[] => {
  const errors: string[] = [];
  if (!value.trim()) {
    errors.push(`${fieldName} is required.`);
  } else if (!/^\d+$/.test(value)) {
    errors.push(`${fieldName} must contain only numbers.`);
  } else {
    if (fieldName === "phone" && value.length !== 10) {
      errors.push(`${fieldName} must be exactly 10 digits.`);
    }
    if (fieldName === "pincode" && value.length !== 6) {
      errors.push(`${fieldName} must be exactly 6 digits.`);
    }
  }
  return errors;
};

const validateEmail = (value: string): string[] => {
  const errors: string[] = [];
  if (!value.trim()) errors.push("Email is required.");
  else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value))
    errors.push("Enter a valid email address.");
  return errors;
};

const validateSecureField = (value: string, fieldName: string): string[] => {
  const errors: string[] = [];
  if (!value.trim()) errors.push(`${fieldName} is required.`);
  else if (value.length < 8) errors.push(`${fieldName} must be at least 8 characters.`);
  else if (!/[A-Z]/.test(value)) errors.push(`${fieldName} must contain at least one uppercase letter.`);
  else if (!/[0-9]/.test(value)) errors.push(`${fieldName} must contain at least one number.`);
  return errors;
};

export const useProfileValidation = () => {
  const [errors, setErrors] = useState<ProfValidationErrors>({});

  const validate = (field: string, value: string): void => {
    let errorMessages: string[] = [];

    if (["firstName", "lastName", "addressLine1", "addressLine2","taluk", "location", "district", "state"].includes(field)) {
      errorMessages = validateString(value, field);
    } else if (["phone", "pincode"].includes(field)) {
      errorMessages = validateNumber(value, field);
    } else if (field === "email") {
      errorMessages = validateEmail(value);
    } else if (field === "password") {
      errorMessages = validateSecureField(value, field);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorMessages,
    }));
  };

  const getErrorMessages = (field: string): string[] => errors[field] || [];

  return { validate, getErrorMessages };
};
