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

    // toast notifications
    var timeLeft;
    var toastMessageType;
    var notifications = Windows.UI.Notifications;
    var template = notifications.ToastTemplateType.toastText02;

    // messages
    var messageType;
    var normalMessages = [
        "You are a champion.",
        "Doing amazing.",
        "Seek the greatness in life, ignore the rest.",
        "Change the world, one little bit.",
        "All things are possible.",
        "Fear nothing."
    ];
    var cooldownMessages = [

    ];
    var endMessages = [

    ];
    var quitMessages = [

    ];

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

        // handle the animation
        if (mode == "normal") {
            if (animation == "fadeToBlack") {

                percent = secs / divisor;
                bgColor = shadeColor(bgColor, -percent);
                document.body.style.background = "#" + bgColor;

                // decrement divisor
                if (divisor > 0)
                    divisor = divisor - 0.05;
            }

            // change the message at 00
            if (secs == 0) {
                showMessage("normal");

                // show toast at every 5 min and at end
                if (mins == 15 || mins == 10 || mins == 5 || mins == 1)
                    showToast(mins, "Keep it up.");
            }
        }

        // switch modes when timer expires
        if (bigTime == 0) {
            if (mode == "normal") {
                // go to cooldown
                mode = "cooldown";
                if (session == 5 || session == 10 || session == 15 || session == 20)
                    bigTime = 1800;
                else 
                    bigTime = 300;
                
                divisor = 30;

                // change background color to normal
                document.body.style.background = "#" + cooldownColor;

                // change message
                showMessage("cooldown");
            } else {
                showToast(0);
                resetTimer();
            }
        } else {
            // decrement
            bigTime = bigTime - 1;
        }

    }

    // ACTIONS =============================================================
    function startTimer(eventInfo) {
        bgColor = color;
        bigTime = 1499; // get from app settings
        divisor = 300;

        // start the timer
        countdownID = setInterval(function () { counter(); }, 1);

        // show message
        showMessage("normal");

        // show stop button
        start.style.display = "none";
        stop.style.display = "block";
        reset.style.display = "none";
    }

    function stopTimer(eventInfo) {
        // change message
        showMessage("quit");

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
        message.innerHTML = "Do Something Great";

        // show start button
        start.style.display = "block";
        stop.style.display = "none";
        reset.style.display = "none";

        // stop timer 
        clearInterval(countdownID);
    }

    function showToast(timeLeft, toastMessageType) {
        // get task
        task = taskName.value;

        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);

        // show notification
        var toastTextElements = toastXml.getElementsByTagName("text");
        if (task)
            toastTextElements[0].appendChild(toastXml.createTextNode(task));
        else
            toastTextElements[0].appendChild(toastXml.createTextNode("Getting Things Done"));
        
        
        if (timeLeft == 0) {
            toastTextElements[1].appendChild(toastXml.createTextNode("You're Done!"));
        } else {
            if (timeLeft == 1)
                toastTextElements[1].appendChild(toastXml.createTextNode(timeLeft + " minute left!"));
            else
                toastTextElements[1].appendChild(toastXml.createTextNode(timeLeft + " minutes left!"));
            
        }
        
        // show toast
        var toast = new notifications.ToastNotification(toastXml);
        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toast);
    }

    function showMessage(messageType) {
        switch (messageType) {
            case "normal":
                message.innerHTML = normalMessages[Math.floor(Math.random() * normalMessages.length)];
                break;

            case "cooldown":
                message.innerHTML = cooldownMessages[Math.floor(Math.random() * cooldownMessages.length)];
                break;

            case "end":
                message.innerHTML = endMessages[Math.floor(Math.random() * endMessages.length)];
                break;

            case "quit":
                message.innerHTML = quitMessages[Math.floor(Math.random() * quitMessages.length)];
                break;
        }
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
