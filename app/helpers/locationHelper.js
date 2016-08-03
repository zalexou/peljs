/**
 * Created by alex on 01/08/2016.
 */
var LocationHelper = function(object) {
    var _this = this;
    var object = object;
    var collisionDistance = function() {
        return 4;
    };

    _this.pickTarget = function() {
        var previous = null;
        var pick = null;
        for(var i = 0; i < object.flightPlan.length; i++) {
            if( object.x > object.flightPlan[i].x) {
                previous = object.flightPlan[i];
            } else {
                pick = object.flightPlan[i];
                break;
            }
        }
        return pick;
    };
    
    _this.getNextCoordinates = function (point, target, velocity) {
        //Thales
        var targetDist = _this.getDistance(point, target);
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

    _this.getReboundFrames = function() {
        //returns the frames at which the ball will bounce off the top
        var reboundFrames = _.filter(object.hitPlan, function(frame, index) {
            return (index % 2 !== 0);
        });
        return reboundFrames;

    };

    _this.getCollisionFrames = function() {
        //Collision frames are the frames at which a collision with a paddle will occur
        var collisionFrames = _.filter(object.hitPlan, function(frame, index) {
            return (index % 2 === 0);
        });
        return collisionFrames;
    };

    _this.hitPlan = function() {
        var frames = _this.getCollisionPrediction(object.flightPlan);
        return frames;
    };
    
    _this.checkCollision = function() {
        return _this.getDistance({x: object.x, y: object.y}, object.currentTarget) <= collisionDistance();
    };


    _this.getCollisionPrediction = function(points, start) {
        var frames = [];
        var count = 1;
        var ballPosition = start || {x: object.x, y: object.y};
        _.each(points, function(point) {
            var hit = false;
            while(!hit && count < 6000) {
                ballPosition = _this.getNextCoordinates(ballPosition, point, object.velocity);
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

    _this.getDistance = function(a, b) {
        return Math.hypot(b.x - a.x, b.y - a.y);
    };

};