
/**
 * Module dependencies.
 */

var tweaks = require('./lib/tweaks')
    , express = require('express')
    , socketio = require('socket.io')
    , routes = require('./routes')
    , rooms = require('./lib/rooms')
    , players = require('./lib/players');



var app = module.exports = express.createServer();

var io = socketio.listen(app);

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, "0.0.0.0", function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

io.of('/pongy')
    .on('connection', function(socket) {
        var player = players.create(socket);
        rooms.enter('lobby', player);
        socket.on('disconnect', function() {
            players.destroy(socket);
        });
        socket.on('requestGame', function() {
            rooms.requestGame(player);
        });
        socket.on('movePaddle', function(data) {
            player.movePaddle(data);
        });
    });


