/**
 * Defines the return result from validateInput.
 */
export type ValidationResult = {
    success: boolean;
    promptContent?: string;
    promptType?: string;
    promptDuration?: number;
    highlightTextArea?: boolean;
}
