// Wait for Cordova to load
//document.addEventListener("deviceready", onDeviceReady, false);

//function onDeviceReady() {
//}

var sqlite = null;

try{
    sqlite = window.sqlitePlugin.openDatabase('senseus.db');
} catch(err) {
    console.log(err);
    sqlite = window.openDatabase('senseus.db', '0.1', 'The senseus DB', 2*1024*1024);
}
sqlite.transaction(function(tx) {
tx.executeSql("CREATE TABLE IF NOT EXISTS notifications (notification text, is_new integer, date timestamp, notification_info text)", []);
tx.executeSql("CREATE TABLE IF NOT EXISTS user (id integer, name text, email text)", []);
tx.executeSql("CREATE TABLE IF NOT EXISTS events (event_id integer, event_name text, event_info text)", []);
tx.executeSql("CREATE TABLE IF NOT EXISTS circles (circle_id integer, name text, circle_info text)", []);
tx.executeSql("CREATE TABLE friends (circle_id integer, name text)", []);
tx.executeSql("INSERT INTO friends VALUES (0, 'Derrick Yu')");
tx.executeSql("INSERT INTO friends VALUES (0, 'Sravan Vankina')");
tx.executeSql("INSERT INTO friends VALUES (1, 'Zeb Girouard')");
tx.executeSql("CREATE TABLE IF NOT EXISTS conversations (conversation_id integer, conversation_preview text, name text, last_updated text)", []);
tx.executeSql("CREATE TABLE IF NOT EXISTS conversation_messages (conversation_id integer, message_content text, sent_date text, sending_user_id integer)", []);

});
