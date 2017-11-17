function toggleInputOk() {
    $('#name-input-ok').css('display', 'flex');
}

var main_screen_html = "\
    <ion-nav-view class='view-container'>\
        <div id='main-window'>\
        <div id='customizable-screen'>\
        </div>\
        <div id ='more-list-container' class='more-list-container'>\
        <div id='more-profile'>Profile</div>\
        <div id='more-circles'>Circles</div>\
        <div id='more-settings'>Settings</div>\
        <div id='more-logout'>Logout</div>\
        </div>\
        <div id='bottom-nav-bar'>\
        <div id='nav-events' class='nav-bar-links' onclick='loadEvents()'>Events\
        <div id='nav-notification-number' class='noti_bubble'></div>\
        </div><div id='nav-activity' class='nav-bar-links' onclick='loadCurrentConversations()'>Chat</div><div id ='nav-calendar' class='nav-bar-links' onclick='loadInitialCalendar()'>Calendar</div><div id='nav-more' class='nav-bar-links' onclick='loadMore()'>More\
        </div>\
        </div>\
        </div>\
        <script>\
            function loadMore(elm) {\
                $('#more-list-container').toggleClass('clicked-nav-more');\
            }\
            $('#more-profile').click(function(){\
                $('#more-list-container').toggleClass('clicked-nav-more');\
                loadProfile();\
            });\
            $('#more-settings').click(function(){\
                $('#more-list-container').toggleClass('clicked-nav-more');\
                loadSettings();\
            });\
            $('#more-circles').click(function(){\
                $('#more-list-container').toggleClass('clicked-nav-more');\
                loadCircles();\
            });\
            $('#more-logout').click(function(){\
                logout();\
            });\
        </script>\
    </ion-nav-view>\
";

