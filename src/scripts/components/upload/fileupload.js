angular.module("dp.ui.fileupload")
    .directive("dpFileupload", [function($scope) {
        function link(scope, element, attrs, ctrl) {
            var files,
                options = scope.options = getOptions(),
                $inputFile = element.find(options.multiple ? ".file-input-multiple" : ".file-input-single").eq(0), //上传控件
                $filePreview = element.find(".fileupload-preview").eq(0); //预览区域

            $filePreview.on("click", "button.close", function() {
                var name = $.trim($(this).siblings(".file-name").text());
                if (files && files.length) {
                    files = $.map(files, function(file, i) {
                        return file.name == name ? undefined : file;
                    });
                    ctrl.$setViewValue(options.multiple ? files : files[0]);
                    setPreview(files);
                } else {
                    scope.clear();
                }

                scope.$apply();
            });

            $inputFile.on("change", function() {
                files = $.map($inputFile.get(0).files, function(file) {
                    return file
                });
                if (files.length) {
                    var result = options.multiple ? files : files[0];
                    scope.hasFile = true;
                    scope.btnName = "重新选择";
                    //设置viewValue
                    ctrl.$setViewValue(result);
                    //显示预览
                    scope.options.isImg ? setImgPreview(files) : setPreview(files);
                    scope.showBtnClear = true;
                    //change动作
                    var promise = scope.submitLoading = scope.changedAction({ data: result });

                    scope.options.autoClear && scope.clear();
                }
                scope.$apply();
            });

            scope.clear = function() {
                scope.btnName = "选择文件";
                $inputFile.val("");
                ctrl.$setViewValue("");
                $filePreview.text("");
                scope.showBtnClear = false;
            };

            ctrl.$render = function() {
                ctrl.$viewValue && (scope.options.isImg ? setImgPreview(ctrl.$viewValue) : setPreview(ctrl.$viewValue));
            };

            init();

            function init() {
                scope.btnName = "选择文件";
                scope.showBtnClear = false;
            }

            function setPreview(data) {
                if (data.length) {
                    var html = data.length ? $.map(data, function(item) {
                        return getFileNode(item);
                    }) : getFileNode(item);
                    $filePreview.html(html);
                } else {
                    scope.clear();
                }
            }

            function setImgPreview(data) {
                if (data.length) {
                    $filePreview.attr("src", typeof data == "string" ? data : window.URL.createObjectURL(data[0]));
                }
            }

            function getFileNode(data) {
                var html = options.multiple ? '<span class="file" >' +
                    '<span class="file-name">{{name}}</span>' +
                    '<button class="close"><span>×</span></button ng-click="remove();">' +
                    '</span>' : '<span>{{name}}</span>';
                return html.replace(/\{\{name\}\}/ig, data.name);
            }

            function getOptions() {
                var options = {};
                options.multiple = !!attrs.multiple;
                options.autoClear = String(attrs.autoClear).toLowerCase() == "true";
                options.isImg = (attrs.type && attrs.type.toLowerCase().indexOf("img") > -1);
                return options;
            }
        }

        return {
            restrict: "EA",
            require: "ngModel",
            templateUrl: function($element, $attrs) {
                return COMMON_SOURCE_PATH + "views/upload/" + ($attrs.type || "fileUpload") + ".html";
            },
            scope: {
                changedAction: "&"
            },
            link: link
        }
    }]);
