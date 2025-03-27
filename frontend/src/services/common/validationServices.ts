
export interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    agreeToTerms?: string;
  }
  
  export const validateForm = (formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    agreeToTerms: boolean;
  }): { isValid: boolean; errors: FormErrors } => {
    const errors: FormErrors = {};
  
    if (!formData.firstName.trim()) {
      errors.firstName = "First Name is required.";
    } else if (formData.firstName.length < 2) {
      errors.firstName = "First Name must be at least 2 characters.";
    }
  
    if (!formData.lastName.trim()) {
      errors.lastName = "Last Name is required.";
    } else if (formData.lastName.length < 2) {
      errors.lastName = "Last Name must be at least 2 characters.";
    }
  
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format.";
    }
  
    if (!formData.password.trim()) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    } else if (!/(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password =
        "Password must contain at least one uppercase letter and one number.";
    }
  
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms and conditions.";
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };