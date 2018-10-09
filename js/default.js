define(["require", "exports", "winjs", "navigator"], function (require, exports, WinJS, navigator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var winJsStyle = document.querySelector("link#winjsstyle");
    winJsStyle.href = winJsStyle.dataset.dark;
    WinJS.Utilities.ready().then(function () {
        return WinJS.Binding.processAll(document.body, WinJS.Binding.as(window), false);
    }).then(function () {
        return WinJS.UI.processAll(document.body);
    }, function (e) {
        console.log(e);
    }).then(function () {
        var splitView = document.querySelector("div.splitView").winControl;
        WinJS.Utilities.children(document.querySelector(".nav-commands")).forEach(function (value) {
            var splitViewCommand = value.winControl;
            splitViewCommand.addEventListener("invoked", function () {
                navigator_1.default(value.dataset.nav);
                splitView.closePane();
            });
        });
        var styleToggle = document.querySelector("button.styletoggle").winControl;
        styleToggle.label = "dark";
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
        var currentWindowSize = "medium";
        function calculateSplitViewDisplayModes() {
            var nextWindowSize;
            if (window.innerWidth >= 1366) {
                nextWindowSize = "large";
            }
            else if (window.innerWidth >= 800) {
                nextWindowSize = "medium";
            }
            else {
                nextWindowSize = "small";
            }
            if (currentWindowSize !== nextWindowSize) {
                currentWindowSize = nextWindowSize;
                switch (currentWindowSize) {
                    case "large":
                        splitView.closedDisplayMode = WinJS.UI.SplitView.ClosedDisplayMode.inline;
                        splitView.openedDisplayMode = WinJS.UI.SplitView.OpenedDisplayMode.inline;
                        break;
                    case "medium":
                        splitView.closedDisplayMode = WinJS.UI.SplitView.ClosedDisplayMode.inline;
                        splitView.openedDisplayMode = WinJS.UI.SplitView.OpenedDisplayMode.overlay;
                        break;
                    case "small":
                        splitView.closedDisplayMode = WinJS.UI.SplitView.ClosedDisplayMode.none;
                        splitView.openedDisplayMode = WinJS.UI.SplitView.OpenedDisplayMode.overlay;
                        break;
                }
            }
        }
        window.addEventListener("resize", calculateSplitViewDisplayModes);
        calculateSplitViewDisplayModes();
    });
});
