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

    service.addList = function (list) {
        return $http
            .post('/api/lists', list)
            .then(function (response) {
                // Add new list
                service.lists.push(response.data);
            });
    };

    service.deleteList = function (list) {
        return $http
            .delete('api/list/' + list._id)
            .then(function () {
                // Delete list from memory
                service.lists.splice(service.lists.indexOf(list), 1);
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
            .get('/api/list/' + task.list._id + '/task/' + task._id + '/toggle')
            .then(function () {
                // Toggle completion state of task
                task.completed ^= true;
            });
    };

    service.deleteTask = function(list, task) {
        return $http
            .delete('/api/list/' + list._id + '/task/' + task._id)
            .then(function () {
                // Remove deleted task from list
                list.tasks.splice(list.tasks.indexOf(task), 1);
            });
    };

    service.renameList = function (list) {
        return $http
            .put('api/list/' + list._id + '/rename', list)
            .then(function () {
                // Success
            });
    };

    return service;
}]);