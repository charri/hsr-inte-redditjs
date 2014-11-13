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

redditControllers.controller('EntryListCtrl', ['$scope', 'Entry', 'Html', 'Socket', function($scope, Entry, Html, Socket) {

    $scope.entries = Entry.query();

    Html.setTitle('home');

    Socket.on('add:entry', function(id) {
        $scope.entries.push(Entry.get({ id : id}));
    });

}]);

redditControllers.controller('EntryListListenerCtrl', ['$scope','Socket', function($scope, Socket) {

    $on.entryVote(Socket, $scope).entryComment(Socket, $scope);

}]);

var $on = {
    entryVote : function(Socket, $scope) {
        Socket.on(['up:entry:'+ $scope.entry.id,'down:entry:'+ $scope.entry.id], function(rating) {
            $scope.entry.rating.value = rating;
        });
        return $on;
    },
    entryComment : function(Socket, $scope) {
        Socket.on('add:comment:entry:' + $scope.entry.id, function(comment) {
            $scope.entry.comments.push(comment);
        });
        return $on;
    },
    commentComment : function(Socket, $scope) {
        Socket.on('add:comment:comment:' + $scope.comment.id, function(comment) {
            $scope.comment.comments.push(comment);
        });
        return $on;
    }
};

redditControllers.controller('EntryDetailListenerCtrl', ['$scope', 'Entry', 'Html', 'Socket', function($scope, Entry, Html, Socket) {

    $scope.entry.$promise.then(function() {
        $on.entryVote(Socket, $scope).entryComment(Socket, $scope);
    });

}]);

redditControllers.controller('CommentListCtrl', ['$scope', 'Comment', 'Socket', function($scope, Comment, Socket) {
    // $scope.comment inherited from parent controller
    // $scope.entry inherited from parent controller
    // using static method as $scope.comment is not wrapped in Comment
    $scope.$up = function() {
        $scope.comment = Comment.up({ }, $scope.comment);
    };

    $scope.$down = function() {
        $scope.comment = Comment.down({ }, $scope.comment);
    };

    Socket.on(['up:comment:'+ $scope.comment.id,'down:comment:'+ $scope.comment.id], function(rating) {
        $scope.comment.rating.value = rating;
    });

}]);

redditControllers.controller('CommentAddCtrl', ['$scope', 'Comment', function($scope, Comment) {
    // $scope.comment inherited from parent controller
    // $scope.entry inherited from parent controller

    $scope.addComment = new Comment();

    $scope.$save = function() {
        if($scope.comment) {
            $scope.addComment.$save({ parentId : $scope.comment.id, type : 'comment', action : '' });
            $scope.comment.comments.push($scope.addComment);
            $scope.comment.showAddComment = false;
        } else {
            $scope.addComment.$save({ parentId : $scope.entry.id, type : 'entry', action : 'comment' });
            $scope.entry.comments.push($scope.addComment);
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
            if(!result) return;

            AuthService.login($scope.user.name, $scope.user.password).then(function() {
                $location.path('/entries');
            });
        });
    };

}]);

redditControllers.controller('EntryDetailCtrl', ['$scope', '$routeParams', 'Entry', 'Html', 'Socket',
    function($scope, $routeParams, Entry, Html, Socket) {

    Socket.on('message', function(msg) {
        console.log(msg);
    });

    $scope.entry = Entry.get({ id : $routeParams.entryId}, function(entry) {

        Html.setTitle(entry.title);
        $on.entryVote(Socket, $scope).entryComment(Socket, $scope);

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