/**
 * Created by alex on 17/07/2016.
 */
var ScoreManager = function ScoreManager(settings) {
    var _this = this;
    _this.eventQueue = [];
    _this.scoreTable = {};
    _this.scoreTable[ScoreTypes.BALL_BOUNCING] = 10;
    _this.scoreTable[ScoreTypes.BALL_EXITING] = 30;
    _this.multiplier = 1;
    _this.score = 0;
    _this.bonus = 0;

    _this.getScore = function() {
        return _this.score;
    };

    _this.addEvent = function(event) {
        _this.eventQueue.push(event);
    };

    _this.process = function() {
        _.forEach(_this.eventQueue, function(event) {
            if(event.eventType === EventTypes.SCORE_UPDATE) {
                switch(event.data.scoreType) {
                    case ScoreTypes.BALL_BOUNCING:
                        _this.score += (_this.scoreTable[event.data.scoreType] + _this.bonus) * _this.multiplier;
                        break;
                    case ScoreTypes.MULTIPLIER_UP:
                        _this.multiplier++;
                        break;
                    case ScoreTypes.MULTIPLIER_DOWN:
                        _this.multiplier = 1;
                }
            }
        });
        _this.eventQueue = [];
        return _this.getScore();
    };

    _this.setBonus = function(bonus) {
        _this.bonus = bonus;
    }
};