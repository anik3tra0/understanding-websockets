var webSocketServer = require('websocket').server, http = require('http');
var net = require('net');

var tcpServer = net.createServer();
tcpServer.on('connection', handleConnection);

tcpServer.listen(9000, function() {
  console.log('server listening to %j', tcpServer.address());
});

var socket = new webSocketServer({
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
    var index = connections.indexOf(connection);
    connections.splice(index, 1);
    console.log('connection from %s closed', remoteAddress);
    console.log(connections);
    console.log('connection closed');
  });
});


function handleConnection(conn) {

  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);

  conn.on('data', onConnData);
  conn.once('close', onConnClose);
  conn.on('error', onConnError);

  function onConnData(d) {
    console.log('connection data from %s: %j', remoteAddress, d);
    for (i = 0; i < connections.length; i++) {
      connections[i].sendUTF(d);
    }
  }

  function onConnClose() {
    var index = connections.indexOf(conn);
    connections.splice(index, 1);
    console.log('connection from %s closed', remoteAddress);
    console.log(connections);
  }

  function onConnError(err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}
