angular.module("dp.ui.base")
    .directive("dpSmartFloat", ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            link: function(scope, element, attr) {
                var DEFAULTS = {
                    type: 'top',
                    distance: 0
                };
                var options;
                var windowHeight = $(window).height();


                //获取参数配置项
                scope.$watchCollection(attr.dpSmartFloat, function(option) {
                    if (angular.isObject(option)) {
                        options = angular.extend(angular.copy(DEFAULTS), option);
                    } else {
                        throw new Error('Invalid value for smart-float. smart-float only accepts object params.');
                    }
                }, true);

                function position() {
                    windowHeight = $(window).height();
                    if (element.is(":hidden")) {
                        return;
                    }
                    var elementWidth = element.outerWidth();
                    var elementHeight = element.outerHeight();
                    var referElement = element.parent(); //参照元素
                    var referElementWidth = element.parent().width(); //参照元素
                    var referPos = referElement.offset().top + elementHeight; //参照距离
                    referElement.css('height', elementHeight + 'px');
                    var scrollTop = $(this).scrollTop();
                    if (options.type == 'top') {
                        if (scrollTop > referPos) {
                            element.addClass("smart-float-top");
                            element.css({
                                position: 'fixed',
                                top: options.distance + 'px',
                                width: referElementWidth,
                                'z-index': '100'
                            });
                        } else {
                            element.removeClass("smart-float-top");
                            element.css({
                                position: 'static'
                            });
                        }
                    }
                    if (options.type == 'bottom') {
                        //超出一屏可视区大小&&未滚动到最底部一屏
                        if ((windowHeight < referElement.offset().top) && ((scrollTop + windowHeight) < referPos)) {
                            element.addClass("smart-float-bottom");
                            element.css({
                                position: 'fixed',
                                bottom: 0,
                                width: referElementWidth,
                                'z-index': '100',
                                "height": "60",
                                "background": "#f3f3f3",
                                "padding": "0px 10px",
                                "line-height": "56px",
                                "border": "1px solid# ddd",
                                "border-top": "2px solid #107FE4"
                            });
                        } else {
                            element.removeClass("smart-float-bottom");
                            element.css({
                                position: 'inherit'
                            });
                        }
                    }
                }

                $timeout(function() {
                    $(window).scroll(position);
                }, 3);
                $(window).resize(function() {
                    position();
                });
            }
        }
    }]);
