import * as WinJS from 'winjs'
import * as StateManager from 'stateManager'
import { BlogEntry, postByUrl, postsSortedByDate } from 'posts'
import 'momentConverters'
import 'htmlHelpers'
import DynamicListLayout from 'DynamicListLayout'

interface BlogControl extends WinJS.UI.Pages.IPageControlMembers {
    user: StateManager.RegisteredUser;
    unload(): void;
}

WinJS.UI.Pages.define("pages/blog.htm", <WinJS.UI.Pages.IPageControlMembers>{
    ready: function (this: BlogControl, element: HTMLElement, options: any): void {
        element.setAttribute("dir", <string>window.getComputedStyle(element, null).direction);

        const postList: WinJS.UI.ListView<BlogEntry> = (<HTMLElement>element.querySelector(".listView")).winControl;
        const postListTemplate: WinJS.Binding.Template = (<HTMLElement>element.querySelector(".messageTemplate")).winControl;
        postList.itemDataSource = postsSortedByDate.dataSource;
        postList.layout = new DynamicListLayout(postListTemplate);
        postList.addEventListener("iteminvoked", function (e: CustomEvent<{ itemIndex: number }>) {
            WinJS.Navigation.navigate("#blog://" + postsSortedByDate.getAt(e.detail.itemIndex).url);

            hidePostList();
        });

        const blogSplit = <HTMLDivElement>element.querySelector(".blog-split");
        function showPostList() {
            WinJS.Utilities.removeClass(blogSplit, "win-splitview-pane-closed");
            WinJS.Utilities.addClass(blogSplit, "win-splitview-pane-opened");
        }
        function hidePostList() {
            WinJS.Utilities.removeClass(blogSplit, "win-splitview-pane-opened");
            WinJS.Utilities.addClass(blogSplit, "win-splitview-pane-closed");
        }

        const contentHeader = <HTMLDivElement>blogSplit.querySelector(".article-header");

        this.user = StateManager.register("blog");
        this.user.addEventListener("navigated", (e: CustomEvent<StateManager.NavigatedDetails>) => {
            const selectedPost = postByUrl.groups.getItemFromKey(e.detail.location).data;
            const selectedIndex = postsSortedByDate.indexOf(selectedPost);
            postList.selection.set(selectedIndex);
            postList.ensureVisible(selectedIndex);

            WinJS.Binding.processAll(contentHeader, selectedPost);

            const currentArticle = <HTMLElement>blogSplit.querySelector("article");
            const newArticle = <HTMLElement>document.createElement("article");
            WinJS.UI.Fragments.renderCopy(e.detail.location, newArticle).then(function () {
                WinJS.Utilities.query("a", newArticle).addClass("win-link");
                WinJS.Utilities.query("code", newArticle).addClass("win-code");
                return WinJS.UI.Animation.exitContent(currentArticle);
            }).then(function () {
                (<HTMLElement>currentArticle.parentElement).replaceChild(newArticle, currentArticle);
                WinJS.UI.Animation.enterContent(newArticle);
            });

            hidePostList();
        });

        const backButton = <HTMLButtonElement>contentHeader.querySelector(".win-navigation-backbutton");
        backButton.addEventListener("click", function () {
            showPostList();
        });
    },
    unload: function (this: BlogControl): void {
        StateManager.unregister(this.user);
    }
});