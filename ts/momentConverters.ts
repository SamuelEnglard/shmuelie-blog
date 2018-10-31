import * as WinJS from 'winjs'
import * as moment from 'moment'

export function momentFromNow(dt: moment.Moment): string {
    return moment(dt).local().fromNow();
}

export function momentLongDateTime(dt: moment.Moment): string {
    return moment(dt).local().format("dddd, MMMM Do YYYY, h:mm:ss a");
}

export function momentISO(dt: moment.Moment): string {
    return moment(dt).format();
}

WinJS.Namespace.define("Shmuelie", {
    momentFromNow: WinJS.Binding.converter(momentFromNow),
    momentLongDateTime: WinJS.Binding.converter(momentLongDateTime),
    momentISO: WinJS.Binding.converter(momentISO)
});