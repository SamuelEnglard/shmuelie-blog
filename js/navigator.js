define(["require", "exports", "winjs", "requirepromise", "stateManager"], function (require, exports, WinJS, requirepromise_1, stateManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var navigator = WinJS.Class.define(function (element, options) {
        this.name = options.name;
        var us = stateManager_1.default.register(this.name);
        this._element = element || document.createElement("div");
        this._element.appendChild(this._createPageElement());
        this._lastNavigationPromise = WinJS.Promise.as();
        us.addEventListener("navigated", this._navigated.bind(this), false);
        us.addEventListener("navigating", this._navigating.bind(this), false);
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
            WinJS.UI.Animation.enterPage(this._getAnimationElements()).done();
        },
        _navigating: function (args) {
            var _this = this;
            var newElement = this._createPageElement();
            var parentedComplete;
            var parented = new WinJS.Promise(function (c) { parentedComplete = c; });
            this._lastNavigationPromise.cancel();
            this._lastNavigationPromise = WinJS.Promise.timeout().then(function () {
                return requirepromise_1.default([args.detail.location]);
            }).then(function () {
                return WinJS.UI.Pages.render(args.detail.location, newElement, args.detail.state, parented);
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
