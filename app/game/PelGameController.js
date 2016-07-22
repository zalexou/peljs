/**
 * Created by alex on 14/07/2016.
 */
var frameCount = 0;

var PelGameController = function PelGameController(settings) {
    var _this = this;
    var ballFactory, scoreManager,  ballLauncher;

    _this.settings = settings;
    _this.context = settings.context;
    _this.paddleSpots = [];
    _this.paddlePosition = 0;
    _this.gameLoopInterval = null;
    _this.fps = 120;
    _this.refreshRate = 1000 / _this.fps;
    _this.impactPoints = {
        top: [],
        bottom: []
    };
    _this.balls = [];
    _this.consecutiveHits = 0;
    _this.hitFrames = [];
    _this.collectedImpactFrames = [];



    var gameView = new PelGameView(settings);

    _this.stop = function() {
        clearInterval(_this.gameLoopInterval);
        gameView.eraseCanvas();
        console.log(_this.collectedImpactFrames);
        _.forEach(_this.collectedImpactFrames, function(frame, index) {
            if(_this.collectedImpactFrames[index+1]) {
                if(_this.collectedImpactFrames[index+1] - frame < 30) {
                    console.log("Illegal impact detected at frame ", _this.collectedImpactFrames[index+1], "delta: "+(_this.collectedImpactFrames[index+1] - frame));
                }
            }
        });
        return _this;
    };
    
    _this.go = function() {
        ballFactory = new BallFactory();
        scoreManager = new ScoreManager(settings);
        ballLauncher = new ObjectLauncher({
            prob: 2,
            canLaunch: ballIsPlayable,
            create: createBall
        });
        createPaddleSpots();
        drawPaddleSpots();
        setImpactPoints();
        setPaddlePosition(_this.paddlePosition);
        listenEvents();
        //_this.balls.push(createBall().init());

        //window.requestAnimationFrame(nextFrame);
        _this.gameLoopInterval = setInterval(nextFrame, _this.refreshRate);
    };
    
    var ballIsPlayable = function(ball) {
        for(var i = 0; i < ball.collisionFrames.length; i++) {
            var tmp = ball.collisionFrames[i];
            var willCollide =_.find(_this.hitFrames, function(frame) {
                if(_.inRange(tmp, frame - 15, frame + 15)) {
                    return true;
                }
            });
            if(willCollide) {
                return false;
            }
        }
        return true;
    };

    var createBall = function() {
        var config = {
            maxEntryY:  _this.paddleSpots[0].y() / 2,
            minEntryY: 1,
            impactPoints: _this.impactPoints,
            exitX: parseInt(_this.settings.canvas.width),
            maxExitY: _this.paddleSpots[0].y() / 2,
            minExitY: 1,
            minVelocity: 3,
            maxVelocity: 6
        };
        return ballFactory.createRandomBall(config);
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
        _this.hitFrames = [];
        scoreManager.setBonus(_this.balls.length);
        gameView.eraseCanvas();
        drawPaddleSpots();
        setPaddlePosition(_this.paddlePosition);
        _.forEach(_this.balls, function(ball) {
            var ballEvents = ball.next();
            if(ballEvents.length) {
                events = events.concat(ballEvents);
            }
            _this.hitFrames = _this.hitFrames.concat(ball.collisionFrames);
        });

        _this.hitFrames = _.uniq(_this.hitFrames);
        handleEvents(events);

        var potentialBall = ballLauncher.launch();
        if(potentialBall) {
            _this.balls.push(potentialBall);
            console.log("new ball's hit plan ", potentialBall.hitPlan);
            console.log("current hit frames ", _this.hitFrames);
        }

        drawBalls();
        gameView.drawScore(scoreManager.process());
        gameView.drawMultiplier(scoreManager.multiplier);
        frameCount++;
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
        //Ball collision
        //Getting the objects to collide
        var colliders = {
            ball: _.find(event.eventData.objects, function(collidee) { return collidee["type"] == "Ball" }),
            point: _.find(event.eventData.objects, function(collidee) { return collidee["type"] == "Point" })
        };

        //Ball bouncing
        if(colliders.ball) {
            if(colliders.ball.data.flightPlan[colliders.ball.data.flightPlan.length-1] === colliders.point.data) {
                //The point of collision is the last target of the ball, the ball is exiting
                var ballIndex = _.indexOf(_this.balls, colliders.ball.data);
                _this.balls.splice(ballIndex, 1);
                delete colliders.ball.data.destroy();
                scoreManager.addEvent(createScoreEvent(ScoreTypes.BALL_EXITING));
            }
            //The point of collision is on an active paddle
            else if(_this.paddleSpots[_this.paddlePosition].impactPoint === colliders.point.data) {
                scoreManager.addEvent(createScoreEvent(ScoreTypes.BALL_BOUNCING));
                if(_this.consecutiveHits === 10) {
                    _this.consecutiveHits = 0;
                    scoreManager.addEvent(createScoreEvent(ScoreTypes.MULTIPLIER_UP));
                }
                _this.consecutiveHits++;
                _this.collectedImpactFrames.push(frameCount);
                //console.log("hit at frame " ,frameCount);
            } else {
                //The point of collision is on a empty paddle spot
                if(_.find(_this.impactPoints.bottom, function(point) { return point === colliders.point.data})){
                    var ballIndex = _.indexOf(_this.balls, colliders.ball.data);
                    _this.balls.splice(ballIndex, 1);
                    delete colliders.ball.data.destroy();
                    _this.consecutiveHits = 0;
                    scoreManager.addEvent(createScoreEvent(ScoreTypes.MULTIPLIER_DOWN));
                    //console.log("miss at frame " ,frameCount);
                    _this.collectedImpactFrames.push(frameCount);
                }
            }
        };
    };

    var createScoreEvent = function(scoreType) {
        var event = new Event();
        event.eventType = EventTypes.SCORE_UPDATE;
        event.emitter = _this;
        event.data = {
            scoreType: scoreType
        };
        return event;
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

    var drawBalls = function() {
        _.forEach(_this.balls, function(ball) {
            gameView.drawBall(ball);
        });
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