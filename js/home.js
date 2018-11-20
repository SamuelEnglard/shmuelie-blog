define(["require", "exports", "winjs", "twitter"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WinJS.UI.Pages.define("pages/home.htm", {
        ready: function (element, options) {
            this._element = element;
            var p = new WinJS.Promise(function (completeDispatch) {
                twttr.ready(function () {
                    twttr.events.bind("loaded", function (ev) {
                        completeDispatch(ev);
                    });
                    twttr.widgets.load(element);
                });
            });
            return p;
        },
        getAnimationElements: function () {
            return WinJS.Utilities.children(this._element).slice();
        }
    });
});
