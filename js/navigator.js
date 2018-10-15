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
define(["require", "exports", "winjs", "requirepromise", "stateManager", "EventMixin"], function (require, exports, WinJS, requirepromise_1, StateManager, EventMixin_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PageControlNavigator = (function (_super) {
        __extends(PageControlNavigator, _super);
        function PageControlNavigator(element, options) {
            var _this = _super.call(this) || this;
            _this.name = options.name;
            var us = StateManager.register(_this.name);
            _this._element = element || document.createElement("div");
            _this._element.appendChild(_this._createPageElement());
            _this._lastNavigationPromise = WinJS.Promise.as();
            us.addEventListener("navigated", _this._navigated.bind(_this), false);
            us.addEventListener("navigating", _this._navigating.bind(_this), false);
            return _this;
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
        };
        return PageControlNavigator;
    }(EventMixin_1.default));
    exports.default = PageControlNavigator;
    WinJS.Utilities.markSupportedForProcessing(PageControlNavigator);
    WinJS.Namespace.define("Shmuelie", {
        PageControlNavigator: PageControlNavigator
    });
});
