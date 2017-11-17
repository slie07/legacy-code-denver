var globalDate;

var calendar_string = "\
<div id='calendar-header-container'>\
<div id='calendar-control-container'>\
</div>\
<div id='calendar-header-right'>\
<img src='static/images/plus.png'></img>\
<img src='static/images/exclamation.png'/>\
<img src='static/images/more.png'/>\
</div>\
</div>\
<div id='date-title-container'><div class='swiper' id='left-swipe'>&#9664;</div><div id='date-title-div'></div><div  class='swiper' id='right-swipe'>&#9654;</div></div>\
<div id='calendar-container'></div>\
";

var dropdownMap = {
    month: "<a href=\"javascript:void(0)\" onclick=\"loadCalendar('month', globalDate)\">Month<p>&#9660;</p></a>",
    week: "<a href=\"javascript:void(0)\" onclick=\"loadCalendar('week', globalDate)\")>Week<p>&#9660;<p></a>",
    day: "<a href=\"javascript:void(0)\" onclick=\"loadCalendar('day', globalDate)\")>Day<p>&#9660;</p></a>",
};

function createDropDownList(calendar, date) {
    var potential = ['day', 'month', 'week'];
    var ul = document.createElement('ul');
    ul.setAttribute('class', 'dropdown');
    var li = document.createElement('li');
    ul.appendChild(li);
    li.innerHTML = dropdownMap[calendar];
    var innerUl = document.createElement('ul');
    for (var i=0;i<3;i++) {
        var pot = potential[i];
        if (pot != calendar) {
            var innerLi = document.createElement('li');
            innerLi.innerHTML = dropdownMap[pot];
            innerUl.appendChild(innerLi);
        }
    }
    li.appendChild(innerUl);
    ul.appendChild(li);
    $('#calendar-control-container').prepend(ul);
}

function loadInitialCalendar() {
    var date = moment();
    globalDate = date;
    document.getElementById('customizable-screen').innerHTML = calendar_string;
    loadCalendar('week', date);
}

function loadCalendar(calendar, date){
    $('#calendar-container, #calendar-control-container').empty();
    globalDate = date;
    if (calendar === 'month') {
        drawMonthCalendarDiv(date);
    } else if (calendar === 'week') {
        drawWeekCalendarDiv(date);
    } else if (calendar === 'day') {
        drawDayCalendarDiv(date);
    }
    createDropDownList(calendar);

    document.getElementById('right-swipe').onclick=function(){
        loadCalendar(calendar, moment(date).startOf(calendar).add(1, calendar));
    };
    document.getElementById('left-swipe').onclick=function(){
        loadCalendar(calendar, moment(date).startOf(calendar).subtract(1, calendar));
    };

    setupCalendarDivClickability();
}

function drawWeekCalendarDiv(date) {
    var flexContainer = document.getElementById('calendar-container');
    $(flexContainer).append("<div id='day-div'></div>");
    $(flexContainer).append("<div id='calendar-event-div'></div>");
    var startOfDay = moment(date).startOf('day');
    var endOfWeek = moment(startOfDay).add(1, 'week');
    var times = true;

    var dayDiv = $('#day-div')[0];
    var eventDiv = $('#calendar-event-div')[0];

    var dayCounter=moment(startOfDay).subtract(1, 'day');

    for(var i=0;i<8;i++) {
        var newDiv = (i == 0)? "<div></div>": "<div>"+ dayCounter.format('ddd<br>D')+"</div>";

        dayCounter.add(1, 'day');
        $(dayDiv).append(newDiv);
        $(eventDiv).append("<div></div>");
    }

    var calendarDiv = document.createElement('div');
    calendarDiv.setAttribute('id', 'calendar-div');
    flexContainer.appendChild(calendarDiv);

    var newDiv = document.createElement('div');
    newDiv.setAttribute('id', 'elem'+0);
    newDiv.setAttribute('class', 'day-containers');
    newDiv.setAttribute('class', 'time-keeper');

    for(var i = moment(startOfDay).subtract(1,'day');!i.isAfter(endOfWeek);) {
        var hourDiv = document.createElement('div');
        hourDiv.setAttribute('id', i.format('x'));

        if(times) {
            hourDiv.innerHTML = i.format('h a');
            i.add(1, 'hour');
        } else {
            hourDiv.setAttribute('class', 'selectable-cell');
            i.add(30, 'minutes');
        }

        newDiv.appendChild(hourDiv);

        if(i.hour() == 0 && i.minutes() == 0) {
            calendarDiv.appendChild(newDiv);
            newDiv = document.createElement('div');
            newDiv.setAttribute('id', 'day:'+i);
            newDiv.setAttribute('class', 'day-containers');
            times = false;
        }
    }

    document.getElementById('date-title-div').innerHTML = date.format('ddd, MMM D, YYYY') + '-'+endOfWeek.subtract(1,'day').format('ddd, MMM D, YYYY');
    var element = $('#elem0 div:nth-child('+(date.hours()+1)+')')[0];
    calendarDiv.scrollTop = element.offsetTop - calendarDiv.offsetTop;
}

