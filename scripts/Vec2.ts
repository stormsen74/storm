/**
 * Created by michael.sturm on 13.04.2015.
 */

///<reference path="utils/mathUtils.ts"/>

class Vec2 {
    public x:number;
    public y:number;
    private theta:number;

    constructor(_x:number = 0, _y:number = 0) {
        this.x = _x;
        this.y = _y;
        this.theta = 0;
    }

    set(_x:number = 0, _y:number = 0) {
        this.x = _x;
        this.y = _y;
        return this;
    }

    // setX | setY

    add(v:Vec2) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    subtract(v:Vec2) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    multiply(value:number) {
        this.x *= value;
        this.y *= value;
        return this;
    }

    divide(value:number) {
        this.x /= value;
        this.y /= value;
        return this;
    }

    toPolar() {
        var r = Math.sqrt(this.x * this.x + this.y * this.y);
        this.y = Math.atan2(this.y, this.x);
        this.x = r;
        return this;
    }

    rotate(theta:number) {
        var co:number = Math.cos(theta);
        var si:number = Math.sin(theta);
        var xx:number = co * this.x - si * this.y;
        this.y = si * this.x + co * this.y;
        this.x = xx;
        return this;
    }

    toCartesian() {
        var xx = (this.x * Math.cos(this.y));
        this.y = (this.x * Math.sin(this.y));
        this.x = xx;
        return this;
    }

    reverse() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    dot(v:Vec2) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v:Vec2) {
        return this.x * v.y - this.y * v.x;
    }

    normalize() {
        // if (l != 0)
        this.divide(this.length());
        return this;
    }

    min(x, y) {
        return new Vec2(this.x = Math.max(this.x, x), this.y = Math.max(this.y, y));
    }

    max(x, y) {
        return new Vec2(this.x = Math.min(this.x, x), this.y = Math.min(this.y, y));
    }


    jitter(jitterX:number, jitterY:number) {
        this.x += Math.random() * jitterX - jitterX * 0.5;
        this.y += Math.random() * jitterY - jitterY * 0.5;
        return this;
    }

    wander(value:number) {
        this.theta += mathUtils.getRandomBetween(-0.5, 0.5) * value;
        this.x = Math.sin(this.theta) * Math.cos(this.theta) * 0.1;
        this.y = Math.sin(this.theta) * Math.cos(this.theta) * 0.1;
        return this;
    }


    length():number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    //TODO => lerp ?!

    log() {
        console.log('x:', this.x, ' y:', this.y);
    }

    public static getAngleRAD(v:Vec2):number {
        return Math.atan2(v.y, v.x);
    }

    public static getAngleDEG(v:Vec2):number {
        return Math.atan2(v.y, v.x) * 57.296;
    }

    public static add(v1:Vec2, v2:Vec2) {
        return new Vec2(v1.x + v2.x, v1.y + v2.y);
    }

    public static subtract(v1:Vec2, v2:Vec2) {
        return new Vec2(v1.x - v2.x, v1.y - v2.y);
    }

    public static multiply(v, m) {
        return new Vec2(v.x * m, v.y * m);
    }

    public static divide(v, d) {
        return new Vec2(v.x / d, v.y / d);
    }

    public static getDistance(v1, v2) {
        var dx = v2.x - v1.x;
        var dy = v2.y - v1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public static getDistanceSquared(v1, v2) {
        var dx = v2.x - v1.x;
        var dy = v2.y - v1.y;
        return dx * dx + dy * dy;
    }

    public static getNormalPoint(p:Vec2, a:Vec2, b:Vec2):Vec2 {
        //var ap = new Vec2();
        //var ab = new Vec2();
        //var normalPoint = new Vec2();

        // PVector that points from a to p
        var ap:Vec2 = Vec2.subtract(p, a);
        // PVector that points from a to b
        var ab:Vec2 = Vec2.subtract(b, a);

        //[full] Using the dot product for scalar projection
        ab.normalize();
        ab.multiply(ap.dot(ab));
        //[end]

        // Finding the normal point along the line segment
        // var normalPoint:Vec2 = Vec2.add(a, ab)

        return Vec2.add(a, ab);
    }



}