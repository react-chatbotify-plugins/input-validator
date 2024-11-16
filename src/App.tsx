// src/App.tsx

import React from "react";
import ChatBot, { Flow } from "react-chatbotify";

import RcbPlugin from "./factory/RcbPluginFactory";
import { InputValidatorBlock } from "./types/InputValidatorBlock";
import { ValidationResult } from "./types/ValidationResult";

const App = () => {
    // Initialize the plugin
    const plugins = [RcbPlugin()];

    // Define the validation function for file uploads
    const validateFile = (userInput?: File): ValidationResult => {
        if (!userInput) {
            return { success: false, promptContent: "No file selected.", promptType: "error" };
        }

        const allowedTypes = ["image/jpeg", "image/png"];
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(userInput.type)) {
            return {
                success: false,
                promptContent: "Only JPEG and PNG images are allowed.",
                promptType: "error",
            };
        }

        if (userInput.size > maxSizeInBytes) {
            return {
                success: false,
                promptContent: "File size must be less than 5MB.",
                promptType: "error",
            };
        }

        return { success: true };
    };

    // Define the flow
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
            validateInput: validateFile,
        } as InputValidatorBlock,
        file_upload_validation: {
            message: "Thank you! Your profile picture has been uploaded successfully.",
            path: "end",
        },
        end: {
            message: "This is the end of the flow. Thank you!",
        },
    };

    return (
        <ChatBot id="chatbot-id" plugins={plugins} flow={flow} />
    );
};

export default App;