function drawDayCalendarDiv(date) {
    var startOfDay = moment(date).startOf('day');
    var startOfTomorrow = moment(startOfDay).add(1, 'day');
    var flexContainer = document.getElementById('calendar-container');
    var eventDiv = document.createElement('div');
    eventDiv.setAttribute('id', 'calendar-event-div');
    flexContainer.appendChild(eventDiv);
    var calendarDiv = document.createElement('div');
    calendarDiv.setAttribute('id', 'calendar-div');
    flexContainer.appendChild(calendarDiv);

    for (var i=0;i<2;i++) {
        var newDiv = document.createElement('div');
        newDiv.setAttribute('id', 'elem'+i);
        newDiv.setAttribute('class', 'day-containers');
        if (i==0) {
            newDiv.setAttribute('class', 'time-keeper');
        }
        while(startOfDay.isBefore(startOfTomorrow)) {
            var hourDiv = document.createElement('div');
            hourDiv.setAttribute('id', date.format('x'));
            if(i == 0) {
                hourDiv.innerHTML = startOfDay.format('h a');
                startOfDay.add(1, 'hour');
            } else {
                hourDiv.setAttribute('class', 'selectable-cell');
                startOfDay.add(30, 'minutes');
            }
            newDiv.appendChild(hourDiv);
        }
        calendarDiv.appendChild(newDiv);
        startOfDay = moment(date).startOf('day');
    }

    document.getElementById('date-title-div').innerHTML = date.format('ddd, MMM D, YYYY');

    var element = $('#elem0 div:nth-child('+date.hours()+1+')')[0];
    calendarDiv.scrollTop = element.offsetTop - calendarDiv.offsetTop;
}

function drawMonthCalendarDiv(date) {
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu","Fri","Sat"];
    var numBoxes = 42;
    var dayDiv = document.createElement('div');
    var flexContainer = document.getElementById('calendar-container');
    for(var i=0;i<7;i++) {
        var newDiv = document.createElement('div');
        newDiv.innerHTML = days[i];
        dayDiv.appendChild(newDiv);
    }
    dayDiv.setAttribute('id', 'month-day-div');
    flexContainer.appendChild(dayDiv);
    var calendarDiv = document.createElement('div');
    calendarDiv.setAttribute('id', 'month-calendar-div');
    flexContainer.appendChild(calendarDiv);
    var startOfMonth = moment(date).startOf('month');
    var endOfMonth = moment(date).endOf('month');
    var currentWeekDiv = document.createElement('div');
    var day = moment(startOfMonth).startOf('week');

    for(i=0;i<numBoxes;i++) {
        if(day.isBefore(startOfMonth) || day.isAfter(endOfMonth)) {
            $(currentWeekDiv).append('<div></div>');
        } else {
            var dayDiv = "<div class='selectable-cell' id="+day.format('x')+">"+day.format('D')+"</div>";
            $(currentWeekDiv).append(dayDiv);
        }

        day.add(1, 'day');
        if(day.day() == 0) {
            calendarDiv.appendChild(currentWeekDiv);
            currentWeekDiv = document.createElement('div');
        }
    }

    document.getElementById('date-title-div').innerHTML = date.format('MMM YYYY');
}

function getHighlightedDates() {
    var ids_object = $('.selectable-cell.highlighted').map(function(index){
        return this.id;
    });
    var ids = [];
    for (var i=0;i<ids_object['length'];i++) {
        ids.push(ids_object[i]);
    }
    return ids;
}

function setHighlightedDates(ids) {

    for (var i = 0;i<ids.length;i++) {
        var id = ids[i];
        var element = document.getElementById(id);
        $(element).addClass('.highlighted');
    }
}


function setupCalendarDivClickability() {

    var isMouseDown = false, isHighlighted;
    $(".selectable-cell").mousedown(function(){
        isMouseDown = true;
        $(this).toggleClass("highlighted");
        isHighlighted = $(this).hasClass("highlighted");
        return false;
    })
    .mouseover(function(){
        if(isMouseDown) {
            $(this).toggleClass("highlighted", isHighlighted);
        }
    });
    $(document).mouseup(function(){
        isMouseDown = false;
    });
}

