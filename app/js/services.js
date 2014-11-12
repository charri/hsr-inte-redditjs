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


redditServices.factory("AuthService", ['$http', '$q', '$window',  function($http, $q, $window) {
    var userInfo;

    function login(userName, password) {
        var deferred = $q.defer();

        $http.post("/login", {
            name: userName,
            password: password
        }).then(function(result) {
            if(!result.data) {
                deferred.reject(result.data);
                return;
            }
            userInfo = { name : userName };
            $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
            deferred.resolve(userInfo);
        }, function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    function logout() {
        var deferred = $q.defer();

        $http
        .post("/logout")
        .then(function(result) {
            $window.sessionStorage["userInfo"] = null;
            userInfo = null;
            deferred.resolve(result);
        }, function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    function getUserInfo() {
        return userInfo;
    };

    function init() {
        console.log('init');
        if ($window.sessionStorage["userInfo"]) {
            userInfo = JSON.parse($window.sessionStorage["userInfo"]);
        }
    };

    return {
        init : init,
        login: login,
        logout : logout,
        getUserInfo : getUserInfo
    };
}]);