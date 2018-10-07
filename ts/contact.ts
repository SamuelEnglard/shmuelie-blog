import * as WinJS from 'winjs'
import 'twitter'
import 'linkedin'

declare const IN: {
    parse: (element: HTMLElement) => void
};

const contactPageUrl = "pages/contact.htm";
WinJS.UI.Pages.define(contactPageUrl, {
    ready: function (this: WinJS.UI.Pages.IPageControlMembers, element: HTMLElement, options: any): void {
        twttr.widgets.load(element);
        IN.parse(element);
        WinJS.UI.processAll(element);
    }
});
export default contactPageUrl;