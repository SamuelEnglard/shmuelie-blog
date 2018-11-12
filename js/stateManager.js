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
define(["require", "exports", "winjs", "EventMixin"], function (require, exports, WinJS, EventMixin_1) {
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
    exports.RegisteredUser = RegisteredUser;
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
        return Object.getOwnPropertyNames(map).filter(function (name) {
            return map[name] !== null;
        }).map(function (name) {
            return "#" + name + "://" + map[name];
        }).join("");
    }
    var users = {};
    var beforenavigatedEvent = "beforenavigated";
    function beforeNavigate(eventInfo) {
        processNavigation(eventInfo.detail.location, beforenavigatedEvent, eventInfo.detail);
    }
    var navigatedEvent = "navigated";
    function navigated(eventInfo) {
        processNavigation(eventInfo.detail.location, navigatedEvent, eventInfo.detail);
    }
    var navigatingEvent = "navigating";
    function navigating(eventInfo) {
        processNavigation(eventInfo.detail.location, navigatingEvent, eventInfo.detail);
    }
    var loaded = true;
    var hashchangeEvent = "hashchange";
    function processNavigation(location, eventName, eventProperties) {
        window.removeEventListener(hashchangeEvent, updateHash);
        var newHash = parseHash(location);
        var currentHash = parseHash(window.location.hash);
        Object.getOwnPropertyNames(newHash).forEach(function (name) {
            var user = users[name] || null;
            if (user !== null) {
                if (loaded && currentHash[name] === newHash[name]) {
                    return;
                }
                if (eventName === navigatedEvent) {
                    currentHash[name] = newHash[name];
                }
                var props = {
                    location: newHash[name]
                };
                props.__proto__ = eventProperties;
                user.dispatchEvent(eventName, props);
            }
        });
        window.location.hash = buildHash(currentHash);
        window.addEventListener(hashchangeEvent, updateHash);
    }
    function updateHash() {
        nav.navigate(location.hash);
    }
    function register(name) {
        var user = new RegisteredUser(name);
        users[name] = user;
        setTimeout(function () {
            var currentHash = parseHash(window.location.hash);
            if (currentHash[name]) {
                var tempLoaded = loaded;
                loaded = false;
                nav.navigate("#" + name + "://" + currentHash[name]);
                loaded = tempLoaded;
            }
        }, 0);
        return user;
    }
    exports.register = register;
    function unregister(user) {
        users[user.name] = null;
        window.removeEventListener(hashchangeEvent, updateHash);
        var currentHash = parseHash(window.location.hash);
        currentHash[user.name] = null;
        window.location.hash = buildHash(currentHash);
        window.addEventListener(hashchangeEvent, updateHash);
    }
    exports.unregister = unregister;
    nav.addEventListener(beforenavigatedEvent, beforeNavigate, false);
    nav.addEventListener(navigatedEvent, navigated, false);
    nav.addEventListener(navigatingEvent, navigating, false);
    window.addEventListener(hashchangeEvent, updateHash);
});
