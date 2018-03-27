angular.module("dp.ui.base")
    .factory("$advertisement", [function () {
        function create(data) {
            if (!data) {
                return null;
            }
            var template = '<div class="advertisement-box" {{backgroundColor}}>' +
                '<a href="{{url}}"  target="{{target}}">' +
                '<img src="{{img}}"/>' +
                '</a>' +
                '</div>';

            template = template.replace(/\{\{img\}\}/ig, data.content);
            template = template.replace(/\{\{url\}\}/ig, data.link);
            template = template.replace(/\{\{target\}\}/ig, data.target);
            template = template.replace(/\{\{backgroundColor\}\}/ig, 'style="background-color:' + data.backgroundColor + '"');
            return $(template);
        }

        return {
            create: create
        }
    }]);