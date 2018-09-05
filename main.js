(function ()
{
    "use strict";

    var Blog = {
        AppBar: {
            MeClick: function ()
            {
                document.getElementById("meDialog").winControl.show(document.getElementById("personalAppBar"));
            },
            LinkedInClick: function ()
            {
                window.open("https://www.linkedin.com/in/shmuelienglard", "_blank");
            },
            AboutMeClick: function ()
            {
                window.open("https://about.me/shmuelie", "_blank");
            },
            HomeClick: function ()
            {
                window.location = document.body.dataset.bloghome;
            },
            RssClick: function ()
            {
                window.open(document.body.dataset.rss, "_blank");
            },
            PodcastClick: function ()
            {
                document.getElementById("podcastFlyout").winControl.show(document.getElementById("podcastAppBar"));
            },
            SearchClick: function (e)
            {
                if (e.detail.queryText !== "")
                {
                    window.location = "/search?q=" + encodeURIComponent(e.detail.queryText);
                }
                else
                {
                    window.location = document.body.dataset.bloghome;
                }
            },
            SearchFlyClick: function (e)
            {
                document.getElementById("searchFlyout").winControl.show(e.currentTarget);
            },
            TwitterClick: function (e)
            {
                Blog.Flyouts.Twitter.show(e.currentTarget);
            }
        },
        Posts: {
            HeaderClick: function (e)
            {
                var section = e.detail.section;
                var url = section.element.dataset.url;
                window.location = url;
            },
            TagClick: function (e)
            {
                var navbarCommand = e.detail.navbarCommand;
                var url = navbarCommand.element.dataset.url;
                window.location = url;
            },
            ReblogClick: function (e)
            {
                window.location = e.currentTarget.dataset.url;
            },
            PermaClick: function (e)
            {
                return Blog.Posts.ReblogClick(e);
            },
            TwitterClick: function (e)
            {
                var dataset = e.currentTarget.dataset;
                function H(K)
                {
                    return encodeURIComponent(K).replace(/\+/g, "%2B");
                }
                function C(M)
                {
                    var L = [], K;
                    for (K in M)
                    {
                        if (M[K] !== null && typeof M[K] !== "undefined")
                        {
                            L.push(H(K) + "=" + H(M[K]));
                        }
                    }
                    return L.sort().join("&");
                }
                window.open("https://twitter.com/share?" + (function ()
                {
                    var L = {
                        text: decodeURIComponent(dataset.title),
                        url: dataset.url,
                        _: (new Date()).getTime(),
                        via: "shmuelie"
                    };
                    return C(L);
                }()), "_blank", "left=" + Math.round((screen.width / 2) - 275) + ",top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1");
            },
            TagsNav: function (e)
            {
                document.getElementById("tagsMenu" + e.currentTarget.dataset.id).winControl.show(e.currentTarget, "auto");
            },
            TagsMenuClick: function (e)
            {
                return Blog.Posts.ReblogClick(e);
            }
        },
        Flyouts: {
            Twitter: null
        }
    };

    var backButton = document.getElementById("BackButton");
    if (backButton !== null)
    {
        backButton.addEventListener("click", function ()
        {
            window.location = backButton.dataset.url;
        });
    }

    var codes = document.getElementsByTagName("code");
    for (var codeIndex = 0; codeIndex < codes.length; codeIndex++)
    {
        var codeElmt = codes[codeIndex];
        if (codeElmt.className.indexOf("text/") === 0)
        {
            var preElmt = document.createElement("pre");
            preElmt.className = "prettyprint";
            codeElmt.parentElement.replaceChild(preElmt, codeElmt);
            preElmt.appendChild(codeElmt);
            codeElmt.className = "language-" + codeElmt.className.substr(5);
        }
    }
    var prettyScript = document.createElement("script");
    prettyScript.src = "https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js";
    document.body.appendChild(prettyScript);

    function start()
    {
        if (window.WinJS)
        {
            WinJS.Utilities.markSupportedForProcessing(Blog.AppBar.MeClick);
            WinJS.Utilities.markSupportedForProcessing(Blog.AppBar.LinkedInClick);
            WinJS.Utilities.markSupportedForProcessing(Blog.AppBar.AboutMeClick);
            WinJS.Utilities.markSupportedForProcessing(Blog.AppBar.HomeClick);
            WinJS.Utilities.markSupportedForProcessing(Blog.AppBar.RssClick);
            WinJS.Utilities.markSupportedForProcessing(Blog.Posts.HeaderClick);
            WinJS.Utilities.markSupportedForProcessing(Blog.Posts.TagClick);
            WinJS.Utilities.markSupportedForProcessing(Blog.Posts.ReblogClick);
            WinJS.Utilities.markSupportedForProcessing(Blog.Posts.TwitterClick);
            WinJS.Utilities.markSupportedForProcessing(Blog.AppBar.TwitterClick);
            WinJS.Utilities.markSupportedForProcessing(Blog.Posts.PermaClick);
            WinJS.Utilities.markSupportedForProcessing(Blog.Posts.TagsNav);
            WinJS.Utilities.markSupportedForProcessing(Blog.Posts.TagsMenuClick);
            WinJS.Utilities.markSupportedForProcessing(Blog.AppBar.SearchClick);
            WinJS.Utilities.markSupportedForProcessing(Blog.AppBar.SearchFlyClick);
            WinJS.Utilities.markSupportedForProcessing(Blog.AppBar.PodcastClick);

            WinJS.Namespace.define("Blog", Blog);

            WinJS.UI.processAll();

            var twitterFlyout = document.getElementById("twitterFlyout");
            twttr.widgets.createTimeline({ sourceType: "profile", screenName: "shmuelie" }, twitterFlyout);
            Blog.Flyouts.Twitter = new WinJS.UI.Flyout(twitterFlyout);
            Blog.Flyouts.Twitter.show(document.getElementsByTagName("header")[0]);
            Blog.Flyouts.Twitter.hide();
        }
        else
        {
            setTimeout(start, 10);
        }
    }
    start();
}());
