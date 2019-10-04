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
var fireRate;
var path;

function preload() {
  this.load.image('spider', 'assets/spider.png');
  this.load.image('bullet', 'assets/bullet.png');
}

function create() {

  var bg = this.add.rectangle(0, 0, width, height, 0x001540, 1).setOrigin(0, 0);
  var turretBase = this.add.rectangle(width / 2 - 50, height - 300, 100, 300, 0x00316E, 1).setOrigin(0, 0);

  turretGun = this.add.circle(width / 2, (height + 100) / 2, 50, 0x00316E, 1);
  turretBarrel = this.add.rectangle(width / 2, (height + 100) / 2, 30, 110, 0x00316E, 1).setOrigin(0.5, 1);
  shield = this.add.arc(width / 2, (height + 100) / 2, 125, 240, 300, false).setStrokeStyle(8, 0x00316E, 1);


  var graphics = this.add.graphics();
  graphics.lineStyle(3, 0x00316E, 1);
  path = this.add.path(96, -32);
  path.lineTo(960, 164);
  path.lineTo(40, 164);
  path.lineTo(480, 544);
  path.lineTo(1980, 1080);

  path.draw(graphics);


  enemies = this.add.group({
    classType: Enemy,
    runChildUpdate: true
  });
  this.nextEnemy = 0;

  bullets = this.add.group({
    classType: Bullet,
    runChildUpdate: true
  });
  this.nextBullet = 0;

  var t = this;
  this.input.on('pointermove', f, this);

}

function update(time, delta) {
  if (time > this.nextBullet) {
    this.nextBullet = time + 1000;

    this.input.on('pointerdown', d, this);
  }
  // if its time for the next enemy
  if (time > this.nextEnemy) {
    var enemy = enemies.get();
    if (enemy) {
      enemy.setActive(true);
      enemy.setVisible(true);

      // place the enemy at the start of the path
      enemy.startOnPath();

      this.nextEnemy = time + 2000;
    }
  }
  /*
    blocked = bullet.body.blocked;
    if (blocked["up"] == true || blocked["right"] == true || blocked["left"] == true || blocked["down"] == true) {
      bullet.disableBody(true, true);
    }
    */
}

var f = function(pointer) {
  angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(turretBarrel.x, turretBarrel.y, pointer.x, pointer.y);
  turretBarrel.setAngle(angle + 90);
  shield.setAngle(angle + 90);
}

var d = function(pointer) {
  /*
    if (bullet.body.velocity.x == 0 && bullet.body.velocity.y == 0) {
      angle = Phaser.Math.Angle.Between(turretGun.x, turretGun.y, pointer.x, pointer.y);
      this.physics.velocityFromRotation(angle, 800, velocity);
      bullet.setAngle(angle + 90);
      bullet.enableBody(true, turretGun.x, turretGun.y, true, true).setVelocity(velocity.x, velocity.y);
    ]
  */
  angle = Phaser.Math.Angle.Between(turretGun.x, turretGun.y, pointer.x, pointer.y);
  addBullet(width / 2, (height + 100) / 2, angle);
}

function addBullet(x, y, angle) {
  var bullet = bullets.get();
  if (bullet) {
    bullet.fire(x, y, angle);
  }
}

function getEnemy(x, y, distance) {
  var enemyUnits = enemies.getChildren();
  for (var i = 0; i < enemyUnits.length; i++) {
    if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance)
      return enemyUnits[i];
  }
  return false;
}