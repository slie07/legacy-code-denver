//var myOauth = angular.module('starter', ['ionic', 'ngCordova', 'ngStorage'])

//myOauth.config(function($stateProvider, $urlRouterProvider) {
    //$stateProvider
        //.state('login', {
            //url: '/login',
            //templateUrl: 'templates/login.html',
            //controller: 'LoginController'
        //})

//});

//myOauth.controller("FacebookLoginController", function($scope, $cordovaOauth, $localStorage, $location) {
    //$scope.login = function() {
        //$cordovaOauth.facebook("CLIENT_ID_HERE", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).then(function(result) {
            //$localStorage.accessToken = result.access_token;
            //$location.path("/profile");
        //}, function(error) {
            //alert("There was a problem signing in!  See the console for logs");
            //console.log(error);
        //});
    //}
//});


// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
console.log('statusChangeCallback');
console.log(response);
// The response object is returned with a status field that lets the
// app know the current login status of the person.
// Full docs on the response object can be found in the documentation
// for FB.getLoginStatus().
if (response.status === 'connected') {
  // Logged into your app and Facebook.
  FB.api('/me', function(resp) {

    var data = {id: response.authResponse.userID, login_type:'facebook', name: resp.name, email: resp.email};
    $.post(facebook_login_url, data, function(data) {
        var x = JSON.parse(data);
        saveUserData(x['name'], x['email'], x['id']);
        window.location.replace("/profile");
    });
  });
} else if (response.status === 'not_authorized') {
  // The person is logged into Facebook, but not your app.
  document.getElementById('status').innerHTML = 'Please log ' +
    'into this app.';
} else {
  // The person is not logged into Facebook, so we're not sure if
  // they are logged into this app or not.
  //document.getElementById('status').innerHTML = 'Please log ' +
    //'into Facebook.';
}
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
});
}

window.fbAsyncInit = function() {
FB.init({//773931516053169
appId      : '773931516053169',
cookie     : true,  // enable cookies to allow the server to access
                    // the session
xfbml      : true,  // parse social plugins on this page
version    : 'v2.2' // use version 2.2
});

// Now that we've initialized the JavaScript SDK, we call
// FB.getLoginStatus().  This function gets the state of the
// person visiting this page and can return one of three states to
// the callback you provide.  They can be:
//
// 1. Logged into your app ('connected')
// 2. Logged into Facebook, but not your app ('not_authorized')
// 3. Not logged into Facebook and can't tell if they are logged into
//    your app or not.
//
// These three cases are handled in the callback function.

FB.getLoginStatus(function(response) {
statusChangeCallback(response);
});

};

// Load the SDK asynchronously
(function(d, s, id) {
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) return;
js = d.createElement(s); js.id = id;
js.src = "https://connect.facebook.net/en_US/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));




