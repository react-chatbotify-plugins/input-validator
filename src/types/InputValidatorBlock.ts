import { Block } from 'react-chatbotify';
import { ValidationResult } from './ValidationResult';

/**
 * Extends the Block from React ChatBotify to support inputValidator attributes.
 */
export type InputValidatorBlock = Block & {
	validateTextInput?: (userInput?: string) => ValidationResult;
	validateFileInput?: (files?: FileList) => ValidationResult; // Accepts multiple files
};
