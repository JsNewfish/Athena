//短信控件
angular.module("dp.ui.smsEditor", [])
    .directive("dpSmsBox", ["$location", "$sce", "$restClient", "$smsData", "$support", "$win", "$q", "$modal", "$interval", "$smsType", "$enum", "$compile", "$dpCookies",
        function($location, $sce, $restClient, $smsData, $support, $win, $q, $modal, $interval, $smsType, $enum, $compile, $dpCookies) {
            var DEFAULTS = {
                type: "", //短信类型
                customerDefinedType: "", //短信子类型
                signatureSource: $enum.getEnum("signature") || [], //签名列表,
                showBack: true, //显示回T退订
                showTmplOperation: true, //显示引用模板
                showUrlCreator: true, //显示生成短链接
                tmpVars: [], //临时变量
                vars: [], //系统变量
                showReceiverType: true, //显示接收人
                receiverTypeSource: "0,1,2", //接收人列表
                isJoin: true, //是否显示正式加入
                title: "短信设置", //编辑框标题
                staticMode: false, //是否可关闭
                btnOkName: "保存", //操作名称
                showBtnOk: true, //是否显示保存按钮
                showBtnNo: true //是否显示取消按钮
            };

            var controller = function($scope, $element, $attrs) {
                var ctrl = $scope.ctrl = this;
            };

            var link = function(scope, element, attrs, editCtrl) {
                var $viewer = element.find(".phone-content").eq(0); //短信预览框

                //设置预览
                scope.setPreView = function(content, sign) {
                    var html = content ? content : "";
                    var viewValue = $smsData.contentToPreview(content, sign);
                    !scope.options.showBack && (viewValue = viewValue + "回T退订");
                    $viewer.empty().html(viewValue);
                    scope.template.viewValue = viewValue;
                };

                //重置数据
                scope.resetData = function(entity) {
                    scope.template = angular.copy(entity || scope.entity); //模板
                    scope.setPreView($smsData.modelToContent(scope.template.content), scope.template.signatureId);
                };

                //外部变化时刷新控件
                scope.$watch('entity', function(newValue, oldValue) {
                    if (newValue != oldValue) {
                        scope.resetData(newValue);
                    }
                }, true);

                scope.close = function() {
                    scope.opened = false;
                    scope.enabled = true;
                };

                scope.open = function() {
                    scope.opened = true;
                    scope.enabled = false;
                    scope.resetData(scope.entity);
                    initIntro();
                };

                scope.save = function() {
                    if (!$smsData.validate(scope.template)) {
                        return false
                    }
                    var postEntity = getPostData();

                    var promise = $q.when(postEntity, checkMsgLegal) //检查短信内容是否合法
                        .then(function() { //加入任务
                            return scope.saveAction({
                                result: postEntity,
                                instance: scope
                            })
                        }).then(function() { //任务成功
                            if (!scope.options.staticMode) {
                                scope.close();
                            }
                            //返回一个已解决的promise，为了结束loading
                            return $q.when();
                        }, function() { //任务失败

                            //返回一个已拒绝的promise，为了结束loading
                            return $q.reject();
                        });


                    //如果为静态模式，则不关闭窗口
                    if (!scope.options.staticMode) {
                        promise.then(function() {
                            scope.close();
                        });
                    }

                    scope.loading = promise;
                };

                scope.exit = function() {
                    scope.resetData(scope.entity);
                    scope.close();
                    if (scope.cancelAction) {
                        scope.cancelAction({
                            message: "关闭",
                            instance: scope
                        });
                    }
                };

                init();

                function initCtrl() {
                    scope.ctrl.getPostData = getPostData;
                    scope.ctrl.checkMsgLegal = checkMsgLegal;
                }

                function getPostData() {
                    var postEntity = angular.copy(scope.template);
                    //加入正式发送
                    if (postEntity.mobile) {
                        postEntity.mobile = postEntity.mobile.replace(/，/ig, ",");
                    }

                    return postEntity;
                }



                function init() {
                    //初始化控制器    
                    initCtrl();
                    scope.options = $.extend({}, DEFAULTS, scope.options);
                    scope.editorOptions = angular.copy(scope.options); //编辑器配置项
                    scope.receiverTypeSource = $smsData.getSmsReceiverType(scope.options.receiverTypeSource);
                    scope.sendTestTip = '由于运营商尽可能规避短信对客户带来的骚扰，因此相同手机号码10分钟内发送短信不可超过<span class="text-danger">3</span>条，测试时需要变换号码进行测试。若有疑问可随时与我们在线客服联系';
                    scope.enableSend = true;
                    scope.resetData(scope.entity);
                    initReceiverType(scope.receiverTypeSource);
                    if (scope.options.staticMode) {
                        initIntro();
                    }
                    /*//设置默认短信签名 0：全能掌柜 中差评提醒
                    if(scope.template.informType == 14){
                        scope.template.signatureId = scope.template.signatureId == -1 ? 0 :scope.template.signatureId;
                    }*/
                }

                function initReceiverType(source) {
                    var domStr = '<div dp-select-group ng-model="template.receiverType" type="multi" format="integer">';
                    $.each(source, function(i, item) {
                        var str = '<div dp-select value="{{key}}" text="{{value}}" disabled="{{disabled}}" tooltip="{{text}}"> </div>';
                        domStr += str.replace(/\{\{key\}\}/ig, item.key)
                            .replace(/\{\{value\}\}/ig, item.value)
                            .replace(/\{\{disabled\}\}/ig, item.disabled)
                            .replace(/\{\{text\}\}/ig, item.text);
                    });
                    domStr += "</div>";
                    var domElement = angular.element(domStr);
                    element.find(".receiver-type-source").append($compile(domElement)(scope));
                }

                //测试发送
                scope.sendTest = function(event) {
                    //验证短信内容
                    if (!$smsData.validate(scope.template)) {
                        return;
                    }
                    //验证测试号码
                    if(!scope.template.mobile){
                        $win.confirm({
                            title: '测试手机号错误提醒',
                            content: '测试手机号不能为空',
                            type: 'forbid',
                            showCancel: false,
                            closeText: "知道了",
                            size: "lg"
                        });
                        return;
                    }
                    if (scope.template.mobile) {
                        var testNumber = scope.template.mobile.replace(/，/ig, ",").split(",");
                        if (testNumber.length > 5) {
                            $win.confirm({
                                title: '测试手机号错误提醒',
                                content: '测试短信手机号个数不能多于5个',
                                type: 'forbid',
                                showCancel: false,
                                closeText: "知道了",
                                size: "lg"
                            });
                            return;
                        }
                        for (var i = 0; i < testNumber.length; i++) {
                            if (!/^1[0-9]{10}$/.test(testNumber[i])) {
                                $win.confirm({
                                    title: '测试手机号错误提醒',
                                    content: testNumber[i] + '不是正确的手机号码，请修改后再保存',
                                    type: 'forbid',
                                    showCancel: false,
                                    closeText: "知道了",
                                    size: "lg"
                                });
                                return;
                            }
                        }
                    }
                    var action = {
                        successCallback: function(data) {
                            if (data.data) {
                                $win.confirm({
                                    title: '任务提交成功',
                                    content: '测试短信任务已提交成功，我们会尽快审核，请注意查收。',
                                    type: 'forbid',
                                    showCancel: false,
                                    closeText: "知道了",
                                    redirect:"#/marketing/testSmsRecord",
                                    // redirect:"http://yx.cuxiao.quannengzhanggui.net/static/seller/app/index.html#/smsCrm/SMSSendLog",
                                    size: "lg"
                                });
                                createTimer();
                            } else {
                                $win.alertSuccess("发送失败，请尝试重新发送");
                            }
                        },
                        failCallback: function(data) {
                            $smsData.dealFail(data);
                        }
                    };
                    var params = {
                        customerDefinedType: scope.options.customerDefinedType,
                        smsType: scope.options.type,
                        mobile: scope.template.mobile.replace(/，/ig, ","),
                        signatureId: scope.template.signatureId,
                        content: $smsData.filterTag($smsData.modelToPreview(scope.template.content))
                    };
                    $restClient.post("seller/sms/test", null, params, action);
                };

                //计时30秒
                function createTimer() {
                    scope.seconds = 30;
                    scope.enableSend = false;
                    scope.timer = $interval(function() {
                        if (scope.seconds > 0) {
                            scope.seconds--;
                        } else {
                            cancelTimer();
                        }
                    }, 1000);
                }

                //取消计时
                function cancelTimer() {
                    scope.enableSend = true;
                    scope.timer && $interval.cancel(scope.timer);
                    scope.timer = null;
                }

                function checkMsgLegal(postEntity) {
                    //return $q.all([checkUrl(), checkRemote()]); 
                    return $q.when(true);
                }

                /*function checkUrl() {
                    var deferred = $q.defer(),
                        promise = deferred.promise;

                    if ($smsData.hasUrl(scope.template.content)) {
                        var mes = {
                            img: "images/components/alert/alert-question.png",
                            title: "请确认短信中的链接前后是否有加空格？",
                            closeText: "继续保存",
                            cancelText: "返回修改",
                            content: '您短信中包含 <span class="text-danger">跳转链接</span>，请确保您的跳转链接前后都要加上 <span class="text-danger">空格</span>，否则有可能会导致链接无法打开！！！',
                            size: "lg"
                        };
                        $win.confirm(mes).result.then(function() {
                            deferred.resolve();
                        }, function() {
                            deferred.reject();
                        });
                    } else {
                        deferred.resolve();
                    }

                    return promise;
                }

                function checkRemote() {
                    var deferred = $q.defer(),
                        promise = deferred.promise;

                    var postData = {
                        content: scope.template.content,
                        informType: scope.options.type
                    };
                    var action = {
                        successCallback: function(data) {
                            deferred.resolve();
                        },
                        failCallback: function(data) {
                            $smsData.dealFail(data);
                            deferred.reject();
                        }
                    };
                    $restClient.post("seller/template/check", null, postData, action, deferred);

                    return promise;
                }*/

                function initIntro() {
                    var id = element.attr("id");

                    try {
                        var selector = "#" + id + " ";
                        var isbstro = $dpCookies.get('bootstro');
                        setTimeout(function() {
                            if (!isbstro) {
                                $.intro([
                                    [selector + '.param-list', '<h3 style="margin-top:10px;">可选变量~</h3>'],
                                    [selector + '.temp-select', '<h3 style="margin-top:10px;">在此进行模板操作~</h3>'],
                                    [selector + '.signature', '<h3 style="margin-top:10px;">变换签名~</h3>']
                                ], {
                                    obtn: '我已了解，下次不再提示！',
                                    onExit: function() {
                                        $dpCookies.set('bootstro', 'ok', moment().add(365, "days")._d.toGMTString(), "/");
                                    }
                                });
                            }
                        }, 1000);
                    } catch (e) {
                        console("smsBox:" + e);
                    }

                }
            };

            return {
                restrict: "A",
                templateUrl: COMMON_SOURCE_PATH + "views/smsBox/smsBox.html",
                controller: controller,
                scope: {
                    entity: "=",
                    opened: "=",
                    enabled: "=",
                    options: "=dpSmsBox",
                    saveAction: "&",
                    cancelAction: "&",
                    ctrl: "="
                },
                require: "?editSetting",
                link: link
            }
        }
    ]);
