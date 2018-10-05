import * as WinJS from 'winjs'
import pageNavigate from 'navigator'

let winJsStyle: HTMLLinkElement = <HTMLLinkElement>document.querySelector("link#winjsstyle");
winJsStyle.href = <string>winJsStyle.dataset.dark;

WinJS.Utilities.ready().then(function () {
    return WinJS.UI.processAll(document.body);
}).then(function () {
    WinJS.Utilities.children(<HTMLElement>document.querySelector(".nav-commands")).forEach(function (value) {
        let splitViewCommand: WinJS.UI.SplitViewCommand = value.winControl;
        splitViewCommand.addEventListener("invoked", function () {
            pageNavigate(<string>value.dataset.nav);
        });
    });
    let styleToggle: WinJS.UI.AppBarCommand = (<HTMLButtonElement>document.querySelector("button.appbar-styletoggle")).winControl;
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

});