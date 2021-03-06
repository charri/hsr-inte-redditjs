var redditFilters = angular.module('redditFilters', []);

redditFilters.filter('domainName', [function() {
    return function(input) {
        var url = $.trim(input);
        var match = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i, "");
        return match ? match[1].replace('www.', '') : '';
    };
}]);


redditFilters.filter('recursiveCommentCount', [function() {
    var count = function (commentsArray) {

        if(!commentsArray || commentsArray.length == 0) return 0;

        var countValue = 0;

        angular.forEach(commentsArray, function(sub) {
            countValue += count(sub.comments);
        });

        return commentsArray.length + countValue;
    };

    return function(comments) {
        return count(comments);
    };
}]);

redditFilters.directive("passwordVerify", function() {
    return {
        require: "ngModel",
        scope: {
            passwordVerify: '='
        },
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(function() {
                var combined;

                if (scope.passwordVerify || ctrl.$viewValue) {
                    combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                }
                return combined;
            }, function(value) {
                if (value) {
                    ctrl.$parsers.unshift(function(viewValue) {
                        var origin = scope.passwordVerify;
                        if (origin !== viewValue) {
                            ctrl.$setValidity("passwordVerify", false);
                            return undefined;
                        } else {
                            ctrl.$setValidity("passwordVerify", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
});

redditFilters.directive("socketListen", ['Socket', function(Socket) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {

            if(!attrs.socketListen) return;

            var hasRegistered = false;

            var fn = function(value) {

                if(scope.comment) {
                    console.log('comment', scope.comment, value);
                    scope.comment.rating.value = value;
                } else {
                    scope.entry.rating.value = value;
                }
                //ngModel.$setViewValue(value);

            };

            scope.$watch(function() {
               return  attrs.socketListen;
            }, function(newValue) {

                // if the scope has not completely been loaded then we need to wait until the directive is invoke again.
                if(!newValue || newValue[newValue.length - 1] == ':' || hasRegistered) return;

                Socket.off(newValue, fn);
                Socket.on(newValue, fn);

                hasRegistered = true;

            });

        }
    };
}]);