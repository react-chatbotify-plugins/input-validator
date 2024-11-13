import ChatBot, { Flow } from "react-chatbotify";

import RcbPlugin from "./factory/RcbPluginFactory";
import { InputValidatorBlock } from "./types/InputValidatorBlock";

const App = () => {
	// initialize example plugin
	const plugins = [RcbPlugin()];

	// example flow for testing
	const flow: Flow = {
		start: {
			message: "Hey there, please enter your age!",
			path: "try_again",
			validateInput: (userInput: string) => {
				if (typeof userInput === "string" && !Number.isNaN(Number(userInput))) {
					return {success: true};
				}
				return {success: false, promptContent: "Age must be a number!", promptDuration: 3000, promptType: "error", highlightTextArea: true};
			}
		} as InputValidatorBlock,
		try_again : {
			message: "Look at how your message string is reversed! Try again!",
			path: "try_again",
		}
	}

	return (
		<ChatBot
			id="chatbot-id"
			plugins={plugins}
			flow={flow}
			// settings={{event:{rcbUserSubmitText: true}}}
		></ChatBot>
	);
}

export default App;