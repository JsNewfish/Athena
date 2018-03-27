angular.module("dp.ui.fileupload")
    .directive("dpFileSelect", ["$modal", function($modal) {
        var DEFAULTS = {
            fileType:null,
            contentType: null,
            downloadUrl: "",
            showDownload: true
        };

        return {
            restrict: "EA",
            templateUrl: COMMON_SOURCE_PATH + "views/upload/fileSelect.html",
            scope: {
                data: "=dpFileSelect",
                completedAction: "&",
                options: "="
            },
            controller: function($scope, $element, $attrs) {

                init();

                function init() {
                    $scope.data=$scope.data||{};
                    $scope.options = getOptions();
                    if (!$scope.options.fileType) {
                        throw new Error("上传文件需要类型");
                    }

                    if ($scope.options.showDownload && !$scope.options.downloadUrl) {
                        throw new Error("文件选择控件需要配置下载路径");
                    }
                }

                function getOptions() {
                    return $.extend({}, DEFAULTS, $scope.options || {});
                }

                $scope.downloadTmpl = function() {

                    if ($scope.options.downloadUrl && $scope.options.downloadUrl[0] != "/") {
                        $scope.options.downloadUrl = "/" + $scope.options.downloadUrl;
                    }

                    var form = $("<form>"); //定义一个form表单
                    form.attr('style', 'display:none'); //在form表单中添加查询参数
                    form.attr('target', '');
                    form.attr('method', 'get');
                    form.attr('action', $scope.options.downloadUrl);

                    var params = getParamFormUrl($scope.options.downloadUrl);
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

                $scope.selectFile = function() {
                    var modalInstance = $modal.open({
                        templateUrl: COMMON_SOURCE_PATH + 'views/upload/fileModal.html',
                        controller: 'fileModalCtrl',
                        windowClass: "file-select-modal",
                        resolve: {
                            $data: function() {
                                return {
                                    file: $scope.data && {
                                        id: $scope.data.id,
                                        name: $scope.data.name
                                    },
                                    fileType:$scope.options.fileType,
                                    contentType: $scope.options.contentType,
                                    downloadUrl: $scope.options.downloadUrl
                                }
                            }
                        },
                        size: 'lg'
                    });

                    modalInstance.result.then(function(result) {
                        $scope.data.id = result.id;
                        $scope.data.name = result.name;
                        $scope.completedAction && $scope.completedAction({
                            file: result
                        })
                    });
                }
            }
        }
    }])