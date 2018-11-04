// //House 3 approx 35 min away
var count1 = 0;
var count2 = 0;
var socket3 = io.connect('http://localhost:8080');
socket3.emit('joinLobby', {'name': 'Tony'});
var tLoc = [29.530390, -95.347364];
socket3.emit('updateLocation', {'x': tLoc[0], 'y': tLoc[1]}); // destination {'x': 29.7853358, 'y': -95.49261059999998}
var destination = {'x': 29.728101, 'y': -95.338509};
var xChange = (destination.x-tLoc[0])/60.0;
var yChange = (destination.y-tLoc[1])/60.0;
var moveTony = function() {
    socket3.emit('updateLocation', {'x': tLoc[0], 'y': tLoc[1]});
    tLoc[0] += xChange;
    tLoc[1] += yChange;
    //if (tLoc[0] != destination.x && tLoc[1] != destination.y) {
        if (count1 < 60) {
            count1++;
            setTimeout(moveTony, 1000);
        }
    //}
}
socket3.on('displayTTL', function(data) {
    var tonyTTL = parseTTL(data, 'Tony');
    moveTony();
});

var socket4 = io.connect('http://localhost:8080');            
socket4.emit('joinLobby', {'name': 'Bala'});
var bLoc = [29.607590, -95.205608];
socket4.emit('updateLocation', {'x': bLoc[0], 'y': bLoc[1]});
var xChange2 = (destination.x-bLoc[0])/60.0;
var yChange2 = (destination.y-bLoc[1])/60.0;
var eta = 0;
var notSet = true;
var moveBala = function() {
    socket4.emit('updateLocation', {'x':bLoc[0], 'y':bLoc[1]})
    bLoc[0] += xChange2;
    bLoc[1] += yChange2;
    //if (bLoc[0] != destination.x && bLoc[1] != destination.y) {
        if (count2 < 60) {
            count2++;
            setTimeout(moveBala, 1000);
        }
        
    //}      
}
socket4.on('eta', function(data) {
    Object.keys(data).forEach(function(key) {
        if (data[key].name == 'Bala') {
            eta = data[key].eta;
        }
        if(data[key].name == 'Tony' && data[key].eta != -1 && data[key].eta <= 200 + eta && notSet) {
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
