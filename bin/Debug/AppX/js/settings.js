(function () {
    "use strict";

    var appData = Windows.Storage.ApplicationData.current.roamingSettings;

    WinJS.UI.Pages.define("/settings.html", {

        ready: function (element, options) {

            // check for current settings from appData
            // if (appData.values["notifications"])

            var notificationsToggle = document.getElementById("notificationsToggle");
            var shortRest = document.getElementById("shortRest");
            var longRest = document.getElementById("longRest");

            notificationsToggle.onchange = function () {
                appData.values["notifications"] = (notificationsToggle.checked ? "on" : "off");
                resetTimer();
            };

            shortRest.onchange = function () {
                appData.values["shortRest"] = shortRest.value;
            };

            longRest.onchange = function () {
                appData.values["longRest"] = longRest.value;
            };
        },
        
        unload: function () {

        },

        updateLayout: function (element, viewState, lastViewState) {

        }

    });

    // handle notifications change

    // handle small break change

    // handle large break change

})();