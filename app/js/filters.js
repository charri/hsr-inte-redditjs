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