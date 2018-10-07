define(["require", "exports", "winjs"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var blogPageUrl = "pages/blog.htm";
    WinJS.UI.Pages.define(blogPageUrl, {
        ready: function (element, options) {
            WinJS.UI.processAll(element);
        }
    });
    exports.default = blogPageUrl;
});
