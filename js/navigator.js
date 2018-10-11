define(["require", "exports", "winjs", "requirepromise"], function (require, exports, WinJS, requirepromise_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var nav = WinJS.Navigation;
    var pageRegex = /#([a-z]+):\/\/([A-Za-z0-9\/_\-\.]+\.htm)/g;
    function getUrlForControl(controlName, url) {
        var match;
        pageRegex.lastIndex = 0;
        while ((match = pageRegex.exec(url)) !== null) {
            if (match.index === pageRegex.lastIndex) {
                pageRegex.lastIndex++;
            }
            if (match[1] === controlName) {
                return match[2];
            }
        }
        return null;
    }
    function parseUrl(url) {
        var result = {};
        var match;
        while ((match = pageRegex.exec(url)) !== null) {
            if (match.index === pageRegex.lastIndex) {
                pageRegex.lastIndex++;
            }
            result[match[1]] = match[2];
        }
        return result;
    }
    function buildUrl(map) {
        return Object.getOwnPropertyNames(map).map(function (name) {
            return "#" + name + "://" + map[name];
        }).join("");
    }
    function updatehash() {
        nav.navigate(location.hash);
    }
    window.addEventListener("hashchange", updatehash, false);
    var navigator = WinJS.Class.define(function (element, options) {
        this.name = options.name;
        this._element = element || document.createElement("div");
        this._element.appendChild(this._createPageElement());
        this._lastNavigationPromise = WinJS.Promise.as();
        nav.addEventListener('navigating', this._navigating.bind(this), false);
        nav.addEventListener('navigated', this._navigated.bind(this), false);
    }, {
        pageControl: {
            get: function () {
                return this.pageElement.winControl;
            }
        },
        pageElement: {
            get: function () {
                return this._element.firstElementChild;
            }
        },
        _createPageElement: function () {
            var element = document.createElement("div");
            element.style.width = "100%";
            element.style.height = "100%";
            return element;
        },
        _getAnimationElements: function () {
            if (this.pageControl && this.pageControl.getAnimationElements) {
                return this.pageControl.getAnimationElements();
            }
            return this.pageElement;
        },
        _navigated: function (args) {
            var url = getUrlForControl(this.name, args.detail.location);
            if (url === null) {
                return;
            }
            WinJS.UI.Animation.enterPage(this._getAnimationElements()).done();
            window.addEventListener("hashchange", updatehash, false);
        },
        _navigating: function (args) {
            var _this = this;
            window.removeEventListener("hashchange", updatehash, false);
            var url = getUrlForControl(this.name, args.detail.location);
            if (url === null) {
                return;
            }
            var hashes = parseUrl(location.hash);
            hashes[this.name] = url;
            location.hash = buildUrl(hashes);
            var newElement = this._createPageElement();
            var parentedComplete;
            var parented = new WinJS.Promise(function (c) { parentedComplete = c; });
            this._lastNavigationPromise.cancel();
            this._lastNavigationPromise = WinJS.Promise.timeout().then(function () {
                return requirepromise_1.default([url]);
            }).then(function () {
                return WinJS.UI.Pages.render(url, newElement, args.detail.state, parented);
            }, function () {
                _this.dispatchEvent("404", {});
            }).then(function () {
                var oldElement = _this.pageElement;
                var innerButtonElement = document.getElementById('innerButton');
                if (innerButtonElement && innerButtonElement.winControl) {
                    innerButtonElement.winControl.dispose();
                }
                if (oldElement.winControl && oldElement.winControl.unload) {
                    oldElement.winControl.unload();
                }
                _this._element.appendChild(newElement);
                _this._element.removeChild(oldElement);
                oldElement.textContent = "";
                parentedComplete();
            });
            args.detail.setPromise(this._lastNavigationPromise);
        }
    });
    WinJS.Class.mix(navigator, WinJS.Utilities.eventMixin);
    WinJS.Namespace.define("Shmuelie", {
        PageControlNavigator: navigator
    });
});
