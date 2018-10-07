import * as WinJS from 'winjs'

const blogPageUrl = "pages/blog.htm";
WinJS.UI.Pages.define(blogPageUrl, {
    ready: function (this: WinJS.UI.Pages.IPageControlMembers, element: HTMLElement, options: any): void {
        WinJS.UI.processAll(element);
    }
});
export default blogPageUrl;