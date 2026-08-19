import * as THREE from "three";


/* =====================================================
   MY CITY — GAME.JS
   النسخة الجديدة من الصفر
===================================================== */


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let scene;
let camera;
let renderer;

let player;

let clock;

let cameraYaw = 0;
let cameraPitch = 0.28;

let jumpVelocity = 0;
let grounded = true;

let sprinting = false;

let gameReady = false;


/* =====================================================
   INPUT
===================================================== */

const input = {
  x: 0,
  y: 0
};

const keys = {};


/* =====================================================
   INITIALIZE
===================================================== */

function init() {

  console.log("MY CITY: starting...");


  /* ---------------------------------------------------
     SCENE
  --------------------------------------------------- */

  scene = new THREE.Scene();

  scene.background =
    new THREE.Color(0x87ceeb);


  /* ---------------------------------------------------
     CLOCK
  --------------------------------------------------- */

  clock =
    new THREE.Clock();


  /* ---------------------------------------------------
     CAMERA
  --------------------------------------------------- */

  camera =
    new THREE.PerspectiveCamera(
      70,
      window.innerWidth /
      window.innerHeight,
      0.1,
      1000
    );


  camera.position.set(
    0,
    4,
    8
  );


  /* ---------------------------------------------------
     RENDERER
  --------------------------------------------------- */

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


  renderer.shadowMap.enabled = true;


  renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;


  const game =
    document.getElementById("game");


  if (!game) {

    throw new Error(
      "لم يتم العثور على عنصر #game"
    );

  }


  game.appendChild(
    renderer.domElement
  );


  /* ---------------------------------------------------
     LIGHTS
  --------------------------------------------------- */

  createLights();


  /* ---------------------------------------------------
     CITY
  --------------------------------------------------- */

  createGround();

  createRoads();

  createBuildings();


  /* ---------------------------------------------------
     PLAYER
  --------------------------------------------------- */

  createPlayer();


  /* ---------------------------------------------------
     CONTROLS
  --------------------------------------------------- */

  setupKeyboard();

  setupJoystick();

  setupCameraTouch();

  setupButtons();

  setupMap();

  setupResize();


  /* ---------------------------------------------------
     READY
  --------------------------------------------------- */

  gameReady = true;


  showMessage(
    "🎮 اللعبة جاهزة!"
  );


  console.log(
    "MY CITY: ready"
  );


  animate();

}


/* =====================================================
   LIGHTING
===================================================== */

function createLights() {

  const ambient =
    new THREE.HemisphereLight(
      0xbfe7ff,
      0x446644,
      1.5
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
    80,
    120,
    80
  );


  sun.castShadow = true;


  sun.shadow.mapSize.width =
    2048;

  sun.shadow.mapSize.height =
    2048;


  sun.shadow.camera.left =
    -150;

  sun.shadow.camera.right =
    150;

  sun.shadow.camera.top =
    150;

  sun.shadow.camera.bottom =
    -150;


  scene.add(
    sun
  );

}


/* =====================================================
   GROUND
===================================================== */

function createGround() {

  const ground =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        300,
        300
      ),

      new THREE.MeshStandardMaterial({
        color: 0x5d8a50,
        roughness: 1
      })

    );


  ground.rotation.x =
    -Math.PI / 2;


  ground.receiveShadow = true;


  scene.add(
    ground
  );

}


/* =====================================================
   ROADS
===================================================== */

function createRoads() {

  createRoad(
    0,
    0,
    300,
    16
  );


  createRoad(
    0,
    0,
    16,
    300
  );


  createRoad(
    0,
    65,
    300,
    10
  );


  createRoad(
    0,
    -65,
    300,
    10
  );


  createRoad(
    65,
    0,
    10,
    300
  );


  createRoad(
    -65,
    0,
    10,
    300
  );

}


function createRoad(
  x,
  z,
  width,
  depth
) {

  const road =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        width,
        0.04,
        depth
      ),

      new THREE.MeshStandardMaterial({
        color: 0x303236,
        roughness: 0.95
      })

    );


  road.position.set(
    x,
    0.02,
    z
  );


  road.receiveShadow = true;


  scene.add(
    road
  );

}


/* =====================================================
   BUILDINGS
===================================================== */

