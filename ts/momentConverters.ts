import * as WinJS from 'winjs'
import * as moment from 'moment'

export function momentFromNow(dt: Date): string {
    return moment(dt).fromNow();
}

export function momentLongDateTime(dt: Date): string {
    return moment(dt).format("dddd, MMMM Do YYYY, h:mm:ss a");
}

export function momentISO(dt: Date): string {
    return moment(dt).format();
}

WinJS.Namespace.define("Shmuelie", {
    momentFromNow: WinJS.Binding.converter(momentFromNow),
    momentLongDateTime: WinJS.Binding.converter(momentLongDateTime),
    momentISO: WinJS.Binding.converter(momentISO)
});