define(["require", "exports", "winjs", "twitter", "linkedin"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var contactPageUrl = "pages/contact.htm";
    WinJS.UI.Pages.define(contactPageUrl, {
        ready: function (element, options) {
            twttr.widgets.load(element);
            IN.parse(element);
            WinJS.UI.processAll(element);
        }
    });
    exports.default = contactPageUrl;
});
