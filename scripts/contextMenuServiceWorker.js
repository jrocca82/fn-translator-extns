const getKey = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(["openai-key"], (result) => {
			if (result["openai-key"]) {
				const decodedKey = atob(result["openai-key"]);
				resolve(decodedKey);
			}
		});
	});
};

const getLang = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(["translator-language"], (result) => {
			if (result["translator-language"]) {
				const decodedLang = atob(result["translator-language"]);
				resolve(decodedLang);
			}
		});
	});
};

const sendMessage = (content) => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const activeTab = tabs[0].id;

		chrome.tabs.sendMessage(
			activeTab,
			{ message: "inject", content },
			(response) => {
				if (response.status === "failed") {
					console.log("injection failed.");
				}
			}
		);
	});
};

const generate = async (prompt) => {
	const key = await getKey();
	const url = "https://api.openai.com/v1/completions";

	const completionResponse = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${key}`,
		},
		body: JSON.stringify({
			model: "text-davinci-003",
			prompt: prompt,
			max_tokens: 1250,
			temperature: 0.7,
		}),
	});

	// Select the top choice and send back
	const completion = await completionResponse.json();
	return completion.choices.pop();
};

const generateCompletionAction = async (info) => {
	try {
    const lang = await getLang();
    sendMessage(`Translating function to ${lang}`);
		const { selectionText } = info;
		const basePromptPrefix = `
        Detect what language the function below is written in.
              
        Function:
        `;

		const baseCompletion = await generate(
			`${basePromptPrefix}${selectionText}`
		);

		const secondPrompt = `
        Take this function and detect the language it is written in. Then, rewrite the function in ${lang}.
        
        Function: ${selectionText}
        
        Original Language: ${baseCompletion.text}
        
        Translated Function:
        `;

		// Call your second prompt
		const secondPromptRes = await generate(secondPrompt);
    sendMessage(secondPromptRes.text);
	} catch (error) {
		console.log(error);
    sendMessage(error.toString());
	}
};

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "context-run",
		title: "Translate function",
		contexts: ["selection"],
	});
});

chrome.contextMenus.onClicked.addListener(generateCompletionAction);
