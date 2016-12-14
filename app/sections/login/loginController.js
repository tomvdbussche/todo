angular
    .module('app.core')
    .controller('LoginController', function ($scope, $state, AuthService) {
        let view = this;

        view.user = {};

        view.sumbit = function () {
            AuthService.logIn(view.user)
                .then(function (error) {
                    if (error !== undefined) {
                        view.error = error;
                    } else {
                        $state.go('dashboard');
                    }
                });
        };

        view.register = function () {
            $state.go('register');
        };
    });