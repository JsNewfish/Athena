angular.module("dp.ui.goodList", [])
    .directive("dpGoodsList", [function () {
        return {
            restrict: "EA",
            controller: "goodsListCtrl",
            templateUrl: function ($element, $attrs) {
                return COMMON_SOURCE_PATH + ($attrs.templateUrl || "views/goodsList/goodsList.html");
            },
            scope: {
                output: "=",
                options: "="
            }
        }
    }])
    .controller("goodsListCtrl", ["$scope", "$element", "$attrs", "$restClient", "$win", "$calculate",
        function (scope, element, attrs, $restClient, $win, $calculate) {
            var DEFAULTS = {
                selected: [], //已选商品
                disabled: [], //禁选商品
                source: "", //活动类型
                isRate: false, //好评数
                limitCount: 0, //上限数量
                hiddenCurrent: false, //隐藏本活动宝贝
                hiddenCategory: false, //隐藏同类活动宝贝
                showRelatedPromotion: false, //显示活动信息
                showFloatToolbar: true, //显示浮动栏
                currentId: "" //当前活动Id
            };
            var options = scope.options = $.extend({}, DEFAULTS, scope.options);
            //已选
            scope.selectedItemIds = [];
            //禁选
            scope.exceptedItemIds = [];
            //筛选
            scope.approveStatus = "onsale"; //出售中，库存中
            scope.keyword = ""; //关键字
            scope.batchKeyword = ""; //批量关键字
            scope.category = null; //分类
            scope.from = {
                key: "",
                text: "所有货源"
            }; //货源类型
            scope.minPrice = ""; //最低价格
            scope.maxPrice = ""; //最高价格
            scope.hiddenCategory = false; //隐藏同类活动宝贝
            scope.hiddenCurrent = false; //隐藏本活动宝贝
            scope.isBatch = false;
            //排序
            scope.order = {
                cur: {
                    type: "",
                    direction: "desc"
                }, //当前条件
                listTime: {
                    type: "list_time",
                    direction: "desc"
                }, //最新上架
                num: {
                    type: "num",
                    direction: "desc"
                }, //库存
                modified: {
                    type: "modified",
                    direction: "desc"
                } //最后修改
            };
            //分页相关
            scope.pageNo = 1;
            scope.pageSize = 20;
            scope.count = 0;
            //其他
            scope.list = null;
            scope.isListModel = false;
            scope.categoryEnum = [{
                cid: "",
                isParent: 1,
                name: "所有类别",
                parentCid: 0,
                picUrl: "",
                sortOrder: 1,
                type: "manual_type",
                childCids: ""
            }]; //商品分类
            scope.fromEnum = [{
                key: "",
                text: "所有货源"
            }, {
                key: 0,
                text: "非分销商品"
            }, {
                key: 1,
                text: "代销"
            }, {
                key: 2,
                text: "经销"
            }]; //货源类型
            scope.sizeEnum = [10, 20, 50, 100, 200]; //页面尺寸

            //重置搜索条件
            scope.reset = function () {
                scope.approveStatus = "onsale"; //出售中，库存中
                scope.keyword = ""; //关键字
                scope.batchKeyword = ""; //批量关键字
                scope.category = scope.categoryEnum[0]; //分类
                scope.from = {
                    key: "",
                    text: "所有货源"
                }; //货源类型
                scope.minPrice = ""; //最低价格
                scope.maxPrice = ""; //最高价格
                getList(1);
            };
            //获取商品
            scope.getList = getList;
            //选择显示模式
            scope.switchViewModel = function () {
                scope.isListModel = !scope.isListModel;
            };
            //选择分页大小
            scope.switchSizeModel = function (value) {
                scope.pageSize = value;
                getList(1);
            };
            //选择库存状态
            scope.switchApproveStatus = function (value) {
                scope.approveStatus = value;
                getList(1);
            };
            //选择来源
            scope.switchFrom = function (item) {
                scope.from = item;
                getList(1);
            };
            //显示、隐藏本活动商品
            scope.toggleHideCurrent = function () {
                scope.hiddenCurrent = !scope.hiddenCurrent;
                getList(1);
            };
            //显示、隐藏同类活动
            scope.toggleHideCategory = function () {
                scope.hiddenCategory = !scope.hiddenCategory;
                getList(1);
            };
            //排序
            scope.orderBy = function (type) {
                var cur = scope.order.cur;
                if (!type) {
                    scope.order.cur = {
                        type: "",
                        direction: "desc"
                    };
                    getList(1);
                    return;
                }
                if (type == cur.type) {
                    switch (type) {
                        case "list_time": {
                            scope.order.listTime.direction = scope.order.listTime.direction == "asc" ? "desc" : "asc";
                            scope.order.cur = angular.copy(scope.order.listTime);
                            break;
                        }
                        case "modified": {
                            scope.order.modified.direction = scope.order.modified.direction == "asc" ? "desc" : "asc";
                            scope.order.cur = angular.copy(scope.order.modified);
                            break;
                        }
                        case "num": {
                            scope.order.num.direction = scope.order.num.direction == "asc" ? "desc" : "asc";
                            scope.order.cur = angular.copy(scope.order.num);
                            break;
                        }
                    }
                } else {
                    switch (type) {
                        case "list_time": {
                            scope.order.cur = angular.copy(scope.order.listTime);
                            break;
                        }
                        case "modified": {
                            scope.order.cur = angular.copy(scope.order.modified);
                            break;
                        }
                        case "num": {
                            scope.order.cur = angular.copy(scope.order.num);
                            break;
                        }
                    }
                }

                getList(1);
            };
            //选择商品分类
            scope.selectCategory = function (item) {
                scope.category = item;
                getList(1);
            };
            //上一页
            scope.prev = function () {
                var pageCount = Math.ceil(scope.count / scope.pageSize);
                var pageNo = scope.pageNo - 1;
                if (pageNo <= 0) {
                    $win.alert("已经到达第一页");
                    return;
                }

                getList(scope.pageNo = pageNo);
            };
            //下一页
            scope.next = function () {
                var pageCount = Math.ceil(scope.count / scope.pageSize);
                var pageNo = scope.pageNo + 1;
                if (pageNo > pageCount) {
                    $win.alert("已经到达最后一页");
                    return;
                }
                getList(scope.pageNo = pageNo);
            };
            //选择商品
            scope.select = function (item) {
                var existed = scope.outputIds.indexOf(item.id) >= 0;
                //取消选择
                if (existed) {
                    removeItem(item)
                } //选择
                else {
                    addItem(getAddedItem(item));
                }
                setSelectStatus();
            };
            //全选商品
            scope.selectAll = function () {
                scope.allSelected = !scope.allSelected;
                $(scope.list).each(function (index, item) {
                    if (!item.disabled) {
                        //全选
                        if (scope.allSelected && (scope.outputIds.indexOf(item.id) == -1)) {
                            if (scope.options.limitCount && scope.output.length >= scope.options.limitCount) {
                                $win.alert("商品个数不能超过" + scope.options.limitCount + "个");
                                return false;
                            } else {
                                addItem(getAddedItem(item));
                            }
                        }
                        //全部选
                        else if (!scope.allSelected && (scope.outputIds.indexOf(item.id) != -1)) {
                            removeItem(item);
                        }
                    }
                })
            };

            scope.clearAll = function () {
                var confirm = $win.confirm({
                    type: "delete",
                    title: "您确定要清空所有已选的商品吗？",
                    content: "清空后只能重新选择商品"
                }).result
                    .then(function () {
                        scope.allSelected = false;
                        scope.outputIds = [];
                        scope.output = [];
                        //渲染状态
                        setDisableStatus();
                        setSelectStatus();
                    })
            };

            scope.showSelected = function () {
                scope.selectedModal = !scope.selectedModal;
            };

            scope.removeItem = function (item) {
                removeItem(item);
                setSelectStatus();
            };

            init();

            function init() {
                //是否为促销
                scope.isPromotion = scope.options.source == "discount" || scope.options.source == "reward" || scope.options.source == "showcase" || scope.options.source == "material" || scope.options.source == "rate";
                scope.exceptedItemIds = options.disabled ? (function () {
                    return $.map(options.disabled, function (item) {
                        return typeof item == "object" ? item.id : item;
                    });
                })() : [];

                scope.selectedItemIds = options.selected ? (function () {
                    return $.map(options.selected, function (item) {
                        return typeof item == "object" ? item.id : item;
                    });
                })() : [];

                scope.outputIds = scope.output ? getIds(scope.output) : [];
                //获取商品分类
                scope.category = scope.categoryEnum[0];
                $restClient.get("seller/shopCat", null, function (data) {
                    var source = data.data;
                    source.splice(0, 0, {
                        cid: "",
                        isParent: 1,
                        name: "所有类别",
                        parentCid: 0,
                        picUrl: "",
                        sortOrder: 1,
                        type: "manual_type",
                        childCids: ""
                    }, {
                        cid: "-10000",
                        isParent: 1,
                        name: "未分类",
                        parentCid: 0,
                        picUrl: "",
                        sortOrder: 1,
                        type: "manual_type",
                        childCids: "-10000"
                    });
                    scope.categoryEnum = source;
                });
                //获取数据
                getList(1);
                //绑定事件
                bindEvent();
            }

            //获取商品列表
            function getList(pageNo, pageSize, count) {
                var params = {
                    keyword: scope.keyword,
                    pageSize: pageSize || scope.pageSize,
                    pageNo: --pageNo,
                    approveStatus: scope.approveStatus,
                    isFenxiao: scope.from.key,
                    sellerCids: scope.category.childCids,
                    column: scope.order.cur.type,
                    orderby: scope.order.cur.direction,
                    minPrice: Number(scope.minPrice) * 100 || "",
                    maxPrice: Number(scope.maxPrice) * 100 || "",
                    isBatch: scope.isBatch,
                    source: scope.options.source, //商品类别
                    hiddenCategory: scope.hiddenCategory,
                    hiddenCurrent: scope.hiddenCurrent,
                    currentId: scope.options.currentId
                };
                scope.loading = $restClient.post("seller/item/searchItem", null, params, function (data) {
                    scope.list = data.data;
                    scope.pageNo = ++data.pageNo;
                    scope.pageSize = data.pageSize;
                    scope.count = data.count;
                    scope.allSelected = false; //全选参数
                    setDisableStatus();
                    setSelectStatus();
                }).$promise;
            }

            //获取要添加的商品
            function getAddedItem(item) {
                //如果在已选中，使用原来的数据
                var index;
                if ((index = scope.selectedItemIds.indexOf(item.id)) != -1) {
                    return angular.copy(scope.options.selected[index]);
                } else {
                    return item
                }
            }

            //获取输入商品ID集合
            function getIds(items) {
                var ids = [];
                //获取已选择的商品ID
                angular.forEach(items, function (item) {
                    ids.push(item.id);
                });
                return ids;
            }

            //设置勾选状态
            function setSelectStatus() {
                var all = true;
                $(scope.list).each(function (index, item) {
                    var selected = false;
                    if (!item.disabled) {
                        selected = scope.outputIds.indexOf(item.id) != -1;
                        item.selected = selected;
                    } else {
                        selected = item.disabled;
                    }
                    all = all && selected;
                });
                scope.allSelected = all;
            }

            //设置禁选状态
            function setDisableStatus() {
                $(scope.list).each(function (index, item) {
                    item.disabled = scope.exceptedItemIds.indexOf(item.id) != -1 || scope.exceptedItemIds.indexOf(item.id.toString()) != -1;
                });
            }

            function addItem(item) {
                //超过上限
                if (scope.options.limitCount && scope.output.length >= scope.options.limitCount) {
                    $win.alert("商品个数不能超过" + scope.options.limitCount + "个");
                    return;
                }
                if (scope.options.isInsertBefore) {
                    item.selected = true;
                    scope.output.unshift(angular.copy(item));
                    scope.outputIds.unshift(item.id);
                } else {
                    item.selected = true;
                    scope.output.push(angular.copy(item));
                    scope.outputIds.push(item.id);
                }
            }

            function removeItem(item) {
                item.selected = false;

                angular.forEach(scope.output, function (data, index) {
                    if (data.id == item.id) {
                        scope.output.splice(index, 1);
                    }
                });

                angular.forEach(scope.outputIds, function (itemId, index) {
                    if (item.id == itemId) {
                        scope.outputIds.splice(index, 1);
                    }
                });
            }

            function bindEvent() {
                var id = null;
                //绑定浮动工具
                if (scope.options.showFloatToolbar) {
                    $(window).scroll(function () {
                        var $floatToolbar = element.find(".float-toolbar ").eq(0);
                        var $goodList = element.find(".goods-list").eq(0);
                        if (!id) {
                            id = setTimeout(function () {
                                var scrollTop = $(window).scrollTop();
                                var offsetTop = $goodList.offset().top;
                                if (offsetTop - scrollTop <= 70) {
                                    $floatToolbar.addClass("float-toolbar-fixed");
                                } else {
                                    $floatToolbar.removeClass("float-toolbar-fixed");
                                }
                                id = null;
                            }, 5);
                        }
                    });
                }
                //搜索框
                var $commonSearchInput = element.find(".search-input-group .common-search-input"),
                    $batchSearch = element.find(".search-input-group .batch-search"),
                    $batchSearchInput = element.find(".search-input-group .batch-search-input"),
                    $btnClearKeyword = element.find(".search-input-group .btn-clear-keyword");
                $btnClearKeyword.on("click", function () {
                    scope.keyword = "";
                    scope.$apply();
                });

                $commonSearchInput.on("focus", function (event) {
                    $batchSearch.show(300);
                    scope.isBatch = false;
                    scope.$apply();
                }).on("keyup", function (event) {
                    scope.batchKeyword = "";
                    if (event.keyCode == 13) {
                        scope.getList(1);
                    }
                    scope.$apply();
                });

                $(window).on("click", function (event) {
                    if (!$(event.target).hasClass("common-search-input") && !$(event.target).hasClass("batch-search-input")) {
                        $batchSearch.hide(300);
                    }
                });
                //批量关键字输入框
                $batchSearchInput.on("focus", function () {
                    scope.isBatch = true;
                    scope.$apply();
                }).on("keyup", function (event) {
                    //更新keyword
                    var value = $(event.target).val().split("\n");
                    scope.keyword = value.toString();

                    //更新count
                    $batchSearch.find(".counter").html(value.length + "/20");
                    scope.$apply();
                });

                //已参加活动
                element.find(".content").on("mouseenter", ".status", function (event) {
                    $(event.currentTarget).find(".status-list-wrap").show();
                }).on("mouseleave", ".status", function (event) {
                    $(event.currentTarget).find(".status-list-wrap").hide();
                })
            }
        }
    ]);
