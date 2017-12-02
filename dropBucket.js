 var express = require('express'),
//		 csvdata = require('csvdata'),
		 fs = require('fs'),
//		  jsonexport = require('jsonexport'),
//		  diskspace = require('diskspace'),

		 request = require('request');
//     poster =  require("poster"),
//		 googleapis = require('googleapis'),
//		 googleAuth = require('google-auth-library');
		 
var cors = require('cors');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var AWS = require('aws-sdk');

//init server
var app = express();

app.use(cors({origin: '*'}));

app.get('/search', function (req, res) {
	
	//resopond to no query
		 res.send("YO! search query is empty, please add ?q=quary at the end of the url");
	logRequest(req.protocol + '://' + req.get('host'),req.originalUrl,req.ip);
});
		//resopond to unrouted request
app.get('/', function (req, res) {
  console.log("requested  to: /");
	res.send("response..: Success!! ");
	logRequest(req.protocol + '://' + req.get('host'),req.originalUrl,req.ip);
 

});  
			//catch favicon request
app.get('/favicon.ico', function (req, res) {
}); 
		//resopond to weird routs
app.get('/*', function (req, res) {
  console.log("requested /*undefined rout");
	res.send("..this was a weird rout <br>");
	logRequest(req.protocol + '://' + req.get('host'),req.originalUrl,req.ip);

});  

function logRequest(requestURL, requestQuary, requestIp){
	console.log("requested to: " + requestURL);				
	console.log("client request: " + JSON.stringify( requestQuary));
	console.log("at: " + new Date().toISOString() + "\nfrom: " + requestIp + "\n - done - \n");
}
var ip = process.env.IP || '127.0.0.1';
var port = process.env.PORT || '3000';

app.listen(port, () => console.log('running on port 3000'));
console .log('\n## Hi there, Welcome to node server ##');







































