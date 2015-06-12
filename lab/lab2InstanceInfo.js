var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
var ec2 = new AWS.EC2();
var instanceData = '';

var task =  function(request, callback){
	instanceData='';
	
	//Parametry do wyszukiwania moich instancji
	var parms = {//	  InstanceIds: [		//	    'i-85c4368a',		//	  ]
		Filters: [
			{
				Name: 'key-name',
				Values: [
					'pawel.czubak',
				]
			}
		]	
	};

	//funkcja opisuje moje instancje
	ec2.describeInstances(parms, function(err, data) {
		if (err) {
			console.log(err, err.stack);
		}
		else     {
			console.log("Liczba znalezionych instancji: "+data.Reservations.length);
			instanceData=instanceData+" Ilosc twoich instancji: "+data.Reservations.length+"<br><br>";
			for(i=0; i< data.Reservations.length; i++){
				instanceData+="<b>instance nr: "+i+"</b><br>";
				instanceData+="<a href=\"/iinfo?run="+data.Reservations[i].Instances[0].ImageId+"\" style=\"color:red;\">RUN</a><br>";
				instanceData+="Reservation id: "+data.Reservations[i].ReservationId+"<br>";
				instanceData+="InstanceID: "+data.Reservations[i].Instances[0].InstanceId+"<br>";
				instanceData+="Private DNS: "+data.Reservations[i].Instances[0].PrivateDnsNam+"<br>";
				instanceData+="Public DNS: "+data.Reservations[i].Instances[0].PublicDnsName+"<br>";
				instanceData+="InstanceType: "+data.Reservations[i].Instances[0].InstanceType+"<br>";
				instanceData+="Launch Time: "+data.Reservations[i].Instances[0].LaunchTime+"<br>";
				instanceData+="Other: "+JSON.stringify(data.Reservations[i], null, 4)+"<br>";
			}
		}	
	});	


	//czy istnieje instancja do uruchomienia
	var runx = request.query.run ? 1 : 0;
	if (runx){
		var run = request.query.run;

		var params = {
			ImageId: run, /* required */
			MaxCount: 1, /* required */
			MinCount: 1, /* required */
			EbsOptimized: false,
			InstanceType: 't1.micro', /* | m1.small | t2.micro | t2.small*/
			KeyName: 'pawel.czubak',
			Monitoring: {
				Enabled: false
			},
			Placement: {
				AvailabilityZone: 'us-west-2b',
				GroupName: '',
				Tenancy: 'default'
			},
		};//console.log(params);
		ec2.runInstances(params, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred //	 else     console.log(data);           // successful response
			else console.log("Uruchomiono instancje: "+data.Instances[0].InstanceId);

			//tagujemy instancję
			var d = new Date();
			var tagInstance = d.getTime();
			tagInstance="pawel.czubak."+tagInstance;
			var tagparams = {
				Resources: [data.Instances[0].InstanceId], 
				Tags: [
					{Key: 'Name', Value: tagInstance}
				]
			};
			ec2.createTags(tagparams, function(err) {
				console.log("Tagging instance for: "+data.Instances[0].InstanceId+": "+tagInstance+" Result: ", err ? "failure" : "success");
				if(err)console.log(err);
			});
		});
	}
	
	//wyświetla stronę po sekundzie
	setTimeout(function() {
		var run = request.query.run ? request.query.run : "None instance to start";
		callback(null, "Start instance: "+run+"<br>Instance data: <pre>"+instanceData+"</pre>");
	}, 1000);
}

exports.lab = task
