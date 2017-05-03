/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
// References: https://www.ibm.com/blogs/bluemix/2016/05/bot-for-facebook-messenger-using-bluemix/
// Code for broker reused from: https://gist.github.com/eyal-he/0e5eca949d84fd863911a6dfec39beb4?cm_mc_uid=45563992068014838548237&cm_mc_sid_50200000=1492846807
// MDT Project - Carnegie Mellon University

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// This code is called only when subscribing the webhook //
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'mySecretAccessToken') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
})






// Incoming messages reach this end point //
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            text = event.message.text;

        var options = {
		  uri: 'https://mymdtapplication.mybluemix.net',
		  path: '/conv',
		  method: 'POST',
		  port: '443',
		  headers: {
			  'Content-Type': 'application/json'
		  },
		  json:{
			 "text":text
		  }
		};
		
		console.log('Text**************: ' + text);
		
		request(options, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
			console.log(body.id) // Print the shortened url.
			
       
			
		sendMessage(sender, body);
			
		  }
		   else {
			sendMessage(sender, "Failure");
            console.log("error: " + error)
            console.log("response.statusCode: " + response.statusCode)
            console.log("response.statusText: " + response.statusText)
        }
		});
		
		
		
		
		//var req = http.request(options, function(res){
		 // console.log('Status: ' + res.statusCode);
		 // console.log('Headers: ' + JSON.stringify(res.headers));
		 // res.setEncoding('utf8');
		 // res.on('data', function (body) {
		//	console.log('Body: ' + body);
		//	var json = JSON.parse(body);
			//sendMessage("Watson", json.output.text);
		 // });
		//});
		//req.on('error', function(e) {
		//  console.log('problem with request: ' + e.message);
		//});
		// write data to request body
		//var post_data = querystring.stringify({
		//	'text' : text
		//});
		
		
		//req.write(post_data);
		//req.end();
		
		
		
		 }
		 }
		 //xhr.open("POST", "https://mymdtapplication.mybluemix.net/conv", true);
		 //xhr.setRequestHeader("Content-type", "application/json");
		 //xhr.send(JSON.stringify(payload));
		 
				
		
		res.sendStatus(200);}
);


// This function receives the response text and sends it back to the user //
function sendMessage(sender,text) {
    messageData = {
        text: text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

var token = "EAAT5sv5U2ccBAHxhU53flXFUa8cKdI0rUqkoyqk7TquoK7V1D2kWBWxZAtoMNnzR3Ca2HimI06ddr8UkXdYE3RjhqGZAZBUsyVFtdt1OcuZAOvX4vmgFMnimB0LnJxAforq8S3816QxLqM4nBGDZCdVtjxME9l0yCiZAL5cHG94wZDZD";

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});