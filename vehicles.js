/* =================================================
   MY CITY — VEHICLE SYSTEM
================================================= */

const VehicleSystem = {

  vehicles: [],

  currentVehicle: null,

  driving: false,

  speed: 0,

  maxSpeed: 14,

  acceleration: 18,

  brakePower: 25,


  /* ================================================
     CREATE CAR
  ================================================= */

  createVehicle(
    x,
    z,
    color
  ) {

    const car =
      new THREE.Group();


    car.position.set(
      x,
      0,
      z
    );


    /* BODY */

    const body =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          2.2,
          0.7,
          4.2
        ),

        new THREE.MeshStandardMaterial({
          color: color,
          roughness: 0.6
        })

      );


    body.position.y =
      0.7;


    body.castShadow =
      true;


    car.add(
      body
    );


    /* ROOF */

    const roof =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          1.7,
          0.65,
          2
        ),

        new THREE.MeshStandardMaterial({
          color: 0x20252b,
          roughness: 0.35
        })

      );


    roof.position.set(
      0,
      1.25,
      0
    );


    car.add(
      roof
    );


    /* WINDOWS */

    const glass =
      new THREE.MeshStandardMaterial({

        color: 0x4c7894,

        transparent: true,

        opacity: 0.7,

        roughness: 0.15

      });


    const frontWindow =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          1.45,
          0.42,
          0.08
        ),

        glass

      );


    frontWindow.position.set(
      0,
      1.28,
      -1.05
    );


    frontWindow.rotation.x =
      -0.15;


    car.add(
      frontWindow
    );


    const backWindow =
      frontWindow.clone();


    backWindow.position.z =
      1.05;


    backWindow.rotation.x =
      0.15;


    car.add(
      backWindow
    );


    /* WHEELS */

    const wheelPositions = [

      [-1.08, 0.42, -1.35],

      [ 1.08, 0.42, -1.35],

      [-1.08, 0.42,  1.35],

      [ 1.08, 0.42,  1.35]

    ];


    for (
      const p of wheelPositions
    ) {

      const wheel =
        new THREE.Mesh(

          new THREE.CylinderGeometry(
            0.42,
            0.42,
            0.3,
            18
          ),

          new THREE.MeshStandardMaterial({
            color: 0x111111
          })

        );


      wheel.rotation.z =
        Math.PI / 2;


      wheel.position.set(
        p[0],
        p[1],
        p[2]
      );


      wheel.castShadow =
        true;


      car.add(
        wheel
      );

    }


    /* HEADLIGHTS */

    const light =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.45,
          0.2,
          0.08
        ),

        new THREE.MeshStandardMaterial({

          color: 0xfff4b0,

          emissive: 0xffd45a,

          emissiveIntensity: 1.5

        })

      );


    light.position.set(
      -0.7,
      0.8,
      -2.12
    );


    car.add(
      light
    );


    const light2 =
      light.clone();


    light2.position.x =
      0.7;


    car.add(
      light2
    );


    car.userData = {

      isVehicle: true,

      occupied: false

    };


    this.vehicles.push(
      car
    );


    scene.add(
      car
    );


    return car;

  },


  /* ================================================
     CITY CARS
  ================================================= */

  createCityCars() {

    this.createVehicle(
      18,
      18,
      0xd33f3f
    );


    this.createVehicle(
      -18,
      18,
      0x2878d8
    );


    this.createVehicle(
      30,
      -20,
      0xf2c94c
    );


    this.createVehicle(
      -30,
      -20,
      0xeeeeee
    );


    this.createVehicle(
      60,
      10,
      0x25a65a
    );


    this.createVehicle(
      -60,
      10,
      0x8e44ad
    );

  },


  /* ================================================
     FIND CAR
  ================================================= */

  getNearestVehicle() {

    if (
      !player
    ) {

      return null;

    }


    let nearest =
      null;


    let distance =
      4.5;


    for (
      const car of this.vehicles
    ) {

      if (
        car.userData.occupied
      ) {

        continue;

      }


      const d =
        player.position.distanceTo(
          car.position
        );


      if (
        d < distance
      ) {

        distance =
          d;


        nearest =
          car;

      }

    }


    return nearest;

  },


  /* ================================================
     ENTER
  ================================================= */

  enterVehicle() {

    if (
      this.driving
    ) {

      return;

    }


    const car =
      this.getNearestVehicle();


    if (!car) {

      showMessage(
        "🚗 اقترب من العربية"
      );

      return;

    }


    this.currentVehicle =
      car;


    this.driving =
      true;


    this.speed =
      0;


    car.userData.occupied =
      true;


    player.visible =
      false;


    showMessage(
      "🚗 ركبت العربية — استخدم الـJoystick للقيادة"
    );


    this.showExitButton();

  },


  /* ================================================
     EXIT
  ================================================= */

  exitVehicle() {

    if (
      !this.driving ||
      !this.currentVehicle
    ) {

      return;

    }


    const car =
      this.currentVehicle;


    player.visible =
      true;


    player.position.copy(
      car.position
    );


    player.position.x +=
      3;


    player.position.y =
      0;


    car.userData.occupied =
      false;


    this.currentVehicle =
      null;


    this.driving =
      false;


    this.speed =
      0;


    this.hideExitButton();


    showMessage(
      "🚶 نزلت من العربية"
    );

  },


  /* ================================================
     DRIVE
  ================================================= */

  update(delta) {

    if (
      !this.driving ||
      !this.currentVehicle
    ) {

      return;

    }


    const car =
      this.currentVehicle;


    const throttle =
      input.y;


    const steering =
      input.x;


    /* ACCELERATION */

    if (
      Math.abs(throttle) > 0.05
    ) {

      this.speed +=
        throttle *
        this.acceleration *
        delta;

    } else {

      if (
        this.speed > 0
      ) {

        this.speed -=
          this.brakePower *
          delta;

      }


      if (
        this.speed < 0
      ) {

        this.speed +=
          this.brakePower *
          delta;

      }

    }


    this.speed =
      THREE.MathUtils.clamp(
        this.speed,
        -this.maxSpeed * 0.45,
        this.maxSpeed
      );


    /* TURN */

    if (
      Math.abs(this.speed) > 0.2
    ) {

      car.rotation.y -=
        steering *
        2.2 *
        delta *
        (Math.abs(this.speed) / this.maxSpeed) *
        (this.speed >= 0 ? 1 : -1);

    }


    /* MOVE */

    const forward =
      new THREE.Vector3(
        0,
        0,
        -1
      );


    forward.applyQuaternion(
      car.quaternion
    );


    car.position.addScaledVector(
      forward,
      this.speed * delta
    );


    car.position.y =
      0;


    /* CAMERA */

    const target =
      car.position.clone();


    target.y +=
      1.2;


    const distance =
      9;


    const offset =
      new THREE.Vector3(
        0,
        4.5,
        distance
      );


    offset.applyQuaternion(
      car.quaternion
    );


    camera.position.lerp(
      car.position.clone().add(
        offset
      ),
      0.12
    );


    camera.lookAt(
      target
    );

  },


  /* ================================================
     EXIT BUTTON
  ================================================= */

  showExitButton() {

    let button =
      document.getElementById(
        "exitVehicleButton"
      );


    if (!button) {

      button =
        document.createElement(
          "button"
        );


      button.id =
        "exitVehicleButton";


      button.textContent =
        "🚪 نزول";


      button.style.position =
        "fixed";


      button.style.right =
        "25px";


      button.style.bottom =
        "190px";


      button.style.zIndex =
        "200";


      button.style.padding =
        "14px 20px";


      button.style.border =
        "none";


      button.style.borderRadius =
        "15px";


      button.style.background =
        "#e53935";


      button.style.color =
        "white";


      button.style.fontSize =
        "16px";


      button.style.fontWeight =
        "bold";


      document.body.appendChild(
        button
      );


      button.addEventListener(
        "pointerdown",
        event => {

          event.preventDefault();

          this.exitVehicle();

        }
      );

    }


    button.style.display =
      "block";

  },


  hideExitButton() {

    const button =
      document.getElementById(
        "exitVehicleButton"
      );


    if (button) {

      button.style.display =
        "none";

    }

  }

};


