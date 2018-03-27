angular.module("dp.ui.base")
//列表时间
    .filter("listdate", function () {
        return function (input, param) {
            return input ? moment(input).format(param) : "-";
        }
    })
//填充“-”
    .filter("filler", function () {
        return function (input, param) {
            return input ? input : "-";
        }
    })
//分转元
    .filter("coinToDuller", function () {
        return function (input) {
            if (input != "") {
                return (parseInt(input) / 100).toFixed(2);
            } else {
                return "0.00";
            }
        }
    });