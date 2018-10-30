define(["require", "exports", "winjs", "moment"], function (require, exports, WinJS, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function momentFromNow(dt) {
        return moment(dt).fromNow();
    }
    exports.momentFromNow = momentFromNow;
    function momentLongDateTime(dt) {
        return moment(dt).format("dddd, MMMM Do YYYY, h:mm:ss a");
    }
    exports.momentLongDateTime = momentLongDateTime;
    function momentISO(dt) {
        return moment(dt).format();
    }
    exports.momentISO = momentISO;
    WinJS.Namespace.define("Shmuelie", {
        momentFromNow: WinJS.Binding.converter(momentFromNow),
        momentLongDateTime: WinJS.Binding.converter(momentLongDateTime),
        momentISO: WinJS.Binding.converter(momentISO)
    });
});
