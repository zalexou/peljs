/**
 * Created by azalio on 22/07/2016.
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