import React from "react";
import ChatBot, { Flow } from "react-chatbotify";
import RcbPlugin from "./factory/RcbPluginFactory";
import { InputValidatorBlock } from "./types/InputValidatorBlock";

const App = () => {
  // Initialize the plugin
  const plugins = [RcbPlugin()];

  const handleUpload = (params: { files?: FileList }) => {
    const files = params.files;

    if (!files || files.length === 0) {
      return { success: false, promptContent: "No file selected." };
    }

    const file = files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Debugging log for file details
    console.log("Uploaded file details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Adjusted MIME type checking
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      return {
        success: false,
        promptContent: "Only JPEG and PNG files are allowed.",
      };
    }

    if (file.size > maxSize) {
      return {
        success: false,
        promptContent: "File size must be less than 5MB.",
      };
    }

    // If all checks pass
    console.log("File validation passed:", file.name);
    return { success: true };
  };

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
      file: (params) => handleUpload(params),
      path: "file_upload_validation",
      // Removed validateInput
    },
    file_upload_validation: {
      message: "Thank you! Your profile picture has been uploaded successfully.",
      path: "end",
    },
    end: {
      message: "This is the end of the flow. Thank you!",
    },
  };

  return <ChatBot id="chatbot-id" plugins={plugins} flow={flow} />;
};

export default App;
