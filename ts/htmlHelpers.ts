import * as WinJS from 'winjs'

export function htmlSafe(str: string): string {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

WinJS.Namespace.define("Shmuelie", {
    htmlSafe: WinJS.Binding.converter(htmlSafe)
});