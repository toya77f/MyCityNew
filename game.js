import * as THREE from "three";

/* =========================================
   MY CITY — GAME.JS
========================================= */

let scene;
let camera;
let renderer;
let player;
let clock;

let cameraYaw = 0;
let cameraPitch = 0.35;

let jumpVelocity = 0;
let grounded = true;

const input = {
  x: 0,
  y: 0
};

const keys = {};


/* =========================================
   INIT
========================================= */

function init() {

  scene = new THREE.Scene();

  scene.background =
    new THREE.Color(0x87ceeb);


  clock =
    new THREE.Clock();


  /* CAMERA */

  camera =
    new THREE.PerspectiveCamera(
      70,
      window.innerWidth /
      window.innerHeight,
      0.1,
      500
    );


  camera.position.set(
    0,
    4,
    8
  );


  /* RENDERER */

  renderer =
    new THREE.WebGLRenderer({
      antialias: true
    });


  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );


  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  );


  renderer.shadowMap.enabled =
    true;


  const game =
    document.getElementById(
      "game"
    );


  if (!game) {

    throw new Error(
      "game element not found"
    );

  }


  game.innerHTML = "";

  game.appendChild(
    renderer.domElement
  );


  /* LIGHT */

  const ambient =
    new THREE.HemisphereLight(
      0xffffff,
      0x555555,
      1.8
    );

  scene.add(
    ambient
  );


  const sun =
    new THREE.DirectionalLight(
      0xffffff,
      2
    );


  sun.position.set(
    50,
    80,
    50
  );


  sun.castShadow =
    true;


  scene.add(
    sun
  );


  /* WORLD */

  createGround();

  createRoads();

  createBuildings();

  createPlayer();


  /* CONTROLS */

  setupKeyboard();

  setupJoystick();

  setupButtons();

  setupMap();

  setupResize();


  showMessage(
    "👤 أهلاً بك في My City"
  );


  animate();

}


/* =========================================
   GROUND
========================================= */

function createGround() {

  const ground =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        250,
        250
      ),

      new THREE.MeshStandardMaterial({
        color: 0x5d8a50
      })

    );


  ground.rotation.x =
    -Math.PI / 2;


  ground.receiveShadow =
    true;


  scene.add(
    ground
  );

}


/* =========================================
   ROADS
========================================= */

function createRoads() {

  const roadMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x303236
    });


  const road1 =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        250,
        0.05,
        14
      ),

      roadMaterial

    );


  road1.position.y =
    0.025;


  scene.add(
    road1
  );


  const road2 =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        14,
        0.05,
        250
      ),

      roadMaterial

    );


  road2.position.y =
    0.025;


  scene.add(
    road2
  );

}


/* =========================================
   BUILDINGS
========================================= */

function createBuildings() {

  createBuilding(
    45,
    45,
    18,
    8,
    18,
    0xc98255
  );


  createBuilding(
    -45,
    45,
    22,
    10,
    18,
    0xe0c36e
  );


  createBuilding(
    45,
    -45,
    32,
    12,
    24,
    0xb7c8dc
  );


  createBuilding(
    -45,
    -45,
    18,
    7,
    18,
    0xd8875c
  );


  createBuilding(
    70,
    20,
    22,
    8,
    18,
    0xd9d9d9
  );

}


function createBuilding(
  x,
  z,
  width,
  height,
  depth,
  color
) {

  const building =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        width,
        height,
        depth
      ),

      new THREE.MeshStandardMaterial({
        color: color
      })

    );


  building.position.set(
    x,
    height / 2,
    z
  );


  building.castShadow =
    true;


  building.receiveShadow =
    true;


  scene.add(
    building
  );

}


/* =========================================
   IMPROVED PLAYER
========================================= */

