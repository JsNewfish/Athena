//操作dom

+function ($) {
    var DEFAULTS = {
        limitHeight: 80
    };

    var Flex = function (element, options) {
        var that = this;
        this.options = $.extend({}, DEFAULTS, options);
        this.$element = $(element);
        this.limitHeight = this.options.limitHeight;

        this.$element.on("click", ".btn-toggle", function (event) {
            that.toggle.call(that);
            event.stopPropagation();
        });
        this.render();
    };

    Flex.prototype.toggle = function () {
        this.isExpand ? this.collapse() : this.expand();
    };

    Flex.prototype.expand = function () {
        this.isExpand = true;
        this.$element.find(".fill").hide();
        this.$element.find(".overflow-content").show();
        this.$element.find(".btn-toggle").text("【收起】");
    };

    Flex.prototype.collapse = function () {
        this.isExpand = false;
        this.$element.find(".fill").show();
        this.$element.find(".overflow-content").hide();
        this.$element.find(".btn-toggle").text("【展开】");
    };

    Flex.prototype.render = function () {
        var height = this.$element.height();
        if (height < this.limitHeight) {
            return;
        }

        var $copy = $(this.$element.get(0).cloneNode(true));
        var count = 3;
        var copyText = $copy.text();
        var copyLength = copyText.length;
        var cur;
        //插入DOM渲染高度
        this.$element.after($copy.hide());

        //循环截取
        while ($copy.height() > this.limitHeight) {
            $copy.text(cur = copyText.substring(0, copyLength - count));
            count += 5;
        }
        var content = this.$element.text();
        this.visibleContent = content.substring(0, content.length - count - 4);
        this.overflowContent = content.substring(content.length - count - 4, content.length);
        this.$element.text(this.visibleContent);
        this.$element.append($('<span class="fill">...<span>'));
        this.$element.append($('<span class="overflow-content"></span>').text(this.overflowContent).hide());
        this.$element.append($('<span class="btn-toggle">【展开】</span>'));
        $copy.remove();
        //设置展开状态
        this.isExpand = false;
    };

    $.fn.flex = function function_name(options) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data("dp.flex");
            if (!data) {
                $this.data(data = new Flex(this, options));
            }
            if (typeof options == "string") {
                data[options]();
            }
        })
    };
}(jQuery);

angular.module('dp.ui.flex', [])
    .directive("dpFlex", ["$timeout", function ($timeout) {
        return {
            restrict: "EA",
            link: function (scope, element, attrs) {
                var firstLoading=true;
                scope.$watch(function () {
                    return element.height();
                }, function (newValue, oldValue) {
                    if (firstLoading&&newValue) {
                        firstLoading=false;
                        element.flex({
                            limitHeight: attrs.limitHeight
                        });
                    }
                });
            }
        }
    }]);





