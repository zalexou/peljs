/**
 * Created by alex on 18/07/2016.
 */
var ObjectLauncher = function(config) {
    var _this = this;
    _this.prob = config.prob;
    _this.launch = function() {
        var random = generateRandom(1, 100);
        if(random <= _this.prob) {
            return true;
        }
        return false;
    };
};