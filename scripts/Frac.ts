/**
 * Created by michael.sturm on 06.05.2015.
 */

///<reference path="../lib/pixi/pixi.d.ts"/>
///<reference path="../lib/stats/stats.d.ts"/>

///<reference path="../scripts/Particle.ts"/>
///<reference path="../scripts/Vec2.ts"/>

declare var frac:Frac;

class Frac {

    private pRenderer;
    private pStage:PIXI.Stage;
    private pManager:PIXI.InteractionManager;
    private mousePosition:Vec2 = new Vec2();
    private gSprite:PIXI.DisplayObjectContainer;
    private graphics:PIXI.Graphics;
    private color:toxi.color.TColor;

    private vCenter:Vec2;
    private t:number = 0;
    private deltaT:number = .1;

    private SIZE:PIXI.Point = new PIXI.Point(1280, 720);

    constructor() {

        frac = this;

        var rendererOptions = {
            antialiasing: true,
            transparent: false,
            resolution: 2
        };

        this.pRenderer = PIXI.autoDetectRenderer(this.SIZE.x, this.SIZE.y, rendererOptions);

        this.pStage = new PIXI.Stage(0x232323);
        this.pStage.interactive = true;

        this.graphics = new PIXI.Graphics();
        this.graphics.pivot = new PIXI.Point(this.SIZE.x * .5, this.SIZE.y * .5);
        this.graphics.x = this.SIZE.x * .5;
        this.graphics.y = this.SIZE.y * .5;
        //this.graphics.scale = new PIXI.Point(.5, .5);

        this.gSprite = new PIXI.DisplayObjectContainer();
        this.gSprite.addChild(this.graphics);
        //this.gSprite.scale = new PIXI.Point(.5, .5);

        this.pStage.addChild(this.gSprite);

        this.pManager = new PIXI.InteractionManager(this.pStage);

        this.pRenderer.view.style.margin = "0 auto";
        this.pRenderer.view.style.paddingTop = "30px"
        this.pRenderer.view.style.width = this.SIZE.x + "px";
        this.pRenderer.view.style.height = this.SIZE.y + "px";
        this.pRenderer.view.style.display = "block";


        // add render view to DOM
        document.body.appendChild(this.pRenderer.view);


        this.color = toxi.color.TColor.newRGB(1, 1, 1);
        this.graphics.lineStyle(1, this.color.toInt(), 1);

        // r = a*phi
        this.vCenter = new Vec2(this.SIZE.x * .5, this.SIZE.y * .5);
        this.v = this.vCenter.clone();


        //this.animate();

        //this.drawCircle(this.SIZE.x * .5, this.SIZE.y * .5, 200);
        //this.cantor(this.SIZE.x * .5 - 350, 100, 700);
        this.tri(this.SIZE.x * .5, 50, 300);

    }

    /*_|TRIANGLES|_*/

    private tri(x:number, y:number, sideLength:number) {

        var h:number = .5 * Math.sqrt(3) * sideLength;
        var p1:Vec2 = new Vec2(x, y);
        var p2:Vec2 = new Vec2(x - sideLength * .5, y + h);
        var p3:Vec2 = new Vec2(x + sideLength * .5, y + h);

        var colorValue = mathUtils.convertToRange(y, [0, 500], [0, 1]);
        this.color.setHSV(colorValue, 1.0, 1.0);
        this.graphics.lineStyle(1, this.color.toInt(), 1);

        drawUtils.line(this.graphics, [p1.x, p1.y], [p2.x, p2.y]);
        drawUtils.line(this.graphics, [p2.x, p2.y], [p3.x, p3.y]);
        drawUtils.line(this.graphics, [p3.x, p3.y], [p1.x, p1.y]);

        if (sideLength > 10) {
            this.tri(p1.x, p1.y, sideLength * .5);
            this.tri(p1.x - sideLength * .25, p1.y + h * .5, sideLength * .5);
            this.tri(p1.x + sideLength * .25, p1.y + h * .5, sideLength * .5);
        } else {
            this.pRenderer.render(this.pStage);
        }


    }

    /*_|CANTOR SET|_*/

    private cantor(x:number, y:number, len:number) {
        // Stop at 1 pixel!
        if (len >= 1) {
            //line(x,y,x+len,y);
            drawUtils.line(this.graphics, [x, y], [x + len, y]);
            //this.graphics.moveTo(x, y);
            //this.graphics.lineTo(x + len, y)
            y += 20;
            this.cantor(x, y, len / 3);
            this.cantor(x + len * 2 / 3, y, len / 3);
        } else {
            this.pRenderer.render(this.pStage);
        }
    }

    /*_|RECURSIVE CIRCLES|_*/

    private drawCircle(x:number, y:number, radius:number) {

        var offsetX:number = .5;
        var offsetY:number = .5;
        var offsetRadius:number = .5;

        var colorValue = mathUtils.convertToRange(radius, [0, 200], [0, 1]);
        this.color.setHSV(1 - colorValue * .5, 1.0, 1.0);
        this.graphics.lineStyle(1, this.color.toInt(), 1);

        this.graphics.arc(x, y, radius, 0, Math.PI * 2, false);

        if (radius > 30) {
            this.drawCircle(x + radius * offsetX, y, radius * offsetRadius);
            this.drawCircle(x - radius * offsetX, y, radius * offsetRadius);
            this.drawCircle(x, y + radius * offsetY, radius * offsetRadius);
            this.drawCircle(x, y - radius * offsetY, radius * offsetRadius);
        } else {
            this.pRenderer.render(this.pStage);
        }
    }

    /*_|SPIRAL|_*/

    private v:Vec2 = new Vec2(this.SIZE.x * .5, this.SIZE.y * .5);
    private radOffset:number = 0;

    private drawSpiral() {

        this.graphics.moveTo(this.v.x, this.v.y);

        this.v.toPolar();
        this.v.y = this.t;

        // golden_spiral | http://en.wikipedia.org/wiki/Golden_spiral
        var a:number = 1.0;
        var c:number = 1.358456;
        this.v.x = a * Math.pow(c, this.v.y);

        this.v.toCartesian();
        this.v.rotate(this.radOffset);
        this.v.add(this.vCenter);

        if (this.t > Math.PI * 6) {
            this.t = 0;
            this.radOffset += Math.PI / 2.5;
        } else {
            this.graphics.lineTo(this.v.x, this.v.y);
        }

    }


    private animate() {

        requestAnimationFrame(() => this.animate());

        this.t += this.deltaT;

        this.drawSpiral();

        this.pRenderer.render(this.pStage);

    }
}