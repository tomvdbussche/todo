angular
    .module('app.core')
    .directive('list', function () {
        return {
            restrict: 'E',
            scope: {
                list: '='
            },
            templateUrl: 'components/list/listView.html',
            controller: 'ListController'
        };
    });