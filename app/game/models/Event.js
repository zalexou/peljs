/**
 * Created by azalio on 22/07/2016.
 */

var Event = function() {
    var _this = this;
    _this.eventType = null;
    _this.eventData = {};
    _this.emitter = null;
    _this.callback = null;
};