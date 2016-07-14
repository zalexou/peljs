/**
 * Created by alex on 14/07/2016.
 */
angular.module('pel').service('globalVarsService', function() {

    var getCanvasVars = function() {
        return {
            height: "800px",
            width: "500px",
            backgroundColor: "#000000"
        }
    };

    var getGameVars = function() {
        return {
            paddleSpots: 3
        };
    };

    return {
        canvas: getCanvasVars(),
        game: getGameVars()
    }
});