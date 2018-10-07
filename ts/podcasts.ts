import * as WinJS from 'winjs'

const podcastsPageUrl = "pages/podcasts.htm";
WinJS.UI.Pages.define(podcastsPageUrl, {
    ready: function (this: WinJS.UI.Pages.IPageControlMembers, element: HTMLElement, options: any): void {
        WinJS.UI.processAll(element);
    }
});
export default podcastsPageUrl;