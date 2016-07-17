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
        _this.gameLoopInterval = setInterval(nextFrame, _this.refreshRate);
    };
    
    var drawImpactPoints = function() {
        gameView.drawImpactPoints(_this.impactPoints);
    };
    
    var createBall = function() {
        var ball = new Ball();
        ball.x = 0;
        ball.y = generateRandomInt(1, _this.paddleSpots[0].y() / 2);
        var plan = [];
        for(var i = 0; i < _this.impactPoints.bottom.length; i++) {
            plan.push(_this.impactPoints.bottom[i]);
            if(i < _this.impactPoints.top.length) {
                plan.push(_this.impactPoints.top[i]);
            } else {
                //generating the random exit point in the plan
                plan.push({
                    x: parseInt(_this.settings.canvas.width),
                    y: generateRandomInt(1, _this.paddleSpots[0].y())
                });
                break;
            }
        }
        ball.flightPlan = plan;
        ball.velocity = 12;
        ball.radius = 6;
        ball.color = 'green';
        ball.init();
        _this.balls.push(ball);
    };
    
    var setImpactPoints = function() {
        //Impact points on paddles
        _.forEach(_this.paddleSpots, function(spot) {
            var point = spot.getCenter();
            _this.impactPoints.bottom.push(point);
            spot.impactPoint = point;
        });

        //Impact points at the top, one for each paddle space
        _.forEach(_this.impactPoints.bottom, function(point, index) {
            if(index + 1 < _this.settings.gameSettings.paddleSpots) {
                var np1 = _this.impactPoints.bottom[index +1];
                var middleX = (np1.x - point.x /2);
                _this.impactPoints.top.push({
                    x: middleX,
                    y: 0
                })
            }
        });
    };

    var nextFrame = function() {
        var events = [];
        gameView.eraseCanvas();
        drawPaddleSpots();
        setPaddlePosition(_this.paddlePosition);
        var ballEvents = _this.balls[0].next();
        if(ballEvents.length) {
            events = events.concat(ballEvents);
        }
        handleEvents(events);
        gameView.drawBall(_this.balls[0]);

    };

    var handleEvents = function(events) {
        _.forEach(events, function(e) {
            switch(e.eventType) {
                case EventTypes.OBJECT_COLLISION: {
                    manageCollision(e);
                }
            }
        });
    };

    var manageCollision = function(event) {
        //Ball collision TODO REFACTOR
        if(_.find(event.eventData.objects, function(collidee) { return collidee["type"] == "Ball" })) {
            var impactPoint = _.find(event.eventData.objects, function(collidee) { return collidee["type"] == "Point" });
            if(_this.paddleSpots[_this.paddlePosition].impactPoint === impactPoint.data) {
                console.log("got it");
            } else {
                if(_.find(_this.impactPoints.bottom, function(point) { return point === impactPoint.data})){
                    console.log("missed");
                    delete _this.balls[0].destroy();
                    _this.balls = [];
                }
            }
        };
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