angular.module("dp.ui.base")
    .directive("dpBooleanAdapter", function () {
        return {
            restrict: 'AE',
            scope: {},
            require: '?^ngModel',
            link: function (scope, element, attrs, ctrl) {
                ctrl.$formatters.push(function (value) {
                    return !!value;
                });
                ctrl.$parsers.push(function (value) {
                    return String(value) == "true" ? 1 : 0;
                });
                ctrl.$render = function () {
                    element[0].checked = ctrl.$viewValue;
                }
            }
        }
    });



