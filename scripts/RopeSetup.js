/**
 * Created by michael.sturm on 13.04.2015.
 */
///<reference path="../lib/pixi/pixi.d.ts"/>
///<reference path="../lib/gsap/greensock.d.ts"/>
///<reference path="../scripts/Vec2.ts"/>
///<reference path="../scripts/Particle.ts"/>
var that;
var RopeSetup = (function () {
    function RopeSetup() {
        this.t = 0;
        this.MAX_PARTICLES = 20;
        this.particles = [];
        this.pool = [];
        this.mousePosition = new PIXI.Point(0, 0);
        this.oldPosition = new Vec2();
        that = this;
        this.pRenderer = new PIXI.WebGLRenderer(1280, 720);
        this.pStage = new PIXI.Stage(0x235d72);
        this.pStage.interactive = true;
        this.pManager = new PIXI.InteractionManager(this.pStage);
        //this.pRenderer.view.style.width = window.innerWidth + "px";
        //this.pRenderer.view.style.height = window.innerHeight + "px";
        this.pRenderer.view.style.margin = "0 auto";
        this.pRenderer.view.style.width = 1280 + "px";
        this.pRenderer.view.style.height = 720 + "px";
        this.pRenderer.view.style.display = "block";
        // add render view to DOM
        //document.body.appendChild(this.pRenderer.view);
        this.initRope();
        this.initListener();
        this.render();
        var v1 = new Vec2(10, 10);
        var v2 = new Vec2(10, 10);
        v1.add(v2);
        v1.log();
        console.log(Vec2.getAngleRAD(v1));
    }
    RopeSetup.prototype.initListener = function () {
        this.pManager.stage.mousemove = function (mouseData) {
            var diff = new Vec2(mouseData.global.x, mouseData.global.y);
            diff.subtract(that.oldPosition);
            console.log(diff.length());
            if (diff.length() > 1) {
                that.particles.shift();
                that.particles.push(new Vec2(mouseData.global.x, mouseData.global.y));
            }
            that.oldPosition.set(mouseData.global.x, mouseData.global.y);
        };
    };
    RopeSetup.prototype.initRope = function () {
        // build a rope!
        var length = 1000 / this.MAX_PARTICLES;
        this.points = [];
        for (var i = 0; i < this.MAX_PARTICLES; i++) {
            var segSize = length;
            this.points.push(new PIXI.Point(i * length, 0));
            this.particles[i] = new Vec2(i * length, 0);
            this.pool[i] = new Vec2(i * length, 0);
        }
        this.strip = new PIXI.Rope(PIXI.Texture.fromImage("assets/rope_1000x100.png"), this.points);
        this.strip.x = -500;
        this.container = new PIXI.DisplayObjectContainer();
        this.container.position.x = window.innerWidth / 2;
        this.container.position.y = window.innerHeight / 2;
        this.container.addChild(this.strip);
        this.container.scale.set(1, 1);
        this.pStage.addChild(this.container);
    };
    RopeSetup.prototype.render = function () {
        var _this = this;
        this.t += 0.1;
        var length = 1000 / this.MAX_PARTICLES;
        for (var i = 0; i < this.MAX_PARTICLES; i++) {
            this.points[i].y = Math.sin(i * 0.5 + this.t) * 30;
            this.points[i].x = i * length + Math.cos(i * 0.3 + this.t) * 20;
        }
        //for (var i = 0; i < this.particles.length; i++) {
        //    this.points[i].x = this.particles[i].x;
        //    this.points[i].y = this.particles[i].y;
        //}
        requestAnimationFrame(function () { return _this.render(); });
        this.pRenderer.render(this.pStage);
    };
    return RopeSetup;
})();
//# sourceMappingURL=RopeSetup.js.map