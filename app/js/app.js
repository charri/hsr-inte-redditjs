var redditApp = angular.module('redditApp', ['ngRoute', 'relativeDate', 'redditControllers', 'redditServices']);

redditApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/entries', {
                templateUrl: 'partials/entry-list.html',
                controller: 'EntryListCtrl'
            }).
            when('/entries/:entryId', {
                templateUrl: 'partials/entry-detail.html',
                controller: 'EntryDetailCtrl'
            })
            .when('/submit', {
                templateUrl : 'partials/submit.html',
                controller : 'SubmitCtrl'
            })
            .when('/register', {
                templateUrl : 'partials/register.html',
                controller : 'RegisterCtrl'
            })
            .otherwise({
                redirectTo: '/entries'
            });

    }
]);

redditApp.run(['AuthService', function(AuthService) {
    AuthService.init();
}]);