var redditControllers = angular.module('redditControllers', []);

redditControllers.controller('HtmlHeadCtrl', ['$scope', 'Html', function($scope, Html) {
    $scope.title = Html.title;
    $scope.$watch(function(){ return Html.title}, function(newVal) { $scope.title = newVal; });

}]);

redditControllers.controller('NavigationCtrl', ['$scope', '$location', function($scope, $location) {

    $scope.menuClass = function(page) {
        var current = $location.path().substring(1);
        return page === current ? "active" : "";
    };

}]);

redditControllers.controller('EntryListCtrl', ['$scope', 'Entry', 'Html', '$rootScope', function($scope, Entry, Html, $rootScope) {


    $scope.entries = Entry.query();

    $scope._voteUp = function(entry) {
        console.log(['voteUp', entry]);
        Entry.up({ id : entry.id }, function(data) {
            console.log(['returned data ', data])
        })
    };

    $scope._voteDown = function(entry) {
        console.log(['voteDown', entry]);
        Entry.down({ id : entry.id }, function(data) {
            console.log(['returned data ', data])
        })
    };

    $scope._canVote = function(entry) {
        return $rootScope.hasUser; // TODO: check if user has already voted
    };

    Html.setTitle('home');

}]);

redditControllers.controller('EntryDetailCtrl', ['$scope', '$routeParams', 'Entry', 'Html', function($scope, $routeParams, Entry, Html) {

    $scope.entry = Entry.get({ id : $routeParams.entryId}, function(entry) {

        Html.setTitle(entry.title);

    });


}]);

redditControllers.controller('UserLoginCtrl', ['$scope', 'AuthService', '$rootScope', function($scope, AuthService, $rootScope) {

    var _resolveUser = function() {
        $rootScope.hasUser = AuthService.hasUser();
        $scope.user = $scope.hasUser ? AuthService.getUserInfo() : undefined;
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