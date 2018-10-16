requirejs.config({
    shim: {
        "winjs": {
            deps: ["winjs-us", "winjs-base"]
        },
        "twitter": {
            exports: "twttr"
        }
    },
    baseUrl: "js",
    paths: {
        "winjs-base": "https://cdnjs.cloudflare.com/ajax/libs/winjs/4.4.3/js/base.min",
        "winjs-ui": "https://cdnjs.cloudflare.com/ajax/libs/winjs/4.4.3/js/ui.min",
        "twitter": "https://platform.twitter.com/widgets",
        "pages/home.htm": "home",
        "pages/blog.htm": "blog",
        "pages/contact.htm": "contact",
        "pages/podcasts.htm": "podcasts"
    },
    map: {
        "*": {
            "winjs": "winjs-ui"
        },
        "winjs-ui": {
            "base": "winjs-base"
        }
    },
    deps: ["default"]
});