function createBuildings() {

  const data = [

    [-45, -45, 20, 10, 20, 0xc8b99d],

    [45, -45, 20, 14, 20, 0xb8c5d1],

    [-45, 45, 20, 12, 20, 0xd5a66a],

    [45, 45, 20, 9, 20, 0xd1d1d1],

    [-95, -40, 18, 8, 18, 0xc9d1c2],

    [95, -40, 18, 11, 18, 0xd8b48a],

    [-95, 40, 18, 9, 18, 0xb8c4d0],

    [95, 40, 18, 13, 18, 0xc9b6a5]

  ];


  data.forEach(
    item => {

      createBuilding(
        item[0],
        item[1],
        item[2],
        item[3],
        item[4],
        item[5]
      );

    }
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
        color: color,
        roughness: 0.8
      })

    );


  building.position.set(
    x,
    height / 2,
    z
  );


  building.castShadow = true;

  building.receiveShadow = true;


  scene.add(
    building
  );

}


/* =====================================================
   PLAYER
===================================================== */

function createPlayer() {

  player =
    new THREE.Group();


  player.position.set(
    0,
    0,
    25
  );


  /* ---------------------------------------------------
     MATERIALS
  --------------------------------------------------- */

  const skin =
    new THREE.MeshStandardMaterial({
      color: 0xc98b63
    });


  const shirtMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x2563eb
    });


  const pantsMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x20242a
    });


  /* ---------------------------------------------------
     BODY
  --------------------------------------------------- */

  const body =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.9,
        1.1,
        0.5
      ),

      shirtMaterial

    );


  body.position.y =
    1.45;


  body.castShadow = true;


  player.add(
    body
  );


  /* ---------------------------------------------------
     HEAD
  --------------------------------------------------- */

  const head =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.38,
        20,
        20
      ),

      skin

    );


  head.position.y =
    2.35;


  head.castShadow = true;


  player.add(
    head
  );


  /* ---------------------------------------------------
     LEFT ARM
  --------------------------------------------------- */

  const leftArm =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.25,
        1,
        0.25
      ),

      skin

    );


  leftArm.position.set(
    -0.62,
    1.45,
    0
  );


  leftArm.castShadow = true;


  player.add(
    leftArm
  );


  /* ---------------------------------------------------
     RIGHT ARM
  --------------------------------------------------- */

  const rightArm =
    leftArm.clone();


  rightArm.position.x =
    0.62;


  player.add(
    rightArm
  );


  /* ---------------------------------------------------
     LEFT LEG
  --------------------------------------------------- */

  const leftLeg =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.35,
        1.1,
        0.35
      ),

      pantsMaterial

    );


  leftLeg.position.set(
    -0.22,
    0.55,
    0
  );


  leftLeg.castShadow = true;


  player.add(
    leftLeg
  );


  /* ---------------------------------------------------
     RIGHT LEG
  --------------------------------------------------- */

  const rightLeg =
    leftLeg.clone();


  rightLeg.position.x =
    0.22;


  player.add(
    rightLeg
  );


  scene.add(
    player
  );

}


/* =====================================================
   KEYBOARD
===================================================== */

