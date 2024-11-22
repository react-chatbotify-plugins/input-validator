import { ValidationResult } from "../types/ValidationResult";

/**
 * Validates the uploaded file.
 * Ensures the file is of allowed type and size, and rejects non-file inputs.
 */
export const validateFile = (file?: File): ValidationResult => {
  const allowedTypes = ["image/jpeg", "image/png"];
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

  // Check if no file is provided
  if (!file) {
    return {
      success: false,
      promptContent: "No file uploaded.",
      promptDuration: 3000,
      promptType: "error",
    };
  }

  // Check if the input is not a File object (e.g., text input or invalid type)
  if (!(file instanceof File)) {
    return {
      success: false,
      promptContent: "Invalid input. Please upload a valid file.",
      promptDuration: 3000,
      promptType: "error",
    };
  }

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      promptContent: "Only JPEG or PNG files are allowed.",
      promptType: "error",
    };
  }

  // Validate file size
  if (file.size > maxSizeInBytes) {
    return {
      success: false,
      promptContent: "File size must be less than 5MB.",
      promptType: "error",
    };
  }

  return { success: true };
};
