angular
    .module('app.core')
    .directive('taskList', function () {
        return {
            restrict: 'E',
            scope: {
                list: '='
            },
            templateUrl: 'app/components/tasklist/taskListView.html',
            controller: 'TaskListController'
        };
    });