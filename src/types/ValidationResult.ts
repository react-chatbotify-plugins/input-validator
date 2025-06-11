/**
 * Defines the return result from validateTextInput and validateFileInput.
 */
export type ValidationResult = {
	success?: boolean;
	promptContent?: string;
	promptType?: string;
	promptDuration?: number;
	highlightTextArea?: boolean;
};
