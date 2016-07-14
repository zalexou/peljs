/**
 * Created by alex on 14/07/2016.
 */
var PelGameController = function PelGameController(settings) {
    var _this = this;
    _this.settings = settings;
    _this.margin = 5;
    _this.context = settings.context;

    var availableWidth = parseInt(_this.settings.canvasSettings.width);
    var paddleCount = _this.settings.gameSettings.paddleSpots;
    var totalMarginValue = (2 + (paddleCount - 1)) * _this.margin;
    var totalPaddleLength = availableWidth - totalMarginValue;
    var paddleLength = totalPaddleLength / paddleCount;
    var paddleHeight = 10;
    var paddlePosition = 0;
    
    _this.go = function() {
        console.log('game launching');
        drawPaddleSpots();
        fillPaddleSpot(paddlePosition);
        listenEvents();
    };

    var drawPaddleSpots = function () {

        _this.paddlespots = [];
        for(var i = 0; i < paddleCount; i++) {
            var currentPaddleX = _this.margin + (i * (paddleLength + _this.margin));
            var currentPaddleY = parseInt(_this.settings.canvasSettings.height) - _this.margin * 2 - paddleHeight;
            _this.context.beginPath();
            _this.context.strokeRect(currentPaddleX, currentPaddleY, paddleLength, 5);
            _this.context.strokeStyle = 'black';
            _this.context.stroke();
            _this.paddlespots.push({
                x: currentPaddleX,
                y: currentPaddleY
            })
        }
    };

    var emptyPaddleSpots = function() {
        _.each(_this.paddlespots, function(spot) {
            _this.context.clearRect(spot.x, spot.y, paddleLength, 5);
        })
    };

    var fillPaddleSpot = function(spotIndex) {
        emptyPaddleSpots();
        var index = 0;
        if(spotIndex) {
            index = spotIndex % _this.settings.gameSettings.paddleSpots;
        }
        _this.context.beginPath();
        _this.context.fillRect(_this.paddlespots[index].x, _this.paddlespots[index].y, paddleLength, 5);
        _this.context.fillStyle = 'black';
        _this.context.fill();
    };

    var manageKeydown = function(e) {
        if(e.keyCode === KeyEvent.LEFT) {
            movePaddle(-1);
        } else if(e.keyCode === KeyEvent.RIGHT) {
            movePaddle(1);
        }
    };

    var movePaddle = function(delta) {
        var position = paddlePosition + delta;
        if(position >= 0 && position < paddleCount && position !== paddlePosition) {
            paddlePosition = position;
            fillPaddleSpot(paddlePosition);
        }
    };

    var listenEvents = function() {
        $(document).on("keydown", function(e) {
            manageKeydown(e);
        });
    };
};