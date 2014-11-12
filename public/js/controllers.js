var redditControllers = angular.module('redditControllers', []);

redditControllers.controller('EntryListCtrl', ['$scope', 'Entry', function($scope, Entry) {
    $scope.entries = Entry.query();

}]);

redditControllers.controller('EntryDetailCtrl', ['$scope', '$routeParams', 'Entry', function($scope, $routeParams, Entry) {
    $scope.entry = Entry.get({ id : $routeParams.entryId}, function(entry) {

    });


}]);