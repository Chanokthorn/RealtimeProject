function World(){
  var objects = [];
  // const gravity = -0.008;
  const gravity = 0;
  // this.velocities = {};
  // this.accelerations = {};
  var objectIndex = 0;
  var createObject = function(type = 'sphere', 
                              pos = new THREE.Vector3(), 
                              force = new THREE.Vector3(),
                              rot = new THREE.Vector3(), 
                              static = false, 
                              mass = 1.0,
                              color) {
    console.log('create');
    var geometry, material;
    var vel = new THREE.Vector3();
    var acc = new THREE.Vector3(0.0, 0.0, 0.0);
    if(type === "plane"){
      color = color || "#103F97"
      geometry = new THREE.PlaneGeometry(10, 1);
      material = new THREE.MeshBasicMaterial( { color:  color} );
    } else if(type === "sphere"){
      color = color || "#433F81"
      geometry = new THREE.SphereGeometry(1.0, 10.0, 10.0);
      material = new THREE.MeshBasicMaterial( { color: color } );
    }
    else{
      type = 'box';
      geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
      material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
    }
    var newMesh = new THREE.Mesh(geometry, material);
    newMesh.position.set(pos.x, pos.y, pos.z);
    scene.add(newMesh);
    objects.push({ 
      mesh: newMesh,
      type: type,
      mass: mass,
      moment_of_inertia: 0.0,
      pos: pos,
      rot: rot,
      vel: vel,
      acc: acc,
      static: static,
      force: force
    });

    compute_moment_of_inertia(objects[objectIndex])
    objectIndex++;
  }

  var compute_moment_of_inertia = function(object){
    if (object.type === "sphere"){
      object.moment_of_inertia = 2.0 / 5.0 * object.mass * object.mesh.geometry.parameters.radius ** 2;
    } else if(object.type === "box"){
      object.moment_of_inertia = 1.0 / 12.0 * object.mass * (object.mesh.geometry.parameters.width ** 2 + 
                                                              object.mesh.geometry.parameters.height ** 2);
    }
  }

  var compute_force_applied = function() {
    for(var key = 0 ;key < objects.length;key++){
      var obj = objects[key];
      obj.force.y += (obj.mass * gravity);
      if (obj.force.x == 0 && obj.force.y == 0 && obj.force.z == 0) continue;
      obj.acc = obj.force.divideScalar(obj.mass);
      obj.force = new THREE.Vector3();
    }
  }

  var detect_collision = function() {
    for(var key1 = 0;key1 < objects.length - 1;key1++){
      var obj1 = objects[key1];
      for(var key2 = key1 + 1;key2 < objects.length;key2++){
        var obj2 = objects[key2];
        if(obj1.type == "sphere" && obj2.type == "sphere"){
          var centers_distance = obj1.pos.distanceTo(obj2.pos);
          if(centers_distance <= obj1.mesh.geometry.parameters.radius + obj2.mesh.geometry.parameters.radius){
            console.log(key1 + "collides" + key2);
            solve_collision(key1, key2);
          }
        }
      }
    }
  }

  var solve_collision = function(key1, key2){
    obj1 = objects[key1];
    obj2 = objects[key2];
    // tmp_vel = obj1.vel;
    // obj1.vel = obj2.vel;
    // obj2.vel = tmp_vel;
    obj1.force = obj2.acc.multiplyScalar(obj2.mass);
    obj2.force = obj1.acc.multiplyScalar(obj1.mass);
    // [obj1.vel,obj2.vel] = [obj2.vel,obj1.vel];  //TODO: not correct when hit in angle
  }

  var updatePosition = function(){
    detect_collision();
    compute_force_applied();
    for(var key in objects){
      var currObj = objects[key];
      if(currObj.static){
        continue;
      }
      currObj.vel.add(currObj.acc);
      currObj.pos.add(currObj.vel);
      
      currObj.mesh.position.set(currObj.pos.x, currObj.pos.y, currObj.pos.z);

      // bounce on floor
      if(currObj.pos.y < objects[0].pos.y + 1.0){
        currObj.vel.negate();
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