/**
 * Created by alex on 14/07/2016.
 */
var PelGameController = function PelGameController(settings) {
    var _this = this;
    _this.settings = settings;
    _this.context = settings.context;
    _this.paddleSpots = [];
    _this.paddlePosition = 0;
    _this.gameLoopInterval = null;
    _this.fps = 60;
    _this.refreshRate = 1000 / _this.fps;
    _this.impactPoints = {
        top: [],
        bottom: []
    };
    _this.balls = [];
    


    var gameView = new PelGameView(settings);
    
    _this.go = function() {
        console.log('game launching');
        createPaddleSpots();
        drawPaddleSpots();
        setImpactPoints();
        setPaddlePosition(_this.paddlePosition);
        createBall();
        drawBall();
        listenEvents();
        //_this.gameLoopInterval = setInterval(nextFrame, _this.refreshRate);
    };
    
    var createBall = function() {
        var ball = new Ball();
        ball.x = 0;
        ball.y = 400;
        var plan = [];
        for(var i = 0; i < _this.impactPoints.bottom.length; i++) {
            plan.push(_this.impactPoints.bottom[i]);
            if(i < _this.impactPoints.top.length) {
                plan.push(_this.impactPoints.top[i]);
            } else {
                break;
            }
        }
        ball.flightPlan = plan;
        ball.velocity = 1;
        ball.radius = 6;
        ball.color = 'green';
        ball.init();
        _this.balls.push(ball);
    };
    
    var setImpactPoints = function() {
        //Impact points on paddles
        _.forEach(_this.paddleSpots, function(spot) {
            _this.impactPoints.bottom.push(spot.getCenter());
        });

        //Impact points at the top, one for each paddle space
        _.forEach(_this.impactPoints.bottom, function(point, index) {
            if(index + 1 < _this.settings.gameSettings.paddleSpots) {
                var np1 = _this.impactPoints.bottom[index +1];
                var middleX = point.x + (np1.x - point.x /2);
                _this.impactPoints.top.push({
                    x: middleX,
                    y: 0
                })
            }
        });
    };

    var nextFrame = function() {
        _this.balls[0].next();
        gameView.drawBall(_this.balls[0]);
        console.log("calculating next frame");
    };
    
    var createPaddleSpots = function() {
        for(var i = 0; i < _this.settings.gameSettings.paddleSpots; i++) {
            _this.paddleSpots.push(new PaddleSpot(i));
        }
    };

    var drawPaddleSpots = function() {
        for(var i = 0; i < _this.settings.gameSettings.paddleSpots; i++) {
            gameView.drawPaddleSpot(_this.paddleSpots[i]);
        }
    };

    var drawBall = function() {
        gameView.drawBall(_this.balls[0]);
    };

    var manageKeydown = function(e) {
        if(e.keyCode === KeyEvent.LEFT) {
            movePaddle(-1);
        } else if(e.keyCode === KeyEvent.RIGHT) {
            movePaddle(1);
        } else if(e.keyCode === KeyEvent.SPACE) {
            nextFrame();
        }
    };
    
    var setPaddlePosition = function(position) {
        if(position >= 0 && position < _this.settings.gameSettings.paddleSpots) {
            _this.paddlePosition = position;
            gameView.fillPaddleSpot(_this.paddleSpots[_this.paddlePosition]);
        }
    };

    var movePaddle = function(delta) {
        var position = _this.paddlePosition + delta;
        if(position >= 0 && position < _this.settings.gameSettings.paddleSpots) {
            _this.paddlePosition = position;
            gameView.fillPaddleSpot(_this.paddleSpots[_this.paddlePosition]);
        }
    };

    var listenEvents = function() {
        $(document).on("keydown", function(e) {
            manageKeydown(e);
        });
    };
};