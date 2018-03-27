/**
 * Created by lenovo on 2016/10/21.
 */
angular.module("dp.ui.goodList")
    .factory("$goodsSelector", ["$modal", function ($modal) {
        var DEFAULTS = {
            selected: [],//已选商品
            disabled: [],//禁选商品
            source: "",//活动类型
            limitCount: 0//上限数量
        };

        function getDefaults() {
            return $.extend({}, {
                hiddenCurrent: false,
                hiddenCategory: false,
                showRelatedPromotion: false,
                showFloatToolbar: false,
                currentId: ""//当前活动
            }, DEFAULTS);
        }

        return {
            open: function (options) {
                return $modal.open({
                    templateUrl: COMMON_SOURCE_PATH + 'views/goodsList/goodsSelector.html',
                    controller: 'goodsSelectorCtrl',
                    size: "lg",
                    resolve: {
                        $options: function () {
                            return $.extend({}, getDefaults(), options) || {};
                        }
                    }
                })
            }
        }
    }])
    .controller("goodsSelectorCtrl", ["$scope", "$options", "$modalInstance","$win",
        function ($scope, $options, $modalInstance,$win) {
            var options = $scope.options = $options;

            $scope.save = function () {
                if($scope.output.length==0){
                    $win.alert("请选择商品");

                    return;   
                }

                var result = {
                    items: angular.copy($scope.output),
                    itemIds: $.map($scope.output, function (item) {
                        return item.id;
                    })
                };



                $modalInstance.close(result);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };

            init();

            function init() {
                //已选商品
                $scope.output = getSelectedItems(options.selected);
            }

            function getSelectedItems(selected) {
                return selected ? $.map(selected, function (item) {
                    return typeof item == "object" ? item : {id: Number(item)};
                }) : [];
            }
        }]);
