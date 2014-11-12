var redditServices = angular.module('redditServices', ['ngResource']);

redditServices.factory('Entry', ['$resource', function($resource) {
    return $resource('/entries/:id', {}, {
        query: {method:'GET', params:{id:''}, isArray:true}
    });
}]);

