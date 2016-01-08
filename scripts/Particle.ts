/**
 * Created by michael.sturm on 13.04.2015.
 */

///<reference path="../lib/pixi/pixi.d.ts"/>
///<reference path="../lib/color/color.d.ts"/>
///<reference path="../scripts/Vec2.ts"/>
///<reference path="../scripts/Bounds.ts"/>
///<reference path="fields/FlowField.ts"/>
///<reference path="../scripts/Path.ts"/>

var Color = net.brehaut.Color;

// doesn*t work with particleContainer+
//class Particle extends PIXI.Container {

class Particle extends PIXI.Sprite {

    private SEEK_MAX_SPEED:number = 10.0;
    private SEEK_MAX_FORCE = .15;

    private vecDesired:Vec2 = new Vec2();

    private vSteer:Vec2 = new Vec2();

    public bounds:Bounds;

    private mass:number;

    private location:Vec2;
    private velocity:Vec2;
    private acceleration:Vec2;
    private wander:Vec2;
    private angle:number = 0;

    private shape:PIXI.Graphics;
    private sprite:PIXI.Sprite;
    private color:net.brehaut.Color;

    constructor() {
        super();

        this.location = new Vec2();
        this.velocity = new Vec2(0.00001, 0.00001);
        this.acceleration = new Vec2();
        this.wander = new Vec2();
        this.mass = 1;

        this.bounds = new Bounds(0, 0, 1280, 720);


        this.setLocation(Math.random() * 1280, Math.random() * 720);
        this.setMass(.1 + Math.random() * 3);

        this.color = Color("rgb(1,255,1)");
        //console.log(parseInt(this.color.toString().substring(1), 16));


        //this.texture = PIXI.Texture.fromImage('assets/arrow20p_o.png');
        //this.scale = new PIXI.Point(.4, .4);

        // ONLY WITH extend CONTAINER!!!

        //this.sprite = PIXI.Sprite.fromImage('assets/arrow20p_c.png');
        //this.sprite.anchor = new PIXI.Point(this.sprite.width * .5, this.sprite.height * .5)
        //this.sprite.scale = new PIXI.Point(.4, .4);
        //this.sprite.blendMode = PIXI.BLEND_MODES.ADD;

        //this.sprite.tint = parseInt(this.color.toString().substring(1), 16);
        //this.sprite.tint = 0xff0000;

        //this.addChild(this.sprite);



        this.shape = new PIXI.Graphics();
        this.shape.lineStyle(2, 0xFFFFFF, 1);
        this.shape.moveTo(0, 0);
        this.shape.lineTo(25, 0);
        this.shape.cacheAsBitmap = false;
        this.shape.scale.x = .5;



        this.addChild(this.shape);

    }


    public setLocation(_x:number, _y:number) {
        this.location.set(_x, _y);
    }

    public setMass(_mass:number) {
        this.mass = _mass;
    }

    //

    public seek(vTarget:Vec2) {
        this.vecDesired = Vec2.subtract(vTarget, this.location).normalize().multiply(this.SEEK_MAX_SPEED);

        this.vSteer = Vec2.subtract(this.vecDesired, this.velocity);

        // limit the magnitude of the steering force.
        this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);

