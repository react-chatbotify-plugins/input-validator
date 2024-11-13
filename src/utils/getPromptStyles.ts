import { Styles } from "react-chatbotify";
import { PluginConfig } from "../types/PluginConfig";
import { ValidationResult } from "../types/ValidationResult";

/**
 * Computes the styles for prompts based on validation results.
 *
 * @param validationResult result of input validation
 * @param pluginConfig configurations for the plugin
 */
export const getPromptStyles = (
    validationResult: ValidationResult,
    pluginConfig: PluginConfig
): Styles => {
    const promptType: string = validationResult.promptType ?? "info";
    let promptStyles: Styles = {};

    if (pluginConfig.advancedStyles) {
        promptStyles = pluginConfig.advancedStyles[promptType];
    }

    if (pluginConfig.promptBaseColors) {
        promptStyles.toastPromptStyle = {
            color: pluginConfig.promptBaseColors[promptType],
            borderColor: pluginConfig.promptBaseColors[promptType],
        };
    }

    if (pluginConfig.promptHoveredColors) {
        promptStyles.toastPromptHoveredStyle = {
            color: pluginConfig.promptHoveredColors[promptType],
            borderColor: pluginConfig.promptHoveredColors[promptType],
        };
    }

    if (pluginConfig.textAreaHighlightColors) {
        if (validationResult.highlightTextArea ?? true) {
            promptStyles.chatInputAreaStyle = {
                boxShadow: `${pluginConfig.textAreaHighlightColors[promptType]} 0px 0px 5px`,
            };
        }
    }

    return promptStyles;
};
