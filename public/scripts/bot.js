// //House 3 approx 35 min away
var socket3 = io.connect('http://localhost:8080');
socket3.emit('joinLobby', {'name': 'Tony'});
var tLoc = [29.5161656, -95.28864920000001];
socket3.emit('updateLocation', {'x': tLoc[0], 'y': tLoc[1]}); // destination {'x': 29.7853358, 'y': -95.49261059999998}
var destination = {'x': 29.7853358, 'y': -95.49261059999998};
var xChange = (destination.x-tLoc[0])/60.0;
var yChange = (destination.y+tLoc[1])/60.0;
var moveTony = function() {
    console.log('move');
    socket3.emit('updateLocation', {'x': tLoc[0], 'y': tLoc[1]});
    tLoc[0] += xChange;
    tLoc[1] += yChange;
    if (tLoc[0] != destination.x && tLoc[1] != destination.y) {
        setTimeout(moveTony, 1000);
    }
}
socket3.on('displayTTL', function(data) {
    var tonyTTL = parseTTL(data, 'Tony');
    moveTony();
});

var socket4 = io.connect('http://localhost:8080');            
socket4.emit('joinLobby', {'name': 'Bala'});
var bLoc = [29.6393083, -95.26521969999999];
socket4.emit('updateLocation', {'x': bLoc[0], 'y': bloc[1]});
var xChange2 = (destination.x-bLoc.x)/60;
var yChange2 = (destination.y-bLoc.y)/60;
var eta = 0;
var notSet = true;
var moveBala = function() {
    socket4.emit('updateLocation', {'x':bLoc[0], 'y':bLoc[1]})
    bLoc[0] += xChange;
    bLoc[1] += yChange;
    if (bLoc[0] != destination.x && bLoc[1] != destination.y) {
        setTimeout(moveBala, 500);
    }      
}
socket4.on('eta', function(data) {
    Object.keys(data).forEach(function(key) {
        if (data[key].name == 'Bala') {
            eta = data[key].eta;
        }
        if(data[key].name == 'Tony' && data[key].eta != -1 && data[key].eta <= eta && notSet) {
            moveBala();
            notSet = false;
        }
    });  
});

var parseTTL = function(data, name) {
    var ttl = 0;
    Object.keys(data).forEach(function(key) {
        if(data[key].name == name) {
            ttl = data[key].ttl;
        }
    });
    return ttl;
}
