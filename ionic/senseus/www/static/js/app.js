var app = angular.module('senseus', ['ionic', 'ngCordova', 'senseus.controllers'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('firstTime', {
    url: '/firstTime',
    templateUrl: 'templates/firstTime.html'
  })
  .state('eventName', {
    url: '/eventName',
    templateUrl: 'templates/eventWorkflow.html'
  })
  .state('eventCalendar', {
    url: '/eventCalendar',
    templateUrl: 'templates/eventCalendar.html'
  })
  .state('eventLocation', {
    url: '/eventLocation',
    templateUrl: 'templates/eventLocation.html'
  })
  .state('eventInviteFriends', {
    url: '/eventInviteFriends',
    templateUrl: 'templates/eventInviteFriends.html'
  })
  .state('eventSave', {
    url: '/eventSave',
    templateUrl: 'templates/eventSave.html'
  })
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
    // Each tab has its own nav history stack:
  .state('tab.chatmessages', {
    url: '/chatmessages',
    views: {
      'tab-chatmessages': {
        templateUrl: 'templates/tab-chatmessages.html',
        controller: 'EventCTRL',
      }
    }
  }).state('tab.chats', {
    url: '/chats',
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-chats.html',
        controller: 'EventCTRL',
      }
    }
  }).state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'EventCTRL',
      }
    }
  }).state('tab.eventHome', {
    url: '/eventHome',
    views: {
      'tab-eventhome': {
        templateUrl: 'templates/tab-eventHome.html',
        controller: 'EventHomeCTRL',
      }
    }
  }).state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'EventCTRL',
      }
    }
  }).state('tab.calendar', {
    url: '/calendar',
    views: {
      'tab-calendar': {
        templateUrl: 'templates/tab-calendar.html',
        controller: 'EventCTRL',
      }
    }
  }).state('tab.contacts', {
    url: '/contacts',
    views: {
      'tab-contacts': {
        templateUrl: 'templates/tab-contacts.html',
        controller: 'EventCTRL',
      }
    }
  });
  $urlRouterProvider.otherwise('/firstTime');
})
.config(['$ionicConfigProvider', function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
}])
.factory('Data',function() {

    var locations = [], selectedIntervals = new Array(), eventName, eventDescription;

    var eventInfo = {
        locations: locations,
        eventName: eventName,
        eventDescription: eventDescription,
        selectedIntervals: selectedIntervals
    };

    var currentEvent = null;

    return {eventInfo: eventInfo};
})
