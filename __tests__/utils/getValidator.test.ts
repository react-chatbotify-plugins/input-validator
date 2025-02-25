import { getValidator } from "../../src/utils/getValidator";
import { Flow, RcbUserUploadFileEvent } from "react-chatbotify";
import { ValidationResult } from "../../src/types/ValidationResult";
import { InputValidatorBlock } from "../../src/types/InputValidatorBlock";

describe("getValidator - Valid Cases", () => {
    test("retrieves validateFileInput when provided a valid event and flow", () => {
        const mockValidationResult: ValidationResult = { success: true };
        const mockValidateFileInput = jest.fn(() => mockValidationResult);

        const flow: Flow = {
            start: {
                message: "Upload a file",
                validateFileInput: mockValidateFileInput,
            } as InputValidatorBlock,
        };

        const currBotId = "bot-id";

        const eventWithPath: RcbUserUploadFileEvent = new CustomEvent("rcb-user-upload-file", {
            detail: { currPath: "start", prevPath: "intro", botId: currBotId },
        }) as RcbUserUploadFileEvent;

        const validator = getValidator(eventWithPath, currBotId, flow, "validateFileInput");
        expect(validator).toBe(mockValidateFileInput);

        const mockFile = new File(["content"], "test.png", { type: "image/png" });
        const result = validator?.(mockFile);
        expect(result).toEqual(mockValidationResult);
    });

    test("returns undefined when currPath is missing in the event", () => {
        const flow: Flow = {
            start: {
                message: "Upload a file",
                validateFileInput: jest.fn(),
            } as InputValidatorBlock,
        };

        const currBotId = "bot-id";

        const eventWithoutPath: RcbUserUploadFileEvent = new CustomEvent("rcb-user-upload-file", {
            detail: { currPath: null, prevPath: "intro", botId: currBotId },
        }) as unknown as RcbUserUploadFileEvent;

        const validator = getValidator(eventWithoutPath, currBotId, flow, "validateFileInput");
        expect(validator).toBeUndefined();
    });

    test("returns undefined when botId does not match", () => {
        const flow: Flow = {
            start: {
                message: "Upload a file",
                validateFileInput: jest.fn(),
            } as InputValidatorBlock,
        };

        const currBotId = "bot-id";

        const eventWithWrongBotId: RcbUserUploadFileEvent = new CustomEvent("rcb-user-upload-file", {
            detail: { currPath: "start", prevPath: "intro", botId: "wrong-bot-id" },
        }) as RcbUserUploadFileEvent;

        const validator = getValidator(eventWithWrongBotId, currBotId, flow, "validateFileInput");
        expect(validator).toBeUndefined();
    });

    test("returns undefined when event is null or undefined", () => {
        const flow: Flow = {
            start: {
                message: "Upload a file",
                validateFileInput: jest.fn(),
            } as InputValidatorBlock,
        };
    
        const currBotId = "bot-id";
    
        // Simulate null event
        let validatorForNull;
        try {
            validatorForNull = getValidator(null as unknown as RcbUserUploadFileEvent, currBotId, flow, "validateFileInput");
        } catch {
            validatorForNull = undefined; // No need for the error variable
        }
        expect(validatorForNull).toBeUndefined();
    
        // Simulate undefined event
        let validatorForUndefined;
        try {
            validatorForUndefined = getValidator(undefined as unknown as RcbUserUploadFileEvent, currBotId, flow, "validateFileInput");
        } catch {
            validatorForUndefined = undefined; // No need for the error variable
        }
        expect(validatorForUndefined).toBeUndefined();
    });
    


    test("returns undefined when validator does not exist in the flow block", () => {
        const flow: Flow = {
            start: {
                message: "Upload a file",
                // No validateFileInput function here
            } as InputValidatorBlock,
        };
    
        const currBotId = "bot-id";
    
        const eventWithPath = new CustomEvent<RcbUserUploadFileEvent["detail"]>("rcb-user-upload-file", {
            detail: { currPath: "start", prevPath: "intro", botId: currBotId },
        }) as RcbUserUploadFileEvent;
    
        const validator = getValidator(eventWithPath, currBotId, flow, "validateFileInput");
    
        // Assert that validator is undefined
        expect(validator).toBeUndefined();
    });
    test("returns undefined when validator is not a function", () => {
        const flow: Flow = {
            start: {
                message: "Upload a file",
                validateFileInput: "not-a-function", // Invalid validator type
            } as unknown as InputValidatorBlock,
        };
    
        const currBotId = "bot-id";
    
        const eventWithPath = new CustomEvent<RcbUserUploadFileEvent["detail"]>("rcb-user-upload-file", {
            detail: { currPath: "start", prevPath: "intro", botId: currBotId },
        }) as RcbUserUploadFileEvent;
    
        const validator = getValidator(eventWithPath, currBotId, flow, "validateFileInput");
    
        // Assert that validator is undefined
        expect(validator).toBeUndefined();
    });
    test("defaults to validateTextInput when validatorType is not provided", () => {
        const mockValidationResult: ValidationResult = { success: true };
        const mockValidateTextInput = jest.fn(() => mockValidationResult);
    
        const flow: Flow = {
            start: {
                message: "Enter your input",
                validateTextInput: mockValidateTextInput,
            } as InputValidatorBlock,
        };
    
        const currBotId = "bot-id";
    
        const eventWithPath = new CustomEvent<RcbUserUploadFileEvent["detail"]>("rcb-user-upload-file", {
            detail: { currPath: "start", prevPath: "intro", botId: currBotId },
        }) as RcbUserUploadFileEvent;
    
        // Call getValidator without specifying validatorType
        const validator = getValidator(eventWithPath, currBotId, flow);
        expect(validator).toBe(mockValidateTextInput);
    
        // Call the validator to ensure it behaves correctly
        const result = validator?.("test input");
        expect(result).toEqual(mockValidationResult);
    });
    test("returns undefined when flow object is empty", () => {
        const flow: Flow = {}; // Empty flow object
        const currBotId = "bot-id";
    
        const eventWithPath = new CustomEvent<RcbUserUploadFileEvent["detail"]>("rcb-user-upload-file", {
            detail: { currPath: "start", prevPath: "intro", botId: currBotId },
        }) as RcbUserUploadFileEvent;
    
        const validator = getValidator(eventWithPath, currBotId, flow, "validateFileInput");
        expect(validator).toBeUndefined();
    });
    
    

});

