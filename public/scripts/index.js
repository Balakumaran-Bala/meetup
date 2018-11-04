function init() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8,
    disableDefaultUI: true,
  });

  var input = document.getElementById('search-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

  // update bounds when the map is dragged.
  map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
  });
  var markers = [];

  //AUTO COMPLETE
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
        return;
    }
    //clear out old marker 
    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    // for each place, get the icon, name and location. 
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
        if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
        }
        var icon = {
            url: place.icon, 
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
        markers.push(new google.maps.Marker({
            map: map,
            title: place.name,
            position: place.geometry.location
        }));
        if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    

    });
    map.fitBounds(bounds);
    });

}