var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "winjs", "./EventMixin"], function (require, exports, WinJS, EventMixin_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RegisteredUser = (function (_super) {
        __extends(RegisteredUser, _super);
        function RegisteredUser(name) {
            var _this = _super.call(this) || this;
            _this.name = name;
            return _this;
        }
        return RegisteredUser;
    }(EventMixin_1.default));
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
    var users = {};
    function beforeNavigate(eventInfo) {
        processNavigation(eventInfo.detail.location, "beforenavigated", eventInfo.detail);
    }
    function navigated(eventInfo) {
        processNavigation(eventInfo.detail.location, "navigated", eventInfo.detail);
    }
    function navigating(eventInfo) {
        processNavigation(eventInfo.detail.location, "navigating", eventInfo.detail);
    }
    var loaded = true;
    function processNavigation(location, eventName, eventProperties) {
        window.removeEventListener("hashchange", updateHash);
        var newHash = parseHash(location);
        var currentHash = parseHash(window.location.hash);
        Object.getOwnPropertyNames(newHash).forEach(function (name) {
            var user = users[name] || null;
            if (user !== null) {
                if (loaded && currentHash[name] === newHash[name]) {
                    return;
                }
                currentHash[name] = newHash[name];
                var props = {
                    location: newHash[name]
                };
                props.__proto__ = eventProperties;
                user.dispatchEvent(eventName, props);
            }
        });
        window.location.hash = buildHash(currentHash);
        window.addEventListener("hashchange", updateHash);
    }
    function updateHash() {
        nav.navigate(location.hash);
    }
    function register(name) {
        var user = new RegisteredUser(name);
        users[name] = user;
        setImmediate(function () {
            var currentHash = parseHash(window.location.hash);
            if (currentHash[name]) {
                var tempLoaded = loaded;
                loaded = false;
                nav.navigate("#" + name + "://" + currentHash[name]);
                loaded = tempLoaded;
            }
        });
        return user;
    }
    exports.register = register;
    function unregister(user) {
        users[user.name] = null;
    }
    exports.unregister = unregister;
    nav.addEventListener("beforenavigate", beforeNavigate, false);
    nav.addEventListener("navigated", navigated, false);
    nav.addEventListener("navigating", navigating, false);
    window.addEventListener("hashchange", updateHash);
});
