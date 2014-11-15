(function() {
    'use strict';
    angular.module('relativeDate', ['pascalprecht.translate']).value('now', new Date()).filter('relativeDate', [
        'now', '$translate', function(now, $translate) {

            var filter = function(date) {
                var calculateDelta, day, delta, hour, minute, month, week, year;
                if (!(date instanceof Date)) {
                    date = new Date(date);
                }
                delta = null;
                minute = 60;
                hour = minute * 60;
                day = hour * 24;
                week = day * 7;
                month = day * 30;
                year = day * 365;
                calculateDelta = function() {
                    return delta = Math.round((now - date) / 1000);
                };
                calculateDelta();
                if (delta > day && delta < week) {
                    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                    calculateDelta();
                }
                switch (false) {
                    case !(delta < 30):
                        return $translate.instant('relativeDate.justNow');
                    case !(delta < minute):
                        return $translate.instant('relativeDate.secondsAgo', {value: delta});
                    case !(delta < 2 * minute):
                        return $translate.instant('relativeDate.minuteAgo');
                    case !(delta < hour):
                        return $translate.instant('relativeDate.minutesAgo', {value: (Math.floor(delta / minute))});
                    case Math.floor(delta / hour) !== 1:
                        return $translate.instant('relativeDate.hourAgo');
                    case !(delta < day):
                        return $translate.instant('relativeDate.hoursAgo', {value: (Math.floor(delta / hour))});
                    case !(delta < day * 2):
                        return $translate.instant('relativeDate.yesterday');
                    case !(delta < week):
                        return $translate.instant('relativeDate.daysAgo', {value: (Math.floor(delta / day))});
                    case Math.floor(delta / week) !== 1:
                        return $translate.instant('relativeDate.weekAgo');
                    case !(delta < month):
                        return $translate.instant('relativeDate.weeksAgo', {value: (Math.floor(delta / week))});
                    case Math.floor(delta / month) !== 1:
                        return $translate.instant('relativeDate.monthAgo');
                    case !(delta < year):
                        return $translate.instant('relativeDate.monthsAgo', {value: (Math.floor(delta / month))});
                    case Math.floor(delta / year) !== 1:
                        return $translate.instant('relativeDate.yearAgo');
                    default:
                        return $translate.instant('relativeDate.yearsAgo');
                }
            };

            // Since AngularJS 1.3, filters which are not stateless (depending at the scope)
            // have to explicit define this behavior
            filter.$stateful = true;

            return filter;
        }
    ]);

}).call(this);

/*
 //@ sourceMappingURL=angular-relative-date.js.map
 */