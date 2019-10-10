var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient();
    consumer = new Consumer(client,
        [{ topic: 'webcam', offset: 0}],
        {
            autoCommit: false
        }
    );

    var webSocketServer = require('websocket').server;
    var http = require('http');

    var server = http.createServer(function(request, response) {});
    server.listen(1337, function() {
      console.log((new Date()) + " Server is listening on port 1337");
    });

    var wsServer = new webSocketServer({
      httpServer: server
    });

    wsServer.on('request', function(request) {
      console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

      var connection = request.accept(null, request.origin);

      consumer.on('message', function (message) {
        console.log(message.offset);
        connection.sendUTF(JSON.stringify({ type: message.value  }));

      });

      consumer.on('error', function (err) {
          console.log('Error:',err);
      })

      consumer.on('offsetOutOfRange', function (err) {
          console.log('offsetOutOfRange:',err);
      })


      connection.on('message', function(message) {
        console.log(message);
      })
    })
