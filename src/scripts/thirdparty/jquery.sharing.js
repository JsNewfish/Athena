+(function($) {
    $.share = {};

    //分享到新浪
    $.share.toSina = function() {
        try {
            var rlink = "https://shop" + VENUS_SHOP.outerShopId + ".taobao.com";
            var title = "亲，还记得与我们擦肩而过的那一刻吗?本店活动力度再次升级，这一次不要错过咯，全场包邮5折封顶另有无门槛优优惠卷抢，记得提前收藏哦！";
            var pic = "http://img04.taobaocdn.com/bao/uploaded" + VENUS_SHOP.picPath;
            var top = window.screen.height / 2 - 250;
            var left = window.screen.width / 2 - 300;
            window.open("http://service.weibo.com/share/share.php?pic=" + encodeURIComponent(pic) + "&title=" +
                encodeURIComponent(title.replace(/&nbsp;/g, " ").replace(/<br \/>/g, " ")) + "&url=" + encodeURIComponent(rlink),
                "分享至新浪微博",
                "height=500,width=600,top=" + top + ",left=" + left + ",toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");


        } catch (e) {
            throw new Error(e);
        }
    }
})(jQuery);
