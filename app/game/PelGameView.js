/**
 * Created by alex on 15/07/2016.
 */
var PelGameView = function(settings) {
    var _this = this;
    _this.settings = settings;
    _this.context = settings.context;
    _this.margin = 5;

    _this.drawnSpots = [];
    
    var availableWidth = parseInt(_this.settings.canvasSettings.width);
    var paddleCount = _this.settings.gameSettings.paddleSpots;
    var totalMarginValue = (2 + (paddleCount - 1)) * _this.margin;
    var totalPaddleLength = availableWidth - totalMarginValue;
    var paddleLength = totalPaddleLength / paddleCount;
    
    _this.drawPaddleSpot = function(spot) {
        var currentPaddleX = _this.margin + (spot.index * (paddleLength + _this.margin));
        var currentPaddleY = parseInt(_this.settings.canvasSettings.height) - _this.margin * 2 - spot.height;
        spot.x(currentPaddleX);
        spot.y(currentPaddleY);
        _this.context.beginPath();
        _this.context.strokeRect(spot.x(), spot.y(), paddleLength, 5);
        _this.context.strokeStyle = 'black';
        _this.context.stroke();
        _this.drawnSpots.push(spot);
    };
    
    _this.emptyPaddleSpots = function() {
        _.each(_this.drawnSpots, function(spot) {
            _this.context.clearRect(spot.x(), spot.y(), paddleLength, 5);
        })    
    };
    
    _this.fillPaddleSpot = function(spot) {
        _this.emptyPaddleSpots();
        _this.context.beginPath();
        _this.context.fillRect(spot.x(), spot.y(), paddleLength, 5);
        _this.context.fillStyle = 'black';
        _this.context.fill();
    };
};