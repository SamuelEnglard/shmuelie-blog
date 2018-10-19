define(["require", "exports", "winjs", "stateManager"], function (require, exports, WinJS, StateManager) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var posts = new WinJS.Binding.List([
        { name: "HoloLens", icon: "images/people/person1.png", time: "8:05p", messageText: "Hololens at Build 2015", url: "posts/a.htm" },
        { name: "Alonzo Swope", icon: "images/people/person5.png", time: "7:34p", messageText: "I think we're all set. See you at the meeting tomorrow!", url: "posts/b.htm" },
        { name: "Heather Richmond", icon: "images/people/person7.png", time: "7:30p", messageText: "Let's schedule some time to review the latest reports.", url: "posts/c.htm" }
    ]);
    var postByUrl = posts.createGrouped(function (x) { return x.url; }, function (x) { return x; });
    WinJS.UI.Pages.define("pages/blog.htm", {
        ready: function (element, options) {
            element.setAttribute("dir", window.getComputedStyle(element, null).direction);
            var postList = element.querySelector(".listView").winControl;
            postList.itemDataSource = posts.dataSource;
            postList.addEventListener("iteminvoked", function (e) {
                WinJS.Navigation.navigate("#blog://" + posts.getAt(e.detail.itemIndex).url);
                WinJS.Utilities.removeClass(blogSplit, "win-splitview-pane-opened");
                WinJS.Utilities.addClass(blogSplit, "win-splitview-pane-closed");
            });
            var user = StateManager.register("blog");
            var blogSplit = element.querySelector(".blog-split");
            var contentArea = blogSplit.querySelector("article");
            var contentHeader = blogSplit.querySelector(".article-header");
            var backButton = contentHeader.querySelector(".win-navigation-backbutton");
            backButton.addEventListener("click", function () {
                WinJS.Utilities.removeClass(blogSplit, "win-splitview-pane-closed");
                WinJS.Utilities.addClass(blogSplit, "win-splitview-pane-opened");
            });
            user.addEventListener("navigated", function (e) {
                var selectedPost = postByUrl.groups.getItemFromKey(e.detail.location).data;
                postList.selection.set(posts.indexOf(selectedPost));
                WinJS.Binding.processAll(contentHeader, selectedPost);
                contentArea.innerHTML = "";
                WinJS.UI.Fragments.renderCopy(e.detail.location, contentArea);
                WinJS.Utilities.removeClass(blogSplit, "win-splitview-pane-opened");
                WinJS.Utilities.addClass(blogSplit, "win-splitview-pane-closed");
            });
        }
    });
});
