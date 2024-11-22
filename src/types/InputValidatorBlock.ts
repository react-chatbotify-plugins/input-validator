// src/types/InputValidatorBlock.ts

import { Block } from "react-chatbotify";
import { ValidationResult } from "./ValidationResult";

/**
 * Extends the Block from React ChatBotify to support inputValidator attribute.
 */

export type InputValidatorBlock = Omit<Block, "file"> & {
  file?: (params: { files?: FileList }) => void | Promise<void>;
  validateTextInput?: (userInput?: string) => ValidationResult;
  validateFileInput?: (file?: File) => ValidationResult;
};