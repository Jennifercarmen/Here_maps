var mapContainer = document.getElementById('map');
var platform = new H.service.Platform({
    app_id: 'GYY2pVG6gWaZZB2kVTLw',
    app_code: '6n-eV00Iq-KV_lVCWBdSdw',
    useCIT: true,
    useHTTPS: true
});
var defaultLayers = platform.createDefaultLayers();
//Step 2: initialize a map - this map is centered over Berlin
var map = new H.Map(mapContainer,
    defaultLayers.normal.map, {
        center: {
            lat: -12.085474,
            lng: -76.977291
        },
        zoom: 12
    });

   
  


    console.log(localStorage.myLatitude);
    console.log(localStorage.myLongitude);

    function calculateRouteFromAtoB (platform) {
        var prueba3 = localStorage.myLongitude;
        console.log(prueba3.toString());
       //var prueba2= '-76.9361958'
        var prueba2= localStorage.myLatitude;
        console.log(typeof(localStorage.myLatitude))
        var router = platform.getRoutingService(),
          routeRequestParams = {
            mode: 'shortest;pedestrian',
            representation: 'display',
            waypoint0:  prueba2+','+prueba3,// Route A
           // waypoint0:'-12.0628815,-76.9361958',
            waypoint1: localStorage.latitudeB+','+localStorage.longitudeB,  // Route B 
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
var input = $('.principal-input-js');
console.log(input)
input.on('input', function () {
    console.log(this.value);
    var result = this.value;
    localStorage.routeB = result
});


var routeB = $('.search-button-js');

routeB.on('click', function () {
    console.log('click', localStorage.routeB);
    calculateRouteFromAtoB(platform);
});

function onSuccess(result) {
    console.log('rutas',result)
     var route = result.response.route[0];
     console.log(route)
    addRouteShapeToMap(route);
    addManueversToMap(route);
    //addWaypointsToPanel(route.waypoint);
    //addManueversToPanel(route);
    //addSummaryToPanel(route.summary); 
    // ... etc.
   }
   
   function onError(error) {
    alert('Ooops!');
   }
function addRouteShapeToMap(route) {
    var lineString = new H.geo.LineString(),
        routeShape = route.shape,
        polyline;

    routeShape.forEach(function (point) {
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
  