        // apply the steering force
        this.applyForce(this.vSteer);
    }

    public seekArrive(vTarget:Vec2) {
        this.vecDesired = Vec2.subtract(vTarget, this.location);
        var tDistance = this.vecDesired.length();
        this.vecDesired.normalize();

        if (tDistance < 250) {
            var m = mathUtils.convertToRange(tDistance, [0, 250], [0, this.SEEK_MAX_SPEED]);
            this.vecDesired.multiply(m);
        } else {
            this.vecDesired.multiply(this.SEEK_MAX_SPEED);
        }

        this.vSteer = Vec2.subtract(this.vecDesired, this.velocity);

        // limit the magnitude of the steering force.
        this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);

        // apply the steering force
        this.applyForce(this.vSteer);

        //TODO getVector();
        // return _vecSteer;

    }

    public flee(vTarget:Vec2) {
        this.vecDesired = Vec2.subtract(vTarget, this.location);
        this.vecDesired.normalize();
        this.vecDesired.multiply(this.SEEK_MAX_SPEED);

        var force = Vec2.subtract(this.vecDesired, this.velocity);
        this.vSteer.subtract(force);

        // limit the magnitude of the steering force.
        this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);

        // apply the steering force
        this.applyForce(this.vSteer);
    }

    public respawn(locations:Array<Vec2>) {
        var vTarget:Vec2 = locations[0];
        var vSpawn:Vec2 = locations[1];

        this.vecDesired = Vec2.subtract(vTarget, this.location);
        var tDistance = this.vecDesired.length();
        this.vecDesired.normalize();

        if (tDistance < 25) {
            this.location = vSpawn.clone();
            this.velocity.jitter(250 + Math.random() * 250, 250 + Math.random() * 250);
            this.vSteer = Vec2.subtract(vSpawn, this.velocity);
            this.velocity.set(0, 0);
        } else {
            this.vecDesired.multiply(this.SEEK_MAX_SPEED);
            this.vSteer = Vec2.subtract(this.vecDesired, this.velocity);
        }


        // limit the magnitude of the steering force.
        this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);

        // apply the steering force
        this.applyForce(this.vSteer);

        //TODO getVector();
        // return _vecSteer;

    }


    private pV_predict:Vec2 = new Vec2();
    private pV_predictLoc:Vec2;
    private pV_normalPoint:Vec2;
    private pV_direction:Vec2;
    private pV_fTarget:Vec2;
    private pathForceStrength:number = 20;

    public followLine(path:Path) {

        this.pV_predict.set(this.velocity.x, this.velocity.y)
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
    }

    // This function implements Craig Reynolds' path following algorithm
    // http://www.red3d.com/cwr/steer/PathFollow.html
    followPath(path:Path) {

        // Predict location 25 (arbitrary choice) frames ahead
        this.pV_predict.set(this.velocity.x, this.velocity.y)
        this.pV_predict.normalize();
        this.pV_predict.multiply(this.pathForceStrength);

        this.pV_predictLoc = Vec2.add(this.location, this.pV_predict);

        // Now we must find the normal to the path from the predicted location
        // We look at the normal for each line segment and pick out the closest one

        var normal:Vec2;
        var target:Vec2;
        var worldRecord:number = 1000000;  // Start with a very high record distance that can easily be beaten

        // Loop through all points of the path
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
    }


    /*------------------------------------------------
     limit
     -------------------------------------------------*/
    private limitMax(v:Vec2, limitMax:number) {
        if (v.length() >= limitMax) {
            v.normalize().multiply(limitMax);
        }
    }

    private limitMin(v:Vec2, limitMin:number) {
        if (v.length() <= limitMin) {
            v.normalize().multiply(limitMin);
        }
    }


    public field(field:any) {
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

    }


    /*------------------------------------------------
     apply force (wind, gravity...)
     -------------------------------------------------*/

    private applyForce(vForce) {
        var force:Vec2 = Vec2.divide(vForce, this.mass);
        this.acceleration.add(force);
    }


    /*------------------------------------------------
     update
     -------------------------------------------------*/
    public update() {
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
        var value:number = Math.abs(this.velocity.clone().length() / 10);
        //this.alpha = value < .8 ? value : .8;

        //this.color = this.color.setSaturation(value).setLightness(.1 + value);
        //this.color = this.color.setLightness(.1 + value);

        this.shape.scale.x = value < 1 ? value : 1;
        this.color = this.color.setHue(180 + value * 210);
        this.shape.tint = parseInt(this.color.toString().substring(1), 16);

        //this.color = this.color.setSaturation(value).setLightness(.1 + value);
        //this.color = this.color.setLightness(.1 + value);
        //this.sprite.tint = parseInt(this.color.toString().substring(1), 16);

        // set acceleration to zero!
        this.acceleration.multiply(0);
    }

    private checkBorders() {

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
        } else if (this.location.x > this.bounds.x2) {
            this.location.x = this.bounds.x1;
        }
        if (this.location.y < this.bounds.y1) {
            this.location.y = this.bounds.y2;
        } else if (this.location.y > this.bounds.y2) {
            this.location.y = this.bounds.y1;
        }
    }


}

