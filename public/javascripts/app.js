'use strict';

angular.module('app.config', []).config(configs);

function configs($httpProvider, $logProvider) {
    var interceptor = function interceptor($location, $log, $q) {
        function error(response) {
            if (response.status === 401) {
                $log.error('You are unauthorised to access the requested resource (401)');
            } else if (response.status === 404) {
                $log.error('The requested resource could not be found (404)');
            } else if (response.status === 500) {
                $log.error('Internal server error (500)');
            }
            return $q.reject(response);
        }
        function success(response) {
            //Request completed successfully
            return response;
        }
        return function (promise) {
            return promise.then(success, error);
        };
    };
    $httpProvider.interceptors.push(interceptor);
    $logProvider.debugEnabled(true);
}
angular.module('app.core', []);
angular.module('todoApplication', ['ngRoute', 'ui.bootstrap', 'app.routes', 'app.core', 'app.services', 'app.config', 'app.templates']);
angular.module('app.routes', ['ngRoute']).config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'sections/dashboard/dashboardView.html',
        controller: 'DashboardController as dashboard',
        // resolve: {
        //     lists: function () {
        //         return ['1', '2', '3'];
        //     }
        // }
        resolve: {
            lists: function lists(ListService) {
                return ListService.getAll();
            }
        }
    }).otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
});
angular.module('app.services', []);
angular.module('app.templates', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('components/list/listView.html', '<div class="list-panel">\n    <!-- Header -->\n    <div class="panel-heading">\n        <div class="list-title">\n            <h3 ng-hide="editList" class="panel-title" ng-bind="list.title"></h3>\n            <form class="list-title-form" ng-show="editList" ng-submit="editList = false">\n                <input class="list-title-input" ng-model="list.title">\n            </form>\n        </div>\n        <div class="list-buttons" ng-hide="editList">\n            <a class="list-button-edit" href="#" ng-click="editList = true" aria-label="Edit list">\n                <span class="list-icon-edit" aria-hidden="true"></span>\n            </a>\n        </div>\n    </div>\n    <!-- Details -->\n    <div class="panel-body">\n        <!-- Progress -->\n        <uib-progressbar class="list-progress" value="list.tasks.completed" max="list.tasks.length">\n            {{list.tasks.completed}} / {{list.tasks.length}}\n        </uib-progressbar>\n    </div>\n    <!-- Task items -->\n    <table class="list-items">\n        <tbody>\n        <tr>\n            <td class="task-new" ng-click="addTask()">\n                <a class="task-button-new" href="#" aria-label="New task">\n                    <span class="task-icon-new" aria-hidden="true"></span>\n                </a>\n            </td>\n            <td colspan="2">\n                <form class="task-form" ng-submit="addTask()">\n                    <input class="task-input" ng-model="name" placeholder="New task...">\n                </form>\n            </td>\n        </tr>\n        <tr ng-repeat="task in list.tasks">\n            <td class="task-toggle" ng-click="toggle(task)">\n                <div class="task-completion">\n                    <label>\n                        <input type="checkbox" ng-checked="task.completed" aria-label="Completion"/>\n                    </label>\n                </div>\n            </td>\n            <td>\n                <div ng-class="{\'task-completed\': task.completed}">\n                    <span class="task-name">{{ task.name }}</span>\n                </div>\n            </td>\n\n            <td class="task-delete" ng-click="delete(task)">\n                <a class="task-button-delete" href="#" aria-label="Remove task">\n                    <span class="task-icon-delete" aria-hidden="true"></span>\n                </a>\n            </td>\n        </tr>\n        </tbody>\n    </table>\n</div>');
    $templateCache.put('sections/dashboard/dashboardView.html', '<!-- TODO content -->\n<div>\n    <div class="col-md-4" ng-repeat="list in dashboard.lists">\n        <list list="list"></list>\n    </div>\n</div>');
}]);
angular.module('app.services').factory('ListService', ['$http', function ($http) {
    var service = {
        lists: []
    };

    service.getAll = function () {
        return $http.get('/api/lists').then(function (response) {
            // Copy list data to internal list & return it
            angular.copy(response.data, service.lists);
            return service.lists;
        });
    };

    service.addTask = function (list, task) {
        return $http.post('/api/list/' + list._id + '/tasks', task).then(function (response) {
            // Push new task onto list
            list.tasks.push(response.data);
        });
    };

    service.toggle = function (task) {
        return $http.put('/api/list/' + task.list._id + '/task/' + task._id + '/toggle').then(function () {
            // Toggle completion state of task
            task.completed ^= true;
        });
    };

    service.delete = function (list, task) {
        return $http.delete('/api/list/' + list._id + '/task/' + task._id).then(function () {
            // Remove deleted task from list
            list.tasks.splice(list.tasks.indexOf(task), 1);
        });
    };

    return service;
}]);
angular.module('app.core').controller('ListController', ['$scope', 'ListService', function ($scope, ListService) {
    var updateCount = function updateCount() {
        $scope.list.tasks.completed = $scope.list.tasks.filter(function (task) {
            return task.completed;
        }).length;
    };
    $scope.toggle = function (task) {
        console.log('Toggling task ' + task.name);
        ListService.toggle(task).then(function () {
            updateCount();
        });
    };
    $scope.delete = function (task) {
        console.log('Removing task ' + task.name);
        ListService.delete($scope.list, task).then(function () {
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
    updateCount();
}]);
angular.module('app.core').directive('list', function () {
    return {
        restrict: 'E',
        scope: {
            list: '='
        },
        templateUrl: 'components/list/listView.html',
        controller: 'ListController'
    };
});
angular.module('app.core').controller('DashboardController', function ($scope, lists) {
    var view = this;

    view.lists = lists;
});