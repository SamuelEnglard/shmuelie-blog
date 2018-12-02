import * as WinJS from 'winjs'
import * as RSS from 'rss'

interface PodcastsPageControl extends WinJS.UI.Pages.IPageControlMembers {
    podcasts: WinJS.Binding.List<RSS.Feed>
}

let podcasts = [
    "https://www.relay.fm/rocket/feed",
    "http://atp.fm/episodes?format=rss",
    "http://www.pwop.com/feed.aspx?show=dotnetrocks",
    "http://www.pwop.com/feed.aspx?show=runasradio",
    "http://behindthetech.mpsn.libsynpro.com/rss"
];
WinJS.UI.Pages.define("pages/podcasts.htm", {
    ready: function (this: PodcastsPageControl, element: HTMLElement, options: any): void {
        (<WinJS.UI.Repeater>(<HTMLElement>document.querySelector("#podcastRepeated")).winControl).data = this.podcasts;
    },
    init: function (this: PodcastsPageControl, element: HTMLElement, options: any): WinJS.Promise<void> | void {
        return WinJS.Promise.join(podcasts.map(function (value) {
            return RSS.getFeed(value).then(function (value) { return value && value.feed; });
        })).then((value: (RSS.Feed | null)[]) => {
            this.podcasts = new WinJS.Binding.List<RSS.Feed>(value.filter(function (v) { return v !== null }).map(function (v) { return <RSS.Feed>WinJS.Binding.as(v); }));
            });
    }
});