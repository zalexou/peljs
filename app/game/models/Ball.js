/**
 * Created by azalio on 22/07/2016.
 */
var Ball = function() {
    var _this = this;
    _this.id = guid();
    _this.velocity = 5;
    _this.trailCount = 5;
    _this.trailingBalls = [];
    var color = null;
    _this.x = 0;
    _this.y = null;
    _this.previousSlope = null;
    _this.flightPlan = null;
    _this.target = null;
    _this.eventQueue = [];
    _this.currentTarget = null;
    _this.previousTarget = null;
    _this.next = function() {
        _this.eventQueue = [];
        _this.previousTarget = _this.currentTarget;

        _this.currentTarget = pickTarget();

        var coord = getNextCoordinates({x: _this.x, y: _this.y} , _this.currentTarget, _this.velocity);
        _this.x = coord.x;
        _this.y = coord.y;
        checkCollision();
        updateTrail();
        return _this.eventQueue;
    };

    var pickTarget = function() {
        var previous = null;
        var pick = null;
        for(var i = 0; i < _this.flightPlan.length; i++) {
            if( _this.x > _this.flightPlan[i].x) {
                previous = _this.flightPlan[i];
            } else {
                pick = _this.flightPlan[i];
                break;
            }
        }
        return pick;
    };

    var getNextCoordinates = function (point, target, velocity) {
        //Thales
        var targetDist = Math.hypot(target.x - point.x, target.y - point.y);
        var ratio = targetDist / velocity;

        var H = target.y - point.y;
        var h = H / ratio;

        var L = target.x - point.x;
        var l = L / ratio;

        var nextCoordinates = {
            x: point.x + l,
            y: point.y + h
        };

        return nextCoordinates;
    };

    var checkCollision = function() {
        //If next position passes a collision point on x axis (or stops right on it)
        if(_this.currentTarget && Math.floor(_this.x) >= Math.floor(_this.currentTarget.x)) {
            _this.eventQueue.push(createCollisionEvent());
        }
    };

    var createCollisionEvent = function() {
        var e = new Event();
        e.eventType = EventTypes.OBJECT_COLLISION;
        e.emitter = _this;
        e.callback = function(){};
        e.eventData = {
            objects: [
                {
                    type: "Ball",
                    data: _this
                },
                {
                    type: "Point",
                    data: _this.previousTarget
                }
            ]
        };
        return e;
    };

    var updateTrail = function() {
        var copy = angular.copy(_this);
        delete copy.trailingBalls;
        _this.trailingBalls.unshift(copy);
        _this.trailingBalls = _this.trailingBalls.slice(0, _this.trailCount);
    };

    var getCollisionPrediction = function(points, start) {
        var frames = [];
        var count = 1;
        var ballPosition = start || {x: _this.x, y: _this.y};
        _.each(points, function(point) {
            var hit = false;
            while(!hit && count < 6000) {
                ballPosition = getNextCoordinates(ballPosition, point, _this.velocity);
                if(ballPosition.x >= point.x) {
                    hit = true;
                    frames.push(count + frameCount);
                }
                count++;
                if(count >= 6000) {
                    console.log('ABORT');
                }
            }
        });
        return frames;
    };

    var getReboundFrames = function() {
        //returns the frames at which the ball will bounce off the top
        var reboundFrames = _.filter(_this.hitPlan, function(frame, index) {
            return (index % 2 !== 0);
        });
        return reboundFrames;

    };

    var getCollisionFrames = function() {
        //Collision frames are the frames at which a collision with a paddle will occur
        var collisionFrames = _.filter(_this.hitPlan, function(frame, index) {
            return (index % 2 === 0);
        });
        return collisionFrames;
    };

    var hitPlan = function() {
        var frames = getCollisionPrediction(_this.flightPlan);
        return frames;
    };

    _this.destroy = function() {
        return _this;
    };

    _this.init = function() {
        _this.currentTarget = _this.flightPlan[0];
        _this.hitPlan = hitPlan();
        _this.collisionFrames = getCollisionFrames();
        _this.reboundFrames = getReboundFrames();
        return _this;
    };
};