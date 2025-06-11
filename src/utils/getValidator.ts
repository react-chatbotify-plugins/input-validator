import { Flow, RcbUserSubmitTextEvent, RcbUserUploadFileEvent } from 'react-chatbotify';
import { InputValidatorBlock } from '../types/InputValidatorBlock';
import { ValidationResult } from '../types/ValidationResult';

/**
 * Union type for user events that can be validated.
 */
type RcbUserEvent = RcbUserSubmitTextEvent | RcbUserUploadFileEvent;

/**
 * Retrieves the validator function from the current flow block.
 *
 * @param event The event emitted by the user action (text submission or file upload).
 * @param currFlow The current flow object.
 * @returns The validator function if it exists, otherwise undefined.
 */
export const getValidator = <T = string | File>(
	event: RcbUserEvent,
	currFlow: Flow,
	validatorType: 'validateTextInput' | 'validateFileInput' = 'validateTextInput'
): ((input: T) => ValidationResult) | undefined => {
	if (!event.detail?.currPath) {
		return;
	}

	const currBlock = currFlow[event.detail.currPath] as InputValidatorBlock;
	if (!currBlock) {
		return;
	}

	const validator = currBlock[validatorType] as ((input: T) => ValidationResult) | undefined;
	return typeof validator === 'function' ? validator : undefined;
};
