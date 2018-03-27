/**
 * Created by lenovo on 2016/5/3.
 */
angular.module("dp.ui.cookies", [])
    .factory("$dpCookies", [function () {
        function getCookies(name) {
            var cv = document.cookie.split("; ");//使用"; "分割Cookie
            var cva = [], temp;
            /*循环的得到Cookie名称与值*/
            for (i = 0; i < cv.length; i++) {
                temp = cv[i].split("=");//用"="分割Cookie的名称与值
                cva[temp[0]] = decodeURIComponent(temp[1]);
            }
            if (name) return cva[name];//如果有name则输出这个name的Cookie值
            else return cva;//如果没有name则输出以名称为key，值为Value的数组
        }

        function setCookies(name, value, expires, path, domain, secure) {
            if (!name || !value) return false;//如果没有name和value则返回false
            if (name == "" || value == "") return false;//如果name和value为空则返回false
            /*对于过期时间的处理*/
            if (expires) {
                /*如果是数字则换算成GMT时间，当前时间加上以秒为单位的expires*/
                if (/^[0-9]+$/.test(expires)) {
                    var today = new Date();
                    expires = new Date(today.getTime() + expires * 1000).toGMTString();
                    /*判断expires格式是否正确，不正确则赋值为undefined*/
                } else if (!/^\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/.test(expires)) {
                    expires = undefined;
                }
            }
            /*合并cookie的相关值*/
            var cv = name + "=" + encodeURIComponent(value) + ";"
                + ((expires) ? " expires=" + expires + ";" : "")
                + ((path) ? "path=" + path + ";" : "")
                + ((domain) ? "domain=" + domain + ";" : "")
                + ((secure && secure != 0) ? "secure" : "");
            /*判断Cookie总长度是否大于4K*/
            if (cv.length < 4096) {
                document.cookie = cv;//写入cookie
                return true;
            } else {
                return false;
            }
        }

        function removeCookies(name, path, domain) {
            if (!name) return false;//如果没有name则返回false
            if (name == "") return false;//如果name为空则返回false
            if (!this.getCookies(name)) return false;//如果要删除的name值不存在则返回false
            /*合并Cookie的相关值*/
            document.cookie = name + "=;"
                + ((path) ? "path=" + path + ";" : "")
                + ((domain) ? "domain=" + domain + ";" : "")
                + "expires=Thu, 01-Jan-1970 00:00:01 GMT;";
            return true;

        }

        return {
            get: getCookies,
            set: setCookies,
            remove: removeCookies
        }
    }]);