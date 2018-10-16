import * as WinJS from 'winjs'

//https://api.rss2json.com/v1/api.json?rss_url=https://www.relay.fm/rocket/feed

interface Feed {
    url: string;
    title: string;
    link: string;
    author: string;
    description: string;
    image: string;
}

interface Rating {
    scheme: string;
    value: string;
}

interface Enclosure {
    link: string;
    type: string;
    length: number;
    duration: number;
    rating: Rating;
}

interface Item {
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    author: string;
    thumbnail: string;
    description: string;
    content: string;
    enclosure: Enclosure;
    categories: any[];
}

interface RssResponse {
    status: string;
    feed: Feed;
    items: Item[];
}

interface PodcastsPageControl extends WinJS.UI.Pages.IPageControlMembers {
    podcasts: WinJS.Binding.List<Feed>
}

const podcastsPageUrl = "pages/podcasts.htm";
let podcasts = [
    "https://www.relay.fm/rocket/feed",
    "http://atp.fm/episodes?format=rss",
    "http://www.pwop.com/feed.aspx?show=dotnetrocks",
    "http://www.pwop.com/feed.aspx?show=runasradio"
];
WinJS.UI.Pages.define(podcastsPageUrl, {
    ready: function (this: PodcastsPageControl, element: HTMLElement, options: any): void {
        WinJS.Binding.processAll(element, WinJS.Binding.as({ podcasts: this.podcasts }), false);
    },
    init: function (this: PodcastsPageControl, element: HTMLElement, options: any): WinJS.Promise<void> {
        return WinJS.Promise.join(podcasts.map(function (value) {
            return WinJS.xhr({ url: "https://api.rss2json.com/v1/api.json?rss_url=" + value }).then(function (xhr) {
                return (<RssResponse>JSON.parse(xhr.responseText)).feed;
            }, function () {
                return null;
            });
        })).then((value: (Feed | null)[]) => {
            this.podcasts = new WinJS.Binding.List<Feed>(value.filter(function (v) { return v !== null }).map(function (v) { return <Feed>WinJS.Binding.as(v); }));
        });
    }
});
export default podcastsPageUrl;