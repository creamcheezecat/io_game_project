const Constants = require('../shared/constants');
const Lazer = require('./lazer');
const ObjectClass = require('./object');

let keys = {};

class Player {
    constructor(id,username, x, y) {
        this.id = id;
        this.username = username;
        this.hp = Constants.PLAYER_MAX_HP;
        this.x = x;
        this.y = y;
        this.direction = Math.random() * 2 * Math.PI; // 0 is north
        this.fireCooldown = 0;
        this.score = 0;
    }

    // Returns a newly created bullet, or null.
    update(dt) {
        // 자동 움직임 관련 
        this.x += dt * Constants.PLAYER_SPEED * Math.sin(this.direction);
        this.y -= dt * Constants.PLAYER_SPEED * Math.cos(this.direction);
        // 키보드 움직임 관련
        // W
        if(keys["87"]){
            this.y -= 5;
        }// S
        if(keys["83"]){
            this.y += 5;
        }// A
        if(keys["68"]){
            this.x += 5;
        }// D
        if(keys["65"]){
            this.x -= 5;
        }

        // Update score
        this.score += dt * Constants.SCORE_PER_SECOND;

        // Make sure the player stays in bounds
        this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
        this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

        // Fire a Lazer, if needed
        this.fireCooldown -= dt;
        if (this.fireCooldown <= 0) {
            this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
            return new Lazer(this.id,this.x, this.y, this.direction);
        }
        
        return null;
    }

    // 맞았다면 데미지 입고
    takeLazerDamage() {
        this.hp -= Constants.LAZER_DAMAGE;
    }

    // 점수 얻었다
    getScore(){
        this.score += 1;
    }

    // 마우스 이벤트 적용 
    setDirection(dir) {
        this.direction = dir;
    }
    // 키보드 이벤트 적용
    setKeys(key,updown){
        keys[key] = updown;
    }


    distanceTo(object) {
        // 주변 플레이어 확인 용
        const dx = this.x - object.x;
        const dy = this.y - object.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

  // 업데이트 하기전에 데이터 변경
    serializeForUpdate() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            hp: this.hp,
            direction: this.direction,
        };
    }
}
  
module.exports = Player;