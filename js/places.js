// Instantiate the Platform class with authentication and
// authorization credentials:
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
 /* var map = new H.Map(mapContainer,
   defaultLayers.normal.map,{
   center: {lat:-12.085474, lng:-76.977291},
   zoom: 12
 }); */
 
 



/* ---------------------------------------------------- */
/* var platform = new H.service.Platform({
    useCIT: true,
    app_id: 'GYY2pVG6gWaZZB2kVTLw',
    app_code: '6n-eV00Iq-KV_lVCWBdSdw'
    }); */
    // Instantiate a map inside the DOM element with id map. The
    // map center is in San Francisco, the zoom level is 10:
    var map = new H.Map(document.getElementById('map'),
    platform.createDefaultLayers().normal.map, {
    center: {lat: -12.0742688, lng: -76.9393747},
    zoom: 12
    });

    //Step 3: make the map interactive
 
 var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

  
 // Create the default UI components
 var ui = H.ui.UI.createDefault(map, defaultLayers);
    
    // Create a group object to hold map markers:
    var group = new H.map.Group();
    
    // Create the default UI components:
   /*  var ui = H.ui.UI.createDefault(map, platform.createDefaultLayers()); */
    
    // Add the group object to the map:
    map.addObject(group);
    
    // Obtain a Search object through which to submit search
    // requests:
    var search = new H.places.Search(platform.getPlacesService()),
    searchResult, error;
    
    // Define search parameters:
function parameters(string){
        var params = {
        // Plain text search for places with the word "hotel"
        // associated with them:
        'q': string,
        //'q':'restaurant',
        //'q':'coffee',
    
        // Search in the Chinatown district in San Francisco:
        'at': '-12.0742688,-76.9393747'
        };
        
       
        return params;
}
 // Define a callback function to handle data on success:
 function onResult(data) {
    data.results.items.map(function(place){
        var template = `
        <div class="col-xs-12 col-sm-6 ">
        <div class="card w-100 card-styles">
          <img class="card-img-top" src="../assets/images/card-image.jpg" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title text-center">${place.title}</h5>
            <p class="card-text">${place.vicinity}</p>
            <p class="card-text text-right">Distancia : ${place.distance} m</p>
            
          </div>
        </div>
        <br>
      </div>`
      $('#places-container').append(template)
        console.log('nombre restaurant',place.title);
        console.log('direccion',place.vicinity);
        console.log('distancia',place.distance);
    })
    console.log( 'onResult', data.results.items)
addPlacesToMap(data.results);
}

// Define a callback function to handle errors:
function onError(data) {
error = data;
}
    

    
    // This function adds markers to the map, indicating each of
    // the located places:
    function addPlacesToMap(result) {

    group.addObjects(result.items.map(function (place) {
        console.log(place.icon)
        var iconUrl = place.icon;
        var iconOptions = {
        // The icon's size in pixel:
        size: new H.math.Size(35, 35),
        // The anchorage point in pixel,
        // defaults to bottom-center
        anchor: new H.math.Point(14, 34)
        };
    
        var markerOptions = {
        icon: new H.map.Icon(iconUrl, iconOptions)
        };
    var marker = new H.map.Marker({
        lat: place.position[0],
        lng: place.position[1]
    },markerOptions)
    return marker;
    }));
    }
    
    // Run a search request with parameters, headers (empty), and
    // callback functions:
    //search.request(parameters('hotel'), {}, onResult, onError);

    /* agragando evento click  */

    var placesButton = $('.show-places-js');
   /*  var showRestaurants = $('.show-restaurants-js');
    var showCoffee = $('.show-coffee-js');
    var showHotels = $('.show-hotels-js'); */
     placesButton.on('click',function(){
        console.log('click!!')
        search.request(parameters('hotel'), {}, onResult, onError);
        search.request(parameters('coffee'), {}, onResult, onError);
        search.request(parameters('restaurant'), {}, onResult, onError);
    }); 

    
    
