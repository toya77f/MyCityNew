import * as THREE from "three";

/* =====================================================
   MY CITY — IMPROVED CHARACTER
===================================================== */

let scene;
let camera;
let renderer;
let player;
let clock;

let cameraYaw = 0;
let jumpVelocity = 0;
let grounded = true;
let sprinting = false;

const input = {
  x: 0,
  y: 0
};

const keys = {};

const streetLights = [];

let sunLight;
let ambientLight;

let dayTime = 0.25;


/* =====================================================
   START
===================================================== */

function init() {

  scene = new THREE.Scene();

  scene.background =
    new THREE.Color(0x87ceeb);

  clock = new THREE.Clock();


  /* CAMERA */

  camera =
    new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
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

  renderer.shadowMap.enabled = true;

  renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;


  const game =
    document.getElementById("game");

  game.innerHTML = "";

  game.appendChild(
    renderer.domElement
  );


  /* CITY */

  createLights();
  createGround();
  createRoads();
  createCityBuildings();
  createHome();
  createSchool();
  createMall();
  createShops();
  createPoliceStation();
  createStreetLights();


  /* CHARACTER */

  createPlayer();


  /* CONTROLS */

  setupKeyboard();
  setupJoystick();
  setupCameraTouch();
  setupButtons();
  setupMap();
  setupResize();


  showMessage(
    "👤 الشخصية الجديدة جاهزة!"
  );


  animate();

}


/* =====================================================
   LIGHTS
===================================================== */

function createLights() {

  ambientLight =
    new THREE.HemisphereLight(
      0xbfe7ff,
      0x405040,
      1.5
    );

  scene.add(
    ambientLight
  );


  sunLight =
    new THREE.DirectionalLight(
      0xffffff,
      2
    );

  sunLight.position.set(
    80,
    120,
    80
  );

  sunLight.castShadow = true;

  sunLight.shadow.mapSize.width =
    2048;

  sunLight.shadow.mapSize.height =
    2048;

  scene.add(
    sunLight
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

  createRoad(0, 0, 300, 16);
  createRoad(0, 0, 16, 300);

  createRoad(0, 70, 300, 10);
  createRoad(0, -70, 300, 10);

  createRoad(70, 0, 10, 300);
  createRoad(-70, 0, 10, 300);

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

function createBuilding(
  x,
  z,
  width,
  height,
  depth,
  color,
  label
) {

  const group =
    new THREE.Group();

  group.position.set(
    x,
    0,
    z
  );


  const building =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        width,
        height,
        depth
      ),

      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.8
      })

    );

  building.position.y =
    height / 2;

  building.castShadow = true;

  building.receiveShadow = true;

  group.add(
    building
  );


  if (label) {

    addLabel(
      group,
      height,
      label
    );

  }


  scene.add(
    group
  );

}


function createCityBuildings() {

  const buildings = [

    [-45, -45, 20, 10, 20, 0xc8b99d],
    [45, -45, 20, 14, 20, 0xb8c5d1],
    [-45, 45, 20, 12, 20, 0xd5a66a],
    [45, 45, 20, 9, 20, 0xd1d1d1],

    [-95, -40, 18, 8, 18, 0xc9d1c2],
    [95, -40, 18, 11, 18, 0xd8b48a],
    [-95, 40, 18, 9, 18, 0xb8c4d0],
    [95, 40, 18, 13, 18, 0xc9b6a5]

  ];


  buildings.forEach(
    data => {

      createBuilding(
        ...data,
        ""
      );

    }
  );

}


/* =====================================================
   SPECIAL PLACES
===================================================== */

function createHome() {

  createBuilding(
    72,
    72,
    22,
    7,
    20,
    0xc98255,
    "🏠 البيت"
  );

}


function createSchool() {

  createBuilding(
    -72,
    72,
    30,
    10,
    22,
    0xe5c879,
    "🏫 المدرسة"
  );

}


function createMall() {

  createBuilding(
    72,
    -72,
    40,
    13,
    28,
    0xb8c9dc,
    "🛍️ المول"
  );

}


function createShops() {

  createBuilding(
    -72,
    -72,
    18,
    6,
    18,
    0xd8875c,
    "🏪 محل"
  );

  createBuilding(
    -95,
    -72,
    18,
    6,
    18,
    0x7da5c4,
    "🏪 محل"
  );

  createBuilding(
    105,
    -72,
    18,
    6,
    18,
    0xc98d5b,
    "🏪 محل"
  );

}


