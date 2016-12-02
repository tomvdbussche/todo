angular
    .module('app.core')
    .directive('list', function () {
        var directive = {
            controller: controller,
            templateUrl: 'app/shared/list/listView.html'
        }
    })