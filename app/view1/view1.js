'use strict';

angular.module('pel.view1', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', function($scope, globalVarsService) {
        $scope.canvasStyle = {};
        $scope.displayText = {
            launch: "Launch game",
            stop: "Stop game",
            launchBall: "Launch ball",
        };
        var gameController = null;
        var canvas = null, context = null;

        var initCanvas = function initCanvas() {
            $scope.canvasSettings = globalVarsService.canvas;
            canvas = document.getElementById('pelCanvas');
            if(!canvas) {
                console.error("Can't find canvas pelCanvas");
            }

            context = canvas.getContext('2d');
            if(!context) {
                console.error("Can't get context from canvas pelCanvas");
            }

            canvas.width = parseInt($scope.canvasSettings.width);
            canvas.height = parseInt($scope.canvasSettings.height);
            //$(canvas).css('background-color', $scope.canvasSettings.backgroundColor);

            $scope.canvasStyle = $scope.canvasSettings;
        };
        
        var GameInterface = function GameInterface() {
            var _this = this;
            _this.gameStop = function() {
                console.log("Game has stopped")
            };
            _this.gameStart = function() {
                console.log("Game has started")
            };
        };
        
        var initGameController = function initGameController() {
            $scope.commInterface = new GameInterface();
            var pelGameConfig = {
                gameSettings: globalVarsService.game,
                canvasSettings: $scope.canvasSettings,
                canvas: canvas,
                context: context,
                commInterface: $scope.commInterface
            };

            gameController = new PelGameController(pelGameConfig);
            gameController.go();
            
        };

        initCanvas();
        $scope.launchGame = function() {
            initGameController();
        };

        $scope.stopGame = function() {
            //Dereferences the game controller
            gameController.stop();
            gameController = null;
        };

        $scope.launchBall = function() {
            gameController.manualLaunchBall();
        }
    });