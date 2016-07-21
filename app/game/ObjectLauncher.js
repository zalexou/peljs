/**
 * Created by alex on 18/07/2016.
 */
var ObjectLauncher = function(config) {
    var _this = this;
    _this.prob = config.prob;
    var successfulLaunches = 0;
    var cancelledLaunches = 0;
    _this.launchCondition = function(callback) {
        return callback && callback();
    };

    _this.canLaunch = config.canLaunch;

    _this.create = config.create;

    _this.launch = function() {
        var random = generateRandom(1, 100);
        if(random <= _this.prob ) {
            var launchee = _this.create();
            if(_this.canLaunch(launchee)) {
                successfulLaunches++;
                return launchee;
            } else {
                cancelledLaunches++;
            }
            console.log("successful launches ", successfulLaunches);
            console.log("cancelled launches ", cancelledLaunches);
        }
        return false;
    };
};