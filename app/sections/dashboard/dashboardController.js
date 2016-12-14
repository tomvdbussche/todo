angular
    .module('app.core')
    .controller('DashboardController', function ($uibModal, $scope, $state, lists, username, ListService, AuthService) {
        let view = this;

        view.lists = lists;
        view.username = username;

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
                ListService.addList({ title: title});
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
                controller: function ($scope, title) {
                    $scope.title = title;
                },
                resolve: {
                    title: function () {
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