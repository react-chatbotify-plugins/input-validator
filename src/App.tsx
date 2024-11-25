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
      chatDisabled: true, // Text input is disabled
      validateFileInput: (file?: File) => {
        return validateFile(file); // Validation is handled here
      },
      file: async ({ files }) => {
        console.log("Files received:", files);
    
        if (files && files[0]) {
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
