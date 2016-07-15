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
    var entryPoint = null;
    var exitPoint = null;
    var velocity = null;
    var trail = null;
    var color = null;
    _this.x = null;
    _this.y = null;

    _this.flightPlan = null;

    _this.target = null;
    _this.next = function() {
        var currentSlope = getSlope();
        _this.x++;
        _this.y = _this.y + currentSlope;
    };

    var getSlope = function() {
        //Getting the current slope the ball is following
        var currentTarget = _.find(_this.flightPlan, function(point) {
            return (_this.x < point.x)
        });
        var slope = (_this.y - currentTarget.y) / (_this.x - currentTarget.x);
        return slope;
    };

    _this.init = function() {

    }
};