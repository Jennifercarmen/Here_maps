//window.addEventListener('load',initMap)
//function initMap(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        function showPosition(posicion) {
            var ubicacion = document.getElementById('ubicacion');
            var myPosition = {
              lat: posicion.coords.latitude,
              lng: posicion.coords.longitude
            }
            var latitudeDefault=  myPosition.lat;
            var longitudeDefault =  myPosition.lng;
            console.log(latitudeDefault,longitudeDefault)
            function addMarkersToMap(map) {
                var myPositionMarker = new H.map.Marker({lat:latitudeDefault, lng:longitudeDefault});
                map.addObject(myPositionMarker);        
              }
              //Step 1: initialize communication with the platform
    var platform = new H.service.Platform({
        app_id: 'GYY2pVG6gWaZZB2kVTLw',
        app_code: '6n-eV00Iq-KV_lVCWBdSdw',
        useCIT: true,
        useHTTPS: true
      });
      var defaultLayers = platform.createDefaultLayers();
      
      //Step 2: initialize a map - this map is centered over Europe
      var map = new H.Map(document.getElementById('map'),
        defaultLayers.normal.map,{
        center: {lat:latitudeDefault, lng:longitudeDefault},
        zoom: 16
      });
      
      //Step 3: make the map interactive
      // MapEvents enables the event system
      // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
      var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      
      // Create the default UI components
      var ui = H.ui.UI.createDefault(map, defaultLayers);
      
      // Now use the map as required...
      addMarkersToMap(map);  
          }
       }
//}

 


  
  
