//Calculating the current location:

function begin () {

  if(navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(showPosition);
   function showPosition(posicion) {
    var myPosition = {
      lat: posicion.coords.latitude,
      lng: posicion.coords.longitude
    }
    var myLatitude=  myPosition.lat;
    var myLongitude =  myPosition.lng;
    console.log(myLatitude,myLongitude)
  
    var input = $('.principal-input-js').val();


   var searchButton = $('.search-button-js');
  
   searchButton.on('click',function(){
   console.log('click',localStorage.routeB);
 //  geocode(platform);
   calculateRouteFromAtoB (platform); 
   });

   /*boton mostrar instrucciones*/
  
   var arriveButton = $('.arrive-js');

/* ----------------------- */
function calculateRouteFromAtoB (platform) {
  function geocode(platform) {

    var geocoder = platform.getGeocodingService(),
      geocodingParameters = {
        searchText: $('.principal-input-js').val(),
        jsonattributes : 1,
      }
    geocoder.geocode(geocodingParameters,onSuccess1,onError1);
    //calculateRouteFromAtoB (platform); 
  }
  function onSuccess1(result) {
    console.log('esta aquiiii')
    var locations = result.response.view[0].result;
    console.log('routeB', locations);
    var latitudeB= locations[0].location.displayPosition.latitude;
    var longitudeB =  locations[0].location.displayPosition.longitude;
    
 var router = platform.getRoutingService(),
 routeRequestParams = {
   mode: 'shortest;pedestrian',
   representation: 'display',
   waypoint0:  myLatitude+','+myLongitude,// Route A
   waypoint1:latitudeB+','+longitudeB,   // Route B 
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
  geocode(platform);

}

function onSuccess(result) {
 console.log('rutas',result)
  var route = result.response.route[0];
 addRouteShapeToMap(route);
 addManueversToMap(route);


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
var mapContainer = document.getElementById('map'),
 routeInstructionsContainer = document.getElementById('panel');

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
 center: {lat:myLatitude, lng:myLongitude},
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
  console.log(route)
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

  nodeH3.textContent = waypointLabels.join(' - ');

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

  /* --------------------------------------------------------------------------------------------- */


 function onSuccess1(result) {
   console.log('esta aquiiii')
   var locations = result.response.view[0].result;
   var latitudeB= locations[0].location.displayPosition.latitude;
   var longitudeB =  locations[0].location.displayPosition.longitude;

 }

 function onError1(error) {
   console.log(error)
   alert('Ooops!');
 }
 
  }

  }
}

window.addEventListener('load', begin)

