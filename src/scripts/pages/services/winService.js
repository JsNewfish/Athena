angular.module("dp.ui.base")
    .factory("$win", ["$compile", "$q", "$rootScope", "$modal", function($compile, $q, $rootScope, $modal) {
        return {
            confirm: function(options) {
                var DEFAULTS = {
                    type: "", //anallyze,cancel-send,delay,delete,forbid,less-message,message,no-message,question
                    img: COMMON_SOURCE_PATH + "images/components/alert/alert-question.png", //图标
                    content: "", //内容
                    title: "", //内容标题
                    windowTitle: "系统提醒", //窗口名称
                    closeText: "确定", //确认按钮文本
                    cancelText: "取消", //取消按钮文本
                    showClose: true, //显示确认按钮
                    showCancel: true, //显示取消按钮
                    size: "sm", //尺寸
                    redirect: "", //链接
                    redirectCancel: "" //取消链接
                };
                var sourcePath = COMMON_SOURCE_PATH + "images/components/alert/";
                var options = $.extend({}, DEFAULTS, options);
                if (options.type) {
                    options.img = sourcePath + "alert-" + options.type + ".png";
                }
                return $modal.open({
                    templateUrl: COMMON_SOURCE_PATH + "views/confirm/confirm.html",
                    controller: "confirmCtrl",
                    windowClass: "confirm",
                    size: options.size,
                    resolve: {
                        $data: function() {
                            return {
                                title: options.title,
                                content: options.content,
                                img: options.img,
                                windowTitle: options.windowTitle,
                                closeText: options.closeText,
                                cancelText: options.cancelText,
                                showClose: options.showClose,
                                showCancel: options.showCancel,
                                redirect: options.redirect,
                                redirectCancel: options.redirectCancel
                            };
                        }
                    }
                });
            },
            alert: function(option) {
                var DEFAULTS = {
                    type: "warning", //场景类型：warning,info,danger,success
                    content: "", //内容
                    autoClose: true, //是否自动关闭
                    duration: 5000, //停留时间
                    size: "" //尺寸
                };
                var config = $.extend({}, DEFAULTS, typeof option == "string" ? { content: option } : option);
                var domEl;
                var scope = $rootScope.$new();
                //关闭
                scope.close = function() {
                    domEl.fadeOut(function() {
                        domEl.remove();
                    });
                    scope.$destroy();
                };

                var angularDomEl = angular.element('<div alert></div>');
                angularDomEl.html(config.content);
                angularDomEl.attr({
                    "template-url": COMMON_SOURCE_PATH + "views/alert/alertFixed.html",
                    "type": config.type,
                    "size": config.size,
                    "close": "close(element)"
                });
                //是否自动关闭
                config.autoClose && angularDomEl.attr("dismiss-on-timeout", config.duration);

                domEl = $compile(angularDomEl)(scope);
                domEl.addClass("alert-fixed");
                config.size && domEl.addClass("alert-" + config.size);

                domEl.appendTo($("body"));
            },
            alertSuccess: function(content) {
                this.alert({
                    type: "success",
                    content: content
                })
            },
            alertError: function(content) {
                this.alert({
                    type: "danger",
                    content: content
                })
            },
            alertWarning: function(content) {
                this.alert({
                    type: "warning",
                    content: content
                })
            },
            alertInfo: function(content) {
                this.alert({
                    type: "info",
                    content: content
                })
            },
            prompt: function(options) {
                var DEFAULTS = {
                    templateHeader: '<form class="form-horizontal" w5c-form-validate=""  name="validateForm">' +
                        '<div class="modal-header">' +
                        '    <button type="button" class="close" aria-label="Close" ng-click="cancel()">' +
                        '        <span aria-hidden="true">&times;</span></button>' +
                        '    <h4 class="modal-title">{{data.windowTitle}}</h4>' +
                        '</div>' +
                        '<div class="modal-body">',
                    templateBody:

                        '  <div class="form-group">' +
                        '   <label class="col-xs-3 control-label" ng-show="data.title">{{data.title}}</label>' +
                        '   <div class="col-xs-9">' +
                        '    <textarea class="form-control" placeholder="{{data.placeholder}}" ng-model="data.value" cols="30" rows="5" ></textarea>' +
                        '   </div>' +
                        '  </div>',
                    templateFooter: '</div>' +
                        '<div class="modal-footer">' +
                        '    <div class="text-center">' +
                        '        <a class="btn btn-base btn-sm" w5c-form-submit="save()" ng-show="data.showClose" ng-bind="data.closeText"></a>' +
                        '        <a class="btn btn-default btn-sm" ng-click="cancel()" ng-show="data.showCancel" ng-bind="data.cancelText"></a>' +
                        '    </div>' +
                        '</div>' +
                        '</form>',
                    title: "", //内容标题
                    placeholder: "",
                    windowClass: "prompt",
                    windowTitle: "修改", //窗口名称
                    closeText: "确定", //确认按钮文本
                    cancelText: "取消", //取消按钮文本
                    showClose: true, //显示确认按钮
                    showCancel: true, //显示取消按钮
                    size: "sm" //尺寸

                };
                var options = $.extend({}, DEFAULTS, options);
                var modalInstance = $modal.open({
                    template: options.templateHeader + options.templateBody + options.templateFooter,
                    controller: "promptCtrl",
                    windowClass: options.windowClass,
                    size: options.size,
                    resolve: {
                        data: function() {
                            return {
                                title: options.title,
                                value: options.value,
                                windowTitle: options.windowTitle,
                                closeText: options.closeText,
                                placeholder: options.placeholder,
                                cancelText: options.cancelText,
                                showClose: options.showClose,
                                showCancel: options.showCancel
                            };
                        }
                    }

                });
                return modalInstance;
            },
        };
    }]);
