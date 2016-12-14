'use strict';

angular.module('app.config', []).config(configs);

function configs($httpProvider, $logProvider) {
    var interceptor = function interceptor($location, $log, $q) {
        function error(response) {
            if (response.status === 401) {
                $log.error('You are unauthorised to access the requested resource (401)');
            } else if (response.status === 404) {
                $log.error('The requested resource could not be found (404)');
            } else if (response.status === 500) {
                $log.error('Internal server error (500)');
            }
            return $q.reject(response);
        }
        function success(response) {
            //Request completed successfully
            return response;
        }
        return function (promise) {
            return promise.then(success, error);
        };
    };
    $httpProvider.interceptors.push(interceptor);
    $logProvider.debugEnabled(true);
}
angular.module('app.core', []);
angular.module('todoApplication', ['ui.router', 'ui.bootstrap', 'app.routes', 'app.core', 'app.services', 'app.config', 'app.templates']);
angular.module('app.routes', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('dashboard', {
        url: '/',
        templateUrl: 'sections/dashboard/dashboardView.html',
        controller: 'DashboardController as dashboard',
        authenticate: true,
        resolve: {
            lists: function lists(ListService) {
                return ListService.getAll();
            }
        }
    }).state('login', {
        url: '/login',
        templateUrl: 'sections/login/loginView.html',
        controller: 'LoginController as login'
    }).state('register', {
        url: '/register',
        templateUrl: 'sections/register/registerView.html',
        controller: 'RegisterController as register'
    });

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
}).run(function ($rootScope, $state, AuthService) {
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
angular.module('app.services', []);
angular.module('app.templates', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('components/list/listView.html', '<div class="list-panel">\n    <!-- Header -->\n    <div class="panel-heading">\n        <div class="list-title">\n            <h3 ng-hide="editing" class="panel-title" ng-bind="list.title"></h3>\n            <form class="list-title-form" ng-show="editing" ng-submit="renameList()">\n                <input class="list-title-input" ng-model="list.title">\n            </form>\n        </div>\n        <div class="list-buttons" ng-hide="editing">\n            <a class="list-button-edit" href="#" ng-click="editing = true" aria-label="Edit list">\n                <span class="list-icon-edit" aria-hidden="true"></span>\n            </a>\n        </div>\n    </div>\n    <!-- Details -->\n    <div class="panel-body">\n        <!-- Progress -->\n        <uib-progressbar class="list-progress" value="list.tasks.completed" max="list.tasks.length">\n            {{list.tasks.completed}} / {{list.tasks.length}}\n        </uib-progressbar>\n    </div>\n    <!-- Task items -->\n    <table class="list-items">\n        <tbody>\n        <tr>\n            <td class="task-new" ng-click="addTask()">\n                <a class="task-button-new" href="#" aria-label="New task">\n                    <span class="task-icon-new" aria-hidden="true"></span>\n                </a>\n            </td>\n            <td colspan="2">\n                <form class="task-form" ng-submit="addTask()">\n                    <input class="task-input" ng-model="name" placeholder="New task...">\n                </form>\n            </td>\n        </tr>\n        <tr ng-repeat="task in list.tasks">\n            <td class="task-toggle" ng-click="toggle(task)">\n                <div class="task-completion">\n                    <label>\n                        <input type="checkbox" ng-checked="task.completed" aria-label="Completion"/>\n                    </label>\n                </div>\n            </td>\n            <td>\n                <div ng-class="{\'task-completed\': task.completed}">\n                    <span class="task-name">{{ task.name }}</span>\n                </div>\n            </td>\n\n            <td class="task-delete" ng-click="deleteTask(task)">\n                <a class="task-button-delete" href="#" aria-label="Remove task">\n                    <span class="task-icon-delete" aria-hidden="true"></span>\n                </a>\n            </td>\n        </tr>\n        </tbody>\n    </table>\n</div>');
    $templateCache.put('components/modal/deleteList.html', '    <div class="modal-header">\n        <h3 class="modal-title" id="modal-title">Delete list</h3>\n    </div>\n    <div class="modal-body" id="modal-body">\n        Are you sure you want to delete list <b>{{ title }}</b>\n    </div>\n    <div class="modal-footer">\n        <button class="btn btn-danger" type="button" ng-click="dashboard.modal.close()">Delete</button>\n        <button class="btn" type="button" ng-click="dashboard.modal.dismiss()">Cancel</button>\n    </div>');
    $templateCache.put('components/modal/newList.html', '<form name="newListForm" ng-submit="dashboard.modal.close(listTitle)">\n    <div class="modal-header">\n        <h3 class="modal-title" id="modal-title">New list</h3>\n    </div>\n    <div class="modal-body" id="modal-body">\n        <input class="form-control" ng-model="listTitle" id="title" required/>\n    </div>\n    <div class="modal-footer">\n        <button class="btn btn-primary" type="sumbit" ng-disabled="newListForm.$invalid">Create</button>\n        <button class="btn" type="button" ng-click="dashboard.modal.dismiss()">Cancel</button>\n    </div>\n</form>');
    $templateCache.put('sections/dashboard/dashboardView.html', '<nav class="navbar navbar-default navbar-static-top">\n    <div class="container-fluid">\n        <!-- Brand and toggle get grouped for better mobile display -->\n        <div class="navbar-header">\n            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"\n                    data-target="#bs-example-navbar-collapse-1" aria-expanded="false">\n                <span class="sr-only">Toggle navigation</span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n            </button>\n            <a class="navbar-brand" href="#">Todo</a>\n        </div>\n\n        <!-- Collect the nav links, forms, and other content for toggling -->\n        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">\n            <ul class="nav navbar-nav">\n                <li>\n\n                    <a href="#" ng-click="dashboard.openNewListModal()"><span class="glyphicon glyphicon-plus"></span> New</a>\n                </li>\n                <li class="dropdown">\n                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"\n                       aria-expanded="false"><span class="glyphicon glyphicon-trash"></span> Delete<span class="caret"></span></a>\n                    <ul class="dropdown-menu">\n                        <li class="dropdown-submenu" ng-repeat="list in dashboard.lists">\n                            <a href="#" ng-click="dashboard.openDeleteListModal(list)">{{ list.title }}</a>\n                        </li>\n                    </ul>\n                </li>\n            </ul>\n            <ul class="nav navbar-nav navbar-right">\n                <li><a href="#" ng-click="dashboard.logOut()"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>\n            </ul>\n        </div><!-- /.navbar-collapse -->\n    </div><!-- /.container-fluid -->\n</nav>\n\n<div class="container">\n    <div class="row">\n        <div class="col-sm-6 col-md-4" ng-repeat="list in dashboard.lists">\n            <list list="list"></list>\n        </div>\n    </div>\n</div>');
    $templateCache.put('sections/login/loginView.html', '<div class="container">\n    <div class="page-header">\n        <h1>Todo\n            <small>just in case you forget</small>\n        </h1>\n    </div>\n    <div ng-show="login.error" class="alert alert-danger row">\n        <span>{{ login.error.message }}</span>\n    </div>\n\n    <form name="loginForm"\n          ng-submit="login.sumbit()"\n          style="margin-top:30px;">\n        <h3>Log In</h3>\n\n        <div class="form-group">\n            <input type="text"\n                   class="form-control"\n                   placeholder="Username"\n                   ng-model="login.user.username" required></input>\n        </div>\n        <div class="form-group">\n            <input type="password"\n                   class="form-control"\n                   placeholder="Password"\n                   ng-model="login.user.password" required></input>\n        </div>\n        <button type="submit" class="btn btn-primary" ng-disabled="loginForm.$invalid">Log In</button>\n        <a class="btn btn-default" href="#" ng-click="login.register()">Register</a>\n    </form>\n</div>\n');
    $templateCache.put('sections/register/registerView.html', '<div class="container">\n    <div class="page-header">\n        <h1>Todo\n            <small>just in case you forget</small>\n        </h1>\n    </div>\n\n    <div ng-show="register.error" class="alert alert-danger row">\n        <span>{{ register.error.message }}</span>\n    </div>\n\n    <form name="registerForm"\n          ng-submit="register.sumbit()"\n          style="margin-top:30px;">\n        <h3>Register</h3>\n\n        <div class="form-group">\n            <input type="text"\n                   class="form-control"\n                   placeholder="Username"\n                   ng-model="register.user.username" required></input>\n        </div>\n        <div class="form-group">\n            <input type="password"\n                   class="form-control"\n                   placeholder="Password"\n                   ng-model="register.user.password" required></input>\n        </div>\n        <button type="submit" class="btn btn-primary" ng-disabled="registerForm.$invalid">Register</button>\n    </form>\n</div>');
}]);
angular.module('app.services').factory('AuthService', ['$http', '$window', function ($http, $window) {
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
        return $http.post('/api/login', user).then(function (res) {
            auth.saveToken(res.data.token);
        }, function (res) {
            return res.data;
        });
    };

    auth.register = function (user) {
        return $http.post('/api/register', user).then(function (res) {
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
angular.module('app.services').factory('ListService', ['$http', 'AuthService', function ($http, AuthService) {
    var service = {
        lists: []
    };

    service.getAll = function () {
        return $http.get('/api/lists', {
            headers: { Authorization: 'Bearer ' + AuthService.getToken() }
        }).then(function (response) {
            // Copy list data to internal list & return it
            angular.copy(response.data, service.lists);
            return service.lists;
        });
    };

    service.addList = function (list) {
        return $http.post('/api/lists', list, {
            headers: { Authorization: 'Bearer ' + AuthService.getToken() }
        }).then(function (response) {
            // Add new list
            service.lists.push(response.data);
        });
    };

    service.deleteList = function (list) {
        return $http.delete('api/list/' + list._id, {
            headers: { Authorization: 'Bearer ' + AuthService.getToken() }
        }).then(function () {
            // Delete list from memory
            service.lists.splice(service.lists.indexOf(list), 1);
        });
    };

    service.addTask = function (list, task) {
        return $http.post('/api/list/' + list._id + '/tasks', task, {
            headers: { Authorization: 'Bearer ' + AuthService.getToken() }
        }).then(function (response) {
            // Push new task onto list
            list.tasks.push(response.data);
        });
    };

    service.toggle = function (task) {
        return $http.get('/api/list/' + task.list._id + '/task/' + task._id + '/toggle', {
            headers: { Authorization: 'Bearer ' + AuthService.getToken() }
        }).then(function () {
            // Toggle completion state of task
            task.completed ^= true;
        });
    };

    service.deleteTask = function (list, task) {
        return $http.delete('/api/list/' + list._id + '/task/' + task._id, {
            headers: { Authorization: 'Bearer ' + AuthService.getToken() }
        }).then(function () {
            // Remove deleted task from list
            list.tasks.splice(list.tasks.indexOf(task), 1);
        });
    };

    service.renameList = function (list) {
        return $http.put('api/list/' + list._id + '/rename', list, {
            headers: { Authorization: 'Bearer ' + AuthService.getToken() }
        }).then(function () {
            // Success
        });
    };

    return service;
}]);
angular.module('app.core').controller('DashboardController', function ($uibModal, $scope, $state, lists, ListService, AuthService) {
    var view = this;

    view.lists = lists;
    view.modal = null;

    view.openNewListModal = function () {
        console.log('Opening new list modal');
        view.modal = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'components/modal/newList.html',
            scope: $scope
        });
        view.modal.result.then(function (title) {
            console.log('Creating list ' + title);
            ListService.addList({ title: title });
        }, function () {
            console.log('Modal canceled');
        });
    };

    view.openDeleteListModal = function (list) {
        console.log('Opening delete list modal');
        view.modal = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'components/modal/deleteList.html',
            scope: $scope,
            controller: function controller($scope, title) {
                $scope.title = title;
            },
            resolve: {
                title: function title() {
                    return list.title;
                }
            }
        });
        view.modal.result.then(function () {
            console.log('Deleting list ' + list.title);
            ListService.deleteList(list);
        }, function () {
            console.log('Modal canceled');
        });
    };

    view.logOut = function () {
        console.log('Logging out');
        AuthService.logOut();
        $state.go('login');
    };
});
angular.module('app.core').controller('LoginController', function ($scope, $state, AuthService) {
    var view = this;

    view.user = {};

    view.sumbit = function () {
        AuthService.logIn(view.user).then(function (error) {
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
angular.module('app.core').controller('RegisterController', function ($scope, $state, AuthService) {
    var view = this;

    view.user = {};

    view.sumbit = function () {
        AuthService.register(view.user).then(function (error) {
            if (error !== undefined) {
                view.error = error;
            } else {
                $state.go('dashboard');
            }
        });
    };
});
angular.module('app.core').controller('ListController', ['$scope', 'ListService', function ($scope, ListService) {
    $scope.editing = false;
    var updateCount = function updateCount() {
        $scope.list.tasks.completed = $scope.list.tasks.filter(function (task) {
            return task.completed;
        }).length;
    };
    $scope.toggle = function (task) {
        console.log('Toggling task ' + task.name);
        ListService.toggle(task).then(function () {
            updateCount();
        });
    };
    $scope.deleteTask = function (task) {
        console.log('Removing task ' + task.name);
        ListService.deleteTask($scope.list, task).then(function () {
            updateCount();
        });
    };
    $scope.addTask = function () {
        if (!$scope.name || $scope.name === '') {
            return;
        } else {
            console.log('Adding new task ' + $scope.name);
            ListService.addTask($scope.list, {
                name: $scope.name
            });
            $scope.name = '';
        }
    };
    $scope.renameList = function () {
        if (!$scope.list.title || $scope.list.title === '') {
            return;
        } else {
            console.log('Renaming list to ' + $scope.list.title);
            ListService.renameList($scope.list);
            $scope.editing = false;
        }
    };
    updateCount();
}]);
angular.module('app.core').directive('list', function () {
    return {
        restrict: 'E',
        scope: {
            list: '='
        },
        templateUrl: 'components/list/listView.html',
        controller: 'ListController'
    };
});