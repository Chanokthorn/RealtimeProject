// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------
// Create an empty scene

// object.createObject('sphere');

var scene = new THREE.Scene();
var world = new World();
var objects = world.objects;

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias: true});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

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

var objectVelocity = {};
var objectIsStatic = {};

world.create("plane", {x: 1.0, y: -1.5, z: 1.0}, true);
world.create("sphere",{x: 2, y: 10.0, z: 1.0}, {x: -0.01, y: 0, z: 0});
world.create("sphere",{x: -2, y: 10.0, z: 1.0}, {x: 0.01, y: 0, z: 0});

var plane = objects[0]
// Render Loop
var render = function () {
  requestAnimationFrame( render );
  // Render the scene
  world.update();
  renderer.render(scene, camera);
};

render();