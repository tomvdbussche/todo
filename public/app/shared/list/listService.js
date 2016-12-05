angular.module('app.services').factory('ListService', ['$http', function ($http) {
    let service = {
        lists: []
    };

    service.getAll = function () {
        return $http
            .get('/api/lists')
            .then(function (response) {
                // Copy list data to internal list & return it
                angular.copy(response.data, service.lists);
                return service.lists;
            });
    };

    service.addTask = function (list, task) {
        return $http
            .post('/api/list/' + list._id + '/tasks', task)
            .then(function (response) {
                // Push new task onto list
                list.tasks.push(response.data);
            });
    };

    service.toggle = function (task) {
        return $http
            .put('/api/list/' + task.list._id + '/task/' + task._id + '/toggle')
            .then(function () {
                // Toggle completion state of task
                task.completed ^= true;
            });
    };

    service.delete = function(task) {
        return $http
            .delete('/api/task/' + task._id)
            .then(function () {
                // Remove deleted task from list
                task.list.tasks.splice(task.list.tasks.indexOf(task), 1);
            });
    };

    return service;
}]);