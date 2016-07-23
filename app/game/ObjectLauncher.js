/**
 * Created by alex on 18/07/2016.
 */
var ObjectLauncher = function(config) {
    var _this = this;
    _this.prob = config.prob;
    var successfulLaunches = 0;
    var cancelledLaunches = 0;
    var maxTries = 10;
    _this.launchCondition = function(callback) {
        return callback && callback();
    };

    _this.canLaunch = config.canLaunch;

    _this.create = config.create;

    _this.launch = function() {
        var random = generateRandom(1, 100);
        if(random <= _this.prob ) {
            console.log("successful launches ", successfulLaunches);
            console.log("cancelled launches ", cancelledLaunches);
            var launchee = getLaunchableObject();
            if(launchee){
                successfulLaunches++;
                return launchee;
            } else {
                console.log("CANCEL")
                cancelledLaunches++;
                return null;
            }
        }
        return false;
    };

    var getLaunchableObject = function() {
        for(var i = 0; i < maxTries; i++) {
            var launchee = _this.create();
            if(_this.canLaunch(launchee)) {
                console.log("Got launchable after "+i+" tries")
                return launchee;
            }
        }
        console.log("Couldnt get launchable after "+maxTries+" tries")
        return null;
    }
};