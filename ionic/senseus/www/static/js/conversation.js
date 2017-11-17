var conversation_string = "\
    <div id='conversations-container'>\
    <div id='conversations-header'>\
    <img src='static/images/search.png'></img>\
    <img src='static/images/plus.png' onclick='createConversation()'></img>\
    <img src='static/images/more.png'></img>\
    </div>\
    <div id='conversations-div' class='conversations-list'>\
    </div>\
    </div>\
";
var conversation_messages_string ="\
    <div id='conversations-container'>\
    <div id='conversation-messages-div' class='conversations-list'>\
     </div>\
<div id='input-message'><form id='send-message' disabled=disabled\"><input id='message-text' placeholder='Send Message' ></input><div id='submit-message'>Submit</div></form></div>\
    </div>\
";

var create_conversation_string = "\
<div id='conversations-container'>\
<div id='conversation-messages-div' class='conversations-list'>\
<div id='to-contact-div'><div id='input-container'><input id='to-contact-input'/></div></div>\
</div>\
<div id='input-message'><form id='send-message'><input id='message-text' placeholder='Send Message'></input><div id='submit-message'>Submit</div></form></div>\
</div>\
";

function sendMessage(conversationId) {
    if (!conversationId) {
        return createConversationAndSend();
    }
    var message = document.getElementById('message-text').value;
    var date = moment.utc();
    updatedMap[conversationId] = date;
    $.post(send_message_url, {conversation_id: conversationId, message: message, sent_date: date.format(), senseus_id: getUserId()}).done(function(){
        console.log("HUZZAH, SENT!");
    });
    var conversationsDiv = document.getElementById("conversation-messages-div");
    addMessageToDiv(message, moment(), conversationsDiv);
    document.getElementById('message-text').value = "";
    conversationsDiv.scrollTop = conversationsDiv.scrollHeight;
}

function createConversationAndSend() {
    var message = document.getElementById('message-text').value;
    var date = Math.floor(Date.now() / 1000);
    var participants = $('#to-contact-input').tokenInput("get");
    participants = participants.map(function(obj) {
        obj['type'] = 'email';
        return obj
    });
    var senseus_id = getUserId();
    $.post(get_or_create_conversation_url,
           {'senseus_id': senseus_id, 'participants': JSON.stringify(participants),
            'message': message, 'last_updated': date},
            function(data) {
                var conversationId = parseInt(data);
                $('#submit-message').unbind('click').click(function(event){
                    sendMessage(conversationId);
                });
                $('#send-message').unbind('submit').submit(function(event){
                    sendMessage(conversationId);
                    return false;
                });
                var conversationsDiv = document.getElementById("conversation-messages-div");
                addMessageToDiv(message, moment.utc(), conversationsDiv);
                document.getElementById('message-text').value = "";
                conversationsDiv.scrollTop = conversationsDiv.scrollHeight;
            }, 'json');
}

function addMessageToDiv(message, sentDate, conversationsDiv) {
    sentDate = moment.utc(sentDate).local()
    var messageDiv = document.createElement("div");
    messageDiv.innerHTML = "<div id='image-area'><img src='static/images/blank_new.png'/></div><div id='text-area'><p>"+message+"</p><div id='date-area' class-'my-message'date'>"+sentDate.format("dddd, h:mma")+"</div></div>"
    messageDiv.setAttribute('class', 'conversation-element');
    conversationsDiv.appendChild(messageDiv);
}

function loadCurrentConversations() {
    document.getElementById("customizable-screen").innerHTML = conversation_string;
    checkDatabaseOrCallServer('conversations', conversations_url, {senseus_id: getUserId()},
    function(res) {
        var new_res = [];
        for (var i=0;i<res.rows.length;i++) {
            var curr = res.rows.item(i);
            new_res.push([curr['conversation_id'], curr['conversation_preview'], curr['name'], curr['last_updated']]);
        }
        loadConversations(new_res);
    },
    function(res) {
        var new_res = res.map(function(arr) {
            return arr.slice();
        });
        loadConversations(new_res);
    });
}

function loadConversations(conversations){
    var conversationsDiv = document.getElementById('conversations-div');
    for (var i=0;i<conversations.length;i++) {
        conversations[i].push(conversations[i][2]+"<br>"+conversations[i][1]);
        conversations[i].push({conversation_id: conversations[i][0],
                               last_updated: moment.utc(conversations[i][3])});
    }
    printImageText(conversations, conversationsDiv, "conversations", loadConversationMessages, 4, 5, true, 3);
}

function loadConversationMessages(info) {
    var conversationId = info['conversation_id'], lastUpdated=info['last_updated'];
    document.getElementById("customizable-screen").innerHTML = conversation_messages_string;
    var conversationsDiv = document.getElementById("conversation-messages-div");
    checkDBOrCallServer('conversation_messages', conversation_messages_url, {senseus_id: getUserId(), conversation_id: conversationId},
    function(res){
        for (var i=0;i<res.rows.length;i++) {
            addMessageToDiv(res.rows.item(i)['message_content'], res.rows.item(i)['sent_date'], conversationsDiv);
        }
        conversationsDiv.scrollTop = conversationsDiv.scrollHeight;
    });

}

var updatedMap = {};

function getNewConversationMessages(conversationId, lastUpdated) {
    if (conversationId in updatedMap) {
        lastUpdated = updatedMap[conversationId];
    }

    var params = {senseus_id: getUserId(), conversation_id: conversationId, last_updated: lastUpdated.format()};
    $.getJSON(new_conversation_messages_url, params, function(data) {
        var conversationsDiv = document.getElementById('conversation-messages-div');
        for(var i=0;i<data.length;i++) {
            addMessageToDiv(data[i][1], data[i][2], conversationsDiv);
        }
        if(data.length > 0) {
            updatedMap[conversationId] = moment(data[data.length-1][2]);
            conversationsDiv.scrollTop = conversationsDiv.scrollHeight;
        }
    });
}

function createConversation() {
    document.getElementById("customizable-screen").innerHTML = create_conversation_string;
    generateAutocompletion('#to-contact-input');
    document.getElementById('submit-message').onclick = function(){
        sendMessage();
    };
    document.getElementById('send-message').onsubmit = function(){
        sendMessage();
        return false;
    };
}

