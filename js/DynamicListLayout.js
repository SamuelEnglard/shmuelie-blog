define(["require", "exports", "winjs", "posts"], function (require, exports, WinJS, posts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DynamicListLayout = (function () {
        function DynamicListLayout(template) {
            this.horizontal = false;
            this.itemCache = null;
            this.template = template;
        }
        DynamicListLayout.prototype.itemInfo = function (itemIndex, maxWidth) {
            return this.template.render(posts_1.posts.getAt(itemIndex)).then(function (value) {
                value.style.position = "absolute";
                value.style.visibility = "hidden";
                value.style.maxWidth = maxWidth + "px";
                document.body.appendChild(value);
                var boundingRect = value.getBoundingClientRect();
                document.body.removeChild(value);
                return {
                    width: boundingRect.width,
                    height: boundingRect.height,
                    newColumn: false
                };
            });
        };
        Object.defineProperty(DynamicListLayout.prototype, "orientation", {
            get: function () {
                if (this.horizontal) {
                    return WinJS.UI.Orientation.horizontal;
                }
                return WinJS.UI.Orientation.vertical;
            },
            set: function (value) {
                this.horizontal = value === WinJS.UI.Orientation.horizontal;
            },
            enumerable: true,
            configurable: true
        });
        DynamicListLayout.prototype.dragLeave = function () {
        };
        DynamicListLayout.prototype.dragOver = function (x, y, dragInfo) {
        };
        DynamicListLayout.prototype.executeAnimations = function () {
        };
        DynamicListLayout.prototype.getAdjacent = function (currentItem, pressedKey) {
        };
        DynamicListLayout.prototype.hitTest = function (x, y) {
        };
        DynamicListLayout.prototype.initialize = function (site, groupsEnabled) {
            this.itemCache = [];
            return this.orientation;
        };
        DynamicListLayout.prototype.itemsFromRange = function (firstPixel, lastPixel) {
            if (this.itemCache === null) {
                this.itemCache = [];
            }
            var totalLength = 0;
            var firstIndex = 0;
            var lastIndex = -1;
            var firstItemFound = false;
            var itemCacheLength = this.itemCache.length;
            for (var i = 0; i < itemCacheLength; i++) {
                var item = this.itemCache[i];
                totalLength += item.height;
                if (!firstItemFound && totalLength >= firstPixel) {
                    firstIndex = item.index;
                    lastIndex = firstIndex;
                    firstItemFound = true;
                }
                else if (totalLength >= lastPixel) {
                    lastIndex = item.index;
                    break;
                }
                else if (firstItemFound && i === itemCacheLength - 1) {
                    lastIndex = item.index;
                }
            }
            return { firstIndex: firstIndex, lastIndex: lastIndex };
        };
        DynamicListLayout.prototype.layout = function (tree, changedRange, modifiedItems, modifiedGroups) {
            var _this = this;
            if (this.itemCache === null) {
                this.itemCache = [];
            }
            this.itemCache.length = 0;
            var items = tree[0].itemsContainer.items;
            var maxWidth = tree[0].itemsContainer.element.getBoundingClientRect().width - 38;
            var itemsLength = items.length;
            return WinJS.Promise.join(items.map(function (value, index) {
                return _this.itemInfo(index, maxWidth);
            })).then(function (values) {
                if (_this.itemCache === null) {
                    _this.itemCache = [];
                }
                for (var i = 0; i < itemsLength; i++) {
                    var value = values[i];
                    _this.itemCache.push({
                        height: value.height,
                        index: i
                    });
                    var item = items[i];
                    item.style.height = value.height + "px";
                    item.style.width = value.width + "px";
                }
            });
        };
        DynamicListLayout.prototype.setupAnimations = function () {
        };
        DynamicListLayout.prototype.uninitialize = function () {
            this.itemCache = null;
        };
        return DynamicListLayout;
    }());
    exports.default = DynamicListLayout;
});
