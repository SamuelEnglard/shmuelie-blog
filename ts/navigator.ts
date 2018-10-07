// Copyright (c) Microsoft Corporation.  All Rights Reserved. Licensed under the MIT License. See License.txt in the project root for license information.
import * as WinJS from 'winjs'

interface PageControlNavigator {
    _element: HTMLElement
    home: string
    _lastNavigationPromise: WinJS.IPromise<{}>
    readonly pageControl: any
    readonly pageElement: Element
    _createPageElement(): HTMLDivElement
    _getAnimationElements(): any
    _navigated(): void
    _navigating(args: CustomEvent<{ location: string, state: any, delta: number, setPromise: (p: WinJS.IPromise<{}>) => void }>): void
}

interface PageControlNavigatorStatic {
    new(element: HTMLElement, options: { home: string }): PageControlNavigator;
}

let nav = WinJS.Navigation;

function hashNavigate() {
    let hash = location.hash;
    if (hash.length > 1) {
        pageNavigate(hash.substring(1));
    }
}

function pageNavigate(pageName: string, initialState?: any): WinJS.Promise<boolean> {
    return new WinJS.Promise<boolean>(function (completelDispatch, errorDispatch, processDispatch) {
        require([pageName], function (exports: { default: string }) {
            window.removeEventListener("hashchange", hashNavigate);
            location.hash = "#" + pageName;
            window.addEventListener("hashchange", hashNavigate);
            nav.navigate(exports.default, initialState).then(function onCompleted(value) {
                completelDispatch(value);
            }, function onError(value) {
                errorDispatch(value);
            }, function onProgress(value) {
                processDispatch(value);
            });
        });
    });
}

window.addEventListener("hashchange", hashNavigate);

let navigator: PageControlNavigatorStatic = WinJS.Class.define(function (this: PageControlNavigator, element: HTMLElement, options: { home: string }) {
    this._element = element || document.createElement("div");
    this._element.appendChild(this._createPageElement());
    this.home = options.home;
    this._lastNavigationPromise = WinJS.Promise.as();
    nav.addEventListener('navigating', this._navigating.bind(this), false);
    nav.addEventListener('navigated', this._navigated.bind(this), false);
    WinJS.Utilities.ready(() => {
        let hash = location.hash;
        if (hash.length > 1) {
            pageNavigate(hash.substring(1));
        }
        else {
            pageNavigate(this.home);
        }
    });
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
            var element = document.createElement("div");
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
        _navigated: function (this: PageControlNavigator) {
            WinJS.UI.Animation.enterPage(this._getAnimationElements()).done();
        },
        _navigating: function (this: PageControlNavigator, args: CustomEvent<{ location: string, state: any, delta: number, setPromise: (p: WinJS.IPromise<{}>) => void }>) {
            var newElement = this._createPageElement();
            var parentedComplete: () => void;
            var parented = new WinJS.Promise(function (c) { parentedComplete = c; });

            this._lastNavigationPromise.cancel();

            this._lastNavigationPromise = WinJS.Promise.timeout().then(function () {
                return WinJS.UI.Pages.render(args.detail.location, newElement, args.detail.state, parented);
            }).then(function parentElement(this: PageControlNavigator) {
                var oldElement = this.pageElement;

                // Dispose BackButton control
                var innerButtonElement = document.getElementById('innerButton');
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
            }.bind(this));

            args.detail.setPromise(this._lastNavigationPromise);
        }
    }
);

WinJS.Namespace.define("Shmuelie", {
    PageControlNavigator: navigator
});

export default pageNavigate;