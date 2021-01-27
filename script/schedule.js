'use strict';
(function () {
	window.onload = () => loadEvents();

	addNavbarHandlers();

	let personalScheduleButton =
        document.getElementById("make-personal")
                .addEventListener("click", generatePersonalisedSchedule);

	let applyFilterButton =
        document.getElementById("apply-filter")
                .addEventListener("click", applyFiltersToEvents);

	let resetFilterButton =
        document.getElementById("reset-filter")
                .addEventListener("click", removeFilters);
})();

function loadEvents() {
	const LOAD_SCHEDULE_METHOD = "GET";
	// const LOAD_SCHEDULE_URL = "https://my-json-server.typicode.com/ivanchuchulski/events-db/events";
	const LOAD_SCHEDULE_URL = "data/events.json";

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
	document.getElementById("username").innerText += ", " + username + "!";

	let eventList = JSON.parse(responseText);

	console.log("eventList : ")
	console.log(eventList);

	let eventParent = document.getElementById("event-list");

	for (let event of eventList) {
		let {theme, presenterName, place, facultyNumber, groupNumber, dayNumber, presentDate} = event;

		let date = new Date(presentDate);
		let eventTime = date.toLocaleTimeString().split(":").splice(0, 2).join(":");
		let yearMonthDay = date.toDateString().split(" ").splice(1, 3).join(" ");

		let eventDateFormatted = eventTime + ", " + yearMonthDay;

		let eventElement = document.createElement("section");

		let details = document.createElement("section");
		let themeParagraph = document.createElement("p")
		let presenterParagraph = document.createElement("p")
		let groupNumberParagraph = document.createElement("p")

		let timeinfo = document.createElement("section");
		let dateParagraph = document.createElement("p");
		let dayParagraph = document.createElement("p");
		let presentationSiteParagraph = document.createElement("p");
		let placeLink = document.createElement("a");
		let placeMessageSpan = document.createElement("span");
		let placeAddressSpan = document.createElement("span");

		let preference = document.createElement("section");
		let willGoButton = document.createElement("button");
		let couldGoButton = document.createElement("button");

		eventElement.className += "event";

		// details section
		details.className += "details";

		themeParagraph.className += "theme";
		themeParagraph.innerText += theme;

		presenterParagraph.className += "presenter";
		presenterParagraph.innerText += `${presenterName}, ${facultyNumber}`;

		groupNumberParagraph.className += "groupNumber";
		groupNumberParagraph.innerText += `Група ${groupNumber}`;

		// timeinfo section
		timeinfo.className += "timeinfo";

		dateParagraph.className += "date";
		dateParagraph.innerText += eventDateFormatted;

		dayParagraph.className += "dayNumber";
		dayParagraph.innerText += `Ден ${dayNumber}`;

		presentationSiteParagraph.className += "presentationSite";

		placeLink.href = place;
		placeLink.target = "_blank";

		placeMessageSpan.className = "placeMessage";
		placeMessageSpan.innerText += "Място на провеждане";

		placeAddressSpan.className = "placeAddress";
		placeAddressSpan.innerText += place

		// preferences section
		preference.className += "preference";

		willGoButton.className += "preferenceButton willAttend";
		willGoButton.innerText += "ще отида";

		couldGoButton.className += "preferenceButton couldAttend";
		couldGoButton.innerText += "може би ще отида";

		// appending the elements in the DOM
		// details section
		details.appendChild(themeParagraph);
		details.appendChild(presenterParagraph);
		details.appendChild(groupNumberParagraph);

		// timeinfo section
		presentationSiteParagraph.appendChild(placeLink);
		placeLink.appendChild(placeMessageSpan);
		placeLink.appendChild(placeAddressSpan);

		timeinfo.appendChild(dateParagraph);
		timeinfo.appendChild(dayParagraph);
		timeinfo.appendChild(presentationSiteParagraph);

		// preference section
		preference.appendChild(willGoButton);
		preference.appendChild(couldGoButton);

		// event section
		eventElement.appendChild(details);
		eventElement.appendChild(timeinfo);
		eventElement.appendChild(preference);

		eventParent.appendChild(eventElement);

		// adding event listeners
		willGoButton.addEventListener("click", addToPreferences);
		couldGoButton.addEventListener("click", addToPreferences);

		// by default hide the place address link
		timeinfo.getElementsByClassName('placeAddress')[0].style.display = "none";

		timeinfo.addEventListener("mouseover", showAddressOnHover);
		timeinfo.addEventListener("mouseleave", showMessageOnLeave);
	}
}

function showAddressOnHover() {
	let placeMessageElement = this.getElementsByClassName('placeMessage')[0];
	let placeAddressElement = this.getElementsByClassName("placeAddress")[0];

	placeMessageElement.style.display = "none";
	placeAddressElement.style.display = "inline";
}

function showMessageOnLeave() {
	let placeMessageElement = this.getElementsByClassName('placeMessage')[0];
	let placeAddressElement = this.getElementsByClassName("placeAddress")[0];

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

function applyFiltersToEvents() {
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

function displayAllEvents() {
	let events = document.getElementsByClassName("event");

	for (let event of events) {
        showEvent(event);
	}
}

function filterEventsByDay(events, dayFilter) {
    for (let event of events) {
		let eventDay = event.getElementsByClassName("dayNumber")[0].innerText.split(" ")[1];

		if (eventDay !== dayFilter) {
			hideEvent(event);
		}
	}
}

function filterEventsByGroup(events, groupFilter) {
    for (let event of events) {
		let eventGroup = event.getElementsByClassName("groupNumber")[0].innerText.split(" ")[1];

		if (eventGroup !== groupFilter) {
			hideEvent(event);
		}
	}
}

function showEvent(event) {
	event.style.display = "flex";
}

function hideEvent(event) {
	event.style.display = "none";
}

function removeFilters() {
	displayAllEvents();
	removeSelectedFilters();
}

function removeSelectedFilters() {
	let daySelectElement = document.getElementById("filter-by-day");
	let groupSelectElement = document.getElementById("filter-by-group");

	daySelectElement.selectedIndex = 0;
	groupSelectElement.selectedIndex = 0;
}

function addToPreferences() {
	const ACTIVE_CLASSNAME = "active";

	// first check if the this button is active
	if (this.classList.contains(ACTIVE_CLASSNAME)) {
		removeHighlight(this);
		return;
	}

	let preferenceButtons = this.parentElement.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		if (preferenceButtons[i].classList.contains(ACTIVE_CLASSNAME)) {
			removeHighlight(preferenceButtons[i]);
			generatePreferenceDetails(preferenceButtons[i]);
		}
	}

	addHighlight(this);
	generatePreferenceDetails(this);
}

function addHighlight(preferenceButton) {
	preferenceButton.className += " active";
}

function removeHighlight(preferenceButton) {
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

	goToPersonalSchedulePage("personal-schedule.html");

	// const LOAD_SCHEDULE_URL = "php/api.php/generatePersonalSchedule";
	// const LOAD_SCHEDULE_METHOD = "POST";
	//
	// ajaxPersonalScheduleRequest(
	// 	LOAD_SCHEDULE_URL,
	// 	LOAD_SCHEDULE_METHOD,
	// 	`preferencesData=${JSON.stringify(preferences)}`
	// );
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
