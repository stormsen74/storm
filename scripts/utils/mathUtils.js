/**
 * Created by STORMSEN on 17.04.2015.
 */
var mathUtils = (function () {
    function mathUtils() {
    }
    mathUtils.degToRad = function (deg) {
        return deg * 0.0174532925;
    };
    mathUtils.radToDeg = function (rad) {
        return rad * 57.2957795;
    };
    mathUtils.getRandomBetween = function (min, max) {
        return min + Math.random() * (max - min);
    };
    mathUtils.convertToRange = function (value, srcRange, dstRange) {
        // value is outside source range return
        if (value < srcRange[0] || value > srcRange[1]) {
            return NaN;
        }
        var srcMax = srcRange[1] - srcRange[0], dstMax = dstRange[1] - dstRange[0], adjValue = value - srcRange[0];
        return (adjValue * dstMax / srcMax) + dstRange[0];
    };
    mathUtils.PI = 3.14159265359;
    mathUtils.TWO_PI = 6.28318530718;
    mathUtils.HALF_PI = 1.57079632679;
    return mathUtils;
})();
//# sourceMappingURL=mathUtils.js.map