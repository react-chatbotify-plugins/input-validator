import { useEffect, useRef, useState } from "react";
import {
    useBotId,
    RcbUserSubmitTextEvent,
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
 * @param pluginConfig configurations for the plugin
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
         * Handles the user submitting input event.
         *
         * @param event event emitted when user submits input
         */
        const handleUserSubmitText = (event: RcbUserSubmitTextEvent): void => {
            // gets validator and if no validator, return
            const validator = getValidator(event, getBotId(), getFlow());
            if (!validator) {
                return;
            }

            // gets and checks validation result
            const validationResult = validator(
                event.data.inputText
            ) as ValidationResult;
            if (!validationResult.success) {
                event.preventDefault();
            }

            // if nothing to prompt, return
            if (!validationResult.promptContent) {
                return;
            }

            // if this is the first plugin toast, preserve original styles for restoration later
            if (numPluginToasts === 0) {
                originalStyles.current = structuredClone(styles)
            }
            const promptStyles = getPromptStyles(
                validationResult,
                mergedPluginConfig
            );

            // update toast with prompt styles
            updateStyles(promptStyles);

            // shows prompt toast to user
            showToast(
                validationResult.promptContent ?? "",
                validationResult.promptDuration
            );

            // increases number of plugin toasts by 1
            setNumPluginToasts((prev) => prev + 1);
        };

        /**
         * Handles the dismiss toast event.
         *
         * @param event event emitted when toast is dismissed
         */
        const handleDismissToast = (): void => {
            setNumPluginToasts((prev) => prev - 1);
        };

        // adds required events
        window.addEventListener("rcb-user-submit-text", handleUserSubmitText);
        window.addEventListener("rcb-dismiss-toast", handleDismissToast);

        return () => {
            window.removeEventListener("rcb-user-submit-text", handleUserSubmitText);
            window.removeEventListener("rcb-dismiss-toast", handleDismissToast);
        };
    }, [
        getBotId,
        getFlow,
        showToast,
        updateStyles,
        styles,
        mergedPluginConfig,
        numPluginToasts
    ]);

    // restores original styles when plugin toasts are all dismissed
    useEffect(() => {
        if (numPluginToasts === 0) {
            setTimeout(() => {
                replaceStyles(originalStyles.current);
            });
        }
    }, [numPluginToasts, replaceStyles, originalStyles]);

    // initializes plugin metadata with plugin name
    const pluginMetaData: ReturnType<Plugin> = {
        name: "@rcb-plugins/input-validator"
    };

    // adds required events in settings if auto config is true
    if (mergedPluginConfig.autoConfig) {
        pluginMetaData.settings = {
            event: {
                rcbUserSubmitText: true,
                rcbDismissToast: true,
            },
        };
    }

    return pluginMetaData;
};

export default useRcbPlugin;
