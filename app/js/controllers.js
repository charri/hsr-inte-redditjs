var redditControllers = angular.module('redditControllers', []);

redditControllers.controller('HtmlHeadCtrl', ['$scope', 'Html', function($scope, Html) {
    $scope.title = Html.title;
    $scope.$watch(function(){ return Html.title}, function(newVal) { $scope.title = newVal; });

}]);

redditControllers.controller('NavigationCtrl', ['$scope', '$location', function($scope, $location) {

    $scope.menuClass = function(page) {
        var current = $location.path().substring(1);
        console.log(current);
        return page === current ? "active" : "";
    };

}]);

redditControllers.controller('EntryListCtrl', ['$scope', 'Entry', 'Html', function($scope, Entry, Html) {
    $scope.entries = Entry.query();

    Html.setTitle('home');

}]);

redditControllers.controller('EntryDetailCtrl', ['$scope', '$routeParams', 'Entry', 'Html', function($scope, $routeParams, Entry, Html) {
    $scope.entry = Entry.get({ id : $routeParams.entryId}, function(entry) {

        Html.setTitle(entry.title);

    });


}]);

redditControllers.controller('UserLoginCtrl', ['$scope', 'AuthService', '$q', function($scope, AuthService, $q) {

    AuthService.init();

    var _resolveUser = function() {
        var userInfo = AuthService.getUserInfo();
        $scope.hasUser = userInfo && userInfo.name;
        $scope.user = $scope.hasUser ? userInfo : undefined;
        $scope.login = { name : undefined, password : undefined };
    }

    _resolveUser();

    $scope._login = function() {
        AuthService.login($scope.login.name, $scope.login.password).then(_resolveUser);
    };

    $scope._logout = function() {
        AuthService.logout().then(_resolveUser);
    };

}]);