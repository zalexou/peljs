/**
 * Created by azalio on 22/07/2016.
 */
var Bonus = function() {
    var _this = this;
    _this.location = new LocationHelper(_this);
    _this.id = guid();
    _this.velocity = 5;
    var color = null;
    _this.x = 0;
    _this.y = null;
    _this.flightPlan = null;
    _this.target = null;
    _this.eventQueue = [];
    _this.currentTarget = null;
    _this.previousTarget = null;
    _this.next = function() {
        console.log("bonus position", _this.x, _this.y);
        _this.eventQueue = [];
        _this.previousTarget = _this.currentTarget;
        _this.currentTarget = _this.location.pickVerticalTarget();
        console.log("picked target: ", _this.currentTarget, _this.previousTarget);
        var coord = _this.location.getNextCoordinates({x: _this.x, y: _this.y} , _this.currentTarget, _this.velocity);
        console.log("computed coordinates", coord);
        _this.x = coord.x;
        _this.y = coord.y;
        handleCollision();
        return _this.eventQueue;
    };

    var handleCollision = function() {
        //If next position passes a collision point on x axis (or stops right on it)
        if(_this.location.checkVerticalCollision()) {
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
                    type: "Bonus",
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