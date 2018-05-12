function World(){
  var objects = {};
  const gravity = -0.008;
  // this.velocities = {};
  // this.accelerations = {};
  var objectIndex = 0;
  var createObject = function(type = 'sphere'){
    console.log('create');
    var geometry, material, pos;
    var vel = { x: 0, y: 0, z: 0};
    var acc = { x: 0, y: gravity, z: 0};
    var mass = 1;
    var static = false;
    if(type == "plane"){
      geometry = new THREE.PlaneGeometry( 10, 1);
      material = new THREE.MeshBasicMaterial( { color: "#103F97" } );
      pos = {x: 1, y: -1.5, z: 1};
      static = true;
    } else if(type = "sphere"){
      geometry = new THREE.SphereGeometry(1,10,10);
      material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
      pos = {x: 0.5, y: 10, z: 1};
    }
    else{
      geometry = new THREE.BoxGeometry( 1, 1, 1 );
      material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
      pos = {x: 0.5, y: 1, z: 1};
    }
    var newMesh = new THREE.Mesh(geometry, material);
    newMesh.position.set(pos.x, pos.y, pos.z)
    scene.add(newMesh);
    objects[objectIndex++] = { 
      mesh: newMesh,
      type: type,
      mass: mass,
      pos: pos,
      vel: vel,
      acc: acc,
      static: static
    };
  }
  var updatePosition = function(){
    for(var key in objects){
      var currObj = objects[key];
      if(currObj.static){
        continue;
      }
      currObj.pos.x += currObj.vel.x;
      currObj.pos.y += currObj.vel.y;
      currObj.pos.z += currObj.vel.z;
      currObj.vel.x += currObj.acc.x;
      currObj.vel.y += currObj.acc.y;
      currObj.vel.z += currObj.acc.z;
      
      currObj.mesh.position.set(currObj.pos.x, currObj.pos.y, currObj.pos.z)

      if(currObj.pos.y < objects[0].pos.y + 1){
        currObj.static = true;
      }
    }
  }

  return{
    objects: objects,
    create: createObject,
    update: updatePosition
  }
 
  
}