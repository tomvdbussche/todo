angular
    .module('app.core')
    .directive('listPanel', function () {
        return {
            restrict: 'E',
            scope: {
                list: '='
            },
            templateUrl: 'components/listpanel/listPanelView.html'
        };
    });