// globals.
var ADDRESS = "";
var markers = [];




/****CUSTOM FUNCTIONS*****/
// deploys a marker object.
function dropMarker(_marker) {
    markers.push(_marker);

    //document.getElementById("search-input").value = _marker.address;
    map.panTo(_marker.position);
}
// takes an array of marker objects and sets them to null on the map.
function deleteMarkers(_markers) {
    _markers.forEach(function(_marker){
        if (_marker) {
            _marker.setMap(null);
        }
    });
}
// sets name and address of location marked by the marker.
function setMarkerData(address, name) {
    ADDRESS = address;
    NAME = name;
}
// give all current markers a click listener.
function clickToMarkers(_markers) {
    _markers.forEach(function(_marker) {
        if (_marker) {
            _marker.addListener('click', function(event) {
                map.panTo(event.latLng);
                document.getElementById("search-input").value = _marker.address;
                setMarkerData(_marker.address, _marker.title);
            });
        }
    });
}
function coordinateToAddr(_geocoder, _map, _latLng, _markers) {
    _geocoder.geocode({'location':_latLng}, function(results, status) {
        if (status=='OK') {
            if (results[0]) {
                //define marker.
                marker = new google.maps.Marker({
                    map: map, 
                    title: "",
                    address: results[0].formatted_address,
                    animation: google.maps.Animation.DROP, 
                    position: _latLng, 
                    zoom: 0,
                });
                // deploy marker on map.
                dropMarker(marker);
                document.getElementById("search-input").value = marker.address;
                ADDRESS = marker.address;
                NAME = marker.name;
                clickToMarkers(_markers);

                return;
            }
        } else {
            window.alert('geocoder failed due to ' + status);
            return;
        }

    });

} 


//*****BUILD GOOGLE MAP****//
function init() {
    // GENERATE MAP.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -25.344, lng: 131.036},
        zoom: 5,
        disableDefaultUI: true,
        gestureHandling: 'greedy',
        clickableIcons: false,
    });
    var geocoder = new google.maps.Geocoder;
    var input = document.getElementById('search-input');
    var searchBox = new google.maps.places.SearchBox(input);

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    // LISTENER EVENT WHEN YOU MOVE THE MAP.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    // DROP MARKER ON CLICK. 
    map.addListener('click', function(event) {
        deleteMarkers(markers);
        // translate event coordinates into an address. 
        // this function takes care of generating the marker and 
        // applying click events.
        coordinateToAddr(geocoder, map, event.latLng, markers);
    })

    // LISTENER EVENT WHEN YOU SEARCH A NEW PLACE.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        //clear out old markers.
        deleteMarkers(markers);
        // for each place, get the icon, name and location. 
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                return;
            }
            var icon = {
                url: place.icon, 
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            // drop a marker on search result.
            dropMarker(new google.maps.Marker({
                map: map, 
                title: place.name,
                address: place.formatted_address, 
                animation: google.maps.Animation.DROP, 
                position: place.geometry.location, 
                zoom: 0,
            }));
            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

        });
        map.fitBounds(bounds);
        clickToMarkers(markers);
    });

}
