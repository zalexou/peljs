/**
 * Created by azalio on 22/07/2016.
 */
var Ball = function() {
    var _this = this;
    _this.location = new LocationHelper(_this);
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


        var coord = _this.location.getNextCoordinates({x: _this.x, y: _this.y} , _this.currentTarget, _this.velocity);
        _this.x = coord.x;
        _this.y = coord.y;
        handleCollision();
        updateTrail();
        return _this.eventQueue;
    };

    var handleCollision = function() {
        //If next position passes a collision point on x axis (or stops right on it)
        if(_this.location.checkCollision()) {
            _this.eventQueue.push(createCollisionEvent());
            var currentTargetIndex = _.indexOf(_this.flightPlan,_this.currentTarget);
            _this.currentTarget = _this.flightPlan[currentTargetIndex + 1];
            _this.previousTarget = _this.currentTarget;
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
                    data: _this.currentTarget
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
    

    _this.destroy = function() {
        return _this;
    };

    _this.init = function() {
        
        _this.currentTarget = _this.flightPlan[0];
        _this.hitPlan = _this.location.hitPlan();
        _this.collisionFrames = _this.location.getCollisionFrames();
        _this.reboundFrames = _this.location.getReboundFrames();
        return _this;
    };
};