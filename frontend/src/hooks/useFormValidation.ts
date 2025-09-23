import { useState } from "react";
import { FormErrors } from "../types/common/commonTypes";


const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validate: (values: T) => { isValid: boolean; errors: FormErrors }
) => {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { errors } = validate(formData);
    const fieldName = e.target.name as keyof FormErrors; 
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: errors[fieldName],
    }));
  };


  return { formData, errors, handleChange, handleBlur, setErrors };
};

export default useFormValidation;
