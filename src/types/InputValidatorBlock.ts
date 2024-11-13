import { Block } from "react-chatbotify";
import { ValidationResult } from "./ValidationResult";

/**
 * Extends the Block from React ChatBotify to support inputValidator attribute.
 */
export type InputValidatorBlock = Block & {
    validateInput: (userInput?: string) => ValidationResult;
};