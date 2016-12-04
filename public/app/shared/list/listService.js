angular.module('app.services').factory('ListService', ['$http', function ($http) {
    var service = {
        lists: []
    };

    service.getAll = function () {
        return $http
            .get('/api/lists')
            .then(function (response) {
                angular.copy(response.data, service.lists);
                return service.lists;
            });
    };

    service.toggle = function (task) {
        return $http
            .put('/api/list/' + task.list + '/task/' + task._id + '/toggle')
            .then(function () {
                task.completed ^= true;
            });
    };

    service.delete = function(task) {
        return $http
            .delete('/api/task/' + task._id)
            .then(function (response) {
                task.list.tasks.splice(task.list.tasks.indexOf(task), 1);
            });
    };

    return service;
}]);