function Objects(){
  var objects = {};
  // this.velocities = {};
  // this.accelerations = {};
  var objectIndex = 0;
  var createObject = function(type = 'sphere'){
    console.log('create');
    var geometry;
    var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
    if(type = "sphere"){
      geometry = new THREE.SphereGeometry(1,10,10);
    }
    else{
      geometry = new THREE.BoxGeometry( 1, 1, 1 );
    }
    var newObject= (new THREE.Mesh( geometry, material ));
    newObject.position.set(0.5, 1, 1);
    scene.add(newObject);
    objects[objectIndex] = { 
      object: newObject,
      vel: { x: 0, y: 0, z: 0},
      acc: { x: 0, y: -0.01, z: 0}
    };
  }
  var updatePosition = function(){
    for(var key in objects){
      var currObj = objects[key].object;
      currObj.position.x += objects[key].vel.x;
      currObj.position.y += objects[key].vel.y;
      currObj.position.z += objects[key].vel.z;
      objects[key].vel.x += objects[key].acc.x;
      objects[key].vel.y += objects[key].acc.y;
      objects[key].vel.z += objects[key].acc.z
    }
  }

  return{
    objects: objects,
    create: createObject,
    update: updatePosition
  }
 
  
}
