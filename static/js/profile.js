var profile_string = "\
<div id='profile-container'>\
<div id='profile-image-snippet-wrapper'>\
<div id='profile-image-area'>\
<img id='profile-image' src='static/images/blank-profile-hi.png'></div>\
<div id='profile-info-area'>\
<p id='profle-snippet'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>\
</div></div>\
<div id='profile-name-contact'>\
</div>\
<div id='events-and-circles'>\
<div id='events-wrapper'><div class='profile-events-title'>Events</div><div id='events-div'></div></div>\
<div id='circles-wrapper'><div class='profile-circles-title'>Circles</div><div id='profile-circles-div'></div></div>\
</div>\
";

function loadProfile (){
    document.getElementById("customizable-screen").innerHTML = profile_string;
    profileFunction();
}

function profileFunction() {
    var profileHTML = '<div>Name: '+getUserName()+'</div><div>Email: '+getEmail()+'</div>';
    document.getElementById("profile-name-contact").innerHTML = profileHTML;
    //populate_events_and_circles();
}

function populate_events_and_circles() {
    document.getElementById('events-div').innerHTML = load_event_list_string;
    populateEvents();
    document.getElementById('profile-circles-div').innerHTML = circles_string;
    populateCircles();
}

