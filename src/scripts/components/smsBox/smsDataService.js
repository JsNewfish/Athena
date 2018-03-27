angular.module("dp.ui.smsEditor")
    .factory("$smsData", ["$enum", "$win", "$smsVarsConfig", function($enum, $win, $smsVarsConfig) {
        //短信对象配置
        var MSG_VAR_CONFIG = {
            DEFAULT_VARS: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                SHOP_NAME: true, //店铺名字
                SELLER_NICK: true, //卖家昵称
                TRADE_MONEY: true, //订单金额
                TRADE_ID: true, //订单号
                TRADE_CREATE_TIME: true, //下单时间
                ARRIVAL_CITY: true, //到达城市
                PAYMENT_LINK: true, //付款链接
                LOGISTICS_COMPANY: true, //物流公司
                LOGISTICS_LINK: true, //物流链接
                CONFIRM_GOODS_LINK: true, //收货链接
                OUT_SID: true, //运单号,
                VIP_GRADE: true, //会员等级
                REFUND_TIME: true, //退款时间
                REFUND_FEE: true, //退款金额
                REASON: true, //退款原因
                REFUND_DETAIL: true, //退款详情
                TRADE_DETAIL: true, //订单详情
                RATE_SHORT_LINK: true, //评价链接
                RATE_DETAIL_LINK: true, //评价详情
                RATE_RESULT: true, //评价结果
                BUYER_MOBILE: true //买家手机号
            },
            //下单关怀
            ORDER_CREATE_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                TRADE_ID: true, //订单号
                TRADE_CREATE_TIME: true, //下单时间
                TRADE_DETAIL: true //订单详情
            },
            //常规催付
            NON_PAYMENT_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                TRADE_ID: true, //订单号
                TRADE_CREATE_TIME: true, //下单时间
                PAYMENT_LINK: true, //付款链接
                TRADE_DETAIL: true //订单详情
            },
            //二次催付
            AGAIN_NON_PAYMENT_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                TRADE_ID: true, //订单号
                TRADE_CREATE_TIME: true, //下单时间
                PAYMENT_LINK: true //付款链接
            },
            //聚划算催付
            JHS_NON_PAYMENT_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                TRADE_ID: true, //订单号
                TRADE_CREATE_TIME: true, //下单时间
                PAYMENT_LINK: true //付款链接
            },
            //预售催订金
            PRESELL_FRONT_NOPAID_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                TRADE_ID: true, //订单号
                TRADE_CREATE_TIME: true, //下单时间
                PAYMENT_LINK: true, //付款链接
                TRADE_DETAIL: true //订单详情
            },
            //征集预售催付
            PRESELL_NON_PAYMENT_INFORM: {},
            //发货提醒
            DELIVER_GOODS_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                SHOP_NAME: true, //店铺名字
                SELLER_NICK: true, //卖家昵称
                TRADE_MONEY: true, //订单金额
                TRADE_ID: true, //订单号
                TRADE_CREATE_TIME: true, //下单时间
                ARRIVAL_CITY: true, //到达城市
                LOGISTICS_COMPANY: true, //物流公司
                LOGISTICS_LINK: true, //物流链接
                OUT_SID: true //运单号
            },
            //派件提醒
            DELIVERY_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                SELLER_NICK: true, //卖家昵称
                TRADE_MONEY: true, //订单金额
                TRADE_ID: true, //订单号
                TRADE_CREATE_TIME: true, //下单时间
                ARRIVAL_CITY: true, //到达城市
                LOGISTICS_COMPANY: true, //物流公司
                LOGISTICS_LINK: true, //物流链接
                OUT_SID: true //运单号
            },
            //签收提醒
            SIGN_IN_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                SHOP_NAME: true, //店铺名字
                SELLER_NICK: true, //卖家昵称
                TRADE_MONEY: true, //订单金额
                TRADE_ID: true, //订单号
                TRADE_CREATE_TIME: true, //下单时间
                ARRIVAL_CITY: true, //到达城市
                LOGISTICS_COMPANY: true, //物流公司
                CONFIRM_GOODS_LINK: true, //收货链接
                OUT_SID: true //运单号
            },
            //付款关怀
            PAYMENT_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                TRADE_ID: true, //订单号
                TRADE_CREATE_TIME: true //下单时间
            },
            //预售付订金关怀
            PRESELL_FRONT_PAID_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                TRADE_ID: true, //订单号
                TRADE_CREATE_TIME: true //下单时间
            },
            //预售付尾款关怀
            PRESELL_FINAL_PAID_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                TRADE_ID: true, //订单号
                TRADE_CREATE_TIME: true, //下单时间
                TRADE_DETAIL: true //订单详情
            },
            //回款提醒
            AFFIRM_GOODS_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                TRADE_ID: true, //订单号
                TRADE_CREATE_TIME: true, //下单时间
                CONFIRM_GOODS_LINK: true, //收货链接
                RATE_SHORT_LINK: true //评价链接
            },
            //买家申请退款
            WAIT_SELLER_AGREE: {
                BUYER_NICK: true, //买家昵称
                TRADE_ID: true, //订单号
                REFUND_FEE: true, //退款金额
                REFUND_TIME: true, //退款申请时间
                REASON: true, //退款原因
                REFUND_DETAIL: true //退款详情
            },
            //退款成功
            REFUND_SUCCESS: {
                BUYER_NICK: true, //买家昵称
                TRADE_ID: true, //订单号
                REFUND_FEE: true, //退款金额
                REFUND_TIME: true, //退款申请时间
                REASON: true, //退款原因
                REFUND_DETAIL: true //退款详情
            },
            //卖家同意退款等待买家退货
            WAIT_BUYER_RETURN_GOODS: {
                BUYER_NICK: true, //买家昵称
                TRADE_ID: true, //订单号
                REFUND_FEE: true, //退款金额
                REFUND_TIME: true, //退款申请时间
                REASON: true, //退款原因
                REFUND_DETAIL: true //退款详情
            },
            //卖家拒绝退款
            SELLER_REFUSE_BUYER: {
                BUYER_NICK: true, //买家昵称
                TRADE_ID: true, //订单号
                REFUND_FEE: true, //退款金额
                REFUND_TIME: true, //退款申请时间
                REASON: true, //退款原因
                REFUND_DETAIL: true //退款详情
            },
            //中差评提醒
            REMIND_SELLER_INFORM: {
                BUYER_NICK: true, //买家昵称
                BUYER_MOBILE: true, //买家手机号
                RATE_RESULT: true, //评价结果
                RATE_DETAIL_LINK: true //评价详情
            },
            //中差评安抚
            NEUTRAL_BAD_RATE_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                RATE_SHORT_LINK: true, //评价链接
                TRADE_ID: true //订单号
            },
            //好评提醒
            GOOD_RATE_INFORM: {
                RATE_SHORT_LINK: true //评价链接
            },
            //未评价提醒
            NO_RATE_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                TRADE_ID: true, //订单号
                RATE_SHORT_LINK: true //评价链接
            },
            //延迟提醒
            DELAYED_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                SHOP_NAME: true, //店铺名字
                SELLER_NICK: true, //卖家昵称
                TRADE_MONEY: true, //订单金额
                TRADE_ID: true, //订单号
                TRADE_DETAIL: true //订单详情
            },
            //疑难件提醒
            ERROR_PACKAGE: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                SHOP_NAME: true, //店铺名字
                SELLER_NICK: true, //卖家昵称
                TRADE_MONEY: true, //订单金额
                TRADE_ID: true, //订单号
                TRADE_DETAIL: true //订单详情
            },
            //手动提醒
            MANUAL_INFORM: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                SELLER_NICK: true, //卖家昵称
                TRADE_ID: true, //订单号
                PAYMENT_LINK: true, //付款链接,
                LOGISTICS_LINK: true, //物流链接
                CONFIRM_GOODS_LINK: true, //收货链接
                RATE_SHORT_LINK: true, //评价链接
                TRADE_DETAIL: true, //订单详情
                REFUND_DETAIL: true //退款详情
            },
            //营销
            MARKETING_INFORM: {},
            //同城到达
            SEND_CITY: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                SELLER_NICK: true, //卖家昵称
                TRADE_MONEY: true, //订单金额
                TRADE_ID: true, //订单号
                TRADE_CREATE_TIME: true, //下单时间
                ARRIVAL_CITY: true, //到达城市
                LOGISTICS_COMPANY: true, //物流公司
                LOGISTICS_LINK: true, //物流链接
                OUT_SID: true //运单号
            },
            //万人团预售催尾款
            PRESELL_FINAL_NOPAID_INFORM: {},
            //万人团付款关怀
            PRESELL_PAYMENT_INFORM: {},
            //征集成功付款关怀
            PRESELL_PAYMENT_SUCCESS_INFORM: {},
            //预售失败关怀
            PRESELL_PAYMENT_FAILURE_INFORM: {},
            //营销
            MARKETING: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                VIP_GRADE: true
            },
            UPLOAD_FILE: {},
            //跨店营销
            SHOP_UNION_MARKETING: {
                BUYER_NICK: true //买家昵称
            },
            CONTINUOUS_MARKETING: {
                BUYER_NICK: true, //买家昵称
                RECEIVER_NAME: true, //买家姓名
                VIP_GRADE: true //会员等级
            }
        };
        //短信变量map
        var MSG_VAR_OBJ = {
            //买家昵称
            BUYER_NICK: {
                name: "BUYER_NICK",
                text: "买家昵称",
                modelValue: "#BUYER_NICK#",
                contentValue: "",
                previewValue: "武神",
                count: 8
            },
            //买家姓名
            RECEIVER_NAME: {
                name: "RECEIVER_NAME",
                text: "买家姓名",
                modelValue: "#RECEIVER_NAME#",
                contentValue: "",
                previewValue: "赵铁柱",
                count: 4
            },
            //店铺名字
            SHOP_NAME: {
                name: "SHOP_NAME",
                text: "店铺名字",
                modelValue: "#SHOP_NAME#",
                contentValue: "",
                previewValue: "赵铁柱小铺",
                count: 8
            },
            //卖家昵称
            SELLER_NICK: {
                name: "SELLER_NICK",
                text: "卖家昵称",
                modelValue: "#SHOP_NAME#",
                contentValue: "",
                previewValue: "店小二",
                count: 8
            },
            //订单金额
            TRADE_MONEY: {
                name: "TRADE_MONEY",
                text: "订单金额",
                modelValue: "#TRADE_MONEY#",
                contentValue: "",
                previewValue: "100,000",
                count: 4
            },
            //订单号
            TRADE_ID: {
                name: "TRADE_ID",
                text: "订单号",
                modelValue: "#TRADE_ID#",
                contentValue: "",
                previewValue: "952709527095270",
                count: 15
            },
            //下单时间
            TRADE_CREATE_TIME: {
                name: "TRADE_CREATE_TIME",
                text: "下单时间",
                modelValue: "#TRADE_CREATE_TIME#",
                contentValue: "",
                previewValue: "2013-01-01 12:00:00",
                count: 19
            },
            //到达城市
            ARRIVAL_CITY: {
                name: "ARRIVAL_CITY",
                text: "到达城市",
                modelValue: "#ARRIVAL_CITY#",
                contentValue: "",
                previewValue: "杭州",
                count: 4
            },
            //付款链接
            PAYMENT_LINK: {
                name: "PAYMENT_LINK",
                text: "付款链接",
                modelValue: "#PAYMENT_LINK#",
                contentValue: "",
                previewValue: "c.tb.cn/xxxxx",
                count: 16
            },
            //物流公司
            LOGISTICS_COMPANY: {
                name: "LOGISTICS_COMPANY",
                text: "物流公司",
                modelValue: "#LOGISTICS_COMPANY#",
                contentValue: "",
                previewValue: "全通",
                count: 4
            },
            //物流链接
            LOGISTICS_LINK: {
                name: "LOGISTICS_LINK",
                text: "物流链接",
                modelValue: "#LOGISTICS_LINK#",
                contentValue: "",
                previewValue: "http://物流xxxxxxxxxx",
                count: 12
            },
            //收货链接
            CONFIRM_GOODS_LINK: {
                name: "CONFIRM_GOODS_LINK",
                text: "收货链接",
                modelValue: "#CONFIRM_GOODS_LINK#",
                contentValue: "",
                previewValue: "http://收货xxxxxxxxxx",
                count: 12
            },
            //运单号
            OUT_SID: {
                name: "OUT_SID",
                text: "运单号",
                modelValue: "#OUT_SID#",
                contentValue: "",
                previewValue: "3322xxxxxxxx",
                count: 12
            },
            //会员等级
            VIP_GRADE: {
                name: "VIP_GRADE",
                text: "会员等级",
                modelValue: "#VIP_GRADE#",
                contentValue: "",
                previewValue: "至尊VIP",
                count: 5
            },
            //退款申请时间
            REFUND_TIME: {
                name: "REFUND_TIME",
                text: "退款申请时间",
                modelValue: "#REFUND_TIME#",
                contentValue: "",
                previewValue: "2013-01-01 12:00:00",
                count: 19
            },
            //退款金额
            REFUND_FEE: {
                name: "REFUND_FEE",
                text: "退款金额",
                modelValue: "#REFUND_FEE#",
                contentValue: "",
                previewValue: "XXX元",
                count: 4
            },
            //退款原因
            REASON: {
                name: "REASON",
                text: "退款原因",
                modelValue: "#REASON#",
                contentValue: "",
                previewValue: "因为XXX原因，而选择退款",
                count: 12
            },
            //订单详情
            TRADE_DETAIL: {
                name: "TRADE_DETAIL",
                text: "订单详情",
                modelValue: "#TRADE_DETAIL#",
                contentValue: "",
                previewValue: "订单详情xxx",
                count: 16
            },
            //退款详情
            REFUND_DETAIL: {
                name: "REFUND_DETAIL",
                text: "退款详情",
                modelValue: "#REFUND_DETAIL#",
                contentValue: "",
                previewValue: "退款详情xxx",
                count: 16
            },
            //评价连接
            RATE_SHORT_LINK: {
                name: "RATE_SHORT_LINK",
                text: "评价连接",
                modelValue: "#RATE_SHORT_LINK#",
                contentValue: "",
                previewValue: "http://评价xxxxxxxxx",
                count: 16
            },
            //买家手机号
            BUYER_MOBILE: {
                name: "BUYER_MOBILE",
                text: "买家手机号",
                modelValue: "#BUYER_MOBILE#",
                contentValue: "",
                previewValue: "137xxx4432",
                count: 11
            },
            //评价结果
            RATE_RESULT: {
                name: "RATE_RESULT",
                text: "评价结果",
                modelValue: "#RATE_RESULT#",
                contentValue: "",
                previewValue: "差评",
                count: 2
            }, //评价详情
            RATE_DETAIL_LINK: {
                name: "RATE_DETAIL_LINK",
                text: "评价详情",
                modelValue: "#RATE_DETAIL_LINK#",
                contentValue: "",
                previewValue: "http://评价详情xxxxxxxxx",
                count: 16
            }
        };
        //接收人枚举
        var MSG_RECEIVER_TYPE = [{
            key: 0,
            value: "订单收货人(默认必选)",
            text: "默认短信都发送至订单的收货人。此三项都开启时优先顺序为：1.买家留言指定；2.支付宝帐号；3.订单收货人；提示：短信只会发送至满足条件的一个对象",
            disabled: true
        }, {
            key: 1,
            value: "优先支付宝帐号",
            text: "若买家支付宝帐号为手机号时短信优先发给此手机号",
            disabled: false
        }, {
            key: 2,
            value: "优先买家留言指定",
            text: "优先发送至买家留言中指定的号码，留言中指定号码书写规则：#接收短信手机号#，例：#13800138000#。此功能常用于礼品类目，使用此方式需在店铺中给出提示；",
            disabled: false
        }, {
            key: 3,
            value: "会员基础联系人手机号",
            text: "基础联系人信息来源于会员第一笔订单的收货人。此信息可手工变更，但修改后不会影响收货人信息",
            disabled: false
        }, {
            key: 4,
            value: "最后一笔订单收货人手机号",
            text: "会员在本店下过多笔订单时会发送至最后一笔订单的收货人；如果只有一笔订单即为此笔订单的收货人",
            disabled: false
        }];
        //域名集合
        var DOMAIN_ARRAY = [
            "\\.top",
            "\\.com",
            "\\.net",
            "\\.cn",
            "\\.org",
            "\\.xyz",
            "\\.wang",
            "\\.club",
            "\\.site",
            "\\.link",
            "\\.ren",
            "\\.click",
            "\\.date",
            "\\.website",
            "\\.space",
            "\\.tech",
            "\\.one",
            "\\.help",
            "\\.com.cn",
            "\\.gift",
            "\\.cc",
            "\\.hk",
            "\\.biz",
            "\\.mobi",
            "\\.love",
            "\\.tm",
            "\\.info",
            "\\.win",
            "\\.red",
            "\\.faith",
            "\\.pink",
            "\\.pics",
            "\\.sexy",
            "\\.photo",
            "\\.pw",
            "\\.net.cn",
            "\\.in",
            "\\.org.cn",
            "\\.gov.cn",
            "\\.me",
            "\\.name",
            "\\.pro",
            "\\.tv",
            "\\.ws",
            "\\.asia",
            "\\.tw",
            "\\.xxx",
            "\\.blue",
            "\\.host",
            "\\.ac.cn",
            "\\.bj.cn",
            "\\.sh.cn",
            "\\.tj.cn",
            "\\.cq.cn",
            "\\.he.cn",
            "\\.sx.cn",
            "\\.nm.cn",
            "\\.ln.cn",
            "\\.jl.cn",
            "\\.hl.cn",
            "\\.js.cn",
            "\\.zj.cn",
            "\\.ah.cn",
            "\\.fj.cn",
            "\\.jx.cn",
            "\\.sd.cn",
            "\\.ha.cn",
            "\\.hb.cn",
            "\\.hn.cn",
            "\\.gd.cn",
            "\\.gx.cn",
            "\\.hi.cn",
            "\\.sc.cn",
            "\\.gz.cn",
            "\\.yn.cn",
            "\\.xz.cn",
            "\\.sn.cn",
            "\\.gs.cn",
            "\\.qh.cn",
            "\\.nx.cn",
            "\\.xj.cn",
            "\\.tw.cn",
            "\\.hk.cn",
            "\\.mo.cn",
            "\\.eu",
            "\\.la",
            "\\.us",
            "\\.ca",
            "\\.bz",
            "\\.de",
            "\\.tv",
            "\\.tc",
            "\\.vg",
            "\\.ms",
            "\\.gs",
            "\\.jp",
            "\\.co.uk",
            "\\.org.uk",
            "\\.me.uk",
            "\\.ac",
            "\\.io",
            "\\.sh",
            "\\.nl",
            "\\.at",
            "\\.be",
            "\\.co",
            "\\.berlin",
            "\\.es",
            "\\.mn",
            "\\.sc",
            "\\.vega"
        ];

        init();

        function init() {
            MSG_VAR_CONFIG = $.extend({}, MSG_VAR_CONFIG, $smsVarsConfig);
        }

        function getVarByName(name) {
            return MSG_VAR_OBJ[name];
        }

        function getVarsByType(type) {
            var config = MSG_VAR_CONFIG[type];
            return $.map(config, function(item, i) {
                return item ? i : null;
            })
        }

        function getVars() {
            return MSG_VAR_OBJ;
        }

        function contentToModel(value) {
            if (!value) {
                return "";
            }
            var vars = getVars();
            var result = value;
            angular.forEach(vars, function(item) {
                result = result.replace(new RegExp("<img[^<>]+?" + item.name + "[^<>]+?>", "ig"), item.modelValue);
            });
            result = filterTag(result);
            return result;
        }

        function modelToContent(value) {
            if (!value) {
                return "";
            }
            var vars = getVars();
            var result = value;
            angular.forEach(vars, function(item) {
                // var html = '<img class="variable" data-key="' + item.name + '"  src="/static/seller/app/images/informBox/' + item.name + '.png" />';
                var html = '<img class="variable" data-key="' + item.name + '"  src="//st.cuxiao.quannengzhanggui.net/static/cdist/images/components/smsEditor/' + item.name + '.png" />';
                result = result.replace(new RegExp(item.modelValue, "ig"), html);
            });
            result = result.replace(/^\s+|\s+$/ig, "&nbsp;");
            return result;
        }

        function contentToPreview(content, sign) {
            var vars = getVars();
            var result = content || "";
            sign = sign ? $enum.getEnumValueByKey("signature", sign) : "";
            angular.forEach(vars, function(item) {
                var previewValue = '<span>' + item.previewValue + '</span>';
                result = result.replace(new RegExp("<img[^<>]+?" + item.name + "[^<>]+?>", "ig"), previewValue);
            });

            result = sign ? ("【" + sign + "】" + result) : result;

            return result;
        }

        function modelToPreview(value, sign) {
            var vars = getVars();
            var result = value || "";
            sign = sign ? $enum.getEnumValueByKey("signature", sign) : "";
            angular.forEach(vars, function(item) {
                var previewValue = '<span>' + item.previewValue + '</span>';
                result = result.replace(new RegExp(item.modelValue, "ig"), previewValue);
            });
            result = sign ? ("【" + sign + "】" + result) : result;

            return result;
        }

        function filterTag(str) {
            str = str.replace(/<\/?[^>]*>/g, "");
            str = str.replace(/&nbsp;/ig, " ");
            str = str.replace(/\s+/ig, ' ');
            str = str.replace(/&amp;/ig, "&");
            str = str.replace(/&lt;/ig, "<");
            str = str.replace(/&gt;/ig, ">");
            str = str.replace(/&quot;/ig, '"');
            str = str.replace(/&copy;/ig, "©");
            str = str.replace(/&reg;/ig, "®");
            str = str.replace(/&yen;/ig, "￥");
            str = str.replace(/(\r)*\n/g, "");

            return str
        }

        function getSmsReceiverType(keys) {
            var result = [];
            angular.forEach(MSG_RECEIVER_TYPE, function(item) {
                if (keys.indexOf(item.key) != -1) {
                    result.push(item);
                }
            });
            return result;
        }

        function hasUrl(str) {
            var reg = new RegExp(DOMAIN_ARRAY.toString().replace(/,/ig, "|"), "ig");
            return reg.test(str);
        }

        function validate(template) {
            if (template.content == "") {
                $win.alert('短信内容不能为空');
                return false;
            }

            var reg1 = new RegExp(/[【】]/);
            if (reg1.test(template.content)) {
                $win.alert("短信内容存在不合法字符“【”或者“】”,请删除后再提交");
                return false;
            }
            return true;
        }

        function dealFail(data) {
            var result;
            switch (Number(data.resultCode)) {
                case 60000:
                case 60001:
                    result = $win.confirm({
                        title: "您当前的短信不足无法开启此任务",
                        content: data.resultMessage,
                        img: "images/components/alert/alert-no-message.png",
                        showClose: false,
                        cancelText: "前往充值",
                        redirectCancel: "#/setting/SMSTopUp",
                        size: "lg"
                    }).result;
                    break;
                case 30029:
                case 30030:
                    result = $win.confirm({
                        title: '含有敏感关键词无法保存，请修改！',
                        content: data.resultMessage,
                        img: "images/components/alert/alert-forbid.png",
                        showClose: false,
                        cancelText: "知道了",
                        size: "lg"
                    }).result;
                    break;
                case 30031:
                    result = $win.confirm({
                        title: "含有长连接",
                        content: data.resultMessage,
                        img: "images/components/alert/alert-question.png",
                        closeText: "继续保存",
                        cancelText: "返回修改",
                        size: "lg"
                    }).result;
                    break;
                case 30042:
                    result = $win.confirm({
                        title: "请确认短信中的链接前后是否有加空格？",
                        //content: '您短信中包含 <span class="text-danger">跳转链接</span>，请确保您的跳转链接前后都要加上 <span class="text-danger">空格</span>，否则有可能会导致链接无法打开！！！',
                        content: data.resultMessage,
                        img: "images/components/alert/alert-question.png",
                        closeText: "继续保存",
                        cancelText: "返回修改",
                        size: "lg"
                    }).result;
                    break;
                case 30099:
                    result = $win.confirm({
                        title: "温馨提醒",
                        //content: '您短信中包含 <span class="text-danger">跳转链接</span>，请确保您的跳转链接前后都要加上 <span class="text-danger">空格</span>，否则有可能会导致链接无法打开！！！',
                        content: "亲，需要先绑定手机号才能发送测试短信噢~",
                        img: "images/components/alert/alert-question.png",
                        closeText: "点我去绑定",
                        redirect:"#/setting/safetyWarning",
                        size: "lg",
                        showCancel: false
                    }).result;
                    break;
                default:
                    var resultMessage = data.resultMessage.split("|||"),
                        length = resultMessage.length,
                        title = length > 1 ? resultMessage[0] : "错误提醒",
                        content = length > 1 ? resultMessage[1] : resultMessage[0];
                    result = $win.confirm({
                        title: title,
                        content: content,
                        img: "images/components/alert/alert-forbid.png",
                        showClose: false,
                        cancelText: "知道了",
                        size: "lg"
                    }).result;
            }


            return result;
        }

        function getSignatureById(key) {
            return $enum.getEnumValueByKey("signature", key);
        }

        function clearMsgAttrs(entity) {
            delete entity.signatureId;
            delete entity.receiverType;
            delete entity.mobile;
            delete entity.viewValue;
            return entity;
        }

        return {
            //根据name获取变量
            getVarByName: getVarByName,
            //根据类型获取变量配置
            getVarsByType: getVarsByType,
            //获取变量集合
            getVars: getVars,
            //视图->模型
            contentToModel: contentToModel,
            //模型->视图
            modelToContent: modelToContent,
            //视图->预览
            contentToPreview: contentToPreview,
            //模型->预览
            modelToPreview: modelToPreview,
            //过滤标签
            filterTag: filterTag,
            //获取短信接收人
            getSmsReceiverType: getSmsReceiverType,
            //检查是否存在Url
            hasUrl: hasUrl,
            //短信提交失败处理
            dealFail: dealFail,
            //验证短信内容
            validate: validate,
            //获取签名内容
            getSignatureById: getSignatureById,
            //清楚短信属性
            clearMsgAttrs: clearMsgAttrs
        }
    }]);
