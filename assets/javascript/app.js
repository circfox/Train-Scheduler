$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCxbl2jcNhb1ikjny_laAcThzRqbppf_VY",
    authDomain: "train-scheduler-44f80.firebaseapp.com",
    databaseURL: "https://train-scheduler-44f80.firebaseio.com",
    projectId: "train-scheduler-44f80",
    storageBucket: "train-scheduler-44f80.appspot.com",
    messagingSenderId: "180559759519"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  
	// add new train
	$("#add-train").on("click", function(event){
		event.preventDefault();

		// User input is assigned to variables
		var trainName = $("#train-input").val().trim();
		var trainSpeed = $("#speed-input").val().trim();
		var destination = $("#destination-input").val().trim();
		var arrivalTime = moment($("#arrival-time-input").val().trim(), "HH:mm").subtract(10, "years").format("X");;
		var frequency = $("#freq-input").val().trim();

		// Test for variables entered
		console.log(trainName);
		console.log(trainSpeed);
		console.log(destination);
		console.log(arrivalTime);
		console.log(frequency);

		// temp holding before pushing to firebase
		
		var newTrain = {
			_n: trainName,
			_v: trainSpeed,
			_x: destination,
			_t: arrivalTime,
			_f: frequency,
		}

		// push data to Firebase
		database.ref().push(newTrain);

		// reset textbox contents
		$("#train-input").val("");
		$("#speed-input").val("");
		$("#destination-input").val("");
		$("#arrival-time-input").val("");
    $("#freq-input").val("");                
                                              
	});

	database.ref().on("child_added", function(childSnapshot){

		console.log(childSnapshot.val());

		// assign firebase variables to snapshots.
		var _n = childSnapshot.val().trainName;
		    _v = childSnapshot.val().trainSpeed
		var _x = childSnapshot.val().destination;
		var _t = childSnapshot.val().arrivalTime;
		var _f = childSnapshot.val().frequency;
		
		var train_t = moment().diff(moment.unix(_t), "minutes");
		var delta_t = moment().diff(moment.unix(train_t), "minutes") % _f ;
    var remainder = moment().diff(moment.unix(delta_t), "minutes") % _f;
		var minutesAway = _f - remainder;

		var next_t = moment().add(minutesAway, "min").format("hh:mm A"); 
		
		// Test for correct times and info
		console.log(minutesAway);
		console.log(next_t);
		console.log(moment().format("hh:mm A"));
		console.log(next_t);
		console.log(moment().format("X"));

		// Append train info to table on page
		$("#trainTable > tbody").append("<tr><td>" + _n + "</td><td>"+ _v + "</td><td>" + _x + "</td><td>" + _f + " mins" + "</td><td>" + minutesAway + "</td><td>" + next_t + "</td></tr>");

	});
});