/* =================================================
   ENTER BUTTON
================================================= */

const enterButton =
  document.createElement(
    "button"
  );


enterButton.id =
  "enterVehicleButton";


enterButton.textContent =
  "🚗 ركوب";


enterButton.style.position =
  "fixed";


enterButton.style.right =
  "25px";


enterButton.style.bottom =
  "25px";


enterButton.style.zIndex =
  "200";


enterButton.style.padding =
  "14px 20px";


enterButton.style.border =
  "none";


enterButton.style.borderRadius =
  "15px";


enterButton.style.background =
  "#1683ff";


enterButton.style.color =
  "white";


enterButton.style.fontSize =
  "16px";


enterButton.style.fontWeight =
  "bold";


document.body.appendChild(
  enterButton
);


enterButton.addEventListener(
  "pointerdown",
  event => {

    event.preventDefault();

    VehicleSystem.enterVehicle();

  }
);


/* =================================================
   KEYBOARD
================================================= */

window.addEventListener(
  "keydown",
  event => {

    if (
      event.key.toLowerCase() ===
      "e"
    ) {

      if (
        VehicleSystem.driving
      ) {

        VehicleSystem.exitVehicle();

      } else {

        VehicleSystem.enterVehicle();

      }

    }

  }
);


/* =================================================
   CREATE CARS AFTER GAME
================================================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      () => {

        VehicleSystem.createCityCars();

      },
      500
    );

  }
);


/* =================================================
   GLOBAL
================================================= */

window.VehicleSystem =
  VehicleSystem;
