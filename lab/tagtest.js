var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
var ec2 = new AWS.EC2();
var instanceID = 'i-72498d7d';


var task =  function(request, callback){
	
	
	
	var d = new Date();
    var tagInstance = d.getTime();
	tagInstance="pawel.czubak."+tagInstance;
	var tagparams = {Resources: [instanceID], Tags: [
		{Key: 'Name', Value: tagInstance}
	  ]};
	  ec2.createTags(tagparams, function(err) {
		console.log("Tagging instance", err ? "failure" : "success");
		console.log(err);
	  });


	console.log("Instance IDDDDDDDDDDDDDDDD: "+instanceID);


	setTimeout(function() {
		var run = request.query.run ? request.query.run : "None instance to start";
		callback(null, "ttest return");
	}, 1000);
}

exports.lab = task
