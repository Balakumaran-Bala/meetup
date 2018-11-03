var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var lobby = {
    destination: {
        x: 0,
        y: 0
    },
    users: {}
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, '/../')))

io.on('connection', function (socket) {

    socket.on('joinLobby', function(data) {
        lobby[users][socket.id] = {
            currentLocation: {
                
            },
            eta: "-1", //estimated time of arrival
            ttl: "-1", //time to leave
        };
        socket.emit('joinedLobby');
    });

    socket.on('setDestination', function(data) {
       lobby[destination][x] = data[x];
       lobby[destination][y] = data[y];
       socket.emit('destinationSet');
    });

    socket.on('updateLocation', function(data) {
        lobby[users][socket.id][currentLocation][x] = data[x];
        lobby[users][socket.id][currentLocation][y] = data[y];
        socket.emit('updatedLocation');
    });

    socket.on('departed', function(data) { //calculate everyones time to leave
        var maxTime = 0;
        Object.keys(lobby[users]).forEach(function(socketId) {
            var time = GoogleMapsApi(lobby[users][socketId][currentLocation][x], lobby[users][socket][currentLocation][y]);
            if (time > maxTime) {
                maxTime = time;
            }
            lobby[users][socketId][ttl] = time;
        });
        Object.keys(lobby[users]).forEach(function(socketId) {
            lobby[users][socketId][ttl] = maxTime - lobby[users][socketId][ttl];
        })
    });

    socket.on('disconnect', function(){
        console.log("disconnected");
    });

});

server.listen(8080, function() {
    console.log("Server listening on 8080");
});
