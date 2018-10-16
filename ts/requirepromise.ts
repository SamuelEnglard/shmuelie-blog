import * as WinJS from 'winjs'

export default function requirePromise(modules: string[]): WinJS.Promise<any> {
    return new WinJS.Promise<any>(function (completeDispatch, errorDispatch) {
        require(modules, completeDispatch, errorDispatch);
    });
}