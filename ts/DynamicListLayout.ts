import * as WinJS from 'winjs'
import * as Posts from 'posts'

interface ItemInfo {
    width: number;
    height: number;
    newColumn: boolean;
}

interface ItemCacheItem {
    height: number;
    index: number;
}

export default class DynamicListLayout implements WinJS.UI.ILayout2 {
    private readonly template: WinJS.Binding.Template;
    private horizontal = false;
    private itemCache: ItemCacheItem[] | null = null;

    constructor(template: WinJS.Binding.Template) {
        this.template = template;
    }

    private itemInfo(itemIndex: number, maxWidth: number): WinJS.Promise<ItemInfo> {
        return this.template.render(Posts.getPostAt(itemIndex)).then((value) => {
            value.style.position = "absolute";
            value.style.visibility = "hidden";
            value.style.maxWidth = maxWidth + "px";
            document.body.appendChild(value);
            const boundingRect = value.getBoundingClientRect();
            document.body.removeChild(value);
            return {
                width: boundingRect.width,
                height: boundingRect.height,
                newColumn: false
            };
        });
    }

    get orientation(): WinJS.UI.Orientation {
        if (this.horizontal) {
            return WinJS.UI.Orientation.horizontal;
        }
        return WinJS.UI.Orientation.vertical;
    }
    set orientation(value: WinJS.UI.Orientation) {
        this.horizontal = value === WinJS.UI.Orientation.horizontal;
    }

    dragLeave(): void {
    }
    dragOver(x: number, y: number, dragInfo: number): void {
    }
    executeAnimations(): void {
    }
    getAdjacent(currentItem: any, pressedKey: WinJS.Utilities.Key) {
    }
    hitTest(x: number, y: number) {
    }

    initialize(site: WinJS.UI.ILayoutSite2, groupsEnabled: boolean): WinJS.UI.Orientation {
        this.itemCache = [];
        return this.orientation;
    }

    itemsFromRange(firstPixel: number, lastPixel: number): { firstIndex: number, lastIndex: number } {
        if (this.itemCache === null) {
            this.itemCache = [];
        }

        let totalLength = 0;

        // Initialize firstIndex and lastIndex to be an empty range
        let firstIndex = 0;
        let lastIndex = -1;

        let firstItemFound = false;

        const itemCacheLength = this.itemCache.length;
        for (let i = 0; i < itemCacheLength; i++) {
            let item = this.itemCache[i];
            totalLength += item.height;

            // Find the firstIndex
            if (!firstItemFound && totalLength >= firstPixel) {
                firstIndex = item.index;
                lastIndex = firstIndex;
                firstItemFound = true;
            }
            else if (totalLength >= lastPixel) {
                // Find the lastIndex
                lastIndex = item.index;
                break;
            }
            else if (firstItemFound && i === itemCacheLength - 1) {
                // If we are at the end of the cache and we have found the firstItem, the lastItem is in the range
                lastIndex = item.index;
            }
        }

        return { firstIndex: firstIndex, lastIndex: lastIndex };
    }

    layout(tree: WinJS.UI.LayoutTree[], changedRange: any, modifiedItems: any, modifiedGroups: any): WinJS.Promise<WinJS.UI.LayoutResult | void> {
        if (this.itemCache === null) {
            this.itemCache = [];
        }
        this.itemCache.length = 0;
        const items = tree[0].itemsContainer.items;
        const maxWidth = tree[0].itemsContainer.element.getBoundingClientRect().width - 38;

        const itemsLength = items.length;
        return (<WinJS.Promise<ItemInfo[]>>WinJS.Promise.join(items.map((value, index) => {
            return this.itemInfo(index, maxWidth);
        }))).then((values) => {
            if (this.itemCache === null) {
                this.itemCache = [];
            }
            for (let i = 0; i < itemsLength; i++) {
                const value = values[i];
                this.itemCache.push({
                    height: value.height,
                    index: i
                });
                const item = items[i];
                item.style.height = value.height + "px";
                item.style.width = value.width + "px";
            }
        });
    }

    setupAnimations(): void {
    }

    uninitialize(): void {
        this.itemCache = null;
    }
}