angular.module('senseus.controllers', ["ui.bootstrap.modal"])
.controller('CreateEventInviteCTRL', function ($scope, $location, Data, $ionicSlideBoxDelegate) {
  $scope.eventInfo.invitedFriends = {};
  //$modal.open({backdrop: 'static'});
  $scope.allFriends = [];
  sqlite.transaction(function(txn) {
    txn.executeSql('SELECT name FROM friends', null, function (txn, resultSet) {
      var rows = resultSet.rows;
      for (var i = 0; i < rows.length; i++) {
          var row = rows.item(i);
          $scope.allFriends.push(
            {name: row.name}
          );
          $scope.eventInfo.invitedFriends[row.name] = false;
      }
    }, function (txn, error) {
        console.log('Select error.', error);
    });
  });

  /*$scope.addFriend = function() {
    if ($scope.invitedFriends.indexOf($scope.newInvite) === -1) {
      console.log($scope.newInvite);
      $scope.invitedFriends.push($scope.newInvite);
      localStorage.setItem("guests", JSON.stringify($scope.invitedFriends));
    }
  }*/

  $scope.openFriends = function() {
    console.log("Trying to open friends");
    $scope.showModal = true;
    console.log("showModal is " + $scope.showModal);
  };

  $scope.inviteFriends = function() {
    console.log("Inviting Friends");
    console.log($scope.eventInfo.invitedFriends);
    /*
    if ($scope.invitedFriends.indexOf($scope.newInvite) === -1) {
      console.log($scope.newInvite);
      $scope.invitedFriends.push($scope.newInvite);
      localStorage.setItem("guests", JSON.stringify($scope.invitedFriends));
    }
    
    for (var friendName in $scope.newInvites) {
      $scope.eventInfo.invitedFriends
    }*/
    $scope.showModal = false;
  };

  $scope.closeFriends = function() {
    console.log("Closing Friends");
    $scope.showModal = false;
    console.log("showModal is " + $scope.showModal);
  };
})
.controller('CreateEventLocationCTRL', function ($scope, $location, Data ,$ionicSlideBoxDelegate) {

    $scope.initLocation = function(eventInfo) {
        initialize(eventInfo);
        $scope.eventInfo = Data.eventInfo;
    }

    $scope.getLocations = function() {
        var to_return = "TBD";
        if(Data.eventInfo.locations.length > 0) {
            to_return = Data.eventInfo.locations[0]['formatted_address'];
        }
        return to_return;
    }

})
.controller('CreateEventCalendarCTRL', function ($scope, $location, Data ,$ionicSlideBoxDelegate) {

    localStorage.setItem("offset", "0");

    $scope.changeTimeView = function(increment) {
      console.log("Adding " + increment); 
      if (increment) {
        localStorage.setItem("offset", parseInt(localStorage.getItem('offset')) + increment);
        $scope.initHeader();
      }
    }

    $scope.initHeader = function() {
      var allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      for (var i = 0; i < allDays.length; i++) {
        $scope[allDays[i]] = allDays[i].slice(0,3) + " - " + moment().add(parseInt(localStorage.getItem('offset')), 'week').startOf('week').add(i, 'day').format("MM/DD");
      }
    }

    $scope.initCalendar = function() {
        $scope.hoursAMPM = $scope.getHours('ha');
        $scope.hours = $scope.getHours('H');
        $scope.daysOfWeek = _.range(7);
        $scope.timeBlocks = [];
    }

    $scope.findWithAttr = function(array, attr, value) {
      for(var i = 0; i < array.length; i++) {
        if(array[i][attr] === value) {
          return i;
        }
      }
    }

    $scope.realClickedTimeDiv = function(hour, day) {
      /* Your Client ID can be retrieved from your project in the Google
      // Developer Console, https://console.developers.google.com
      var CLIENT_ID = '58429584872-hp17pnr5idbuct11mb2o59sjvvf2sscl.apps.googleusercontent.com';

      var SCOPES = ["https://www.googleapis.com/auth/calendar"];

      /**
       * Check if current user has authorized this application.
       /
      function checkAuth() {
        gapi.auth.authorize(
          {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
          }, handleAuthResult);
      }

      /**
       * Handle response from authorization server.
       *
       * @param {Object} authResult Authorization result.
       /
      function handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          console.log('woo hoo!');
          loadCalendarApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          console.log("error buddy");
        }
      }

      /**
       * Initiate auth flow in response to user clicking authorize button.
       *
       * @param {Event} event Button click event.
       /
      function handleAuthClick(event) {
        gapi.auth.authorize(
          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
      }

      /**
       * Load Google Calendar client library. List upcoming events
       * once client library is loaded.
       /
      function loadCalendarApi() {
        gapi.client.load('calendar', 'v3', InsertEvent);
      }

      //checkAuth();
      handleAuthClick();
      */
        indexOfTime = $scope.findWithAttr($scope.timeBlocks, 'timeString', hour+day);
        if (indexOfTime > -1) {
          $scope.timeBlocks.splice(indexOfTime, 1);
        }
        else {
          InsertTime();
        }
        console.log($scope.timeBlocks);
        function InsertTime() {
          $scope.timeBlocks.push({
            'timeString': hour+day,
            'start': {
              'dateTime': moment().add(parseInt(localStorage.getItem('offset')), 'week').startOf('week').add(day, 'day').add(hour, 'hour').format(),
              'timeZone': 'America/New_York'
            },
            'end': {
              'dateTime': moment().add(parseInt(localStorage.getItem('offset')), 'week').startOf('week').add(day, 'day').add(hour, 'hour').add(1, 'hour').format(),
              'timeZone': 'America/New_York'
            }
          });

          if(typeof(Storage) !== "undefined") {
            localStorage.setItem("timeBlocks", JSON.stringify($scope.timeBlocks));
          } else {
            console.log("Sorry! No Web Storage support...");
          }
/*
            console.log(gapi.client);
            var request = gapi.client.calendar.events.insert({
              'calendarId': '74ms0rnbv771ab0903rng5egvo@group.calendar.google.com',
              'resource': $scope.event
            });

            request.execute(function(event) {
              console.log($scope.event);
            });    
            */        
        }
        console.log("Clicked Time: "+hour+" "+day);
    }

    $scope.clickedTimeDiv = function($event) {

        if($scope.startedInterval) {
            var intervalStart = $scope.intervalStart;
            var intervalEnd = $($event.target).find('span')[0].innerHTML.split(',');
            var col = parseInt(intervalEnd[0]), row = parseInt(intervalEnd[1]);
            var oldCol = intervalStart[0], oldRow = intervalStart[1];
            var start, end;
            if (oldCol * 100 + oldRow < col*100 + row) {
                start = [oldCol, oldRow];
                end = [col, row];
            } else {
                end = [oldCol, oldRow];
                start = [col, row];
            }

            for(var i=start[0];i<=end[0];i++) {
                var j = (i == start[0] ? start[1] : 0);
                var k = (i==end[0] ? end[1] : 47);
                while(j <= k) {
                    $('.column'+i+'.row'+j).parent().toggleClass('highlight-halfhour');
                    j+= 1;

                }
            }
            console.log(intervalStart, intervalEnd);
            var startTime = intervalStart[2];
            var endTime = parseInt(intervalEnd[2]);
            Data.eventInfo.selectedIntervals.push([Math.min(endTime, startTime), Math.max(endTime, startTime)]);
            console.log(Data.eventInfo.selectedIntervals);
            console.log("Started!");
            $scope.startedInterval = false;
            $scope.intervalStart = null;

        } else {
            $scope.startedInterval = true;
            $scope.intervalStart = _.map($($event.target).find('span')[0].innerHTML.split(','), function(str) {return parseInt(str);});
            console.log("Not Started");
            console.log($scope.intervalStart);

        }
        $event.target.style.background="green";

        console.log($($event.target).find('span')[0].innerHTML);
    }


    $scope.warn = function (message) {
      alert(message);
    };

    $scope.getHours = function(format) {
        var startTime = moment().add(parseInt(localStorage.getItem('offset')), 'week').startOf('day');
        var returnable = [];
            for(var i=0;i<24;i++) {
                returnable.push(startTime.format(format));
                startTime.add(1, 'hour');
        }

        return returnable;
    }

    $scope.getHalfHours = function(day) {
        var startTime = moment().add(parseInt(localStorage.getItem('offset')), 'week').startOf('day').add(day, 'days');
        var returnable = [];
        for(var i=0;i<48;i++) {
            returnable.push(startTime.unix());
            startTime.add(30, 'minutes');
        }
        return returnable;
    }

    $scope.getDays = function() {
        return _.object( _.range(7), moment.weekdays());
    }

})
.controller('CreateEventCTRL', function ($scope, $location, Data ,$ionicSlideBoxDelegate, $state) {

    $scope.disableSwipe = function() {
       $ionicSlideBoxDelegate.enableSlide(false);
    };
    $scope.nextSlide = function() {
    if($ionicSlideBoxDelegate.currentIndex() == 3)
        $state.go('eventSave');
    else
        $ionicSlideBoxDelegate.next();
    }

    $scope.previousSlide = function() {
    if($ionicSlideBoxDelegate.currentIndex() == 0)
        $state.go('tab.home');
    else
        $ionicSlideBoxDelegate.previous();
    }
    $scope.startedInterval = false;
    $scope.intervalStart = null;
    $scope.eventInfo = Data.eventInfo;

    $scope.eventChoice = 'public';
    $scope.locationSharing = true;

    $scope.getDates = function() {
        var to_return = "";
        var times = JSON.parse(localStorage.getItem('timeBlocks'));
        if (times) {
          for (var i = 0; i < times.length; i++) {
            var start = moment(times[i].start.dateTime);
            var end = moment(times[i].end.dateTime);
            to_return += i+1 + ")  " + start.format('MMM D ha') + ' -- ' + end.format('MMM D ha') + "  ";
          }
        }
        if (to_return === "") {
          to_return = "TBD";
        }
        return to_return;
    }

    $scope.getGuests = function() {
      var to_return = "";
      var guests = JSON.parse(localStorage.getItem("guests"));
      if (guests) {
        for (var i = 0; i < guests.length; i++) {
          var guestName = guests[i].name;
          to_return += i+1 + ")  " + guestName + "  ";
        }
        if (to_return === "") {
          to_return = "TBD";
        }
        return to_return;
      }
    }

    $scope.createEvent = function() {
        var eventInfo = {
            create_date: moment.utc(),
            eventName: $scope.eventInfo.eventName,
            eventDescription: $scope.eventInfo.eventDescription,
            locations: Data.eventInfo.locations,
            times: Data.eventInfo.selectedIntervals,
            locationSharing: $scope.locationSharing,
            eventType: $scope.eventChoice,
            invitedFriends: $scope.eventInfo.invitedFriends
        };

        var eventParams = {'event_info': JSON.stringify(eventInfo),
                           'senseus_id': getUserId(),
                           'user_name': getUserName()};
        $.post(create_event_url, eventParams, function(data) {
            console.log(data);
            $state.go('tab.eventHome');
        });
    }

})
.controller('ChatCTRL', function ($scope, $location, Data, $ionicSlideBoxDelegate, $ionicHistory, $state) {
    $scope.chatMessagesRight = function() {
        $ionicSlideBoxDelegate.next();
    }

    $scope.chats = [{
        name: "CMU",
        preview: "Something nerdy is afoot...",
        lastMessageDate: moment().format('MMM D h:m a'),
        image: "static/profile_images/cmu.svg"
    },
    {
        name: "UMich",
        preview: "Something footbal related...",
        lastMessageDate: moment().subtract(1, 'day').format('MMM D h:m a'),
        image: "static/profile_images/umich.gif"

    }];

    $scope.selectChat = function(chatId) {
        Data.chatName = $scope.chats[chatId]['name'];
        console.log(Data.chatName);
        $state.go('tab.chatmessages');
    }
})
.controller('ChatMessagesCTRL', function($scope, $location, $state, Data) {

    $scope.init = function() {
        $scope.chatName = Data.chatName;
    }

    $scope.chatMessages = [{image:"static/profile_images/sravan_profile.jpg" , message: "The first message!"},
                     {image: "static/profile_images/derrick_profile.jpg" , message:  "What up??"},
                     {image: "static/profile_images/tim_profile.jpg" , message: "Chillin."}];


})
.controller('ContactsCTRL', function($scope, $location, $state, Data) {

    $scope.contacts = [{image:"static/profile_images/sravan_profile.jpg" , name: "Sravan Vankina"},
                     {image: "static/profile_images/derrick_profile.jpg" , name:  "Derrick Yu"},
                     {image: "static/profile_images/tim_profile.jpg" , name: "Zeb Girouard"}];


})
.controller('EventHomeCTRL', function ($scope, $location, Data, $ionicSlideBoxDelegate, $ionicHistory) {
    $scope.init = function(eventId) {
        var params = {event_id: eventId, senseus_id: 10};
        $.getJSON(events_url, params, function(result) {
            Data.currentEvent = JSON.parse(result[2]);
            console.log(Data.currentEvent);
            $scope.eventInfo = Data.currentEvent;
            var arr = Data.currentEvent.times[0];
            var start = moment(arr[0]);
            var end = moment(arr[1]);
            $scope.dates =  start.format("MMM Do h:mm a") +" - " + end.format("MMM Do h:mm a");
            $scope.locationName = Data.currentEvent.locations[0]['formatted_address'];
        });

    };


})
.controller('EventCTRL', function ($scope, $location, Data, $ionicSlideBoxDelegate, $ionicHistory) {
    $scope.events = [{image:"static/profile_images/sravan_profile.jpg" , event: "The first event that you were invited to."},
                     {image: "static/profile_images/derrick_profile.jpg" , event:  "The second event that your friend created."},
                     {image: "static/profile_images/tim_profile.jpg" , event: "Third randomish event in your area."}];

    $scope.user = {email: 'spvankina@gmail.com'};

    $scope.goBack = function() {
        $ionicHistory.goBack();
    }

    $scope.profileInit = function() {
        profileFunction();
        document.getElementById('profile-image').src = 'static/profile_images/sravan_profile.jpg';
    }

    $scope.eventContacts = function($scope, $location) {
        generateAutocompletion('#google-invite-input');
    }

})
.controller('LoginController', function($scope, $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/loginModal.html', {
        scope: $scope,
        animation: 'slide-in-up',
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.fblogin = function() {
        FB.login(function(response) {
            checkLoginState();
        });
    }

  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.contact = {
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.signinButton = function() {
      document.getElementById('login-div').style.display='none';
      document.getElementById('sign-up-div').style.display ='inherit';
      $('#login-tab-button').toggleClass('highlighted');
      $('#sign-up-tab-button').toggleClass('highlighted');
      $scope.loginSignUpState = 'Sign Up';
  }

  $scope.loginButton = function() {
      document.getElementById('login-div').style.display='inherit';
      document.getElementById('sign-up-div').style.display ='none';
      $('#sign-up-tab-button').toggleClass('highlighted');
      $('#login-tab-button').toggleClass('highlighted');
      $scope.loginSignUpState = 'Login';
  };

  $scope.loginSignUpState = 'Login';


});
