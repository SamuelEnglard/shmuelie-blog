define(["require", "exports", "winjs", "stateManager"], function (require, exports, WinJS, StateManager) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var posts = new WinJS.Binding.List([
        { name: "Rocco Gower", icon: "images/people/person1.png", time: "8:05p", messageText: "Did you get your tickets yet?", url: "posts/a.htm" },
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
            });
            var user = StateManager.register("blog");
            user.addEventListener("navigated", function (e) {
                console.log(postByUrl.groups.getItemFromKey(e.detail.location).data.messageText);
            });
        }
    });
});
