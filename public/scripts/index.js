// globals.
var _NAME = "";
var _ADDRESS = "";
var _USR_LOC = "";
var _COORDINATES = "";
var markers = [];
var user_markers = [];
var destination_marker;
deleteMarkers(user_markers);
var marker_selected = false;

/****CUSTOM MAP RELATED FUNCTIONS*****/
// deploys a marker object.
function dropMarker(_marker) {
    markers.push(_marker);

    //document.getElementById("search-input").value = _marker.address;
    //map.panTo(_marker.position);
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
    _ADDRESS = address;
    _NAME = name;
}
// give all current markers a click listener.
function clickToMarkers(_markers) {
    _markers.forEach(function(_marker) {
        if (_marker) {
            _marker.addListener('click', function(event) {
                map.panTo(event.latLng);
                document.getElementById("search-input").value = _marker.address;
                setMarkerData(_marker.address, _marker.title);
                DisplayHostModal(_NAME, _ADDRESS);

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
                _ADDRESS = marker.address;
                _NAME = marker.name;
                clickToMarkers(_markers);

                return;
            }
        } else {
            window.alert('geocoder failed due to ' + status);
            return;
        }
    });
} 

var ttl = -1;
socket2.on('eta', function(data) {
    Object.keys(data).forEach(function(key) {
        if (data[key].name == "Keane" && ttl == -1 && data[key].ttl != -1) {
            ttl = data[key].ttl;
            //timeToLeave = parseInt(data[key].ttl / 60) + ":" + (data[key].ttl % 60 >= 10 ? data[key].ttl % 60 : "0" + data[key].ttl % 60);
        }
    });
    if (ttl >= 20) {
        ttl -= 555 / 120;
        ttl = Math.max(parseInt(ttl), 0);
    } else {
        ttl = 0;
    }
    var timeToLeave = parseInt(ttl / 60) + "m " + (ttl % 60 >= 10 ? ttl % 60 : "0" + ttl % 60) + "s";
    $("#timer").text(timeToLeave);
    $("#user-list").text("");
    deleteMarkers(user_markers);
    Object.keys(data).forEach(function(key) {
        var floorEta = Math.floor(data[key].eta);
        var etaString = parseInt(floorEta / 60) + "m " + (floorEta % 60 >= 10 ? floorEta % 60 : "0" + floorEta % 60) + "s";
        
        $("#user-list").html($("#user-list").html() + data[key].name);
        $("#user-list").html($("#user-list").html() + " " + etaString + "<br>");
        //document.getElementById("user-list").appendChild(document.createElement("BR"));

        //$("#user-list-container").append("\n")
        var new_marker = new google.maps.Marker({
            name: data[key].name,
            map: map, 
            position: {'lat': data[key].currentLocation.x, 'lng': data[key].currentLocation.y}, 
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10
            },
        });
        var infowindow =  new google.maps.InfoWindow({
            content: new_marker.name,
            position: new_marker.position
        });
        new_marker.addListener('mouseover', function() {
            infowindow.open(map, this);
        });
        new_marker.addListener('mouseout', function() {
            infowindow.close();
        });
        user_markers.push(new_marker);
        dropMarker(new_marker); //placeholfer
    });
});

var clientIsHost = true;

socket2.on('userLocation', function(data) {
    deleteMarkers(user_markers);
    Object.keys(data).forEach(function(key) {
        var new_marker = new google.maps.Marker({
            name: data[key].name,
            map: map, 
            position: {'lat': data[key].currentLocation.x, 'lng': data[key].currentLocation.y}, 
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10
            },
        });
        var infowindow =  new google.maps.InfoWindow({
            content: new_marker.name,
            position: new_marker.position
        });
        new_marker.addListener('mouseover', function() {
            infowindow.open(map, this);
        });
        new_marker.addListener('mouseout', function() {
            infowindow.close();
        });
        user_markers.push(new_marker);
        user_markers.push(new_marker);
        dropMarker(new_marker); //placeholfer
    });
    clientIsHost = false;
})

socket2.emit('getUsers');


//*****BUILD GOOGLE MAP****//
function init() {
    // GENERATE MAP.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 29.721865899999997, lng: -95.3404922},
        zoom: 13,
        disableDefaultUI: true,
        gestureHandling: 'greedy',
        clickableIcons: false,
        styles: [
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#FFA800"
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#f8fae9"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#679714"
                    },
                    {
                        "saturation": 33.4
                    },
                    {
                        "lightness": -25.4
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#53FF00"
                    },
                    {
                        "saturation": -73
                    },
                    {
                        "lightness": 40
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#FBFF00"
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#00FFFD"
                    },
                    {
                        "lightness": 30
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#00BFFF"
                    },
                    {
                        "saturation": 6
                    },
                    {
                        "lightness": 8
                    },
                    {
                        "gamma": 1
                    }
                ]
            }
        ]
    });
    var geocoder = new google.maps.Geocoder;
    var input = document.getElementById('search-input');
    var searchBox = new google.maps.places.SearchBox(input);

    // get user location.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            USR_LOC = pos;
            console.log(pos);
            // set user marker. 
            user_markers.push(new google.maps.Marker({
                position: pos,
                map: map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10
                  },
                title: 'user location'
            }));
        });
    }

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
        _COORDINATES = event.latLng;
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
            _COORDINATES = place.geometry.location;
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
