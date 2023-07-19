package com.bknote71.basicwebsocketgameserver.game.room;

import com.bknote71.basicwebsocketgameserver.job.JobSerializer;
import com.bknote71.basicwebsocketgameserver.protocol.info.GameObjectType;
import com.bknote71.basicwebsocketgameserver.protocol.info.ObjectInfo;
import com.bknote71.basicwebsocketgameserver.protocol.info.PositionInfo;
import com.bknote71.basicwebsocketgameserver.game.Vector2d;
import com.bknote71.basicwebsocketgameserver.game.object.*;
import com.bknote71.basicwebsocketgameserver.protocol.*;
import com.bknote71.basicwebsocketgameserver.protocol.info.SkillType;
import com.bknote71.basicwebsocketgameserver.session.ClientSession;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

@Slf4j
public class GameRoom extends JobSerializer {

    @Getter
    private int roomId;
    @Getter
    private int size; // room의 크기

    public void sizeIncrement() {
        ++size;
    }

    // GameMap 필요가 있을까? 단순하게 크기만 나타내면 될텐데 ...
    @Getter
    private GameMap gameMap;

    private Object lock = new Object();
    private Map<Integer, Player> players = new HashMap<>();
    private Map<Integer, Bullet> bullets = new HashMap<>();
    private Map<Integer, Meteor> meteors = new HashMap<>();


    public GameRoom(int id) {
        this.roomId = id;
        this.gameMap = new GameMap(-10000, 10000, -10000, 10000);
    }

    public void update() {
        // meteor 및 bullet(projectile) update
        for (Bullet bullet : bullets.values()) {
            bullet.update();
        }

        for (Meteor meteor : meteors.values()) {
            meteor.update();
        }

        flush();
    }

    public void enterGame(GameObject gameObject) { // 플레이어의 위치는 랜덤으로 생성한다.
        if (gameObject == null)
            return;

        GameObjectType gameObjectType = gameObject.getType();

        if (gameObjectType == GameObjectType.Player) {
            Player player = (Player) gameObject;
            log.info("player({}) enter game", player.getId());

            size++;
            players.put(player.getPlayerId(), player);
            player.setGameRoom(this);

            // room 과 세션 이어주기
            ClientSession session = player.getSession();

            // gameMap.enter(player);

            // SEnterGame: "내가" 게임룸에 입장함을 알림
            SEnterGame enterPacket = new SEnterGame();
            enterPacket.setPlayer(player.getInfo());
            session.send(enterPacket);

            // SSpwan: 주변 플레이어들 정보 넘김 (나 제외)
            SSpawn spawnPacket = new SSpawn();
            for (Player p : players.values()) {
                if (p != player)
                    spawnPacket.add(p.getInfo());
            }

            // 몬스터, 불릿
            for (Bullet b : bullets.values())
                spawnPacket.add(b.getInfo());

            for (Meteor m : meteors.values())
                spawnPacket.add(m.getInfo());

            session.send(spawnPacket);
        } else if (gameObjectType == GameObjectType.Bullet) {
            Bullet bullet = (Bullet) gameObject;
            log.info("bullet({}) enter game target: {}", bullet.getId(), bullet.getTarget().getId());
            log.info("bullet info: {}", bullet.getInfo());
            bullets.put(bullet.getId(), bullet);
            bullet.setGameRoom(this);
        } else if (gameObjectType == GameObjectType.Meteor) {
            Meteor meteor = (Meteor) gameObject;
            meteors.put(meteor.getId(), meteor);
            meteor.setGameRoom(this);
        }

        // 주변 플레이어들에게 내 스폰 정보를 넘김 (당연히 나 제외)
        SSpawn resSpawnPacket = new SSpawn();
        resSpawnPacket.add(gameObject.getInfo());
        for (Player p : players.values()) {
            if (p.getPlayerId() != gameObject.getId())
                p.getSession().send(resSpawnPacket);
        }
    }