/* =====================================================
   POLICE
===================================================== */

function createPoliceStation() {

  createBuilding(
    72,
    35,
    28,
    8,
    22,
    0xd9d9d9,
    "🚓 الشرطة"
  );

  createPoliceCar(58, 25);
  createPoliceCar(86, 25);

}


function createPoliceCar(
  x,
  z
) {

  const car =
    new THREE.Group();

  car.position.set(
    x,
    0,
    z
  );


  const body =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        2.2,
        0.7,
        4
      ),

      new THREE.MeshStandardMaterial({
        color: 0xffffff
      })

    );

  body.position.y =
    0.7;

  body.castShadow = true;

  car.add(
    body
  );


  const stripe =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        2.25,
        0.22,
        1.4
      ),

      new THREE.MeshStandardMaterial({
        color: 0x111111
      })

    );

  stripe.position.y =
    0.95;

  car.add(
    stripe
  );


  const light =
    new THREE.PointLight(
      0x2277ff,
      2,
      10
    );

  light.position.y =
    1.5;

  car.add(
    light
  );


  scene.add(
    car
  );

}


/* =====================================================
   LABEL
===================================================== */

function addLabel(
  parent,
  height,
  text
) {

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 512;
  canvas.height = 128;


  const ctx =
    canvas.getContext(
      "2d"
    );


  ctx.fillStyle =
    "rgba(0,0,0,0.65)";

  ctx.fillRect(
    10,
    10,
    492,
    108
  );


  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    "bold 42px Arial";

  ctx.textAlign =
    "center";

  ctx.textBaseline =
    "middle";

  ctx.fillText(
    text,
    256,
    64
  );


  const texture =
    new THREE.CanvasTexture(
      canvas
    );


  const material =
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    });


  const sprite =
    new THREE.Sprite(
      material
    );


  sprite.scale.set(
    7,
    1.75,
    1
  );


  sprite.position.y =
    height + 2;


  parent.add(
    sprite
  );

}


/* =====================================================
   STREET LIGHTS
===================================================== */

function createStreetLights() {

  const positions = [

    [-12, -35],
    [12, -35],

    [-12, 35],
    [12, 35],

    [-35, -12],
    [-35, 12],

    [35, -12],
    [35, 12],

    [-62, -12],
    [-62, 12],

    [62, -12],
    [62, 12],

    [-12, -62],
    [12, -62],

    [-12, 62],
    [12, 62]

  ];


  positions.forEach(
    position => {

      createStreetLight(
        position[0],
        position[1]
      );

    }
  );

}


function createStreetLight(
  x,
  z
) {

  const group =
    new THREE.Group();


  group.position.set(
    x,
    0,
    z
  );


  const pole =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        0.08,
        0.12,
        5,
        10
      ),

      new THREE.MeshStandardMaterial({
        color: 0x222222
      })

    );

  pole.position.y =
    2.5;

  group.add(
    pole
  );


  const bulb =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.18,
        12,
        12
      ),

      new THREE.MeshStandardMaterial({
        color: 0xffffcc,
        emissive: 0xffd27d,
        emissiveIntensity: 2
      })

    );

  bulb.position.y =
    5;

  group.add(
    bulb
  );


  const light =
    new THREE.PointLight(
      0xffd27d,
      0,
      18
    );

  light.position.y =
    5;

  group.add(
    light
  );


  streetLights.push(
    light
  );


  scene.add(
    group
  );

}


