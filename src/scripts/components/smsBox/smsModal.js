angular.module("dp.ui.smsEditor")
    //编辑框服务，返回编辑框控制器
    .factory("$dpSmsModal", ["$modal", function ($modal) {
        function open(data, options) {
            if (typeof options == "string") {
                options = {type: options};
            }

            return $modal.open({
                templateUrl: COMMON_SOURCE_PATH + "views/smsBox/smsModal.html",
                controller: "smsModalCtrl",
                windowClass: "sms-modal",
                resolve: {
                    $data: function () {
                        return {
                            data: data,
                            options: options
                        }
                    }
                },
                size: "lg"
            })
        }

        return {
            open: open
        }
    }])
    .controller("smsModalCtrl", ["$scope", "$compile", "$modalInstance", "$restClient", "$smsData", "$data", "$win", "$q", "$enum",
        function ($scope, $compile, $modalInstance, $restClient, $smsData, $data, $win, $q, $enum) {
            var DEFAULTS = {
                type: "",
                customerDefinedType: "",//短信子类型
                signatureSource: $enum.getEnum("signature") || [],//签名列表,
                showBack: true,//显示回T退订
                showTmplOperation: true, //显示引用模板
                showUrlCreator: true, //显示生成短链接
                tmpVars: [],//临时变量
                vars: [],//系统变量
                showReceiverType: true,//显示接收人
                receiverTypeOptions: "",//接收人列表
                isJoin: true,//是否显示正式加入
                title: "短信设置",//编辑框标题
                staticMode: false,//是否可关闭
                btnOkName: "保存",//操作名称
                showBtnOk: true, //是否显示保存按钮
                showBtnNo: true //是否显示取消按钮
            };

            init();

            function init() {
                $scope.boxStatus = {
                    opened: true,
                    enabled: false
                };
                $scope.entity = $data.data;
                $scope.options = $.extend({}, DEFAULTS, $data.options);
            }

            $scope.save = function (result) {
                return $q.when(true, function () {
                    $modalInstance.close(result);
                });
            };

            $scope.cancel = function (message) {
                $modalInstance.dismiss();
            };
        }]);