/**
 * Created by michael.sturm on 13.04.2015.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../lib/pixi/pixi.d.ts"/>
///<reference path="../lib/color/color.d.ts"/>
///<reference path="../scripts/Vec2.ts"/>
///<reference path="../scripts/Bounds.ts"/>
///<reference path="fields/FlowField.ts"/>
///<reference path="../scripts/Path.ts"/>
var Color = net.brehaut.Color;
var Particle = (function (_super) {
    __extends(Particle, _super);
    function Particle() {
        _super.call(this);
        this.SEEK_MAX_SPEED = 10.0;
        this.SEEK_MAX_FORCE = .15;
        this.vecDesired = new Vec2();
        this.vSteer = new Vec2();
        this.angle = 0;
        this.pV_predict = new Vec2();
        this.pathForceStrength = 20;
        this.location = new Vec2();
        this.velocity = new Vec2(0.00001, 0.00001);
        this.acceleration = new Vec2();
        this.wander = new Vec2();
        this.mass = 1;
        this.bounds = new Bounds(0, 0, 1280, 720);
        this.setLocation(Math.random() * 1280, Math.random() * 720);
        this.setMass(.1 + Math.random() * 3);
        this.color = Color("rgb(255,1,1)");
        //console.log(parseInt(this.color.toString().substring(1), 16));
        //var graphics = new PIXI.Graphics();
        // set a fill and line style
        //graphics.beginFill(0xFF3300);
        //graphics.lineStyle(.5, 0xffd900, 1);
        // draw a shape
        //graphics.moveTo(0, 0);
        //graphics.lineTo(20, 0);
        //this.pivot = new PIXI.Point(10, 0);
        this.sprite = PIXI.Sprite.fromImage('assets/arrow20p_c.png');
        this.sprite.anchor = new PIXI.Point(this.sprite.width * .5, this.sprite.height * .5);
        this.sprite.scale = new PIXI.Point(.74, .74);
        //s.position.x = 10;
        //s.position.y = 0;
        this.sprite.blendMode = PIXI.blendModes.COLOR_DODGE;
        //this.sprite.tint = parseInt(this.color.toString().substring(1), 16);
        //this.sprite.tint = 0xff0000;
        //graphics.cacheAsBitmap = true;
        this.addChild(this.sprite);
    }
    //
    Particle.prototype.setLocation = function (_x, _y) {
        this.location.set(_x, _y);
    };
    Particle.prototype.setMass = function (_mass) {
        this.mass = _mass;
    };
    //
    Particle.prototype.seek = function (vTarget) {
        this.vecDesired = Vec2.subtract(vTarget, this.location).normalize().multiply(this.SEEK_MAX_SPEED);
        this.vSteer = Vec2.subtract(this.vecDesired, this.velocity);
        // limit the magnitude of the steering force.
        this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);
        // apply the steering force
        this.applyForce(this.vSteer);
    };
    Particle.prototype.seekArrive = function (vTarget) {
        this.vecDesired = Vec2.subtract(vTarget, this.location);
        var tDistance = this.vecDesired.length();
        this.vecDesired.normalize();
        if (tDistance < 250) {
            var m = mathUtils.convertToRange(tDistance, [0, 250], [0, this.SEEK_MAX_SPEED]);
            this.vecDesired.multiply(m);
        }
        else {
            this.vecDesired.multiply(this.SEEK_MAX_SPEED);
        }
        this.vSteer = Vec2.subtract(this.vecDesired, this.velocity);
        // limit the magnitude of the steering force.
        this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);
        // apply the steering force
        this.applyForce(this.vSteer);
        //TODO getVector();
        // return _vecSteer;
    };
    Particle.prototype.flee = function (vTarget) {
        this.vecDesired = Vec2.subtract(vTarget, this.location);
        this.vecDesired.normalize();
        this.vecDesired.multiply(this.SEEK_MAX_SPEED);
        var force = Vec2.subtract(this.vecDesired, this.velocity);
        this.vSteer.subtract(force);
        // limit the magnitude of the steering force.
        this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);
        // apply the steering force
        this.applyForce(this.vSteer);
    };
    Particle.prototype.respawn = function (locations) {
        var vTarget = locations[0];
        var vSpawn = locations[1];
        this.vecDesired = Vec2.subtract(vTarget, this.location);
        var tDistance = this.vecDesired.length();
        this.vecDesired.normalize();
        if (tDistance < 25) {
            this.location = vSpawn.clone();
            this.velocity.jitter(250 + Math.random() * 250, 250 + Math.random() * 250);
            this.vSteer = Vec2.subtract(vSpawn, this.velocity);
            this.velocity.set(0, 0);
        }
        else {
            this.vecDesired.multiply(this.SEEK_MAX_SPEED);
            this.vSteer = Vec2.subtract(this.vecDesired, this.velocity);
        }
        // limit the magnitude of the steering force.
        this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);
        // apply the steering force
        this.applyForce(this.vSteer);
        //TODO getVector();
        // return _vecSteer;
    };
    Particle.prototype.followLine = function (path) {
        this.pV_predict.set(this.velocity.x, this.velocity.y);
        this.pV_predict.normalize();
        this.pV_predict.multiply(10);
        this.pV_predictLoc = Vec2.add(this.location, this.pV_predict);
        var a = path.points[0];
        var b = path.points[1];
        this.pV_normalPoint = Vec2.getNormalPoint(this.pV_predictLoc, a, b);
        this.pV_direction = Vec2.subtract(b, a);
        this.pV_direction.normalize();
        this.pV_direction.multiply(20);
        this.pV_fTarget = Vec2.add(this.pV_normalPoint, this.pV_direction);
        var distance = Vec2.getDistance(this.pV_normalPoint, this.pV_predictLoc);
        if (distance > path.radius) {
            this.seek(this.pV_fTarget);
        }
    };
    // This function implements Craig Reynolds' path following algorithm
    // http://www.red3d.com/cwr/steer/PathFollow.html
    Particle.prototype.followPath = function (path) {
        // Predict location 25 (arbitrary choice) frames ahead
        this.pV_predict.set(this.velocity.x, this.velocity.y);
        this.pV_predict.normalize();
        this.pV_predict.multiply(this.pathForceStrength);
        this.pV_predictLoc = Vec2.add(this.location, this.pV_predict);
        // Now we must find the normal to the path from the predicted location
        // We look at the normal for each line segment and pick out the closest one
        var normal;
        var target;
        var worldRecord = 1000000; // Start with a very high record distance that can easily be beaten
        for (var i = 0; i < path.points.length - 1; i++) {
            // Look at a line segment
            var a = path.points[i];
            var b = path.points[i + 1];
            // Get the normal point to that line
            this.pV_normalPoint = Vec2.getNormalPoint(this.pV_predictLoc, a, b);
            // This only works because we know our path goes from left to right
            // We could have a more sophisticated test to tell if the point is in the line segment or not
            if (this.pV_normalPoint.x < a.x || this.pV_normalPoint.x > b.x) {
                // This is something of a hacky solution, but if it's not within the line segment
                // consider the normal to just be the end of the line segment (point b)
                this.pV_normalPoint = b.clone();
            }
            // How far away are we from the path?
            var distance = Vec2.getDistance(this.pV_predictLoc, this.pV_normalPoint);
            // Did we beat the record and find the closest line segment?
            if (distance < worldRecord) {
                worldRecord = distance;
                // If so the target we want to steer towards is the normal
                normal = this.pV_normalPoint;
                // Look at the direction of the line segment so we can seek a little bit ahead of the normal
                var dir = Vec2.subtract(b, a);
                dir.normalize();
                // This is an oversimplification
                // Should be based on distance to path & velocity
                dir.multiply(10);
                target = this.pV_normalPoint.clone();
                target.add(dir);
            }
        }
        // Only if the distance is greater than the path's radius do we bother to steer
        if (worldRecord > path.radius) {
            this.seek(target);
        }
    };
    /*------------------------------------------------
     limit
     -------------------------------------------------*/
    Particle.prototype.limitMax = function (v, limitMax) {
        if (v.length() >= limitMax) {
            v.normalize().multiply(limitMax);
        }
    };
    Particle.prototype.limitMin = function (v, limitMin) {
        if (v.length() <= limitMin) {
            v.normalize().multiply(limitMin);
        }
    };
    Particle.prototype.field = function (field) {
        //flowField.lookup(this.location);
        this.vecDesired = field.lookup(this.location);
        // vecDesired.normalize();
        // vecDesired.multiply(_seek_maxSpeed);
        this.vSteer = Vec2.subtract(this.vecDesired, this.velocity);
        // limit the magnitude of the steering force.
        this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);
        // apply the steering force
        this.applyForce(this.vSteer);
        //TODO getVector();
        // return _vecSteer;
    };
    /*------------------------------------------------
     apply force (wind, gravity...)
     -------------------------------------------------*/
    Particle.prototype.applyForce = function (vForce) {
        var force = Vec2.divide(vForce, this.mass);
        this.acceleration.add(force);
    };
    /*------------------------------------------------
     update
     -------------------------------------------------*/
    Particle.prototype.update = function () {
        this.checkBorders();
        //this.wander.jitter(.1, .1);
        this.velocity.add(this.wander);
        this.velocity.add(this.acceleration);
        // limit velocity
        this.limitMin(this.velocity, 1);
        this.limitMax(this.velocity, 14);
        this.location.add(this.velocity);
        this.angle = Vec2.getAngleRAD(this.velocity);
        this.rotation = this.angle;
        this.position.x = this.location.x;
        this.position.y = this.location.y;
        // colorize
        var value = Math.abs(this.velocity.clone().length() / 10);
        this.color = this.color.setSaturation(value).setLightness(.1 + value);
        //this.color = this.color.setLightness(.1 + value);
        this.sprite.tint = parseInt(this.color.toString().substring(1), 16);
        // set acceleration to zero!
        this.acceleration.multiply(0);
    };
    Particle.prototype.checkBorders = function () {
        /*===walls===*/
        //if (this.location.x > this.bounds.x2 - 100) {
        //    this.vecDesired.set(-1 * this.SEEK_MAX_SPEED, this.velocity.y);
        //    this.vSteer = Vec2.subtract(this.vecDesired, this.velocity);
        //    this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);
        //    this.applyForce(this.vSteer);
        //}
        //
        //if (this.location.x < this.bounds.x1 + 100) {
        //    this.vecDesired.set(this.SEEK_MAX_SPEED, this.velocity.y);
        //    this.vSteer = Vec2.subtract(this.vecDesired, this.velocity);
        //    this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);
        //    this.applyForce(this.vSteer);
        //}
        //
        //if (this.location.y > this.bounds.y2 - 100) {
        //    this.vecDesired.set(this.velocity.x, -1 * this.SEEK_MAX_SPEED);
        //    this.vSteer = Vec2.subtract(this.vecDesired, this.velocity);
        //    this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);
        //    this.applyForce(this.vSteer);
        //}
        //
        //if (this.location.y < this.bounds.y1 + 100) {
        //    this.vecDesired.set(this.velocity.x, this.SEEK_MAX_SPEED);
        //    this.vSteer = Vec2.subtract(this.vecDesired, this.velocity);
        //    this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);
        //    this.applyForce(this.vSteer);
        //}
        /*===bounce===*/
        //if (this.location.x < this.bounds.x1) {
        //    this.location.x = this.bounds.x1;
        //    this.velocity.x *= -1;
        //} else if (this.location.x > this.bounds.x2) {
        //    this.location.x = this.bounds.x2;
        //    this.velocity.x *= -1;
        //}
        //if (this.location.y < this.bounds.y1) {
        //    this.location.y = this.bounds.y1;
        //    this.velocity.y *= -1;
        //} else if (this.location.y > this.bounds.y2) {
        //    this.location.y = this.bounds.y2;
        //    this.velocity.y *= -1;
        //    this.velocity.multiply(0.5);
        //}
        /*===wrap===*/
        if (this.location.x < this.bounds.x1) {
            this.location.x = this.bounds.x2;
        }
        else if (this.location.x > this.bounds.x2) {
            this.location.x = this.bounds.x1;
        }
        if (this.location.y < this.bounds.y1) {
            this.location.y = this.bounds.y2;
        }
        else if (this.location.y > this.bounds.y2) {
            this.location.y = this.bounds.y1;
        }
    };
    return Particle;
})(PIXI.DisplayObjectContainer);
//# sourceMappingURL=Particle.js.map