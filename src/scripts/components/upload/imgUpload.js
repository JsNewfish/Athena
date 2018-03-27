angular.module("dp.ui.fileupload")
    .directive('dpImgUpload', ["$restClient", "$win", "$q", "$timeout",
        function($restClient, $win, $q, $timeout) {
            return {
                restrict: "EA",
                templateUrl: COMMON_SOURCE_PATH + "views/upload/imgUpload.html",
                scope: {
                    imgUrl: "=dpImgUpload",
                    options: "=",
                    completedAction: "&"
                },
                //replace: true,
                link: function(scope, element, attr) {
                    var $upload = element.find(".no-img .file-upload").eq(0);
                    var $uploadHasImg = element.find(".has-img .file-upload").eq(0);
                    var $form = element.find(".no-img .ajax-form").eq(0);
                    var $formHasImg = element.find(".has-img .ajax-form").eq(0);
                    //上传文件
                    scope.uploadFile = function() {
                        var deferred = $q.defer();
                        var options = {
                            url: scope.options.url,
                            data: scope.options.data,
                            type: "POST",
                            resetForm: true, // 成功提交后，重置元素的值
                            enctype: "multipart/form-data",
                            success: function(data) {
                                if (data.resultCode == 0) {
                                    deferred.resolve();
                                    scope.imgUrl = data.data;
                                    scope.hasImg = true;
                                    scope.completedAction({
                                        result: data.data
                                    });
                                    $win.alertSuccess("上传成功");
                                } else {
                                    deferred.reject();
                                    $win.alert(data.resultMessage, scope);
                                }
                            }, // 提交后的回调函数
                            error: function() {
                                deferred.reject();
                            }
                        };
                        scope.uploading = deferred.promise;
                        (scope.hasImg ? $formHasImg : $form)["ajaxSubmit"](options);
                        scope.$apply();
                    };

                    init();

                    function init() {
                        scope.$watch("imgUrl", function(newValue) {
                            if (newValue) {
                                scope.hasImg = true;
                            }
                        });

                    }
                }
            }
        }
    ]);