chrome.runtime.onMessage.addListener(
	// This is the message listener
	(request, sender, sendResponse) => {
		if (request.message === "inject") {
			const { content } = request;

			console.log(content);

			// If something went wrong, send a failed status
			if (!result) {
				sendResponse({ status: "failed" });
			}

			sendResponse({ status: "success" });
		}
	}
);
