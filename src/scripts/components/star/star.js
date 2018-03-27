angular.module("dp.ui.star", [])
    .directive("dpStar", [function () {
        var DEFAULTS = {
            maxScore: 10
        };

        function link(scope, element, attrs, ctrl) {
            var options = {
                maxScore: Number(attrs.maxScore),
                score: Number(attrs.score)
            };
            scope.options = $.extend({}, DEFAULTS, options);

            var percentage = (90 * scope.options.score / scope.options.maxScore).toFixed(2);
            scope.style = {
                width: percentage + "px"
            }
        }

        return {
            restrict: "EA",
            templateUrl: COMMON_SOURCE_PATH + "views/star/star.html",
            link: link,
            scope: {
                score: "@",
                maxScore: "@"
            },
            replace: true
        }
    }]);