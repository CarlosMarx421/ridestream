// JavaScript Document
 var directionDisplay;
  var directionsService = new google.maps.DirectionsService();
  var map;
  var marker = new google.maps.Marker({
    map: map,
  });

/*
source code: http://gmaps-samples-v3.googlecode.com/svn/trunk/draggable-markers/draggable-markers.html

var geocoder = new google.maps.Geocoder();

function geocodePosition(pos) {
  geocoder.geocode({
    latLng: pos
  }, function(responses) {
    if (responses && responses.length > 0) {
      updateMarkerAddress(responses[0].formatted_address);
    } else {
      updateMarkerAddress('Cannot determine address at this location.');
    }
  });
}
*/


  function initialize() {
	
	var rendererOptions = {
		draggable: true,
	//end redererOptions
	};
	  
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    var chicago = new google.maps.LatLng(42.73352,-84.48383);
    var myOptions = {
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: chicago,
	//end myOptions
	}
	
	//create the world of the dream (define where the map's gonna go
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	//and the subject (google) fills it with it's subconscious 
    directionsDisplay.setMap(map);
	//tell google where the printed directions will go
	directionsDisplay.setPanel(document.getElementById("directions_detail"));
	
	//add event listener for changed directions, calling function some_method
	google.maps.event.addListener(displayer, 'directions_changed', cust_waypts);
	//initialize some_method()
	var cust_waypts = function () {
	//call the via_waypoint object
    var cust_waypoints = displayer.directions.route[0].legs[0].via_waypoint;
};



//end initialize()
}
  
  //adding waypoints to the select box
	function addWaypoint(){
		
		//get waypoint select box
		var waypointBox = document.getElementById("waypoints"); 
		//get value from waypoint text box
	  	var waypoint = document.getElementById("add_waypoint").value; 
		//add the new waypoint to existing waypoints
		waypointBox.options[waypointBox.options.length] = new Option( waypoint, waypoint, true); 
	//end addWaypoint()
	}
	
  //Google Directions API Magic
  function calcRoute() {
	//get start string from Start input box
    var start = document.getElementById("start").value;
	//get end string from End input box
    var end = document.getElementById("end").value;
	//set up an array for waypoints
    var waypts = [];
	//define where the waypoints will come from
    var checkboxArray = document.getElementById("waypoints");
	//loop (the dreaded loop) to retrieve any waypoints from that box
    
	for (var i = 0; i < checkboxArray.length; i++) {
		//if any options in the select box are selected, add them
      if (checkboxArray.options[i].selected == true) {
        waypts.push({
			//set up parameters to push to the Directions API
            location:checkboxArray[i].value,
			//make them explicit waypoints that separate the route into legs (as opposed to waypoints that simply change the route itself)
            stopover:true});
	  //end if loop
      }
	//end calcRoute()
    }

	//set up the request parametars being sent to Directions API
    var request = {
        origin: start, 
        destination: end,
        waypoints: waypts,
		//let google decide the best order for the waypoints...makes life a TON easier
        optimizeWaypoints: true,
		//tell Directions API that you're biking on this particular adventure
        travelMode: google.maps.DirectionsTravelMode.BICYCLING,
		
	//end request
    };
	
	//call the Directions Service API, pass the request variable (above) and call a function asking for the response and status objects
    directionsService.route(request, function(response, status) {
		//if the status is good on Direcions' end, parse the response object
      	if(status == google.maps.DirectionsStatus.NOT_FOUND){
			alert("For some reason, either your start location, or one of your waypoints didn't sit with Google...try a different search term");
	  	//go through some else if's to make sure the user didn't screw something up (values are coming from Directions API documentation)
		} else if(status == google.maps.DirectionsStatus.ZERO_RESULTS){
			alert("Sorry! Google can't find a match to either your start location or one of your waypoints...try a different search term");
		} else if(status == google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED){
			alert("Google only allows for 8 waypoints per map...we're working on a workaround for this, but in the meantime, could you make due with 8 waypoints?");
		} else if(status == google.maps.DirectionsStatus.INVALID_REQUEST){
			alert("Something went wrong…we're fixing it :D");
		} else if(status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT){
			alert("Seems like we're a bit popular today…could you try this again later?");
		} else if(status == google.maps.DirectionsStatus.REQUEST_DENIED){
			alert("WHAT DID YOU DO???");
		} else if(status == google.maps.DirectionsStatus.UNKNOWN_ERROR){
			alert("So…looks like Google messed up…the documentation says that you can just try again, and it'll do it…so try again, won't you?");
		
		//if the return comes up OK, actually run the query
		}else if (status == google.maps.DirectionsStatus.OK) {
		  
		  
		  //pass the response object to the map
        directionsDisplay.setDirections(response);
		
		//set up a route variable for the upcoming loop
        var route = response.routes[0];
		//set up a variable for the route summary, define the <div> where this will be presented to the user
        var summaryPanel = document.getElementById("directions_panel");
		
		//clear the <div>
        summaryPanel.innerHTML = "";
		//turn direcitons_panel "on"...gives the div a color
		summaryPanel.className = "directions_panel_on";
		
		// For each route, display summary information.
        for (var i = 0; i < route.legs.length; i++) {
			//set up a route segment variable
          var routeSegment = i + 1;
          summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
          summaryPanel.innerHTML += route.legs[i].start_address + " to ";
          summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
          summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
        //edn for loop
		}
	  
	/*
	  // Add dragging event listeners.
	  google.maps.event.addListener(marker, 'drag', function(response, status) {
		if (status == google.maps.DirectionsStatus.OK){
			*/
			//GET THE JSON Object
			var newString = JSON.stringify(response);
			//set up area to place drop directionsResponse object string
			var directions_response_panel = document.getElementById("directions_response");
			//dump any contents in directions_response_panel
			directions_response_panel.innerHTML = "";
			//add JSON string to it 
			directions_response_panel.innerHTML = "<code>" +  newString + "</code>"; /*
		} else {
			alert("dude");
		  };
	  });
 */
	  

	  //map.addEventListener("dragend", google.maps.MapCanvasProjection.marker.dragend, function(response, status){});
	  
	  //end if loop
      }
	//end directionService() function  
    });
  //end calcRoute() function
  }
  
  //AJAX FUNCTIONS TO SAVE THIS WALTER CHILCOTTING MAP INFORMATION (if you get that reference, french the llama, you're awesome…you may contact me to shake hands, greetings and schedules for lunch plans [@JoshDComp])

	function saveChanges() {
		
		//GET THE JSON Object
		var newString = JSON.stringify(response);
	
		//in the words of the great @McleodM3: This calls the runAjax()  passing the 'newString' variable as an argument function below and allows AJAX to run all of its AJAX-y goodness
		runAjax(newString);
	//end saveChanges() function
	}

		// set a global variable , , , not sure why . . . @McleodM3 gave tme this base code
		var saveRequest;
		
	function runAjax(newString)
		{
		   // function returns "AJAX" object, depending on web browser
		   // this is not native JS function!
		   saveRequest = getHTTPObject();
		   
		   saveRequest.onreadystatechange = sendData;
		   saveRequest.open("GET", "ajax.php?json="+ newString, true); //add variable of the JSON string
		   saveRequest.send(null);
		
		//end runAjax() function
		}
		
		
		// function is executed when var request state changes
		function sendData()
		{
		   // if request object received response
		   if(request.readyState == 4)
		   {
				// ajax.php response
				var ajaxresponsevalue= request.responseText;
			
				if (ajaxresponsevalue != "success") {
			
				alert("Something went wrong in AJAX!")
				
				//end second if statement begin else statement
				} else {
			
					//fun confirm page
					
					//add mapsave php   
					window.location = "mapsave.php";
			
				// end else statement		
				}
		//end first if statement
		}
	//end runAjax()	
	}
  
  
  
  
  
  
  
  
  
  