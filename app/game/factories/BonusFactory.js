/**
 * Created by alex on 17/07/2016.
 */
var BonusFactory = function() {

    var createRandomBonus = function(config) {
        var bonus = new Bonus();
        bonus.x = generateRandomInt(config.minEntryX, config.maxEntryX);
        bonus.y = generateRandomInt(config.minEntryY, config.maxEntryY);
        var plan = [
            config.impactPoints[0],
            {x: generateRandomInt(config.minExitX, config.maxExitX), y: generateRandomInt(config.minExitY, config.maxExitY)}
        ];
        
        bonus.flightPlan = plan;
        bonus.velocity = generateRandomInt(config.minVelocity, config.maxVelocity);
        bonus.radius = 6;
        bonus.color = {
            r: generateRandomInt(255, 255),
            g: generateRandomInt(255, 256),
            b: generateRandomInt(255, 256)
        };
        bonus.init();
        return bonus;
    };

    return {
        createRandomBonus: createRandomBonus
    };
};