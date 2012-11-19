
var rooms
  , roomList = {};

var Room = {
    init: function(name, max) {
        this.players = [];
        this.state = Room.EMPTY;
        this.max = max;
        this.name = name;
        return this;
    },
    isFull: function() {
        var full = false;
        if ( this.max !== -1 && this.players.length >= this.max ) {
            full = true;
        }
        return full;
    },
    isEmpty: function() {
        return this.players.length == 0;
    },
    enter: function(player) {
        if ( this.isFull() ) {
            return false;
        } else {
            this.players.push(player);
            this.state = (this.isFull()) ? Room.FULL : Room.SEMI;
            player.setRoom(this);
        }
    },
    leave: function(player) {
        this.players = this.players.filter(function(plyr) {
            return plyr !== player;
        });
        if ( this.isEmpty() ) {
            this.state = Room.EMPTY;
        }
    },
    /**
     * Bind a series of functions to 'this' using Function.bind
     */
    bindAll: function() {
        var what = this,
                args = Array.prototype.slice.call(arguments, 0);
        args.forEach(function(arg) {
            if ( typeof what[arg] === 'function' ) {
                what[arg] = what[arg].bind(what);
            }
        });
    },
    EMPTY: 0,
    SEMI: 10,
    FULL: 20,
};

var Lobby = Object.spawn(Room, {
    init: function Lobby_init(name) {
        return Lobby_init.parent.call(this, name, -1);
    },
    enter: function Lobby_enter(player) {
        Lobby_enter.parent.apply(this, arguments);
    }
});

var Matcher = Object.spawn(Room, {
    init: function Matcher_init(name) {
        return Matcher_init.parent.call(this, name, -1);
    },
    enter: function Matcher_enter(player) {
        var p1, p2, game, matcher;
        matcher = this;
        Matcher_enter.parent.apply(this, arguments);
        while ( this.players.length > 1 ) {
            p1 = this.players[0];
            p2 = this.players[1];
            game = Object.create(Game).init('game-' + Math.round(Math.random()*1000000));
            matcher.leave(p1);
            matcher.leave(p2);
            game.enter(p1);
            game.enter(p2);
            game.prepare();
        }
    }
});

var Game = Object.spawn(Room, {
    init: function Game_init(name) {
        Game_init.parent.call(this, name, 2);
        this.bindAll('start', 'onMovePaddle', 'onHitBall');
        this.ball_vx = 0;
        this.ball_vy = 0;
        return this;
    },
    prepare: function() {
        var playerNames, game = this;
        playerNames = this.players.map(function(player) {
            return player.name;
        });
        this.players.forEach(function(player) {
            player.socket.on('movePaddle', function() {
                player.onMovePaddle.apply(player, arguments);
            });
            player.socket.on('hitBall', function() {
                player.onHitBall.apply(player, arguments);
            });
            player.socket.emit('enterGame', {players:playerNames});
            setTimeout(game.start, 3000);
        });

    },
    start: function() {
        this.broadcast('startGame');
    },
    broadcast: function(name, data, sourcePlayer) {
        if ( typeof data === 'undefined' ) {
            data = {};
        }
        this.players.forEach(function(player) {
            if ( player === sourcePlayer ) {
                return;
            }
            player.socket.emit(name, data);
        });
    },
    onMovePaddle: function(data) {

    },
    onHitBall: function(data) {

    }
});



var Ball = {
    init: function() {
        this.time = +new Date;
        return this;
    },
    setRoom: function(room) {
        this.room = room;
    },
    setVx: function(vx) {
        this.vx = vx;
    },
    setVy: function(vy) {
        this.vy = vy;
    },
    start: function(time) {
        this.startTime = time;
    },
    collisionCheck: function() {

    }
};





rooms = {
    enter: function(roomName, player) {
        var room = roomList[roomName];
        return room.enter(player);
    },
    get: function(room) {
        return roomList[room];
    },
    createGame: function(room) {
        roomList[room] = Object.create(Game).init();
        return roomList[room];
    },
    requestGame: function(player) {
        player.leaveRoom();
        roomList['matcher'].enter(player);
    }
};


roomList['lobby'] = Object.create(Lobby).init('lobby');
roomList['matcher'] = Object.create(Matcher).init('matcher');

module.exports = rooms;





