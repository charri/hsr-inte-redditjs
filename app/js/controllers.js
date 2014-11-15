var redditControllers = angular.module('redditControllers', ['tmh.dynamicLocale']);

redditControllers.config(['tmhDynamicLocaleProvider', function(tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('libs/angular-1.3.2/i18n/angular-locale_{{locale}}.js');
}]);

redditControllers.controller('HtmlHeadCtrl', ['$scope', 'Html', function($scope, Html) {

    $scope.$watch(function(){ return Html.title}, function(newVal) { $scope.title = newVal; });

}]);

redditControllers.controller('NavigationCtrl', ['$scope', '$location', function($scope, $location) {

    $scope.menuClass = function(page) {
        var current = $location.path().substring(1);
        return page === current ? "active" : "";
    };

}]);

redditControllers.controller('LocaleCtrl', ['$scope', '$rootScope', 'tmhDynamicLocale', '$translate',
    function($scope, $rootScope, tmhDynamicLocale, $translate) {

    $scope.locales = [ { value : 'de-ch', label : 'Deutsch (Schweiz)' }, { value : 'en-us', label : 'English (US)' }];

    $scope.locale = $scope.locales[1];

    $scope.$watch('locale', function() {
        tmhDynamicLocale.set($scope.locale.value);
        $translate.use($scope.locale.value);
    });

}]);

redditControllers.controller('EntryListCtrl', ['$scope', 'Entry', 'Html', 'Snackbar', 'AuthService', '$translate', 'Socket',
    function($scope, Entry, Html, Snackbar, AuthService, $translate, Socket) {

    $scope.entries = Entry.query();

    Html.setTitle('home');


    Socket.on('add:entry', function(id) {
        $scope.entries.push(Entry.get({ id : id}, function(entry) {
            if(AuthService.hasUser
                && entry.author != AuthService.userInfo.name) {
                Snackbar.snack($translate.instant('snack.newEntry', { id : entry.id }));
            }
        }));
    });

}]);

redditControllers.controller('EntryListListenerCtrl', ['$scope','Socket', 'AuthService', 'Snackbar', '$translate', 'Entry',
    function($scope, Socket, AuthService, Snackbar, $translate, Entry) {


    $scope.$watch('entry.rating.value', function(newValue, oldValue) {
        if(newValue == oldValue) return;

        if(AuthService.hasUser && $scope.entry.author == AuthService.userInfo.name) {
            Snackbar.snack($translate.instant('snack.newVoteEntry', { id :  $scope.entry.id }));
        }
    });

    Socket.on('add:comment:entry:' + $scope.entry.id, function(comment) {
        $scope.entry.comments.push(comment);

        if(AuthService.hasUser
            && $scope.entry.author == AuthService.userInfo.name
            && comment.author != AuthService.userInfo.name
            ) {
            Snackbar.snack($translate.instant('snack.newComment', { id :  $scope.entry.id }));
        }
    });

}]);

redditControllers.controller('CommentListCtrl', ['$scope', 'Comment', 'Socket', '$q', 'AuthService', 'Snackbar', '$translate',
    function($scope, Comment, Socket, $q, AuthService, Snackbar, $translate) {
    // $scope.comment inherited from parent controller
    // $scope.entry inherited from parent controller
    // using static method as $scope.comment is not wrapped in Comment

    var local = false;
    $scope.$up = function() { local = true;
        $scope.comment = Comment.up({ }, $scope.comment);
    };

    $scope.$down = function() { local = true;
        $scope.comment = Comment.down({ }, $scope.comment);
    };

    $scope.$watch('comment.rating.value', function(oldValue, newValue) {
        if(oldValue == newValue || local) {
            local = false;
            return;
        }

        if(AuthService.hasUser && $scope.comment.author == AuthService.userInfo.name) {
            Snackbar.snack($translate.instant('snack.newVoteComment'));
        }
    });

    Socket.on('add:comment:comment:' + $scope.comment.id, function(comment) {
        $scope.comment.comments.push(comment);
    });

}]);

redditControllers.controller('CommentAddCtrl', ['$scope', 'Comment', function($scope, Comment) {
    // $scope.comment inherited from parent controller
    // $scope.entry inherited from parent controller

    $scope.addComment = new Comment();

    $scope.$save = function() {
        if($scope.comment) {
            $scope.addComment.$save({ parentId : $scope.comment.id, type : 'comment', action : '' });
            $scope.comment.showAddComment = false;
        } else {
            $scope.addComment.$save({ parentId : $scope.entry.id, type : 'entry', action : 'comment' });
            $scope.entry.showAddComment = false;
        }
        $scope.addComment = new Comment();
    };

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
            $scope.nameExists = false;
            AuthService.login($scope.user.name, $scope.user.password).then(function() {
                $location.path('/entries');
            });
        }, function() {
            $scope.nameExists = true;
        });
    };

}]);

redditControllers.controller('EntryDetailCtrl', ['$scope', '$routeParams', 'Entry', 'Html', 'AuthService', 'Snackbar', '$translate', 'Socket',
    function($scope, $routeParams, Entry, Html, AuthService, Snackbar, $translate, Socket) {


    $scope.entry = Entry.get({ id : $routeParams.entryId}, function(entry) {

        Html.setTitle(entry.title);

        $scope.$watch('entry.rating.value', function(oldValue, newValue) {
            if(oldValue == newValue) return;

            if(AuthService.hasUser && $scope.entry.author == AuthService.userInfo.name) {
                Snackbar.snack($translate.instant('snack.newVoteEntry', { id :  $scope.entry.id }));
            }
        });

        Socket.on('add:comment:entry:' + entry.id, function(comment) {
            $scope.entry.comments.push(comment);

            if(AuthService.hasUser
                && $scope.entry.author == AuthService.userInfo.name
                && comment.author != AuthService.userInfo.name
                ) {
                Snackbar.snack($translate.instant('snack.newComment', { id :  $scope.entry.id }));
            }
        });

    });

}]);

redditControllers.controller('UserLoginBarCtrl', ['$scope', 'AuthService', '$rootScope', '$location',
    function($scope, AuthService, $rootScope, $location) {

    $rootScope.$watch('hasUser', function() {
        $scope.user = AuthService.userInfo;
        $scope.login = { name : undefined, password : undefined };
    });

    $rootScope.$on('$locationChangeSuccess', function() {
        $scope.show = $location.path().indexOf('login') == -1 && $location.path().indexOf('register') == -1;
    });

    $scope.$watch(function(){ return AuthService.hasUser; }, function(newVal) { $rootScope.hasUser = newVal; });
    $scope.$watch(function(){ return AuthService.initComplete; }, function(newVal) { $rootScope.initAuth = newVal; });

    $scope._login = function() {
        AuthService.login($scope.login.name, $scope.login.password).then(function(a) {

        }, function(e) {
            $rootScope.hasUserError = true;
            $rootScope.login = $scope.login; // pass values
            $location.path('/login');

        });
    };

    $scope._logout = AuthService.logout;

}]);

redditControllers.controller('UserLoginCtrl', ['$scope', 'AuthService', '$rootScope', '$location', 'Html',
    function($scope, AuthService, $rootScope, $location, Html) {

    Html.setTitle('login');

    $scope._login = function() {
        AuthService.login($scope.login.name, $scope.login.password).then(function(a) {
            $location.path('/entries');
        }, function(e) {
            $rootScope.hasUserError = true;
        });
    };


}]);