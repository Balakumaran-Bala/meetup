var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, '/../')))

io.on('connection', function (socket) {

    socket.on('joinLobby', function(data) {
        
    });

    socket.on('setDestination', function(data) {
       
    });

    socket.on('updateLocation', function(data) {

    });

    socket.on('disconnect', function(){
        
    });

});

server.listen(8080, function() {
    console.log("Server listening on 8080");
});
