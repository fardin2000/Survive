var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        x: 0,
        y: 0
      }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var turretBarrel;
var width = window.innerWidth;
var height = window.innerHeight;
var group;
var angle;
var blocked
var turretGun;
var velocity = new Phaser.Math.Vector2();
var maxBullets = 1;
var bullet;
var shield;
var graphics;
var path;

function preload() {
  this.load.image('bullet', 'assets/bullet.png');
}

function create() {

  var magazine = this.add.group({
    key: 'bullet',
    frameQuantity: maxBullets
  });

  var bg = this.add.rectangle(0, 0, width, height, 0x001540, 1).setOrigin(0, 0);
  var turretBase = this.add.rectangle(width / 2 - 50, height - 300, 100, 300, 0x00316E, 1).setOrigin(0, 0);
  bullet = this.physics.add.image(width / 2, (height + 100) / 2, 'bullet').setOrigin(0.5);
  bullet.setScale(0.15);
  bullet.setCollideWorldBounds(true);
  turretGun = this.add.circle(width / 2, (height + 100) / 2, 50, 0x00316E, 1);
  turretBarrel = this.add.rectangle(width / 2, (height + 100) / 2, 30, 110, 0x00316E, 1).setOrigin(0.5, 1);

  shield = this.add.arc(width / 2, (height + 100) / 2, 125, 240, 300, false).setStrokeStyle(8, 0x00316E, 1);


  var t = this;
  this.input.on('pointermove', f, this);
  this.input.on('pointerdown', d, this);

}

function update() {

  blocked = bullet.body.blocked;
  if (blocked["up"] == true || blocked["right"] == true || blocked["left"] == true || blocked["down"] == true) {
    bullet.disableBody(true, true);
  }
}

var f = function(pointer) {

  angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(turretBarrel.x, turretBarrel.y, pointer.x, pointer.y);
  turretBarrel.setAngle(angle + 90);
  shield.setAngle(angle + 90);

}

var d = function(pointer) {
  if (bullet.body.velocity.x == 0 && bullet.body.velocity.y == 0) {
    angle = Phaser.Math.Angle.Between(turretGun.x, turretGun.y, pointer.x, pointer.y);
    this.physics.velocityFromRotation(angle, 800, velocity);
    bullet.setAngle(angle + 90);
    bullet.enableBody(true, turretGun.x, turretGun.y, true, true).setVelocity(velocity.x, velocity.y);

  }
}