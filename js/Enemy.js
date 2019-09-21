var Enemy = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    function Enemy(scene) {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');

    },
  update: function(time, delta) {

  }

});