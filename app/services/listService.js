angular.module('app.services').factory('ListService', ['$http', 'AuthService', function ($http, AuthService) {
    let service = {
        lists: []
    };

    service.getAll = function () {
        return $http
            .get('/api/lists', {
                headers: {Authorization: 'Bearer ' + AuthService.getToken()}
            })
            .then(function (response) {
                // Copy list data to internal list & return it
                angular.copy(response.data, service.lists);
                return service.lists;
            });
    };

    service.addList = function (list) {
        return $http
            .post('/api/lists', list, {
                headers: {Authorization: 'Bearer ' + AuthService.getToken()}
            })
            .then(function (response) {
                // Add new list
                service.lists.push(response.data);
            });
    };

    service.deleteList = function (list) {
        return $http
            .delete('api/list/' + list._id, {
                headers: {Authorization: 'Bearer ' + AuthService.getToken()}
            })
            .then(function () {
                // Delete list from memory
                service.lists.splice(service.lists.indexOf(list), 1);
            });
    };

    service.addTask = function (list, task) {
        return $http
            .post('/api/list/' + list._id + '/tasks', task, {
                headers: {Authorization: 'Bearer ' + AuthService.getToken()}
            })
            .then(function (response) {
                // Push new task onto list
                list.tasks.push(response.data);
            });
    };

    service.toggle = function (task) {
        return $http
            .get('/api/list/' + task.list._id + '/task/' + task._id + '/toggle', {
                headers: {Authorization: 'Bearer ' + AuthService.getToken()}
            })
            .then(function () {
                // Toggle completion state of task
                task.completed ^= true;
            });
    };

    service.deleteTask = function (list, task) {
        return $http
            .delete('/api/list/' + list._id + '/task/' + task._id, {
                headers: {Authorization: 'Bearer ' + AuthService.getToken()}
            })
            .then(function () {
                // Remove deleted task from list
                list.tasks.splice(list.tasks.indexOf(task), 1);
            });
    };

    service.renameList = function (list) {
        return $http
            .put('api/list/' + list._id + '/rename', list, {
                headers: {Authorization: 'Bearer ' + AuthService.getToken()}
            })
            .then(function () {
                // Success
            });
    };

    return service;
}]);