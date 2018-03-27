angular.module("dp.ui.fileupload", [])
    //文件选择框
    .controller('fileModalCtrl', ['$scope', '$modalInstance', '$data', '$restClient', '$win', '$q', "$timeout",
        function($scope, $modalInstance, $data, $restClient, $win, $q, $timeout) {
            //分页相关
            $scope.pageNo = 1;
            $scope.pageSize = 5;
            $scope.count = 0;
            //文件相关
            $scope.fileType = $data.fileType;
            //内容类型
            $scope.contentType = $data.contentType;

            if ($data.downloadUrl && $data.downloadUrl[0] != "/") {
                $data.downloadUrl = "/" + $data.downloadUrl;
            }

            $scope.downloadUrl = $data.downloadUrl;
            if($scope.downloadUrl.indexOf("fileType=") == -1){
                $scope.downloadUrl = $scope.downloadUrl.indexOf("?") == -1 ? ($scope.downloadUrl + "?fileType=" + $scope.fileType) : ($scope.downloadUrl + "&fileType=" + $scope.fileType);
            }
            if($scope.downloadUrl.indexOf("contentType=") == -1){
                $scope.downloadUrl = $scope.downloadUrl.indexOf("?") == -1 ? ($scope.downloadUrl + "?contentType=" + $scope.contentType) : ($scope.downloadUrl + "&contentType=" + $scope.contentType);
            }
            //当前文件
            $scope.file = $data.file;
            $scope.select = $scope.file.id;

            //取消
            $scope.cancel = function() {
                $modalInstance.dismiss();
            };

            //保存
            $scope.save = function() {
                if (!$scope.select) {
                    $win.alert("请选择文件");
                    return false;
                }

                $modalInstance.close(angular.copy($scope.file));
            };

            //获取列表
            $scope.getList = getList;

            $scope.reset = function() {
                $scope.name = "";
                $scope.startTime = null;
                $scope.endTime = null;
            }

            //下载模板
            $scope.downloadTemplate = function(ele, strUrl) {
                var form = $("<form>"); //定义一个form表单
                form.attr('style', 'display:none'); //在form表单中添加查询参数
                form.attr('target', '');
                form.attr('method', 'get');
                form.attr('action', $scope.downloadUrl);
                var params = getParamFormUrl($scope.downloadUrl);
                if (params.length > 0) {
                    angular.forEach(params, function(param) {
                        var input1 = $('<input>');
                        input1.attr('type', 'hidden');
                        input1.attr('name', param.key);
                        input1.attr('value', param.value);
                        form.append(input1);
                    })
                }
                $('body').append(form); //将表单放置在web中
                form.submit();
                setTimeout(function() {
                    form.remove();
                }, 300);
            };

            function getParamFormUrl(url) {
                var search = url.split('?');
                var params = [];
                if (search.length <= 1) {
                    return [];
                }
                search = search[1];
                var paramArray = search.split("&");
                $(paramArray).each(function(i, item) {
                    var data = item.split("=");
                    params.push({
                        key: data[0],
                        value: data[1]
                    });
                });
                return params;
            }

            //上传文件
            $scope.uploadFile = function() {

                $scope.uploading = upload().then(function(reuslt) {
                    var deferred = $q.defer();

                    $restClient.get("seller/uploadFile", { uploadFileId: reuslt.id }, function(data) {
                        $scope.file = data.data;
                        $scope.select = $scope.file.id;
                        //$win.alertSuccess("成功" + (reuslt.successNumber || 0) + ";失败" + (reuslt.failedNumber || 0) + ";总数" + (reuslt.totalNumber || 0), $scope);
                        $win.alertSuccess("文件上传成功，可从列表中选择此文档点击确定使用！");  
                        getList(1);
                    }, deferred);

                    return deferred.promise;
                })

            };


            function upload() {
                var deferred = $q.defer();
                var action = {
                    successCallback: function(data) {
                        deferred.resolve(data.data)
                    },
                    failCallback: function(data) {
                        $win.alert(data.resultMessage);
                        // $win.confirm({
                        //     img: "images/components/alert/alert-forbid.png",
                        //     title: "错误提示",
                        //     content: data.resultMessage
                        // });
                    }
                };
                $restClient.postFormData("seller/uploadFile", {
                    contentType: $scope.contentType,
                    fileType: $scope.fileType,
                    file: $scope.fileDocument
                }, action, deferred, null, "file");
                return deferred.promise;
            }

            //选择文件
            $scope.selectFile = function(file) {
                $scope.file = file;
                $scope.select = file.id;
            };

            //删除文件
            $scope.deleteFile = function(file) {
                var instance = $win.confirm({
                    img: "images/components/alert/alert-delete.png",
                    title: "您确定要删除吗？",
                    content: "删除后将无法恢复，请慎重操作！",
                    windowTitle: "系统提示"
                });

                instance.result.then(function() {
                    var action = {
                        successCallback: function(data) {
                            getList($scope.pageNo);
                        },
                        failCallback: function(data) {
                            $win.alert('操作失败');
                        }
                    };
                    $scope.loading = $restClient.deletes('seller/uploadFile', {
                        uploadFileId: file.id
                    }, action).$promise;
                });
            };

            init();

            function init() {
                getList(1);
            }

            //获取文件列表
            function getList(pageNo, pageSize, total) {
                if (!validate()) {
                    return false;
                }
                var params = {
                    name: $scope.name,
                    startTime: $scope.startTime && moment($scope.startTime).format("YYYY/MM/DD HH:mm:ss"),
                    endTime: $scope.endTime && moment($scope.endTime).format("YYYY/MM/DD HH:mm:ss"),
                    pageNo: --pageNo,
                    pageSize: pageSize || $scope.pageSize,
                    fileType: $scope.fileType,
                    contentType: $scope.contentType
                };
                var action = {
                    successCallback: function(data) {
                        $scope.list = data.data;
                        $scope.pageNo = ++data.pageNo;
                        $scope.pageSize = data.pageSize;
                        $scope.count = data.count;
                    }
                };
                $scope.loading = $restClient.post("seller/uploadFile/search", null, params, action).$promise;
            }


            function validate() {
                if ($scope.startTime && $scope.endTime && moment($scope.startTime).diff(moment($scope.endTime)) > 0) {
                    $win.alert("结束时间不能小于开始时间");
                    return false;
                }

                return true;
            }
        }
    ])
    //监测选择文件变化
    .directive('fileChange', [function() {
        return {
            restrict: 'AE',
            scope: {
                onChange: '&fileChange'
            },
            link: function($scope, element, attrs) {
                $(element).on("change", function() {
                    $scope.onChange();
                });
            }
        }
    }]);
