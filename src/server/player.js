const Constants = require('../shared/constants');
const Lazer = require('./lazer');
const ObjectClass = require('./object');

let keys = {};

class Player extends ObjectClass {
    constructor(id,username, x, y) {
        super(x,y,Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
        this.id = id;
        this.username = username;
        this.hp = Constants.PLAYER_MAX_HP;
        this.fireCooldown = 0;
        this.score = 0;
    }

    // Returns a newly created bullet, or null.
    update(dt) {
        // 자동 움직임 관련 
        super.update(dt);
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

    // 키보드 이벤트 적용
    setKeys(key,updown){
        keys[key] = updown;
    }

/*     // 마우스 이벤트 적용 
    setDirection(dir) {
        this.direction = dir;
    }
    
    distanceTo(object) {
        // 주변 플레이어 확인 용
        const dx = this.x - object.x;
        const dy = this.y - object.y;
        return Math.sqrt(dx * dx + dy * dy);
    } */

  // 업데이트 하기전에 데이터 변경
    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            id: this.id,
            hp: this.hp,
        };
    }
}
  
module.exports = Player;