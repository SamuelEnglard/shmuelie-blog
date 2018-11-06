declare module WinJS.Utilities {
    export enum ModifierKeys {
        none = 0,
        control = 1,
        menu = 2,
        shift = 4,
        windows = 8
    }
}

declare module WinJS.UI {
    export interface SearchSuggestionCollection {
        readonly size: number;
        appendQuerySuggestion(text: string): void;
        appendQuerySuggestions(suggestions: string[]): void;
        appendResultSuggestion(text: string, detailText: string, tag: string, imageUrl: string, imageAlternateText: string): void;
        appendSearchSeparator(label: string): void;
    }

    export interface SuggestionsRequestedEventDetails {
        language: string;
        linguisticDetails: {};
        queryText: string;
        searchSuggestionCollection: SearchSuggestionCollection;
    }

    export type SuggestionsRequestedEvent = CustomEvent<SuggestionsRequestedEventDetails>;

    export interface QuerySubmittedEventDetails {
        language: string;
        queryText: string;
        linguisticDetails: {};
        keyModifiers: WinJS.Utilities.ModifierKeys;
    }

    export type QuerySubmittedEvent = CustomEvent<QuerySubmittedEventDetails>;

    export interface QueryChangedEventDetails {
        language: string;
        queryText: string;
        linguisticDetails: {};
    }

    export type QueryChangedEvent = CustomEvent<QueryChangedEventDetails>;

    export interface LayoutResult {
        realizedRangeComplete: WinJS.Promise<any>;
        layoutComplete: WinJS.Promise<any>;
    }

    export interface LayoutTree {
        itemsContainer: {
            element: HTMLElement;
            items: HTMLElement[];
        }
    }
}

declare module WinJS.Navigation {
    export interface BeforeNavigateEventDetails {
        location: string;
        state: any;
    }

    export type BeforeNavigatedEvent = CustomEvent<BeforeNavigateEventDetails>;

    export interface NavigatedEventDetails {
        location: string;
        state: any;
    }

    export type NavigatedEvent = CustomEvent<NavigatedEventDetails>;

    export interface NavigatingEventDetails {
        location: string;
        state: any;
        delta: number;
        setPromise(p: WinJS.IPromise<any>): void;
    }

    export type NavigatingEvent = CustomEvent<NavigatingEventDetails>;
}