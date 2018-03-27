angular.module("dp.ui.base")
    .factory("$cache", ["$restClient", "$q", function ($restClient, $q) {
    function getKey(callback) {
        return $restClient.post("seller/cache/uuid", null, null, function (data) {
            callback && callback(data.data);
        }).$promise;
    }

    function getCache(key, success, error) {
        var action = {
            successCallback: function (data) {
                success && success(JSON.parse(data.data||null));
            },
            failCallback: function (data) {
                error && error(data.data);
            },
            errorCallback: function (msg) {
                error && error(msg);
            }
        };


        return $restClient.get("seller/cache/data", {
            key: key
        }, action).$promise;

    }

    function setCache(key, type, entity, success, error) {
        var value = JSON.stringify(entity);
        var action = {
            successCallback: function (data) {
                success && success(data.data);
            },
            failCallback: function (data) {
                error && error(data.data);
            },
            errorCallback: function (msg) {
                error && error(msg);
            }
        };

        return $restClient.post("seller/cache/data", null, {
            type: type,
            key: key,
            value: value
        }, action).$promise;
    }

    return {
        getKey: getKey,
        getCache: getCache,
        setCache: setCache
    };
}]);