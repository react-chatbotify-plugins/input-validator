import ChatBot, { Flow } from "react-chatbotify";

import RcbPlugin from "./factory/RcbPluginFactory";
import { InputValidatorBlock } from "./types/InputValidatorBlock";
import { validateFile } from "./utils/validateFile";

const App = () => {
  // initialize example plugin
  const plugins = [RcbPlugin()];

  // example flow for testing
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

        
        if (
          userInput &&
          /\.(jpg|jpeg|png)$/i.test(userInput.trim())
        ) {
          return { success: true };
        }

        // Disallow other text inputs
        return {
          success: false,
          promptContent: "Please upload a valid file (JPEG or PNG). Empty inputs are not allowed.",
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
        "Thank you! Your picture has been uploaded successfully. You passed the file upload validation!",
      path: "start",
    },
  }

  return (
		<ChatBot
			id="chatbot-id"
			plugins={plugins}
			flow={flow}
		></ChatBot>
	);
}

export default App;
