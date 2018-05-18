function World(){
  var objects = {};
  const gravity = -0.008;
  var zero = {x: 0.0,
                y: 0.0,
                z: 0.0}
  // this.velocities = {};
  // this.accelerations = {};
  var objectIndex = 0;
  var createObject = function(type = 'sphere', pos = zero, rot = zero, static = false, mass = 1.0){
    console.log('create');
    var geometry, material;
    var vel = {x: 0.0, y: 0.0, z: 0.0};
    var acc = {x: 0.0, y: gravity, z: 0.0};
    if(type === "plane"){
      geometry = new THREE.PlaneGeometry(10, 1);
      material = new THREE.MeshBasicMaterial( { color: "#103F97" } );
    } else if(type === "sphere"){
      geometry = new THREE.SphereGeometry(1.0, 10.0, 10.0);
      material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
      pos = {x: 0.5, y: 10.0, z: 1.0};
    }
    else{
      type = 'box';
      geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
      material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
      pos = {x: 0.5, y: 1.0, z: 1.0};
    }
    var newMesh = new THREE.Mesh(geometry, material);
    newMesh.position.set(pos.x, pos.y, pos.z)
    scene.add(newMesh);
    objects[objectIndex] = { 
      mesh: newMesh,
      type: type,
      mass: mass,
      moment_of_inertia: 0.0,
      pos: pos,
      rot: rot,
      vel: vel,
      acc: acc,
      static: static
    };

    compute_moment_of_inertia(objects[objectIndex])
    objectIndex++;
  }

  var compute_moment_of_inertia = function(object){
    if (object.type === "sphere"){
      object.moment_of_inertia = 2.0 / 5.0 * object.mass * object.mesh.geometry.parameters.radius ** 2;
    }else if(object.type === "box"){
      object.moment_of_inertia = 1.0 / 12.0 * object.mass * (object.mesh.geometry.parameters.width ** 2 + 
                                                              object.mesh.geometry.parameters.height ** 2);
    }
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

      if(currObj.pos.y < objects[0].pos.y + 1.0){
        currObj.static = true;
      }
    }
  }

  // var updateRotation = function(){
  //   for(var key in objects){
  //     var currObj = objects[key];
  //     if(currObj.static){
  //       continue;
  //     }
  //     currObj.rot.x += currObj.vel.x;
  //     currObj.rot.y += currObj.vel.y;
  //     currObj.rot.z += currObj.vel.z;
  //     currObj.vel.x += currObj.acc.x;
  //     currObj.vel.y += currObj.acc.y;
  //     currObj.vel.z += currObj.acc.z;
      
  //     currObj.mesh.position.set(currObj.pos.x, currObj.pos.y, currObj.pos.z)

  //     if(currObj.pos.y < objects[0].pos.y + 1.0){
  //       currObj.static = true;
  //     }
  //   }
  // }

  return{
    objects: objects,
    create: createObject,
    update: updatePosition
  }
 
  
}