 var express = require('express'),
//		 csvdata = require('csvdata'),
		 fs = require('fs'),
//		  jsonexport = require('jsonexport'),
//		  diskspace = require('diskspace'),

		 request = require('request');
//     poster =  require("poster"),
		 
var cors = require('cors');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var AWS = require('aws-sdk');

//init server
var app = express();
app.set('view engine','ejs');
app.set('views', 'assets/views');
app.use(cors({origin: '*'}));

//tamplate locals
app.locals.local = 'success';
app.locals.buckets = {};
app.locals.policy = [];
//template vars
var ownerName;

//vars
var s3 = new AWS.S3();
var policyCounter;

//resopond to main ui
app.get('/dashboard', function (req, res) {
	
	var response =
	'<head><style>td{padding:5px;color:black;}</style></head><body style="padding=0px;margin:0px; font-family:arial;"><div style="background-color:cornflowerblue; color:white; padding:5px;"><h4>QUANTUM DropBucket for AWS</h4>' +
	'<h6> Owner: ';
	listBuckets();
	//finished list request
	eventEmitter.once('gotBuckets',function(){
		ownerName = app.locals.buckets.Owner.DisplayName;
		policyCounter = 0;
		app.locals.policy = [];
		
			para = {Bucket: app.locals.buckets.Buckets[0].Name};
			listPermissions(para);

			eventEmitter.once('gotPolicy',function(){
			res.render('index', {owner: ownerName,buckets: app.locals.buckets, req: req});
			logRequest(req.protocol + '://' + req.get('host'),req.originalUrl,req.ip);
			//to fix reset
		});
		
	});
	

});


app.get('/create-bucket', function (req, res) {
	//creat bucket
	var createParams = {
			Bucket: "test-wqeasda" ,
			CreateBucketConfiguration: {
					LocationConstraint: "us-west-1"
					}
 			};
	CreateBucket(createParams);
	 
	logRequest(req.protocol + '://' + req.get('host'),req.originalUrl,req.ip);
});

//resopond to unrouted request
app.get('/', function (req, res) {
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

function listBuckets(){
	s3.listBuckets(function(err, data) {
  	if (err) console.log(err, err.stack); // an error occurred
  	else {
		console.log(data);
		app.locals.buckets = data;
		eventEmitter.emit('gotBuckets');
		}           // successful response
	});
}

function listPermissions(parameters){

	s3.getBucketAcl(parameters, function(err, data_policy) {
		if (err) {
		console.log("AWS Acl error: " + err, err.stack);
		if(policyCounter == app.locals.buckets.Buckets.length -1 ){
				console.log('gotPolicy emitted');
				eventEmitter.emit('gotPolicy');
		}else{
				policyCounter++;
				listPermissions(parameters);
		}
		
//		console.log(err, err.stack);
		} // an error occurred
		else{
		console.log("policy: " + JSON.stringify( data_policy) );
		
		app.locals.policy[policyCounter] = data_policy;
		if(policyCounter == app.locals.buckets.Buckets.length -1 ){
				console.log('gotPolicy emitted');
				eventEmitter.emit('gotPolicy');
		}else{
				policyCounter++;
				listPermissions(parameters);
		}
		}               // successful response
	});
}

function CreateBucket(paramsCreate){
		s3.createBucket(paramsCreate, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);           // successful response
   /*
   data = {
    Location: "http://examplebucket.s3.amazonaws.com/"
   }
   */
 });
}
		


var ip = process.env.IP || '127.0.0.1';
var port = process.env.PORT || '3000';

app.listen(port, () => console.log('running on port 3000'));
console .log('\n## Hi there, Welcome to node server ##');







































