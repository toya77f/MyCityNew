/* =================================================
   MY CITY — CLOTHES SYSTEM
================================================= */

const ClothesSystem = {

  current: {
    shirt: 0x3498db,
    pants: 0x20252b,
    skin: 0xc98b63,
    hair: 0x24170f
  },

  shirts: [
    { name: "أزرق", color: 0x3498db },
    { name: "أحمر", color: 0xe74c3c },
    { name: "أخضر", color: 0x2ecc71 },
    { name: "أصفر", color: 0xf1c40f },
    { name: "بنفسجي", color: 0x9b59b6 },
    { name: "أسود", color: 0x20252b }
  ],

  createButton() {

    const button =
      document.createElement("button");

    button.id =
      "clothesButton";

    button.textContent =
      "👕 اللبس";

    button.style.position =
      "fixed";

    button.style.left =
      "25px";

    button.style.bottom =
      "25px";

    button.style.zIndex =
      "200";

    button.style.padding =
      "14px 20px";

    button.style.border =
      "none";

    button.style.borderRadius =
      "15px";

    button.style.background =
      "#e91e63";

    button.style.color =
      "white";

    button.style.fontSize =
      "16px";

    button.style.fontWeight =
      "bold";

    button.style.touchAction =
      "manipulation";

    document.body.appendChild(button);

    button.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();

        this.changeShirt();

      }
    );

  },


  changeShirt() {

    const currentColor =
      this.current.shirt;

    let index =
      this.shirts.findIndex(
        shirt =>
          shirt.color === currentColor
      );

    index++;

    if (
      index >= this.shirts.length
    ) {

      index = 0;

    }

    this.current.shirt =
      this.shirts[index].color;

    this.applyToPlayer();

    showMessage(
      `👕 اللبس: ${this.shirts[index].name}`
    );

  },


  applyToPlayer() {

    if (!player) {

      return;

    }

    player.traverse(
      object => {

        if (
          !object.isMesh
        ) {

          return;

        }

        if (
          object.userData &&
          object.userData.part === "shirt"
        ) {

          object.material.color.setHex(
            this.current.shirt
          );

        }

      }
    );

  }

};


/* =================================================
   GLOBAL
================================================= */

window.ClothesSystem =
  ClothesSystem;


/* =================================================
   START
================================================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      () => {

        ClothesSystem.createButton();

      },
      900
    );

  }
);
