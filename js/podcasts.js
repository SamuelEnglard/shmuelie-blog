define(["require", "exports", "winjs", "rss"], function (require, exports, WinJS, RSS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var podcasts = [
        "https://www.relay.fm/rocket/feed",
        "http://atp.fm/episodes?format=rss",
        "http://www.pwop.com/feed.aspx?show=dotnetrocks",
        "http://www.pwop.com/feed.aspx?show=runasradio",
        "http://behindthetech.mpsn.libsynpro.com/rss"
    ];
    WinJS.UI.Pages.define("pages/podcasts.htm", {
        ready: function (element, options) {
            document.querySelector("#podcastRepeated").winControl.data = this.podcasts;
        },
        init: function (element, options) {
            var _this = this;
            return WinJS.Promise.join(podcasts.map(function (value) {
                return RSS.getFeed(value).then(function (value) { return value && value.feed; });
            })).then(function (value) {
                _this.podcasts = new WinJS.Binding.List(value.filter(function (v) { return v !== null; }).map(function (v) { return WinJS.Binding.as(v); }));
            });
        }
    });
});
