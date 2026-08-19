/* =====================================================
   MY CITY — MISSIONS SYSTEM
===================================================== */

const MissionSystem = {

  current: 0,

  money: 0,

  stars: 0,

  active: false,

  missions: [

    {
      title: "🏠 ارجع البيت",
      description: "اذهب إلى البيت",
      target: new THREE.Vector3(72, 0, 72),
      reward: 100
    },

    {
      title: "🏫 اذهب إلى المدرسة",
      description: "اذهب إلى المدرسة",
      target: new THREE.Vector3(-72, 0, 72),
      reward: 150
    },

    {
      title: "🛍️ زيارة المول",
      description: "اذهب إلى المول",
      target: new THREE.Vector3(72, 0, -72),
      reward: 200
    },

    {
      title: "🏪 زيارة المحل",
      description: "اذهب إلى المحلات",
      target: new THREE.Vector3(-72, 0, -72),
      reward: 250
    },

    {
      title: "🚓 قسم الشرطة",
      description: "اذهب إلى قسم الشرطة",
      target: new THREE.Vector3(72, 0, 35),
      reward: 300
    }

  ],


  start() {

    this.current = 0;

    this.money = 0;

    this.stars = 0;

    this.active = true;

    this.showMission();

  },


  showMission() {

    if (
      !this.active ||
      this.current >= this.missions.length
    ) {

      this.finishAll();

      return;

    }


    const mission =
      this.missions[this.current];


    const missionElement =
      document.getElementById(
        "mission"
      );


    if (missionElement) {

      missionElement.innerHTML =
        `
        <strong>${mission.title}</strong>
        <br>
        ${mission.description}
        <br>
        💰 المكافأة: ${mission.reward}
        `;

    }


    this.createMarker(
      mission.target
    );

  },


  marker: null,


  createMarker(position) {

    this.removeMarker();


    const group =
      new THREE.Group();


    const ring =
      new THREE.Mesh(

        new THREE.TorusGeometry(
          2,
          0.15,
          12,
          32
        ),

        new THREE.MeshBasicMaterial({
          color: 0xffd000
        })

      );


    ring.rotation.x =
      Math.PI / 2;


    group.add(
      ring
    );


    const arrow =
      new THREE.Mesh(

        new THREE.ConeGeometry(
          0.5,
          1.4,
          8
        ),

        new THREE.MeshBasicMaterial({
          color: 0xff4d4d
        })

      );


    arrow.position.y =
      2.5;


    group.add(
      arrow
    );


    group.position.copy(
      position
    );


    group.position.y =
      0.15;


    scene.add(
      group
    );


    this.marker =
      group;

  },


  removeMarker() {

    if (
      this.marker
    ) {

      scene.remove(
        this.marker
      );

      this.marker =
        null;

    }

  },


  update(delta) {

    if (
      !this.active ||
      !player ||
      !this.marker
    ) {

      return;

    }


    this.marker.rotation.y +=
      delta * 2;


    const mission =
      this.missions[
        this.current
      ];


    const distance =
      player.position.distanceTo(
        mission.target
      );


    if (
      distance < 5
    ) {

      this.completeMission();

    }

  },


  completeMission() {

    const mission =
      this.missions[
        this.current
      ];


    this.money +=
      mission.reward;


    this.stars +=
      1;


    this.removeMarker();


    this.showMessage(
      `✅ خلصت المهمة! +${mission.reward} 💰`
    );


    this.current++;


    this.updateHUD();


    setTimeout(
      () => {

        if (
          this.current <
          this.missions.length
        ) {

          this.showMission();

        } else {

          this.finishAll();

        }

      },
      1500
    );

  },


  updateHUD() {

    const boxes =
      document.querySelectorAll(
        ".hudBox"
      );


    if (
      boxes.length >= 2
    ) {

      boxes[1].textContent =
        `💰 ${this.money} | ⭐ ${this.stars}`;

    }

  },


  showMessage(text) {

    const message =
      document.getElementById(
        "message"
      );


    if (
      message
    ) {

      message.textContent =
        text;

      setTimeout(
        () => {

          if (
            message.textContent ===
            text
          ) {

            message.textContent =
              "";

          }

        },
        2500
      );

    }

  },


  finishAll() {

    this.active =
      false;


    this.removeMarker();


    const missionElement =
      document.getElementById(
        "mission"
      );


    if (
      missionElement
    ) {

      missionElement.innerHTML =
        `
        <strong>🏆 خلصت كل المهمات!</strong>
        <br>
        💰 ${this.money}
        <br>
        ⭐ ${this.stars}
        `;

    }


    this.showMessage(
      "🏆 مبروك! خلصت سلسلة المهمات!"
    );

  }

};


/* =====================================================
   START MISSIONS AFTER GAME LOAD
===================================================== */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      () => {

        if (
          typeof MissionSystem !==
          "undefined"
        ) {

          MissionSystem.start();

        }

      },
      500
    );

  }
);


/* =====================================================
   MISSION UPDATE
===================================================== */

const oldMissionAnimation =
  window.requestAnimationFrame;


window.updateMissions =
  function(delta) {

    MissionSystem.update(
      delta
    );

  };


/* =====================================================
   GLOBAL
===================================================== */

window.MissionSystem =
  MissionSystem;
