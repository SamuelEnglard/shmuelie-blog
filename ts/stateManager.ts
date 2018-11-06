import * as WinJS from 'winjs'
import EventMixin from './EventMixin';

export class RegisteredUser extends EventMixin {
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }
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

function buildHash(map: { [name: string]: string | null }): string {
    return Object.getOwnPropertyNames(map).filter(function (name) {
        return map[name] !== null;
    }).map(function (name) {
        return "#" + name + "://" + map[name];
    }).join("");
}

const users: { [name: string]: RegisteredUser | null } = {};

const beforenavigatedEvent = "beforenavigated";
function beforeNavigate(eventInfo: WinJS.Navigation.BeforeNavigatedEvent): void {
    processNavigation(eventInfo.detail.location, beforenavigatedEvent, eventInfo.detail);
}

const navigatedEvent = "navigated";
function navigated(eventInfo: WinJS.Navigation.NavigatedEvent): void {
    processNavigation(eventInfo.detail.location, navigatedEvent, eventInfo.detail);
}

const navigatingEvent = "navigating";
function navigating(eventInfo: WinJS.Navigation.NavigatingEvent): void {
    processNavigation(eventInfo.detail.location, navigatingEvent, eventInfo.detail);
}

let loaded = true;

const hashchangeEvent = "hashchange";
function processNavigation(location: string, eventName: string, eventProperties: any): void {
    window.removeEventListener(hashchangeEvent, updateHash);
    const newHash = parseHash(location);
    const currentHash = parseHash(window.location.hash);
    Object.getOwnPropertyNames(newHash).forEach((name) => {
        const user = users[name] || null;
        if (user !== null) {
            if (loaded && currentHash[name] === newHash[name]) {
                return;
            }
            if (eventName === navigatedEvent) {
                currentHash[name] = newHash[name];
            }
            const props = {
                location: newHash[name]
            };
            (<any>props).__proto__ = eventProperties;
            user.dispatchEvent(eventName, props);
        }
    });
    window.location.hash = buildHash(currentHash);
    window.addEventListener(hashchangeEvent, updateHash);
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
    window.removeEventListener(hashchangeEvent, updateHash);
    const currentHash: { [name: string]: string | null } = parseHash(window.location.hash);
    currentHash[user.name] = null;
    window.location.hash = buildHash(currentHash);
    window.addEventListener(hashchangeEvent, updateHash);
}

nav.addEventListener(beforenavigatedEvent, beforeNavigate, false);
nav.addEventListener(navigatedEvent, navigated, false);
nav.addEventListener(navigatingEvent, navigating, false);
window.addEventListener(hashchangeEvent, updateHash);