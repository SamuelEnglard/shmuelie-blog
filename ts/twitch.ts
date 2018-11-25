import * as WinJS from 'winjs'

export interface TwitchUser {
    broadcaster_type: "partner" | "affiliate" | "";
    description: string;
    display_name: string;
    email: string;
    id: string;
    login: string;
    offline_image_url: string;
    profile_image_url: string;
    type: "staff" | "admin" | "global_mod" | "";
    view_count: number;
}

export interface TwitchChannel {
    _id: number;
    broadcaster_language: string;
    created_at: string;
    display_name: string;
    followers: number;
    language: string;
    logo: string;
    mature: boolean;
    name: string;
    partner: boolean;
    profile_banner: string | null;
    profile_banner_background_color: string | null;
    status: string;
    updated_at: string;
    url: string;
    video_banner: string | null;
    views: number;
}

const clientID = "r82xgyq06wvtmaf475371a0fr0sm3f";

export function getUsers(login: string): WinJS.Promise<TwitchUser[]> {
    const options: WinJS.IXHROptions = {
        headers: {
            "Client-ID": clientID
        },
        url: "https://api.twitch.tv/helix/users?login=" + login
    };
    return WinJS.xhr(options).then(function onComplete(xhr) {
        if (xhr.status === 200) {
            const response: { data: TwitchUser[] } = JSON.parse(xhr.responseText);
            return response.data;
        }
        return [];
    });
}

export function getChannel(id: number): WinJS.Promise<TwitchChannel | null> {
    const options: WinJS.IXHROptions = {
        headers: {
            "Client-ID": clientID,
            "Accept": "application/vnd.twitchtv.v5+json"
        },
        url: "https://api.twitch.tv/kraken/channels/" + id
    };
    return WinJS.xhr(options).then(function onComplete(xhr) {
        if (xhr.status === 200) {
            return <TwitchChannel>JSON.parse(xhr.responseText);
        }
        return null;
    });
}