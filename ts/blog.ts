import * as WinJS from 'winjs'
import * as StateManager from 'stateManager'

interface BlogEntry {
    name: string;
    time: string;
    messageText: string;
    icon: string;
    url: string;
}

const posts = new WinJS.Binding.List<BlogEntry>([
    { name: "HoloLens", icon: "images/people/person1.png", time: "8:05p", messageText: "Hololens at Build 2015", url: "posts/a.htm" },
    { name: "Alonzo Swope", icon: "images/people/person5.png", time: "7:34p", messageText: "I think we're all set. See you at the meeting tomorrow!", url: "posts/b.htm" },
    { name: "Heather Richmond", icon: "images/people/person7.png", time: "7:30p", messageText: "Let's schedule some time to review the latest reports.", url: "posts/c.htm" }
]);
const postByUrl = posts.createGrouped(function (x) { return x.url; }, function (x) { return x; });

WinJS.UI.Pages.define("pages/blog.htm", {
    ready: function (this: WinJS.UI.Pages.IPageControlMembers, element: HTMLElement, options: any): void {
        element.setAttribute("dir", <string>window.getComputedStyle(element, null).direction);
        const postList: WinJS.UI.ListView<BlogEntry> = (<HTMLElement>element.querySelector(".listView")).winControl;
        postList.itemDataSource = posts.dataSource;
        postList.addEventListener("iteminvoked", function (e: CustomEvent<{ itemIndex: number }>) {
            WinJS.Navigation.navigate("#blog://" + posts.getAt(e.detail.itemIndex).url);
            WinJS.Utilities.removeClass(blogSplit, "win-splitview-pane-opened");
            WinJS.Utilities.addClass(blogSplit, "win-splitview-pane-closed");
        });
        const user = StateManager.register("blog");
        const blogSplit: HTMLDivElement = <HTMLDivElement>element.querySelector(".blog-split");
        const contentArea: HTMLElement = <HTMLElement>blogSplit.querySelector("article");
        const contentHeader: HTMLDivElement = <HTMLDivElement>blogSplit.querySelector(".article-header");
        const backButton: HTMLButtonElement = <HTMLButtonElement>contentHeader.querySelector(".win-navigation-backbutton");
        backButton.addEventListener("click", function () {
            WinJS.Utilities.removeClass(blogSplit, "win-splitview-pane-closed");
            WinJS.Utilities.addClass(blogSplit, "win-splitview-pane-opened");
        });
        user.addEventListener("navigated", (e: CustomEvent<StateManager.NavigatedDetails>) => {
            const selectedPost = postByUrl.groups.getItemFromKey(e.detail.location).data;
            postList.selection.set(posts.indexOf(selectedPost));
            WinJS.Binding.processAll(contentHeader, selectedPost);
            contentArea.innerHTML = "";
            WinJS.UI.Fragments.renderCopy(e.detail.location, contentArea);
            WinJS.Utilities.removeClass(blogSplit, "win-splitview-pane-opened");
            WinJS.Utilities.addClass(blogSplit, "win-splitview-pane-closed");
        });
    }
});