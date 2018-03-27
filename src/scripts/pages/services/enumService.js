angular.module("dp.ui.base")
    .factory("$enum", ["$enumData", function($enumData) {
        var enums = [];
        //结构
        //[{key:"key",value:[{key:"subKey",value:"333"}]}]
        function getEnumInner(type) {
            for (var i = 0; i < enums.length; i++) {
                if (enums[i].key == type) {
                    return enums[i];
                }
            }
            return null;
        }

        function setEnum(type, data) {
            if (!(type && data instanceof Array)) {
                throw type + " 枚举类型不能为空，且 枚举数据必须为数组";
            }
            if (this.isExit(type)) {
                var curEnum = getEnumInner(type);
                curEnum.value = data;
            } else {
                var newEnum = {
                    key: type,
                    value: data
                };
                enums.push(newEnum);
            }
        }

        function getEnum(type) {
            if (!type) {
                throw "枚举类型不能为空";
            }

            var result = getEnumInner(type);

            return result ? angular.copy(result.value) : null;
        }

        function isExit(type) {
            for (var i = 0; i < enums.length; i++) {
                if (enums[i].key == type) {
                    return true;
                }
            }
            return false;
        }

        function getEnumDataByKey(type, key) {
            var result = null;
            angular.forEach(enums, function(item) {
                if (item.key == type) {
                    angular.forEach(item.value, function(subItem) {
                        if (subItem.key.toString() == key.toString()) {
                            result = angular.copy(subItem);
                        }
                    })
                }
            });
            return result;
        }

        function getEnumValueByKey(type, key) {
            var data = this.getEnumDataByKey(type, key);
            return data ? typeof(data.value) == "object" ? angular.copy(data.value) : data.value : null;
        }

        function getEnums() {
            return angular.copy(enums);
        }

        function init() {
            enums = $.extend(enums, $enumData);
        }

        init();

        return {
            //获取所有枚举
            getEnums: getEnums,
            //根据type设置枚举
            setEnum: setEnum,
            //根据type获取枚举
            getEnum: getEnum,
            //枚举是否存在
            isExit: isExit,
            //根据type,key获取枚举对象
            getEnumDataByKey: getEnumDataByKey,
            //根据type,key获取枚举值
            getEnumValueByKey: getEnumValueByKey
        };
    }]);