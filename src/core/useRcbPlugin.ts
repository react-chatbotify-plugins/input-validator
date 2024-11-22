import { useEffect, useRef, useState } from "react";
import {
    useBotId,
    RcbUserSubmitTextEvent,
    RcbUserUploadFileEvent,
    useToasts,
    useFlow,
    useStyles,
    Styles,
} from "react-chatbotify";
import { Plugin } from "react-chatbotify/dist/types/Plugin";
import { PluginConfig } from "../types/PluginConfig";
import { mergePluginConfig } from "../utils/mergePluginConfig";
import { getPromptStyles } from "../utils/getPromptStyles";
import { ValidationResult } from "../types/ValidationResult";
import { getValidator } from "../utils/getValidator";

/**
 * Plugin hook that handles all the core logic.
 *
 * @param pluginConfig Configurations for the plugin.
 */
const useRcbPlugin = (pluginConfig?: PluginConfig) => {
    const { showToast } = useToasts();
    const { getBotId } = useBotId();
    const { getFlow } = useFlow();
    const { styles, updateStyles, replaceStyles } = useStyles();

    const mergedPluginConfig = mergePluginConfig(pluginConfig);
    const [numPluginToasts, setNumPluginToasts] = useState<number>(0);
    const originalStyles = useRef<Styles>({});

    useEffect(() => {
        /**
         * Handles the user submitting text input event.
         *
         * @param event Event emitted when user submits text input.
         */
        const handleUserSubmitText = (event: Event): void => {
            const rcbEvent = event as RcbUserSubmitTextEvent;

            // Get validator and if no validator, return
            const validator = getValidator(rcbEvent, getBotId(), getFlow());
            if (!validator) {
                return;
            }

            // Get and check validation result
            const validationResult = validator(
                rcbEvent.data.inputText
            ) as ValidationResult;
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
            const promptStyles = getPromptStyles(
                validationResult,
                mergedPluginConfig
            );

            // Update styles with prompt styles
            updateStyles(promptStyles);

            // Show prompt toast to user
            showToast(
                validationResult.promptContent,
                validationResult.promptDuration ?? 3000
            );

            // Increase number of plugin toasts by 1
            setNumPluginToasts((prev) => prev + 1);
        };

        /**
         * Handles the user uploading a file event.
         *
         * @param event Event emitted when user uploads a file.
         */
        // useRcbPlugin.ts

        const handleUserUploadFile = (event: Event): void => {
            const rcbEvent = event as RcbUserUploadFileEvent;
            const file: File | undefined = rcbEvent.data?.files?.[0];
        
            if (!file) {
            console.error("No file uploaded.");
            event.preventDefault();
            return;
            }
        
            const validator = getValidator<File>(
            rcbEvent,
            getBotId(),
            getFlow(),
            "validateFileInput"
            );
        
            if (!validator) {
            console.error("Validator not found for file input.");
            return;
            }
        
            const validationResult = validator(file);
        
            if (!validationResult.success) {
            console.error("Validation failed:", validationResult);
            if (validationResult.promptContent) {
                showToast(validationResult.promptContent, validationResult.promptDuration ?? 3000);
            }
            event.preventDefault();
            return;
            }
        
            console.log("Validation successful:", validationResult);
        };

        /**
         * Handles the dismiss toast event.
         */
        const handleDismissToast = (): void => {
            setNumPluginToasts((prev) => prev - 1);
        };

        // Add required event listeners
        window.addEventListener("rcb-user-submit-text", handleUserSubmitText);
        window.addEventListener("rcb-user-upload-file", handleUserUploadFile);
        window.addEventListener("rcb-dismiss-toast", handleDismissToast);

        return () => {
            // Remove event listeners
            window.removeEventListener("rcb-user-submit-text", handleUserSubmitText);
            window.removeEventListener("rcb-user-upload-file", handleUserUploadFile);
            window.removeEventListener("rcb-dismiss-toast", handleDismissToast);
        };
    }, [
        getBotId,
        getFlow,
        showToast,
        updateStyles,
        styles,
        mergedPluginConfig,
        numPluginToasts,
    ]);

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
        name: "@rcb-plugins/input-validator",
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
