define(["require", "exports", "winjs"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function requirePromise(modules) {
        return new WinJS.Promise(function (completeDispatch, errorDispatch) {
            require(modules, completeDispatch, errorDispatch);
        });
    }
    exports.default = requirePromise;
});
