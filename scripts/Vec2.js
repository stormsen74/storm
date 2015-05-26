/**
 * Created by michael.sturm on 13.04.2015.
 */
///<reference path="utils/mathUtils.ts"/>
var Vec2 = (function () {
    function Vec2(_x, _y) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        this.x = _x;
        this.y = _y;
        this.theta = 0;
    }
    Vec2.prototype.set = function (_x, _y) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        this.x = _x;
        this.y = _y;
        return this;
    };
    // setX | setY
    Vec2.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    Vec2.prototype.subtract = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    Vec2.prototype.multiply = function (value) {
        this.x *= value;
        this.y *= value;
        return this;
    };
    Vec2.prototype.divide = function (value) {
        this.x /= value;
        this.y /= value;
        return this;
    };
    Vec2.prototype.toPolar = function () {
        var r = Math.sqrt(this.x * this.x + this.y * this.y);
        this.y = Math.atan2(this.y, this.x);
        this.x = r;
        return this;
    };
    Vec2.prototype.rotate = function (theta) {
        var co = Math.cos(theta);
        var si = Math.sin(theta);
        var xx = co * this.x - si * this.y;
        this.y = si * this.x + co * this.y;
        this.x = xx;
        return this;
    };
    Vec2.prototype.toCartesian = function () {
        var xx = (this.x * Math.cos(this.y));
        this.y = (this.x * Math.sin(this.y));
        this.x = xx;
        return this;
    };
    Vec2.prototype.reverse = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };
    Vec2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vec2.prototype.cross = function (v) {
        return this.x * v.y - this.y * v.x;
    };
    Vec2.prototype.normalize = function () {
        // if (l != 0)
        this.divide(this.length());
        return this;
    };
    Vec2.prototype.min = function (x, y) {
        return new Vec2(this.x = Math.max(this.x, x), this.y = Math.max(this.y, y));
    };
    Vec2.prototype.max = function (x, y) {
        return new Vec2(this.x = Math.min(this.x, x), this.y = Math.min(this.y, y));
    };
    Vec2.prototype.jitter = function (jitterX, jitterY) {
        this.x += Math.random() * jitterX - jitterX * 0.5;
        this.y += Math.random() * jitterY - jitterY * 0.5;
        return this;
    };
    Vec2.prototype.wander = function (value) {
        this.theta += mathUtils.getRandomBetween(-0.5, 0.5) * value;
        this.x = Math.sin(this.theta) * Math.cos(this.theta) * 0.1;
        this.y = Math.sin(this.theta) * Math.cos(this.theta) * 0.1;
        return this;
    };
    Vec2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vec2.prototype.clone = function () {
        return new Vec2(this.x, this.y);
    };
    //TODO => lerp ?!
    Vec2.prototype.log = function () {
        console.log('x:', this.x, ' y:', this.y);
    };
    Vec2.getAngleRAD = function (v) {
        return Math.atan2(v.y, v.x);
    };
    Vec2.getAngleDEG = function (v) {
        return Math.atan2(v.y, v.x) * 57.296;
    };
    Vec2.add = function (v1, v2) {
        return new Vec2(v1.x + v2.x, v1.y + v2.y);
    };
    Vec2.subtract = function (v1, v2) {
        return new Vec2(v1.x - v2.x, v1.y - v2.y);
    };
    Vec2.multiply = function (v, m) {
        return new Vec2(v.x * m, v.y * m);
    };
    Vec2.divide = function (v, d) {
        return new Vec2(v.x / d, v.y / d);
    };
    Vec2.getDistance = function (v1, v2) {
        var dx = v2.x - v1.x;
        var dy = v2.y - v1.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    Vec2.getDistanceSquared = function (v1, v2) {
        var dx = v2.x - v1.x;
        var dy = v2.y - v1.y;
        return dx * dx + dy * dy;
    };
    Vec2.getNormalPoint = function (p, a, b) {
        //var ap = new Vec2();
        //var ab = new Vec2();
        //var normalPoint = new Vec2();
        // PVector that points from a to p
        var ap = Vec2.subtract(p, a);
        // PVector that points from a to b
        var ab = Vec2.subtract(b, a);
        //[full] Using the dot product for scalar projection
        ab.normalize();
        ab.multiply(ap.dot(ab));
        //[end]
        // Finding the normal point along the line segment
        // var normalPoint:Vec2 = Vec2.add(a, ab)
        return Vec2.add(a, ab);
    };
    return Vec2;
})();
//# sourceMappingURL=Vec2.js.map