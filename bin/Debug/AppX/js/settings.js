(function () {
    "use strict";

    var appData = Windows.Storage.ApplicationData.current.roamingSettings;

    WinJS.UI.Pages.define("/settings.html", {

        ready: function (element, options) {

            // check for current settings from appData
            // if (appData.values["notifications"])

            var notificationsDiv = document.getElementById("notificationsToggle");
            var notificationsToggle = notificationsDiv.winControl;
            var shortRest = document.getElementById("shortRest");
            var longRest = document.getElementById("longRest");

            // set values if they are already set
            if (appData.values.size > 0) {
                if (appData.values["notifications"]) {
                    if (appData.values["notifications"] == "on")
                        notificationsToggle.checked = true;
                    else
                        notificationsToggle.checked = false;
                }

                if (appData.values["shortRest"])
                    shortRest.value = appData.values["shortRest"];

                if (appData.values["longRest"])
                    longRest.value = appData.values["longRest"];
            }

            notificationsToggle.onchange = function () {
                appData.values["notifications"] = (notificationsToggle.checked ? "on" : "off");
                console.log(notificationsToggle.checked);
            };

            shortRest.onchange = function () {
                appData.values["shortRest"] = shortRest.value;
                console.log(shortRest.value);
            };

            longRest.onchange = function () {
                appData.values["longRest"] = longRest.value;
                console.log(longRest.value);
            };

        },
        
        unload: function () {

        },

        updateLayout: function (element, viewState, lastViewState) {
            
        }

    });

    // handle notifications change
    // change

    // handle small break change
    // change the timer
    // reset the timer

    // handle large break change
    // change the timer
    // reset the timer

    function setTimer() {
        // get the shortRest
        // get the largeRest
    }

})();