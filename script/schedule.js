'use strict';
(function () {
	window.onload = () => loadEvents();

	addNavbarHandlers();

	let personalScheduleButton =
        document.getElementById("make-personal")
                .addEventListener("click", generatePersonalisedSchedule);

	let applyFilterButton =
        document.getElementById("apply-filter")
                .addEventListener("click", generateScheduleByFilters);

	let resetFilterButton =
        document.getElementById("reset-filter")
                .addEventListener("click", removeFilters);
})();

function loadEvents() {
	const LOAD_SCHEDULE_METHOD = "GET";
	const LOAD_SCHEDULE_URL = "https://my-json-server.typicode.com/ivanchuchulski/events-db/events";

	loadEventsRequest(LOAD_SCHEDULE_URL, LOAD_SCHEDULE_METHOD);
}

function loadEventsRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => loadEventsHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function loadEventsHandler(xhr) {
	const okResponseCode = 200;

	let responseCode = xhr.status;
	let responseText = xhr.responseText;

	if (responseCode === okResponseCode) {
		console.log("success load schedule");
		drawEvents(responseText);
	} else {
		console.log("error : load schedule");
		displayMessage("грешка : събитията не може да бъдат заредени");
	}
}

function drawEvents(responseText) {
	let username = "test";
	document.getElementById("username").innerText += " " + username + "!";

	let eventList = JSON.parse(responseText);

	console.log("eventList : ")
	console.log(eventList);

	let eventParent = document.getElementById("event-list");

	Object.keys(eventList).forEach((event) => {
		let theme = eventList[event].theme;
		let presenterName = eventList[event].presenterName;
		let place = eventList[event].place;

		let facultyNumber = eventList[event].facultyNumber;
		let groupNumber = eventList[event].groupNumber;
		let dayNumber = eventList[event].dayNumber;

		// building date from presentations_data date
		let date = new Date(eventList[event].presentDate);

		let time = date.toLocaleTimeString();
		let temp = time.split(":");
		time = temp[0] + ":" + temp[1];

		let ymd = date.toDateString();
		let tempYMD = ymd.split(" ");
		ymd = `${tempYMD[2]} ${tempYMD[1]} ${tempYMD[3]}`;

		let presentDate = time + " " + ymd;

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
		timeinfo.getElementsByClassName('place-address')[0].style.display = "none";

		timeinfo.addEventListener("mouseover", showAddressOnHover);
		timeinfo.addEventListener("mouseleave", showMessageOnLeave)
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

function addNavbarHandlers() {
	let schedulePageButton = document.getElementById("schedule-page-button");
	schedulePageButton.addEventListener("click", () => window.location = "schedule.html");
	addHighlight(schedulePageButton);

	let personalSchedule =
        document.getElementById("personalised-schedule-button")
                .addEventListener("click", () => window.location = "personal-schedule.html");

	let statisticsButton =
        document.getElementById("view-statistics")
                .addEventListener("click", () => window.location = "statistics.html");

	let logoutButton =
        document.getElementById("logout-button")
                .addEventListener("click", logoutRequest);
}

function generateScheduleByFilters() {
	let daySelectElement = document.getElementById("filter-by-day");
	let groupSelectElement = document.getElementById("filter-by-group");

	let filterByDay = daySelectElement.options[daySelectElement.selectedIndex].value;
	let filterByGroup = groupSelectElement.options[groupSelectElement.selectedIndex].value;

	let events = document.getElementsByClassName("event");

	displayAllEvents();

	if (filterByDay) {
		filterEventsByDay(events, filterByDay.slice(-1));
	}

	if (filterByGroup) {
		filterEventsByGroup(events, filterByGroup.slice(-1));
	}
}

function filterEventsByDay(events, dayFilter) {
	for (let index = 0; index < events.length; index++) {
		const event = events[index];

		let eventDay = event.getElementsByClassName("day-number")[0].innerText.split(" ")[1];

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
	//console.log(events);

	for (let index = 0; index < events.length; index++) {
		let element = events[index];
		element.style.display = "flex";
	}
}

function removeSelectedFilters() {
	let daySelectElement = document.getElementById("filter-by-day");
	let groupSelectElement = document.getElementById("filter-by-group");

	daySelectElement.selectedIndex = 0;
	groupSelectElement.selectedIndex = 0;
}

function filterEventsByGroup(events, groupFilter) {
	for (let index = 0; index < events.length; index++) {
		const event = events[index];
		let eventGroup = event.getElementsByClassName("group-number")[0].innerText.split(" ")[1];

		//console.log(eventDay);

		if (eventGroup !== groupFilter) {
			hideEvent(event);
		}
	}
}

function addToPreferences() {
	const ACTIVE_CLASSNAME = "active";

	// first check if the this button is active
	if (this.classList.contains(ACTIVE_CLASSNAME)) {
		removeHightlight(this);
		return;
	}

	let preferenceButtons = this.parentElement.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		if (preferenceButtons[i].classList.contains(ACTIVE_CLASSNAME)) {
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

function generatePersonalisedSchedule() {
	const ACTIVE_CLASSNAME = "active";
	let preferences = [];
	let preferenceButtons = document.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		if (preferenceButtons[i].classList.contains(ACTIVE_CLASSNAME)) {
			preferences.push(generatePreferenceDetails(preferenceButtons[i]));
		}
	}

	if (preferences.length === 0) {
		// displayMessage("не сте избрали никакви събития!");
		goToPersonalSchedulePage("personal-schedule.html");
		return;
	}

	console.log("preferences");
	console.log(preferences);

	const LOAD_SCHEDULE_URL = "php/api.php/generatePersonalSchedule";
	const LOAD_SCHEDULE_METHOD = "POST";

	ajaxPersonalScheduleRequest(
		LOAD_SCHEDULE_URL,
		LOAD_SCHEDULE_METHOD,
		`preferencesData=${JSON.stringify(preferences)}`
	);
}

function generatePreferenceDetails(preferenceButton) {
	const THEME_CLASSNAME = "theme";
	const PREFERENCE_CLASSNAME_INDEX = 1;

	let event = preferenceButton.parentElement.parentElement;

	return {
		presentationTheme: event.getElementsByClassName(THEME_CLASSNAME)[0].innerText,
		preferenceType: preferenceButton.classList[PREFERENCE_CLASSNAME_INDEX],
	};
}

function ajaxPersonalScheduleRequest(url, method, data) {
	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", () => ajaxPersonalScheduleHandler(xhr));

	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function ajaxPersonalScheduleHandler(xhr) {
	let responseText = JSON.parse(xhr.responseText);

	if (responseText.success) {
		console.log("success generate personalised schedule");
		goToPersonalSchedulePage("personal-schedule.html");
	} else {
		displayMessage("грешка : невъзможност за генеране на персонален график");
		console.log("error : generate personalised schedule");
	}
}

function goToPersonalSchedulePage(pageUrl) {
	window.location = pageUrl;
}

function logoutRequest() {
	goToLoginPage("index.html");
}

function goToLoginPage(loginPageUrl) {
	window.location = loginPageUrl;
}

function displayMessage(text) {
	let messageLabel = document.getElementById("messageLabel");

	messageLabel.innerText = text;
}