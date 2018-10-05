define(["require", "exports", "winjs", "navigator"], function (require, exports, WinJS, navigator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var winJsStyle = document.querySelector("link#winjsstyle");
    winJsStyle.href = winJsStyle.dataset.dark;
    WinJS.Utilities.ready().then(function () {
        return WinJS.UI.processAll(document.body);
    }).then(function () {
        WinJS.Utilities.children(document.querySelector(".nav-commands")).forEach(function (value) {
            var splitViewCommand = value.winControl;
            splitViewCommand.addEventListener("invoked", function () {
                navigator_1.default(value.dataset.nav);
            });
        });
        var styleToggle = document.querySelector("button.appbar-styletoggle").winControl;
        styleToggle.addEventListener("click", function () {
            if (styleToggle.selected) {
                winJsStyle.href = winJsStyle.dataset.light;
                styleToggle.label = "light";
            }
            else {
                winJsStyle.href = winJsStyle.dataset.dark;
                styleToggle.label = "dark";
            }
        });
    });
});
