// JavaScript Document
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var map;
 	var custResponse;
  	var marker;
	var start;
	var end = new google.maps.LatLng (42.276967,-83.734682);
	var dirEnd = '440 Church St, Ann Arbor, MI 48109'; //string for directions so the riders are going to the right place
	var waypts = [];
	var newObj;
	//geocoder variable…this is for the autocomplete functionality
	var geocoder;
	
	var counter = 0;
  
	//start up the google map
	function initialize() {
	
		var rendererOptions = {
			draggable: true,
		//end redererOptions
		};
		  
		directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
		var annArbor = new google.maps.LatLng(42.277817,-83.733673);
		var myOptions = {
		  zoom: 13,
		  mapTypeId: google.maps.MapTypeId.ROADMAP,
		  center: annArbor,
		//end myOptions
		}
		
		//create the world of the dream (define where the map's gonna go
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		//and the subject fills it with it's subconscious (Call the map from Directions and place it in the div we've created)
		directionsDisplay.setMap(map);
		//tell google where the printed directions will go
		directionsDisplay.setPanel(document.getElementById("directions_detail"));
		
		
		
			
			
			
			
			
		var contentString = '<div class="marker_info_box">'+
							'<b><a href="http://webservices.itcs.umich.edu/drupal/cw2011/" target="_blank" title="Official Site for the Computers and Writing Conference">Computers &amp; Writing Conference 2011, Ann Arbor, MI</a></b>' +
							'<img width="140" src="http://www.lsa.umich.edu/UMICH/sweetland/Home/North%20Quad.jpg"/>' +
							'<p><a href="http://www.lsa.umich.edu/sweetland/" title="Sweetland Center for Writing at the University of Michigan" target="_blank">Sweetland Center for Writing at UofM</a></p>' +
							'</div>';
        
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
 
    var marker = new google.maps.Marker({
        position: end,
        map: map,
        title: 'Sweetland Center for Writing at UofM'
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
			
			
			
			
			
			
			
			
			
			
			
  	
	
	//geocoder (for autocomplete)
	geocoder = new google.maps.Geocoder();
	
	
	
	//end initialize()
	};
	
	
		
		
	
  function autocomplete_start(){
	  
    $("#start_txt").autocomplete({
      //This bit uses the geocoder to fetch address values
      source: function(request, response) {
        geocoder.geocode( {"address": request.term }, function(results, status) {
          response($.map(results, function(item) {
            return {
              label:  item.formatted_address,
              value: item.formatted_address,
            }
          }));
        })
      },
      //This bit is executed upon selection of an address
      select: function(event, ui) {
		$("#start_txt").val(ui.item.label);
      }
    });
  };
  
  function autocomplete_waypoint(){
	  
    $("#add_waypoint").autocomplete({
      //This bit uses the geocoder to fetch address values
      source: function(request, response) {
        geocoder.geocode( {"address": request.term }, function(results, status) {
          response($.map(results, function(item) {
            return {
              label:  item.formatted_address,
              value: item.formatted_address,
            }
          }));
        })
      },
      //This bit is executed upon selection of an address
      select: function(event, ui) {
		$("#add_waypoint").val(ui.item.label);
      }
    });
  };
  

	
	
	
	
	
	function start_click(){
		start = document.getElementById("start_txt").value;
		if(!start){
			alert("We need to know where you want to start your trip");
		}else{
			calcRoute();
		};
	//end start_click()
	};
	
	var waypointBox;
	var waypoint;
	
	//adding waypoints to the select box
	function addWaypoint(){
		//get value from waypoint text box
	  	var waypoint = document.getElementById("add_waypoint").value;
		if(!waypoint){
			alert("It looks like you didn't put anything into the box…we've gotta have something to send to Google :D")
		} else {
		
			//get waypoint select box
			var waypointBox = document.getElementById("waypoints"); 
			 
			//add the new waypoint to existing waypoints
			waypointBox.options[waypointBox.options.length] = new Option(waypoint, waypoint, true, true); 
			
			
			//loop (the dreaded loop) to retrieve any waypoints from that box
			for (var i = 0; i < waypointBox.options.length; i++) {
				//if any options in the select box are selected, add them to the waypoints array
			  if (waypointBox.options[i].selected == true) {
				waypts.push({
					//set up parameters to push to the Directions API
					location: waypointBox[i].value,
					//make them explicit waypoints that separate the route into legs (as opposed to waypoints that simply change the route itself)
					stopover:true});
			  //end if loop
			  };
			//end for loop
			}; 
			
			calcRoute();
		//end if/else statement
		};
				
			
	
	//end addWaypoint()
	};
	
	function updateRoute(){
		
		//reset waypts array
		waypts = [];
		//get waypoint select box
			var waypointBox = document.getElementById("waypoints");
		
		//loop (the dreaded loop) to retrieve any selected options from that box
			for (var i = 0; i < waypointBox.options.length; i++) {
				//if any options in the select box are selected, add them to the waypoints array
			if (waypointBox.options[i].selected == true) {
				//set up parameters to push to the Directions API
				waypts.push({
					//declare locatoin for google maps
					location: waypointBox[i].value,
					//make them explicit waypoints that separate the route into legs (as opposed to waypoints that simply change the route itself)
					stopover:true});
			  //end if loop
			  };
			//end for loop
			}; 
			
			calcRoute();
		
	//end uptateRoute
	};
	
		
	
	
	
	  //Google Directions API Magic
  function calcRoute() {
	
	
	
		//set up the request parametars being sent to Directions API
		var request = {
			origin: start, 
			destination: dirEnd,
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
		} else if(status == google.maps.DirectionsStatus.ZERO_RESULTS)
			{
			alert("Sorry! Google can't find a match to either your start location or one of your waypoints...try a different search term");
		} else if(status == google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED)
			{
			alert("Google only allows for 8 waypoints per map...we're working on a workaround for this, but in the meantime, could you make due with 8 waypoints?");
		} else if(status == google.maps.DirectionsStatus.INVALID_REQUEST)
			{
			alert("Something went wrong…we're fixing it :D");
		} else if(status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT)
			{
			alert("Seems like we're a bit popular today…could you try this again later?");
		} else if(status == google.maps.DirectionsStatus.REQUEST_DENIED)
			{
			alert("WHAT DID YOU DO???");
		} else if(status == google.maps.DirectionsStatus.UNKNOWN_ERROR)
			{
			alert("So…looks like Google messed up…the documentation says that you can just try again, and it'll do it…so try again, won't you?");
		//if the return comes up OK, actually run the query
		}else if (status == google.maps.DirectionsStatus.OK) 
			{
				
				//waypointBoxVals();
				//turn the waypoint_contain div on
				document.getElementById("waypoint_contain").className = "on";
				//turn on the save button
				document.getElementById("final_submit").disabled=false;
				//change the Start Button to Change
				document.getElementById("start_button").value = "Change";
				
				//IMPORTANT! This is the Directions JSON object
				mapObj = directionsDisplay.directions;
				
				//pass the response object to the map
				directionsDisplay.setDirections(response);
				
				newobj = directionsDisplay.response;
				
				//set up a route variable for the upcoming loop
				var route = response.routes[0];
				//set up a variable for the route summary, define the <div> where this will be presented to the user
				var summaryPanel = document.getElementById("directions_panel");
				
				//clear the <div>
				summaryPanel.innerHTML = "";
				//turn direcitons_panel "on"...gives the div a color
				summaryPanel.className = "on";
				
				// For each route, display summary information.
				for (var i = 0; i < route.legs.length; i++) {
					//set up a route segment variable to display a 1-based segment for the segment summary in html
				  var routeSegment = i + 1;
				  summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
				  summaryPanel.innerHTML += route.legs[i].start_address + " to ";
				  summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
				  summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
				
				//end for loop
				};
			  
				//end last else if()
				};
	//end directionsService() function  
    });	
  //end calcRoute() function
  };
  
  
  
  //test function to print out directionsDisplay.directions
  function try_this(){
								//GET THE JSON Object
								var newString = JSON.stringify(directionsDisplay.directions);
								
								//set up area to place drop directionsResponse object string
								var directions_response_panel = document.getElementById("directions_response");
								//dump any contents in directions_response_panel
								directions_response_panel.innerHTML = "";
								//add JSON string to it 
								directions_response_panel.innerHTML = "<pre>" + newString + "</pre>";
						};
  
  
  //AJAX FUNCTIONS TO SAVE THIS WALTER CHILCOTTING MAP INFORMATION (if you get that reference, french the llama, you're awesome…you may contact me to shake hands, greetings and schedules for lunch plans [@JoshDComp])

	function savechanges() {
		alert("Thanks for demoing my directions builder! Soon I'll have a way to save and rebuild this…but for now…End of Line");
		/*//GET THE JSON Object
		var directions = directionsDisplay.directions;
		//stringify the JSON object…not advisable to send to PHP this way (this is so I could see the js object)
		var newString = JSON.stringify(directions);
		//set up area to place drop directionsResponse object string
		var directions_response_panel = document.getElementById("directions_response");
		//dump any contents in directions_response_panel
		directions_response_panel.innerHTML = "";
		//add JSON string to it 
		directions_response_panel.innerHTML = "<pre>" + newString + "</pre>";
		//run the ajax
		runAjax(directions);
	//end saveChanges() function*/
	
	};

		// set a global variable , , , not sure why . . . @McleodM3 gave tme this base code
		var saveRequest;
		
	function runAjax(directions)
		{
		   // function returns "AJAX" object, depending on web browser
		   // this is not native JS function!
		   saveRequest = getHTTPObject();
		   saveRequest.onreadystatechange = sendData;
		   saveRequest.open("GET", "ajax.php?json="+ directions, true); //add variable of the JSON string
		   saveRequest.send();
		   
		
		//end runAjax() function
		}
		
		
		// function is executed when var request state changes
		function sendData()
		{
		   // if request object received response
		   if(saveRequest.readyState == 4)
		   {
				// ajax.php response
				var ajaxresponsevalue= saveRequest.responseText;
			
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
	};
	
	
	function getHTTPObject() {
				var xhr = false;//set to false, so if it fails, do nothing
				if(window.XMLHttpRequest) {//detect to see if browser allows this method
					var xhr = new XMLHttpRequest();//set var the new request
				} else if(window.ActiveXObject) {//detect to see if browser allows this method
					try {
						var xhr = new ActiveXObject("Msxml2.XMLHTTP");//try this method first
					} catch(e) {//if it fails move onto the next
						try {
							var xhr = new ActiveXObject("Microsoft.XMLHTTP");//try this method next
						} catch(e) {//if that also fails return false.
							xhr = false;
						}
					}
				}
				return xhr;//return the value of xhr
			}
  
  
  
  
  
  