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


        var currentSlope = getSlope();
        if(!currentSlope) {
            return;
        }

        _this.previousSlope = currentSlope;

        //Thales
        var targetDist = Math.hypot(_this.currentTarget.x - _this.x, _this.currentTarget.y - _this.y);
        var ratio = targetDist / _this.velocity;

        var H = _this.currentTarget.y - _this.y;
        var h = H / ratio;

        var L = _this.currentTarget.x - _this.x;
        var l = L / ratio;

        _this.x += l;
        _this.y += h;
        checkCollision();
        updateTrail();
        return _this.eventQueue;
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

    var getSlope = function() {
        if(!_this.currentTarget) {
            return null;
        }
        var slope = (_this.y - _this.currentTarget.y) / (_this.x - _this.currentTarget.x);
        return slope;
    };

    _this.destroy = function() {
        console.log("cya");
        return _this;
    };

    _this.init = function() {

    };
};

var Event = function() {
    var _this = this;
    _this.eventType = null;
    _this.eventData = {};
    _this.emitter = null;
    _this.callback = null;
};