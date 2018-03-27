angular.module("dp.ui.validate", [])
    .factory("dpRegexp", [function () {
        /*验证数字：^[0-9]*$
         验证n位的数字：^\d{n}$
         验证至少n位数字：^\d{n,}$
         验证m-n位的数字：^\d{m,n}$
         验证零和非零开头的数字：^(0|[1-9][0-9]*)$
         验证有两位小数的正实数：^[0-9]+(.[0-9]{2})?$
         验证有1-3位小数的正实数：^[0-9]+(.[0-9]{1,3})?$
         验证非零的正整数：^\+?[1-9][0-9]*$
         验证非零的负整数：^\-[1-9][0-9]*$
         验证非负整数（正整数 + 0） ^\d+$
         验证非正整数（负整数 + 0） ^((-\d+)|(0+))$
         验证长度为3的字符：^.{3}$
         验证由26个英文字母组成的字符串：^[A-Za-z]+$
         验证由26个大写英文字母组成的字符串：^[A-Z]+$
         验证由26个小写英文字母组成的字符串：^[a-z]+$
         验证由数字和26个英文字母组成的字符串：^[A-Za-z0-9]+$
         验证由数字、26个英文字母或者下划线组成的字符串：^\w+$
         验证用户密码:^[a-zA-Z]\w{5,17}$ 正确格式为：以字母开头，长度在6-18之间，只能包含字符、数字和下划线。
         验证是否含有 ^%&',;=?$\" 等字符：[^%&',;=?$\x22]+
         验证汉字：^[\u4e00-\u9fa5],{0,}$
         验证Email地址：^\w+[-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$
         验证InternetURL：^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$ ；^[a-zA-z]+://(w+(-w+)*)(.(w+(-w+)*))*(?S*)?$
         验证电话号码：^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$：--正确格式为：XXXX-XXXXXXX，XXXX-XXXXXXXX，XXX-XXXXXXX，XXX-XXXXXXXX，XXXXXXX，XXXXXXXX。
         验证身份证号（15位或18位数字）：^\d{15}|\d{}18$
         验证一年的12个月：^(0?[1-9]|1[0-2])$ 正确格式为：“01”-“09”和“1”“12”
         验证一个月的31天：^((0?[1-9])|((1|2)[0-9])|30|31)$ 正确格式为：01、09和1、31。
         整数：^-?\d+$
         非负浮点数（正浮点数 + 0）：^\d+(\.\d+)?$
         正浮点数 ^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$
         非正浮点数（负浮点数 + 0） ^((-\d+(\.\d+)?)|(0+(\.0+)?))$
         负浮点数 ^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$
         浮点数 ^(-?\d+)(\.\d+)?$
         手机号码 ^1[0-9]{10}$
         */

    }])
    .directive("dpValidRemoteValid", ["$restClient", "$timeout",
        function ($restClient, $timeout) {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, ctrl) {
                    scope.$watch(attrs.ngModel, function () {
                        $restClient.get(attrs.url, {
                            name: encodeURI(ctrl.$viewValue)
                        }, function (data) {
                            if (!!data.data)
                                ctrl.$setValidity('remote', true);
                            else
                                ctrl.$setValidity('remote', false);

                        }, function (data) {
                            ctrl.$setValidity('remote', true);
                        });
                    })
                }
            }
        }
    ])
    //是否为数字
    .directive("dpValidIsNumber", [function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                var validate = function (viewValue) {
                    if (!viewValue) {
                        ctrl.$setValidity('dpValidIsNumber', true);
                        return viewValue;
                    }

                    ctrl.$setValidity('dpValidIsNumber', $.isNumeric(viewValue));

                    return viewValue;
                };

                ctrl.$parsers.unshift(validate);
                ctrl.$formatters.push(validate);
            }
        }
    }])
    //最小值 compareType：比较类型;mixValue：最小值
    .directive("dpValidMin", [function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                var validate = function (viewValue) {
                    var compareType = attrs.compareType ? attrs.compareType.toLowerCase() : "";
                    var isDate = compareType.indexOf('datetime') > -1;
                    var minValue = isDate ? moment(attrs.dpValidMin) : parseFloat(attrs.dpValidMin);

                    if (!viewValue) {
                        ctrl.$setValidity('dpValidMin', true);
                        return viewValue;
                    }

                    if (isDate) {
                        ctrl.$setValidity('dpValidMin', moment(viewValue).diff(minValue) >= 0);
                    }
                    else {
                        ctrl.$setValidity('dpValidMin', parseFloat(viewValue) >= minValue);
                    }

                    return viewValue;
                };

                ctrl.$parsers.unshift(validate);
                ctrl.$formatters.push(validate);
            }
        }
    }])
    //最大值 compareType：比较类型,maxValue：最大值
    .directive("dpValidMax", [function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                var validate = function (viewValue) {
                    var compareType = attrs.compareType ? attrs.compareType.toLowerCase() : "";
                    var isDate = compareType.indexOf('datetime') > -1;
                    var maxValue = isDate ? moment(attrs.dpValidMax) : parseFloat(attrs.dpValidMax);

                    if (!viewValue) {
                        ctrl.$setValidity('dpValidMax', true);
                        return viewValue;
                    }
                    if (isDate) {
                        ctrl.$setValidity('dpValidMax', moment(viewValue).diff(maxValue) <= 0);
                    } else {
                        ctrl.$setValidity('dpValidMax', parseFloat(viewValue) <= maxValue);
                    }

                    return viewValue;
                };

                ctrl.$parsers.unshift(validate);
                ctrl.$formatters.push(validate);
            }
        }
    }])
    //必须小于某个依赖 compareType:比较类型
    .directive('dpValidLowerThan', [
        function () {
            var link = function ($scope, $element, $attrs, ctrl) {
                var validate = function (viewValue) {
                    var isDateTime = $attrs.compareType && $attrs.compareType.toLowerCase().indexOf('datetime') > -1;
                    var comparisonModel = $attrs.dpValidLowerThan.replace(/"/g, '');

                    if (!viewValue || !comparisonModel) {
                        ctrl.$setValidity('dpValidLowerThan', true);
                        return viewValue;
                    }

                    if (isDateTime) {
                        var startTime = moment(comparisonModel)._d.getTime();
                        var endTime = moment(viewValue)._d.getTime();

                        ctrl.$setValidity('dpValidLowerThan', parseInt(endTime, 10) <= parseInt(startTime, 10));
                    } else {
                        ctrl.$setValidity('dpValidLowerThan', parseFloat(viewValue) <= parseFloat(comparisonModel));
                    }

                    return viewValue;
                };

                ctrl.$parsers.unshift(validate);
                ctrl.$formatters.push(validate);

                $attrs.$observe('dpValidLowerThan', function () {
                    return validate(ctrl.$viewValue);
                });
            };
            return {
                require: 'ngModel',
                link: link
            };
        }
    ])
    //不是全英文
    .directive("dpNotAllEnglish", [
        function () {
            var link = function ($scope, $element, $attrs, ctrl) {
                var validate = function (viewValue) {
                    var reg=new RegExp(/^[a-zA-Z]+$/);

                    if (!viewValue) {
                        ctrl.$setValidity('dpNotAllEnglish', true);
                        return viewValue;
                    }
                    ctrl.$setValidity('dpNotAllEnglish',!reg.test(viewValue));

                    return viewValue;
                };
                ctrl.$parsers.unshift(validate);
                ctrl.$formatters.push(validate);
            };
            return {
                require: 'ngModel',
                link: link
            };
        }
    ]);


