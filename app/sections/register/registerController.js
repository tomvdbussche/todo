angular
    .module('app.core')
    .controller('RegisterController', function ($scope, $state, AuthService) {
        let view = this;

        view.user = {};

        view.sumbit = function () {
            AuthService.register(view.user)
                .then(function (error) {
                    if (error !== undefined) {
                        view.error = error;
                    } else {
                        $state.go('dashboard');
                    }
                });
        };
    });