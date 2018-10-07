import * as WinJS from 'winjs'

const contactPageUrl = "pages/contact.htm";
WinJS.UI.Pages.define(contactPageUrl, {
    ready: function (this: WinJS.UI.Pages.IPageControlMembers, element: HTMLElement, options: any): void {
        WinJS.UI.processAll(element);
    }
});
export default contactPageUrl;