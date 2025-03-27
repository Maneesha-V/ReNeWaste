export const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
  
    if (password.length < 6) return "Password must be at least 6 characters long";
  
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
  
    if (!hasUppercase || !hasNumber) {
      return "Password must contain at least one uppercase letter and one number";
    }
  
    return null; 
  };
  