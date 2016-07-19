/**
 * Created by alex on 15/07/2016.
 */
var PaddleSpot = function(index) {
    var _this = this;
    var x = null;
    var y = null;
    var length = null;
    _this.impactPoint = null;

    _this.height = 10;
    _this.index = index;

    _this.x = function(value) {
        if(value) {
            x = value;
        }
        return x;
    };

    _this.length = function(value) {
        if(value) {
            length = value;
        }
        return length;
    };

    _this.y = function(value) {
        if(value) {
            y = value;
        }
        return y;
    };

    _this.getCenter = function() {
        return {
            x: x + length / 2,
            y: y
        };
    };
};

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
        _this.currentTarget = _.find(_this.flightPlan, function(point) {
            return (_this.x < point.x)
        });

        var coord = getNextCoordinates({x: _this.x, y: _this.y} , _this.currentTarget, _this.velocity);
        _this.x = coord.x;
        _this.y = coord.y;
        checkCollision();
        updateTrail();
        return _this.eventQueue;
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
        if(_this.previousTarget && _this.x >= _this.previousTarget.x) {
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

    var getCollisionFrames = function() {
        //returns the relative frames at which a collision with a paddle will occur
        var frames = [];
        var paddleHitPoints = _.filter(_this.flightPlan, function(point, index) {
            if(index % 2 === 0) {
                return true;
            }
        });
        _.each(paddleHitPoints, function(point) {
            var ballPosition = {
                x: _this.x,
                y: _this.y
            };
            var count = 1;
            var hit = false;
            while(!hit || count > 1000) {
                ballPosition = getNextCoordinates(ballPosition, point, _this.velocity);
                if(ballPosition.x >= point.x) {
                    hit = true;
                    frames.push(count + frameCount);
                }
                count++;
            }
        });
        return frames;
    };

    _this.destroy = function() {
        return _this;
    };

    _this.init = function() {
        _this.currentTarget = _this.flightPlan[0];
        _this.collisionFrames = getCollisionFrames();
        return _this;
    };
};

var Event = function() {
    var _this = this;
    _this.eventType = null;
    _this.eventData = {};
    _this.emitter = null;
    _this.callback = null;
};