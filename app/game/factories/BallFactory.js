/**
 * Created by alex on 17/07/2016.
 */
var BallFactory = function() {

    var createRandomBall = function(config) {
        var ball = new Ball();
        ball.x = 0;
        ball.y = generateRandomInt(config.minEntryY, config.maxEntryY);
        var plan = [];
        for(var i = 0; i < config.impactPoints.bottom.length; i++) {
            plan.push(config.impactPoints.bottom[i]);
            if(i < config.impactPoints.top.length) {
                plan.push(config.impactPoints.top[i]);
            } else {
                //generating the random exit point in the plan
                plan.push({
                    x: parseInt(config.exitX),
                    y: generateRandomInt(config.minExitY, config.maxExitY)
                });
                break;
            }
        }
        ball.flightPlan = plan;
        ball.velocity = generateRandomInt(config.minVelocity, config.maxVelocity);
        ball.radius = 6;
        ball.color = {
            r: generateRandomInt(0, 256),
            g: generateRandomInt(0, 256),
            b: generateRandomInt(0, 256)
        };
        ball.init();
        return ball;
    };

    return {
        createRandomBall: createRandomBall
    };
};