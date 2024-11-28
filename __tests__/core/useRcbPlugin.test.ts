import { renderHook, fireEvent } from "@testing-library/react";
import { validateFile } from "../../src/utils/validateFile";
import { getValidator } from "../../src/utils/getValidator";
import useRcbPlugin from "../../src/core/useRcbPlugin";

const mockReplaceStyles = jest.fn();
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

const mockShowToast = jest.fn();

describe("useRcbPlugin", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test("handles file upload and displays error for invalid file", () => {
        const mockFile = new File(["invalid content"], "test.txt", { type: "text/plain" });
    
        // Mock validateFile behavior
        mockedValidateFile.mockReturnValue({
            success: false,
            promptContent: "Invalid file type",
        });
    
        // Render the hook
        renderHook(() => useRcbPlugin());
    
        // Simulate file upload event
        const uploadEvent = new Event("rcb-user-upload-file");
        (uploadEvent as any).data = { files: [mockFile] };
        fireEvent(window, uploadEvent);
    
        // Debugging output
        console.log("validateFile calls:", mockedValidateFile.mock.calls);
        console.log("showToast calls:", mockShowToast.mock.calls);
    
        // Assertions
        expect(mockedValidateFile).toHaveBeenCalledWith(mockFile);
        expect(mockShowToast).toHaveBeenCalledWith("Invalid file type", 3000);
    });
    
    test("handles file upload and does nothing for valid file", () => {
        const mockFile = new File(["valid content"], "test.png", { type: "image/png" });

        // Mock validateFile to return success
        (validateFile as jest.Mock).mockReturnValue({
            success: true,
        });

        // Mock getValidator to return the validateFile function
        (getValidator as jest.Mock).mockReturnValue(validateFile);

        renderHook(() => useRcbPlugin());

        // Simulate file upload event
        const uploadEvent = new Event("rcb-user-upload-file");
        (uploadEvent as any).data = { files: [mockFile] }; // Attach mock data
        fireEvent(window, uploadEvent);

        // Assertions
        expect(validateFile).toHaveBeenCalledWith(mockFile);
        expect(mockShowToast).not.toHaveBeenCalled(); // No toast for valid file
    });

    test("handles text input and displays error for invalid input", () => {
    const mockValidator = jest.fn().mockReturnValue({
        success: false,
        promptContent: "Invalid input",
    });

    // Mock getValidator to return the text validator
    mockedGetValidator.mockReturnValue(mockValidator);

    renderHook(() => useRcbPlugin());

    // Simulate text input event
    const textEvent = new Event("rcb-user-submit-text");
    (textEvent as any).data = { inputText: "invalid text" };
    fireEvent(window, textEvent);

    // Assertions
    expect(mockValidator).toHaveBeenCalledWith("invalid text");
    expect(mockShowToast).toHaveBeenCalledWith("Invalid input", 3000);
    });

    test("handles text input and does nothing for valid input", () => {
        const mockValidator = jest.fn().mockReturnValue({ success: true });
    
        // Mock getValidator to return the text validator
        mockedGetValidator.mockReturnValue(mockValidator);
    
        renderHook(() => useRcbPlugin());
    
        // Simulate text input event
        const textEvent = new Event("rcb-user-submit-text");
        (textEvent as any).data = { inputText: "valid input" };
        fireEvent(window, textEvent);
    
        // Assertions
        expect(mockValidator).toHaveBeenCalledWith("valid input");
        expect(mockShowToast).not.toHaveBeenCalled(); // No toast for valid input
    });

    test("handles empty text input validation", () => {
        const mockValidator = jest.fn().mockReturnValue({
            success: false,
            promptContent: "Input cannot be empty",
        });
    
        mockedGetValidator.mockReturnValue(mockValidator);
    
        renderHook(() => useRcbPlugin());
    
        const textEvent = new Event("rcb-user-submit-text");
        (textEvent as any).data = { inputText: "" };
        fireEvent(window, textEvent);
    
        // Assertions
        expect(mockValidator).toHaveBeenCalledWith("");
        expect(mockShowToast).toHaveBeenCalledWith("Input cannot be empty", 3000);
    });
    
    test("handles null file upload", () => {
        renderHook(() => useRcbPlugin());
    
        const uploadEvent = new Event("rcb-user-upload-file");
        (uploadEvent as any).data = { files: null };
        fireEvent(window, uploadEvent);
    
        // Assertions
        expect(mockedValidateFile).not.toHaveBeenCalled();
        expect(mockShowToast).not.toHaveBeenCalled();
    });
    
    test("handles empty file upload", () => {
        renderHook(() => useRcbPlugin());
    
        // Simulate empty file upload event
        const uploadEvent = new Event("rcb-user-upload-file");
        (uploadEvent as any).data = { files: [] };
        fireEvent(window, uploadEvent);
    
        // Assertions
        expect(mockedValidateFile).not.toHaveBeenCalled();
        expect(mockShowToast).not.toHaveBeenCalled(); // No toast for empty file list
    });
    test("restores styles after all toasts are dismissed", () => {
        renderHook(() => useRcbPlugin());
    
        // Simulate toast dismissal event
        const dismissEvent = new Event("rcb-dismiss-toast");
        fireEvent(window, dismissEvent);
    
        // Verify that styles are restored
        setTimeout(() => {
            expect(mockReplaceStyles).toHaveBeenCalled();
        }, 0);
    });

});
