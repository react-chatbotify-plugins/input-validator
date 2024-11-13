import { PluginConfig } from "../types/PluginConfig";
import { DefaultPluginConfig } from "../constants/DefaultPluginConfig";

/**
 * Merges the default plugin configuration with the user-provided configuration.
 *
 * @param pluginConfig configurations for the plugin
 */
export const mergePluginConfig = (
    pluginConfig?: PluginConfig
): PluginConfig => {
    return {
        ...DefaultPluginConfig,
        ...pluginConfig,
        promptBaseColors: {
            ...DefaultPluginConfig.promptBaseColors,
            ...pluginConfig?.promptBaseColors,
        },
        promptHoveredColors: {
            ...DefaultPluginConfig.promptHoveredColors,
            ...pluginConfig?.promptHoveredColors,
        },
        textAreaHighlightColors: {
            ...DefaultPluginConfig.textAreaHighlightColors,
            ...pluginConfig?.textAreaHighlightColors,
        },
    };
};
