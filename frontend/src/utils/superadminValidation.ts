export const validatePlanName = (_: any, value: string) => {
    const regex = /^[A-Za-z0-9 ]+$/;
    if (!value || regex.test(value)) return Promise.resolve();
    return Promise.reject("Only alphabets, numbers, and spaces allowed");
  };

  // Prevent typing non-numeric input in InputNumber
  export const handleNumberKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  };