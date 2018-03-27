+ function($) {

    if (!$) {
        throw new Error("jquery.location base in jQuery");
    }

    function Location(href) {
        var obj = getLocation(href)
        this.hash = obj.hash;
        this.host = obj.host;
        this.href = obj.href;
        this.origin = obj.origin;
        this.pathname = obj.pathname;
        this.port = obj.port;
        this.protocol = obj.protocol;
    }

    function getLocation(href) {
        if (!href) {
            return window.location;
        }

        var a = document.createElement("a"),
            reuslt = {};
        a.href = href;
        reuslt.hash = a.hash;
        reuslt.host = a.host;
        reuslt.href = a.href;
        reuslt.origin = a.origin;
        reuslt.pathname = a.pathname;
        reuslt.port = a.port;
        reuslt.protocol = a.protocol;
        return reuslt;
    }

    Location.prototype = {
        hashNodes: function() {
            var hash = this.hash;
            if (!hash) return [];

            var splitIndex = hash.indexOf("?"),
                hasVars = splitIndex != -1,
                start = hash.indexOf("#/") + 2,
                end = hasVars ? hash.indexOf("?") : hash.length,
                nodes;
            nodes = hash.slice(start, end).split("/");
            return nodes;
        },
        search: function(name) {
            var href = this.href,
                vars = {},
                splitIndex = href.indexOf("?"),
                hasVars = (splitIndex != -1) && (splitIndex != href.length - 1),
                varArray = hasVars ? href.slice(href.indexOf('?') + 1).split('&') : [];
            for (var i = 0; i < varArray.length; i++) {
                var varInstance = varArray[i].split('=');
                vars[varInstance[0]] = varInstance[1];
            }
            return name ? vars[name + ""] : vars;
        }
    };

    $.location = function(href) {
        var obj = new Location(href);
        return obj;
    }
}(jQuery);