/* =====================================================
   IMPROVED CHARACTER
===================================================== */

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
      color: 0xc98b63,
      roughness: 0.8
    });


  const skinDark =
    new THREE.MeshStandardMaterial({
      color: 0xb87350,
      roughness: 0.85
    });


  const shirt =
    new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.75
    });


  const pants =
    new THREE.MeshStandardMaterial({
      color: 0x20242a,
      roughness: 0.9
    });


  const shoes =
    new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.9
    });


  const hair =
    new THREE.MeshStandardMaterial({
      color: 0x24170f,
      roughness: 0.95
    });


  /* =================================================
     TORSO
  ================================================= */

  const torso =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.95,
        1.15,
        0.52
      ),

      shirt

    );


  torso.position.y =
    1.48;

  torso.castShadow = true;

  player.add(
    torso
  );


  /* =================================================
     NECK
  ================================================= */

  const neck =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        0.16,
        0.16,
        0.25,
        12
      ),

      skin

    );


  neck.position.y =
    2.12;

  neck.castShadow = true;

  player.add(
    neck
  );


  /* =================================================
     HEAD
  ================================================= */

  const head =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.43,
        24,
        20
      ),

      skin

    );


  head.scale.set(
    0.92,
    1.08,
    0.92
  );


  head.position.y =
    2.52;

  head.castShadow = true;

  player.add(
    head
  );


  /* =================================================
     HAIR
  ================================================= */

  const hairTop =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.44,
        20,
        16,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.48
      ),

      hair

    );


  hairTop.scale.set(
    0.98,
    0.72,
    0.98
  );


  hairTop.position.y =
    2.78;

  hairTop.castShadow = true;

  player.add(
    hairTop
  );


  /* =================================================
     EARS
  ================================================= */

  const leftEar =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.09,
        12,
        12
      ),

      skin

    );


  leftEar.position.set(
    -0.42,
    2.52,
    0
  );

  player.add(
    leftEar
  );


  const rightEar =
    leftEar.clone();


  rightEar.position.x =
    0.42;

  player.add(
    rightEar
  );


  /* =================================================
     EYES
  ================================================= */

  const eyeMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x111111
    });


  const leftEye =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.045,
        10,
        10
      ),

      eyeMaterial

    );


  leftEye.position.set(
    -0.16,
    2.57,
    -0.405
  );


  player.add(
    leftEye
  );


  const rightEye =
    leftEye.clone();


  rightEye.position.x =
    0.16;


  player.add(
    rightEye
  );


  /* =================================================
     NOSE
  ================================================= */

  const nose =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.055,
        10,
        10
      ),

      skinDark

    );


  nose.scale.set(
    0.8,
    1,
    1.4
  );


  nose.position.set(
    0,
    2.47,
    -0.42
  );


  player.add(
    nose
  );


  /* =================================================
     ARMS
  ================================================= */

  const armGeometry =
    new THREE.CapsuleGeometry(
      0.13,
      0.72,
      6,
      10
    );


  const leftArm =
    new THREE.Mesh(
      armGeometry,
      skin
    );


  leftArm.position.set(
    -0.62,
    1.45,
    0
  );


  leftArm.rotation.z =
    -0.05;

  leftArm.castShadow = true;

  player.add(
    leftArm
  );


  const rightArm =
    leftArm.clone();


  rightArm.position.x =
    0.62;

  rightArm.rotation.z =
    0.05;

  player.add(
    rightArm
  );


  /* =================================================
     HANDS
  ================================================= */

  const leftHand =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.15,
        14,
        14
      ),

      skin

    );


  leftHand.position.set(
    -0.62,
    0.95,
    0
  );


  player.add(
    leftHand
  );


  const rightHand =
    leftHand.clone();


  rightHand.position.x =
    0.62;


  player.add(
    rightHand
  );


  /* =================================================
     LEGS
  ================================================= */

  const legGeometry =
    new THREE.CapsuleGeometry(
      0.16,
      0.72,
      6,
      10
    );


  const leftLeg =
    new THREE.Mesh(
      legGeometry,
      pants
    );


  leftLeg.position.set(
    -0.23,
    0.55,
    0
  );


  leftLeg.castShadow = true;

  player.add(
    leftLeg
  );


  const rightLeg =
    leftLeg.clone();


  rightLeg.position.x =
    0.23;


  player.add(
    rightLeg
  );


  /* =================================================
     SHOES
  ================================================= */

  const leftShoe =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.38,
        0.22,
        0.62
      ),

      shoes

    );


  leftShoe.position.set(
    -0.23,
    0.12,
    -0.08
  );


  leftShoe.castShadow = true;

  player.add(
    leftShoe
  );


  const rightShoe =
    leftShoe.clone();


  rightShoe.position.x =
    0.23;


  player.add(
    rightShoe
  );


  /* =================================================
     CHARACTER DATA
  ================================================= */

  player.userData = {

    outfit: "blue",

    hair: "dark",

    height: 2.95

  };


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


  function move(
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

      move(
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

      move(
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

   
