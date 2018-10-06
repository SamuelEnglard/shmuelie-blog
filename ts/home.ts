import * as WinJS from 'winjs'

interface HomePageControl extends WinJS.UI.Pages.IPageControlMembers {
    getAnimationElements(): Element[]
    _element: HTMLElement
}

const homePageUrl = "pages/home.htm";
WinJS.UI.Pages.define(homePageUrl, <WinJS.UI.Pages.IPageControlMembers>{
    ready: function (this: HomePageControl, element: HTMLElement, options: any): void {
        this._element = element;
        WinJS.UI.processAll(element);
    },
    getAnimationElements: function (this: HomePageControl): Element[] {
        return WinJS.Utilities.children(this._element).slice();
    }
});
export default homePageUrl;