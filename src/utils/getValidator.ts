import { Flow, RcbUserSubmitTextEvent } from "react-chatbotify";
import { InputValidatorBlock } from "../types/InputValidatorBlock";

/**
 * Retrieves the validator function and returns null if not applicable.
 */
export const getValidator = (event: RcbUserSubmitTextEvent, currBotId: string | null, currFlow: Flow) => {
    if (currBotId !== event.detail.botId) {
        return;
    }
    
    if (!event.detail.currPath) {
        return;
    }

    const currBlock = currFlow[event.detail.currPath] as InputValidatorBlock;
    if (!currBlock) {
        return;
    }

    const validator = currBlock.validateInput;
    const isValidatorFunction =
        validator && typeof validator === "function";
    if (!isValidatorFunction) {
        return;
    }

    return validator;
}