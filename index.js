var server = require('websocket').server, http = require('http');

var socket = new server({
  httpServer: http.createServer().listen(1337)
});

var connections = [];

socket.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  connections.push(connection)

  connection.on('message', function(message) {
    let msg = message.utf8Data
    console.log(msg);
    for (i = 0; i < connections.length; i++) {
      connections[i].sendUTF(msg);
    }
  });

  connection.on('close', function(connection) {
    console.log('connection closed');
  });
});
