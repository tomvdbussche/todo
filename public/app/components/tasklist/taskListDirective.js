angular
    .module('app.core')
    .directive('taskList', function () {
        return {
            scope: {
                list: '='
            },
            templateUrl: 'app/components/tasklist/taskListView.html',
            controller: 'TaskListController'
        };
    });