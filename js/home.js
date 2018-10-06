define(["require", "exports", "winjs"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var homePageUrl = "pages/home.htm";
    WinJS.UI.Pages.define(homePageUrl, {
        ready: function (element, options) {
            this._element = element;
            WinJS.UI.processAll(element);
        },
        getAnimationElements: function () {
            return WinJS.Utilities.children(this._element).slice();
        }
    });
    exports.default = homePageUrl;
});
