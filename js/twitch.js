define(["require", "exports", "winjs"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var clientID = "r82xgyq06wvtmaf475371a0fr0sm3f";
    function getUsers(login) {
        var options = {
            headers: {
                "Client-ID": clientID
            },
            url: "https://api.twitch.tv/helix/users?login=" + login
        };
        return WinJS.xhr(options).then(function onComplete(xhr) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                return response.data;
            }
            return [];
        });
    }
    exports.getUsers = getUsers;
    function getChannel(id) {
        var options = {
            headers: {
                "Client-ID": clientID,
                "Accept": "application/vnd.twitchtv.v5+json"
            },
            url: "https://api.twitch.tv/kraken/channels/" + id
        };
        return WinJS.xhr(options).then(function onComplete(xhr) {
            if (xhr.status === 200) {
                return JSON.parse(xhr.responseText);
            }
            return null;
        });
    }
    exports.getChannel = getChannel;
});
