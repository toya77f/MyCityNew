/* =========================================
   MY CITY — MISSIONS SYSTEM
========================================= */

const MissionSystem = {

  missions: [

    {
      id: 1,
      title: "🏠 ارجع للبيت",
      description: "اذهب إلى البيت لبدء مغامرتك.",
      target: new THREE.Vector3(0, 0, 25),
      reward: 100,
      completed: false
    },

    {
      id: 2,
      title: "🏫 اذهب إلى المدرسة",
      description: "اذهب إلى المدرسة الموجودة في المدينة.",
      target: new THREE.Vector3(30, 0, 30),
      reward: 150,
      completed: false
    },

    {
      id: 3,
      title: "🛍️ اذهب إلى المول",
      description: "اذهب إلى المول.",
      target: new THREE.Vector3(45, 0, -20),
      reward: 250,
      completed: false
    }

  ],

  currentMission: 0,

  money: 0,

  stars: 0,


  /* =====================================
     START
  ===================================== */

  start() {

    this.updateUI();

  },


  /* =====================================
     UPDATE
  ===================================== */

  update() {

    if (
      typeof player === "undefined" ||
      !player
    ) {

      return;

    }


    const mission =
      this.missions[
        this.currentMission
      ];


    if (!mission) {

      return;

    }


    if (
      mission.completed
    ) {

      return;

    }


    const distance =
      player.position.distanceTo(
        mission.target
      );


    if (
      distance < 5
    ) {

      this.completeMission(
        mission
      );

    }


    this.updateUI();

  },


  /* =====================================
     COMPLETE MISSION
  ===================================== */

  completeMission(
    mission
  ) {

    mission.completed =
      true;


    this.money +=
      mission.reward;


    this.stars +=
      1;


    showMessage(
      `🎉 تمت المهمة! +${mission.reward} 💰`
    );


    this.currentMission +=
      1;


    if (
      this.currentMission >=
      this.missions.length
    ) {

      setTimeout(
        () => {

          showMessage(
            "🏆 خلصت كل المهمات!"
          );

        },
        1000
      );

    }

  },


  /* =====================================
     UI
  ===================================== */

  updateUI() {

    const missionElement =
      document.getElementById(
        "mission"
      );


    if (
      !missionElement
    ) {

      return;

    }


    const mission =
      this.missions[
        this.currentMission
      ];


    if (!mission) {

      missionElement.innerHTML =
        `
        <strong>🏆 جميع المهمات مكتملة!</strong>
        <br>
        <span>
          استمتع باستكشاف المدينة.
        </span>
        `;

      return;

    }


    missionElement.innerHTML =
      `
      <strong>
        ${mission.title}
      </strong>

      <br>

      <span>
        ${mission.description}
      </span>

      <br>

      <small>
        💰 المكافأة: ${mission.reward}
      </small>
      `;


    updateMoneyUI();

  }

};


/* =========================================
   MONEY UI
========================================= */

function updateMoneyUI() {

  const boxes =
    document.querySelectorAll(
      ".hudBox"
    );


  if (
    boxes.length >= 2
  ) {

    boxes[1].textContent =
      `💰 ${MissionSystem.money} | ⭐ ${MissionSystem.stars}`;

  }

}


/* =========================================
   START MISSIONS
========================================= */

window.MissionSystem =
  MissionSystem;


window.addEventListener(
  "load",
  () => {

    MissionSystem.start();

  }
);
