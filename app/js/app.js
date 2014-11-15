var redditApp = angular.module('redditApp', ['ngRoute', 'ngAnimate', 'relativeDate', 'redditControllers', 'redditServices', 'redditFilters', 'pascalprecht.translate']);

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
            .when('/login', {
                templateUrl : 'partials/login.html',
                controller : 'UserLoginCtrl'
            })
            .otherwise({
                redirectTo: '/entries'
            });

    }
]);


redditApp.config(['$translateProvider', function ($translateProvider) {
    // if time: define async loader for translateProvider and load separate translation file for each locale.
    $translateProvider.translations('en-us', {
        Login : 'Login',
        Logout : 'Logout',
        Register : 'Register',
        Username : 'Username',
        Password : 'Password',
        PasswordRepeat : 'Repeat password',
        Home : 'Home',
        Submit : 'Submit',
        Hello : 'Hello',
        comments : 'comment(s)',
        CommentTitle : 'Comments',
        submitted : 'submitted',
        by : 'by',
        errorTitle : 'Ohh Snap!',
        errorLogin: 'Looks like your username or password is wrong.',
        errorExists : 'Looks like that username is already taken.',
        errorPasswordVerify : 'Passwords must match.',
        notAMember : 'Not a member?',
        registerNow : 'Register now - it\'ll only take a second!',
        registerMessage : 'Become an awesome member of clone(Reddit)!',
        AddComment : 'Add Comment',
        CommentPlaceholder : 'Enter your comment here.',
        CommentInfo : 'Content that violates any copyrights will be deleted. Text submitted must conform to the Terms and Conditions of this site.',
        submit : {
            newLink : 'Submit a new link',
            newLinkSmall : 'The community is waiting for it!',
            Title : 'Title',
            TitlePlaceholder : 'Awesome title!',
            Link : 'Link',
            LinkPlaceholder : 'http://',
            LinkValidation : 'Must be in the form of http://example.com'
        },
        relativeDate : {
            justNow : 'just now',
            secondsAgo : '{{value}} seconds ago',
            minuteAgo : 'a minute ago',
            minutesAgo : '{{value}} minutes ago',
            hourAgo : 'an hour ago',
            hoursAgo : '{{value}} hours ago',
            yesterday : 'yesterday',
            daysAgo : '{{value}} days ago',
            weekAgo : 'a week ago',
            weeksAgo : '{{value}} weeks ago',
            monthAgo : 'a month ago',
            monthsAgo : '{{value}} months ago',
            yearAgo : 'a year ago',
            yearsAgo : 'over a year ago'
        },
        snack : {
            newEntry : 'A new entry has just been added! Check it out <a href="entries/{{id}}">here</a>',
            newComment : 'Someone else just commented on your entry! Check it out <a href="entries/{{id}}">here</a>',
            newVoteEntry : 'Your entry was just voted on! Check it out <a href="entries/{{id}}">here</a>',
            newVoteComment : 'Your comment was just voted on!'
        }
    });
    $translateProvider.translations('de-ch', {
        Login : 'Einloggen',
        Logout : 'Ausloggen',
        Register : 'Registrieren',
        Username : 'Benutzer',
        Password : 'Passwort',
        PasswordRepeat : 'Passwort wiederholden',
        Home : 'Home',
        Submit : 'Einreichen',
        Hello : 'Hallo',
        comments : 'Kommentar(e)',
        CommentTitle : 'Kommentare',
        submitted : 'eingereicht',
        by : 'von',
        errorTitle : 'Uhh ohh!',
        errorLogin: 'Sieht aus, als wäre dein Benutzername oder Passwort falsch.',
        errorExists : 'Benutzername ist bereits registriert.',
        errorPasswordVerify : 'Passwörter müssen übereinstimmen.',
        notAMember : 'Noch kein Member?',
        registerNow : 'Registrieren Sie sich in nur wenigen Sekunden.',
        registerMessage : 'Werde Member von clone(Reddit)!',
        AddComment : 'Kommentar abgeben',
        CommentPlaceholder : 'Geben Sie ihre Kommentar hier ein.',
        CommentInfo : 'Inhalte, die Urheberrechte verletzen werden gelöscht. Eingereichte Inhalte müssen den Geschäftsbedingungen dieser Website entsprechen.',
        submit : {
            newLink : 'Neuer Link einreichen',
            newLinkSmall : 'Die Community wartet darauf!',
            Title : 'Überschrift',
            TitlePlaceholder : 'Fantastische Überschrift!',
            Link : 'Url',
            LinkPlaceholder : 'http://',
            LinkValidation : 'Muss folgende Muster aufweisen: http://example.com'
        },
        relativeDate : {
            justNow : 'gerade eben',
            secondsAgo : 'vor {{value}} Sekunden',
            minuteAgo : 'vor eine Minute',
            minutesAgo : 'vor {{value}} Minuten',
            hourAgo : 'vor einer Stunde',
            hoursAgo : 'vor {{value}} Stunden',
            yesterday : 'gestern',
            daysAgo : 'vor {{value}} Tagen',
            weekAgo : 'vor einer Woche',
            weeksAgo : 'vor {{value}} Wochen',
            monthAgo : 'vor einem Monat',
            monthsAgo : 'vor {{value}} Monaten',
            yearAgo : 'vor einem Jahr',
            yearsAgo : 'vor über einem Jahr'
        },
        snack : {
            newEntry : 'Ein neuer Beitrag wurde hinzugefügt! Schauen Sie sichs an <a href="entries/{{id}}">hier</a>',
            newComment : 'Jdn hat ihr Beitrag kommentiert! Schauen Sie sichs an  <a href="entries/{{id}}">hier</a>',
            newVoteEntry : 'Ihr Beitrag wurde soeben bewertet! Schauen Sie sichs an  <a href="entries/{{id}}">hier</a>',
            newVoteComment : 'Ihre Kommentar wurde soeben bewertet'
        }
    });
    $translateProvider.preferredLanguage('en-us');
}]);
