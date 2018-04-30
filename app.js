// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------
// Create an empty scene
// test push



// object.createObject('sphere');

var scene = new THREE.Scene();

var objects = new Objects();

objects.create();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// fundamental functions
// function applyGravity(){
//     objects.map((obj) => {
//         if(!objectIsStatic[obj.id]) objectVelocity[obj.id].y += 0.01;
//     });
// }

// function applyVelociity(){
//     objects.map( (obj) => {
//         objId = obj.id;
//         obj.position.x -= (objectVelocity[objId].x);
//         obj.position.y -= (objectVelocity[objId].y);
//         obj.position.z -= objectVelocity[objId].z;
//     });
// }
// end of fundametal functions

// keyboard listener
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        cube.position.y += ySpeed;
    } else if (keyCode == 83) {
        cube.position.y -= ySpeed;
    } else if (keyCode == 65) {
        cube.position.x -= xSpeed;
    } else if (keyCode == 68) {
        cube.position.x += xSpeed;
    } else if (keyCode == 32) {
        cube.position.set(0, 0, 0);
    } else if (keyCode == 79){
        plane.rotation.x += 0.1;
    } else if (keyCode == 76){
        plane.rotation.x -= 0.1;
    } else if (keyCode == 50){
        camera.position.x -= 0.5;
    } else if (keyCode == 51){
        camera.position.y -= 0.5;
        console.log('up');
    } else if (keyCode == 52){
        camera.position.x += 0.5;
    } else if (keyCode == 53){
        camera.position.y += 0.5;
    }
};

// arrays of velocity and states of each object, key is each object's id
var objectVelocity = {};
var objectIsStatic = {};

// Create objects


var planeGeometry = new THREE.PlaneBufferGeometry( 10, 5, 5, 5 );
var planeMaterial = new THREE.MeshBasicMaterial( { color: "#103F97" } )
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;
plane.rotation.x -= 1;
plane.position.set( 1, -1.5, 1 );
objectIsStatic[plane.id] = true;


// Add cube to Scene
// objects.map((obj) => {
//     console.log('object: ',obj)
//     scene.add( obj );
//     objectVelocity[obj.id] = { x: 0, y: 0, z: 0};
// });

// Render Loop
var render = function () {
  requestAnimationFrame( render );
  // Render the scene
  objects.update();
  renderer.render(scene, camera);
};

render();