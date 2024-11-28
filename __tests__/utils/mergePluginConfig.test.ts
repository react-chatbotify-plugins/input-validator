import { mergePluginConfig } from "../../src/utils/mergePluginConfig";
import { DefaultPluginConfig } from "../../src/constants/DefaultPluginConfig";

test("returns default configuration when no pluginConfig is provided", () => {
    const result = mergePluginConfig();
    expect(result).toEqual(DefaultPluginConfig);
});

test("merges user configuration with default configuration", () => {
    const userConfig = {
        promptBaseColors: {
            success: "green",
        },
        textAreaHighlightColors: {
            error: "darkred",
        },
    };

    const result = mergePluginConfig(userConfig);

    expect(result.promptBaseColors).toEqual({
        ...DefaultPluginConfig.promptBaseColors,
        success: "green", // Overridden value
    });

    expect(result.textAreaHighlightColors).toEqual({
        ...DefaultPluginConfig.textAreaHighlightColors,
        error: "darkred", // Overridden value
    });

    // Ensure other configurations are not affected
    expect(result.promptHoveredColors).toEqual(DefaultPluginConfig.promptHoveredColors);
});

test("returns default configuration when user configuration is empty", () => {
    const userConfig = {};

    const result = mergePluginConfig(userConfig);

    expect(result).toEqual(DefaultPluginConfig);
});

test("preserves default values for properties not specified in user configuration", () => {
    const userConfig = {
        promptBaseColors: {
            error: "purple",
        },
    };

    const result = mergePluginConfig(userConfig);

    // Only "error" in promptBaseColors is overridden
    expect(result.promptBaseColors).toEqual({
        ...DefaultPluginConfig.promptBaseColors,
        error: "purple",
    });

    // Other properties remain unchanged
    expect(result.promptHoveredColors).toEqual(DefaultPluginConfig.promptHoveredColors);
    expect(result.textAreaHighlightColors).toEqual(DefaultPluginConfig.textAreaHighlightColors);
});
