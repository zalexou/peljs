/**
 * Created by alex on 15/07/2016.
 */
var PelGameView = function(settings) {
    var _this = this;
    _this.settings = settings;
    _this.context = settings.context;
    _this.margin = 5;

    _this.drawnSpots = [];
    _this.drawnBalls = [];
    
    var availableWidth = parseInt(_this.settings.canvasSettings.width);
    var paddleCount = _this.settings.gameSettings.paddleSpots;
    var totalMarginValue = (2 + (paddleCount - 1)) * _this.margin;
    var totalPaddleLength = availableWidth - totalMarginValue;
    var paddleLength = totalPaddleLength / paddleCount;
    
    _this.drawPaddleSpot = function(spot) {
        _this.drawnSpots = [];
        var currentPaddleX = _this.margin + (spot.index * (paddleLength + _this.margin));
        var currentPaddleY = parseInt(_this.settings.canvasSettings.height) - _this.margin * 2 - spot.height;
        spot.x(currentPaddleX);
        spot.y(currentPaddleY);
        spot.length(paddleLength);
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
        _this.context.fillStyle = 'black';
        _this.context.fillRect(spot.x(), spot.y(), paddleLength, 5);

    };

    _this.drawImpactPoints = function(impactPoints) {
        _.forEach(impactPoints.top, function(point) {
            _this.context.beginPath();
            _this.context.fillStyle = "red";
            _this.context.arc(point.x, point.y, 2, 0, 2 * Math.PI, false);
            _this.context.fill();
        });

        _.forEach(impactPoints.bottom, function(point) {
            _this.context.beginPath();
            _this.context.fillStyle = "red";
            _this.context.arc(point.x, point.y, 2, 0, 2 * Math.PI, false);
            _this.context.fill();
        });
    };

    _this.drawBall = function(ball, opacity, noStroke) {
        if(!opacity) opacity = 1;
        _this.context.beginPath();
        _this.context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
        _this.context.fillStyle = "rgba("+ball.color.r+", "+ball.color.g+", "+ball.color.b+", "+opacity+")";
        _this.context.fill();
        if(!noStroke) {
            _this.context.strokeStyle = "black";
            _this.context.stroke();
        }

        _.forEach(ball.trailingBalls, function(ball, index) {
            var opacity = 1 - (0.2 * index);
            _this.drawBall(ball, opacity, true);
        });
    };

    _this.eraseCanvas = function() {
        _this.context.clearRect(0, 0, parseInt(_this.settings.canvasSettings.width), parseInt(_this.settings.canvasSettings.height));
    };

    _this.drawScore = function(score) {
        var score = numberWithSeparator(score, '.');
        _this.context.font="30px Verdana";
        _this.context.fillStyle = "black";
        _this.context.fillText("SCORE: "+score,10,50);

    };

    _this.drawMultiplier = function(multiplier) {
        var score = numberWithSeparator(multiplier, ' ');
        _this.context.font="30px Verdana";
        _this.context.fillStyle = "black";
        _this.context.fillText("X"+score,250,50);
    }
};