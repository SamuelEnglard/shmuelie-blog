import * as WinJS from 'winjs'

export interface Feed {
    url: string;
    title: string;
    link: string;
    author: string;
    description: string;
    image: string;
}

export interface Rating {
    scheme: string;
    value: string;
}

export interface Enclosure {
    link: string;
    type: string;
    length: number;
    duration: number;
    rating: Rating;
}

export interface Item {
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

export interface RssResponse {
    status: string;
    feed: Feed;
    items: Item[];
}

export function getFeed(url: string): WinJS.Promise<RssResponse | null> {
    return WinJS.xhr({ url: "https://api.rss2json.com/v1/api.json?rss_url=" + url }).then(function (xhr) {
        if (xhr.status !== 200) {
            return null;
        }
        return <RssResponse>JSON.parse(xhr.responseText);
    }, function () {
        return null;
    });
}