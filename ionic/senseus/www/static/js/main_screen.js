var settings_string = "\
<div id='settings-container' class='notifications-list'>\
</div>\
";

var events_string = "\
    <div id='notifications-area'>\
        <div id='notifications-list' class='notifications-list'></div>\
        <div id='my-and-create-event-container'>\
        <div id='my-events'>My Events</div>\
        <div id='create-event'>Create Event</div>\
        </div>\
    </div>\
";

var load_event_list_string = "\
    <div id='events-container'>\
        <div id='events-list'></div>\
        <div id='create-event-div'>Create an Event</div>\
    </div>\
";

var create_event_string = "\
<div id='create-event-container'>\
<div class='outer-create-event' id='create-event-meal'><div class='inner-create-event'>Meal</div></div>\
<div class='outer-create-event' id='create-event-sports'><div class='inner-create-event'>Sports</div></div>\
<div class='outer-create-event' id='create-event-movie'><div class='inner-create-event'>Movie</div></div>\
<div class='outer-create-event' id='create-event-vacation'><div class='inner-create-event'>Vacation</div></div>\
<div class='outer-create-event' id='create-event-conference'><div class='inner-create-event'>Conference</div></div>\
<div class='outer-create-event' id='create-event-custom'><div class='inner-create-event'>Custom</div></div>\
</div>";

function loadSettings() {
    document.getElementById("customizable-screen").innerHTML = settings_string;
    $.getJSON("settings", {senseus_id: getUserId()}).done(function(data){
        var settingsContainer = document.getElementById('settings-container');
        for (var setting in data) {
            var div = document.createElement('div');
            div.innerHTML =  setting + ': '+data[setting]
            settingsContainer.appendChild(div);
        }
    });
}


function loadEvents() {
    document.getElementById("customizable-screen").innerHTML = events_string;
    populate_notifications();
    document.getElementById("my-events").onclick = function(){
        loadEventList();
    };
    document.getElementById("create-event").onclick = function(){
        eventWorkFlow();
    };
}

function loadCreateEvent(){
    document.getElementById("customizable-screen").innerHTML = create_event_string;
    $(".outer-create-event").click(function(){
        eventWorkFlow(this);
    });
}

function loadEventList() {
    document.getElementById("customizable-screen").innerHTML = load_event_list_string;
    populateEvents();
    document.getElementById("create-event-div").onclick = function() {
        eventWorkFlow();
    }
}

function loadFrontPage() {
    Dropdown.initialise();
    loadEvents();
}

//function firstTime() {
    //document.getElementById("customizable-screen").innerHTML = first_time_string;
    //$('#bottom-nav-bar').hide();
//}

function findEvent() {
    $('#extension').toggleClass('active');
}

