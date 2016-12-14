angular
    .module('app.routes', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('dashboard', {
                url: '/',
                templateUrl: 'sections/dashboard/dashboardView.html',
                controller: 'DashboardController as dashboard',
                authenticate: true,
                resolve: {
                    lists: function (ListService) {
                        return ListService.getAll();
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'sections/login/loginView.html',
                controller: 'LoginController as login'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'sections/register/registerView.html',
                controller: 'RegisterController as register'
            });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
    })
    .run(function ($rootScope, $state, AuthService) {
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            if (toState.authenticate && !AuthService.isLoggedIn()) {
                $state.transitionTo('login');
                event.preventDefault();
            }
        });
    });
// .config(['$urlRouteProvider', function ($urlRouteProvider) {
//     $urlRouteProvider.otherwise('/');
// }]);