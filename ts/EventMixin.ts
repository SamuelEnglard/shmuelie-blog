import * as WinJS from 'winjs'

declare class EventMixin {
    addEventListener(type: string, listener: Function, useCapture?: boolean): void;
    dispatchEvent(type: string, eventProperties: any): boolean;
    removeEventListener(type: string, listener: Function, useCapture?: boolean): void;
}
const EventMixin: EventMixin = <EventMixin><any>function () { };
WinJS.Utilities.markSupportedForProcessing(EventMixin);

WinJS.Class.mix(EventMixin, WinJS.Utilities.eventMixin);

export default EventMixin;