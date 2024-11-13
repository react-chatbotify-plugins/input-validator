import { Styles } from "react-chatbotify";

/**
 * Specifies the configurations for this example plugin.
 */
export type PluginConfig = {
    autoConfig?: boolean;
    promptBaseColors?: {
        [key: string]: string;
    };
    promptHoveredColors?: {
        [key: string]: string;
    }
    textAreaHighlightColors?: {
        [key: string]: string;
    };
    advancedStyles?: {
        [key: string]: Styles;
    };
}