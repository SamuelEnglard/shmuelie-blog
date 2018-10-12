import * as WinJS from 'winjs'

interface StateManagerInstance {
    _users: { [name: string]: RegisteredUserInstance | null }

    register(name: string): RegisteredUserInstance;
    _beforeNavigated(eventInfo: CustomEvent<BeforeNavigateDetails>): void;
    _navigated(eventInfo: CustomEvent<NavigatedDetails>): void;
    _navigating(eventInfo: CustomEvent<NavigatingDetails>): void;
    _processNavigation(location: string, eventName: string, eventProperties: any): void;
    _updateHash(): void;
}

interface StateManagerStatic {
    new(): StateManagerInstance;
}

interface BeforeNavigateDetails {
    location: string;
    state: any;
}

interface NavigatedDetails {
    location: string;
    state: any;
}

interface NavigatingDetails {
    location: string;
    state: any;
    delta: number;
    setPromise(p: WinJS.IPromise<any>): void;
}

interface RegisteredUserInstance {
    name: string;

    /**
     * Adds an event listener to the control.
     * @param type The type (name) of the event.
     * @param listener The listener to invoke when the event gets raised.
     * @param useCapture If true, initiates capture, otherwise false.
    **/
    addEventListener(type: string, listener: Function, useCapture?: boolean): void;

    /**
     * Raises an event of the specified type and with the specified additional properties.
     * @param type The type (name) of the event.
     * @param eventProperties The set of additional properties to be attached to the event object when the event is raised.
     * @returns true if preventDefault was called on the event.
    **/
    dispatchEvent(type: string, eventProperties: any): boolean;

    /**
     * Removes an event listener from the control.
     * @param type The type (name) of the event.
     * @param listener The listener to remove.
     * @param useCapture true if capture is to be initiated, otherwise false.
    **/
    removeEventListener(type: string, listener: Function, useCapture?: boolean): void;
}

interface RegisteredUserStatic {
    new(name: string): RegisteredUserInstance;
}

const nav = WinJS.Navigation;

const hashRegex = /#([a-z]+):\/\/([A-Za-z0-9\/_\-\.]+\.htm)/g;

function parseHash(url: string): { [name: string]: string } {
    let result: { [name: string]: string } = {};
    let match: RegExpExecArray | null;
    while ((match = hashRegex.exec(url)) !== null) {
        if (match.index === hashRegex.lastIndex) {
            hashRegex.lastIndex++;
        }

        result[match[1]] = match[2];
    }
    return result;
}

function buildHash(map: { [name: string]: string }): string {
    return Object.getOwnPropertyNames(map).map(function (name) {
        return "#" + name + "://" + map[name];
    }).join("");
}

const RegisteredUser: RegisteredUserStatic = WinJS.Class.define(function constructor(this: RegisteredUserInstance, name: string) {
    this.name = name;
});
WinJS.Class.mix(RegisteredUser, WinJS.Utilities.eventMixin);

const StateManager: StateManagerStatic = WinJS.Class.define(function constructor(this: StateManagerInstance) {
    this._users = {};
    nav.addEventListener("beforenavigate", this._beforeNavigated.bind(this), false);
    nav.addEventListener("navigated", this._navigated.bind(this), false);
    nav.addEventListener("navigating", this._navigating.bind(this), false);
    window.addEventListener("hashchange", this._updateHash);
}, {
        _beforeNavigated(this: StateManagerInstance, eventInfo: CustomEvent<BeforeNavigateDetails>): void {
            this._processNavigation(eventInfo.detail.location, "beforenavigated", eventInfo.detail);
        },
        _navigated(this: StateManagerInstance, eventInfo: CustomEvent<NavigatedDetails>): void {
            this._processNavigation(eventInfo.detail.location, "navigated", eventInfo.detail);
        },
        _navigating(this: StateManagerInstance, eventInfo: CustomEvent<NavigatingDetails>): void {
            this._processNavigation(eventInfo.detail.location, "navigating", eventInfo.detail);
        },
        register(this: StateManagerInstance, name: string): RegisteredUserInstance {
            const user = new RegisteredUser(name);
            this._users[name] = user;
            return user;
        },
        _processNavigation(this: StateManagerInstance, location: string, eventName: string, eventProperties: any): void {
            window.removeEventListener("hashchange", this._updateHash);
            const newHash = parseHash(location);
            const currentHash = parseHash(window.location.hash);
            Object.getOwnPropertyNames(newHash).forEach((name) => {
                const user = this._users[name];
                if (user !== null) {
                    currentHash[name] = newHash[name];
                    const props = {
                        location: newHash[name]
                    };
                    (<any>props).__proto__ = eventProperties;
                    user.dispatchEvent(eventName, props);
                }
            });
            window.location.hash = buildHash(currentHash);
            window.addEventListener("hashchange", this._updateHash);
        },
        _updateHash(this: StateManagerInstance): void {
            nav.navigate(location.hash);
        }
    });
const stateManager = new StateManager();
export default stateManager;