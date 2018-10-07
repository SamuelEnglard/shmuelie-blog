define(["require", "exports", "winjs"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var podcastsPageUrl = "pages/podcasts.htm";
    WinJS.UI.Pages.define(podcastsPageUrl, {
        ready: function (element, options) {
            WinJS.UI.processAll(element);
        }
    });
    exports.default = podcastsPageUrl;
});
