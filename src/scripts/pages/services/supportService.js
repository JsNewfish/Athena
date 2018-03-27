angular.module("dp.ui.base")
    .factory("$support", [function () {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

        if (Sys.ie) {
            Sys.version = parseInt((/msie (\d+)/.exec(ua.toLowerCase()) || [])[1]);
            if (isNaN(Sys.version)) {
                Sys.version = parseInt((/trident\/.*; rv:(\d+)/.exec(ua.toLowerCase()) || [])[1]);
            }
        }

        return Sys;
    }]);




