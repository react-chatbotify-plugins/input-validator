import { getPromptStyles } from "../../src/utils/getPromptStyles";
import { PluginConfig } from "../../src/types/PluginConfig";

test("applies error styles when promptType is 'error'", () => {
    const mockPluginConfig: PluginConfig = {
        promptBaseColors: {
            error: "red",
        },
        textAreaHighlightColors: {
            error: "red",
        },
    };

    const validationResult = {
        success: false,
        promptType: "error",
        highlightTextArea: true,
    };

    const result = getPromptStyles(validationResult, mockPluginConfig);

    // Debugging output to verify the structure of the result
    console.log("Result from getPromptStyles:", result);

    expect(result).toEqual(
        expect.objectContaining({
            toastPromptStyle: expect.objectContaining({
                color: "red",
                borderColor: "red",
            }),
            chatInputAreaStyle: expect.objectContaining({
                boxShadow: "red 0px 0px 5px",
            }),
        })
    );
});

test("applies default styles when promptType is not provided", () => {
    const mockPluginConfig: PluginConfig = {
        promptBaseColors: {
            info: "blue",
        },
    };

    const validationResult = {
        success: true, // No promptType provided
    };

    const result = getPromptStyles(validationResult, mockPluginConfig);

    expect(result).toEqual(
        expect.objectContaining({
            toastPromptStyle: expect.objectContaining({
                color: "blue",
                borderColor: "blue",
            }),
        })
    );
});

test("applies advancedStyles when available for the promptType", () => {
    const mockPluginConfig: PluginConfig = {
        advancedStyles: {
            error: {
                toastPromptStyle: {
                    backgroundColor: "darkred",
                },
            },
        },
    };

    const validationResult = {
        success: false,
        promptType: "error",
    };

    const result = getPromptStyles(validationResult, mockPluginConfig);

    expect(result).toEqual(
        expect.objectContaining({
            toastPromptStyle: {
                backgroundColor: "darkred",
            },
        })
    );
});

test("applies hovered colors when promptHoveredColors is provided", () => {
    const mockPluginConfig: PluginConfig = {
        promptHoveredColors: {
            success: "green",
        },
    };

    const validationResult = {
        success: true,
        promptType: "success",
    };

    const result = getPromptStyles(validationResult, mockPluginConfig);

    expect(result).toEqual(
        expect.objectContaining({
            toastPromptHoveredStyle: {
                color: "green",
                borderColor: "green",
            },
        })
    );
});

test("does not apply chat input highlight when highlightTextArea is false", () => {
    const mockPluginConfig: PluginConfig = {
        textAreaHighlightColors: {
            error: "red",
        },
    };

    const validationResult = {
        success: false,
        promptType: "error",
        highlightTextArea: false,
    };

    const result = getPromptStyles(validationResult, mockPluginConfig);

    expect(result.chatInputAreaStyle).toBeUndefined();
});
test("returns an empty object when pluginConfig is empty", () => {
    const mockPluginConfig: PluginConfig = {};

    const validationResult = {
        success: true,
        promptType: "success",
    };

    const result = getPromptStyles(validationResult, mockPluginConfig);

    expect(result).toEqual({});
});

