// //House 3 approx 35 min away
var socket1 = io.connect('http://localhost:8080');
socket1.emit('joinLobby', {'name': 'Tony'});
socket1.emit('updateLocation', {'x': 29.6393083, 'y': -95.26521969999999});
socket1.on('displayTTL', function(data) {
    console.log('hello'); 
    // var tonyTTL = parseTTL(data, 'Tony');
    // console.log(tonyTTL);
});

var socket2 = io.connect('http://localhost:8080');            
socket2.emit('joinLobby', {'name': 'Bala'});
socket2.emit('updateLocation', {'x': 29.7207902, 'y': -95.3440627149137});
socket2.on('displayTTL', (data) => { 
    console.log('hello');
    // var balaTTL = parseTTL(data, 'Bala');
    // console.log(balaTTL);
});

var parseTTL = function(data, name) {
    Object.keys(data).forEach(function(socketId) {
        if(data.socketId.name == name) {
            return data.socketId.ttl;
        }
    });
}
