define(["require", "exports", "winjs"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var contactPageUrl = "pages/contact.htm";
    WinJS.UI.Pages.define(contactPageUrl, {
        ready: function (element, options) {
            WinJS.UI.processAll(element);
        }
    });
    exports.default = contactPageUrl;
});
