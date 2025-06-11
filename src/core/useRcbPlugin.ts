import { useEffect, useRef, useState } from 'react';
import {
	RcbUserSubmitTextEvent,
	RcbUserUploadFileEvent,
	useToasts,
	useFlow,
	useStyles,
	Styles,
	useOnRcbEvent,
	RcbEvent,
} from 'react-chatbotify';
import { Plugin } from 'react-chatbotify/dist/types/Plugin';
import { PluginConfig } from '../types/PluginConfig';
import { mergePluginConfig } from '../utils/mergePluginConfig';
import { getPromptStyles } from '../utils/getPromptStyles';
import { ValidationResult } from '../types/ValidationResult';
import { getValidator } from '../utils/getValidator';

/**
 * Plugin hook that handles all the core logic.
 *
 * @param pluginConfig configurations for the plugin
 */
const useRcbPlugin = (pluginConfig?: PluginConfig) => {
	const { showToast } = useToasts();
	const { getFlow } = useFlow();
	const { styles, updateStyles, replaceStyles } = useStyles();

	const mergedPluginConfig = mergePluginConfig(pluginConfig);
	const [numPluginToasts, setNumPluginToasts] = useState<number>(0);
	const originalStyles = useRef<Styles>({});

	/**
	 * Handles the user submitting text input event.
	 *
	 * @param event Event emitted when user submits text input.
	 */
	const handleUserSubmitText = (event: Event): void => {
		const rcbEvent = event as RcbUserSubmitTextEvent;

		// Get validator and if no validator, return
		const validator = getValidator<string>(rcbEvent, getFlow(), 'validateTextInput');
		if (!validator) {
			return;
		}

		// Get and check validation result
		const validationResult = validator(rcbEvent.data.inputText) as ValidationResult;
		if (!validationResult?.success) {
			event.preventDefault();
		}

		// If nothing to prompt, return
		if (!validationResult.promptContent) {
			return;
		}

		// Preserve original styles if this is the first plugin toast
		if (numPluginToasts === 0) {
			originalStyles.current = structuredClone(styles);
		}
		const promptStyles = getPromptStyles(validationResult, mergedPluginConfig);

		// Update styles with prompt styles
		updateStyles(promptStyles);

		// Show prompt toast to user
		showToast(validationResult.promptContent, validationResult.promptDuration ?? 3000);

		// Increase number of plugin toasts by 1
		setNumPluginToasts((prev) => prev + 1);
	};

	const handleUserUploadFile = (event: Event): void => {
		const rcbEvent = event as RcbUserUploadFileEvent;
		const file: File | undefined = rcbEvent.data?.files?.[0];

		if (!file) {
			console.error('No file uploaded.');
			event.preventDefault();
			return;
		}

		const validator = getValidator<File>(rcbEvent, getFlow(), 'validateFileInput');

		if (!validator) {
			console.error('Validator not found for file input.');
			return;
		}

		const validationResult = validator(file);

		if (!validationResult.success) {
			console.error('Validation failed:', validationResult);
			if (validationResult.promptContent) {
				showToast(validationResult.promptContent, validationResult.promptDuration ?? 3000);
			}
			event.preventDefault();
			return;
		}

		console.log('Validation successful:', validationResult);
	};

	/**
	 * Handles the dismiss toast event.
	 *
	 * @param event Event emitted when toast is dismissed.
	 */
	const handleDismissToast = (): void => {
		setNumPluginToasts((prev) => prev - 1);
	};

	// Add required event listeners
	useOnRcbEvent(RcbEvent.USER_SUBMIT_TEXT, handleUserSubmitText);
	useOnRcbEvent(RcbEvent.USER_UPLOAD_FILE, handleUserUploadFile);
	useOnRcbEvent(RcbEvent.DISMISS_TOAST, handleDismissToast);

	// Restore original styles when all plugin toasts are dismissed
	useEffect(() => {
		if (numPluginToasts === 0) {
			setTimeout(() => {
				replaceStyles(originalStyles.current);
			});
		}
	}, [numPluginToasts, replaceStyles]);

	// Initialize plugin metadata with plugin name
	const pluginMetaData: ReturnType<Plugin> = {
		name: '@rcb-plugins/input-validator',
	};

	// Add required events in settings if autoConfig is true
	if (mergedPluginConfig.autoConfig) {
		pluginMetaData.settings = {
			event: {
				rcbUserSubmitText: true,
				rcbUserUploadFile: true,
				rcbDismissToast: true,
			},
		};
	}

	return pluginMetaData;
};

export default useRcbPlugin;
