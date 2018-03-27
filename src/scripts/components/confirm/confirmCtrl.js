angular.module("dp.ui.confirm", [])
    .controller("confirmCtrl", ["$scope", "$modal", "$modalInstance", "$data", function($scope, $modal, $modalInstance, $data) {
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        $scope.close = function() {
            $modalInstance.close();
        };

        init();

        function init() {
            $scope.data = $data;
        }
    }]).controller("promptCtrl", ["$scope", "$modal", "$modalInstance", "data", function($scope, $modal, $modalInstance, data) {
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        $scope.save = function() {
            $modalInstance.close(
                $scope.data.value
            );
        };

        init();

        function init() {
            $scope.data = data;
        }
    }]);
