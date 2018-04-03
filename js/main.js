//Calculating the current location:

function begin () {
    var miBoton = document.getElementById('mi-ubicacion');
   
    if(navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(showPosition);
    }
  }
 
  function showPosition(posicion) {
    var ubicacion = document.getElementById('ubicacion');
    var myPosition = {
      lat: posicion.coords.latitude,
      lng: posicion.coords.longitude
    }
    var latitude=  myPosition.lat;
    localStorage.myLatitude = JSON.stringify(latitude);
    var longitude =  myPosition.lng;
    localStorage.myLongitude= JSON.stringify(longitude);
    console.log(latitude,longitude)
    //ubicacion.innerHTML= latitude + '<br>'+ longitude
  }
 
 window.addEventListener('load', begin,false)
 
 console.log('v o f', localStorage.myLongitude==='-76.9361273');
 
 function calculateRouteFromAtoB (platform) {
  // var prueba3 = localStorage.myLongitude;
   //console.log(prueba3.toString());
  var latitudeA =localStorage.latitudeMainA;
  var longitudeA = localStorage.longitudeMainA;
  var latitudeB = localStorage.latitudeMainB;
  var longitudeB = localStorage.longitudeMainB;
   //var prueba2= localStorage.myLatitude;
   //console.log(typeof(localStorage.myLatitude))
   var router = platform.getRoutingService(),
     routeRequestParams = {
       mode: 'shortest;pedestrian',
       representation: 'display',
       waypoint0:  latitudeA+','+longitudeA,// Route A
      // waypoint0:'-12.0628815,-76.9361958',
       waypoint1: latitudeB+','+longitudeB,  // Route B 
       routeattributes: 'waypoints,summary,shape,legs',
       maneuverattributes: 'direction,action',
       language:'es-es'
     };
     console.log('1',routeRequestParams.waypoint1);
 
    router.calculateRoute(
     routeRequestParams,
     onSuccess,
     onError
    
   ); 
 
 }
 
 function onSuccess(result) {
   console.log('rutas',result)
    var route = result.response.route[0];
   addRouteShapeToMap(route);
   addManueversToMap(route);
   //addWaypointsToPanel(route.waypoint);
   //addManueversToPanel(route);
   //addSummaryToPanel(route.summary); 
   // ... etc.
   arriveButton.on('click',function(){
     addWaypointsToPanel(route.waypoint);
     addManueversToPanel(route);
     addSummaryToPanel(route.summary); 
   })
 }
 
 function onError(error) {
   alert('Ooops!');
 }
 
 // set up containers for the map  + panel
 var mapContainer = document.getElementById('principal-map'),
   routeInstructionsContainer = document.getElementById('principal-panel');
 
 //Step 1: initialize communication with the platform
 var platform = new H.service.Platform({
   app_id: 'GYY2pVG6gWaZZB2kVTLw',
   app_code: '6n-eV00Iq-KV_lVCWBdSdw',
   useCIT: true,
   useHTTPS: true
 });
 var defaultLayers = platform.createDefaultLayers();
 //Step 2: initialize a map - this map is centered over Berlin
 var map = new H.Map(mapContainer,
   defaultLayers.normal.map,{
   center: {lat:-12.085474, lng:-76.977291},
   zoom: 12
 });
 
 //Step 3: make the map interactive
 
 var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
 
 // Create the default UI components
 var ui = H.ui.UI.createDefault(map, defaultLayers);
 
 // Hold a reference to any infobubble opened
 var bubble;
 
 function openBubble(position, text){
   if(!bubble){
      bubble =  new H.ui.InfoBubble(
        position,
        // The FO property holds the province name.
        {content: text});
      ui.addBubble(bubble);
    } else {
      bubble.setPosition(position);
      bubble.setContent(text);
      bubble.open();
    }
  }
  
  function addRouteShapeToMap(route){
    var lineString = new H.geo.LineString(),
      routeShape = route.shape,
      polyline;
      
   routeShape.forEach(function(point) {
     var parts = point.split(',');
     lineString.pushLatLngAlt(parts[0], parts[1]);
   });
 
   polyline = new H.map.Polyline(lineString, {
     style: {
       lineWidth: 4,
       strokeColor: 'rgb(43, 69, 153)'
     }
   });
   // Add the polyline to the map
   map.addObject(polyline);
   // And zoom to its bounding rectangle
   map.setViewBounds(polyline.getBounds(), true);
 }
 
 function addManueversToMap(route){
   var svgMarkup = '<svg width="18" height="18" ' +
     'xmlns="http://www.w3.org/2000/svg">' +
     '<circle cx="8" cy="8" r="8" ' +
       'fill="#1b468d" stroke="white" stroke-width="1"  />' +
     '</svg>',
     dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
     group = new  H.map.Group(),
     i,
     j;
 
   // Add a marker for each maneuver
   for (i = 0;  i < route.leg.length; i += 1) {
     for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
       // Get the next maneuver.
       maneuver = route.leg[i].maneuver[j];
       // Add a marker to the maneuvers group
       var marker =  new H.map.Marker({
         lat: maneuver.position.latitude,
         lng: maneuver.position.longitude} ,
         {icon: dotIcon});
       marker.instruction = maneuver.instruction;
       group.addObject(marker);
     }
   }
 
   group.addEventListener('tap', function (evt) {
     map.setCenter(evt.target.getPosition());
     openBubble(
        evt.target.getPosition(), evt.target.instruction);
   }, false);
 
   // Add the maneuvers group to the map
   map.addObject(group);
 }
 
 function addWaypointsToPanel(waypoints){
   var nodeH3 = document.createElement('h3'),
     waypointLabels = [],
     i;
 
    for (i = 0;  i < waypoints.length; i += 1) {
     waypointLabels.push(waypoints[i].label)
    }
 
    nodeH3.textContent = waypointLabels.join(' ');
 
   routeInstructionsContainer.innerHTML = '';
   routeInstructionsContainer.appendChild(nodeH3);
 }
 
 function addSummaryToPanel(summary){
   var summaryDiv = document.createElement('div'),
    content = '';
    content += '<b>Distancia total</b>: ' + summary.distance  + 'm. <br/>';
    content += '<b>Tiempo de viaje</b>: ' + summary.travelTime.toMMSS() + ' (en tráfico actual)';
    summaryDiv.style.fontSize = 'small';
    summaryDiv.style.marginLeft ='5%';
    summaryDiv.style.marginRight ='5%';
    summaryDiv.innerHTML = content;
    routeInstructionsContainer.appendChild(summaryDiv);
  }
 
  function addManueversToPanel(route){
    var nodeOL = document.createElement('ol'),
      i,
      j;
  
    nodeOL.style.fontSize = 'small';
    nodeOL.style.marginLeft ='5%';
    nodeOL.style.marginRight ='5%';
    nodeOL.className = 'directions';
  
       // Add a marker for each maneuver
    for (i = 0;  i < route.leg.length; i += 1) {
      for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
        // Get the next maneuver.
        maneuver = route.leg[i].maneuver[j];
  
        var li = document.createElement('li'),
          spanArrow = document.createElement('span'),
          spanInstruction = document.createElement('span');
          spanArrow.className = 'arrow '  + maneuver.action;
          spanInstruction.innerHTML = maneuver.instruction;
          li.appendChild(spanArrow);
          li.appendChild(spanInstruction);
    
          nodeOL.appendChild(li);
        }
      }
    
      routeInstructionsContainer.appendChild(nodeOL);
    }
      
    Number.prototype.toMMSS = function () {
      return  Math.floor(this / 60)  +' minutos '+ (this % 60)  + ' segundos.';
    }  
    // Now use the map as required...
    //calculateRouteFromAtoB (platform); 
 
 
 
    /* --------------------------------------------------------------------------------------------- */
 
 
   var input_A = $('.route-A-js');
   input_A.on('input',function(){
     console.log(this.value);
     var result = this.value;
     localStorage.routeMainA= result
   });

   var input_B = $('.route-B-js');
   input_B.on('input',function(){
    console.log(this.value);
    var result2= this.value;
    localStorage.routeMainB= result2;
   });
 
   var displayRoute = $('.display-route-js');
 
   displayRoute.on('click',function(){
        geocode1(platform);
        geocode2(platform);
        calculateRouteFromAtoB (platform)
   
   });
 
   function geocode1(platform) {
     var geocoder = platform.getGeocodingService(),
       geocodingParameters = {
         searchText: localStorage.routeMainA,
         jsonattributes : 1
       }
     geocoder.geocode(geocodingParameters,onSuccess1,onError1);
   }
 
   function onSuccess1(result) {
     var locations = result.response.view[0].result;
     console.log('routeA', locations);
     var latitudeMainA= locations[0].location.displayPosition.latitude;
     localStorage.latitudeMainA= latitudeMainA;
     var longitudeMainA =  locations[0].location.displayPosition.longitude;
     localStorage.longitudeMainA= longitudeMainA;
    // console.log(latitudeB,longitudeB)
 
     //addLocationsToMap(locations);
    // addLocationsToPanel(locations);
     // ... etc.
   }

   function geocode2(platform) {
    var geocoder = platform.getGeocodingService(),
      geocodingParameters = {
        searchText: localStorage.routeMainB,
        jsonattributes : 1
      }
    geocoder.geocode(geocodingParameters,onSuccess2,onError1);
  }

  function onSuccess2(result) {
    var locations = result.response.view[0].result;
    console.log('routeB', locations);
    var latitudeMainB= locations[0].location.displayPosition.latitude;
    localStorage.latitudeMainB= latitudeMainB;
    var longitudeMainB =  locations[0].location.displayPosition.longitude;
    localStorage.longitudeMainB= longitudeMainB;
   // console.log(latitudeB,longitudeB)

    //addLocationsToMap(locations);
    //addLocationsToPanel(locations);
    // ... etc.
  }
 
   function onError1(error) {
     console.log(error)
     alert('Ooops!');
   }
   
   
   //geocode1(platform);
 
  /*boton mostrar instrucciones*/
 
   var arriveButton = $('.arrive-js');
  
  
 
  
  