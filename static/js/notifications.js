var event_map = {};

function populate_notifications() {
    var notificationsDiv = document.getElementById("notifications-list");
    checkDatabaseOrCallServer('notifications',
    notifications_url,
    {senseus_id: getUserId()},
    function(res) {
        printImageTextFromDB(res, notificationsDiv, "notifications", launchScreenForNotification, 'notification', 'notification_info', true);
    },
    function(res) {
        var numNotifications = res.length;
        printImageText(res, notificationsDiv, "notifications", launchScreenForNotification, 0, 2, false, 0, true);
        createNotification(numNotifications);

    });
}

function populateEvents() {
    sqlite.executeSql("select * from events", [], function(res) {
        var eventsDiv = document.getElementById("events-list");
        if(res.rows.length > 0) {
            printImageTextFromDB(res, eventsDiv, "events", loadEvent, 'event_name', 'event_info');
        } else {

            $.get(events_url, {senseus_id: getUserId()}, function(data){
                var results = JSON.parse(data);
                printImageText(results, eventsDiv, "events", loadEvent, 1, 0);
                for (var i=0;i<results.length;i++) {
                    event_map[results[i][0]] = JSON.parse(results[i][2]);
                    sqlite.executeSql("insert into events (event_id, event_name, event_info) values (?, ?, ?)", results[i], function(res){
                        console.log(res);
                    });
                }
            });
        }
    });

}

function loadEvent(eventId) {
    if (eventId in event_map) {
        var eventInfo = event_map[eventId];
        loadEventHome(eventInfo);
    } else {

    $.getJSON(events_url,
          {senseus_id: getUserId(),
          event_id: eventId},
          function(data) {
              var eventInfo = data[2];
              event_map[eventId] = eventInfo;
              loadEventHome(JSON.parse(eventInfo));
          });
   }
}

function createNotification(notificationNumber) {
    var navNotificationNumber = $('#nav-notification-number');
    if(notificationNumber > 0) {
        navNotificationNumber.html(notificationNumber);
        navNotificationNumber.addClass('see-me-now');
    }
}

function launchScreenForNotification(notificationInfo) {
        notificationInfo = JSON.parse(notificationInfo);
        if(notificationInfo['type'] == 'event') {
            loadEvent(notificationInfo['event_id']);

        } else if (notificationInfo['type'] == 'circle') {
            loadCircle(notificationInfo['circle_id']);
        }
}