function createPlayer() {

  player =
    new THREE.Group();


  player.position.set(
    0,
    0,
    25
  );


  /* MATERIALS */

  const skin =
    new THREE.MeshStandardMaterial({
      color: 0xc98b63
    });


  const shirt =
    new THREE.MeshStandardMaterial({
      color: 0x2563eb
    });


  const pants =
    new THREE.MeshStandardMaterial({
      color: 0x20242a
    });


  const shoes =
    new THREE.MeshStandardMaterial({
      color: 0x111111
    });


  const hair =
    new THREE.MeshStandardMaterial({
      color: 0x24170f
    });


  /* BODY */

  const body =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.9,
        1.1,
        0.5
      ),

      shirt

    );


  body.position.y =
    1.45;


  body.castShadow =
    true;


  player.add(
    body
  );


  /* NECK */

  const neck =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        0.15,
        0.15,
        0.22,
        12
      ),

      skin

    );


  neck.position.y =
    2.1;


  player.add(
    neck
  );


  /* HEAD */

  const head =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.43,
        20,
        16
      ),

      skin

    );


  head.scale.y =
    1.08;


  head.position.y =
    2.5;


  head.castShadow =
    true;


  player.add(
    head
  );


  /* HAIR */

  const hairMesh =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.44,
        20,
        12
      ),

      hair

    );


  hairMesh.scale.set(
    1,
    0.55,
    1
  );


  hairMesh.position.y =
    2.78;


  player.add(
    hairMesh
  );


  /* EYES */

  const eyeMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x111111
    });


  const eye1 =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.045,
        8,
        8
      ),
      eyeMaterial
    );


  eye1.position.set(
    -0.15,
    2.55,
    -0.4
  );


  player.add(
    eye1
  );


  const eye2 =
    eye1.clone();


  eye2.position.x =
    0.15;


  player.add(
    eye2
  );


  /* ARMS */

  const armGeometry =
    new THREE.CapsuleGeometry(
      0.12,
      0.65,
      6,
      8
    );


  const arm1 =
    new THREE.Mesh(
      armGeometry,
      skin
    );


  arm1.position.set(
    -0.58,
    1.4,
    0
  );


  player.add(
    arm1
  );


  const arm2 =
    arm1.clone();


  arm2.position.x =
    0.58;


  player.add(
    arm2
  );


  /* LEGS */

  const legGeometry =
    new THREE.CapsuleGeometry(
      0.15,
      0.7,
      6,
      8
    );


  const leg1 =
    new THREE.Mesh(
      legGeometry,
      pants
    );


  leg1.position.set(
    -0.22,
    0.55,
    0
  );


  player.add(
    leg1
  );


  const leg2 =
    leg1.clone();


  leg2.position.x =
    0.22;


  player.add(
    leg2
  );


  /* SHOES */

  const shoe1 =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.38,
        0.2,
        0.6
      ),

      shoes

    );


  shoe1.position.set(
    -0.22,
    0.12,
    -0.08
  );


  player.add(
    shoe1
  );


  const shoe2 =
    shoe1.clone();


  shoe2.position.x =
    0.22;


  player.add(
    shoe2
  );


  player.userData = {
    outfit: "blue"
  };


  scene.add(
    player
  );

}


/* =========================================
   KEYBOARD
========================================= */

function setupKeyboard() {

  window.addEventListener(
    "keydown",
    event => {

      keys[
        event.key.toLowerCase()
      ] = true;


      if (
        event.code === "Space"
      ) {

        jump();

      }

    }
  );


  window.addEventListener(
    "keyup",
    event => {

      keys[
        event.key.toLowerCase()
      ] = false;

    }
  );

}


/* =========================================
   JOYSTICK
========================================= */

function setupJoystick() {

  const joystick =
    document.getElementById(
      "joystick"
    );


  const stick =
    document.getElementById(
      "joystickStick"
    );


  if (
    !joystick ||
    !stick
  ) {

    return;

  }


  let active =
    false;


  joystick.addEventListener(
    "pointerdown",
    event => {

      active = true;

      joystick.setPointerCapture(
        event.pointerId
      );

      updateJoystick(
        event,
        joystick,
        stick
      );

    }
  );


  joystick.addEventListener(
    "pointermove",
    event => {

      if (!active) {

        return;

      }


      updateJoystick(
        event,
        joystick,
        stick
      );

    }
  );


  joystick.addEventListener(
    "pointerup",
    resetJoystick
  );


  joystick.addEventListener(
    "pointercancel",
    resetJoystick
  );


  function resetJoystick() {

    active = false;

    input.x = 0;
    input.y = 0;


    stick.style.transform =
      "translate(-50%, -50%)";

  }

}


function updateJoystick(
  event,
  joystick,
  stick
) {

  const rect =
    joystick.getBoundingClientRect();


  const centerX =
    rect.left +
    rect.width / 2;


  const centerY =
    rect.top +
    rect.height / 2;


  let dx =
    event.clientX -
    centerX;


  let dy =
    event.clientY -
    centerY;


  const max =
    38;


  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (
    distance > max
  ) {

    dx =
      dx /
      distance *
      max;


    dy =
      dy /
      distance *
      max;

  }


  input.x =
    dx / max;


  input.y =
    -dy / max;


  stick.style.transform =
    `translate(
      calc(-50% + ${dx}px),
      calc(-50% + ${dy}px)
    )`;

}


/* =========================================
   BUTTONS
========================================= */

function setupButtons() {

  const jumpButton =
    document.getElementById(
      "jumpButton"
    );


  if (jumpButton) {

    jumpButton.addEventListener(
      "pointerdown",
      jump
    );

  }

}


/* =========================================
   JUMP
========================================= */

