angular
    .module('app.core')
    .controller('DashboardController', function ($scope, lists) {
        let view = this;

        view.lists = lists;
    });