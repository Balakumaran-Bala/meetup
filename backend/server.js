var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('request');
var qs = require('querystring');

var lobby = {
    destination: {
        x: 0,
        y: 0
    },
    users: {}
};

app.use(express.static(path.join(__dirname, '../public')));


var getDistanceInTime = function(socketId) {
    return new Promise(function(resolve, reject) {
        request({url:'https://maps.googleapis.com/maps/api/distancematrix/json', 
            qs: {
                units: 'imperial',
                origins: lobby.users[socketId].currentLocation.x+ ', ' + lobby.users[socketId].currentLocation.y,
                destinations: lobby.destination.x + ', ' + lobby.destination.y,
                key: 'AIzaSyDdwJ5vgTKaqsvTezIFrrUQBoGfv9-N9PQ'
            }
        }, function(err, response, body) {
            if(err) { console.log(err); return; }
            var res = JSON.parse(body);
            resolve(res.rows[0].elements[0].duration.value);
          });
    });
}

io.on('connection', function (socket) {
    socket.on('joinLobby', function(data) {
        lobby.users[socket.id] = {
            name: data.name,
            currentLocation: {
                
            },
            eta: "-1", //estimated time of arrival
            ttl: "-1", //time to leave
        };
        //socket.emit('joinedLobby');
    });

    socket.on('setDestination', function(data) {
       lobby.destination.x = data.x;
       lobby.destination.y = data.y;
       socket.emit('destinationSet');
    });

    socket.on('updateLocation', function(data) {
        lobby.users[socket.id].currentLocation.x = data.x;
        lobby.users[socket.id].currentLocation.y = data.y;
        //socket.emit('updatedLocation');
    });

    socket.on('departed', function() { //calculate everyones time to leave
        var maxTime = 0;
        Object.keys(lobby.users).forEach(function(socketId) {
            getDistanceInTime(socketId).then(res => {
                console.log(res);
                if (res > maxTime) {
                    maxTime = res;
                }
                lobby.users[socketId].ttl = res;
            });

            Object.keys(lobby.users).forEach(function(socketId) {
                lobby.users[socketId].ttl = maxTime - lobby.users[socketId].ttl;
            })
        });
    });

    socket.on('disconnect', function(){
        console.log("disconnected");
    });

});

server.listen(8080, function() {
    console.log("Server listening on 8080");
});
