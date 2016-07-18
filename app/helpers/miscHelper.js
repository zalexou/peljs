/**
 * Created by alex on 15/07/2016.
 */
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function generateRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function generateRandomInt(min, max) {
    return Math.floor(generateRandom(min, max));
}

function numberWithSeparator(x, separator) {
    if(typeof separator === "undefined")
        separator = ".";
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}