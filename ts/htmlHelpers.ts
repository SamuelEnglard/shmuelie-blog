import * as WinJS from 'winjs'

export function htmlSafe(str: string): string {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

export function arrayNiceBind<T>(arr: T[]): WinJS.Binding.List<{ value: T }> {
    return new WinJS.Binding.List(arr.map(function (value) {
        return { value: value };
    }));
}

WinJS.Namespace.define("Shmuelie", {
    htmlSafe: WinJS.Binding.converter(htmlSafe),
    arrayNiceBind: WinJS.Binding.converter(arrayNiceBind)
});