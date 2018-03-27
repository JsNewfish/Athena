angular.module("dp.ui.base")
    .provider("$restClient", function() {

        this.$get = function($resource, $http, $win) {
            $http.defaults.cache = false;
            var httpClient = $resource((ROOT_PATH || "") + "/:module/:target/:intention", null, {
                "update": {
                    method: "PUT"
                },
                "post": {
                    method: "POST"
                },
                "deletes": {
                    method: "DELETE"
                },
                "put": {
                    method: "PUT"
                }
            });

            //获取路径参数
            function getParam(position, array) {
                var name = ["module", "target", "intention"],
                    positionArray = position.split("/"),
                    positionResult = {},
                    param;

                $(positionArray).each(function(i, item) {
                    positionResult[name[i]] = item;
                });

                param = $.extend({}, positionResult, array || {});
                return param;
            }

            //获取相应回调集合
            function getAction(callback, deferred) {
                var options = {};
                var DEFAULTS = {
                    successCallback: null, //成功回调
                    errorCallback: null, //错误回调
                    failCallback: null, //完成动作
                    custom: false, //自定义
                    deferred: deferred
                };

                options = typeof(callback) == "object" ? $.extend({}, DEFAULTS, callback) : $.extend({}, DEFAULTS, {
                    successCallback: callback
                });

                return getCallback(options);
            }


            function globalResolve(data) {
                if (data.resultCode == -1) { //cookie过期
                    location.href = data.resultMessage;
                } else if (data.resultCode == -3) { //需要高级版本
                    $("#globalVersionModal").modal("show");
                } else if (data.resultCode == -6) { //需要C店铺
                    $win.confirm({
                        type: "forbid",
                        title: "此功能暂不支持天猫店铺！",
                        content: " 此功能受淘宝规则限制只适用于淘宝店铺。天猫店铺无法开启此功能"
                    });
                }
            }

            function needGlobalResolve(data) {
                var sourceCode = ["-1", "-3", "-6"];
                return sourceCode.indexOf(String(data.resultCode)) != -1;
            }

            //生成回调
            function getCallback(options) {
                var successHandler, errorHandler;
                var deferred = options.deferred;

                //创建成功回调
                if (options.custom) {
                    successHandler = options.successCallback;
                } else {
                    successHandler = function(data) {
                        if (data.resultCode == 0) {
                            options.successCallback && options.successCallback.call(this, data);
                            deferred && deferred.resolve();
                        }
                        //全局处理    
                        else if (needGlobalResolve(data)) {
                            globalResolve(data);
                            deferred && deferred.resolve();
                        }
                        //执行失败回调
                        else {
                            if (options.failCallback) {
                                options.failCallback && options.failCallback(data);
                                deferred && deferred.reject();
                            } else {
                                $win.alert(data.resultMessage);
                                deferred && deferred.reject();
                            }
                        }
                    }
                }
                //创建失败回调
                if (options.errorCallback && typeof options.errorCallback == "function") {
                    deferred && deferred.reject();
                    errorHandler = options.errorCallback;
                } else {
                    errorHandler = function(msg) {
                        deferred && deferred.reject();
                        $win.alert("错误：" + msg.status + "|" + msg.statusText);
                    }
                }

                return {
                    success: successHandler,
                    error: errorHandler
                }
            }

            //获取httpClient
            function getHttpClient(root) {
                return !root ? httpClient : (function() {
                    return $resource((root || "") + "/:module/:target/:intention", null, {
                        "update": {
                            method: "PUT"
                        },
                        "post": {
                            method: "POST"
                        },
                        "deletes": {
                            method: "DELETE"
                        },
                        "put": {
                            method: "PUT"
                        }
                    });
                })();
            }

            return {
                get: function(url, param, action, deferred, root) {
                    var callback = getAction(action, deferred);
                    return getHttpClient(root)["get"](getParam(url, param), callback.success, callback.error);
                },
                post: function(url, param, data, action, deferred, root) {
                    var callback = getAction(action, deferred);
                    return getHttpClient(root)["post"](getParam(url, param), data, callback.success, callback.error);
                },
                put: function(url, param, data, action, deferred, root) {
                    var callback = getAction(action, deferred);
                    return getHttpClient(root)["put"](getParam(url, param), data, callback.success, callback.error);
                },
                deletes: function(url, param, action, deferred, root) {
                    var callback = getAction(action, deferred);
                    return getHttpClient(root)["deletes"](getParam(url, param), callback.success, callback.error);
                },
                save: function(url, param, data, action, deferred, root) {
                    var callback = getAction(action, deferred);
                    return getHttpClient(root)["save"](getParam(url, param), data, callback.success, callback.error);
                },
                remove: function(url, param, action, deferred, root) {
                    var callback = getAction(action, deferred);
                    return getHttpClient(root)["remove"](getParam(url, param), callback.success, callback.error);
                },
                update: function(url, param, data, action, deferred, root) {
                    var callback = getAction(action, deferred);
                    return getHttpClient(root)["update"](getParam(url, param), data, callback.success, callback.error);
                },
                postFormData: function(url, data, action, deferred, root, filesMark) {
                    var callback = getAction(action, deferred);
                    return $http({
                        url: (root || "") + "/" + url,
                        method: 'POST',
                        data: data,
                        transformRequest: function(data) {
                            filesMark = filesMark || "file";
                            var formData = new FormData();
                            angular.forEach(data, function(value, key) {
                                //多文件
                                if (filesMark && key == filesMark && value.length) {
                                    angular.forEach(value, function(file) {
                                        formData.append(key, file);
                                    })
                                } else {
                                    formData.append(key, value);
                                }
                            });
                            return formData;
                        },
                        headers: {
                            'Content-Type': undefined
                        }
                    }).success(callback.success).error(callback.error);
                },
                needGlobalResolve: needGlobalResolve,
                globalResolve: globalResolve
            };
        }

    });
