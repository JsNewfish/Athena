angular.module("dp.ui.smsEditor")
    //编辑器控件
    .directive("dpSmsEditor", ["$smsData", "$sniffer", "$browser", "$modal", "$restClient", "$support", "$win", "$smsType", "$enum",
        function($smsData, $sniffer, $browser, $modal, $restClient, $support, $win, $smsType, $enum) {
            var DEFAULTS = {
                type: "",
                customerDefinedType: "", //短信子类型
                signatureSource: $enum.getEnum("signature") || [], //签名列表,
                showBack: true, //退订回T
                showTmplOperation: true, //显示引用模板
                showUrlCreator: true, //显示生成短链接
                tmpVars: [], //临时变量
                vars: [] //系统变量
            };

            var controller = function($scope, $element, $attrs) {
                $scope.ctrl = this;
            };

            var link = function(scope, element, attrs, ctrl) {
                //编辑器
                var $editor = element.find(".editor");
                //变量标签
                var $varLabels = element.find(".param-list");
                //退订
                var $unsubscribe = element.find(".unsubscribe");
                //ngModel控制器
                var ngModelCtrl = ctrl[0];
                var range;
                var $counter = element.find(".input-count");
                var $messageCounter = element.find(".msg-total-count");

                init();

                scope.$watch("signature", function(newValue) {
                    action();
                });

                //覆盖$render
                ngModelCtrl.$render = function() {
                    ngModelCtrl.$viewValue ? removePlaceholder() : addPlaceholder();
                    $editor.html(ngModelCtrl.$viewValue);
                };

                function addPlaceholder() {
                    $editor.css("background", "url(https://img.alicdn.com/imgextra/i2/78622573/TB2UVMIbUdnpuFjSZPhXXbChpXa_!!78622573.jpg) no-repeat right top");
                }

                function removePlaceholder() {
                    $editor.css("background", "none");
                }

                //加入转换流程
                ngModelCtrl.$formatters.push($smsData.modelToContent);
                ngModelCtrl.$parsers.unshift($smsData.contentToModel);

                //申请签名
                scope.applySignature = function() {
                    var modalInstance = $modal.open({
                        templateUrl: COMMON_SOURCE_PATH + 'views/smsBox/applySignature.html',
                        controller: 'applySignatureCtrl',
                        backdrop: true,
                        resolve: {
                            $data: function() {
                                return {
                                    content: $smsData.contentToModel($editor.html()),
                                    informType: scope.options.type
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function(value) {
                        $win.alertSuccess(value);
                        scope.showApplySignature = false;
                        scope.signatureAuditStatus = getSignatureAuditStatus(2);
                    });

                };

                //另存为短语库
                scope.saveToLibrary = function() {
                    var modalInstance = $modal.open({
                        templateUrl: COMMON_SOURCE_PATH + 'views/smsBox/saveToLibrary.html',
                        controller: 'saveToLibraryCtrl',
                        backdrop: true,
                        resolve: {
                            $data: function() {
                                return {
                                    content: $smsData.contentToModel($editor.html()),
                                    informType: scope.options.type
                                }
                            }
                        },
                        size: "sm"
                    });

                    modalInstance.result.then(function(value) {
                        $win.alertSuccess(value);
                    });
                };

                //引用短语库
                scope.selectFromLibrary = function() {
                    var modalInstance = $modal.open({
                        templateUrl: COMMON_SOURCE_PATH + 'views/smsBox/templateLibrary.html',
                        controller: 'smsLibraryCtrl',
                        windowClass: "template-library-modal",
                        backdrop: true,
                        size: "lg",
                        resolve: {
                            $data: function() {
                                return {
                                    type: scope.options.type
                                };
                            }
                        }
                    });

                    modalInstance.result.then(function(template) {
                        $editor.html($smsData.modelToContent(template.content));
                        action();
                    });
                };

                //创建短链接
                scope.createShortLink = function() {
                    var modalInstance = $modal.open({
                        templateUrl: COMMON_SOURCE_PATH + 'views/smsBox/createShortLink.html',
                        controller: 'createShortLinkCtrl',
                        backdrop: true
                    });

                    modalInstance.result.then(function(link) {
                        insertText("&nbsp;" + link + "&nbsp;");
                    });
                };

                function init() {
                    scope.innerVariables = [];
                    scope.outerVariables = [];
                    scope.chargingTip = "70字计一条短信，超出70字按每条67字计费;每一字母、数字、标点符号都按一字计算;使用变量时,按实际变量替换计算有可能超出默认字数";
                    //获取签名审核状态
                    $restClient.get("seller/template/auditStatus", null, function(data) {
                        scope.showApplySignature = typeof data.data.auditStatus == "undefined";
                        scope.signatureAuditStatus = getSignatureAuditStatus(data.data.auditStatus);
                    });
                    //生成配置项
                    scope.options = $.extend({}, DEFAULTS, scope.options);
                    //根据配置项渲染控件
                    initEditor();
                    initRangeObj();
                    bindEditor();
                    bindControls();
                    initController();
                }

                function initEditor(options) {
                    scope.options = $.extend(scope.options, options || {});
                    //变量配置
                    var totalVars = [];
                    angular.forEach(scope.options.vars, function(key) {
                        var obj = angular.extend($smsData.getVarByName(key));
                        totalVars.push(obj);
                    });

                    angular.forEach(scope.options.tmpVars, function(item) {
                        var obj = {
                            name: item,
                            text: item,
                            isTmp: true
                        };
                        totalVars.push(obj);
                    });

                    if (totalVars.length < 3) {
                        scope.innerVariables = totalVars;
                    } else {
                        scope.innerVariables = totalVars.splice(0, 3);
                        scope.outerVariables = totalVars;
                    }
                    //签名配置
                    scope.signatureSource = scope.options.signatureSource;

                    if (options) {
                        scope.$apply();
                    }
                }

                function getSignatureAuditStatus(status) {
                    switch (status) {
                        case 0: //审核未通过
                            {
                                return "";
                            }
                        case 1: //审核通过
                            {
                                return "";
                            }
                        case 2: //审核中
                            {
                                return "审核中";
                            }
                        case 3: //平台审核中
                            {
                                return "";
                            }
                        default:
                            {
                                return ""
                            }
                    }
                }

                function initRangeObj() {
                    if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment) {
                        Range.prototype.createContextualFragment = function(h) {
                            var j = document.createDocumentFragment(),
                                i = document.createElement("div");
                            j.appendChild(i);
                            i.outerHTML = h;
                            return j
                        }
                    }
                    if ((typeof TextRange !== "undefined") && !TextRange.prototype.createContextualFragment) {
                        TextRange.prototype.createContextualFragment = function(h) {
                            var j = document.createDocumentFragment(),
                                i = document.createElement("div");
                            j.appendChild(i);
                            i.outerHTML = h;
                            return j
                        }
                    }
                }

                function bindEditor() {
                    $editor.on({
                        mouseup: refreshRange,
                        keyup: refreshRange
                    });


                    if ($sniffer.hasEvent('input')) {
                        $editor.on('input', action);
                    } else {
                        var timeout;
                        var deferAction = function() {
                            if (!timeout) {
                                timeout = $browser.defer(function() {
                                    action();
                                    timeout = null;
                                });
                            }
                        };

                        $editor.on('keydown', function(event) {
                            var key = event.keyCode;
                            //  ignore  command  modifiers  arrows
                            if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;

                            deferAction();
                        });

                        // if user modifies input value using context menu in IE, we need "paste" and "cut" events to catch it
                        if ($sniffer.hasEvent('paste')) {
                            $editor.on('paste cut', deferAction);
                        }
                    }

                    $editor.on("DOMCharacterDataModified", action);

                    // if user paste into input using mouse on older browser
                    // or form autocomplete on newer browser, we need "change" event to catch it
                    $editor.on('change', action);
                }

                function bindControls() {
                    $varLabels.on("click", ".param", function(event) {
                        var key = $(event.currentTarget).data("key");
                        insertVariable(key);
                    });

                    $varLabels.on("click", ".tmp-param", function(event) {
                        var key = $(event.currentTarget).data("key");
                        insertText(key);
                    });

                    $unsubscribe.on("click", function(event) {
                        insertText("回T退订");
                    })

                }

                function action() {
                    var value = $editor.html();
                    //设置编辑器背景
                    value ? removePlaceholder() : addPlaceholder();
                    if (ngModelCtrl.$viewValue !== value) {
                        //是否处于digest
                        if (scope.$root.$$phase) {
                            ngModelCtrl.$setViewValue(value);
                        } else {
                            scope.$apply(function() {
                                ngModelCtrl.$setViewValue(value);
                            });
                        }
                    }
                    var count = calculateCount(value);
                    $counter.text(count);
                    $messageCounter.text(count <= 70 ? 1 : Math.ceil(count / 67));
                    //渲染预览窗口
                    scope.changedAction({
                        signature: scope.signature,
                        content: value
                    })
                }

                //计算字数
                function calculateCount(content) {
                    var count = $("<div></div>").append(content).text().length || 0;
                    var varList = $("<div></div>").append(content).find("img");

                    angular.forEach(varList, function(item) {
                        count += $smsData.getVarByName($(item).data("key")).count;
                    });
                    if (scope.signature) {
                        var signature = $enum.getEnumValueByKey("signature", scope.signature);
                        var signatureLength = signature ? signature.length + 2 : 0;
                        count += signatureLength;
                    }

                    if (!scope.options.showBack) {
                        count += 4;
                    }
                    return count;
                }

                function refreshRange() {
                    var selection = window.getSelection ? window.getSelection() : document.selection;
                    try {
                        range = selection.createRange ? selection.createRange() : selection.getRangeAt(0)
                    } catch (b) {}
                }

                function getNewRange() {
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range)
                }

                //插入HTML
                function insertHtml(html) {
                    if (range == undefined) {
                        $editor.prepend(html);
                        $editor.focus();
                        refreshRange();
                        if ($support.ie && $support.version != 8) {
                            getSelection();
                        }
                    } else {
                        var d = range.createContextualFragment(html);
                        range.collapse(false);
                        var b = d.lastChild;
                        if ($support.ie && $support.version == 8) {
                            range.pasteHTML(html)
                        } else {
                            range.insertNode(d);
                            if (b) {
                                range.setStartAfter(b)
                            }
                            getNewRange();
                        }
                        $editor.focus()
                    }
                }

                //插入变量
                function insertVariable(key) {
                    // html = '<img class="variable" data-key="' + key + '"  src="/static/seller/app/images/informBox/' + key + '.png" />';
                    html = '<img class="variable" data-key="' + key + '"  src="//st.cuxiao.quannengzhanggui.net/static/cdist/images/components/smsEditor/' + key + '.png" />';
                    insertHtml(html);
                    action();
                }

                //插入文字
                function insertText(text) {
                    var html = text;
                    insertHtml(html);
                    action();
                }

                function initController() {
                    scope.ctrl.insertVariable = insertVariable;
                    scope.ctrl.insertHtml = insertHtml;
                    scope.ctrl.initEditor = initEditor;
                    scope.ctrl.insertText = insertText;
                }

                //插入外部变量
                scope.$watch('innerVars', function(newValue, oldValue) {
                    if (newValue != oldValue) {
                        newValue && insertText(newValue);
                    }
                })
            };

            return {
                restrict: "EA",
                scope: {
                    changedAction: "&", //编辑完成后动作,
                    signature: "=", //签名
                    ctrl: "=ctrl",
                    options: "=dpSmsEditor"
                },
                templateUrl: COMMON_SOURCE_PATH + "views/smsBox/smsEditor.html",
                require: ["?ngModel"],
                controller: controller,
                link: link
            }
        }
    ])
    //存入短语库控制器
    .controller("saveToLibraryCtrl", ["$scope", "$modalInstance", "$data", "$restClient", "$win", function($scope, $modalInstance, $data, $restClient, $win) {
        $scope.templatName = "";
        $scope.save = function() {
            if (!$scope.templateName) {
                $win.alert("模板名称不能为空");
                return;
            }

            $restClient.post("seller/template", null, {
                name: $scope.templateName,
                content: $data.content,
                informType: $data.informType
            }, function(data) {
                $modalInstance.close(data.resultMessage);
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        }
    }])
    //引用短语库控制器
    .controller("smsLibraryCtrl", ["$scope", "$data", "$modalInstance", "$restClient", "$smsType", "$win", "$q", "$rootScope", "$smsData",
        function($scope, $data, $modalInstance, $restClient, $smsType, $win, $q, $rootScope, $smsData) {
            $scope.keyword = "系统短信";
            $scope.systemLibrary = null;
            $scope.customLibrary = null;

            $scope.useTemplate = function(template) {
                $modalInstance.close(template);
            };

            $scope.deleteTemplate = function(template, event) {
                var config = {
                    img: "images/components/alert/alert-delete.png",
                    title: "您确定要删除吗？",
                    content: "删除后将无法恢复，请慎重操作！",
                    windowTitle: "系统提示"
                };

                $win.confirm(config).result.then(function() {
                    $scope.dealing = $restClient.deletes("seller/template", {
                        id: template.id
                    }, function(data) {
                        $win.alert({
                            type: "success",
                            content: data.resultMessage
                        });
                        getList();
                    });
                });
            };

            $scope.cancel = function() {
                $modalInstance.dismiss();
            };

            $scope.$watch("keyword", function(oldValue, newValue) {
                if (oldValue != newValue) {
                    getList();
                }
            })

            function init() {
                $scope.type = $data.type;
                getList();
            }

            function getList() {
                var param = {
                    informType: $scope.type,
                    keyword: $scope.keyword
                };

                $scope.loading = $restClient.post("seller/template/search", null, param, function(data) {
                    $scope.systemLibrary = filter(data.data.defaultTemplates);
                    $scope.customLibrary = filter(data.data.templates);
                }).$promise;
            }

            function filter(templateArray) {
                angular.forEach(templateArray, function(item) {
                    item.preview = $smsData.modelToPreview(item.content);
                });
                return templateArray;
            }

            init();
        }
    ])

//生成短链接
.controller("createShortLinkCtrl", ["$scope", "$modalInstance", "$restClient", "$win", "w5cValidator",
        function($scope, $modalInstance, $restClient, $win, w5cValidator) {
            $scope.linkType = "LT_ACTIVITY";
            $scope.pageLink = "";
            $scope.commodityId = "";

            $scope.save = function() {
                var linkData = "";
                if (!validate()) {
                    return false;
                }

                switch ($scope.linkType) {
                    case "LT_ACTIVITY":
                        {
                            linkData = $scope.pageLink;
                            break;
                        }
                    case "LT_ITEM":
                        {
                            linkData = $scope.commodityId;
                            break;
                        }
                    case "LT_SHOP":
                        {}
                }


                $restClient.postFormData("seller/template/shortLink", {
                    linkType: $scope.linkType,
                    linkData: linkData
                }, {
                    successCallback: function(data) {
                        $modalInstance.close($.trim(data.data));
                    }
                })
            };

            $scope.cancel = function() {
                $modalInstance.dismiss();
            };

            function validate() {
                //页面链接
                if ($scope.linkType == "LT_ACTIVITY") {
                    if (!$scope.pageLink) {
                        $win.alert({
                            content: "页面链接不能为空",
                            autoClose: true,
                            duration: 1000
                        });
                        return false;
                    }
                }
                //宝贝链接
                else if ($scope.linkType == "LT_ITEM") {
                    if (!$scope.commodityId) {
                        $win.alert({
                            content: "商品ID不能为空",
                            autoClose: true,
                            duration: 1000
                        });
                        return false;
                    }
                }

                return true;
            }


            init();

            function init() {

                w5cValidator.setRules({
                     pageLink: {
                        required: "页面链接不能为空"
                    },
                    commodityId: {
                        required: "宝贝链接不能为空"
                    }
                });

                $scope.validateOptions = {
                    blurTrig: true
                };

            }
        }
    ])
    //申请签名
    .controller("applySignatureCtrl", ["$scope", "$modalInstance", "$restClient", "$win", "$timeout", "$q", function($scope, $modalInstance, $restClient, $win, $timeout, $q) {
        $scope.shopInfo = {};
        $scope.status = 0; //手机号是否通过验证
        $scope.isEdit = 0; //是否修改手机号
        $scope.isValidate = 0; //是否获取了验证码
        $scope.checkCodeTime = 0; //获取验证码倒计时
        $scope.showShopInfo = true;

        //获取验证码
        $scope.getCheckCode = function() {
            if ($scope.shopInfo.checkCodeMobile == "") {
                $win.alert("手机号码不能为空");
                return;
            }

            $restClient.get("seller/shopInfo/checkCode", { mobile: $scope.shopInfo.checkCodeMobile }, {
                successCallback: function() {
                    $scope.checkCodeTime = 60;
                    $scope.isValidate = 1;
                    timer();
                }
            })
        };

        $scope.modifyMobile = function() {
            $scope.isEdit = 1;
        };

        $scope.exitModifyMobile = function() {
            $scope.isEdit = 0;
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        $scope.save = function() {
            if (!validate()) {
                return;
            }
            //未通过验证
            if (!$scope.status) {
                $scope.loading = updateShopInfo();
            }
            //已通过验证
            else {
                $scope.loading = updateSignature();
            }
        };

        function validate() {
            if (!$scope.status) {
                if ($scope.shopInfo.realName == "") {
                    $win.alert("真是姓名不能为空");
                    return false;
                }

                if ($scope.shopInfo.checkCodeMobile == "") {
                    $win.alert("号码不能为空");
                    return false;
                }

                if ($scope.shopInfo.checkCode == "") {
                    $win.alert("验证码不能为空");
                    return false;
                }
            }

            if ($scope.shopName == "") {
                $win.alert("签名不能为空");
                return false;
            }
            return true;
        }

        function updateSignature() {
            return $restClient.post("seller/template/signature", { signatureContent: $scope.shopName }, null, function(data) {
                $modalInstance.close("签名申请提交成功，可联系在线客服加快审核！");
            }).$promise;
        }

        function updateShopInfo() {
            var postShopInfo = angular.copy($scope.shopInfo);
            postShopInfo.signatureContent = $scope.shopName;

            return $restClient.post("seller/template/signatureWithShopInfo", null, postShopInfo, function(data) {
                $modalInstance.close("签名申请提交成功，可联系在线客服加快审核！");
            }).$promise;
        }

        init();

        function init() {
            //获取店铺签名
            $restClient.get("seller/user/fullInfo", null, function(data) {
                $scope.shopName = data.data.shop.name;
            });

            $restClient.get("seller/shopInfo", null, {
                successCallback: function(data) {
                    $scope.shopInfo = serverToClient(data.data);
                    $scope.shopInfo.role = 0;
                    $scope.status = $scope.shopInfo.mobileStatus;
                    $scope.isEdit = !$scope.shopInfo.mobileStatus;
                    $scope.isValidate = !$scope.shopInfo.mobileStatus;
                }
            })
        }

        function timer() {
            $timeout(function() {
                $scope.checkCodeTime = $scope.checkCodeTime - 1;
                if ($scope.checkCodeTime > 0) {
                    timer();
                }
            }, 1000);
        }

        function serverToClient(entity) {
            entity.checkCodeMobile = entity.mobile;
            return entity;
        }
    }]);;
