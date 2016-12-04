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
angular.module('todoApplication', ['ngRoute', 'ui.bootstrap', 'app.routes', 'app.core', 'app.services', 'app.config']);
angular.module('app.routes', ['ngRoute']).config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'app/components/dashboard/dashboardView.html',
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
angular.module('app.core').controller('DashboardController', function ($scope, lists) {
    var view = this;

    view.lists = lists;
});

angular.module('app.core').directive('taskList', ['ListService', function (ListService) {
    return {
        scope: {
            list: '='
        },
        templateUrl: 'app/shared/list/listView.html',
        controller: function controller($scope) {
            $scope.list.tasks.completed = $scope.list.tasks.filter(function (task) {
                return task.completed;
            }).length;
            $scope.toggle = function (task) {
                ListService.toggle(task);
            };
            $scope.delete = function (task) {
                console.log("Removed");
                ListService.delete(task);
            };
        }
    };
}]);
angular.module('app.services').factory('ListService', ['$http', function ($http) {
    var service = {
        lists: []
    };

    service.getAll = function () {
        return $http.get('/api/lists').then(function (response) {
            angular.copy(response.data, service.lists);
            return service.lists;
        });
    };

    service.toggle = function (task) {
        return $http.put('/api/list/' + task.list + '/task/' + task._id + '/toggle').then(function () {
            task.completed ^= true;
        });
    };

    service.delete = function (task) {
        return $http.delete('/api/task/' + task._id).then(function (response) {
            task.list.tasks.splice(task.list.tasks.indexOf(task), 1);
        });
    };

    return service;
}]);