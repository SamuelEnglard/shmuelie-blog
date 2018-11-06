import * as WinJS from 'winjs'
import * as StateManager from 'stateManager'
import * as Posts from 'posts'
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

        const postList: WinJS.UI.ListView<Posts.BlogEntry> = (<HTMLElement>element.querySelector(".listView")).winControl;
        const postListTemplate: WinJS.Binding.Template = (<HTMLElement>element.querySelector(".messageTemplate")).winControl;
        const searchbox: WinJS.UI.AutoSuggestBox = (<HTMLElement>element.querySelector(".searchbox")).winControl;
        searchbox.addEventListener("suggestionsrequested", Posts.suggestTags);
        searchbox.addEventListener("querysubmitted", function (e: WinJS.UI.QuerySubmittedEvent) {
            e.stopPropagation();
            e.preventDefault();
            Posts.setQuery(e.detail.queryText);
        });
        postList.itemDataSource = Posts.getPosts();
        postList.layout = new DynamicListLayout(postListTemplate);
        postList.addEventListener("iteminvoked", function (e: CustomEvent<{ itemIndex: number }>) {
            WinJS.Navigation.navigate("#blog://" + Posts.getPostAt(e.detail.itemIndex).url);

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
        contentHeader.addEventListener("click", function (ev): void {
            ev.stopPropagation();
            ev.preventDefault();
            const srcElement = <Element>ev.srcElement;
            if (srcElement.localName !== "a") {
                return;
            }
            searchbox.queryText = srcElement.innerHTML;
            Posts.setQuery(searchbox.queryText);
        });

        this.user = StateManager.register("blog");
        this.user.addEventListener("navigated", function (e: WinJS.Navigation.NavigatedEvent) {
            const selectedPost = Posts.getPostByUrl(e.detail.location);
            const selectedIndex = Posts.indexOfPost(selectedPost);
            postList.selection.set(selectedIndex);
            postList.ensureVisible(selectedIndex);

            const currentArticle = <HTMLElement>blogSplit.querySelector("article");
            const newArticle = <HTMLElement>document.createElement("article");
            WinJS.UI.Fragments.renderCopy(e.detail.location, newArticle).then(function () {
                WinJS.Utilities.query("a", newArticle).addClass("win-link");
                WinJS.Utilities.query("code", newArticle).addClass("win-code");
                return WinJS.UI.Animation.exitContent(currentArticle);
            }).then(function () {
                WinJS.Binding.processAll(contentHeader, selectedPost);
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