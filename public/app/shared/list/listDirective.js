angular
    .module('app.core')
    .directive('taskList', ['ListService', function (ListService) {
        return {
            scope: {
                list: '=',
            },
            templateUrl: 'app/shared/list/listView.html',
            controller: function ($scope) {
                $scope.list.tasks.completed = $scope.list.tasks.filter(function (task) {
                    return task.completed;
                }).length;
                $scope.toggle = function (task) {
                    ListService.toggle(task);
                };
                $scope.delete = function(task) {
                    console.log("Removed");
                    ListService.delete(task);
                };
            }
        };
    }]);