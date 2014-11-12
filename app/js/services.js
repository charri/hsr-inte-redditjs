var redditServices = angular.module('redditServices', ['ngResource']);



redditServices.service('Html', [function() {
    this.title = 'clone(Reddit)';
    this.setTitle = function(newTitle) { this.title = newTitle + ' - clone(Reddit)'; }
}]);


redditServices.factory('Entry', ['$resource', function($resource) {
    return $resource('/entry/:id', { id : '@id' }, {
        query: {method:'GET', isArray:true , url : '/entries'},
        up: { method : 'POST', url : '/entry/:id/up' },
        down: { method : 'POST', url : '/entry/:id/down' }
    });
}]);

redditServices.factory('User', ['$resource', function($resource) {
    return $resource('/entry/:id', { id : '@id' }, {
        query: {method:'GET', isArray:true , url : '/users'},
        save: { method : 'POST', url : '/register' }
    });
}]);

redditServices.factory("AuthService", ['$http', '$q', '$window',  function($http, $q, $window) {
    var userInfo = false;

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

    function hasUser() {
        return userInfo && userInfo.name;
    }

    function init() {
        if ($window.sessionStorage["userInfo"]) {
            userInfo = JSON.parse($window.sessionStorage["userInfo"]);
        }
    };

    return {
        init : init,
        login: login,
        logout : logout,
        getUserInfo : getUserInfo,
        hasUser : hasUser
    };
}]);

redditServices.factory('Socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});