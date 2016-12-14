angular
    .module('app.core')
    .controller('ListController', ['$scope', 'ListService', function ($scope, ListService) {
        $scope.editing = false;
        let updateCount = function () {
            $scope.list.tasks.completed = $scope.list.tasks.filter(function (task) {
                return task.completed;
            }).length;
        };
        $scope.toggle = function (task) {
            console.log('Toggling task ' + task.name);
            ListService.toggle(task)
                .then(function () {
                    updateCount();
                });
        };
        $scope.deleteTask = function (task) {
            console.log('Removing task ' + task.name);
            ListService.deleteTask($scope.list, task)
                .then(function () {
                    updateCount();
                });
        };
        $scope.addTask = function () {
            if (!$scope.name || $scope.name === '') {
                return;
            } else {
                console.log('Adding new task ' + $scope.name);
                ListService.addTask($scope.list, {
                    name: $scope.name
                });
                $scope.name = '';
            }
        };
        $scope.renameList = function () {
            if (!$scope.list.title || $scope.list.title === '') {
                return;
            } else {
                console.log('Renaming list to ' + $scope.list.title);
                ListService.renameList($scope.list);
                $scope.editing = false;
            }
        };
        updateCount();
    }]);