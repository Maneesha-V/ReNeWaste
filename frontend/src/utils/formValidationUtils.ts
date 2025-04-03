import { FormErrors } from "../types/authTypes";

export const validateForm = (values: any): { isValid: boolean; errors: FormErrors } => {
  let errors: FormErrors = {};
  let isValid = true;

  if (!values.firstName.trim()) {
    errors.firstName = "First Name is required.";
    isValid = false;
  }
  if (!values.lastName.trim()) {
    errors.lastName = "Last Name is required.";
    isValid = false;
  }
  if (!values.phone.trim()) {
    errors.phone = "Phone number is required.";
    isValid = false;
  } else if(!/^\d{10}$/.test(values.phone)) {
    errors.phone = "Phone number must be exactly 10 digits.";
    isValid = false;
  }
  if (!values.email.trim()) {
    errors.email = "Email is required.";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Invalid email format.";
    isValid = false;
  }
  if (!values.password.trim()) {
    errors.password = "Password is required.";
    isValid = false;
  }
  if (!values.agreeToTerms) {
    errors.agreeToTerms = "You must agree to the terms.";
    isValid = false;
  }

  return { isValid, errors };
};
