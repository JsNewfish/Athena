angular.module("dp.ui.base")
    .factory("$smsType", [function() {
        var SMS_TYPE = [{
            value: "ORDER_CREATE_INFORM",
            key: 0,
            name: "下单关怀"
        }, {
            key: 1,
            value: "NON_PAYMENT_INFORM",
            name: "下单后催付"
        }, {
            key: 2,
            value: "AGAIN_NON_PAYMENT_INFORM",
            name: "关闭前催付"
        }, {
            key: 3,
            value: "JHS_NON_PAYMENT_INFORM",
            name: "聚划算催付"
        }, {
            key: 4,
            value: "PRESELL_NON_PAYMENT_INFORM",
            name: "征集预售催付"
        }, {
            key: 5,
            value: "DELIVER_GOODS_INFORM",
            name: "即时发货提醒"
        }, {
            key: 6,
            value: "DELIVERY_INFORM",
            name: "派件提醒"
        }, {
            key: 7,
            value: "SIGN_IN_INFORM",
            name: "包裹签收提醒"
        }, {
            key: 8,
            value: "PAYMENT_INFORM",
            name: "日常付款关怀"
        }, {
            key: 9,
            value: "AFFIRM_GOODS_INFORM",
            name: "回款答谢"
        }, {
            key: 10,
            value: "WAIT_SELLER_AGREE",
            name: "买家申请退款"
        }, {
            key: 11,
            value: "REFUND_SUCCESS",
            name: "退款成功"
        }, {
            key: 12,
            value: "WAIT_BUYER_RETURN_GOODS",
            name: "等待买家退货"
        }, {
            key: 13,
            value: "SELLER_REFUSE_BUYER",
            name: "卖家拒绝退款"
        }, {
            key: 14,
            value: "REMIND_SELLER_INFORM",
            name: "中差评提醒"
        }, {
            key: 15,
            value: "NEUTRAL_BAD_RATE_INFORM",
            name: "中差评安抚"
        }, {
            key: 16,
            value: "GOOD_RATE_INFORM",
            name: "好评提醒"
        }, {
            key: 17,
            value: "NO_RATE_INFORM",
            name: "催好评"
        }, {
            key: 18,
            value: "DELAYED_INFORM",
            name: "延迟发货关怀"
        }, {
            key: 103,
            value: "MANUAL_INFORM",
            name: "手动提醒"
        }, {
            key: 20,
            value: "MARKETING_INFORM",
            name: "营销"
        }, {
            key: 21,
            value: "SEND_CITY",
            name: "同城到达提醒"
        }, {
            key: 22,
            value: "PRESELL_FINAL_NOPAID_INFORM",
            name: "预售催尾款"//万人团预售催尾款
        }, {
            key: 23,
            value: "PRESELL_PAYMENT_INFORM",
            name: "付款关怀"//万人团付款关怀
        }, {
            key: 24,
            value: "PRESELL_PAYMENT_SUCCESS_INFORM",
            name: "征集成功付款关怀"
        }, {
            key: 25,
            value: "PRESELL_PAYMENT_FAILURE_INFORM",
            name: "预售失败关怀"
        }, {
            key: 27,
            value: "PRESELL_FRONT_NOPAID_INFORM",
            name: "预售催订金"
        }, {
            key: 28,
            value: "PRESELL_FRONT_PAID_INFORM",
            name: "预售付订金关怀"
        }, {
            key: 29,
            value: "PRESELL_FINAL_PAID_INFORM",
            name: "预售付尾款关怀"
        }, {
            key: 30,
            value: "RECEIVE_TIME_DELAY_INFORM",
            name: "延长收货时间提醒"
        }, {
            key: 31,
            value: "CUSTOMIZED_PACKAGE_INFORM",
            name: "个性化包裹[不需要发短信]"
        }, {
            key: 32,
            value: "ETICKET_ISSUE_INFORM",
            name: "开票提醒"
        }, {
            key: 33,
            value: "ABNORMAL_LOGISTICS_INFORM",
            name: "异常物流提醒[发给卖家]"
        }, {
            key: 34,
            value: "MEMBER_UPGRADE_INFORM",
            name: "会员升级提醒"
        }, {
            key: 35,
            value: "ABNORMAL_LOGISTICS_INFORM",
            name: "会员降级提醒"
        }, {
            key: 100,
            value: "MARKETING",
            name: "营销"
        }, {
            key: 101,
            value: "UPLOAD_FILE",
            name: "指定发送"
        }, {
            key: 105,
            value: "CONTINUOUS_MARKETING",
            name: "二次营销"
        }, {
            key: 216,
            value: "SHOP_UNION_MARKETING",
            name: "联合营销"
        },{
            key: 50,
            value: "ERROR_PACKAGE",
            name: "疑难件提醒"
        }];

        function getTypeByName(name) {
            var result = null;
            angular.forEach(SMS_TYPE, function(item) {
                if (item.value == name) {
                    result = angular.copy(item);
                }
            });
            return result;
        }

        function getKeyByName(name) {
            return getTypeByName(name).key;
        }

        function getTypeByValue(type) {
            var result = null;
            angular.forEach(SMS_TYPE, function(item) {
                if (item.key == type) {
                    result = angular.copy(item.value);
                }
            });
            return result;
        }

        return {
            //根据value获取type
            getTypeByName: getTypeByName,
            //根据value获取key
            getKeyByName: getKeyByName,
            //根据key获取value
            getTypeByValue: getTypeByValue
        }
    }]);