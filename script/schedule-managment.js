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
    // generatePreferenceDetails(this);
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