    public void leaveGame(int objectId) {
        log.info("leave game ()-({})", ObjectManager.getObjectTypeById(objectId), objectId);

        GameObjectType type = ObjectManager.getObjectTypeById(objectId);
        if (type == GameObjectType.Player) {
            Player player;
            if ((player = players.remove(objectId)) == null)
                return;

            // room null
            player.setGameRoom(null);

            // 본인한테 leavePacket 전송
            SLeaveGame leavePacket = new SLeaveGame();
            ClientSession session = player.getSession();
            if (session.getWebSocketSession().isOpen())
                session.send(leavePacket);
        } else if (type == GameObjectType.Bullet) {
            Bullet bullet; // 제거할 총알
            if ((bullet = bullets.remove(objectId)) == null)
                return;

            bullet.setGameRoom(null);
        } else if (type == GameObjectType.Meteor) {
            Meteor meteor;
            if ((meteor = meteors.remove(objectId)) == null)
                return;

            meteor.setGameRoom(null);
        }

        // 타인한테 정보 전송: Despawn 되었다는 사실
        SDespawn despawnPacket = new SDespawn();
        despawnPacket.add(objectId);
        broadcast(despawnPacket);
    }

    public void handleChat(Player player, CChat chatPacket) {
        if (player == null)
            return;

        SChat resChatPacket = new SChat();
        resChatPacket.setPlayerId(player.getPlayerId()); // sender
        resChatPacket.setContent(chatPacket.getContent());
        broadcast(resChatPacket);

    }

    public void handleMove(Player player, CMove movePacket) {
        if (player == null) {
            return;
        }

        Vector2d pos = movePacket.getPosInfo().getPos();
        log.info("handle move player({}), where? ({}, {}) to ({}, {})", player.getPlayerId(), player.pos().x, player.pos().y, pos.x, pos.y);

        // TODO: 검증
        PositionInfo moveposInfo = movePacket.getPosInfo();
        Vector2d movepos = moveposInfo.getPos();

        ObjectInfo info = player.getInfo();
        PositionInfo playerPosInfo = info.getPosInfo();
        Vector2d curpos = playerPosInfo.getPos();

        // 다른 좌표로 이동할 경우, 갈 수 있는지 체크
        if (movepos.x != curpos.x || movepos.y != curpos.y) {
            if (!cango(new Vector2d(movepos.x, movepos.y)))
                return;
        }

        log.info("can move");

        // player 의 현재 좌표 갱신
        playerPosInfo.setPos(movepos);
        playerPosInfo.setState(moveposInfo.getState());
        playerPosInfo.setDir(moveposInfo.getDir());

        // 다른 플레이어게 알림
        SMove resMovePacket = new SMove();
        resMovePacket.setObjectId(player.getPlayerId());
        resMovePacket.setPosInfo(movePacket.getPosInfo());
        broadcast(resMovePacket);
    }

    public void handleSkill(Player player, CSkill skillPacket) {
        if (player == null)
            return;

        ObjectInfo info = player.getInfo();

        // TODO: 스킬 사용 가능 여부 확인 ^.^

        log.info("({}) can use skill {}", player.getInfo().getName(), skillPacket.getInfo().getName());

        // 스킬 사용 알림
        SSKill resSkillPacket = new SSKill();
        resSkillPacket.setObjectId(info.getObjectId()); // 스킬을 쓴 사람
        resSkillPacket.getInfo().setSkillId(skillPacket.getInfo().getSkillId());
        broadcast(resSkillPacket);

        // 새로운 스킬용 객체 생성 ex) bullet, ...
        SkillType skillType = skillPacket.getInfo().getSkillType();
        switch (skillType) {
            case BULLET -> {
                Bullet bullet = ObjectManager.Instance.add(Bullet.class);
                if (bullet == null)
                    return;

                // init bullet, bullet 은 moveDir 가 필요 없음!
                PositionInfo bulletPosInfo = new PositionInfo();
                PositionInfo playerPosInfo = player.getPosInfo();
                bulletPosInfo.setState(playerPosInfo.getState());
                bulletPosInfo.setPos(playerPosInfo.getPos());
                bullet.setPosInfo(bulletPosInfo);
                bullet.setOwner(player);
                bullet.setTarget(ObjectManager.Instance.find(skillPacket.getTarget()));
                push(this::enterGame, bullet);
            }
        }
    }

    public boolean cango(Vector2d pos) {
        return gameMap.cango(pos);
    }

    public List<Player> findPlayer(Predicate<Player> condition) {
        return players.values().stream()
                .filter(condition)
                .toList();
    }

    public void broadcast(Protocol packet) {
        for (Player p : players.values()) {
            p.getSession().send(packet);
        }
    }
}