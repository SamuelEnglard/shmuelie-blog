import * as WinJS from 'winjs'
import requirePromise from 'requirepromise'
import stateManager from 'stateManager'

interface PageControlNavigator {
    _element: HTMLElement
    _lastNavigationPromise: WinJS.IPromise<void>
    name: string
    readonly pageControl: any
    readonly pageElement: Element
    _createPageElement(): HTMLDivElement
    _getAnimationElements(): any
    _navigated(args: CustomEvent<{ location: string, state: any }>): void
    _navigating(args: CustomEvent<{ location: string, state: any, delta: number, setPromise: (p: WinJS.IPromise<{}>) => void }>): void
    addEventListener(type: string, listener: Function, useCapture?: boolean): void
    dispatchEvent(type: string, eventProperties: any): boolean
    removeEventListener(type: string, listener: Function, useCapture?: boolean): void
}

interface PageControlNavigatorStatic {
    new(element: HTMLElement, options: { name: string }): PageControlNavigator;
}

const navigator: PageControlNavigatorStatic = WinJS.Class.define(function (this: PageControlNavigator, element: HTMLElement, options: { name: string }) {
    this.name = options.name;
    const us = stateManager.register(this.name);
    this._element = element || document.createElement("div");
    this._element.appendChild(this._createPageElement());
    this._lastNavigationPromise = WinJS.Promise.as<void>();
    us.addEventListener("navigated", this._navigated.bind(this), false);
    us.addEventListener("navigating", this._navigating.bind(this), false);
},
    {
        pageControl: {
            get: function (this: PageControlNavigator) {
                return this.pageElement.winControl;
            }
        },
        pageElement:
        {
            get: function (this: PageControlNavigator) {
                return <Element>(<HTMLElement>this._element).firstElementChild;
            }
        },
        _createPageElement(this: PageControlNavigator) {
            const element = document.createElement("div");
            element.style.width = "100%";
            element.style.height = "100%";
            return element;
        },
        _getAnimationElements: function (this: PageControlNavigator) {
            if (this.pageControl && this.pageControl.getAnimationElements) {
                return this.pageControl.getAnimationElements();
            }
            return this.pageElement;
        },
        _navigated: function (this: PageControlNavigator, args: CustomEvent<{ location: string, state: any }>) {
            WinJS.UI.Animation.enterPage(this._getAnimationElements()).done();
        },
        _navigating: function (this: PageControlNavigator, args: CustomEvent<{ location: string, state: any, delta: number, setPromise: (p: WinJS.IPromise<void>) => void }>) {
            const newElement = this._createPageElement();
            let parentedComplete: () => void;
            const parented = new WinJS.Promise(function (c) { parentedComplete = c; });

            this._lastNavigationPromise.cancel();

            this._lastNavigationPromise = WinJS.Promise.timeout().then(function () {
                return requirePromise([args.detail.location]);
            }).then(function () {
                return WinJS.UI.Pages.render(args.detail.location, newElement, args.detail.state, parented);
            }, () => {
                this.dispatchEvent("404", {});
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
);

WinJS.Class.mix(navigator, WinJS.Utilities.eventMixin);

WinJS.Namespace.define("Shmuelie", {
    PageControlNavigator: navigator
});