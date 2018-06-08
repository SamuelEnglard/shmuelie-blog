(function ()
		{
			"use strict";

			var Blog = {
				AppBar: {},
				Posts: {}
			};
			Blog.AppBar.MeClick = function ()
			{
				document.getElementById("meDialog").winControl.show(document.getElementById("personalAppBar"));
			}
			Blog.AppBar.LinkedInClick = function ()
			{
				window.open("https://www.linkedin.com/in/shmuelienglard", "_blank");
			};
			Blog.AppBar.AboutMeClick = function ()
			{
				window.open("https://about.me/shmuelie", "_blank");
			};
			Blog.AppBar.HomeClick = function ()
			{
				window.location = document.body.dataset.bloghome;
			};
			Blog.AppBar.RssClick = function ()
			{
				window.open(document.body.dataset.rss, "_blank");
			};
			Blog.AppBar.PodcastClick = function ()
			{
				document.getElementById("podcastFlyout").winControl.show(document.getElementById("podcastAppBar"));

			};
			Blog.Posts.HeaderClick = function (e)
			{
				var section = e.detail.section;
				var url = section.element.dataset.url;
				window.location = url;
			};
			Blog.Posts.TagClick = function (e)
			{
				var navbarCommand = e.detail.navbarCommand;
				var url = navbarCommand.element.dataset.url;
				window.location = url;
			};
			Blog.Posts.ReblogClick = function (e)
			{
				window.location = e.currentTarget.dataset.url;
			};
			Blog.Posts.PermaClick = Blog.Posts.ReblogClick;
			Blog.Posts.TwitterClick = function (e)
			{
				var dataset = e.currentTarget.dataset;
				twitterShare(dataset.url, dataset.title);
			}
			Blog.Posts.TagsNav = function (e)
			{
				document.getElementById("tagsMenu" + e.currentTarget.dataset.id).winControl.show(e.currentTarget, "auto");
			};
			Blog.Posts.TagsMenuClick = Blog.Posts.ReblogClick;
			Blog.AppBar.SearchClick = function (e)
			{
				if (e.detail.queryText !== "")
				{
					window.location = "/search?q=" + encodeURIComponent(e.detail.queryText);
				}
				else
				{
					window.location = document.body.dataset.bloghome;
				}
			};
			Blog.AppBar.SearchFlyClick = function (e)
			{
				document.getElementById("searchFlyout").winControl.show(e.currentTarget);
			};

			/*var flyout = document.getElementById("twitterFlyout");
			var widgetCount = -1;
			function refreshTwitter()
			{
				flyout.innerHTML = '<a class="twitter-timeline" data-dnt="true" href="https://www.twitter.com/Shmuelie" data-widget-id="287032163927457792" data-tweet-limit="5" data-chrome="nofooter">Tweets by @Shmuelie</a>';
				twttr.widgets.load();
				widgetCount++;
				setTimeout(waitForTwitter, 500);
			}

			flyout.addEventListener("click", function ()
			{
				flyout.winControl.hide();
			});

			function waitForTwitter()
			{
				if (flyout.innerHTML.indexOf("<a") === -1)
				{
					var timeline = document.getElementById("twitter-widget-" + widgetCount);
					timeline.style.width = "";
					timeline.style.maxWidth = "520px";
					timeline.height = 600;

					setTimeout(refreshTwitter, 120000);
				}
				else
				{
					setTimeout(waitForTwitter, 100);
				}
			}
			function twitterScript()
			{
				if (twttr.widgets)
				{
					refreshTwitter();
				}
				else
				{
					setTimeout(twitterScript);
				}
			}
			twitterScript();*/
			Blog.AppBar.TwitterClick = function ()
			{
				/*var twitterButton = document.getElementById("twitterAppBar");
				document.getElementById("twitter-widget-" + widgetCount).height = 600;
				flyout.winControl.show(twitterButton);*/
				window.open("https://www.twitter.com/shmuelie", "_blank");
			};

			var backButton = document.getElementById("BackButton");
			if (backButton !== null)
			{
				backButton.addEventListener("click", function ()
				{
					window.location = backButton.dataset.url;
				});
			}


			/*var feedHTML = "<div data-win-control=\"WinJS.UI.Pivot\">";
			var feeds = ["http://www.pwop.com/feed.aspx?show=dotnetrocks&filetype=master", "http://www.relay.fm/rocket/feed", "http://www.relay.fm/isometric/feed", "http://www.pwop.com/feed.aspx?show=runasradio&filetype=master", "http://hanselminutes.com/subscribe"];
			google.load("feeds", "1");
			google.setOnLoadCallback(function ()
			{
				function downloadFeed()
				{
					var feedUrl = feeds.pop();
					var feed = new google.feeds.Feed(feedUrl);
					feed.setNumEntries(1);
					feed.setResultFormat(google.feeds.Feed.MIXED_FORMAT);
					feed.load(function (result)
					{
						var xml = result.xmlDocument;
						var title = xml.getElementsByTagName("title")[0].textContent;
						var img = xml.getElementsByTagNameNS("http://www.itunes.com/dtds/podcast-1.0.dtd", "image")[0].attributes[0].nodeValue;
						var desc = xml.getElementsByTagName("description")[0].textContent;
						var href = xml.getElementsByTagName("link")[0].textContent;
						var latestEpisode = result.feed.entries[0];
						var latestTitle = latestEpisode.title;
						var latestLink = latestEpisode.link;

						feedHTML += "<div data-win-control=\"WinJS.UI.PivotItem\" data-win-options=\"{ header: '" + title + "' }\"><img style=\"width: 64px; height: 64px;\" src=\"" + img + "\"><div>" + desc + "</div><div style=\"margin-top: 10px;\"><h5 class=\"win-h5\">Latest Show</h5><a href=\"" + latestLink + "\" target=\"_blank\">" + latestTitle + "</a></div><div style=\"margin-top: 10px;\"><a href=\"" + href + "\" target=\"_blank\">" + href + "</a></div></div>"

						if (feeds.length > 0)
						{
							downloadFeed();
						}
						else
						{
							feedHTML += "</div>";
							var feedElmnt = document.getElementById("podcastFlyout");
							feedElmnt.addEventListener("aftershow", function ()
							{
								feedElmnt.innerHTML = feedHTML;
								var pivotElmnt = feedElmnt.firstElementChild;
								WinJS.UI.processAll().then(function ()
								{
									pivotElmnt.addEventListener("selectionchanged ", function ()
									{
										var itemElement = pivotElement.winControl.items.getAt(0).element;
										var offset = itemElement.style.left;
										itemElement.parentNode.style.marginLeft = "-" + offset;
									});
									pivotElmnt.style.height = "400px";
									pivotElmnt.style.width = "250px";
								});
							});
						}
					});
				}
				downloadFeed();
			});*/

			//Adish
			/*var adishAds = [
				{
					img: "http://www.girlgeniusonline.com/funextras/banners/girlgenius.01.jpg",
					alt: "Girl Genius",
					link: "http://www.girlgeniusonline.com/"
				},
				{
					img: "http://www.girlgeniusonline.com/funextras/banners/girlgenius.02.jpg",
					alt: "Girl Genius",
					link: "http://www.girlgeniusonline.com/"
				},
				{
					img: "http://www.girlgeniusonline.com/funextras/banners/girlgenius.14.jpg",
					alt: "Girl Genius",
					link: "http://www.girlgeniusonline.com/"
				}
			];
			var adish = document.getElementById("adish");
			var adishAd = adishAds[(new Date()).getTime() % adishAds.length];
			adish.src = adishAd.img;
			adish.alt = adishAd.alt;
			adish.parentNode.href = adishAd.link;*/
			
			//Pretty Code
			var codes = document.getElementsByTagName("code");
			for (var codeIndex = 0; codeIndex < codes.length; codeIndex++)
			{
			    var codeElmt = codes[codeIndex];
			    if (codeElmt.className.indexOf("text/") === 0)
			    {
			        var codeText = codeElmt.innerHTML;
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

			function preProcess()
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
			}

			function twitterShare(href, title)
			{
				var A, D;
				function H(K)
				{
					return encodeURIComponent(K).replace(/\+/g, "%2B")
				}
				function C(M)
				{
					var L = [], K;
					for (K in M)
					{
						if (M[K] !== null && typeof M[K] !== "undefined")
						{
							L.push(H(K) + "=" + H(M[K]))
						}
					}
					return L.sort().join("&")
				}
				window.open("https://twitter.com/share?" + (function ()
				{
					var L = {
						text: decodeURIComponent(title),
						url: href,
						_: ((new Date()).getTime()),
						via: "shmuelie"
					};
					return C(L)
				}()), "_blank", "left=" + Math.round((screen.width / 2) - 275) + ",top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1");
			}

			function postProcess()
			{
				
			}

			function start()
			{
				if (window.WinJS)
				{
					preProcess();
					WinJS.UI.processAll();
					postProcess();
				}
				else
				{
					setTimeout(start, 10);
				}
			}
			start();
		}());
