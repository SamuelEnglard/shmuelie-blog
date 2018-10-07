define(["require", "exports", "winjs"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var nav = WinJS.Navigation;
    function hashNavigate() {
        var hash = location.hash;
        if (hash.length > 1) {
            pageNavigate(hash.substring(1));
        }
    }
    function pageNavigate(pageName, initialState) {
        return new WinJS.Promise(function (completelDispatch, errorDispatch, processDispatch) {
            require([pageName], function (exports) {
                window.removeEventListener("hashchange", hashNavigate);
                location.hash = "#" + pageName;
                window.addEventListener("hashchange", hashNavigate);
                nav.navigate(exports.default, initialState).then(function onCompleted(value) {
                    completelDispatch(value);
                }, function onError(value) {
                    errorDispatch(value);
                }, function onProgress(value) {
                    processDispatch(value);
                });
            });
        });
    }
    window.addEventListener("hashchange", hashNavigate);
    var navigator = WinJS.Class.define(function (element, options) {
        var _this = this;
        this._element = element || document.createElement("div");
        this._element.appendChild(this._createPageElement());
        this.home = options.home;
        this._lastNavigationPromise = WinJS.Promise.as();
        nav.addEventListener('navigating', this._navigating.bind(this), false);
        nav.addEventListener('navigated', this._navigated.bind(this), false);
        WinJS.Utilities.ready(function () {
            var hash = location.hash;
            if (hash.length > 1) {
                pageNavigate(hash.substring(1));
            }
            else {
                pageNavigate(_this.home);
            }
        });
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
        _navigated: function () {
            WinJS.UI.Animation.enterPage(this._getAnimationElements()).done();
        },
        _navigating: function (args) {
            var newElement = this._createPageElement();
            var parentedComplete;
            var parented = new WinJS.Promise(function (c) { parentedComplete = c; });
            this._lastNavigationPromise.cancel();
            this._lastNavigationPromise = WinJS.Promise.timeout().then(function () {
                return WinJS.UI.Pages.render(args.detail.location, newElement, args.detail.state, parented);
            }).then(function parentElement() {
                var oldElement = this.pageElement;
                var innerButtonElement = document.getElementById('innerButton');
                if (innerButtonElement && innerButtonElement.winControl) {
                    innerButtonElement.winControl.dispose();
                }
                if (oldElement.winControl && oldElement.winControl.unload) {
                    oldElement.winControl.unload();
                }
                this._element.appendChild(newElement);
                this._element.removeChild(oldElement);
                oldElement.textContent = "";
                parentedComplete();
            }.bind(this));
            args.detail.setPromise(this._lastNavigationPromise);
        }
    });
    WinJS.Namespace.define("Shmuelie", {
        PageControlNavigator: navigator
    });
    exports.default = pageNavigate;
});
