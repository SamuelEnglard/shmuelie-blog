define(["require", "exports", "winjs", "stateManager", "posts", "DynamicListLayout", "momentConverters", "htmlHelpers"], function (require, exports, WinJS, StateManager, Posts, DynamicListLayout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WinJS.UI.Pages.define("pages/blog.htm", {
        ready: function (element, options) {
            element.setAttribute("dir", window.getComputedStyle(element, null).direction);
            var postList = element.querySelector(".listView").winControl;
            var postListTemplate = element.querySelector(".messageTemplate").winControl;
            var searchbox = element.querySelector(".searchbox").winControl;
            searchbox.addEventListener("suggestionsrequested", Posts.suggestTags);
            searchbox.addEventListener("querysubmitted", function (e) {
                e.stopPropagation();
                e.preventDefault();
                Posts.setQuery(e.detail.queryText);
            });
            postList.itemDataSource = Posts.getPosts();
            postList.layout = new DynamicListLayout_1.default(postListTemplate);
            function navigateToPostIndex(index) {
                WinJS.Navigation.navigate("#blog://" + Posts.getPostAt(index).url);
                hidePostList();
            }
            postList.addEventListener("iteminvoked", function (e) {
                navigateToPostIndex(e.detail.itemIndex);
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
            contentHeader.addEventListener("click", function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                var srcElement = ev.srcElement;
                if (srcElement.localName !== "a") {
                    return;
                }
                searchbox.queryText = srcElement.innerHTML;
                Posts.setQuery(searchbox.queryText);
            });
            this.user = StateManager.register("blog");
            this.user.addEventListener("navigated", function (e) {
                var selectedPost = Posts.getPostByUrl(e.detail.location);
                var selectedIndex = Posts.indexOfPost(selectedPost);
                postList.selection.set(selectedIndex);
                postList.ensureVisible(selectedIndex);
                var currentArticle = blogSplit.querySelector("article");
                var newArticle = document.createElement("article");
                WinJS.UI.Fragments.renderCopy(e.detail.location, newArticle).then(function () {
                    WinJS.Utilities.query("a", newArticle).addClass("win-link");
                    WinJS.Utilities.query("code", newArticle).addClass("win-code");
                    return WinJS.UI.Animation.exitContent(currentArticle);
                }).then(function () {
                    WinJS.Binding.processAll(contentHeader, selectedPost);
                    currentArticle.parentElement.replaceChild(newArticle, currentArticle);
                    WinJS.UI.Animation.enterContent(newArticle);
                });
                hidePostList();
            });
            var backButton = contentHeader.querySelector(".win-navigation-backbutton");
            backButton.addEventListener("click", function () {
                showPostList();
            });
            navigateToPostIndex(0);
        },
        unload: function () {
            StateManager.unregister(this.user);
        }
    });
});
