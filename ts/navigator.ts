import * as WinJS from 'winjs'
import requirePromise from 'requirepromise'
import * as StateManager from 'stateManager'

export default class PageControlNavigator {
    private _element: HTMLElement
    private _lastNavigationPromise: WinJS.IPromise<void>
    readonly name: string
    readonly noScript: boolean

    constructor(element: HTMLElement, options: { name: string, noScript?: boolean }) {
        this.name = options.name;
        this.noScript = options.noScript || false;
        const us = StateManager.register(this.name);
        this._element = element || document.createElement("div");
        this._element.appendChild(this._createPageElement());
        this._lastNavigationPromise = WinJS.Promise.as<void>();
        us.addEventListener("navigated", this._navigated.bind(this), false);
        us.addEventListener("navigating", this._navigating.bind(this), false);
    }

    get pageControl(): any {
        return this.pageElement.winControl;
    }
    get pageElement(): Element {
        return <Element>(<HTMLElement>this._element).firstElementChild;
    }
    private _createPageElement(): HTMLDivElement {
        const element = document.createElement("div");
        element.style.width = "100%";
        element.style.height = "100%";
        return element;
    }
    private _getAnimationElements(): any {
        if (this.pageControl && this.pageControl.getAnimationElements) {
            return this.pageControl.getAnimationElements();
        }
        return this.pageElement;
    }
    private _navigated(args: CustomEvent<{ location: string, state: any }>): void {
        WinJS.UI.Animation.enterPage(this._getAnimationElements()).done();
    }
    private _navigating(args: CustomEvent<{ location: string, state: any, delta: number, setPromise: (p: WinJS.IPromise<void>) => void }>): void {
        const newElement = this._createPageElement();
        let parentedComplete: () => void;
        const parented = new WinJS.Promise(function (c) { parentedComplete = c; });

        this._lastNavigationPromise.cancel();

        this._lastNavigationPromise = WinJS.Promise.timeout().then(() => {
            if (this.noScript) {
                return WinJS.Promise.as();
            }
            return requirePromise([args.detail.location]);
        }).then(function () {
            return WinJS.UI.Pages.render(args.detail.location, newElement, args.detail.state, parented);
        }, function (e: Error) {
            if (e.name === "Canceled") {
                return WinJS.UI.Pages.render("pages/loading.htm", newElement, args.detail.state, parented);
            }
            return WinJS.UI.Pages.render("pages/404.htm", newElement, args.detail.state, parented);
        }).then(() => {
            const oldElement = this.pageElement;

            // Dispose BackButton control
            const innerButtonElement = document.getElementById('innerButton');
            if (innerButtonElement && innerButtonElement.winControl) {
                innerButtonElement.winControl.dispose();
            }

            if (oldElement.winControl && oldElement.winControl.unload) {
                oldElement.winControl.unload();
            }
            (<HTMLElement>this._element).appendChild(newElement);
            (<HTMLElement>this._element).removeChild(oldElement);
            oldElement.textContent = "";
            //this._updateBackButton();
            parentedComplete();
        });

        args.detail.setPromise(this._lastNavigationPromise);
    }
}

WinJS.Utilities.markSupportedForProcessing(PageControlNavigator);

WinJS.Namespace.define("Shmuelie", {
    PageControlNavigator: PageControlNavigator
});