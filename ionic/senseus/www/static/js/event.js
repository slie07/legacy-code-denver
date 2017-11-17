var reviewDivHTML = "\
    <span id='outer-reviews'>{0}</span>\
    <div class='row'><span id='outer-stars' class='stars'><span id='inner-stars' style='width:{1}px;'></span></span><span id='outer-author'>{2}</span></div>\
";

var locationRating = "<span id='outer-stars' class='stars'><span id='inner-stars' style='width:{0}px;'></span></span><span id='outer-rating'>{1}</span><span id='outer-users'>{2}</span>";

function setRating(span_name, rating, user_ratings, reviews) {
        if (rating && reviews) {

        var rat = Math.round(16*rating);
		document.getElementById('location-ratings-div').innerHTML = locationRating.replace("{0}",rat).replace("{1}", rating).replace("{2}",user_ratings);
       document.getElementById("outer-rating").innerHTML = rating;
       document.getElementById("outer-users").innerHTML = "("+user_ratings+" Ratings)";
       var review = reviews[0].text;
       for(var i=0;i<Math.max(reviews.length);i++) {
           var rat = Math.round(16*parseFloat(reviews[i].rating));
           var author = ' - '+ reviews[i].author_name;
           if(reviews[i].text.length > 900) {
               reviewText = reviews[i].text.substring(0,900) + " ...";
           } else {
               reviewText = reviews[i].text;
           }
           var reviewText;
           document.getElementById("review"+i).innerHTML = reviewDivHTML.replace("{0}",reviewText).replace("{1}", rat).replace("{2}", author);
       }

    }
}

function extractLocationInfo(place){
    var location = {};
    location['formatted_address'] = place['formatted_address'];
    location['geometry'] = {'A': place['geometry']['location']['A'], 'F': place['geometry']['location']['F']}
    location['place_id'] = place['place_id'];
    location['rating'] = place['rating'];
    location['reviews'] = place['reviews'];
    location['user_ratings_total'] = place['user_ratings_total'];
    var rating = parseFloat(place['rating']);
    setRating('outer-stars', rating, place['user_ratings_total'], location['reviews']);
    return location;
}

function initialize(eventInfo) {
  // Create the autocomplete object, restricting the search
  // to geographical location types.
  var map = new google.maps.Map(document.getElementById('event-google-map'), {
		center: {lat: 40.748, lng: -73.985},
    zoom: 13
  });

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
      };

      map.setCenter(pos);
    });
  }

  var input = /** @type {!HTMLInputElement} */(
      document.getElementById('google-autocomplete'));

  var autocomplete = new google.maps.places.Autocomplete(
      input,
      { types: [] });

  // When the user selects an address from the dropdown,
  autocomplete.bindTo('bounds', map);
  google.maps.event.addListener(autocomplete, 'place_changed', function(element) {
    var place = autocomplete.getPlace();
    var extracted = extractLocationInfo(place);
    console.log(extracted);
    var scope = angular.element($('#event-name-container')).scope();
    scope.$apply(function() {
       scope.eventInfo.locations.push(extracted);
    });
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
  });
}
