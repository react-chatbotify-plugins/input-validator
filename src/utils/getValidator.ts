// src/utils/getValidator.ts

import { Flow, RcbUserSubmitTextEvent, RcbUserUploadFileEvent } from "react-chatbotify";
import { InputValidatorBlock } from "../types/InputValidatorBlock";
import { ValidationResult } from "../types/ValidationResult";

/**
 * Union type for user events that can be validated.
 */
type RcbUserEvent = RcbUserSubmitTextEvent | RcbUserUploadFileEvent;

/**
 * Retrieves the validator function from the current flow block.
 *
 * @param event The event emitted by the user action (text submission or file upload).
 * @param currBotId The current bot ID.
 * @param currFlow The current flow object.
 * @returns The validator function if it exists, otherwise undefined.
 */
export const getValidator = <T = string | File>(
  event: RcbUserEvent,
  currBotId: string | null,
  currFlow: Flow,
  validatorType: "validateTextInput" | "validateFileInput" = "validateTextInput"
): ((input: T) => ValidationResult) | undefined => {
    if (!event.detail) {
      return;
    }
  
    const { botId, currPath } = event.detail;
  
    if (currBotId !== botId) {
      return;
    }
  
    if (!currPath) {
      return;
    }
  
    const currBlock = currFlow[currPath] as InputValidatorBlock;
    if (!currBlock) {
      return;
    }
  
    const validator = currBlock[validatorType] as ((input: T) => ValidationResult) | undefined;
    return typeof validator === "function" ? validator : undefined;
  };