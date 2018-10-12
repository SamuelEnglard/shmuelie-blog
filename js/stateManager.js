define(["require", "exports", "winjs"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var nav = WinJS.Navigation;
    var hashRegex = /#([a-z]+):\/\/([A-Za-z0-9\/_\-\.]+\.htm)/g;
    function parseHash(url) {
        var result = {};
        var match;
        while ((match = hashRegex.exec(url)) !== null) {
            if (match.index === hashRegex.lastIndex) {
                hashRegex.lastIndex++;
            }
            result[match[1]] = match[2];
        }
        return result;
    }
    function buildHash(map) {
        return Object.getOwnPropertyNames(map).map(function (name) {
            return "#" + name + "://" + map[name];
        }).join("");
    }
    var RegisteredUser = WinJS.Class.define(function constructor(name) {
        this.name = name;
    });
    WinJS.Class.mix(RegisteredUser, WinJS.Utilities.eventMixin);
    var StateManager = WinJS.Class.define(function constructor() {
        this._users = {};
        nav.addEventListener("beforenavigate", this._beforeNavigated.bind(this), false);
        nav.addEventListener("navigated", this._navigated.bind(this), false);
        nav.addEventListener("navigating", this._navigating.bind(this), false);
        window.addEventListener("hashchange", this._updateHash);
    }, {
        _beforeNavigated: function (eventInfo) {
            this._processNavigation(eventInfo.detail.location, "beforenavigated", eventInfo.detail);
        },
        _navigated: function (eventInfo) {
            this._processNavigation(eventInfo.detail.location, "navigated", eventInfo.detail);
        },
        _navigating: function (eventInfo) {
            this._processNavigation(eventInfo.detail.location, "navigating", eventInfo.detail);
        },
        register: function (name) {
            var user = new RegisteredUser(name);
            this._users[name] = user;
            return user;
        },
        _processNavigation: function (location, eventName, eventProperties) {
            var _this = this;
            window.removeEventListener("hashchange", this._updateHash);
            var newHash = parseHash(location);
            var currentHash = parseHash(window.location.hash);
            Object.getOwnPropertyNames(newHash).forEach(function (name) {
                var user = _this._users[name];
                if (user !== null) {
                    currentHash[name] = newHash[name];
                    var props = {
                        location: newHash[name]
                    };
                    props.__proto__ = eventProperties;
                    user.dispatchEvent(eventName, props);
                }
            });
            window.location.hash = buildHash(currentHash);
            window.addEventListener("hashchange", this._updateHash);
        },
        _updateHash: function () {
            nav.navigate(location.hash);
        }
    });
    var stateManager = new StateManager();
    exports.default = stateManager;
});
