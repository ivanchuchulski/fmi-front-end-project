'use strict';
(function () {
    window.onload = () => loadStatistics();

    addNavbarHandlers();
})();

function addNavbarHandlers() {
    let schedulePageButton =
        document.getElementById("schedule-page-button")
                .addEventListener("click", () => window.location = "schedule.html");

    let personalSchedule =
        document.getElementById("personalised-schedule-button")
                .addEventListener("click", () => window.location = "personal-schedule.html");

    let statisticsButton = document.getElementById("view-statistics");
    statisticsButton.addEventListener("click", () => window.location = "statistics.html");

    addHighlight(statisticsButton);

    let logoutButton =
        document.getElementById("logout-button")
                .addEventListener("click", () => window.location = "index.html");
}

function loadStatistics() {
    const LOAD_SCHEDULE_METHOD = "GET";
    const LOAD_SCHEDULE_URL = "data/stats.json";

    ajaxLoadRequest(LOAD_SCHEDULE_URL, LOAD_SCHEDULE_METHOD);
}

function ajaxLoadRequest(url, method, data) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", () => ajaxLoadHandler(xhr));

    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
}

function ajaxLoadHandler(xhr) {
    const okResponseCode = 200;

    let responseCode = xhr.status;
    let responseText = xhr.responseText;

    if (responseCode === okResponseCode) {
        console.log("success load statistics");
        drawStatistics(responseText);
    } else {
        console.log("error : load statistics");
        displayMessage("статистикака не може да бъде заредена");
    }
}

function drawStatistics(responseText) {
    const TEXT_CENTER_CLASSNAME = "text-center";
    let decodedResponseText = JSON.parse(responseText);

    let {topFivePresentations, stats, numberOfUsers} = decodedResponseText;

    let {numberOfPresentations, numberOfPreferences,
        maxNumberOfPreferencesForUser, averageNumberOfPreference, mostPreferredPresentation} = stats;

    let userCountTableData = document.getElementById("user-count");
    userCountTableData.innerText += numberOfUsers;
    userCountTableData.className += TEXT_CENTER_CLASSNAME;

    let presentationCountTableData = document.getElementById("presentation-count");
    presentationCountTableData.innerText += numberOfPresentations;
    presentationCountTableData.className += TEXT_CENTER_CLASSNAME;

    let preferenceCountTableData = document.getElementById("preference-count");
    preferenceCountTableData.innerText += numberOfPreferences;
    preferenceCountTableData.className += TEXT_CENTER_CLASSNAME;

    let maxPreferenceCountTableData = document.getElementById("max-preference-count");
    maxPreferenceCountTableData.innerText += maxNumberOfPreferencesForUser;
    maxPreferenceCountTableData.className += TEXT_CENTER_CLASSNAME;

    let averagePreferenceCountTableData = document.getElementById("average-preference-count");
    averagePreferenceCountTableData.innerText += averageNumberOfPreference;
    averagePreferenceCountTableData.className += TEXT_CENTER_CLASSNAME;

    let mostPopularPresentationTableData = document.getElementById("most-popular-presentation");
    mostPopularPresentationTableData.innerText += mostPreferredPresentation;
    mostPopularPresentationTableData.className += TEXT_CENTER_CLASSNAME;

    topFivePresentations.sort((left, right) => (left.count < right.count) ? 1 : -1);

    let positionCounter = 1;
    let tableBody = document.getElementById("statistics-top-five-body");

    for (let sortedPresentation of topFivePresentations) {
        let tableRow = document.createElement("tr");

        let tableDataFirst = document.createElement("td");
        let tableDataSecond = document.createElement("td");

        tableDataFirst.innerText += `${positionCounter++}. ${sortedPresentation.theme}`;
        tableDataSecond.innerText += `${sortedPresentation.count}`;

        tableRow.appendChild(tableDataFirst);
        tableRow.appendChild(tableDataSecond);

        tableBody.appendChild(tableRow);
    }
}

function addHighlight(preferenceButton) {
    preferenceButton.className += " active";
}

function displayMessage(text) {
    let messageLabel = document.getElementById("messageLabel");

    messageLabel.innerText = text;
}