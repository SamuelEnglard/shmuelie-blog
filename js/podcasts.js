define(["require", "exports", "winjs"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var podcastsPageUrl = "pages/podcasts.htm";
    var podcasts = [
        "https://www.relay.fm/rocket/feed",
        "http://atp.fm/episodes?format=rss",
        "http://www.pwop.com/feed.aspx?show=dotnetrocks",
        "http://www.pwop.com/feed.aspx?show=runasradio",
        "http://behindthetech.mpsn.libsynpro.com/rss"
    ];
    WinJS.UI.Pages.define(podcastsPageUrl, {
        ready: function (element, options) {
            document.querySelector("#podcastRepeated").winControl.data = this.podcasts;
        },
        init: function (element, options) {
            var _this = this;
            return WinJS.Promise.join(podcasts.map(function (value) {
                return WinJS.xhr({ url: "https://api.rss2json.com/v1/api.json?rss_url=" + value }).then(function (xhr) {
                    return JSON.parse(xhr.responseText).feed;
                }, function () {
                    return null;
                });
            })).then(function (value) {
                _this.podcasts = new WinJS.Binding.List(value.filter(function (v) { return v !== null; }).map(function (v) { return WinJS.Binding.as(v); }));
            });
        }
    });
    exports.default = podcastsPageUrl;
});
