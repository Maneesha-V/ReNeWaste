import { Rule } from "antd/es/form";

export const noTrailingSpaceAlphaRule = [
  { required: true, message: "This field is required" },
  {
    pattern: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
    message: "Only letters and single spaces allowed (no trailing space)",
  },
];

export const requiredNumberOnlyRule = (length?: number) => [
  { required: true, message: "This field is required" },
  {
    pattern: new RegExp(`^[0-9]{${length || 1},}$`),
    message: `Only numbers${
      length ? `, exactly ${length} digits` : ""
    } allowed`,
  },
];
export const alphanumericRule = [
  { required: true, message: "This field is required" },
  {
    pattern: /^[A-Za-z0-9]+$/,
    message: "Only alphabets and numbers are allowed",
  },
];
export const capacityValidationRule = (): Rule[] => [
  { required: true, message: "Please enter capacity" },
  {
    validator: (_, value) => {
      if (!value) return Promise.resolve();

      if (!/^[0-9]+$/.test(value)) {
        return Promise.reject("Only numbers are allowed");
      }

      if (parseInt(value, 10) < 1) {
        return Promise.reject("Capacity must be a positive number");
      }

      return Promise.resolve();
    },
  },
];