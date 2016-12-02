'use strict';

angular.module('app.config', []).config(configs);

function configs($httpProvider) {
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
}
angular.module('app.core', []);
angular.module('todoApplication', ['ngRoute', 'app.routes', 'app.core', 'app.services', 'app.config']);
angular.module('app.routes', ['ngRoute']).config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'app/components/dashboard/dashboardView.html',
        controller: 'DashboardController as dashboard',
        resolve: {
            lists: function lists(ListService) {
                return ListService.getAll();
            }
        }
    }).otherwise({
        redirectTo: '/'
    });
});
angular.module('app.services', []);
angular.module('app.core').controller('DashboardController', function ($scope, lists) {
    var view = this;

    view.lists = lists;
});

angular.module('app.core').directive('list', function () {
    var directive = {
        controller: controller,
        templateUrl: 'app/shared/list/listView.html'
    };
});
angular.module('app.services').factory('ListService', function ($http) {
    var service = [];

    service.getAll = function () {
        return $http.get('/api/lists').success(function (response) {
            angular.copy(response, data.lists);
        });
    };

    return service;
});