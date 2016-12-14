angular.module('app.services')
    .factory('AuthService', ['$http', '$window', function ($http, $window) {
        var auth = {};

        auth.saveToken = function (token) {
            $window.localStorage['todo-auth-token'] = token;
        };

        auth.getToken = function () {
            return $window.localStorage['todo-auth-token'];
        };

        auth.isLoggedIn = function () {
            var token = auth.getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        auth.currentUser = function () {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        auth.logIn = function (user) {
            return $http.post('/api/login', user)
                .then(function (res) {
                    auth.saveToken(res.data.token);
                }, function (res) {
                    return res.data;
                });
        };

        auth.register = function (user) {
            return $http.post('/api/register', user)
                .then(function (res) {
                    auth.saveToken(res.data.token);
                }, function (res) {
                    return res.data;
                });
        };

        auth.logOut = function () {
            $window.localStorage.removeItem('todo-auth-token');
        };

        return auth;
    }]);