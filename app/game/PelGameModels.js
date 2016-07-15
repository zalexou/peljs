/**
 * Created by alex on 15/07/2016.
 */
var PaddleSpot = function(index) {
    var _this = this;
    var x = null;
    var y = null;
    var length = null;

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

    _this.flightPlan = null;

    _this.target = null;
    _this.next = function() {
        var currentSlope = getSlope();
        if(!currentSlope) {
            return;
        }

        var currentTarget = _.find(_this.flightPlan, function(point) {
            return (_this.x < point.x)
        });

        var targetDist = Math.hypot(currentTarget.x - _this.x, currentTarget.y - _this.y);
        var ratio = targetDist / _this.velocity;

        var H = currentTarget.y - _this.y;
        var h = H / ratio;

        var L = currentTarget.x - _this.x;
        var l = L / ratio;
        _this.x += l;
        _this.y += h;
        //_this.x += _this.velocity;
        //_this.y = _this.y + (_this.velocity * currentSlope);
        updateTrail();
    };

    var updateTrail = function() {
        var copy = angular.copy(_this);
        delete copy.trailingBalls;
        _this.trailingBalls.unshift(copy);
        _this.trailingBalls = _this.trailingBalls.slice(0, _this.trailCount);
    };

    var getSlope = function() {
        //Getting the current slope the ball is following
        var currentTarget = _.find(_this.flightPlan, function(point) {
            return (_this.x < point.x)
        })
        if(!currentTarget) {
            return null;
        }
        var slope = (_this.y - currentTarget.y) / (_this.x - currentTarget.x);
        return slope;
    };

    _this.init = function() {

    }
};