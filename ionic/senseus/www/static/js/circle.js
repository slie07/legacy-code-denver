var circles_string = "\
    <div id='circles-container'>\
    <div id='circles-div' class='notifications-list'></div>\
    <div id='create-circle'>Create Circle</div>\
    </div>\
";

function loadCircles(){
    document.getElementById("customizable-screen").innerHTML = circles_string;
    populateCircles();
}

function populateCircles() {
    var circlesDiv = document.getElementById('circles-div');
    checkDatabaseOrCallServer('circles', circles_url,{senseus_id: getUserId()},
    function(res) {
        printImageTextFromDB(res, circlesDiv, 'circles', loadCircle, 'name', 'circle_info', false);
    },
    function(res) {
        printImageText(res, circlesDiv, "circles", loadCircle, 1, 0);
    });
    document.getElementById("create-circle").onclick = function(){
        createCircleWorkFlow();
    };
}

function loadCircle() {

}

var create_circle_container = "\
<div id='create-circle-container'>\
<div id='title'>Circle Name</div>\
<input id='circle-name' type='text' placeholder='Enter Circle Name Here'/>\
<div id='circle-members-title'>Members</div>\
<input id='circle-members' type='text' data-multiple/>\
<div id='create-circle-div'>\
<div id='create-circle-button'>Create Circle</div></div>\
</div>\
";

function createCircleWorkFlow() {
    var circleInfo = {};
    document.getElementById("customizable-screen").innerHTML = create_circle_container;

}

