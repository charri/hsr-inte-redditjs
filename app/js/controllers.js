var redditControllers = angular.module('redditControllers', []);

redditControllers.controller('HtmlHeadCtrl', ['$scope', 'Html', function($scope, Html) {

    $scope.$watch(function(){ return Html.title}, function(newVal) { $scope.title = newVal; });

}]);

redditControllers.controller('NavigationCtrl', ['$scope', '$location', function($scope, $location) {

    $scope.menuClass = function(page) {
        var current = $location.path().substring(1);
        return page === current ? "active" : "";
    };

}]);

redditControllers.controller('EntryListCtrl', ['$scope', 'Entry', 'Html', function($scope, Entry, Html) {

    $scope.entries = Entry.query();

    Html.setTitle('home');

}]);

redditControllers.controller('SubmitCtrl', ['$scope', 'Entry', 'Html', '$location', function($scope, Entry, Html, $location) {

    $scope.entry = new Entry();

    Html.setTitle('submit');

    $scope.$save = function() {
        $scope.entry.$save(function(entry) {
            $location.path('/entries/' + entry.id);
        });
    };

}]);

redditControllers.controller('RegisterCtrl', ['$scope', 'User', 'Html', '$location', 'AuthService',
    function($scope, User, Html, $location, AuthService) {

    $scope.user = new User();

    Html.setTitle('register');

    $scope.$save = function() {
        $scope.user.$save(function(result) {
            if(!result) return;

            AuthService.login($scope.user.name, $scope.user.password).then(function() {
                $location.path('/entries');
            });
        });
    };

}]);

redditControllers.controller('EntryDetailCtrl', ['$scope', '$routeParams', 'Entry', 'Html', function($scope, $routeParams, Entry, Html) {

    $scope.entry = Entry.get({ id : $routeParams.entryId}, function(entry) {

        Html.setTitle(entry.title);

    });

}]);

redditControllers.controller('UserLoginCtrl', ['$scope', 'AuthService', '$rootScope', function($scope, AuthService, $rootScope) {

    $rootScope.$watch('hasUser', function() {
        $scope.user = AuthService.userInfo;
        $scope.login = { name : undefined, password : undefined };
    });

    $scope.$watch(function(){ return AuthService.hasUser; }, function(newVal) { $rootScope.hasUser = newVal; });
    $scope.$watch(function(){ return AuthService.initComplete; }, function(newVal) { $rootScope.initAuth = newVal; });

    $scope._login = function() {
        AuthService.login($scope.login.name, $scope.login.password);
    };

    $scope._logout = AuthService.logout;

}]);