function setupKeyboard() {

  window.addEventListener(
    "keydown",
    event => {

      keys[
        event.key.toLowerCase()
      ] = true;


      if (
        event.code ===
        "Space"
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


/* =====================================================
   JOYSTICK
===================================================== */

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


  let active = false;


  const maxDistance = 38;


  function updateStick(
    x,
    y
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
      x -
      centerX;


    let dy =
      y -
      centerY;


    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );


    if (
      distance >
      maxDistance
    ) {

      dx =
        dx /
        distance *
        maxDistance;


      dy =
        dy /
        distance *
        maxDistance;

    }


    input.x =
      dx /
      maxDistance;


    input.y =
      -dy /
      maxDistance;


    stick.style.transform =
      `translate(
        calc(-50% + ${dx}px),
        calc(-50% + ${dy}px)
      )`;

  }


  function reset() {

    active = false;


    input.x = 0;

    input.y = 0;


    stick.style.transform =
      "translate(-50%, -50%)";

  }


  joystick.addEventListener(
    "pointerdown",
    event => {

      active = true;

      joystick.setPointerCapture(
        event.pointerId
      );


      updateStick(
        event.clientX,
        event.clientY
      );

    }
  );


  joystick.addEventListener(
    "pointermove",
    event => {

      if (!active) {

        return;

      }


      updateStick(
        event.clientX,
        event.clientY
      );

    }
  );


  joystick.addEventListener(
    "pointerup",
    reset
  );


  joystick.addEventListener(
    "pointercancel",
    reset
  );

}


/* =====================================================
   CAMERA TOUCH
===================================================== */

function setupCameraTouch() {

  let active = false;

  let lastX = 0;

  let lastY = 0;


  renderer.domElement.addEventListener(
    "pointerdown",
    event => {

      if (
        event.clientX <
        window.innerWidth * 0.45
      ) {

        return;

      }


      active = true;


      lastX =
        event.clientX;


      lastY =
        event.clientY;


      renderer.domElement.setPointerCapture(
        event.pointerId
      );

    }
  );


  renderer.domElement.addEventListener(
    "pointermove",
    event => {

      if (!active) {

        return;

      }


      const dx =
        event.clientX -
        lastX;


      const dy =
        event.clientY -
        lastY;


      lastX =
        event.clientX;


      lastY =
        event.clientY;


      cameraYaw -=
        dx * 0.006;


      cameraPitch -=
        dy * 0.004;


      cameraPitch =
        THREE.MathUtils.clamp(
          cameraPitch,
          -0.2,
          0.8
        );

    }
  );


  renderer.domElement.addEventListener(
    "pointerup",
    () => {

      active = false;

    }
  );


  renderer.domElement.addEventListener(
    "pointercancel",
    () => {

      active = false;

    }
  );

}


/* =====================================================
   BUTTONS
===================================================== */

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


  const sprintButton =
    document.getElementById(
      "sprintButton"
    );


  if (sprintButton) {

    sprintButton.addEventListener(
      "pointerdown",
      () => {

        sprinting = true;

      }
    );


    sprintButton.addEventListener(
      "pointerup",
      () => {

        sprinting = false;

      }
    );


    sprintButton.addEventListener(
      "pointercancel",
      () => {

        sprinting = false;

      }
    );

  }

}


/* =====================================================
   JUMP
===================================================== */

function jump() {

  if (!grounded) {

    return;

  }


  grounded = false;


  jumpVelocity = 7;

}


/* =====================================================
   UPDATE PLAYER
===================================================== */

function updatePlayer(
  delta
) {

  if (!player) {

    return;

  }


  let x =
    input.x;


  let z =
    input.y;


  /* KEYBOARD */

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
    length >
    0.05
  ) {

    x /=
      length;

    z /=
      length;


    const speed =
      sprinting
        ? 8
        : 4.5;


    /* CAMERA RELATIVE */

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


    /* الشخصية تبص لاتجاه الحركة */

    const targetRotation =
      Math.atan2(
        movement.x,
        movement.z
      );


    player.rotation.y =
      THREE.MathUtils.lerp(
        player.rotation.y,
        targetRotation,
        0.15
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

    player.position.y = 0;

    jumpVelocity = 0;

    grounded = true;

  }

}


/* =====================================================
   CAMERA UPDATE
===================================================== */

function updateCamera() {

  if (!player) {

    return;

  }


  const target =
    player.position.clone();


  target.y +=
    1.4;


  const distance = 7;


  const height = 3;


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


/* =====================================================
   MAP
===================================================== */

function setupMap() {

  const mapButton =
    document.getElementById(
      "mapButton"
    );


  const mapScreen =
    document.getElementById(
      "mapScreen"
    );


  const closeMap =
    document.getElementById(
      "closeMap"
    );


  if (
    mapButton &&
    mapScreen
  ) {

    mapButton.addEventListener(
      "click",
      () => {

        mapScreen.classList.remove(
          "hidden"
        );

      }
    );

  }


  if (
    closeMap &&
    mapScreen
  ) {

    closeMap.addEventListener(
      "click",
      () => {

        mapScreen.classList.add(
          "hidden"
        );

      }
    );

  }

}


/* =====================================================
   MESSAGE
===================================================== */

let messageTimer;


function showMessage(
  text
) {

  const element =
    document.getElementById(
      "message"
    );


  if (!element) {

    return;

  }


  element.textContent =
    text;


  clearTimeout(
    messageTimer
  );


  messageTimer =
    setTimeout(
      () => {

        element.textContent =
          "";

      },
      2500
    );

}


/* =====================================================
   RESIZE
===================================================== */

function setupResize() {

  window.addEventListener(
    "resize",
    () => {

      if (
        !camera ||
        !renderer
      ) {

        return;

      }


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


/* =====================================================
   GAME LOOP
===================================================== */

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


  renderer.render(
    scene,
    camera
  );

}


/* =====================================================
   START
===================================================== */

try {

  init();

} catch (error) {

  console.error(
    "MY CITY ERROR:",
    error
  );


  const message =
    document.getElementById(
      "message"
    );


  if (message) {

    message.textContent =
      "❌ حصل خطأ في تشغيل اللعبة";

  }

    }
