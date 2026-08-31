import { RuleObject } from "antd/es/form";

// export const validatePlanName = (_: any, value: string) => {
//     const regex = /^[A-Za-z0-9 ]+$/;
//     if (!value || regex.test(value)) return Promise.resolve();
//     return Promise.reject("Only alphabets, numbers, and spaces allowed");
//   };
export const validatePlanName = (
  _: RuleObject,
  value: string,
): Promise<void> => {
  const regex = /^[A-Za-z0-9 ]+$/;

  if (!value || regex.test(value)) {
    return Promise.resolve();
  }

  return Promise.reject(
    new Error("Only alphabets, numbers, and spaces allowed"),
  );
};
  // Prevent typing non-numeric input in InputNumber
  export const handleNumberKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  };