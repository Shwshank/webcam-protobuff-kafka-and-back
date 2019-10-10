var express = require('express');
var kafka = require('kafka-node');
var cors = require('cors')

var app = express();
app.use(cors())

var bodyParser = require('body-parser')
app.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var Producer = kafka.Producer,
    client = new kafka.KafkaClient(),
    producer = new Producer(client);

let payloads = [{ topic: 'Posts', messages: 'Dummy Message1', partition: 0 }]

producer.on('ready', function () {
    console.log('Producer is ready');
});

producer.on('error', function (err) {
    console.log('Producer is in error state');
    console.log(err);
})

app.get('/',function(req,res){
    res.json({greeting:'Kafka Producer'})
});

app.post('/sendMsg',function(req,res){
   var sentMessage = JSON.stringify(req.body.message);
   payloads = [
       { topic: req.body.topic, messages:sentMessage , partition: 0 }
   ];
   producer.send(payloads, function (err, data) {
           res.json(data);
   });
})

app.post('/postBase64',function(req,res){
   if(req.body.data) {
    console.log("data received");
   }

   payloads = [
       { topic: "webcam", messages:req.body.data , partition: 0 }
   ];

   producer.send(payloads, function (err, data) {
     if(err) {
       console.log("error ");
       console.log(err);
     }

     res.json({
       success: true
     })
   });

})

app.listen(5001,function(){
  console.log('Kafka producer running at 5001')
})
