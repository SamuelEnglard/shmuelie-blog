import * as WinJS from 'winjs'
import requirePromise from 'requirepromise'

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

const nav = WinJS.Navigation;

const pageRegex = /#([a-z]+):\/\/([A-Za-z0-9\/_\-\.]+\.htm)/g;

function getUrlForControl(controlName: string, url: string): string | null {
    let match: RegExpExecArray | null;
    pageRegex.lastIndex = 0;
    while ((match = pageRegex.exec(url)) !== null) {
        if (match.index === pageRegex.lastIndex) {
            pageRegex.lastIndex++;
        }

        if (match[1] === controlName) {
            return match[2];
        }
    }
    return null;
}

function parseUrl(url: string): { [name: string]: string } {
    let result: { [name: string]: string } = {};
    let match: RegExpExecArray | null;
    while ((match = pageRegex.exec(url)) !== null) {
        if (match.index === pageRegex.lastIndex) {
            pageRegex.lastIndex++;
        }

        result[match[1]] = match[2];
    }
    return result;
}

function buildUrl(map: { [name: string]: string }): string {
    return Object.getOwnPropertyNames(map).map(function (name) {
        return "#" + name + "://" + map[name];
    }).join("");
}

function updatehash() {
    nav.navigate(location.hash);
}

window.addEventListener("hashchange", updatehash, false);

const navigator: PageControlNavigatorStatic = WinJS.Class.define(function (this: PageControlNavigator, element: HTMLElement, options: { name: string }) {
    this.name = options.name;
    this._element = element || document.createElement("div");
    this._element.appendChild(this._createPageElement());
    this._lastNavigationPromise = WinJS.Promise.as<void>();
    nav.addEventListener('navigating', this._navigating.bind(this), false);
    nav.addEventListener('navigated', this._navigated.bind(this), false);
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
            const url = getUrlForControl(this.name, args.detail.location);
            if (url === null) {
                return;
            }
            WinJS.UI.Animation.enterPage(this._getAnimationElements()).done();
            window.addEventListener("hashchange", updatehash, false);
        },
        _navigating: function (this: PageControlNavigator, args: CustomEvent<{ location: string, state: any, delta: number, setPromise: (p: WinJS.IPromise<void>) => void }>) {
            window.removeEventListener("hashchange", updatehash, false);
            const url = getUrlForControl(this.name, args.detail.location);
            if (url === null) {
                return;
            }

            const hashes = parseUrl(location.hash);
            hashes[this.name] = url;
            location.hash = buildUrl(hashes);

            const newElement = this._createPageElement();
            let parentedComplete: () => void;
            const parented = new WinJS.Promise(function (c) { parentedComplete = c; });

            this._lastNavigationPromise.cancel();

            this._lastNavigationPromise = WinJS.Promise.timeout().then(function () {
                return requirePromise([url]);
            }).then(function () {
                return WinJS.UI.Pages.render(url, newElement, args.detail.state, parented);
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