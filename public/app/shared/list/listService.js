angular.module('app.services').factory('ListService', function ($http) {
    var service = [];

    service.getAll = function () {
        return $http.get('/api/lists').success(function (response) {
            angular.copy(response, data.lists);
        });
    };

    return service;
});