var lab1_1 = require("./lab/lab1_1").lab
var example_1 = require("./example_1").lab;
var instanceInfo = require("./lab/lab2InstanceInfo").lab;
var ttest = require("./lab/tagtest").lab;
var myTest = function(request, callback){
        var optionalParameter = request.query.op ? request.query.op : "there is no optional parameter";
        callback(null, "WoW it's working. Oprional parameter: " + optionalParameter);
}

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

var PORT = 8080;


var urlMap = [
	{path: "/", action:__dirname + "/static/index.html"},	 
	{path: "/digest", action: lab1_1},	
	{path: "/example_1", action: example_1},
	{path: "/myTest", action: myTest}, 
	{path: "/iinfo", action: instanceInfo},
	{path: "/ttest", action: ttest},
	];

var service = require("./lib/service").http(urlMap);

service(PORT);

