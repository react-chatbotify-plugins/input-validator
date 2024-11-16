// src/types/InputValidatorBlock.ts

import { Block } from "react-chatbotify";
import { ValidationResult } from "./ValidationResult";

/**
 * Extends the Block from React ChatBotify to support validateInput attribute.
 */
export type InputValidatorBlock = Block & {
    validateInput: (userInput?: string | File) => ValidationResult;
};
