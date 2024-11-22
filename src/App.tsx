import React from "react";
import ChatBot, { Flow } from "react-chatbotify";
import RcbPlugin from "./factory/RcbPluginFactory";
import { InputValidatorBlock } from "./types/InputValidatorBlock";
import { validateFile } from "./utils/validateFile";

const App = () => {
  const plugins = [RcbPlugin()];

  const flow: Flow = {
    start: {
      message: "Hey there! Please enter your age.",
      path: "age_validation",
      validateInput: (userInput?: string) => {
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
      message: "Great! Now please upload a profile picture (JPEG or PNG).",
      path: "file_upload_validation",
      validateInput: (userInput?: string) => {
        console.log("validateInput called with userInput:", userInput);

        // Allow empty input or file names with allowed extensions
        if (
          !userInput ||
          /\.(jpg|jpeg|png)$/i.test(userInput.trim())
        ) {
          return { success: true };
        }

        // Disallow other text inputs
        return {
          success: false,
          promptContent: "Please upload a file.",
          promptDuration: 3000,
          promptType: "error",
        };
      },
      validateFile: (file?: File) => {
        return validateFile(file); // Validate file input
      },
      file: async ({ files }) => {
        console.log("Files received:", files);

        if (files && files[0]) {
          const validationResult = validateFile(files[0]);
          if (!validationResult.success) {
            console.error(validationResult.promptContent);
            return;
          }
          console.log("File uploaded successfully:", files[0]);
        } else {
          console.error("No file provided.");
        }
      },
    } as InputValidatorBlock,

    file_upload_validation: {
      message:
        "Thank you! Your profile picture has been uploaded successfully.",
      path: "end",
    },

    end: {
      message: "This is the end of the flow. Thank you!",
    },
  };

 

  return <ChatBot id="chatbot-id" plugins={plugins} flow={flow} />;
};

export default App;
