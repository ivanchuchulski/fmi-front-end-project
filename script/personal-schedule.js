// using the javascript immediately-invoked function expression (IIFE)
(function () {
	window.onload = () => loadPersonalEvents();

	navigationButtonHandlers();

	let applyFilterButton = document
		.getElementById("apply-filter")
		.addEventListener("click", generateScheduleByFilters);

	let resetFilterButton = document
		.getElementById("reset-filter")
		.addEventListener("click", removeFilters);
})();

function loadPersonalEvents() {
	const PERSONAL_SCHEDULE_URL = "https://my-json-server.typicode.com/ivanchuchulski/events-db/preferences";
	const PERSONAL_SCHEDULE_METHOD = "GET";

	ajaxLoadPersonalScheduleRequest(PERSONAL_SCHEDULE_URL, PERSONAL_SCHEDULE_METHOD);
}

function ajaxLoadPersonalScheduleRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => ajaxLoadPersonalScheduleHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function ajaxLoadPersonalScheduleHandler(xhr) {
	const okResponseCode = 200;

	let responseCode = xhr.status;
	let responseText = xhr.responseText;

	if (responseCode === okResponseCode) {
		drawPersonalEvents(responseText);
	} else {
		displayMessage(
			"грешка : не е започната сесия или сесията е изтелкла(или персоналните събития не може да бъдат заредени)"
		);
	}
}

function drawPersonalEvents(responseText) {
	let eventParent = document.getElementById("personal-events");

	let username = "test"
	document.getElementById("username").innerText += " " + username + "!";

	let preferencesList = JSON.parse(responseText);

	console.log("eventList : ")
	console.log(preferencesList);

	if (preferencesList.length === 0) {
		displayMessage("Нямате избрани презентации!");
		return;
	}

	Object.keys(preferencesList).forEach((event) => {
		let theme = preferencesList[event].theme;
		let presentDate = preferencesList[event].presentDate;
		let presenterName = preferencesList[event].presenterName;
		let place = preferencesList[event].place;
		let preferenceType = preferencesList[event].preferenceType;

		let facultyNumber = preferencesList[event].facultyNumber;
		let groupNumber = preferencesList[event].groupNumber;
		let dayNumber = preferencesList[event].dayNumber;

		let eventElement = document.createElement("div");

		let details = document.createElement("div");
		let timeinfo = document.createElement("div");
		let preference = document.createElement("div");

		let willGoButton = document.createElement("button");
		let couldGoButton = document.createElement("button");

		eventElement.className += "event";
		details.className += "details";
		timeinfo.className += "timeinfo";
		preference.className += "preference";

		willGoButton.className += "preferenceButton willAttend";
		couldGoButton.className += "preferenceButton couldAttend";

		details.innerHTML = `
			<p class="theme">${theme}</p>
			<p class="presenter">${presenterName}, ${facultyNumber}</p>
			<p class="group-number"> Група ${groupNumber}</p>`;

		timeinfo.innerHTML = `
			<p class="date">${presentDate}</p>
			<p class="day-number">Ден ${dayNumber}</p>
			<p class="presentationSite">
				<a href=${place} target="_blank">
				<span class="place-message">Място на провеждане</span>
				<span class="place-address">${place}</span>
			</p>`;

		willGoButton.innerText += "ще отида";
		couldGoButton.innerText += "може би ще отида";

		eventParent.appendChild(eventElement);

		eventElement.appendChild(details);
		eventElement.appendChild(timeinfo);
		eventElement.appendChild(preference);

		preference.appendChild(willGoButton);
		preference.appendChild(couldGoButton);

		willGoButton.addEventListener("click", addToPreferences);
		couldGoButton.addEventListener("click", addToPreferences);

		// by default hide the place address link
		timeinfo.getElementsByClassName("place-address")[0].style.display = "none";

		timeinfo.addEventListener("mouseover", showAddressOnHover);
		timeinfo.addEventListener("mouseleave", showMessageOnLeave);

		if (preferenceType === "willAttend") {
			addHighlight(willGoButton);

			willGoButton.removeEventListener("click", addToPreferences);

			couldGoButton.style.display = "none";
		}
		else {
			addHighlight(couldGoButton);

			couldGoButton.removeEventListener("click", addToPreferences);

			willGoButton.style.display = "none";
		}
	});
}

