define(["require", "exports", "winjs"], function (require, exports, WinJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function htmlSafe(str) {
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }
    exports.htmlSafe = htmlSafe;
    function arrayNiceBind(arr) {
        return new WinJS.Binding.List(arr.map(function (value) {
            return { value: value };
        }));
    }
    exports.arrayNiceBind = arrayNiceBind;
    WinJS.Namespace.define("Shmuelie", {
        htmlSafe: WinJS.Binding.converter(htmlSafe),
        arrayNiceBind: WinJS.Binding.converter(arrayNiceBind)
    });
});
