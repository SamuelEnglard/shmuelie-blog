define(["require", "exports", "winjs", "requirepromise", "stateManager"], function (require, exports, WinJS, requirepromise_1, StateManager) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PageControlNavigator = (function () {
        function PageControlNavigator(element, options) {
            this.name = options.name;
            this.noScript = options.noScript || false;
            var us = StateManager.register(this.name);
            this._element = element || document.createElement("div");
            this._element.appendChild(this._createPageElement());
            this._lastNavigationPromise = WinJS.Promise.as();
            us.addEventListener("navigated", this._navigated.bind(this), false);
            us.addEventListener("navigating", this._navigating.bind(this), false);
        }
        Object.defineProperty(PageControlNavigator.prototype, "pageControl", {
            get: function () {
                return this.pageElement.winControl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageControlNavigator.prototype, "pageElement", {
            get: function () {
                return this._element.firstElementChild;
            },
            enumerable: true,
            configurable: true
        });
        PageControlNavigator.prototype._createPageElement = function () {
            var element = document.createElement("div");
            element.style.width = "100%";
            element.style.height = "100%";
            return element;
        };
        PageControlNavigator.prototype._getAnimationElements = function () {
            if (this.pageControl && this.pageControl.getAnimationElements) {
                return this.pageControl.getAnimationElements();
            }
            return this.pageElement;
        };
        PageControlNavigator.prototype._navigated = function (args) {
            WinJS.UI.Animation.enterPage(this._getAnimationElements()).done();
        };
        PageControlNavigator.prototype._navigating = function (args) {
            var _this = this;
            var newElement = this._createPageElement();
            var parentedComplete;
            var parented = new WinJS.Promise(function (c) { parentedComplete = c; });
            this._lastNavigationPromise.cancel();
            this._lastNavigationPromise = WinJS.Promise.timeout().then(function () {
                if (_this.noScript) {
                    return WinJS.Promise.as();
                }
                return requirepromise_1.default([args.detail.location]);
            }).then(function () {
                return WinJS.UI.Pages.render(args.detail.location, newElement, args.detail.state, parented);
            }, function (e) {
                if (e.name === "Canceled") {
                    return WinJS.UI.Pages.render("pages/loading.htm", newElement, args.detail.state, parented);
                }
                return WinJS.UI.Pages.render("pages/404.htm", newElement, args.detail.state, parented);
            }).then(function () {
                var oldElement = _this.pageElement;
                if (oldElement.winControl && oldElement.winControl.unload) {
                    oldElement.winControl.unload();
                }
                _this._element.appendChild(newElement);
                _this._element.removeChild(oldElement);
                oldElement.textContent = "";
                parentedComplete();
            });
            args.detail.setPromise(this._lastNavigationPromise);
        };
        return PageControlNavigator;
    }());
    exports.default = PageControlNavigator;
    WinJS.Utilities.markSupportedForProcessing(PageControlNavigator);
    WinJS.Namespace.define("Shmuelie", {
        PageControlNavigator: PageControlNavigator
    });
});
