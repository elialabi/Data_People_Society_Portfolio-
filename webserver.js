var http = require('http');
var express = require('express');
var mqtt = require('mqtt');

//send username and password to mqtt server
const options = {
    username: 'student',
    password: 'austral-clash-sawyer-blaze',
    rejectUnauthorized: true
};

const client = mqtt.connect('mqtt://mqtt.cci.arts.ac.uk:1883/', options);

var app = express();
app.use(express.static('public'));
app.set('port','8080');
//create server
var server = http.createServer(app);
server.on('listening', ()=> {
    console.log('Listening on port 8080');
});

server.listen(8080, '127.0.0.1');
//create web socket
var soc_io = require('socket.io')(server, {
    allowEIO3: true,
    "upgrades":["websocket"],
    "pingInterval":30000,
    "pingTimeout": 1000
});

soc_io.sockets.on('connection', function(socket){
    
    console.log('Client connected: ' + socket.id);


    socket.on('disconnect', ()=> console.log('Client has disconnected'));
    console.log(socket.connected);

});

//send data from MQTT server to client
client.on('message', function(topic, message){
    
    let data = String.fromCharCode.apply(null, message);
    console.log("message: "+message);
    let data_array = data.split(',');
    console.log("data_array: "+data_array);
    soc_io.sockets.emit('data_array', data_array);

});

client.on('connect', ()=>{
    console.log('Connected!');
});

client.on('error', (error)=>{
    console.log('Error:', error);
});

//subscribe to MQTT topic
client.subscribe('airgradient/readings/0cb815082660');

