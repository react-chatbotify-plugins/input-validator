<p align="center">
  <img width="200px" src="https://raw.githubusercontent.com/tjtanjin/react-chatbotify/main/src/assets/logo.png" />
  <h1 align="center">Input Validator</h1>
</p>

<p align="center">
  <a href="https://github.com/react-chatbotify-plugins/react-chatbotify-plugin-template/actions/workflows/ci-cd-pipeline.yml"> <img src="https://github.com/react-chatbotify-plugins/input-validator/actions/workflows/ci-cd-pipeline.yml/badge.svg" /> </a>
  <a href="https://www.npmjs.com/package/@rcb-plugins/input-validator"> <img src="https://img.shields.io/npm/v/@rcb-plugins/input-validator?logo=semver&label=version&color=%2331c854" /> </a>
  <a href="https://www.npmjs.com/package/@rcb-plugins/input-validator"> <img src="https://img.shields.io/badge/react-16--19-orange?logo=react&label=react" /> </a>
</p>

## Table of Contents

* [Introduction](#introduction)
* [Quickstart](#quickstart)
* [Features](#features)
* [API Documentation](#api-documentation)
* [Team](#team)
* [Contributing](#contributing)
* [Others](#others)

### Introduction

<Add demo gif>

**Input Validator** is a plugin that adds user input validation to the [**React ChatBotify Core Library**](https://react-chatbotify.com). By default, the core library does not ship with user input validation. This plugin relies on chatbot events to intercept & validate messages, as well as chatbot hooks to provide visual feedback to users. The demo gif above should give you a pretty good idea of what this plugin is capable of doing.

For support, join the plugin community on [**Discord**](https://discord.gg/J6pA4v3AMW) to connect with other developers and get help.

### Quickstart

The plugin is incredibly straightforward to use and is [**available on npm**](https://www.npmjs.com/package/@rcb-plugins/input-validator). Simply follow the steps below:

1. Install the plugin with the following command within your project folder:
   ```bash
   npm install @rcb-plugins/input-validator
   ```

2. Import the plugin:
   ```javascript
   import InputValidator from "@rcb-plugins/input-validator";
   ```

3. Initialize the plugin within the `plugins` prop of `ChatBot`:
   ```javascript
   import ChatBot from "react-chatbotify";
   import InputValidator from "@rcb-plugins/input-validator";

   const MyComponent = () => {
     return (
       <ChatBot plugins=[InputValidator()]/>
     );
   };
   ```

4. Add the `validateInput` attribute to the [**Block**](https://react-chatbotify.com/docs/concepts/conversations#block) that requires validation:
   ```javascript
   import ChatBot from "react-chatbotify";
   import InputValidator, { InputValidatorBlock } from "@rcb-plugins/input-validator";

   const MyComponent = () => {
     const flow = {
       start: {
         message: "What is your age?"
         validateInput: (userInput) => {
           if (isNaN(userInput)) {
             return {success: false, promptContent: "Age must be a number!", promptDuration: 3000}
           }
         }
       } as InputValidatorBlock
     }

     return (
       <ChatBot plugins=[InputValidator()]/>
     );
   };
   ```

The quickstart above shows how input validation can be done for **age input (e.g. ensuring that age is a number)**. The documentation website for the React ChatBotify Core Library also contains a [**live input validation example**](https://react-chatbotify.com/docs/examples/input_validation) that uses this plugin. You may wish to check it out!

### Features

**Input Validator** is a lightweight plugin that provides the following features to your chatbot:
- Validate user input submissions
- Notify users with toasts/highlights upon successful/failed validations
- Advanced styling options upon successful/failed validations
- Auto setups with necessary events enabled out-of-the-box (plug & play!)

### API Documentation

#### Plugin Configuration

The `InputValidator` plugin accepts a configuration object that allows you to customize its behavior and appearance. An example configuration is passed in below to initialize the plugin:

```javascript
import ChatBot from "react-chatbotify";
import InputValidator from "@rcb-plugins/input-validator";

const MyComponent = () => {
  const pluginConfig = {
    // defaults to true, auto enable events required for plugin to work
    autoConfig: true,
    // base color schemes used for toasts, based on validation result
    promptBaseColors: {
      "error": "#dc3545",
		  "success": "#28a745",
    },
    // color schemes used when toasts are hovered, based on validation result
    promptHoveredColors: {
      "error": "#c82333",
      "success": "#218838",
    },
    // color schemes used for text area highlights, based on validation result
    textAreaHighlightColors: {
      "error": "#dc3545",
      "success": "#28a745",
	  }
    // advanced styles to reflect validation result in other parts of the chatbot
    advancedStyles: {
      error: {
        sendButtonStyle: { backgroundColor: "red" },
      },
    },
  }

  return (
    <ChatBot plugins={[InputValidator(pluginConfig)]}/>
  )
}
```

As you may be able to tell from above, there are 5 configurable sections within the plugin configuration which are `autoConfig`, `promptBaseColors`, `promptHoveredColors`, `textAreaHighlightColors` and `advancedStyles`. These are described in the table below:

| Configuration Option         | Type     | Default Value                                                                                                                                                                                                                 | Description                                                                                                               |
|------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `autoConfig`                 | Boolean  | `true`                                                                                                                                                                                                                        | Enables automatic configuration of required events for input validation. Recommended to keep as `true`. If set to `false`, you need to configure events manually. |
| `promptBaseColors`           | Object   | `{ "info": "#007bff", "warning": "#ffc107", "error": "#dc3545", "success": "#28a745" }`                                                                                                                                      | Maps prompt types to colors shown in toast notifications for validation results (success, error, etc.). Define custom prompt types and colors.                    |
| `promptHoveredColors`        | Object   | `{ "info": "#0056b3", "warning": "#d39e00", "error": "#c82333", "success": "#218838" }`                                                                                                                                       | Maps prompt types to colors shown when toast notifications are hovered over during validation. Define custom prompt types and colors.                             |
| `textAreaHighlightColors`    | Object   | `{ "info": "#007bff", "warning": "#ffc107", "error": "#dc3545", "success": "#28a745" }`                                                                                                                                       | Maps prompt types to colors shown in the text area according to validation results. Define custom prompt types and colors.                                       |
| `advancedStyles`             | Object   | `{}`                                                                                                                                                                                                                          | Customizes styles for different validation results across the chatbot (not just toast notifications). Each key is a prompt type with corresponding style properties. |

#### Validating User Input

To validate user input, add the `validateInput` attribute to any Block that requires validation. The `validateInput` attribute is a function that receives the user's input and returns an object indicating the validation result. An example can be seen below:

```javascript
import ChatBot from "react-chatbotify";
import InputValidator from "@rcb-plugins/input-validator";

const MyComponent = () => {
  const flow = {
    start: {
      message: "What is your age?",
      validateInput: (userInput) => {
        if (isNaN(userInput)) {
          return {
            success: false,
            promptContent: "Age must be a number!",
            promptDuration: 3000,
            promptType: 'error',
            highlightTextarea: true,
          };
        }
        return { success: true };
      },
    },
    // ... other blocks
  };

  return (
    <ChatBot plugins={[InputValidator(pluginConfig)]}/>
  )
}
```

As you can see from the example above, `validateInput` takes in a `userInput` parameter and returns an object representing the validation result. The validation result contains a total of 5 fields described in the table below:

| Field               | Type     | Required | Description                                                                                                                                 |
|---------------------|----------|----------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `success`           | Boolean  | Yes      | If `true`, validation passed and user input is allowed to be sent. If `false`, user input is blocked.                                       |
| `promptContent`     | String   | No       | The message displayed to the user if validation fails (e.g., "Age must be a number!").                                                      |
| `promptDuration`    | Number   | No       | The duration (in milliseconds) that the prompt message is shown.                                                                            |
| `promptType`        | String   | No       | Defines the type of prompt to display (e.g., "error", "warning", etc.), which influences styling and colors set in plugin configurations.   |
| `highlightTextArea` | Boolean  | No       | If set to `true`, highlights the input text area according to validation result, providing more visual feedback.                            |

### Team

* [Tan Jin](https://github.com/tjtanjin)

### Contributing

If you have code to contribute to the project, open a pull request from your fork and describe 
clearly the changes and what they are intended to do (enhancement, bug fixes etc). Alternatively,
you may simply raise bugs or suggestions by opening an issue.

### Others

For any questions regarding the project, please reach out for support via **[discord](https://discord.gg/J6pA4v3AMW).**