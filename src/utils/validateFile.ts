import { ValidationResult } from "../types/ValidationResult";

/**
 * Validates uploaded files.
 * Ensures each file is of an allowed type and size, and rejects invalid inputs.
 */
export const validateFile = (input?: File | FileList): ValidationResult => {
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    const files: File[] = input instanceof FileList ? Array.from(input) : input ? [input] : [];

    // Check if no files are provided
    if (files.length === 0) {
        return {
            success: false,
            promptContent: "No files uploaded.",
            promptDuration: 3000,
            promptType: "error",
        };
    }

    // Validate each file
    for (const file of files) {
        // Check if the file is empty
        if (file.size === 0) {
            return {
                success: false,
                promptContent: `The file "${file.name}" is empty. Please upload a valid file.`,
                promptDuration: 3000,
                promptType: "error",
            };
        }

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            return {
                success: false,
                promptContent: `The file "${file.name}" is not a valid type. Only JPEG or PNG files are allowed.`,
                promptType: "error",
            };
        }

        // Validate file size
        if (file.size > maxSizeInBytes) {
            return {
                success: false,
                promptContent: `The file "${file.name}" exceeds the 5MB size limit.`,
                promptType: "error",
            };
        }
    }

    return { success: true };
};
