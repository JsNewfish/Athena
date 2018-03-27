angular.module('ui.bootstrap.alert', [])
    .controller('AlertController', ['$scope', '$attrs', function ($scope, $attrs) {
        $scope.closeable = 'close' in $attrs;
        $scope.size=$attrs.size;
        this.close = $scope.close;
    }])

    .directive('alert', function () {
        return {
            restrict: 'EA',
            controller: 'AlertController',
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || COMMON_SOURCE_PATH+'views/alert/alert.html';
            },
            transclude: true,
            replace: true,
            scope: {
                type: '@',
                close: '&'
            }
        };
    })

    .directive('dismissOnTimeout', ['$timeout', function ($timeout) {
        return {
            require: 'alert',
            link: function (scope, element, attrs, alertCtrl) {
                $timeout(function () {
                    alertCtrl.close();
                }, parseInt(attrs.dismissOnTimeout, 10));
            }
        };
    }]);
