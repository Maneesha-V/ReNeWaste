export const formatFieldLabel = (fieldName: string): string => {
    return fieldName
      .replace(/([A-Z])/g, " $1") // insert space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
  };
  