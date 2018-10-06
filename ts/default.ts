import * as WinJS from 'winjs'
import pageNavigate from 'navigator'

let winJsStyle: HTMLLinkElement = <HTMLLinkElement>document.querySelector("link#winjsstyle");
winJsStyle.href = <string>winJsStyle.dataset.dark;

WinJS.Utilities.ready().then(function () {
    return WinJS.Binding.processAll(document.body, WinJS.Binding.as(window), false);
}).then(function () {
    return WinJS.UI.processAll(document.body);
}, function (e) {
    console.log(e);
}).then(function () {
    WinJS.Utilities.children(<HTMLElement>document.querySelector(".nav-commands")).forEach(function (value) {
        let splitViewCommand: WinJS.UI.SplitViewCommand = value.winControl;
        splitViewCommand.addEventListener("invoked", function () {
            pageNavigate(<string>value.dataset.nav);
        });
    });
    let styleToggle: WinJS.UI.AppBarCommand = (<HTMLButtonElement>document.querySelector("button.styletoggle")).winControl;
    styleToggle.label = "dark";
    styleToggle.addEventListener("click", function () {
        if (styleToggle.selected) {
            winJsStyle.href = <string>winJsStyle.dataset.light;
            styleToggle.label = "light";
        }
        else {
            winJsStyle.href = <string>winJsStyle.dataset.dark;
            styleToggle.label = "dark";
        }
    });
    let currentWindowSize: "large" | "medium" | "small" = "medium";
    let splitView: WinJS.UI.SplitView = (<HTMLElement>document.querySelector("div.splitView")).winControl;
    function calculateSplitViewDisplayModes() {
        let nextWindowSize: "large" | "medium" | "small";
        if (window.innerWidth >= 1366) {
            nextWindowSize = "large";
        } else if (window.innerWidth >= 800) {
            nextWindowSize = "medium";
        } else {
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