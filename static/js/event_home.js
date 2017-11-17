function eventHomeCreate(eventInfo) {
    document.getElementById('customizable-screen').innerHTML = event_home_string;

    eventBarClickability(eventInfo);
    document.getElementById('event-area').innerHTML = event_home_create_string;
    eventInfo['create_date'] = moment.utc();
    var eventParams = {'event_info': JSON.stringify(eventInfo),
                       'senseus_id': getUserId(),
                       'user_name': getUserName()};
    $('#done-button').click(function(){
        $.post(create_event_url, eventParams,function(data) {
           console.log(data);
           eventHome(eventInfo);
        }, "json");
    });
}

function loadEventHome(eventInfo) {
    document.getElementById("customizable-screen").innerHTML = event_home_string;
    eventBarClickability(eventInfo);
    eventHome(eventInfo);
}

function eventHome(eventInfo) {
    document.getElementById('event-area').innerHTML = event_home_div;
    loadEventInfo(eventInfo);
}

function loadEventInfo(eventInfo) {
    document.getElementById('event-name-home').innerHTML = eventInfo['eventName'];
    document.getElementById('event-dates').innerHTML = 'TBD';
    document.getElementById('event-location').innerHTML = eventInfo['Location1']['formatted_address'];
    document.getElementById('event-image').innerHTML = 'Fake Image';
    var friends = eventInfo['friends'].map(function(user) {
        return user['name'];
    });

    //var friends = [for (x of eventInfo['friends']['email']) x['name']];
    document.getElementById('event-guests').innerHTML = friends;
}

function loadEventSchedule(eventInfo) {
    document.getElementById('event-area').innerHTML = calendar_string;
    drawWeekCalendarDiv(moment());
}

var offSwitch = "\
<div class='on-off-switch'>\
<ul>\
    <li><a href='#'>IN</a></li>\
    <li class='on'><a href='#'>OUT</a></li>\
</ul></div>\
";

var onSwitch = "\
<div class='on-off-switch'>\
<ul>\
    <li class='on'><a href='#'>IN</a></li>\
    <li><a href='#'>OUT</a></li>\
</ul></div>\
";

function loadEventActivities(eventInfo) {
    document.getElementById('event-area').innerHTML = event_activities_string;
    var activities = ('activities' in eventInfo) ? eventInfo['activities'] : [];
    var activitiesList = document.getElementById('activities-list');
    for(var i=0;i<activities.length;i++) {
        var activity = activities[i];
        addActivity(activity, activitiesList);
    }

    $('#add-activity').click(function(){
        var activityDiv = addActivity({}, activitiesList);
        $(activityDiv.childNodes[0]).focus();
    });

    $("ul li").click(function(){
        $("ul li").removeClass("on");
        $(this).addClass("on");
    });
}

function addActivity(activity, activitiesList) {
    var activityDiv = document.createElement("div");
    if('name' in activity) {
        activityDiv.innerHTML = "<div class='activity-text'>"+activity['name']+"</div>"+offSwitch;
    } else {
        activityDiv.innerHTML = "<div class='activity-text' contenteditable></div>"+onSwitch;
    }
    activitiesList.appendChild(activityDiv);
    return activityDiv;
}

function loadEventExpenses(eventInfo) {
    document.getElementById('event-area').innerHTML = event_expenses_string;
    var expenses = eventInfo['expenses'];
    var expensesList = document.getElementById('expenses-list');
    for(var i=0;i<expenses.length;i++) {
        var expense = expenses[i];
        addExpense(expense, expensesList);
    }

    $('#add-expense').click(function(){
        var expenseDiv = addExpense({}, expensesList);
        $(expenseDiv.childNodes[0]).focus();
    });
    $("ul li").click(function(){
        $("ul li").removeClass("on");
        $(this).addClass("on");
    });
}

function addExpense(expense, expensesList) {
        var expenseDiv = document.createElement("div");
        expenseDiv.setAttribute("id", expense["id"]);
        if('name' in expense) {
            expenseDiv.innerHTML = "<div class='expense-text'>"+expense['name']+"</div>"+offSwitch;
        } else {
            expenseDiv.innerHTML = "<div class='expense-text' contenteditable></div>"+onSwitch;
        }
        expensesList.appendChild(expenseDiv);
        return expenseDiv;
}

function eventBarClickability(eventInfo) {
    $('#event-home').click(function(){
        loadEventHome(eventInfo);
    });
    $('#event-schedule').click(function(){
        loadEventSchedule(eventInfo);
    });
    $('#event-activities').click(function() {
        loadEventActivities(eventInfo);
    });
    $('#event-expenses').click(function(){
        loadEventExpenses(eventInfo);
    });
}
