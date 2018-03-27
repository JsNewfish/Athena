angular.module("dp.ui.areapicker", [])
    .factory("$areaBox", ["$modal", function ($modal) {
        var DEFAULTS = {
            showRemote: true,//显示港澳台海外
            selectItems: []//已选区域
        };

        return {
            open: function (options) {
                var options = $.extend({}, DEFAULTS, options)
                return $modal.open({
                    templateUrl: COMMON_SOURCE_PATH + 'views/areaBox/areaBox.html',
                    controller: 'areaCtrl',
                    resolve: {
                        $options: function () {
                            return options || {};
                        }
                    },
                    backdrop: true
                })
            }
        }
    }])
    .controller("areaCtrl", ["$scope", "$modalInstance", "$common", "$win", "$options", function ($scope, $modalInstance, $common, $win, $options) {
        $scope.allSelect = false;
        $scope.noneSelect = false;
        $scope.remoteArea = false;//是否偏远地区
        $scope.areas = [
            {
                "name": "华东",
                "select": false,
                "key": "01",
                "province": [
                    {
                        "name": "上海",
                        "select": true,
                        "key": "010",
                        "parent": 0
                    },
                    {
                        "name": "浙江省",
                        "select": true,
                        "key": "011",
                        "parent": 0
                    },
                    {
                        "name": "江苏省",
                        "select": false,
                        "key": "012",
                        "parent": 0
                    },
                    {
                        "name": "安徽省",
                        "select": false,
                        "key": "013",
                        "parent": 0
                    },
                    {
                        "name": "江西省",
                        "select": false,
                        "key": "014",
                        "parent": 0
                    }
                ]
            },
            {
                "name": "华北",
                "select": false,
                "key": "02",
                "province": [
                    {
                        "name": "北京",
                        "select": false,
                        "key": "020",
                        "parent": 1
                    },
                    {
                        "name": "天津",
                        "select": false,
                        "key": "021",
                        "parent": 1
                    },
                    {
                        "name": "河北省",
                        "select": false,
                        "key": "022",
                        "parent": 1
                    },
                    {
                        "name": "山西省",
                        "select": false,
                        "key": "023",
                        "parent": 1
                    },
                    {
                        "name": "山东省",
                        "select": false,
                        "key": "024",
                        "parent": 1
                    },
                    {
                        "name": "内蒙古",
                        "select": false,
                        "key": "025",
                        "parent": 1
                    }
                ]
            },
            {
                "name": "华中",
                "select": false,
                "key": "03",
                "province": [
                    {
                        "name": "湖北省",
                        "select": false,
                        "key": "030",
                        "parent": 2
                    },
                    {
                        "name": "湖南省",
                        "select": false,
                        "key": "031",
                        "parent": 2
                    },
                    {
                        "name": "河南省",
                        "select": false,
                        "key": "032",
                        "parent": 2
                    }
                ]
            },
            {
                "name": "华南",
                "select": false,
                "key": "04",
                "province": [
                    {
                        "name": "广东省",
                        "select": true,
                        "key": "040",
                        "parent": 3
                    },
                    {
                        "name": "广西",
                        "select": false,
                        "key": "041",
                        "parent": 3
                    },
                    {
                        "name": "海南省",
                        "select": false,
                        "key": "042",
                        "parent": 3
                    },
                    {
                        "name": "福建省",
                        "select": false,
                        "key": "043",
                        "parent": 3
                    }
                ]
            },
            {
                "name": "东北",
                "select": false,
                "key": "05",
                "province": [
                    {
                        "name": "吉林省",
                        "select": false,
                        "key": "050",
                        "parent": 4
                    },
                    {
                        "name": "辽宁省",
                        "select": false,
                        "key": "051",
                        "parent": 4
                    },
                    {
                        "name": "黑龙江",
                        "select": false,
                        "key": "052",
                        "parent": 4
                    }
                ]
            },
            {
                "name": "西北",
                "select": false,
                "key": "06",
                "province": [
                    {
                        "name": "陕西省",
                        "select": true,
                        "key": "060",
                        "parent": 5
                    },
                    {
                        "name": "新疆",
                        "select": true,
                        "key": "061",
                        "parent": 5
                    },
                    {
                        "name": "青海省",
                        "select": false,
                        "key": "062",
                        "parent": 5
                    },
                    {
                        "name": "宁夏",
                        "select": false,
                        "key": "063",
                        "parent": 5
                    },
                    {
                        "name": "甘肃省",
                        "select": false,
                        "key": "064",
                        "parent": 5
                    }
                ]
            },
            {
                "name": "西南",
                "select": false,
                "key": "07",
                "province": [
                    {
                        "name": "四川省",
                        "select": true,
                        "key": "070",
                        "parent": 6
                    },
                    {
                        "name": "云南省",
                        "select": true,
                        "key": "071",
                        "parent": 6
                    },
                    {
                        "name": "贵州省",
                        "select": false,
                        "key": "072",
                        "parent": 6
                    },
                    {
                        "name": "西藏",
                        "select": false,
                        "key": "073",
                        "parent": 6
                    },
                    {
                        "name": "重庆",
                        "select": false,
                        "key": "074",
                        "parent": 6
                    }
                ]
            },
            {
                "name": "港澳台",
                "select": false,
                "key": "08",
                "province": [
                    {
                        "name": "香港",
                        "select": false,
                        "key": "080",
                        "parent": 7
                    },
                    {
                        "name": "澳门",
                        "select": false,
                        "key": "081",
                        "parent": 7
                    },
                    {
                        "name": "台湾",
                        "select": false,
                        "key": "082",
                        "parent": 7
                    }
                ]
            },
            {
                "name": "海外",
                "select": false,
                "key": "09",
                "province": [
                    {
                        "name": "海外",
                        "select": false,
                        "key": "090",
                        "parent": 8
                    }
                ]
            }
        ];

        init();

        //全选
        $scope.selectAll = function (event) {
            if ($scope.allSelect) {
                event.preventDefault();
                return;
            }
            selectAll();
        };

        //全不选
        $scope.selectNone = function (event) {
            if ($scope.noneSelect) {
                event.preventDefault();
                return;
            }
            selectNone();
            $scope.remoteArea = false;
        };

        //排除偏远
        $scope.selectFaraway = function () {
            if (!$scope.remoteArea) {//排除
                $scope.remoteArea = true;
                $scope.allSelect = false;
                $scope.noneSelect = false;
                selectAll();
                $scope.areas[5].select = false;
                $scope.areas[5].province[1].select = false;
                $scope.areas[5].province[2].select = false;
                $scope.areas[6].select = false;
                $scope.areas[6].province[1].select = false;
                $scope.areas[6].province[3].select = false;
            } else {//恢复
                $scope.remoteArea = false;
                selectAll();
            }
        };

        //选择区域
        $scope.selectRegion = function (region, status) {
            var choice = !status;
            region.select = choice;
            for (var i = 0; i < region.province.length; i++) {
                region.province[i].select = choice;
            }

            if (choice) {
                $scope.allSelect = isAllOrNoneSelect("all");
                $scope.noneSelect = false;
            } else {
                $scope.allSelect = false;
                $scope.noneSelect = isAllOrNoneSelect("none");
            }
        };

        //选择省份
        $scope.selectState = function (state, status) {
            var choice = !status;
            var region = $scope.areas[state.parent];
            state.select = choice;

            region.select = isRegionSelect(region);
            if (choice) {
                $scope.allSelect = isAllOrNoneSelect("all");
                $scope.noneSelect = false;
            } else {
                $scope.allSelect = false;
                $scope.noneSelect = isAllOrNoneSelect("none");
            }
        };

        $scope.save = function (event) {
            var result = getSelect();
            if (result == "") {
                $win.alert('请至少选择一个地区');
                return;
            }
            $modalInstance.close(result);
        };

        $scope.cancel = function (event) {
            $modalInstance.dismiss();
        };

        function init() {
            //初始化配置项
            $scope.options = $options;
            //初始化已选项
            var selectItems = $common.strToArray($scope.options.selectItems, null);
            render(selectItems);
            selectItems.length == 0 && selectAll();
            //是否支持港澳台，海外
            if (!$scope.options.showRemote) {
                $scope.areas = $scope.areas.filter(function (item) {
                    return item.key != "08" && item.key != "09";
                })
            }
        }

        //初始化区域
        function render(selectedArrays) {
            var isAllSelect = true;
            var length = $scope.areas.length;

            while (length--) {
                var region = $scope.areas[length];
                region.select = initState(region);
                isAllSelect = isAllSelect && region.select;
            }
            return isAllSelect;

            function initState(region) {
                var isAllSelect = true,
                    length = region.province.length;

                while (length--) {
                    var state = region.province[length];
                    state.select = selectedArrays.indexOf(state.name) != -1;
                    isAllSelect = isAllSelect && state.select;
                }
                return isAllSelect;
            }
        }

        //是否全选或者全不选 type true时为判断全选否则判断全部选
        function isAllOrNoneSelect(type) {
            var result = true;
            type = (type == "all");
            //全选
            if (type) {
                for (var i = 0; i < $scope.areas.length; i++) {
                    var region = $scope.areas[i];
                    if (!region.select) {
                        result = false;
                    }
                    for (var j = 0; j < region.province.length; j++) {
                        var state = region.province[j];
                        if (!state.select) {
                            result = false;
                        }
                    }
                }
            } else {
                for (var i = 0; i < $scope.areas.length; i++) {
                    var region = $scope.areas[i];
                    if (region.select) {
                        result = false;
                    }
                    for (var j = 0; j < region.province.length; j++) {
                        var state = region.province[j];
                        if (state.select) {
                            result = false;
                        }
                    }
                }
            }
            return result;
        }

        function selectAll() {
            for (var i = 0; i < $scope.areas.length; i++) {
                var region = $scope.areas[i];
                region.select = true;
                for (var j = 0; j < region.province.length; j++) {
                    region.province[j].select = true;
                }
            }
            $scope.allSelect = true;
            $scope.noneSelect = false;
        }

        function selectNone() {
            for (var i = 0; i < $scope.areas.length; i++) {
                var region = $scope.areas[i];
                region.select = false;
                for (var j = 0; j < region.province.length; j++) {
                    region.province[j].select = false;
                }
            }
            $scope.noneSelect = true;
            $scope.allSelect = false;
        }

        function isRegionSelect(region) {
            var province = region.province;
            var result = true;
            for (var i = 0; i < province.length; i++) {
                result = result && province[i].select;
            }
            return result;
        }

        function getSelect() {
            var result = [];
            angular.forEach($scope.areas, function (region) {
                angular.forEach(region.province, function (state) {
                    if (state.select) {
                        result.push(state.name);
                    }
                })
            });

            return result.toString();
        }
    }]);
