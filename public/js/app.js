var redditApp = angular.module('redditApp', ['ngRoute', 'redditControllers', 'redditServices']);

redditApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true)
        $routeProvider
            .when('/entries', {
                templateUrl: 'partials/entry-list.html',
                controller: 'EntryListCtrl'
            }).
            when('/entries/:entryId', {
                templateUrl: 'partials/entry-detail.html',
                controller: 'EntryDetailCtrl'
            }).
            otherwise({
                redirectTo: '/entries'
            });

    }
]);