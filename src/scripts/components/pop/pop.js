angular.module('dp.ui.pop', ["ui.bootstrap.transition"])
    .directive("dpPop", ["$timeout", function ($timeout) {
        return {
            restrict: "EA",
            scope: {
                animate: "=",
                type: "@"
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || COMMON_SOURCE_PATH+"views/pop.html";
            },
            replace: true,
            transclude: true,
            link: function (scope, element, attrs, ctrl) {
                $timeout(function () {
                    scope.animate = true;
                });
            }
        }
    }])
    .directive("popTransclude", [function () {
        return {
            link: function ($scope, $element, $attrs, controller, $transclude) {
                $transclude($scope.$parent, function (clone) {
                    $element.empty();
                    $element.append(clone);
                });
            }
        }
    }])
    .factory("$pop", ["$compile", "$rootScope", "$document", "$q", "$http", "$templateCache", "$injector", "$controller", "$transition", "$timeout",
        function ($compile, $rootScope, $document, $q, $http, $templateCache, $injector, $controller, $transition, $timeout) {
            var DEFAULTS = {
                resolve: {},
                type: "pop-help"
            };
            var $pop = {};
            var $body = $document.find('body').eq(0);

            $pop.open = function (options) {
                var resultDeferred = $q.defer();
                var openedDeferred = $q.defer();

                var pop = {};
                var popInstance = {};

                popInstance = {
                    result: resultDeferred.promise,
                    close: function (result) {
                        resultDeferred.resolve(result);
                        removePopWindow();
                    }
                };

                options = angular.extend({}, DEFAULTS, options);

                if (!options.template && !options.templateUrl) {
                    throw new Error('One of template or templateUrl options is required.');
                }

                //获取模板和依赖
                var templateAndResolvePromise = $q.all([getTemplatePromise(options)].concat(getResolvePromises(options.resolve)));
                templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
                    var popScope = (options.scope || $rootScope).$new();
                    popScope.$close = popInstance.close;
                    popScope.$dismiss = popInstance.dismiss;

                    var ctrlInstance, ctrlLocals = {};
                    var resolveIter = 1;

                    //controllers
                    if (options.controller) {
                        ctrlLocals.$scope = popScope;
                        ctrlLocals.$popInstance = popInstance;
                        angular.forEach(options.resolve, function (value, key) {
                            ctrlLocals[key] = tplAndVars[resolveIter++];
                        });
                        ctrlInstance = $controller(options.controller, ctrlLocals);
                        if (options.controllerAs) {
                            popScope[options.controllerAs] = ctrlInstance;
                        }
                    }
                    //create element
                    var angularElem = angular.element('<div dp-pop></div>');
                    angularElem.attr({
                        'animate': 'animate',
                        'type': options.type
                    }).html(tplAndVars[0]);
                    //记录scope
                    pop.popScope = popScope;
                    var popDomEl = $compile(angularElem)(popScope);
                    //记录DomEl
                    pop.popDomEl = popDomEl;
                    $body.append(angularElem);

                }, function resolveError(reason) {
                    resultDeferred.reject(reason);
                });

                templateAndResolvePromise.then(function () {
                    openedDeferred.resolve(true);
                }, function () {
                    openedDeferred.reject(false);
                });

                return popInstance;

                function removePopWindow() {
                    removeAfterAnimate(pop.popDomEl, pop.popScope, 300, function () {
                        pop.popScope.$destroy();
                    });
                }

                function removeAfterAnimate(domEl, scope, emulateTime, done) {
                    // Closing animation
                    scope.animate = false;

                    var transitionEndEventName = $transition.transitionEndEventName;
                    if (transitionEndEventName) {
                        // transition out
                        var timeout = $timeout(afterAnimating, emulateTime);

                        domEl.bind(transitionEndEventName, function () {
                            $timeout.cancel(timeout);
                            afterAnimating();
                            scope.$apply();
                        });
                    } else {
                        // Ensure this call is async
                        $timeout(afterAnimating);
                    }

                    function afterAnimating() {
                        if (afterAnimating.done) {
                            return;
                        }
                        afterAnimating.done = true;

                        domEl.remove();
                        if (done) {
                            done();
                        }
                    }
                }
            };

            function getTemplatePromise(options) {
                return options.template ? $q.when(options.template) :
                    $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl, {
                        cache: $templateCache
                    }).then(function (result) {
                        return result.data;
                    });
            }

            function getResolvePromises(resolves) {
                var promisesArr = [];
                angular.forEach(resolves, function (value) {
                    if (angular.isFunction(value) || angular.isArray(value)) {
                        promisesArr.push($q.when($injector.invoke(value)));
                    }
                });
                return promisesArr;
            }

            return $pop;
        }]);

