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
        save: { method : 'POST', url : '/register' },
        restore : {method:'GET', url : '/login' }
    });
}]);

redditServices.service("AuthService", ['$http', '$q', '$window', 'User',  function($http, $q, $window, User) {

    var self = this;

    this.userInfo = false;
    this.hasUser = false;
    this.initComplete = false;

    this.login = function(userName, password) {
        var deferred = $q.defer();

        $http.post("/login", {
            name: userName,
            password: password
        }).then(function(result) {
            if(!result.data) {
                deferred.reject(result.data);
                return;
            }
            setUser(userName);
            deferred.resolve(self.userInfo);
        }, function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    function setUser(userName) {
        if(userName == '') userName = undefined;

        if(userName) {
            self.userInfo = { name : userName };
            self.hasUser = true;
        }
        else {
            self.hasUser = false;
            self.userInfo = undefined;
        }
    }

    this.logout = function() {
        var deferred = $q.defer();

        $http
        .post("/logout")
        .then(function(result) {
            setUser();
            deferred.resolve(result);
        }, function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    User.restore().$promise.then(function(user) {
        setUser(user[0]); // as accessing promise
        self.initComplete = true;
    }, function() {
        self.initComplete = true;
    });

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