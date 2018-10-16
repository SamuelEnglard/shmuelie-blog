define(["require", "exports", "winjs"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventMixin = function () { };
    WinJS.Utilities.markSupportedForProcessing(EventMixin);
    WinJS.Class.mix(EventMixin, WinJS.Utilities.eventMixin);
    exports.default = EventMixin;
});
