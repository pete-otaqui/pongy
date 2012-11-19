(function(global) {

    var socket = io.connect('/pongy'),
        status = $('.status'),
        game = $('#game'),
        paper, p1, p2, ball,
        gameOffset,
        animationRequestId, lastFrameTime,
        MAX_SPEED = 5,
        mouseX, mouseY,
        player, opponent,
        name;

    socket.on('enter', function(data) {
        addStatusMessage('You are in: ' + data.room);
    });
    socket.on('name', function(data) {
        name = data.name;
        addStatusMessage('Your name is: ' + data.name);
    });
    socket.on('enterGame', function(data) {
        setupGame(data);
    });
    socket.on('movePaddle', function(data) {
        if ( opponent ) {
            opponent.attr('y', data.y);
        }
    });

    function getTemplate(url) {
        return new EJS({url:url});
    }

    function addStatusMessage(msg) {
        status.html(status.html() + msg + '<br />');
    }

    function setupLobby() {
        var template = getTemplate('/templates/lobby.ejs');
        game.html(template.render({}));
        $('.join', game).click(function() {
            socket.emit('requestGame', {});
        });
    }

    function setupGame(data) {
        var template = getTemplate('/templates/game.ejs');
        game.html(template.render(data));
        paper = Raphael("game-window", 200, 200);
        gameOffset = $('#game-window').offset();
        p1 = paper.rect(10, 80, 10, 40);
        p2 = paper.rect(180, 80, 10, 40);
        p1.attr('fill', '#f00');
        p2.attr('fill', '#00f');
        p1.attr('stroke-width', 0);
        p2.attr('stroke-width', 0);
        ball = paper.circle(100, 100, 5);
        ball.attr('fill', '#fff');
        lastFrameTime = +new Date;
        player = (data.players[0] == name) ? p1 : p2;
        opponent = (data.players[0] == name) ? p2 : p1;
        startGame();
    }

    function startGame() {
        $(window).mousemove(function(e) {
            mouseX = e.pageX;
            mouseY = e.pageY;
        });
        animationRequestId = rAF(animationFrame);
    }

    function animationFrame(curFrameTime) {
        var deltaT = curFrameTime - lastFrameTime;
        movePaddle(deltaT);
        moveBall(deltaT);
        lastFrameTime = curFrameTime;
        rAF(animationFrame);
    }


    function movePaddle(deltaT) {
        var ty = mouseY-gameOffset.top,
            oy = player.attr('y'),
            dy, ny,
            max_distance = deltaT / MAX_SPEED;
        max_distance = Math.round(max_distance);
        console.log(deltaT, MAX_SPEED, max_distance);
        if ( ty < 0 ) ty = 0;
        if ( ty > 160 ) ty = 160;
        dy = oy - ty;
        if ( dy === 0 ) {
            return;
        } else if ( dy > max_distance ) {
            dy = max_distance;
        } else if ( dy < max_distance * -1 ) {
            dy = max_distance * -1;
        }
        ny = oy - dy;
        if ( isNaN(ny) ) {
            return;
        }
        ny = Math.round(ny);
        player.attr('y', ny);
        socket.emit('movePaddle', {y:ny});
    }

    function moveBall(deltaT) {

    }


    function startBallMovement(data) {

    }

    function endGame() {
        cAF(animationRequestId);
        $(window).unbind('mousemove');
        player = undefined;
        opponent = undefined;
    }

    setupLobby();



})(window);

