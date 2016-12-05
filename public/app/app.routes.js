angular
    .module('app.routes', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/sections/dashboard/dashboardView.html',
                controller: 'DashboardController as dashboard',
                // resolve: {
                //     lists: function () {
                //         return ['1', '2', '3'];
                //     }
                // }
                resolve: {
                    lists: function (ListService) {
                        return ListService.getAll();
                    }
                }
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    });