/**
 * Created by michael.sturm on 07.05.2015.
 */
///<reference path="../../lib/pixi/pixi.d.ts"/>
var drawUtils = (function () {
    function drawUtils() {
    }
    drawUtils.line = function (g, p1, p2) {
        g.moveTo(p1[0], p1[1]);
        g.lineTo(p2[0], p2[1]);
    };
    return drawUtils;
})();
//# sourceMappingURL=drawUtils.js.map