function showAddressOnHover() {
	let placeMessageElement = this.getElementsByClassName('place-message')[0];
	let placeAddressElement = this.getElementsByClassName("place-address")[0];

	placeMessageElement.style.display = "none";
	placeAddressElement.style.display = "inline";
}

function showMessageOnLeave() {
	let placeMessageElement = this.getElementsByClassName('place-message')[0];
	let placeAddressElement = this.getElementsByClassName("place-address")[0];

	placeMessageElement.style.display = "inline";
	placeAddressElement.style.display = "none";
}

function navigationButtonHandlers() {
	let schedulePageButton = document
		.getElementById("schedule-page-button")
		.addEventListener("click", () => {
			window.location = "schedule.html";
		});

	let personalisedScheduleButton = document.getElementById("personalised-schedule-button");
	personalisedScheduleButton.addEventListener("click", () => {
		window.location = "personal-schedule.html";
	});

	let statisticsButton = document
		.getElementById("view-statistics")
		.addEventListener("click", () => {
			window.location = "statistics.html";
		});

	let logoutButton = document
		.getElementById("logout-button")
		.addEventListener("click", logoutRequest);

	addHighlight(personalisedScheduleButton);
}

function generateScheduleByFilters() {
	let daySelectElement = document.getElementById("filter-by-day");
	let groupSelectElement = document.getElementById("filter-by-group");
	let preferenceSelectElement = document.getElementById("filter-by-preference");

	let filterByDay = daySelectElement.options[daySelectElement.selectedIndex].value;
	let filterByGroup = groupSelectElement.options[groupSelectElement.selectedIndex].value;
	let filterByPreference =
		preferenceSelectElement.options[preferenceSelectElement.selectedIndex].value;

	let events = document.getElementsByClassName("event");

	displayAllEvents();

	if (filterByDay) {
		filterEventsByDay(events, filterByDay.slice(-1));
	}

	if (filterByGroup) {
		filterEventsByGroup(events, filterByGroup.slice(-1));
	}

	if (filterByPreference) {
		filterEventsByPreference(events, filterByPreference);
	}
}

function filterEventsByDay(events, dayFilter) {
	for (let index = 0; index < events.length; index++) {
		const event = events[index];
		let eventDay = event.getElementsByClassName("day-number")[0].innerText.split(" ")[1];

		//console.log(eventDay);

		if (eventDay !== dayFilter) {
			hideEvent(event);
		}
	}
}

function hideEvent(event) {
	event.style.display = "none";
}

function removeFilters() {
	displayAllEvents();
	removeSelectedFilters();
}

function displayAllEvents() {
	let daySelectElement = document.getElementById("filter-by-day");
	let groupSelectElement = document.getElementById("filter-by-group");

	let events = document.getElementsByClassName("event");

	for (let index = 0; index < events.length; index++) {
		let element = events[index];
		element.style.display = "flex";
	}
}

function removeSelectedFilters() {
	let daySelectElement = document.getElementById("filter-by-day");
	let groupSelectElement = document.getElementById("filter-by-group");
	let preferenceSelectElement = document.getElementById("filter-by-preference");

	daySelectElement.selectedIndex = 0;
	groupSelectElement.selectedIndex = 0;
	preferenceSelectElement.selectedIndex = 0;
}

function filterEventsByGroup(events, groupFilter) {
	for (let index = 0; index < events.length; index++) {
		const event = events[index];

		let eventGroup = event.getElementsByClassName("group-number")[0].innerText.split(" ")[1];

		if (eventGroup !== groupFilter) {
			hideEvent(event);
		}
	}
}

