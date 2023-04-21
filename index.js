// OPEN AI KEYS
const checkForKey = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(["openai-key"], (result) => {
			resolve(result["openai-key"]);
		});
	});
};

const encode = (input) => {
	return btoa(input);
};

const saveKey = () => {
	const input = document.getElementById("key_input");

	if (input) {
		const { value } = input;

		// Encode String
		const encodedValue = encode(value);

		// Save to google storage
		chrome.storage.local.set({ "openai-key": encodedValue }, () => {
			document.getElementById("key_needed").style.display = "none";
			document.getElementById("key_entered").style.display = "block";
		});
	}
};

const changeKey = () => {
	document.getElementById("key_needed").style.display = "block";
	document.getElementById("key_entered").style.display = "none";
};

document.getElementById("save_key_button").addEventListener("click", saveKey);
document
	.getElementById("change_key_button")
	.addEventListener("click", changeKey);

checkForKey().then((response) => {
	if (response) {
		document.getElementById("key_needed").style.display = "none";
		document.getElementById("key_entered").style.display = "block";
	}
});

// SET LANGUAGE TO TRANSLATE TO
const checkForLanguage = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(["translator-language"], (result) => {
			resolve(result["translator-language"]);
		});
	});
};

const encodeLang = (input) => {
	return btoa(input);
};

const saveLang = () => {
	const input = document.getElementById("lang_input");

	if (input) {
		const { value } = input;

		// Encode String
		const encodedValue = encodeLang(value);

		// Save to google storage
		chrome.storage.local.set({ "translator-language": encodedValue }, () => {
			document.getElementById("lang_needed").style.display = "none";
			document.getElementById("lang_entered").style.display = "block";
		});
	}
};

const changeLang = () => {
	document.getElementById("lang_needed").style.display = "block";
	document.getElementById("lang_entered").style.display = "none";
};

document.getElementById("save_lang_button").addEventListener("click", saveLang);
document
	.getElementById("change_lang_button")
	.addEventListener("click", changeLang);

checkForLanguage().then((response) => {
	if (response) {
		document.getElementById("lang_needed").style.display = "none";
		document.getElementById("lang_entered").style.display = "block";
	}
});