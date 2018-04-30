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
    var boundingBox = {}
    boundingBox.minX = newObject.position.x - 1;
    boundingBox.maxX = newObject.position.x + 1;
    boundingBox.minY = newObject.position.y - 1;
    boundingBox.maxY = newObject.position.y + 1;
    boundingBox.minZ = newObject.position.z - 1;
    boundingBox.maxZ = newObject.position.z + 1;
    newObject.boundingBox = boundingBox;
    console.log(boundingBox);
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
      if (intersect(objects[key], plane)){
        console.log('intersect');
      }
    }
  }
  function intersect(a, b) {
    return (a.boundingBox.minX <= b.boundingBox.maxX && a.boundingBox.maxX >= b.boundingBox.minX) &&
           (a.boundingBox.minY <= b.boundingBox.maxY && a.boundingBox.maxY >= b.boundingBox.minY) &&
           (a.boundingBox.minZ <= b.boundingBox.maxZ && a.boundingBox.maxZ >= b.boundingBox.minZ);
  }

  return{
    objects: objects,
    create: createObject,
    update: updatePosition
  }
 
  
}
