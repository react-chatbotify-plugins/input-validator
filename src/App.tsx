import ChatBot, { Flow } from "react-chatbotify";

import RcbPlugin from "./factory/RcbPluginFactory";
import { InputValidatorBlock } from "./types/InputValidatorBlock";
import { validateFile } from "./utils/validateFile";

const App = () => {
  // Initialize the plugin
  const plugins = [RcbPlugin()];

  // Example flow for testing
  const flow: Flow = {
    start: {
      message: "Hey there! Please enter your age.",
      path: "age_validation",
      validateTextInput: (userInput?: string) => {
        if (userInput && !Number.isNaN(Number(userInput))) {
          return { success: true };
        }
        return {
          success: false,
          promptContent: "Age must be a number!",
          promptDuration: 3000,
          promptType: "error",
          highlightTextArea: true,
        };
      },
    } as InputValidatorBlock,

    age_validation: {
      message:
        "Great! Now please upload a profile picture (JPEG or PNG) or provide a URL.",
      path: "file_upload_validation",
      chatDisabled: true, // Set to true if you want to disable text input
      validateTextInput: (userInput?: string) => {
        console.log("validateTextInput called with userInput:", userInput);

        if (userInput && userInput.trim().length > 0) {
          // Optionally, validate if the input is a valid URL
          // For simplicity, we'll accept any non-empty text
          return { success: true };
        }

        return {
          success: false,
          promptContent:
            "Please provide a valid URL or upload a file.",
          promptDuration: 3000,
          promptType: "error",
        };
      },
      validateFileInput: (file?: File) => {
        return validateFile(file); // Validate file input
      },
      file: async ({ files }) => {
        console.log("Files received:", files);

        if (files && files[0]) {
          const validationResult = validateFile(files[0]);
          if (!validationResult.success) {
            console.error(validationResult.promptContent);
            // Return early to prevent success
            return { success: false };
          }
          console.log("File uploaded successfully:", files[0]);
        } else {
          console.error("No file provided.");
        }
      },
    } as InputValidatorBlock,

    file_upload_validation: {
      message:
        "Thank you! Your input has been received. You passed the validation!",
      path: "start",
    },
  };

  return (
    <ChatBot id="chatbot-id" plugins={plugins} flow={flow}></ChatBot>
  );
};

export default App;
