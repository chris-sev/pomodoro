// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    // register variables
    var bigTime = 1499; // time in seconds
    var mode = "normal"; // normal vs cooldown
    var animation = "fadeToBlack"; // will be able to change in settings later

    var color = "EC2E2B";
    var cooldownColor = "265E9A";
    var bgColor;
    var percent;
    var divisor = 300;

    var session = 1;

    var mins;
    var secs;
    var task;

    var countdownID;

    var progressNumber = 0;

    // toast notifications
    var timeLeft;
    var toastMessage;
    var notifications = Windows.UI.Notifications;
    var template = notifications.ToastTemplateType.toastText03;

    // ON ACTIVATED ====================================================== 
    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {

            args.setPromise(WinJS.UI.processAll().then(function completed() {

                // register elements
                var minutes = document.getElementById("minutes");
                var seconds = document.getElementById("seconds");
                var message = document.getElementById("message");
                var sessionNumber = document.getElementById("sessionNumber");
                var task = document.getElementById("taskName");
            
                // register start button
                var start = document.getElementById("start");
                start.addEventListener("click", startTimer, false);
                start.addEventListener("MSPointerDown", onPointerDown, false);
                start.addEventListener("MSPointerUp", onPointerUp, false);

                // register stop button
                var stop = document.getElementById("stop");
                stop.addEventListener("click", stopTimer, false);
                stop.addEventListener("MSPointerDown", onPointerDown, false);
                stop.addEventListener("MSPointerUp", onPointerUp, false);

                // register reset button
                var reset = document.getElementById("reset");
                reset.addEventListener("click", resetTimer, false);
                reset.addEventListener("MSPointerDown", onPointerDown, false);
                reset.addEventListener("MSPointerUp", onPointerUp, false);

                // progress bar
                var progress = document.getElementById("progress");

            }));
        }
    };

    app.onsettings = function (e) {
        e.detail.applicationcommands = {
            "settings": { title: "Settings", href: "/settings.html" },
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    // COUNTER ================================================================
    function counter(eventInfo) {

        // calculate the minutes and seconds from bigTime
        mins = Math.floor(bigTime / 60);
        secs = bigTime - mins * 60;

        // change the HTML to show new minutes and seconds
        minutes.innerHTML = (mins < 10 ? '0' : '') + mins;
        seconds.innerHTML = (secs < 10 ? '0' : '') + secs;
        progress.value = progressNumber;

        // handle the animation
        if (mode == "normal") {
            if (animation == "fadeToBlack") {

                percent = secs / divisor;
                bgColor = shadeColor(bgColor, -percent);
                document.body.style.background = "#" + bgColor;

                // decrement divisor
                if (divisor > 0) {
                    divisor = divisor - 0.05;
                }
            }

            // change the message at 00
            if (secs == 0) {
                message.innerHTML = "change the message here";

                // show toast at every 5 min and at end
                if (mins == 15 || mins == 10 || mins == 5 || mins == 1) {
                    showToast(mins, "Keep it up.");
                }
            }
        }

        // switch modes when timer expires
        if (bigTime == 0) {
            if (mode == "normal") {
                // go to cooldown
                mode = "cooldown";
                if (session == 5 || session == 10 || session == 15 || session == 20) {
                    bigTime = 1800;
                } else {
                    bigTime = 300;
                }
                divisor = 30;

                // change background color to normal
                document.body.style.background = "#" + cooldownColor;

                // change message
                message.innerHTML = "cooling down";
            } else {
                resetTimer();
            }
        } else {
            // decrement
            bigTime = bigTime - 1;
            progressNumber = progressNumber + 1;
        }

    }

    // ACTIONS =============================================================
    function startTimer(eventInfo) {
        bgColor = color;
        divisor = 300;

        // start the timer
        countdownID = setInterval(function () { counter(); }, 1);

        // show message
        message.innerHTML = "slow and steady wins something";

        // show stop button
        start.style.display = "none";
        stop.style.display = "block";
        reset.style.display = "none";
    }

    function stopTimer(eventInfo) {
        // change message
        message.innerHTML = "why are you such a quitter?";

        // stop timer
        clearInterval(countdownID);

        // show reset button
        start.style.display = "none";
        stop.style.display = "none";
        reset.style.display = "block";
    }

    function resetTimer(eventInfo) {
        // switch back to normal mode
        mode = "normal";
        bigTime = 1499;
        bgColor = color;

        // change session
        session = session + 1;
        sessionNumber.innerHTML = session;

        // change styles to normal
        minutes.innerHTML = "25";
        seconds.innerHTML = "00";
        document.body.style.background = "#" + color;

        // change message
        message.innerHTML = "fuck yes";

        // show start button
        start.style.display = "block";
        stop.style.display = "none";
        reset.style.display = "none";

        // stop timer 
        clearInterval(countdownID);
    }

    function showToast(timeLeft, toastMessage) {
        // get task
        task = taskName.value;

        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);

        // show notification
        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode(task));
        if (timeLeft == 0) {
            toastTextElements[0].appendChild(toastXml.createTextNode("You're Done!"));
            toastTextElements[1].appendChild(toastXml.createTextNode("Great work."));
        } else {
            if (timeLeft == 1) {
                toastTextElements[0].appendChild(toastXml.createTextNode(timeLeft + " minute left!"));
            } else {
                toastTextElements[0].appendChild(toastXml.createTextNode(timeLeft + " minutes left!"));
            }
            toastTextElements[1].appendChild(toastXml.createTextNode("Getting close."));
        }
        
        // show toast
        var toast = new notifications.ToastNotification(toastXml);
        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toast);
    }

    // ANIMATIONS ==========================================================
    function onPointerDown(eventInfo) {
        WinJS.UI.Animation.pointerDown(eventInfo.srcElement);
    }

    function onPointerUp(eventInfo) {
        WinJS.UI.Animation.pointerUp(eventInfo.srcElement);
    }

    // HELPER FUNCTIONS ====================================================
    function shadeColor(color, percent) {
        var num = parseInt(color, 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = (num >> 8 & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;
        return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
    }

    app.start();
})();
