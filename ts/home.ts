import * as WinJS from 'winjs'
import 'twitter'

interface HomePageControl extends WinJS.UI.Pages.IPageControlMembers {
    getAnimationElements(): Element[]
    _element: HTMLElement
}

WinJS.UI.Pages.define("pages/home.htm", <WinJS.UI.Pages.IPageControlMembers>{
    ready: function (this: HomePageControl, element: HTMLElement, options: any): WinJS.Promise<void> {
        this._element = element;
        let p = new WinJS.Promise<void>(function (completeDispatch) {
            twttr.ready(function () {
                twttr.events.bind("loaded", function (ev) {
                    completeDispatch(ev);
                });
                twttr.widgets.load(element);
            });
        });
        return p;
    },
    getAnimationElements: function (this: HomePageControl): Element[] {
        return WinJS.Utilities.children(this._element).slice();
    }
});