/**
 * Created by michael.sturm on 08.05.2015.
 */

///<reference path="../scripts/Vec2.ts"/>
///<reference path="../lib/color/color.d.ts"/>
///<reference path="../scripts/utils/drawUtils.ts"/>


class Path {
    public radius:number = 20;
    public points:Array<Vec2> = [];

    private canvas:PIXI.Container;
    private graphics:PIXI.Graphics;
    private color:net.brehaut.Color;

    constructor(canvas:PIXI.Container = null) {
        if (canvas != null) {
            this.canvas = canvas;
            this.graphics = new PIXI.Graphics();
            this.canvas.addChild(this.graphics);
        }

    }

    public addPoint(x:number, y:number) {
        this.points.push(new Vec2(x, y));
    }

    public pushPoint(v) {
        this.points.push(new Vec2(v.x, v.y));
    }


    public draw() {
        this.graphics.clear();
        this.graphics.lineStyle(this.radius * 2, 0xffcc00, .1);

        for (var i = 0; i < this.points.length-1; i++) {
            drawUtils.line(this.graphics, [this.points[i].x, this.points[i].y], [this.points[i + 1].x, this.points[i + 1].y]);
        }


    }
}
