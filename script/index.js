(function () {
	let registerButton = document.getElementById("register-button");
	let enterButton = document.getElementById("enter-button");

	registerButton.addEventListener("click", register);
	enterButton.addEventListener("click", login);
})();

function register(clickEvent) {
	try {
		clickEvent.preventDefault();

		let formData = {
			emailRegister: null,
			usernameRegister: null,
			passwordRegister: null,
		};

		formData["emailRegister"] = validateEmail("register-email");
		formData["usernameRegister"] = validateRegistrationUsername("register-username");
		formData["passwordRegister"] = validateRegistrationPassword("register-password");
		let passwordRepeatedRegister = validateRegistrationPasswordRepeated("register-password-repeated");

		checkIfPasswordsMatch(formData["passwordRegister"], passwordRepeatedRegister);

		const REGISTER_METHOD = "POST";
        const REGISTER_REQUEST_URL = "https://jsonplaceholder.typicode.com/users";

		sendRegistrationRequest(REGISTER_REQUEST_URL, REGISTER_METHOD, `formData=${JSON.stringify(formData)}`);
	} catch (exception) {
		displayRegistrationErrorMessage(exception);
	}
}

function login(clickEvent) {
	try {
		clickEvent.preventDefault();

		let formData = {
			usernameLogin: null,
			passwordLogin: null,
		};

		formData["usernameLogin"] = validateLoginUsername("login-username");
		formData["passwordLogin"] = validateLoginPassword("login-password");

		// can't make a POST request to this for now
		// const LOGIN_REQUEST_URL = "https://my-json-server.typicode.com/ivanchuchulski/events-db/users";

		const LOGIN_REQUEST_URL = "https://jsonplaceholder.typicode.com/users";
		const LOGIN_METHOD = "POST";

		sendLoginRequest(LOGIN_REQUEST_URL, LOGIN_METHOD, `formData=${JSON.stringify(formData)}`);
	} catch (exception) {
		displayLoginError(exception);
	}
}

function validateEmail(elementId) {
	const EMAIL_LENGTH_LOWER_LIMIT = 5;
	const EMAIL_LENGTH_UPPER_LIMIT = 50;
	const pattern = `^[A-Za-z0-9_-]{${EMAIL_LENGTH_LOWER_LIMIT},${EMAIL_LENGTH_UPPER_LIMIT}}@[a-z]+\.[a-z]+$`;
	const regex = new RegExp(pattern);

	let email = document.getElementById(`${elementId}`).value;

	if (email === "") {
		throw "грешка: имейлът е задължително поле";
	}

	if (!email.match(regex)) {
		throw "грешка: имейлът трябва да е във формат example0123-_@domain.com";
	}

	return formatInput(email);
}

function validateRegistrationUsername(elementId) {
	const PASSWORD_LENGTH_LOWER_LIMIT = 3;
	const EMAIL_LENGTH_UPPER_LIMIT = 50;
	const pattern = `^[A-Za-z0-9_-]{${PASSWORD_LENGTH_LOWER_LIMIT},${EMAIL_LENGTH_UPPER_LIMIT}}$`;
	const regex = new RegExp(pattern);

	let username = document.getElementById(`${elementId}`).value;

	if (username === "") {
		throw "грешка: потребителското име е задължително поле";
	}

	if (!username.match(regex)) {
		throw `грешка: потребителското име трябва да съдържа само букви, цифри, _ и -`;
	}

	return formatInput(username);
}

function validateRegistrationPassword(elementId) {
	const lowerLimit = 6;
	const upperLimit = 20;
	const pattern = `^[A-Za-z0-9]{${lowerLimit},${upperLimit}}$`;
	const regex = new RegExp(pattern);

	let password = document.getElementById(`${elementId}`).value;

	if (password === "") {
		throw `грешка: паролата е задължително поле`;
	}

	if (!containsUppercaseLetter(password)) {
		throw `грешка: паролата трябва да съдържа поне една главна буква`;
	}

	if (!containsDigit(password)) {
		throw `грешка: паролата трябва да съдържа поне една цифра`;
	}

	if (!password.match(regex)) {
		throw `грешка: паролата трябва да има дължина между ${lowerLimit} и ${upperLimit} символа`;
	}

	return formatInput(password);
}

function validateRegistrationPasswordRepeated(elementId) {
	try {
        return validateRegistrationPassword(elementId);
    }
    catch (exception) {
        const pattern = `паролата`;
        let temp = exception.replace(pattern, 'повторената парола');
        console.log(temp);
        throw temp;
    }
}

function validateLoginUsername(elementId) {
	let username = document.getElementById(`${elementId}`).value;

	if (username === "") {
		throw "грешка: потребителското име е задължително";
	}

	return formatInput(username);
}

function validateLoginPassword(elementId) {
	let password = document.getElementById(`${elementId}`).value;

	if (password === "") {
		throw "грешка: паролата е задължително поле";
	}

	return formatInput(password);
}

function checkIfPasswordsMatch(password, passwordRepeated) {
	if (password !== passwordRepeated) {
		throw "грешка: паролите трябва да съвпадат";
	}
}

function formatInput(formField) {
	formField = trimTrailingWhitespace(formField);
	formField = removeSlashes(formField);
	formField = removeHTMLSpecialCharacters(formField);

	return formField;
}

function containsUppercaseLetter(str) {
	return str.match(/[A-Z]/);
}

function containsDigit(str) {
	return str.match(/[0-9]/);
}

function trimTrailingWhitespace(str) {
	return str.trim();
}

function removeSlashes(str) {
	return str.replace(/\//g, "");
}

function removeHTMLSpecialCharacters(str) {
	let htmlSpecialCharactersMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;",
	};

	return str.replace(/[&<>"']/g, function (symbol) {
		return htmlSpecialCharactersMap[symbol];
	});
}

function sendRegistrationRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => registrationRequestHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function registrationRequestHandler(xhr) {
	const createdResponseCode = 201;

	let responseCode = xhr.status;
	// let responseText = JSON.parse(xhr.responseText);

	if (responseCode === createdResponseCode) {
		console.log("success register");
		displayRegistrationSuccessMessage("успешна регистрация!");

		let registrationForm = document.getElementById("registration-form");
		registrationForm.reset();
	} else {
		console.log("error : register");
		displayRegistrationErrorMessage('неуспешна регистация!');
	}
}

function sendLoginRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => loginRequestHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function loginRequestHandler(xhr) {
	// maybe for login the status should be 200, but can't really mock the response code
	const createdResponseCode = 201;

	let responseCode = xhr.status;
	// let responseText = JSON.parse(xhr.responseText);

	if (responseCode === createdResponseCode) {
		console.log("success login");
		displaySchedulePage("schedule.html");
	} else {
		displayLoginError('неуспешна регистация');
	}
}

function displaySchedulePage(pageURL) {
	window.location = pageURL;
}

function displayRegistrationSuccessMessage(message) {
	let errorLabel = document.getElementById("registration-label");

	errorLabel.style.color = "green";
	errorLabel.innerHTML = message;
}

function displayRegistrationErrorMessage(message) {
	let errorLabel = document.getElementById("registration-label");

	errorLabel.style.color = "red";
	errorLabel.innerHTML = message;
}

function displayLoginError(message) {
	let errorLabel = document.getElementById("login-error");

	errorLabel.innerHTML = message;
}

function printObject(object) {
	console.log(JSON.stringify(object, null, 4));
}
