angular
    .module('app.core')
    .directive('listPanel', function () {
        return {
            restrict: 'E',
            scope: {
                list: '='
            },
            templateUrl: 'app/components/listpanel/listPanelView.html'
        };
    });