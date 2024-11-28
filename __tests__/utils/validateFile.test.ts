import { validateFile } from "../../src/utils/validateFile";
import { ValidationResult } from "../../src/types/ValidationResult";

describe("validateFile", () => {
    test("returns error when no file is provided", () => {
        const result: ValidationResult = validateFile();

        expect(result).toEqual({
            success: false,
            promptContent: "No files uploaded.",
            promptDuration: 3000,
            promptType: "error",
        });
    });

    test("returns error when an empty file is provided", () => {
        const mockFile = new File([""], "emptyFile.png", { type: "image/png" }); // Empty content
        const result: ValidationResult = validateFile(mockFile);

        expect(result).toEqual({
            success: false,
            promptContent: 'The file "emptyFile.png" is empty. Please upload a valid file.',
            promptDuration: 3000,
            promptType: "error",
        });
    });

    test("returns error for invalid file type", () => {
        const mockFile = new File(["content"], "invalidFile.txt", { type: "text/plain" });
        const result: ValidationResult = validateFile(mockFile);

        expect(result).toEqual({
            success: false,
            promptContent: 'The file "invalidFile.txt" is not a valid type. Only JPEG or PNG files are allowed.',
            promptType: "error",
        });
    });

    test("returns success for a valid file", () => {
        const mockFile = new File(["valid content"], "validFile.png", { type: "image/png" });
        const result: ValidationResult = validateFile(mockFile);

        expect(result).toEqual({
            success: true,
        });
    });

    test("returns error for file exceeding the maximum size", () => {
        const largeFile = new File(["a".repeat(5 * 1024 * 1024 + 1)], "largeFile.png", {
            type: "image/png",
        });
        const result: ValidationResult = validateFile(largeFile);
    
        expect(result).toEqual({
            success: false,
            promptContent: 'The file "largeFile.png" exceeds the 5MB size limit.',
            promptType: "error",
        });
    });
    
    test("returns error for non-file inputs", () => {
        const result: ValidationResult = validateFile("not a file" as unknown as File);
    
        expect(result).toEqual({
            success: false,
            promptContent: 'The file "undefined" is not a valid type. Only JPEG or PNG files are allowed.',
            promptType: "error",
        });
    }); 
});
