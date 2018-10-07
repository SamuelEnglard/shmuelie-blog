requirejs.config({
    shim: {
        "winjs": {
            deps: ["winjs-us", "winjs-base"]
        },
        "twitter": {
            exports: "twttr"
        },
        "linkedin": {
            exports: "IN"
        }
    },
    baseUrl: "js",
    paths: {
        "winjs-base": "https://cdnjs.cloudflare.com/ajax/libs/winjs/4.4.3/js/base.min",
        "winjs-ui": "https://cdnjs.cloudflare.com/ajax/libs/winjs/4.4.3/js/ui.min",
        "twitter": "https://platform.twitter.com/widgets",
        "linkedin": "https://platform.linkedin.com/in"
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