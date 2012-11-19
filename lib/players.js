



var Player = {
    init: function(socket) {
        this.socket = socket;
        this.setName(getSequentialName());
        return this;
    },
    setName: function(name) {
        this.socket.emit('name', {name:name});
        this.name = name;
    },
    destroy: function() {
        
    },
    setRoom: function(room) {
        this.socket.emit('enter', {room:room.name});
        this.room = room;
    },
    leaveRoom: function() {
        if ( this.room ) {
            this.room.leave(this);
        }
    },
    movePaddle: function(data) {
        this.room.broadcast('movePaddle', data, this);
    }
};

var playerList = [];

var getSequentialName = function() {
    var index, found;
    found = playerList.first(function(player, i) {
        i = i + 1;
        if ( player.name !== 'player-' + i )  {
            index = i;
            return true;
        }
    });
    if ( !found ) {
        index = playerList.length + 1;
    }
    return 'player-' + index;
};

var players = {
    create: function(socket) {
        var player = Object.create(Player).init(socket);
        playerList.push(player);
        return player;
    },
    destroy: function(socket) {
        var index = playerList.firstIndexOf(function(plyr) {
            return ( plyr.socket === socket );
        });
        if ( typeof playerList[index] !== 'undefined' ) {
            playerList[index].destroy();
            playerList.splice(index, 1);
        } else {
            console.log('Tried to destroy index', index, 'but it doesnt exist in', playerList);
        }
        playerList = playerList.clean();
    },
    findBySocket: function(socket) {
        return playerList.first(function(plyr) {
            return ( plyr.socket === socket );
        });
    }
}

module.exports = players;



