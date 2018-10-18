import * as WinJS from 'winjs'
import EventMixin from './EventMixin';

class RegisteredUser extends EventMixin {
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }
}

export interface BeforeNavigateDetails {
    location: string;
    state: any;
}

export interface NavigatedDetails {
    location: string;
    state: any;
}

export interface NavigatingDetails {
    location: string;
    state: any;
    delta: number;
    setPromise(p: WinJS.IPromise<any>): void;
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

const users: { [name: string]: RegisteredUser | null } = {};

function beforeNavigate(eventInfo: CustomEvent<BeforeNavigateDetails>): void {
    processNavigation(eventInfo.detail.location, "beforenavigated", eventInfo.detail);
}

function navigated(eventInfo: CustomEvent<NavigatedDetails>): void {
    processNavigation(eventInfo.detail.location, "navigated", eventInfo.detail);
}

function navigating(eventInfo: CustomEvent<NavigatingDetails>): void {
    processNavigation(eventInfo.detail.location, "navigating", eventInfo.detail);
}

let loaded = true;

function processNavigation(location: string, eventName: string, eventProperties: any): void {
    window.removeEventListener("hashchange", updateHash);
    const newHash = parseHash(location);
    const currentHash = parseHash(window.location.hash);
    Object.getOwnPropertyNames(newHash).forEach((name) => {
        const user = users[name] || null;
        if (user !== null) {
            if (loaded && currentHash[name] === newHash[name]) {
                return;
            }
            currentHash[name] = newHash[name];
            const props = {
                location: newHash[name]
            };
            (<any>props).__proto__ = eventProperties;
            user.dispatchEvent(eventName, props);
        }
    });
    window.location.hash = buildHash(currentHash);
    window.addEventListener("hashchange", updateHash);
}

function updateHash(): void {
    nav.navigate(location.hash);
}

export function register(name: string): RegisteredUser {
    const user = new RegisteredUser(name);
    users[name] = user;
    setImmediate(function () {
        const currentHash = parseHash(window.location.hash);
        if (currentHash[name]) {
            const tempLoaded = loaded;
            loaded = false;
            nav.navigate("#" + name + "://" + currentHash[name]);
            loaded = tempLoaded;
        }
    });
    return user;
}

export function unregister(user: RegisteredUser): void {
    users[user.name] = null;
}

nav.addEventListener("beforenavigate", beforeNavigate, false);
nav.addEventListener("navigated", navigated, false);
nav.addEventListener("navigating", navigating, false);
window.addEventListener("hashchange", updateHash);