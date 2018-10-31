define(["require", "exports", "winjs", "stateManager", "posts", "DynamicListLayout", "momentConverters"], function (require, exports, WinJS, StateManager, posts_1, DynamicListLayout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WinJS.UI.Pages.define("pages/blog.htm", {
        ready: function (element, options) {
            element.setAttribute("dir", window.getComputedStyle(element, null).direction);
            var postList = element.querySelector(".listView").winControl;
            var postListTemplate = element.querySelector(".messageTemplate").winControl;
            postList.itemDataSource = posts_1.postsSortedByDate.dataSource;
            postList.layout = new DynamicListLayout_1.default(postListTemplate);
            postList.addEventListener("iteminvoked", function (e) {
                WinJS.Navigation.navigate("#blog://" + posts_1.postsSortedByDate.getAt(e.detail.itemIndex).url);
                hidePostList();
            });
            var blogSplit = element.querySelector(".blog-split");
            function showPostList() {
                WinJS.Utilities.removeClass(blogSplit, "win-splitview-pane-closed");
                WinJS.Utilities.addClass(blogSplit, "win-splitview-pane-opened");
            }
            function hidePostList() {
                WinJS.Utilities.removeClass(blogSplit, "win-splitview-pane-opened");
                WinJS.Utilities.addClass(blogSplit, "win-splitview-pane-closed");
            }
            var contentHeader = blogSplit.querySelector(".article-header");
            this.user = StateManager.register("blog");
            this.user.addEventListener("navigated", function (e) {
                var selectedPost = posts_1.postByUrl.groups.getItemFromKey(e.detail.location).data;
                var selectedIndex = posts_1.postsSortedByDate.indexOf(selectedPost);
                postList.selection.set(selectedIndex);
                postList.ensureVisible(selectedIndex);
                WinJS.Binding.processAll(contentHeader, selectedPost);
                var currentArticle = blogSplit.querySelector("article");
                var newArticle = document.createElement("article");
                WinJS.UI.Fragments.renderCopy(e.detail.location, newArticle).then(function () {
                    WinJS.Utilities.query("a", newArticle).addClass("win-link");
                    WinJS.Utilities.query("code", newArticle).addClass("win-code");
                    return WinJS.UI.Animation.exitContent(currentArticle);
                }).then(function () {
                    currentArticle.parentElement.replaceChild(newArticle, currentArticle);
                    WinJS.UI.Animation.enterContent(newArticle);
                });
                hidePostList();
            });
            var backButton = contentHeader.querySelector(".win-navigation-backbutton");
            backButton.addEventListener("click", function () {
                showPostList();
            });
        },
        unload: function () {
            StateManager.unregister(this.user);
        }
    });
});
