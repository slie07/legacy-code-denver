app.controller('GoogleLoginController', function($scope, $cordovaOauth, $cordovaSQLite, $location) {
        sqlite.transaction(function(tx){
            tx.executeSql("SELECT * from user", [], function(tx, res){
                if(res.rows.length > 0) {
                    saveUserData(res.rows.item(0).name, res.rows.item(0).email, res.rows.item(0).id);
                    loadMainScreen();
                    console.log('YAYYYY, FOUND!');
                }
            });
        });

        $scope.login = function() {
        var google_client_id = '578822069853-m6bvp5ltghui0f1ilf0d0lbfojin7kur.apps.googleusercontent.com';
        var scopes = [ 'profile', 'email', 'openid', 'https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/contacts.readonly' ];
        $cordovaOauth.google(google_client_id, scopes).then(function(result) {
            console.log(result);
            var accessToken = result['access_token'];

            $.ajax({'url': 'https://content.googleapis.com/oauth2/v2/userinfo',
                   'headers': {"Authorization": "Bearer "+accessToken },
                   'success': function(result) {
                       console.log(result);
                       googleLoginForUser(result);
                   },
                   'type': 'GET',
                   });
            }, function(error){
                console.log(error);
            });
    }
});


//function googleLoginForCordova(id_token, access_token, result) {
  //saveAuthToken(access_token);
  //var data = {user_id: id_token, login_type: 'google', email: result['email'],
               //name: result['name']};
  //$.post(google_login_url, data, function(data) {
    //var x = JSON.parse(data);
    //saveUserData(x['name'], x['email'], x['id']);
    //sqlite.transaction(function(tx) {
        //tx.executeSql("insert into user (id, name, email) values (?, ?, ?)", [x['id'],x['name'],x['email']]);
    //});
    //loadMainScreen();
  //});

//}
//(function(angular) {
  //'use strict';
//angular.module('invoice1', [])
  //.controller('InvoiceController', function($scope, $cordovaOauth, $localStorage, $location) {
        //var google_client_id = '578822069853-m6bvp5ltghui0f1ilf0d0lbfojin7kur.apps.googleusercontent.com';
        //var scopes = [ 'profile', 'email', 'openid', 'https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/contacts.readonly' ];
        //$cordovaOauth.google(google_client_id, scopes).then(function(result) {
            //console.log(result);
//});
//})(window.angular);




function logout() {
    $('#more-list-container').toggleClass('clicked-nav-more');
    navigator.notification.confirm("Are you sure you want to logout?", function(buttonIndex) {
        if(buttonIndex != 1) {
            window.sqlitePlugin.deleteDatabase('senseus.db');
            window.location.replace('index.html');
        }}, "Senseus", [ "No", "Yes"]);

}

//Google Signin Stuff
var googleUser = {};
var startApp = function() {
gapi.load('auth2', function(){
  // Retrieve the singleton for the GoogleAuth library and set up the client.
  auth2 = gapi.auth2.init({
    client_id: '578822069853-m6bvp5ltghui0f1ilf0d0lbfojin7kur.apps.googleusercontent.com',
    cookiepolicy: 'single_host_origin',
    // Request scopes in addition to 'profile' and 'email'
    scope: 'profile email openid https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/contacts.readonly'
  });
  auth2.isSignedIn.listen(googleSignInChanged);
  attachSignin(document.getElementById('google-login-div'));
});
};

var google_client_id = '578822069853-m6bvp5ltghui0f1ilf0d0lbfojin7kur.apps.googleusercontent.com';
var scopes = [ 'profile', 'email', 'openid', 'https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/contacts.readonly' ];

function attachSignin(element) {
console.log(element.id);
auth2.attachClickHandler(element, {},
    function(googleUser) {
        googleLoginForUser(googleUser);
    }, function(error) {
      alert(JSON.stringify(error, undefined, 2));
    });
}

function googleLoginForUser(googleUser) {
  var profile = googleUser.getBasicProfile();
  var id_token = googleUser.getAuthResponse().id_token;
  var authToken = googleUser.getAuthResponse().access_token;
  saveAuthToken(authToken);
  var data = {id: id_token, login_type: 'google', access_token: authToken};
  $.post(google_login_url, data, function(data) {
    var x = JSON.parse(data);
    saveUserData(x['name'], x['email'], x['id']);
    window.location.replace('#/tab/home');
  });

}

function googleSignInChanged(something) {
    var googleUser = auth2.currentUser.get();
    googleLoginForUser(googleUser);
}

