define(["require", "exports", "winjs"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var homePageUrl = "pages/home.htm";
    WinJS.UI.Pages.define(homePageUrl, {
        ready: function (element, options) {
            WinJS.UI.processAll(element);
        }
    });
    exports.default = homePageUrl;
});
