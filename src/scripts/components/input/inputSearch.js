/**
 * Created by SNAKE on 2017/3/1.
 */
angular.module("dp.ui.input",[])
    .directive("dpInputSearch", [function(){
        function link(scope, element, attrs) {
            scope.searchItem = function(event){
                if (event.keyCode == 13) {
                    scope.action();
                }
            };
            scope.cancel = function(){
                scope.keyword = "";
            };
        }

        function controller($scope, $element, $attrs) {

        }

        return {
            restrict: "EA",
            template:'<div class="input-group input-group-sm input-search" style="line-height:20px;">' +
            '<input type="text" class="form-control" placeholder="{{placeholder}}" ng-model="keyword" ng-keyup="searchItem($event)"> ' +
            '<span class="ng-hide" ng-show="keyword.length>0" ng-click="cancel()"' +
            'style="position: absolute;margin-left: -16px;z-index: 2;font-size: 10px;margin-top: 6px;color: #ddd;"> ' +
            '<i class="glyphicon glyphicon-remove"></i> ' +
            '</span> ' +
            '<span class="input-group-btn"> ' +
            '<button class="btn btn-default" type="button" ng-click="action()">搜索</button> ' +
            '</span> ' +
            '</div>',
            scope: {
                action: "&",
                placeholder: "=",
                keyword: "=dpInput"
            },
            link: link,
            controller: controller
        }
    }]);
