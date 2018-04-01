var user = null;
var usuariosConectados = null;
var usuarios = null;

var database = firebase.database();
var conectadoKey = '';
var $inifacebook = $('#inifacebook');
var $inigoogle = $('#inigoogle');
$inifacebook.on('click', signInFacebook);

$inigoogle.on('click', signInGoogle);
function initApp() {
  registrationUsers(user.uid, user.displayName, user.email,user.photoURL);
  login(user.uid, user.displayName , user.email);
  window.location.href = 'desktop.html';  
}
function registrationUsers(uid, name, email,photoURL) {
    firebase.database().ref('Usuarios/' + uid).set({
    name: name,
    email: email,
    photoURL:photoURL
  });
}
function login(uid, name, email) {
  firebase.database().ref('connected/' + uid).set({
    name: name,
    email: email
  });
}
function signOut() {
  firebase.auth().onAuthStateChanged(function(user) {
    database.ref('/connected/' + user.uid).remove();
    window.location.href = 'main.html';  
  });
};
function signInFacebook() {
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    user = result.user;
    console.log(user);
    initApp();
  }).catch(function(error) {
    var errorCode = error.code;
    console.log(errorcode);
    var errorMessage = errorMessage;
    console.log(errorMessage);
    var email = error.email;
    console.log(email);
    var credential = error.credential;
    console.log(credential);
  });
}

function signInGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    user = result.user;
    console.log(user);
    initApp();
    window.location.href = 'desktop.html';
  });
}
var $logout = $('.logout');
$logout.on('click', signOut);