'use strict';
(function () {
	window.onload = () => loadPersonalEvents();

	addNavbarHandlers();

	let updateChangesButton =
		document.getElementById("apply-changes")
			.addEventListener("click", updatePersonalSchedule);

	let applyFilterButton =
		document.getElementById("apply-filter")
				.addEventListener("click", applyFiltersToEvents);

	let resetFilterButton =
		document.getElementById("reset-filter")
				.addEventListener("click", removeFilters);
})();

function loadPersonalEvents() {
	// const PERSONAL_SCHEDULE_URL = "https://my-json-server.typicode.com/ivanchuchulski/events-db/preferences";
	const PERSONAL_SCHEDULE_URL = "data/personalEvents.json";
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
		displayMessage("грешка : персоналните събития не може да бъдат заредени");
	}
}

function drawPersonalEvents(responseText) {
	let eventParent = document.getElementById("personal-events");

	let username = "test"
	document.getElementById("username").innerText += ", " + username + "!";

	let preferencesList = JSON.parse(responseText);

	// console.log("preferencesList : ")
	// console.log(preferencesList);

	if (preferencesList.length === 0) {
		displayMessage("Нямате избрани презентации!");
		return;
	}

	for (let event of preferencesList) {
		let {theme, presenterName, place, facultyNumber, groupNumber, dayNumber, presentDate, preferenceType} = event;

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
		let removeButton = document.createElement("button");

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

		removeButton.className += "preferenceButton cancelAttend";
		removeButton.innerText += "премахни събитието";

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
		preference.appendChild(removeButton);

		// event section
		eventElement.appendChild(details);
		eventElement.appendChild(timeinfo);
		eventElement.appendChild(preference);

		eventParent.appendChild(eventElement);

		// adding event listeners
		willGoButton.addEventListener("click", addToPreferences);
		couldGoButton.addEventListener("click", addToPreferences);
		removeButton.addEventListener("click", addToPreferences);

		// by default hide the place address link
		timeinfo.getElementsByClassName('placeAddress')[0].style.display = "none";

		timeinfo.addEventListener("mouseover", showAddressOnHover);
		timeinfo.addEventListener("mouseleave", showMessageOnLeave);

		// highlighting preference button
		if (preferenceType === "willAttend") {
			addHighlight(willGoButton);
		}
		else {
			addHighlight(couldGoButton);
		}
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
	let schedulePageButton =
		document.getElementById("schedule-page-button")
				.addEventListener("click", () => window.location = "schedule.html");

	let personalisedScheduleButton = document.getElementById("personalised-schedule-button");
	personalisedScheduleButton.addEventListener("click", () => window.location = "personal-schedule.html");
	addHighlight(personalisedScheduleButton);

	let statisticsButton =
		document.getElementById("view-statistics")
				.addEventListener("click", () => window.location = "statistics.html");

	let logoutButton =
		document.getElementById("logout-button")
				.addEventListener("click", () => window.location = "index.html");
}

function applyFiltersToEvents() {
	let daySelectElement = document.getElementById("filter-by-day");
	let groupSelectElement = document.getElementById("filter-by-group");
	let preferenceSelectElement = document.getElementById("filter-by-preference");

	let filterByDay = daySelectElement.options[daySelectElement.selectedIndex].value;
	let filterByGroup = groupSelectElement.options[groupSelectElement.selectedIndex].value;
	let filterByPreference = preferenceSelectElement.options[preferenceSelectElement.selectedIndex].value;

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
	let preferenceSelectElement = document.getElementById("filter-by-preference");

	daySelectElement.selectedIndex = 0;
	groupSelectElement.selectedIndex = 0;
	preferenceSelectElement.selectedIndex = 0;
}

function filterEventsByGroup(events, groupFilter) {
	for (let event of events) {
		let eventGroup = event.getElementsByClassName("groupNumber")[0].innerText.split(" ")[1];

		if (eventGroup !== groupFilter) {
			hideEvent(event);
		}
	}
}

function filterEventsByPreference(events, preferenceFilter) {
	for (let event of events) {
		let activePreferenceButton = event.getElementsByClassName("active")[0];
		let buttonPreference = activePreferenceButton.className.split(" ")[1];

		if (buttonPreference !== preferenceFilter) {
			hideEvent(event);
		}
	}
}

function addToPreferences() {
	const ACTIVE_CLASSNAME = "active";
    const CANCEL_CLASSNAME = "cancelAttend";

	// first check if the this button is active
	if (this.classList.contains(ACTIVE_CLASSNAME) && !this.classList.contains(CANCEL_CLASSNAME)) {
		removeHighlight(this);

		let preferenceButtons = this.parentElement.getElementsByClassName("preferenceButton");
		for (let i = 0; i < preferenceButtons.length; i++) {
			if (preferenceButtons[i].classList.contains(CANCEL_CLASSNAME)) {
				addHighlight(preferenceButtons[i]);
				return;
			}
		}
	}

    if (this.classList.contains(ACTIVE_CLASSNAME)) {
        removeHighlight(this);
    }

	let preferenceButtons = this.parentElement.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		if (preferenceButtons[i].classList.contains(ACTIVE_CLASSNAME)) {
			removeHighlight(preferenceButtons[i]);
		}
	}

	addHighlight(this);
}

function addHighlight(preferenceButton) {
	preferenceButton.className += " active";
}

function removeHighlight(preferenceButton) {
	preferenceButton.className = preferenceButton.className.replace(" active", "");
}

function updatePersonalSchedule() {
	const ACTIVE_CLASSNAME = "active";
	let preferences = [];
	let preferenceButtons = document.getElementsByClassName("preferenceButton");

	for (let i = 0; i < preferenceButtons.length; i++) {
		if (preferenceButtons[i].classList.contains(ACTIVE_CLASSNAME)) {
			preferences.push(generatePreferenceDetails(preferenceButtons[i]));
		}
	}

	if (preferences.length === 0) {
		displayMessage("грешка : моля изберете действие за събитието");
		return;
	}

	// console.log("preferences");
	// console.log(preferences);

	// refresh the page
	location.reload();
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

function displayMessage(text) {
	let messageLabel = document.getElementById("message-label");

	messageLabel.innerText = text;
}