function filterEventsByPreference(events, preferenceFilter) {
	for (let index = 0; index < events.length; index++) {
		const event = events[index];
		let activePreferenceButton = event.getElementsByClassName("active")[0];
		let buttonPreference = activePreferenceButton.className.split(" ")[1];

		if (buttonPreference !== preferenceFilter) {
			hideEvent(event);
		}
	}
}



function addToPreferences() {
	const ACITVE_CLASSNAME = "active";

	// first check if the this button is active
	if (this.classList.contains(ACITVE_CLASSNAME)) {
		removeHightlight(this);
		return;
	}

	let preferenceButtons = this.parentElement.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		if (preferenceButtons[i].classList.contains(ACITVE_CLASSNAME)) {
			removeHightlight(preferenceButtons[i]);
			generatePreferenceDetails(preferenceButtons[i]);
		}
	}

	addHighlight(this);
	generatePreferenceDetails(this);
}

function addHighlight(preferenceButton) {
	preferenceButton.className += " active";
}

function removeHightlight(preferenceButton) {
	preferenceButton.className = preferenceButton.className.replace(" active", "");
}

function updatePersonalSchedule() {
	const ACITVE_CLASSNAME = "active";
	let preferences = [];
	let preferenceButtons = document.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		if (preferenceButtons[i].classList.contains(ACITVE_CLASSNAME)) {
			preferences.push(generatePreferenceDetails(preferenceButtons[i]));
		}
	}

	if (preferences.length === 0) {
		displayMessage("грешка : моля изберете действие за събитието");
		return;
	}

	// console.log("preferences");
	// console.log(preferences);

	const UPDATE_SCHEDULE_URL = "php/api.php/updatePersonalSchedule";
	const UPDATE_SCHEDULE_METHOD = "POST";

	ajaxUpdatePersonalScheduleRequest(
		UPDATE_SCHEDULE_URL,
		UPDATE_SCHEDULE_METHOD,
		`preferencesData=${JSON.stringify(preferences)}`
	);
}

function ajaxUpdatePersonalScheduleRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => ajaxUpdatePersonalScheduleHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function ajaxUpdatePersonalScheduleHandler(xhr) {
	let response = JSON.parse(xhr.responseText);

	if (response.success) {
		console.log("success update personalised schedule");
		goToPersonalSchedulePage("personal-schedule.html");
	} else {
		console.log("error : generate personalised schedule");
		displayMessage("грешка : невъзможност за обновяваве на персонален график");
	}
}

function generatePreferenceDetails(preferenceButton) {
	const THEME_CLASSNAME = "theme";
	const PREFERENCE_CLASSNAME_INDEX = 1;

	let event = preferenceButton.parentElement.parentElement;

	let preferenceObj = {
		presentationTheme: event.getElementsByClassName(THEME_CLASSNAME)[0].innerText,
		preferenceType: preferenceButton.classList[PREFERENCE_CLASSNAME_INDEX],
	};

	return preferenceObj;
}

function logoutRequest() {
	const LOGOUT_URL = "php/api.php/logout";
	const LOGOUT_METHOD = "POST";

	ajaxLogoutRequest(LOGOUT_URL, LOGOUT_METHOD);
}

function ajaxLogoutRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => ajaxLogoutHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function ajaxLogoutHandler(xhr) {
	let response = JSON.parse(xhr.responseText);

	if (response.success) {
		console.log("success : logout request");
		goToLoginPage("index.html");
	} else {
		console.log("error : logout request");
	}
}

function goToSchedulePage(schedulePageUrl) {
	window.location = schedulePageUrl;
}

function goToPersonalSchedulePage(schedulePageUrl) {
	window.location = schedulePageUrl;
}

function goToLoginPage(loginPageUrl) {
	window.location = loginPageUrl;
}

function displayMessage(text) {
	let messageLabel = document.getElementById("messageLabel");

	messageLabel.innerText = text;
}
