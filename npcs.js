/* =================================================
   MY CITY — NPC SYSTEM
================================================= */

const NPCSystem = {

  npcs: [],

  talkingTo: null,

  colors: [
    0xe74c3c,
    0x3498db,
    0x2ecc71,
    0xf1c40f,
    0x9b59b6,
    0xe67e22
  ],


  /* ================================================
     CREATE NPC
  ================================================= */

  createNPC(
    x,
    z,
    name = "مواطن"
  ) {

    const npc =
      new THREE.Group();


    npc.position.set(
      x,
      0,
      z
    );


    const color =
      this.colors[
        Math.floor(
          Math.random() *
          this.colors.length
        )
      ];


    /* BODY */

    const body =
      new THREE.Mesh(

        new THREE.CapsuleGeometry(
          0.42,
          0.75,
          5,
          10
        ),

        new THREE.MeshStandardMaterial({
          color: color
        })

      );


    body.position.y =
      1.35;


    body.castShadow =
      true;


    npc.add(
      body
    );


    /* HEAD */

    const head =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.38,
          16,
          12
        ),

        new THREE.MeshStandardMaterial({
          color: 0xc98b63
        })

      );


    head.position.y =
      2.35;


    head.castShadow =
      true;


    npc.add(
      head
    );


    /* HAIR */

    const hair =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.39,
          16,
          10
        ),

        new THREE.MeshStandardMaterial({
          color: 0x24170f
        })

      );


    hair.scale.y =
      0.55;


    hair.position.y =
      2.62;


    npc.add(
      hair
    );


    npc.userData = {

      isNPC: true,

      name: name,

      speed:
        0.5 +
        Math.random() *
        0.7,

      target: null,

      wait: 0

    };


    this.npcs.push(
      npc
    );


    scene.add(
      npc
    );


    return npc;

  },


  /* ================================================
     CREATE CITY NPCS
  ================================================= */

  createCityNPCs() {

    this.createNPC(
      10,
      10,
      "أحمد"
    );


    this.createNPC(
      -12,
      15,
      "سارة"
    );


    this.createNPC(
      25,
      25,
      "عمر"
    );


    this.createNPC(
      -25,
      25,
      "ليلى"
    );


    this.createNPC(
      30,
      -15,
      "محمد"
    );


    this.createNPC(
      -30,
      -15,
      "نور"
    );


    this.createNPC(
      55,
      10,
      "كريم"
    );


    this.createNPC(
      -55,
      10,
      "ملك"
    );

  },


  /* ================================================
     FIND NEAREST NPC
  ================================================= */

  getNearestNPC() {

    if (!player) {

      return null;

    }


    let nearest =
      null;


    let distance =
      3.5;


    for (
      const npc of this.npcs
    ) {

      const d =
        player.position.distanceTo(
          npc.position
        );


      if (
        d < distance
      ) {

        distance =
          d;

        nearest =
          npc;

      }

    }


    return nearest;

  },


  /* ================================================
     TALK
  ================================================= */

  talk() {

    const npc =
      this.getNearestNPC();


    if (!npc) {

      showMessage(
        "👤 اقترب من شخص للتحدث معه"
      );

      return;

    }


    this.talkingTo =
      npc;


    const name =
      npc.userData.name;


    const messages = [

      `👋 ${name}: أهلاً! سعيد إنك جيت المدينة.`,

      `🙂 ${name}: الجو جميل النهارده!`,

      `🏙️ ${name}: لسه بتكتشف المدينة؟`,

      `💡 ${name}: جرب تزور المول والمدرسة.`

    ];


    const text =
      messages[
        Math.floor(
          Math.random() *
          messages.length
        )
      ];


    showMessage(
      text
    );

  },


  /* ================================================
     RANDOM WALK
  ================================================= */

  update(delta) {

    for (
      const npc of this.npcs
    ) {

      const data =
        npc.userData;


      data.wait -=
        delta;


      if (
        !data.target &&
        data.wait <= 0
      ) {

        data.target =
          new THREE.Vector3(

            (Math.random() - 0.5) *
            130,

            0,

            (Math.random() - 0.5) *
            130

          );

      }


      if (
        !data.target
      ) {

        continue;

      }


      const direction =
        data.target.clone()
          .sub(
            npc.position
          );


      direction.y =
        0;


      const distance =
        direction.length();


      if (
        distance < 1
      ) {

        data.target =
          null;


        data.wait =
          1 +
          Math.random() *
          3;


        continue;

      }


      direction.normalize();


      npc.position.addScaledVector(
        direction,
        data.speed *
        delta
      );


      npc.rotation.y =
        Math.atan2(
          direction.x,
          direction.z
        );

    }

  },


  /* ================================================
     CREATE TALK BUTTON
  ================================================= */

  createTalkButton() {

    const button =
      document.createElement(
        "button"
      );


    button.id =
      "talkButton";


    button.textContent =
      "💬 تحدث";


    button.style.position =
      "fixed";


    button.style.right =
      "25px";


    button.style.bottom =
      "205px";


    button.style.zIndex =
      "200";


    button.style.padding =
      "14px 20px";


    button.style.border =
      "none";


    button.style.borderRadius =
      "15px";


    button.style.background =
      "#8e44ad";


    button.style.color =
      "white";


    button.style.fontSize =
      "16px";


    button.style.fontWeight =
      "bold";


    button.style.touchAction =
      "manipulation";


    document.body.appendChild(
      button
    );


    button.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();

        this.talk();

      }
    );

  }

};


/* =================================================
   START NPC SYSTEM
================================================= */

window.NPCSystem =
  NPCSystem;


window.addEventListener(
  "load",
  () => {

    setTimeout(
      () => {

        NPCSystem.createCityNPCs();

        NPCSystem.createTalkButton();

      },
      700
    );

  }
);
