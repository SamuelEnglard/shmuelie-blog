import * as WinJS from 'winjs'
import 'navigator'

interface BlogEntry {
    name: string;
    time: string;
    messageText: string;
    icon: string;
    url: string;
}

const posts = new WinJS.Binding.List<BlogEntry>([
    { name: "Rocco Gower", icon: "images/people/person1.png", time: "8:05p", messageText: "Did you get your tickets yet?", url: "posts/a.htm" },
    { name: "Alonzo Swope", icon: "images/people/person5.png", time: "7:34p", messageText: "I think we're all set. See you at the meeting tomorrow!", url: "posts/a.htm" },
    { name: "Heather Richmond", icon: "images/people/person7.png", time: "7:30p", messageText: "Let's schedule some time to review the latest reports.", url: "posts/a.htm" }
]);

WinJS.UI.Pages.define("pages/blog.htm", {
    ready: function (this: WinJS.UI.Pages.IPageControlMembers, element: HTMLElement, options: any): void {
        element.setAttribute("dir", <string>window.getComputedStyle(element, null).direction);
        const postList: WinJS.UI.ListView<BlogEntry> = (<HTMLElement>element.querySelector(".listView")).winControl;
        postList.itemDataSource = posts.dataSource;
        postList.addEventListener("iteminvoked", function (e: CustomEvent<{ itemIndex: number }>) {
            WinJS.Navigation.navigate("#blog://" + posts.getAt(e.detail.itemIndex).url);
        });
    }
});