function printImageText(elements, divToPrint, elementTag, functionToCall, locationOfText, locationOfInfo, withTimeDiv, locationOfTime, withImage) {
    var startOfToday = moment().startOf('day');

    for (var i=0;i<elements.length;i++) {
        var elementDiv = document.createElement("div");
        elementDiv.setAttribute('id', elementTag+'-'+i);
        elementDiv.setAttribute('class', 'image-text-element');
        var htmlText;
        if (withImage) {
            var elementInfo = JSON.parse(elements[i][locationOfInfo]);
            var profile_image_url = 'static/'+elementInfo['profile_image_url'];
            htmlText = "<div id='image-area'><img src='"+profile_image_url+"'></img></div><div id='text-area'>"+elements[i][locationOfText]+"</div>";
        } else {

            htmlText = "<div id='image-area'></div><div id='text-area'>"+elements[i][locationOfText]+"</div>";
        }

        if(withTimeDiv) {
            var time = moment.utc(elements[i][locationOfTime]).local();
            if(time.isBefore(startOfToday)) {
                htmlText += "<div class='time-area'>" + time.format("MMM D") + "</div>";
            } else {
                htmlText += "<div class='time-area'>"+time.format("h:mm a")+"</div>";

            }
        }

        elementDiv.innerHTML = htmlText;
        divToPrint.appendChild(elementDiv);
        (function(_functionInfo, _elementDiv){
            _elementDiv.onclick = function(){
                functionToCall(_functionInfo);
            }
        })(elements[i][locationOfInfo], elementDiv);
    }
}

function printImageTextFromDB(elements, divToPrint, elementTag, functionToCall, textName, infoName, withProfileImage) {
    for(var i=0;i<elements.rows.length;i++) {
        var elementDiv = document.createElement("div");
        var element = elements.rows.item(i);
        elementDiv.setAttribute('id', elementTag+'-'+i);
        elementDiv.setAttribute('class', 'image-text-element');
        var profile_image_url = '';

        if (withProfileImage) {
            var elementInfo = JSON.parse(element[infoName]);
            profile_image_url = 'static/'+elementInfo['profile_image_url'];
        }

        htmlText = "<div id='image-area'><img src='"+profile_image_url+"'></img></div><div id='text-area'>"+element[textName]+"</div>";
        elementDiv.innerHTML = htmlText;
        divToPrint.appendChild(elementDiv);

        (function(_functionInfo, _elementDiv){
            _elementDiv.onclick = function(){
                functionToCall(_functionInfo);
            }
        })(element[infoName], elementDiv);
    }
}


function generateAutocompletion(inputId) {
    $.getJSON(contacts_url, function(result) {
        $(inputId).tokenInput(result, {
            theme: 'facebook',
            preventDuplicates: true,
            placeholder: 'To',
            propertyToSearch: 'searchable',
            allowFreeTagging: true,
            resultsFormatter: function(item){
                return "<li>"+item.name+"   "+item.email+"</li>";
            },
            tokenFormatter: function(item){
                var name = ('name' in item) ? item.name : item.id;
                return "<li>"+name+"</li>";
            }
        });
    });
}

var data_type_insert_clauses = {
    events: "insert into events (event_id, event_name, event_info) values (?, ?, ?)",
    notifications:"insert into notifications (notification, is_new, notification_info, date) values (?, ?, ?, ?)",
    circles: "insert into circles (circle_id, name, circle_info) values (?, ?, ?)",
    conversations: "insert into conversations (conversation_id, conversation_preview, name, last_updated) values (?, ?, ?, ?)",
    conversation_messages: 'insert into conversation_messages (conversation_id, message_content, sent_date, sending_user_id) values (?, ?, ?, ?)',
};

function checkDatabaseOrCallServer(data_type, data_url, params, db_callback, server_callback) {
    sqlite.transaction(function(tx){
        tx.executeSql("select * from "+data_type, [], function(trans, res){
            if(res.rows.length > 0) {
                db_callback(res);
            } else {
                $.getJSON(data_url, params, function(data) {
                    server_callback(data);
                    var insert_clause = data_type_insert_clauses[data_type];
                    sqlite.transaction(function(tin){
                        for(var i=0;i < data.length;i++) {
                            tin.executeSql(insert_clause, data[i], function(tin, res){console.log(res);console.log('SUCCESS!');}, function(tin, err){console.log(err); console.log('ERROR!');});
                        }
                    });
                });
            }
        });
    });
}

function checkDBOrCallServer(data_type, data_url, params, db_callback) {
    sqlite.transaction(function(tx) {
        tx.executeSql("select * from "+data_type, [], function(tx, res){
            if(res.rows.length > 0) {
                db_callback(res);
            } else {
                $.getJSON(data_url, params, function(data) {
                var insert_clause = data_type_insert_clauses[data_type];
                sqlite.transaction(function(tin){
                    for (var i=0;i<data.length;i++) {
                        tin.executeSql(insert_clause, data[i],
                        function(tin,rest){
                            console.log(rest);
                        }, function(tin, err){
                            console.log(err);
                        });
                    }
                    tin.executeSql("select * from "+data_type, [], function(tin, result) {
                        console.log(result);
                        db_callback(result);
                    }, function(tin, err){
                        console.log(err);
                    });
                });
                });
            }
        });
    });
}

