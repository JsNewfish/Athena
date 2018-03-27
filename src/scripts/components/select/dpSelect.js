//单选、多选组
angular.module("dp.ui.select", [])
    .directive("dpSelectGroup", [function () {
        var controller = function ($scope, $element, $attrs) {
            var ctrl = this,
                items = ctrl.items = $scope.items = [];

            $scope.selectValue = Number.NaN;
            $scope.selectValueArray = [];

            //single or multi
            ctrl.isSingle = $scope.isSingle = $attrs.type.toLowerCase() == 'single';

            ctrl.select = function (curSelect) {
                $scope.selectValue = curSelect.value;
            };

            ctrl.selectMulti = function (curSelect) {
                var index = $scope.selectValueArray.indexOf(curSelect.value);
                index == -1 ? $scope.selectValueArray.push(curSelect.value) : $scope.selectValueArray.splice(index, 1);

                angular.forEach($scope.items, function (item) {
                    if (item.type == "limit") {
                        if ($scope.selectValueArray.length == 0) {
                            ctrl.setEmpty(item);
                            return;
                        }
                        var limitIndex = $scope.selectValueArray.indexOf(item.value);
                        limitIndex != -1 && $scope.selectValueArray.splice(limitIndex, 1);
                    }
                })
            };

            ctrl.format = function (data) {
                switch ($attrs.format) {
                    case "string":
                    {
                        return $.trim(data.toString());
                    }
                    case "integer":
                    {
                        return parseInt(data);
                    }
                    default :
                    {
                        return $.trim(data);
                    }
                }
            };

            ctrl.setEmpty = function (curSelect) {
                var length = $scope.selectValueArray.length;
                while (length--) {
                    $scope.selectValueArray.splice(length, 1);
                }

                $scope.selectValueArray.push(curSelect.value);
            }
        };

        var link = function (scope, element, attrs, ctrl) {
            //监控数据
            scope.$watch(scope.isSingle ? "selectValue" : "selectValueArray", function (newValue, oldValue) {
                if (newValue != oldValue) {
                    ctrl.$setViewValue(newValue);
                    ctrl.$render();
                }
            }, !scope.isSingle);

            //设置渲染模式
            ctrl.$render = scope.isSingle ? renderSingle : renderMulti;

            function renderSingle() {
                angular.forEach(scope.items, function (item) {
                    item.active = item.value == ctrl.$viewValue;
                });
                scope.selectValue = ctrl.$viewValue;
            }

            function renderMulti() {
                angular.forEach(scope.items, function (item) {
                    if (typeof ctrl.$viewValue != "undefined") {
                        item.active = ctrl.$viewValue.indexOf(item.value) != -1;
                    }
                });
                scope.selectValueArray = ctrl.$viewValue;
            }
        };

        return {
            restrict: "A",
            transclude: true,
            scope: {},
            replace: true,
            controller: controller,
            require: "ngModel",
            template: '<div class="condition-label-group" ng-transclude></div>',
            link: link
        }
    }])
    .directive("dpSelect", function () {
        return {
            restrict: "A",
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "components/dpSelect.html";
            },
            transclude: true,
            scope: {
                num: "=",
                active: "@",
                text: "@"
            },
            replace: true,
            require: "?^dpSelectGroup",
            link: function (scope, element, attrs, groupCtrl, transclude) {
                var innerContent = element.find("[ng-transclude]").eq(0);
                scope.value = groupCtrl.format(attrs.value);
                scope.disabled = attrs.disabled == "true";
                groupCtrl.items.push(scope);
                scope.select = !scope.disabled ? function () {
                    groupCtrl.isSingle ? groupCtrl.select(scope) : groupCtrl.selectMulti(scope);
                } : angular.noop;

                transclude(scope, function (clone) {
                    innerContent.empty().append(clone);
                })
            }
        }
    })
    .directive("dpLimitSelect", function ($templateCache) {
        return {
            restrict: "A",
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "components/dpSelect.html";
            },
            scope: {
                num: "=",
                active: "@",
                text: "@"
            },
            replace: true,
            require: "?^dpSelectGroup",
            link: function (scope, element, attrs, groupCtrl) {
                scope.type = "limit";
                scope.value = groupCtrl.format(attrs.value);
                scope.disabled = attrs.disabled == "true";
                groupCtrl.items.push(scope);
                scope.select = function () {
                    groupCtrl.setEmpty(scope);
                }
            }
        }
    })
    .run(function ($templateCache) {
        $templateCache.put("components/dpSelect.html", '<label class="condition-label" ng-class="{active:active}"  ng-click="select()" ><span class="text">{{text}}</span><span ng-if="active" class="active-icon-background"></span><span ng-if="active" class="glyphicon glyphicon-ok"></span></label>');
        $templateCache.put("components/advSettingBox/sellerFlag.html", '<label ><span ng-transclude></span></label>');
        $templateCache.put("components/advSettingBox/dpSelectHasNum.html", '<label class="condition-label" ng-class="{active:active}"  ng-click="select()" ><span class="text">{{text}}</span><span class="selectNum" ng-if="!!num ">（{{num}}）</span><span ng-if="active" class="active-icon-background"></span><span ng-if="active" class="glyphicon glyphicon-ok"></span></label>')
        $templateCache.put("components/advSettingBox/targetGroup.html", '<label class="condition-label target-group" ng-class="{active:active}"  ng-click="select()" ><span class="text">{{text}}</span><span class="selectNum" >（{{num}}）</span> <span ng-if="active" class="active-icon-background"></span><span ng-if="active" class="glyphicon glyphicon-ok"></span></label>')
    });
