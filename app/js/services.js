var redditServices = angular.module('redditServices', ['ngResource']);



redditServices.service('Html', [function() {
    this.title = 'clone(Reddit)';
    this.setTitle = function(newTitle) { this.title = newTitle + ' - clone(Reddit)'; }
}]);


redditServices.factory('Entry', ['$resource', function($resource) {
    return $resource('/entry/:id', {}, {
        query: {method:'GET', params:{id:''}, isArray:true}
    });
}]);

