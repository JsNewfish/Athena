angular.module("dp.ui.base")
    .factory('$judge', ["$restClient", "$q", "$win", function($restClient, $q, $win) {
        function checkAuthorised(type) {
            var deferred = $q.defer();
            var action = {
                successCallback: function(data) {
                    if (data.data.isValid) {
                        deferred.resolve();
                    } else {
                        $win.confirm({
                            img: "images/components/alert/alert-forbid.png",
                            title: "您的操作权限已过期",
                            content: "请点击按钮到新页面进行授权，授权后重新进行操作",
                            closeText: "重新授权",
                            redirect: data.data.redirectUrl
                        });
                        deferred.reject("未授权");
                    }
                },
                errorCallback: function(msg) {
                    deferred.reject(msg.submsg);
                }
            };

            $restClient.get("seller/authorize/check", {
                "action": type || "reward"
            }, action);

            return deferred.promise;
        }

        function isCTypeShop() {
            return $.trim(VENUS_SHOP.type).toUpperCase() == "C";
        }

        return {
            checkAuthorised: checkAuthorised, //判断授权
            isCTypeShop: isCTypeShop //判断店铺类型是否为C
        };
    }]);