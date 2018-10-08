import * as WinJS from 'winjs'
import 'twitter'
import 'linkedin'

interface ContactPageControl extends WinJS.UI.Pages.IPageControlMembers {
    getAnimationElements(): Element[]
    _element: HTMLElement
}

declare const IN: {
    parse: (element: HTMLElement) => void
};

const contactPageUrl = "pages/contact.htm";
WinJS.UI.Pages.define(contactPageUrl, <WinJS.UI.Pages.IPageControlMembers>{
    ready: function (this: ContactPageControl, element: HTMLElement, options: any): WinJS.Promise<void> {
        this._element = element;
        let p = new WinJS.Promise<void>(function (completeDispatch) {
            twttr.ready(function () {
                twttr.events.bind("loaded", function (ev) {
                    completeDispatch(ev);
                });
                twttr.widgets.load(element);
            });
        });
        IN.parse(element);
        return p;
    },
    getAnimationElements: function (this: ContactPageControl): Element[] {
        return WinJS.Utilities.children(this._element).slice();
    }
});
export default contactPageUrl;