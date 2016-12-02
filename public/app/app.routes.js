angular.module('app.routes', ['ngRoute']).config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/components/dashboard/dashboardView.html',
            controller: 'DashboardController as dashboard',
            resolve: {
                lists: function (ListService) {
                    return ListService.getAll();
                }
            }
        })
        .otherwise({
            redirectTo: '/'
        });
});