function jump() {

  if (!grounded) {

    return;

  }


  grounded = false;

  jumpVelocity =
    7;

}


/* =========================================
   PLAYER UPDATE
========================================= */

function updatePlayer(
  delta
) {

  let x =
    input.x;


  let z =
    input.y;


  if (
    keys["w"] ||
    keys["arrowup"]
  ) {

    z = 1;

  }


  if (
    keys["s"] ||
    keys["arrowdown"]
  ) {

    z = -1;

  }


  if (
    keys["a"] ||
    keys["arrowleft"]
  ) {

    x = -1;

  }


  if (
    keys["d"] ||
    keys["arrowright"]
  ) {

    x = 1;

  }


  const length =
    Math.sqrt(
      x * x +
      z * z
    );


  if (
    length > 0.05
  ) {

    x /= length;
    z /= length;


    const speed =
      4.5;


    const forward =
      new THREE.Vector3(
        -Math.sin(cameraYaw),
        0,
        -Math.cos(cameraYaw)
      );


    const right =
      new THREE.Vector3(
        Math.cos(cameraYaw),
        0,
        -Math.sin(cameraYaw)
      );


    const movement =
      new THREE.Vector3();


    movement.addScaledVector(
      forward,
      z
    );


    movement.addScaledVector(
      right,
      x
    );


    movement.normalize();


    player.position.addScaledVector(
      movement,
      speed * delta
    );


    player.rotation.y =
      Math.atan2(
        movement.x,
        movement.z
      );

  }


  /* GRAVITY */

  jumpVelocity -=
    18 * delta;


  player.position.y +=
    jumpVelocity * delta;


  if (
    player.position.y <= 0
  ) {

    player.position.y =
      0;

    jumpVelocity =
      0;

    grounded =
      true;

  }

}


/* =========================================
   CAMERA
========================================= */

function updateCamera() {

  const target =
    player.position.clone();


  target.y +=
    1.5;


  const distance =
    7;


  const height =
    3;


  const offset =
    new THREE.Vector3(

      Math.sin(cameraYaw) *
      distance,

      height,

      Math.cos(cameraYaw) *
      distance

    );


  const desired =
    target.clone().add(
      offset
    );


  camera.position.lerp(
    desired,
    0.12
  );


  camera.lookAt(
    target
  );

}


/* =========================================
   MAP
========================================= */

function setupMap() {

  const button =
    document.getElementById(
      "mapButton"
    );


  const map =
    document.getElementById(
      "mapScreen"
    );


  const close =
    document.getElementById(
      "closeMap"
    );


  if (
    button &&
    map
  ) {

    button.addEventListener(
      "click",
      () => {

        map.classList.remove(
          "hidden"
        );

      }
    );

  }


  if (
    close &&
    map
  ) {

    close.addEventListener(
      "click",
      () => {

        map.classList.add(
          "hidden"
        );

      }
    );

  }

}


/* =========================================
   MESSAGE
========================================= */

let messageTimer;


function showMessage(
  text
) {

  const message =
    document.getElementById(
      "message"
    );


  if (!message) {

    return;

  }


  message.textContent =
    text;


  clearTimeout(
    messageTimer
  );


  messageTimer =
    setTimeout(
      () => {

        message.textContent =
          "";

      },
      2500
    );

}


/* =========================================
   RESIZE
========================================= */

function setupResize() {

  window.addEventListener(
    "resize",
    () => {

      camera.aspect =
        window.innerWidth /
        window.innerHeight;


      camera.updateProjectionMatrix();


      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

    }
  );

}


/* =========================================
   GAME LOOP
========================================= */

function animate() {

  requestAnimationFrame(
    animate
  );


  const delta =
    Math.min(
      clock.getDelta(),
      0.05
    );


  updatePlayer(
    delta
  );


  updateCamera();


  /*
     MISSIONS
     لو الملف موجود،
     يتم تحديث المهمات.
  */

  if (
    window.MissionSystem &&
    typeof
    window.MissionSystem.update ===
    "function"
  ) {

    window.MissionSystem.update(
      delta
    );

  }


  renderer.render(
    scene,
    camera
  );

}


/* =========================================
   START GAME
========================================= */

try {

  init();

} catch (error) {

  console.error(
    "GAME ERROR:",
    error
  );


  const game =
    document.getElementById(
      "game"
    );


  if (game) {

    game.innerHTML =
      `
      <div style="
        position:fixed;
        inset:0;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#111;
        color:white;
        font-family:Arial;
        text-align:center;
        padding:20px;
      ">
        <div>
          <h2>حدث خطأ في اللعبة</h2>
          <p>افتح Console لمعرفة الخطأ.</p>
        </div>
      </div>
      `;

  }

    }
