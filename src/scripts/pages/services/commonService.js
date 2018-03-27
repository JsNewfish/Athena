angular.module("dp.ui.base")
    .factory('$common', ["$calculate", function($calculate) {
        return {
            //字符串转数组
            strToArray: function(str, spliter, format) {
                if (!str) {
                    return [];
                }
                spliter = spliter ? spliter : ",";
                var result = $.trim(str).split(spliter);

                if (typeof format == "function") {
                    $.each(result, function(i, item) {
                        result[i] = format.call(item, item);
                    })
                } else if (format) {
                    $.each(result, function(i, item) {
                        result[i] = parseInt(item);
                    })
                }
                return result;
            },
            //数组转字符串
            arrayToStr: function(array) {
                return array ? array.toString() : "";
            },
            //驼峰转下划线
            camelToUnderline: function(str, upperCase) {
                var reg = /[A-Z]/g;
                str = str.replace(reg, function($0) {
                    return "_" + (upperCase ? $0.toUpperCase : $0);
                });
                return str.toUpperCase();
            },
            //驼峰转横杠
            camelToDash: function(str, upperCase) {
                var reg = /[A-Z]/g;
                return str.replace(reg, function($0) {
                    return "-" + (upperCase ? $0.toUpperCase : $0);
                });
            },
            //下划线转驼峰
            underlineToCamel: function(str) {
                var reg = /\_(\w)/g;
                return str = str.replace(reg, function(all, letter) {
                    return letter.toUpperCase();
                });
            },
            //分钟数转当天时间
            minutesToDate: function(input) {
                var hours = Math.floor(input / 60);
                var minutes = input % 60;
                return moment(new Date()).startOf("day").add(hours, "hours").add(minutes, "minutes")._d;
            },
            //当天时间转化为分钟数
            dateToMinutes: function(date) {
                if (!date) {
                    return 0;
                }
                var result = moment(date);
                return result.get("hours") * 60 + result.get("minutes");
            },
            //毫秒数转为具体天，小时，分钟，秒
            timespanToTime: function(timespan) {
                var days = Math.floor(timespan / (24 * 3600000));
                var hours = Math.floor(timespan % (24 * 3600000) / 3600000);
                var minutes = Math.floor(timespan % 3600000 / 60000);
                var seconds = Math.floor(timespan % 3600000 % 60000 / 1000)
                return {
                    day: days,
                    hour: hours,
                    minute: minutes,
                    second: seconds
                }
            }
        };
    }]);
