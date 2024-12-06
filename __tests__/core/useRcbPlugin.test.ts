import { renderHook, fireEvent } from "@testing-library/react";
import { validateFile } from "../../src/utils/validateFile";
import { getValidator } from "../../src/utils/getValidator";
import useRcbPlugin from "../../src/core/useRcbPlugin";

const mockReplaceStyles = jest.fn();
const mockShowToast = jest.fn();

// Mock react-chatbotify dependencies
jest.mock("react-chatbotify", () => ({
    useToasts: jest.fn(() => ({ showToast: mockShowToast })),
    useBotId: jest.fn(() => ({ getBotId: jest.fn().mockReturnValue("bot-id") })),
    useFlow: jest.fn(() => ({ getFlow: jest.fn() })),
    useStyles: jest.fn(() => ({
        styles: {},
        updateStyles: jest.fn(),
        replaceStyles: mockReplaceStyles,
    })),
}));

jest.mock("../../src/utils/validateFile", () => ({
    validateFile: jest.fn(),
}));

jest.mock("../../src/utils/getValidator", () => ({
    getValidator: jest.fn(),
}));

const mockedValidateFile = validateFile as jest.Mock;
const mockedGetValidator = getValidator as jest.Mock;

mockedValidateFile.mockReturnValue({
    success: false,
    promptContent: "Invalid file type",
});

mockedGetValidator.mockReturnValue(mockedValidateFile);

// Define custom event interfaces
interface FileUploadEvent extends Event {
    data: { files: File[] | null };
}

interface TextInputEvent extends Event {
    data: { inputText: string };
}

// Helper functions
const createFileUploadEvent = (files: File[] | null): FileUploadEvent => {
    const event = new Event("rcb-user-upload-file") as FileUploadEvent;
    event.data = { files };
    return event;
};

const createTextInputEvent = (inputText: string): TextInputEvent => {
    const event = new Event("rcb-user-submit-text") as TextInputEvent;
    event.data = { inputText };
    return event;
};

const renderRcbPluginHook = () => renderHook(() => useRcbPlugin());

describe("useRcbPlugin", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("File Upload Handling", () => {
        describe("Valid and Invalid Files", () => {
            test("displays error for invalid file", () => {
                const mockFile = new File(["invalid content"], "test.txt", { type: "text/plain" });
                mockedValidateFile.mockReturnValue({
                    success: false,
                    promptContent: "Invalid file type",
                });

                renderRcbPluginHook();
                const uploadEvent = createFileUploadEvent([mockFile]);
                fireEvent(window, uploadEvent);

                expect(mockedValidateFile).toHaveBeenCalledWith(mockFile);
                expect(mockShowToast).toHaveBeenCalledWith("Invalid file type", 3000);
            });

            test("does nothing for valid file", () => {
                const mockFile = new File(["valid content"], "test.png", { type: "image/png" });
                mockedValidateFile.mockReturnValue({ success: true });

                renderRcbPluginHook();
                const uploadEvent = createFileUploadEvent([mockFile]);
                fireEvent(window, uploadEvent);

                expect(mockedValidateFile).toHaveBeenCalledWith(mockFile);
                expect(mockShowToast).not.toHaveBeenCalled();
            });
        });

        describe("Edge Cases", () => {
            test("handles null file upload", () => {
                renderRcbPluginHook();
                const uploadEvent = createFileUploadEvent(null);
                fireEvent(window, uploadEvent);

                expect(mockedValidateFile).not.toHaveBeenCalled();
                expect(mockShowToast).not.toHaveBeenCalled();
            });

            test("handles empty file upload", () => {
                renderRcbPluginHook();
                const uploadEvent = createFileUploadEvent([]);
                fireEvent(window, uploadEvent);

                expect(mockedValidateFile).not.toHaveBeenCalled();
                expect(mockShowToast).not.toHaveBeenCalled();
            });
        });
    });

    describe("Text Input Handling", () => {
        describe("Valid and Invalid Input", () => {
            test("displays error for invalid input", () => {
                const mockValidator = jest.fn().mockReturnValue({
                    success: false,
                    promptContent: "Invalid input",
                });

                mockedGetValidator.mockReturnValue(mockValidator);

                renderRcbPluginHook();
                const textEvent = createTextInputEvent("invalid text");
                fireEvent(window, textEvent);

                expect(mockValidator).toHaveBeenCalledWith("invalid text");
                expect(mockShowToast).toHaveBeenCalledWith("Invalid input", 3000);
            });

            test("does nothing for valid input", () => {
                const mockValidator = jest.fn().mockReturnValue({ success: true });
                mockedGetValidator.mockReturnValue(mockValidator);

                renderRcbPluginHook();
                const textEvent = createTextInputEvent("valid input");
                fireEvent(window, textEvent);

                expect(mockValidator).toHaveBeenCalledWith("valid input");
                expect(mockShowToast).not.toHaveBeenCalled();
            });
        });

        test("displays error for empty text input", () => {
            const mockValidator = jest.fn().mockReturnValue({
                success: false,
                promptContent: "Input cannot be empty",
            });

            mockedGetValidator.mockReturnValue(mockValidator);

            renderRcbPluginHook();
            const textEvent = createTextInputEvent("");
            fireEvent(window, textEvent);

            expect(mockValidator).toHaveBeenCalledWith("");
            expect(mockShowToast).toHaveBeenCalledWith("Input cannot be empty", 3000);
        });
    });

    describe("Styles Restoration", () => {
        test("restores styles after all toasts are dismissed", () => {
            renderRcbPluginHook();
            const dismissEvent = new Event("rcb-dismiss-toast");
            fireEvent(window, dismissEvent);

            setTimeout(() => {
                expect(mockReplaceStyles).toHaveBeenCalled();
            }, 0);
        });
    });
});
