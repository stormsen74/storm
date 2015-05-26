/**
 * Created by michael.sturm on 08.05.2015.
 */
///<reference path="../scripts/Vec2.ts"/>
///<reference path="../lib/color/color.d.ts"/>
///<reference path="../scripts/utils/drawUtils.ts"/>
var Path = (function () {
    function Path(canvas) {
        if (canvas === void 0) { canvas = null; }
        this.radius = 15;
        this.points = [];
        if (canvas != null) {
            this.canvas = canvas;
            this.graphics = new PIXI.Graphics();
            this.canvas.addChild(this.graphics);
        }
    }
    Path.prototype.addPoint = function (x, y) {
        this.points.push(new Vec2(x, y));
    };
    Path.prototype.pushPoint = function (v) {
        this.points.push(new Vec2(v.x, v.y));
    };
    Path.prototype.draw = function () {
        this.graphics.clear();
        this.graphics.lineStyle(this.radius * 2, 0xffcc00, .1);
        for (var i = 0; i < this.points.length - 1; i++) {
            drawUtils.line(this.graphics, [this.points[i].x, this.points[i].y], [this.points[i + 1].x, this.points[i + 1].y]);
        }
    };
    return Path;
})();
//# sourceMappingURL=Path.js.map