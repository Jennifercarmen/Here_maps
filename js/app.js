const openModalActivities = () => {
  const divActivities=$('#divActivities');
  divActivities.empty();
  firebase.database().ref('actividades').on('child_added', function (snap) {
    name = snap.val().name;
    console.log(name);
    const html = `
    <div class="col-md-6">
    <div class="form-check">
      <label class="form-check-label">
        <input type="radio" class="form-check-input" name="radioActivities" id="optionsRadios1" value="${name}" >
        ${name}
      </label>
    </div> 
    </div>
    `;
    divActivities.append(html);
  });
}
$('#btn_saveRoute').click(openModalActivities);

function grabarRuta() {
  alert("Se grabo la ruta");

}



function saveActivities() {
  firebase.database().ref('actividades').push({
    name: 'Alpinismo'
  });
  grabarRuta();

}

const latitud = localStorage.myLatitude;
const longitud = localStorage.myLongitude;

function addCircleToMap(map) {
  map.addObject(new H.map.Circle(
    // The central point of the circle
    {
      lat: latitud,
      lng: longitud
    },
    // The radius of the circle in meters
    80, {
      style: {
        strokeColor: 'rgba(19, 18, 18, 0.88)',
        fillColor: 'rgba(37, 221, 37, 0.67)',
        lineWidth: 2,
        lineCap: 'square',
        lineJoin: 'bevel'

      }
    }
  ));
}

function saveRoute() {
  const ractivity=$('input:radio[name=radioActivities]:checked').val();
  firebase.database().ref('rutas').once('value', function (snapshot) {
    const newPost = firebase.database().ref('rutas').push({
      uid: '001',
      name: localStorage.nameruta,
      activity: ractivity
    });

    const newPostKey = newPost.key;
    firebase.database().ref('/rutas/' + newPostKey).child('position').push({
      latitud: localStorage.latitudeB,
      longitud: localStorage.longitudeB
    });
    
  });
  grabarRuta();
}

$('#grabar').click(openModalActivities);
$('#btn_guardarRuta').click(saveRoute);

