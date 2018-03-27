/**
 * Created by SNAKE on 2017/6/16.
 */
+function ($) {
    var browser = $.common.support();

    //模块
    var pageModule = null;
    var pageSubModule = null;
    //菜单
    var menu = {
        init: function (options, element) {
            var self = this;
            self.options = self.getOptions(options);
            self.data = self.options.data || [];
            self.key = self.options.key;
            self.param = self.options.param;
            self.$element = $('#' + element);
            self.render();
            self.bindEvent();
            self.isComplete = true;
        },
        getOptions: function (options) {
            var defaults = {};
            return $.extend({}, options, defaults)
        },
        render: function () {
            var self = this;
            self.$element.empty();
            $.each(self.data, function (i, item) {
                var onlyOneChild = item.children && item.children.length == 1;
                var $menuNode = self.getMenuItem(item);
                var $subMenu = onlyOneChild ? null : self.getSubMenu(item);
                //如果存在当前选择，则展开子菜单
                if (!onlyOneChild) {
                    $subMenu.find(".sub-menu-item.active").length > 0 && $menuNode.addClass("opened");
                } else {
                    self.isCurrent(item.children[0].key, item.children[0].param) && $menuNode.addClass("active");
                }
                self.$element.append(onlyOneChild ? $menuNode : $menuNode.append($subMenu))
            });
        },
        isCurrent: function (keys, params) {
            var self = this;
            var keyResult = false;
            var paramResult = false;
            if (keys instanceof Array) {
                $.each(keys, function (i, key) {
                    if (self.key && key.toString().toLowerCase() == self.key.toLowerCase()) {
                        keyResult = true;
                    }
                })
            } else {
                if (self.key && keys.toString().toLowerCase() == self.key.toLowerCase()) {
                    keyResult = true;
                }
            }

            if (keyResult) {
                //有分支
                if (params) {
                    if (params.value) {
                        if (self.param) {
                            $.each(self.param, function (i, curParam) {
                                if ((params.key == curParam.key) && (params.value.toString() == curParam.value.toString())) {
                                    paramResult = true;
                                }
                            });
                        }
                    } else {
                        if (self.param) {
                            var tempResult = true;
                            $.each(self.param, function (i, curParam) {
                                tempResult = tempResult && (params.key != curParam.key);
                            });
                            paramResult = tempResult;
                        } else {
                            paramResult = true;
                        }
                    }
                }
                //无分支
                else {
                    paramResult = true;
                }
            }

            return keyResult && paramResult;
        },
        getSubMenu: function (data) {
            //是否只有一个子节点
            if (data.children && data.children.length == 1) {
                return null;
            }
            var self = this;
            var $submenu = $('<div class="sub-menu"></div>');
            var hasActiveNode = false;

            $.each(data.children, function (i, item) {
                if (self.isCurrent(item.key, item.param)) {
                    var isCurItem = hasActiveNode = true;
                }
                var tpl = self.replace(item, self.getTpl("item", isCurItem));

                $submenu.append($(tpl).data(item));
            });
            return hasActiveNode ? $submenu.slideDown() : $submenu;
        },
        getMenuItem: function (data) {
            var self = this;
            var tpl = self.replace(data, self.getTpl("header", false, data.children && data.children.length == 1));
            var $tpl = $(tpl);
            if (data.children.length == 1) {
                $tpl.data(data.children[0]);
            }
            return $tpl
        },
        getTpl: function (type, isActive, onlyOneChild) {
            var tpl = "";
            switch (type) {
                case "header": {
                    if (onlyOneChild) {
                        tpl = '<li' +
                            ' class="menu-item can-not-expand' + (isActive ? " opened " : "") + '"' +
                            ' only-one-child="' + (onlyOneChild ? "true" : "false") + '"' +
                            '>' +
                            '<a class="title" data-key="{{key}}" href="{{url}}" {{blank}}>{{title}}</a>' +
                            '</li>';
                    } else {
                        tpl = '<li' +
                            ' class="menu-item can-expand' + (isActive ? " opened " : "") + '"' +
                            ' only-one-child="' + (onlyOneChild ? "true" : "false") + '"' +
                            '>' +
                            '<h5 class="title" data-key="{{key}}">{{title}}</h5>' +
                            '</li>';
                    }

                    break;
                }
                case "item": {
                    tpl = '<li class="sub-menu-item' + (isActive ? " active " : '') + '"><a  href="{{url}}" data-key="{{key}}" {{blank}}>{{title}}</a></li>';
                }
            }
            return tpl;
        },
        replace: function (data, tpl) {
            var curData = $.extend({}, data);
            if (curData.children && curData.children.length == 1) {
                var child = curData.children[0];
                curData.url = child.url;
                curData.key = child.key;
                curData.title = child.title;
                curData.blank = child.blank;
            }
            tpl = tpl.replace("{{title}}", curData.title);
            tpl = tpl.replace("{{url}}", curData.url);
            tpl = tpl.replace("{{key}}", curData.key.toString());
            tpl = tpl.replace("{{blank}}", curData.blank ? 'target="_blank"' : '');
            return tpl;
        },
        bindEvent: function () {
            var self = this;
            //有字节点
            self.$element.find(".menu-item.can-expand .title").on("click", function (event) {
                var $this = $(this),
                    $next = $this.next();
                $next.stop().slideToggle();
                $this.parent().toggleClass("opened");
                self.$element.find(".sub-menu").not($next).stop().slideUp().parent().removeClass('opened');
            });
            //无子节点
            self.$element.find(".menu-item.can-not-expand .title").on("click", function (event) {
                self.$element.find(".sub-menu-item,.menu-item.can-not-expand").removeClass("active");
                self.$element.find(".sub-menu").stop().slideUp().parent().removeClass("opened");
                $(this).closest(".menu-item").addClass("active");
                calculateUrl(this.href);
            });
            //2级节点
            self.$element.find(".sub-menu-item>a").on("click", function () {
                self.$element.find(".sub-menu-item,.menu-item.can-not-expand").removeClass("active");
                $(this).closest(".sub-menu-item").addClass("active");
                calculateUrl(this.href);
            })
        },
        selectNodeByKey: function (key, param) {
            var self = this;
            if (!key) return;
            self.key = key;
            self.param = param;
            self.$element.find(".menu-item ").removeClass("opened active").find(".sub-menu-item").removeClass("active");
            $.each(self.$element.find(".sub-menu-item ,.menu-item.can-not-expand"), function (i, item) {
                var nodeKey = $(item).data().key;
                var nodeParam = $(item).data().param;
                if (self.isCurrent(nodeKey, nodeParam)) {
                    $(item).addClass("active").closest(".menu-item").addClass("opened");
                }
            })
        }
    };
    //导航
    var nav = {
        init: function (element, key) {
            var self = this;
            self.key = key;
            self.$element = $("#mainNav");
            self.$links = self.$element.find(">li>a");
            self.render();
            self.bindEvent();
        },
        render: function () {
            var self = this;
            self.$links.parent().removeClass("active");
            if (!self.key) {
                self.$links.eq(0).addClass("active");
                return;
            }
            self.$links.each(function (i, item) {
                if ($(item).attr("data-key") == self.key) {
                    $(item).parent().addClass("active");
                }
            });
        },
        bindEvent: function () {
            var self = this;
            self.$links.on("click", function (event) {
                event.preventDefault();
                $(this).parent("li").addClass("active").siblings().removeClass("active");
                var href = event.currentTarget.href;
                var keys = getKeyFormUrl(href);
                if (keys.moduleKey != self.key) {
                    self.key = keys.moduleKey;
                    window.location.href = event.currentTarget.href;
                    if (browser.ie && browser.version <= 8) {
                        window.history.go(0);
                    }
                }
            });
        },
        selectNodeByKey: function (key) {
            var self = this;
            self.key = key;
            self.render();
        }
    };

    //扩展frame
    $.frame = {renderTmpl: renderTmpl, winAlert: winAlert};

    //初始化
    init();

    function init() {
        var key = getKeyFormUrl();
        //设置主导航
        setMainNav(key);
        //创建菜单
        createMenu(key);
        //设置头部信息
        setHeaderInfo();
        //监听路由
        listenerHash();
        //初始化侧边栏
        initToolbar();
        //初始化绑定手机号
        if (VENUS_SHOP_INFO && (!VENUS_SHOP_INFO.mobile || !VENUS_SHOP_INFO.alipayNo)) {
            if(IS_NEED_FORCE_POPUP){
                $("#globalBindingMobile").modal({
                    backdrop: "static",
                    show: true
                });
            }else {
                $("#globalBindingMobile").modal("show");
            }
            setTimeout(function () {
                initBindingMobile();
            }, 1000);
        }
        //宣传框
        /*if(IS_LOWER_PRICE){
         initShare();
         }*/
        initShare();

        var winHeight = document.documentElement.clientHeight - 200;
        $(".frame>.body").css("min-height", winHeight + "px")
    }

    //初始化广播消息
    function initBroadcast() {
        var globalCategory = null;
        var $broadcastModal = $("#globalBroadcastModal").on("shown.bs.modal", function () {
            getCategories();
        });

        $(".smart-ui-bar .broadcast").click(function () {
            $broadcastModal.modal("show");
        })

        function getCategories() {
            $.ajax({
                url: "/seller/notification/type",
                method: "GET",
                success: function (data) {
                    if (data.resultCode == 0) {
                        renderCategories(data.data);
                        if (data.data.length) {
                            globalCategory = data.data[0].type;
                            getItem(1, 10);
                        }
                    }
                }
            });
        }

        function getItem(pageNo, pageSize) {
            $.ajax({
                url: "/seller/notification/list",
                data: {notificationType: globalCategory, pageSize: pageSize, pageNo: Number(pageNo) - 1},
                method: "GET",
                success: function (data) {
                    if (data.resultCode == 0) {
                        renderItems(data.data);
                        renderPaging(data.count, Number(data.pageNo) + 1, data.pageSize);
                    }
                }
            });
        }

        function renderCategories(data) {
            var $container = $broadcastModal.find(".category-list").eq(0);
            $container.empty();
            if (data && data.length) {
                $.each(data, function (i, category) {
                    var $item = $('<li>' + category.name + '</li>').data("category", category).click(function () {
                        var $this = $(this);
                        globalCategory = $this.data("category").type;

                        getItem(1, 10);

                        $this.addClass("active").siblings().removeClass("active")
                    });
                    !i && $item.addClass("active");
                    category.unReadCount && $item.append($('<span class="badge badge-danger">' + category.unReadCount + '</span>'))
                    $container.append($item);
                })
            } else {
                $container.html('<li class="none-item">无相关类别</li>');
            }
        }

        function renderItems(data) {
            var $container = $broadcastModal.find(".item-list").eq(0);
            $container.empty();
            if (data && data.length) {
                $.each(data, function (i, item) {
                    var $item = $('<li ' + (item.status ? 'class="readed"' : '') + '><div class="title">' + item.title + '</div><div class="content">' + item.content + '</div></li>').data("item", item).click(function () {
                        var $this = $(this),
                            $data = $this.data("item"),
                            isRead = !!$data.status,
                            isExpand = !!$this.data("isExpand"),
                            id = $this.data("item").id;

                        $this.data("isExpand", !isExpand);
                        $this.find(".content")[isExpand ? "slideUp" : "slideDown"]();

                        if (!isRead) {
                            $this.addClass("readed");
                            $.ajax({
                                url: "/seller/notification/readTime?notificationId=" + id,
                                method: "PUT",
                                success: function (data) {
                                    $data.status = 1;
                                    $this.data("item", $data);
                                }
                            })
                        }
                    });

                    $container.append($item);
                })
            } else {
                $container.html('<li class="none-item">无相关消息</li>');
            }
        }

        function renderPaging(count, pageNo, pageSize) {
            var $paging = $broadcastModal.find(".paging-wrap").eq(0);
            $paging.empty().Paging({
                count: count,
                current: pageNo,
                pageSize: pageSize,
                callback: function (pagecount, size, count) {
                    getItem(Number(pagecount), size)
                }
            })
        }
    }

    //初始化绑定手机号
    function initBindingMobile() {
        var $globalBindingMobile = $("#globalBindingMobile");
        var $mobile = $globalBindingMobile.find(".shopInfo-mobile").eq(0); //手机号
        var $checkCode = $globalBindingMobile.find(".shopInfo-checkCode").eq(0); //验证码
        var $alipayNo = $globalBindingMobile.find(".shopInfo-alipayNo").eq(0); //支付宝账号
        var $alipayName = $globalBindingMobile.find(".shopInfo-alipayName").eq(0); //支付宝名字
        var $getCheckCodeBtn = $globalBindingMobile.find(".get-checkCode").eq(0); //获取验证码按钮
        var $checkCodeTime = $globalBindingMobile.find(".checkCodeTime").eq(0); //剩余多少时间
        var $saveBtn = $globalBindingMobile.find(".save").eq(0);

        var $textDanger = $globalBindingMobile.find(".text-danger").eq(0); //提示语

        var checkCodeTime = 60;
        var shopInfo = $.extend({}, VENUS_SHOP_INFO);

        $globalBindingMobile.on("click", ".close", function () {
            $globalBindingMobile.modal("hide");
        });

        $getCheckCodeBtn.on("click", function () {
            if (!$mobile.val()) {
                $mobile.css("border-color", "red");
                return;
            }
            $mobile.css("border-color", "");
            $.ajax({
                url: "/seller/shopInfo/checkCode",
                data: {mobile: $mobile.val()},
                method: "GET",
                success: function (data) {
                    if (data.resultCode == 0) {
                        $checkCodeTime.removeClass("hide");
                        $getCheckCodeBtn.addClass("hide");
                        $checkCodeTime.text(checkCodeTime + "s后重发...");
                        timer();
                    } else {
                        $textDanger.text(data.resultMessage);
                    }
                }
            });
        });
        $saveBtn.on("click", function () {
            shopInfo.checkCodeMobile = $mobile.val();
            shopInfo.checkCode = $checkCode.val();
            shopInfo.alipayNo = $alipayNo.val();
            shopInfo.alipayName = $alipayName.val();
            if (!(shopInfo.checkCode && shopInfo.checkCodeMobile) && !shopInfo.mobileStatus) {
                $textDanger.text("请填写手机号和验证码！");
                return;
            }else if(!shopInfo.alipayNo || !shopInfo.alipayName){
                $textDanger.text("请填写支付宝账号和支付宝姓名！");
                return;
            }
            var url = shopInfo.mobileStatus ? "/seller/shopInfo/alipayNo" : "/seller/shopInfo";
            $.ajax({
                url: url,
                type: "post",
                dataType: 'json',
                timeout: 10000,
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(shopInfo),
                success: function (data) {
                    if (data.resultCode == 0) {
                        $("#globalBindingMobile").modal("hide");
                        VENUS_SHOP_INFO = data.data;
                    } else {
                        $textDanger.text(data.resultMessage);
                    }
                }
            });
        });
        function timer() {
            setTimeout(function () {
                checkCodeTime = checkCodeTime - 1;
                if (checkCodeTime > 0) {
                    $checkCodeTime.text(checkCodeTime + "s后重发...");
                    timer();
                } else {
                    $checkCodeTime.addClass("hide");
                    $getCheckCodeBtn.removeClass("hide");
                    checkCodeTime = 60;
                }
            }, 1000);
        }
    }
    //初始化一分钱分享弹框
    function initShare() {
        var $shareModal = $("#share-modal");
        $shareModal.modal("show");
    }

    //初始化工具栏
    function initToolbar() {
        $("#backToTop").click(function () {
            $(window).scrollTop(0);
        });
        //常用模块设置
        initCommonModule();
        //初始化侧边栏广告
        initSidebarAdv();
        //检测是否绑定手机号
        initBroadcast();
    }

    //设置主导航
    function setMainNav(key) {
        nav.init("mainNav", key.moduleKey)
    }

    //监听哈希值
    function listenerHash() {
        var handler = function (event) {
            var oldUrl = $("<a></a>").attr("href", event.oldURL).get(0);
            var newUrl = $("<a></a>").attr("href", event.newUrl).get(0);
            var oldKey = getKeyFormUrl(oldUrl.hash);
            var newKey = getKeyFormUrl(newUrl.hash);

            //模块不同，则加载新菜单
            if (oldKey.moduleKey != newKey.moduleKey) {
                nav.selectNodeByKey(newKey.moduleKey);
                createMenu(newKey);
            }
            //选择节点
            else {
                menu.selectNodeByKey(newKey.subModuleKey, newKey.param);
                //统计路径

            }
        };

        if (window.addEventListener) {
            window.addEventListener("hashchange", handler);
        } else if (window.attachEvent) {
            window.attachEvent("onhashchange", handler);
        }
    }

    function calculateUrl(href) {
        var hashNodes = $.location(href).hashNodes(),
            vars = $.location(href).search(),
            curNode = null,
            curSubNode = null;
        var menuData = angular.copy(MENU_DATA.filter(function (node) {
            return node.key == hashNodes[0];
        })[0]);
        $.each(menuData.children, function (i, firstLvNode) {
            //找到节点
            if (curNode) {
                return false;
            }
            $.each(firstLvNode.children, function (i, secondLvNode) {
                if (isCurNode(secondLvNode, vars, hashNodes)) {
                    curNode = angular.copy(firstLvNode);
                    curSubNode = angular.copy(secondLvNode);
                    return false;
                }
            })
        });

        menuData.children = [];
        menuData.children.push(curNode);
        menuData.activeName = curSubNode.title;

        deleteNode(curNode);

        function isCurNode(node, vars, hashNodes) {
            var result = true,
                varsArray = [],
                value = null,
                params = $.isArray(node.param || {}) ? node.param : [node.param];

            if (!(node.key == hashNodes[1] || (typeof node.key === 'object' && node.key.indexOf(hashNodes[1]) != -1))) {
                result = false;
            }

            if (result) {
                //删除菜单标识
                delete vars.menu;
                $.each(vars, function (key, value) {
                    return result = validateParam(key, value, params);
                });
            }

            return result;
        }

        function validateParam(key, value, array) {
            var result = false;
            $.each(array, function (i, item) {
                if (item.key == key && String(item.value) == String(value)) {
                    result = true;
                    return false;
                }
            });
            return result;
        }

        function deleteNode(curNode) {
            if (curNode.children) {
                $.each(curNode.children, function (i, node) {
                    delete node.param;
                    delete node.url;
                    delete node.blank;
                    node.key = typeof node.key == "object" ? node.key.join(",") : node.key;
                    deleteNode(node);
                })
            } else {
                return false;
            }
        }

        //记录节点
        $.ajax({
            url: "/seller/accessLog/save",
            method: "POST",
            data: JSON.stringify(menuData),
            contentType: "application/json; charset=utf-8"
        });
    }

    //从url中获取模块名字
    function getKeyFormUrl(url) {
        var defaultKeys = {
            moduleKey: "homePage",
            subModuleKey: "workplace",
            params: null
        };
        var link = $("<a></a>").attr("href", url || window.location.href).get(0);
        var urlHash = link.hash.substr(1),
            split = urlHash.split("?"),
            searchStr = split[1],
            pathStr = split[0].substr(1);
        //路径节点
        var pathNode = pathStr ? pathStr.split("/") : [];
        var search = [];
        //是否带参数
        if (searchStr) {
            var searchArray = searchStr.split("&");
            $.each(searchArray, function (i, item) {
                var array = item.split("=");
                search.push({
                    key: array[0],
                    value: array[1]
                })
            });
        }

        return {
            moduleKey: pathNode[0] || null,
            subModuleKey: pathNode[1] || null,
            param: search.length > 0 ? search : null
        }
    }

    //创建菜单
    function createMenu(key) {
        if (!MENU_DATA) {
            throw new Error("can not find menu source data!");
        }
        var data = MENU_DATA.filter(function (node) {
            return node.key == key.moduleKey;
        })[0];

        if (data) {
            menu.init({
                data: data.children,
                key: key.subModuleKey,
                param: key.param
            }, "left-navigation")
        } else {
            console.warn("menu data can not be null");
        }
    }

    //设置头部信息
    function setHeaderInfo() {
        var $dropdown = $(".header .header-drop-down"),
            $tip = $dropdown.find(".link-tip"),
            $text = $tip.find(".text"),
            $arrow = $tip.find(".arrow");

        $dropdown.find(".link-list li").hover(function () {
            var title = $(this).data("title"),
                left = $(this).data("left");

            $arrow.stop().css("left", left);
            $text.text(title);
            $tip.stop().fadeIn();
        }, function () {
            $tip.stop().fadeOut();
        })
    }

    //初始化侧边栏广告
    function initSidebarAdv() {
        var $advWrap = $("#sideAdv"),
            $advModal = $("#globalAdvModal"),
            currentData;

        //关闭事件
        $advModal.on("hidden.bs.modal", function () {
            close();
        });
        //模态框
        if (BROADCAST_POP_UP && BROADCAST_POP_UP.content) {
            renderAdvModal(currentData = BROADCAST_POP_UP);
        }
        //侧边栏广告
        if (BROADCAST_TOOLBAR_TIP && BROADCAST_TOOLBAR_TIP.toolbarIcon) {
            var $tmpl;
            //不弹窗
            if (!BROADCAST_TOOLBAR_TIP.popup) {
                $tmpl = $('<a href="' + BROADCAST_TOOLBAR_TIP.clickUrl + '" target="_blank"><img src="' + BROADCAST_TOOLBAR_TIP.toolbarIcon + '"></img></a>').click(function () {
                    $.ajax({
                        url: "/seller/broadcastLog",
                        method: "PUT",
                        data: JSON.stringify({broadcastId: data.id})
                    });
                });

            } else {
                $tmpl = $('<img src="' + BROADCAST_TOOLBAR_TIP.toolbarIcon + '"></img>').click(function () {
                    renderAdvModal(currentData = BROADCAST_TOOLBAR_TIP);
                })
            }
        }

        $advWrap.append($tmpl);

        function renderAdvModal(data) {
            $advModal.find(".modal-content").html(data.content);
            if (VENUS_SHOP_INFO && VENUS_SHOP_INFO.mobile) {
                $advModal.modal("show");
            }
        }

        function close() {
            $.ajax({
                url: "/seller/broadcastLog?broadcastId=" + currentData.id,
                method: "PUT",
                success: function () {
                    $advModal.modal("hide");
                }
            });
        }
    }

    //初始化通知
    function initNotification() {

    }

    //初始化常用模块
    function initCommonModule() {
        var $modal = $("#modalFavourite"),
            $categoryList = $('#categoryList'),
            $favouriteList = $("#favouriteList"),
            $favouriteListToolbar = $("#favouriteListToolbar"),
            $counter = $modal.find(".current "),
            favouriteCount = 0;

        //获取常用
        $.ajax({
            url: "/seller/favoriteFunction/list",
            method: "GET",
            success: function (data) {
                renderFavourite(data.data);
            }
        });

        //自定义设置
        $("#btnCustomModule,#btnCustomSettingToolbar").on("click", openModalFavourite);

        //保存
        $modal.find("#btnSaveCustomSetting").on("click", function () {
            var $cbl = $categoryList.find('input[type="checkbox"]:checked');
            var favoriteFunctions = $.map($cbl, function (cbk, i) {
                var data = $(cbk).data("source");
                return {functionId: data.id, seq: i}
            });

            $.ajax({
                url: "/seller/favoriteFunction",
                method: "POST",
                data: JSON.stringify(favoriteFunctions),
                contentType: "application/json;charset=UTF-8",
                success: function (data) {
                    if (data.resultCode == 0) {
                        $modal.modal("hide");
                        renderFavourite(data.data);
                    } else {
                        winAlert(data.resultMessage);
                    }
                }
            })
        });

        function openModalFavourite() {
            //获取全部
            $.ajax({
                url: "/seller/softwareFunction/list",
                method: "GET",
                success: function (data) {
                    renderCommonModule(data.data);
                    $modal.modal("show");
                }
            });
        }

        function renderFavourite(data) {
            $favouriteList.empty();
            $favouriteListToolbar.empty();
            $.each(data, function (i, item) {
                var tmpl = '<li class="function"><a href="{{url}}" target="_blank" class="no-decoration animated flipInY"><div style="background-position:{{iconX}}px {{iconY}}px " class="icon"/><span class="text">{{abbrev}}</span></a></li>';
                $favouriteList.append($(renderTmpl(item, tmpl)));
                $favouriteListToolbar.append($(renderTmpl(item, tmpl)));
            });

            if (data.length < 12) {
                var btnAddTmpl = '<li class="function add">+</li>';
                $favouriteList.append($(btnAddTmpl).on("click", openModalFavourite));
                $favouriteListToolbar.append($(btnAddTmpl).on("click", openModalFavourite));
            }
        }

        function renderCommonModule(data) {
            favouriteCount = 0;
            $categoryList.empty();
            $.each(data, function (i, category) {
                var $category = $('<li><div class="category-name">' + category.name + '</div><ul class="function-list"></ul></li>'),
                    $functionList = $category.find(".function-list").eq(0);

                $.each(category.functions, function (i, item) {
                    if (item.favorite) {
                        favouriteCount++;
                    }
                    var functionTmpl = '<li><div class="checkbox"><label for="function_{{id}}"><input type="checkbox" id="function_{{id}}" style="background-position:{{iconX}} {{iconY}};"/>{{abbrev}}</label></div></li>';
                    var $functionElem = $(renderTmpl(item, functionTmpl));
                    var $checkbox = $functionElem.find("input");
                    $checkbox.prop("checked", item.favorite).data("source", item);
                    $functionList.append($functionElem);
                });
                renderCount();
                $categoryList.append($category);
            });

            $categoryList.find('input[type="checkbox"]').on("change", function () {
                if (!$(this).prop("checked")) {
                    favouriteCount--;
                } else {
                    favouriteCount++;
                }
                renderCount()
            })
        }

        function renderCount() {
            $counter.text(favouriteCount);
        }
    }

    //根据数据渲染模板
    function renderTmpl(data, tmpl, fieldNames) {
        try {
            var reg = null;
            if (fieldNames && fieldNames.length) {
                for (var i in fieldNames) {
                    var current = fieldNames[i],
                        fieldName, fieldValue;
                    if (typeof current == "object") {
                        for (var k in current) {
                            fieldName = k;
                            fieldValue = current[k].call(current, data[fieldName]);
                        }
                    } else {
                        fieldName = current;
                        fieldValue = data[current];
                    }

                    reg = new RegExp('{{' + fieldName + '}}', "ig");
                    tmpl = tmpl.replace(reg, fieldValue);
                }
            } else {
                for (var fieldName in data) {
                    reg = new RegExp('{{' + fieldName + '}}', "ig");
                    tmpl = tmpl.replace(reg, data[fieldName]);
                }
            }
            return tmpl;
        } catch (e) {
            console.log(e)
        }
    }

    //提示
    function winAlert(content, type) {
        var $element = $("#alert"),
            $content = $element.find(".content"),
            $btnClose = $element.find(".close"),
            alertClass = "alert-" + (type || "warning");
        $element.removeClass("alert-warning").removeClass("alert-success");
        $element.addClass(alertClass);
        $content.text(content || "");
        $element.fadeIn();
        setTimeout(function () {
            $element.fadeOut();
        }, 3000);

        $btnClose.on("click", function () {
            $element.fadeOut();
        });
    }
}(jQuery);
