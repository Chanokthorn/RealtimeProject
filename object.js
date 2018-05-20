function World(){
  var objects = [];
  var epsilon = 0.7;
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
    // console.log("before force: ",objects[2].acc);
    for(var key = 0 ;key < objects.length;key++){
      var obj = objects[key];
      // obj.force.y += (obj.mass * gravity);
      if (obj.force.x == 0 && obj.force.y == 0 && obj.force.z == 0) continue;
      obj.acc = obj.force.divideScalar(obj.mass);
      // obj.force = new THREE.Vector3();
    }
    // console.log("after force: ",objects[2].acc);
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
          // obj1.mesh.geometry.computeBoundingSphere();
          // obj2.mesh.geometry.computeBoundingSphere();
          // var sphere1 = obj1.mesh.geometry.boundingSphere;
          // sphere1.set(obj1.pos, )
          // var sphere2 = obj2.mesh.geometry.boundingSphere;
          // if(sphere1.intersectsSphere(sphere2)){
          //     // console.log(key1 + "collides" + key2);
          //     console.log("bs1 ",obj1.mesh.geometry.boundingSphere);
          //     console.log("sphere1 ",sphere1)
          //     solve_collision(key1, key2);
          // }
        }
        if((obj1.type == "plane" && obj2.type == "sphere")||
          (obj1.type == "sphere" && obj2.type == "plane")){
          if(obj1.type == 'plane'){
            var obj_plane = obj1;
            var obj_sphere = obj2;
          }else{
            var obj_plane = obj2;
            var obj_sphere = obj1;
          }
          var bbs = new THREE.Box3();
          var bbp = new THREE.Box3();
          bbs.setFromObject(obj_sphere.mesh);
          bbp.setFromObject(obj_plane.mesh);
          if(bbs.intersectsBox(bbp)){
            solve_collision(key1,key2);
            // console.log(obj1.acc);
            // console.log(obj2.acc);
            console.log("intersected")
            var contact_point = new THREE.Vector3();
            var normal = obj_plane.up;
            var plane = new THREE.Plane(normal); // TODO : should add constant  distant too
            var projection = new THREE.Vector3();
            plane.projectPoint(obj_sphere.pos,projection);
            var sphere = new THREE.Sphere(obj_sphere.pos);
            sphere.clampPoint(projection, contact_point);
            console.log('projection',projection);
            console.log("contact point",contact_point);
          }
        }
  
      }

    }
  }

  var solve_collision = function(key1, key2){
    console.log("key1: ",key1);
    console.log("key2: ",key2);
    obj1 = objects[key1];
    obj2 = objects[key2];
    // tmp_vel = obj1.vel;
    // obj1.vel = obj2.vel;
    // obj2.vel = tmp_vel;
    // obj1acc = new THREE.Vector3(obj1.acc.x, obj1.acc.y, obj1.acc.z);
    // obj2acc = new THREE.Vector3(obj2.acc.x, obj2.acc.y, obj2.acc.z);
    // obj1.force = obj2acc.multiplyScalar(obj2.mass);
    // obj2.force = obj1acc.multiplyScalar(obj1.mass);
    // console.log("solve col: ",objects[2].acc);
    // [obj1.vel,obj2.vel] = [obj2.vel,obj1.vel];  //TODO: not correct when hit in angle
    
    var newVel2 = compute_impulse(key2,key1);
    if(!obj1.static){
      var newVel1 = compute_impulse(key1,key2);
      obj1.vel.add(newVel1);
    }
    if(!obj2.static){
      obj2.vel.add(newVel2);
    }
    // console.log("after after solve col: ",objects[2].acc)

  }

  var compute_impulse = function(key1, key2){
    obj1 = objects[key1];
    obj2 = objects[key2];
    var vel1 = new THREE.Vector3(obj1.vel.x, obj1.vel.y, obj1.vel.z);
    var vel2 = new THREE.Vector3(obj2.vel.x, obj2.vel.y, obj2.vel.z);
    var pos1 = new THREE.Vector3(obj1.pos.x, obj1.pos.y, obj1.pos.z);
    var pos2 = new THREE.Vector3(obj2.pos.x, obj2.pos.y, obj2.pos.z);
    var velr = new THREE.Vector3();
    var n = new THREE.Vector3();
    velr.addVectors(vel1,vel2);
    // console.log("pos1: ",pos1);
    // console.log("obj1.pos: ",obj1.pos);
    // console.log("vel1: ",vel1);
    n.subVectors((pos1), (pos2));
    console.log("n0: ", n);
    n = n.divideScalar(obj1.pos.distanceTo(obj2.pos));
    console.log("n1: ", n);

    // var pre_distance = obj1.pos.distanceTo(obj2.pos);
    // var tmp1 = new THREE.Vector3(obj1.pos.x, obj1.pos.y, obj1.pos.z);
    // var tmp2 = new THREE.Vector3(obj2.pos.x, obj2.pos.y, obj2.pos.z);
    // var post_distance = (tmp1.add())

    var velRelPre = new THREE.Vector3();
    velRelPre.subVectors(vel1,vel2).dot(n);
    console.log("velRelPre: ",velRelPre)
    var j = (-(1 + epsilon) * velRelPre.length()) / (1/obj1.mass + 1/obj2.mass);
    var newVel1 = new THREE.Vector3(n.x, n.y, n.z);
    newVel1.multiplyScalar(j);
    newVel1.divideScalar(obj1.mass);
    console.log("j: ",j);
    return newVel1;
  }
  

  var updatePosition = function(){
    // console.log("before update: ",objects[2].acc)
    detect_collision();
    compute_force_applied();
    // console.log("after update: ",objects[2].acc)
    for(var key in objects){
      var currObj = objects[key];
      if(currObj.static){
        continue;
      }
      currObj.vel.add(currObj.acc);
      currObj.pos.add(currObj.vel);

      currObj.mesh.position.set(currObj.pos.x, currObj.pos.y, currObj.pos.z);

      // bounce on floor
      // if(currObj.pos.y < objects[0].pos.y + 1.0){
      //   currObj.vel.y *= -1;
      // }
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