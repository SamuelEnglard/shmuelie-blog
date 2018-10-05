import * as WinJS from 'winjs'

interface HomePageControl extends WinJS.UI.Pages.IPageControlMembers {
}

const homePageUrl = "pages/home.htm";
WinJS.UI.Pages.define(homePageUrl, {
    ready: function (this: HomePageControl, element: HTMLElement, options: any): void {
        WinJS.UI.processAll(element);
    }
});
export default homePageUrl;