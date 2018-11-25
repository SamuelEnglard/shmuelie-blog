define(["require", "exports", "winjs"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getFeed(url) {
        return WinJS.xhr({ url: "https://api.rss2json.com/v1/api.json?rss_url=" + url }).then(function (xhr) {
            if (xhr.status !== 200) {
                return null;
            }
            return JSON.parse(xhr.responseText);
        }, function () {
            return null;
        });
    }
    exports.getFeed = getFeed;
});
